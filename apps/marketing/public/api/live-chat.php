<?php
/**
 * Shared live session chat (host + viewers).
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$dir = '/var/lib/myface';
$file = $dir . '/live-chat.json';
$MAX = 50;

function empty_chat() {
  return array('updatedAt' => gmdate('c'), 'messages' => array());
}

function load_chat($file) {
  if (!is_file($file)) return empty_chat();
  $raw = file_get_contents($file);
  $data = json_decode($raw !== false ? $raw : '', true);
  if (!is_array($data) || !isset($data['messages']) || !is_array($data['messages'])) return empty_chat();
  return $data;
}

function save_chat($file, $dir, $data) {
  if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
  $data['updatedAt'] = gmdate('c');
  file_put_contents($file, json_encode($data), LOCK_EX);
  return $data;
}

function sanitize_who($w) {
  $w = trim(preg_replace('/\s+/', ' ', (string)$w));
  if ($w === '') $w = 'Guest';
  return substr($w, 0, 32);
}

function sanitize_text($t) {
  // Keep emoji / unicode; only collapse whitespace
  $t = trim(preg_replace('/\s+/u', ' ', (string)$t));
  if (function_exists('mb_substr')) return mb_substr($t, 0, 240);
  return substr($t, 0, 240);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  echo json_encode(load_chat($file));
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = file_get_contents('php://input');
  $data = json_decode($body ?: '[]', true);
  if (!is_array($data)) { http_response_code(400); echo json_encode(['error' => 'bad json']); exit; }

  $action = isset($data['action']) ? (string)$data['action'] : 'send';
  if ($action === 'clear' || $action === 'reset') {
    @unlink($file);
    echo json_encode(empty_chat());
    exit;
  }

  $text = sanitize_text(isset($data['text']) ? $data['text'] : '');
  if ($text === '') { http_response_code(400); echo json_encode(['error' => 'text']); exit; }

  $chat = load_chat($file);
  $msg = array(
    'id' => isset($data['id']) ? substr(preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$data['id']), 0, 48) : ('m' . (string) round(microtime(true) * 1000)),
    'who' => sanitize_who(isset($data['who']) ? $data['who'] : 'Guest'),
    'text' => $text,
    'ts' => (int) round(microtime(true) * 1000),
  );
  if ($msg['id'] === '') $msg['id'] = 'm' . (string) $msg['ts'];

  // Dedupe identical id
  foreach ($chat['messages'] as $m) {
    if (($m['id'] ?? '') === $msg['id']) {
      echo json_encode($chat);
      exit;
    }
  }

  $chat['messages'][] = $msg;
  if (count($chat['messages']) > $MAX) {
    $chat['messages'] = array_slice($chat['messages'], -$MAX);
  }
  save_chat($file, $dir, $chat);
  echo json_encode($chat);
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'method']);
