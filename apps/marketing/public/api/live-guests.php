<?php
/**
 * Multi-guest live (TikTok-style): join requests, approve/deny, active slots.
 * Slots: g1, g2, g3 (host is separate via live-frame).
 *
 * Important: GET must not blindly rewrite the file — that raced with POST request
 * and wiped pending joins after ~1s.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$dir = '/var/lib/myface';
$file = $dir . '/live-guests.json';
$MAX_GUESTS = 3;
$SLOTS = array('g1', 'g2', 'g3');
$GUEST_STALE_MS = 45000;   // active guest heartbeat window
$PENDING_TTL_MS = 300000;  // pending join request lives 5 minutes

function empty_state() {
  return array(
    'updatedAt' => gmdate('c'),
    'pending' => array(),
    'guests' => array(),
  );
}

function now_ms() {
  return (int) round(microtime(true) * 1000);
}

function clear_slot_frame($slot) {
  global $dir;
  $slot = preg_replace('/[^a-z0-9]/', '', strtolower($slot));
  if ($slot === '' || $slot === 'host') return;
  @unlink($dir . '/live-frame-' . $slot . '.jpg');
  @unlink($dir . '/live-frame-' . $slot . '.json');
  @unlink($dir . '/live-audio-' . $slot . '.bin');
  @unlink($dir . '/live-audio-' . $slot . '.json');
}

function clear_all_guest_frames() {
  global $SLOTS;
  foreach ($SLOTS as $s) clear_slot_frame($s);
}

function find_free_slot($guests, $slots) {
  $used = array();
  foreach ($guests as $g) {
    if (!empty($g['slot'])) $used[(string)$g['slot']] = true;
  }
  foreach ($slots as $s) {
    if (empty($used[$s])) return $s;
  }
  return null;
}

function sanitize_name($n) {
  $n = trim(preg_replace('/\s+/u', ' ', (string)$n));
  if ($n === '') $n = 'Guest';
  if (function_exists('mb_substr')) return mb_substr($n, 0, 40);
  return substr($n, 0, 40);
}

function sanitize_id($id) {
  $id = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$id);
  return substr($id, 0, 48);
}

function normalize_state($data) {
  if (!is_array($data)) return empty_state();
  if (!isset($data['pending']) || !is_array($data['pending'])) $data['pending'] = array();
  if (!isset($data['guests']) || !is_array($data['guests'])) $data['guests'] = array();
  return $data;
}

/**
 * @return array{0: array, 1: bool} [state, changed]
 */
function prune_stale($state, $guestStaleMs, $pendingTtlMs) {
  $now = now_ms();
  $changed = false;
  $pending = array();
  foreach ($state['pending'] as $p) {
    if (!is_array($p) || empty($p['id'])) {
      $changed = true;
      continue;
    }
    $ts = isset($p['ts']) ? (int)$p['ts'] : 0;
    if ($ts > 0 && ($now - $ts) > $pendingTtlMs) {
      $changed = true;
      continue;
    }
    $pending[] = $p;
  }
  $guests = array();
  foreach ($state['guests'] as $g) {
    if (!is_array($g) || empty($g['id'])) {
      $changed = true;
      continue;
    }
    $hb = isset($g['heartbeat']) ? (int)$g['heartbeat'] : 0;
    // If never heartbeated, use joinedAt / keep briefly
    if ($hb > 0 && ($now - $hb) > $guestStaleMs) {
      clear_slot_frame(isset($g['slot']) ? (string)$g['slot'] : '');
      $changed = true;
      continue;
    }
    $guests[] = $g;
  }
  if (count($pending) !== count($state['pending']) || count($guests) !== count($state['guests'])) {
    $changed = true;
  }
  $state['pending'] = array_values($pending);
  $state['guests'] = array_values($guests);
  return array($state, $changed);
}

/**
 * Open guests file with exclusive lock for read-modify-write.
 * @return array{0: resource|null, 1: array} [fh, state]
 */
