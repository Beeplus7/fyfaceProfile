import { getSharedLiveStream } from './liveCameraBus';
import { pickRecorderMime } from './liveRecordingMedia';

let recorder: MediaRecorder | null = null;
let chunks: Blob[] = [];
let startedAt = 0;
let mimeType = 'video/webm';
let pendingBlob: Blob | null = null;

export function isSessionRecording() {
  return Boolean(recorder && recorder.state !== 'inactive');
}

export function takePendingRecordingBlob() {
  const b = pendingBlob;
  pendingBlob = null;
  return b;
}

export function peekPendingRecordingBlob() {
  return pendingBlob;
}

/** Start recording the shared live stream (or a fresh mic for audio-only). */
export async function startSessionRecording(opts: { mode: 'video' | 'audio' }): Promise<boolean> {
  stopSessionRecordingSync();
  pendingBlob = null;
  chunks = [];

  let stream = getSharedLiveStream();
  if (opts.mode === 'audio') {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch {
      return false;
    }
  } else if (!stream || !stream.getVideoTracks().some((t) => t.readyState === 'live')) {
    return false;
  }

  mimeType = pickRecorderMime(opts.mode === 'video');
  try {
    recorder = new MediaRecorder(stream!, mimeType ? { mimeType } : undefined);
  } catch {
    try {
      recorder = new MediaRecorder(stream!);
      mimeType = recorder.mimeType || mimeType;
    } catch {
      recorder = null;
      return false;
    }
  }

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };
  recorder.onerror = () => {
    /* keep chunks so far */
  };
  startedAt = Date.now();
  recorder.start(1000);
  return true;
}

function stopSessionRecordingSync() {
  if (recorder && recorder.state !== 'inactive') {
    try {
      recorder.stop();
    } catch {
      /* ignore */
    }
  }
  recorder = null;
}

/** Stop and assemble blob (awaitable). */
export function stopSessionRecording(): Promise<Blob | null> {
  return new Promise((resolve) => {
    const rec = recorder;
    if (!rec || rec.state === 'inactive') {
      const fallback = chunks.length ? new Blob(chunks, { type: mimeType }) : null;
      chunks = [];
      recorder = null;
      if (fallback && fallback.size > 0) pendingBlob = fallback;
      resolve(fallback && fallback.size > 0 ? fallback : null);
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      const blob = chunks.length ? new Blob(chunks, { type: mimeType || rec.mimeType || 'video/webm' }) : null;
      chunks = [];
      recorder = null;
      if (blob && blob.size > 0) {
        pendingBlob = blob;
        resolve(blob);
      } else {
        resolve(null);
      }
    };

    rec.onstop = finish;
    try {
      if (rec.state === 'recording') rec.requestData();
      rec.stop();
    } catch {
      finish();
    }

    window.setTimeout(finish, 1500);
  });
}

export function recordingElapsedSec() {
  if (!startedAt) return 0;
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}
