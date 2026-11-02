<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-store, no-cache, must-revalidate');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$dir = '/var/lib/myface';
if (!is_dir($dir)) { @mkdir($dir, 0775, true); }

$rawSlot = isset($_GET['slot']) ? (string)$_GET['slot'] : 'host';
$slot = preg_replace('/[^a-z0-9]/', '', strtolower($rawSlot));
if ($slot === '' || $slot === 'host') {
  $file = $dir . '/live-frame.jpg';
  $meta = $dir . '/live-frame.json';
} else {
  // Guest slots: g1, g2, g3
  $file = $dir . '/live-frame-' . $slot . '.jpg';
  $meta = $dir . '/live-frame-' . $slot . '.json';
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'DELETE' || ($method === 'POST' && isset($_GET['clear']))) {
  @unlink($file);
  @unlink($meta);
  // Host clear also wipes guest frames
  if ($slot === '' || $slot === 'host' || !isset($_GET['slot'])) {
    foreach (array('g1', 'g2', 'g3') as $s) {
      @unlink($dir . '/live-frame-' . $s . '.jpg');
      @unlink($dir . '/live-frame-' . $s . '.json');
    }
  }
  header('Content-Type: application/json');
  echo json_encode(['ok' => true, 'cleared' => true, 'slot' => $slot === '' ? 'host' : $slot]);
  exit;
}

if ($method === 'POST') {
  $raw = file_get_contents('php://input');
  if ($raw === false || strlen($raw) < 100) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'empty']);
    exit;
  }
  // Accept raw JPEG or data URL
  if (strncmp($raw, 'data:image', 10) === 0) {
    $parts = explode(',', $raw, 2);
    $raw = base64_decode($parts[1] ?? '');
  }
  if ($raw === false || strlen($raw) < 100) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'bad image']);
    exit;
  }
  // Cap ~2MB for sharper JPEG frames (960–1080 wide @ q0.85)
  if (strlen($raw) > 2000000) {
    http_response_code(413);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'too large']);
    exit;
  }
  file_put_contents($file, $raw, LOCK_EX);
  file_put_contents($meta, json_encode([
    'bytes' => strlen($raw),
    'updatedAt' => gmdate('c'),
    'ts' => (int) round(microtime(true) * 1000),
    'slot' => $slot === '' ? 'host' : $slot,
  ]), LOCK_EX);
  header('Content-Type: application/json');
  echo json_encode(['ok' => true, 'bytes' => strlen($raw), 'slot' => $slot === '' ? 'host' : $slot]);
  exit;
}

if ($method === 'GET') {
  // ?meta=1 → JSON; default → JPEG
  if (isset($_GET['meta'])) {
    header('Content-Type: application/json');
    if (!is_file($meta)) { echo json_encode(['live' => false, 'slot' => $slot === '' ? 'host' : $slot]); exit; }
    $m = json_decode((string) file_get_contents($meta), true);
    $age = isset($m['ts']) ? ((int) round(microtime(true) * 1000) - (int) $m['ts']) : 999999;
    echo json_encode([
      'live' => is_file($file) && $age < 15000,
      'ageMs' => $age,
      'updatedAt' => $m['updatedAt'] ?? null,
      'ts' => $m['ts'] ?? null,
      'slot' => $slot === '' ? 'host' : $slot,
    ]);
    exit;
  }

  if (!is_file($file)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'no frame', 'slot' => $slot === '' ? 'host' : $slot]);
    exit;
  }
  $m = is_file($meta) ? json_decode((string) file_get_contents($meta), true) : null;
  $age = isset($m['ts']) ? ((int) round(microtime(true) * 1000) - (int) $m['ts']) : 0;
  if ($age > 20000) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'stale', 'ageMs' => $age, 'slot' => $slot === '' ? 'host' : $slot]);
    exit;
  }
  header('Content-Type: image/jpeg');
  header('Content-Length: ' . filesize($file));
  readfile($file);
  exit;
}

http_response_code(405);
header('Content-Type: application/json');
echo json_encode(['error' => 'method']);
