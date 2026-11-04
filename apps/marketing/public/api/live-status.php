<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$file = '/var/lib/myface/live-status.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (!is_file($file)) { echo json_encode(['live' => false]); exit; }
  $raw = file_get_contents($file);
  echo $raw !== false && $raw !== '' ? $raw : json_encode(['live' => false]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = file_get_contents('php://input');
  $data = json_decode($body ?: '[]', true);
  if (!is_array($data)) { http_response_code(400); echo json_encode(['error' => 'bad json']); exit; }
  $live = !empty($data['live']);
  if (!$live) {
    @unlink($file);
    // End live → clear multi-guest roster + guest frames/audio + chat
    @unlink('/var/lib/myface/live-guests.json');
    @unlink('/var/lib/myface/live-chat.json');
    foreach (array('g1', 'g2', 'g3') as $s) {
      @unlink('/var/lib/myface/live-frame-' . $s . '.jpg');
      @unlink('/var/lib/myface/live-frame-' . $s . '.json');
      @unlink('/var/lib/myface/live-audio-' . $s . '.bin');
      @unlink('/var/lib/myface/live-audio-' . $s . '.json');
    }
    echo json_encode(['live' => false, 'ok' => true]);
    exit;
  }
  $payload = array(
    'live' => true,
    'title' => isset($data['title']) ? (string)$data['title'] : 'Video Live · OL1',
    'viewers' => isset($data['viewers']) ? (int)$data['viewers'] : 12,
    'startedAt' => isset($data['startedAt']) ? (string)$data['startedAt'] : gmdate('c'),
    'mode' => (isset($data['mode']) && $data['mode'] === 'audio') ? 'audio' : 'video',
    'makerId' => isset($data['makerId']) ? (string)$data['makerId'] : 'ayo',
    'updatedAt' => gmdate('c'),
    'hasAudio' => !empty($data['hasAudio']),
  );
  // YouTube as primary live video (embed id synced to viewers)
  if (!empty($data['youtubeId']) && preg_match('/^[a-zA-Z0-9_-]{11}$/', (string)$data['youtubeId'])) {
    $payload['youtubeId'] = (string)$data['youtubeId'];
    // Ordered playlist — next video autoplays when one ends (+ optional captions)
    $plist = array();
    $pcaptions = array();
    if (isset($data['youtubePlaylist']) && is_array($data['youtubePlaylist'])) {
      foreach ($data['youtubePlaylist'] as $row) {
        if (!is_array($row)) continue;
        $s = isset($row['id']) ? (string)$row['id'] : '';
        if (!preg_match('/^[a-zA-Z0-9_-]{11}$/', $s) || in_array($s, $plist, true)) continue;
        $plist[] = $s;
        $cap = isset($row['caption']) ? substr(trim((string)$row['caption']), 0, 160) : '';
        if ($cap !== '') $pcaptions[$s] = $cap;
        if (count($plist) >= 25) break;
      }
    }
    if (isset($data['youtubePlaylistIds']) && is_array($data['youtubePlaylistIds'])) {
      foreach ($data['youtubePlaylistIds'] as $vid) {
        $s = (string)$vid;
        if (preg_match('/^[a-zA-Z0-9_-]{11}$/', $s) && !in_array($s, $plist, true)) {
          $plist[] = $s;
        }
        if (count($plist) >= 25) break;
      }
    }
    if (!in_array($payload['youtubeId'], $plist, true)) {
      array_unshift($plist, $payload['youtubeId']);
    }
    if (count($plist) > 1) {
      $payload['youtubePlaylistIds'] = $plist;
    }
    $pitems = array();
    foreach ($plist as $pid) {
      $item = array('id' => $pid);
      if (!empty($pcaptions[$pid])) $item['caption'] = $pcaptions[$pid];
      else $item['caption'] = '';
      $pitems[] = $item;
    }
    $hasCaption = false;
    foreach ($pitems as $it) {
      if (!empty($it['caption'])) { $hasCaption = true; break; }
    }
    if (count($pitems) > 1 || $hasCaption) {
      $payload['youtubePlaylist'] = $pitems;
    }
    // Planned session length — client loops clip/playlist when shorter than this
    if (isset($data['youtubeDurationSec'])) {
      $dur = (int)$data['youtubeDurationSec'];
      if ($dur >= 60 && $dur <= 28800) {
        $payload['youtubeDurationSec'] = $dur;
      }
    }
  }
  // Audience: contacts-only vs public For You
  $visibility = (isset($data['visibility']) && $data['visibility'] === 'public') ? 'public' : 'contacts';
  $payload['visibility'] = $visibility;
  $payload['publicFeed'] = !empty($data['publicFeed']) || $visibility === 'public';
  $ids = array();
  if (isset($data['allowedContactIds']) && is_array($data['allowedContactIds'])) {
    foreach ($data['allowedContactIds'] as $cid) {
      $s = substr(preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$cid), 0, 64);
      if ($s !== '') $ids[] = $s;
      if (count($ids) >= 40) break;
    }
  }
  $payload['allowedContactIds'] = $ids;
  // Sync live BGM so phones can play the same track (YouTube / Jamendo URL)
  if (isset($data['music']) && is_array($data['music'])) {
    $m = $data['music'];
    $music = array();
    if (!empty($m['title'])) $music['title'] = substr((string)$m['title'], 0, 120);
    if (!empty($m['artist'])) $music['artist'] = substr((string)$m['artist'], 0, 120);
    if (!empty($m['source'])) $music['source'] = substr((string)$m['source'], 0, 40);
    if (!empty($m['youtubeId'])) $music['youtubeId'] = substr((string)$m['youtubeId'], 0, 32);
    if (!empty($m['jamendoId'])) $music['jamendoId'] = substr((string)$m['jamendoId'], 0, 32);
    if (!empty($m['previewUrl']) && preg_match('#^https?://#i', (string)$m['previewUrl'])) {
      $music['previewUrl'] = substr((string)$m['previewUrl'], 0, 500);
    }
    if (!empty($music)) $payload['music'] = $music;
  } elseif (array_key_exists('music', $data) && ($data['music'] === null || $data['music'] === false)) {
    // explicit clear
  }
  if (!is_dir('/var/lib/myface')) { @mkdir('/var/lib/myface', 0775, true); }
  file_put_contents($file, json_encode($payload), LOCK_EX);
  echo json_encode($payload);
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'method']);