function locked_load($file, $dir) {
  if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
  $fh = fopen($file, 'c+');
  if ($fh === false) {
    return array(null, empty_state());
  }
  flock($fh, LOCK_EX);
  rewind($fh);
  $raw = stream_get_contents($fh);
  $data = ($raw !== false && $raw !== '') ? json_decode($raw, true) : null;
  return array($fh, normalize_state($data));
}

function locked_save($fh, $state) {
  if (!$fh) return $state;
  $state['updatedAt'] = gmdate('c');
  $json = json_encode($state);
  ftruncate($fh, 0);
  rewind($fh);
  fwrite($fh, $json !== false ? $json : '{"pending":[],"guests":[]}');
  fflush($fh);
  flock($fh, LOCK_UN);
  fclose($fh);
  return $state;
}

function locked_release($fh) {
  if (!$fh) return;
  flock($fh, LOCK_UN);
  fclose($fh);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  global $GUEST_STALE_MS, $PENDING_TTL_MS, $file, $dir;
  list($fh, $state) = locked_load($file, $dir);
  list($state, $changed) = prune_stale($state, $GUEST_STALE_MS, $PENDING_TTL_MS);
  if ($changed) {
    locked_save($fh, $state);
  } else {
    locked_release($fh);
  }
  echo json_encode($state);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  global $GUEST_STALE_MS, $PENDING_TTL_MS, $MAX_GUESTS, $SLOTS, $file, $dir;
  $body = file_get_contents('php://input');
  $data = json_decode($body ?: '[]', true);
  if (!is_array($data)) { http_response_code(400); echo json_encode(['error' => 'bad json']); exit; }

  $action = isset($data['action']) ? (string)$data['action'] : '';
  list($fh, $state) = locked_load($file, $dir);
  list($state, $_changed) = prune_stale($state, $GUEST_STALE_MS, $PENDING_TTL_MS);

  if ($action === 'clear' || $action === 'reset') {
    clear_all_guest_frames();
    $state = empty_state();
    locked_save($fh, $state);
    echo json_encode($state);
    exit;
  }

  if ($action === 'request') {
    $id = sanitize_id(isset($data['id']) ? $data['id'] : '');
    if ($id === '') {
      locked_release($fh);
      http_response_code(400);
      echo json_encode(['error' => 'id']);
      exit;
    }
    $name = sanitize_name(isset($data['name']) ? $data['name'] : 'Guest');
    $avatar = substr(isset($data['avatar']) ? (string)$data['avatar'] : 'G', 0, 4);

    foreach ($state['guests'] as $g) {
      if (($g['id'] ?? '') === $id) {
        locked_save($fh, $state);
        echo json_encode($state);
        exit;
      }
    }

    $found = false;
    foreach ($state['pending'] as &$p) {
      if (($p['id'] ?? '') === $id) {
        $p['name'] = $name;
        $p['avatar'] = $avatar;
        $p['ts'] = now_ms(); // refresh TTL
        $found = true;
        break;
      }
    }
    unset($p);

    if (!$found) {
      if (count($state['guests']) >= $MAX_GUESTS) {
        locked_save($fh, $state);
        http_response_code(409);
        echo json_encode(['error' => 'full', 'pending' => $state['pending'], 'guests' => $state['guests'], 'updatedAt' => $state['updatedAt']]);
        exit;
      }
      $state['pending'][] = array(
        'id' => $id,
        'name' => $name,
        'avatar' => $avatar,
        'ts' => now_ms(),
      );
    }
    locked_save($fh, $state);
    echo json_encode($state);
    exit;
  }

  if ($action === 'cancel') {
    $id = sanitize_id(isset($data['id']) ? $data['id'] : '');
    $state['pending'] = array_values(array_filter($state['pending'], function ($p) use ($id) {
      return ($p['id'] ?? '') !== $id;
    }));
    locked_save($fh, $state);
    echo json_encode($state);
    exit;
  }

  if ($action === 'approve') {
    $id = sanitize_id(isset($data['id']) ? $data['id'] : '');
    if ($id === '') {
      locked_release($fh);
      http_response_code(400);
      echo json_encode(['error' => 'id']);
      exit;
    }
    if (count($state['guests']) >= $MAX_GUESTS) {
      locked_save($fh, $state);
      http_response_code(409);
      echo json_encode(['error' => 'full', 'pending' => $state['pending'], 'guests' => $state['guests'], 'updatedAt' => $state['updatedAt']]);
      exit;
    }
    $req = null;
    $rest = array();
    foreach ($state['pending'] as $p) {
      if (($p['id'] ?? '') === $id) $req = $p;
      else $rest[] = $p;
    }
    if (!$req) {
      $req = array(
        'id' => $id,
        'name' => sanitize_name(isset($data['name']) ? $data['name'] : 'Guest'),
        'avatar' => substr(isset($data['avatar']) ? (string)$data['avatar'] : 'G', 0, 4),
      );
    }
    foreach ($state['guests'] as $g) {
      if (($g['id'] ?? '') === $id) {
        $state['pending'] = $rest;
        locked_save($fh, $state);
        echo json_encode($state);
        exit;
      }
    }
    $slot = find_free_slot($state['guests'], $SLOTS);
    if (!$slot) {
      locked_save($fh, $state);
      http_response_code(409);
      echo json_encode(['error' => 'full', 'pending' => $state['pending'], 'guests' => $state['guests'], 'updatedAt' => $state['updatedAt']]);
      exit;
    }
    $state['pending'] = $rest;
    $state['guests'][] = array(
      'id' => $id,
      'name' => sanitize_name($req['name'] ?? 'Guest'),
      'avatar' => substr((string)($req['avatar'] ?? 'G'), 0, 4),
      'slot' => $slot,
      'joinedAt' => gmdate('c'),
      'heartbeat' => now_ms(),
    );
    locked_save($fh, $state);
    echo json_encode($state);
    exit;
  }

  if ($action === 'deny') {
    $id = sanitize_id(isset($data['id']) ? $data['id'] : '');
    $state['pending'] = array_values(array_filter($state['pending'], function ($p) use ($id) {
      return ($p['id'] ?? '') !== $id;
    }));
    locked_save($fh, $state);
    echo json_encode($state);
    exit;
  }

  if ($action === 'leave' || $action === 'kick') {
    $id = sanitize_id(isset($data['id']) ? $data['id'] : '');
    $kept = array();
    foreach ($state['guests'] as $g) {
      if (($g['id'] ?? '') === $id) {
        clear_slot_frame(isset($g['slot']) ? (string)$g['slot'] : '');
        continue;
      }
      $kept[] = $g;
    }
    $state['guests'] = $kept;
    $state['pending'] = array_values(array_filter($state['pending'], function ($p) use ($id) {
      return ($p['id'] ?? '') !== $id;
    }));
    locked_save($fh, $state);
    echo json_encode($state);
    exit;
  }

  if ($action === 'heartbeat') {
    $id = sanitize_id(isset($data['id']) ? $data['id'] : '');
    $found = false;
    foreach ($state['guests'] as &$g) {
      if (($g['id'] ?? '') === $id) {
        $g['heartbeat'] = now_ms();
        if (!empty($data['name'])) $g['name'] = sanitize_name($data['name']);
        $found = true;
        break;
      }
    }
    unset($g);
    if (!$found) {
      // Also refresh pending TTL if still waiting (keeps request alive)
      foreach ($state['pending'] as &$p) {
        if (($p['id'] ?? '') === $id) {
          $p['ts'] = now_ms();
          if (!empty($data['name'])) $p['name'] = sanitize_name($data['name']);
          $found = true;
          break;
        }
      }
      unset($p);
    }
    if (!$found) {
      locked_save($fh, $state);
      http_response_code(404);
      echo json_encode(['error' => 'not-guest', 'pending' => $state['pending'], 'guests' => $state['guests'], 'updatedAt' => $state['updatedAt']]);
      exit;
    }
    locked_save($fh, $state);
    echo json_encode($state);
    exit;
  }

  locked_release($fh);
  http_response_code(400);
  echo json_encode(['error' => 'action', 'allowed' => ['request','cancel','approve','deny','leave','kick','heartbeat','clear']]);
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'method']);
