<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Live-Seq, X-Live-Mime');
header('Cache-Control: no-store, no-cache, must-revalidate');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$dir = '/var/lib/myface';
if (!is_dir($dir)) { @mkdir($dir, 0775, true); }

$rawSlot = isset($_GET['slot']) ? (string)$_GET['slot'] : 'host';
$slot = preg_replace('/[^a-z0-9]/', '', strtolower($rawSlot));
if ($slot === '' || $slot === 'host') {
  $file = $dir . '/live-audio.bin';
  $meta = $dir . '/live-audio.json';
  $slotKey = 'host';
} else {
  $file = $dir . '/live-audio-' . $slot . '.bin';
  $meta = $dir . '/live-audio-' . $slot . '.json';
  $slotKey = $slot;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'DELETE' || ($method === 'POST' && isset($_GET['clear']))) {
  @unlink($file);
  @unlink($meta);
  // Host clear also wipes guest audio
  if ($slotKey === 'host' && !isset($_GET['slot'])) {
    foreach (array('g1', 'g2', 'g3') as $s) {
      @unlink($dir . '/live-audio-' . $s . '.bin');
      @unlink($dir . '/live-audio-' . $s . '.json');
    }
  }
  header('Content-Type: application/json');
  echo json_encode(['ok' => true, 'cleared' => true, 'slot' => $slotKey]);
  exit;
}

if ($method === 'POST') {
  $raw = file_get_contents('php://input');
  if ($raw === false || strlen($raw) < 32) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'empty']);
    exit;
  }
  // Cap ~2.5MB — 48 kHz WAV chunks
  if (strlen($raw) > 2500000) {
    http_response_code(413);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'too large']);
    exit;
  }
  $seq = isset($_SERVER['HTTP_X_LIVE_SEQ']) ? (int)$_SERVER['HTTP_X_LIVE_SEQ'] : (int) round(microtime(true) * 1000);
  $mime = isset($_SERVER['HTTP_X_LIVE_MIME']) ? (string)$_SERVER['HTTP_X_LIVE_MIME'] : 'audio/wav';
  if ($mime === '' || strlen($mime) > 80) $mime = 'audio/wav';
  file_put_contents($file, $raw, LOCK_EX);
  file_put_contents($meta, json_encode([
    'bytes' => strlen($raw),
    'seq' => $seq,
    'mime' => $mime,
    'updatedAt' => gmdate('c'),
    'ts' => (int) round(microtime(true) * 1000),
    'slot' => $slotKey,
  ]), LOCK_EX);
  header('Content-Type: application/json');
  echo json_encode(['ok' => true, 'bytes' => strlen($raw), 'seq' => $seq, 'slot' => $slotKey]);
  exit;
}

if ($method === 'GET') {
  if (isset($_GET['meta'])) {
    header('Content-Type: application/json');
    if (!is_file($meta)) { echo json_encode(['live' => false, 'slot' => $slotKey]); exit; }
    $m = json_decode((string) file_get_contents($meta), true);
    $age = isset($m['ts']) ? ((int) round(microtime(true) * 1000) - (int) $m['ts']) : 999999;
    echo json_encode([
      'live' => is_file($file) && $age < 4000,
      'ageMs' => $age,
      'seq' => $m['seq'] ?? null,
      'mime' => $m['mime'] ?? 'audio/wav',
      'bytes' => $m['bytes'] ?? null,
      'updatedAt' => $m['updatedAt'] ?? null,
      'slot' => $slotKey,
    ]);
    exit;
  }

  if (!is_file($file) || !is_file($meta)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'no audio', 'slot' => $slotKey]);
    exit;
  }
  $m = json_decode((string) file_get_contents($meta), true);
  $age = isset($m['ts']) ? ((int) round(microtime(true) * 1000) - (int) $m['ts']) : 0;
  if ($age > 5000) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'stale', 'ageMs' => $age, 'slot' => $slotKey]);
    exit;
  }
  $mime = isset($m['mime']) ? (string)$m['mime'] : 'audio/wav';
  header('Content-Type: ' . $mime);
  header('X-Live-Seq: ' . (isset($m['seq']) ? (string)$m['seq'] : '0'));
  header('Content-Length: ' . filesize($file));
  readfile($file);
  exit;
}

http_response_code(405);
header('Content-Type: application/json');
echo json_encode(['error' => 'method']);
