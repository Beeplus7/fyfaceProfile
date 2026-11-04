/** Cross-device live video: host pushes JPEG frames; viewers poll /api/live-frame. */

import { liveEncodeMaxWidth, liveFrameIntervalMs, liveJpegQuality } from './liveQuality';

const FRAME_URL = '/api/live-frame';
const FRAME_META = '/api/live-frame?meta=1';
const MIN_BYTES = 400;

let publishing = false;
let timer: number | null = null;
let streamRef: MediaStream | null = null;
let videoEl: HTMLVideoElement | null = null;
let ownHiddenVideo = false;
let canvas: HTMLCanvasElement | null = null;
let inFlight = false;
let lastOkAt = 0;
let lastErr: string | null = null;
let consecutiveFails = 0;
let currentInterval = liveFrameIntervalMs('host').fast;

function ensureCanvas() {
  if (!canvas) canvas = document.createElement('canvas');
  return canvas;
}

function isJpegBlob(blob: Blob | null): blob is Blob {
  return Boolean(blob && blob.size >= MIN_BYTES && blob.type.includes('jpeg'));
}

function drawToJpeg(
  source: CanvasImageSource,
  srcW: number,
  srcH: number,
): Promise<Blob | null> {
  const c = ensureCanvas();
  const maxW = liveEncodeMaxWidth('host');
  const scale = Math.min(1, maxW / srcW);
  c.width = Math.max(2, Math.round(srcW * scale));
  c.height = Math.max(2, Math.round(srcH * scale));
  const ctx = c.getContext('2d', { alpha: false });
  if (!ctx) return Promise.resolve(null);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, c.width, c.height);
  return new Promise((resolve) => c.toBlob(resolve, 'image/jpeg', liveJpegQuality('host')));
}

async function blobFromTrack(track: MediaStreamTrack): Promise<Blob | null> {
  try {
    const IC = (window as unknown as { ImageCapture?: new (t: MediaStreamTrack) => { grabFrame: () => Promise<ImageBitmap> } })
      .ImageCapture;
    if (!IC) return null;
    const ic = new IC(track);
    const bitmap = await ic.grabFrame();
    try {
      return await drawToJpeg(bitmap, bitmap.width, bitmap.height);
    } finally {
      bitmap.close?.();
    }
  } catch {
    return null;
  }
}

async function blobFromVideo(v: HTMLVideoElement): Promise<Blob | null> {
  if (v.readyState < 2 || v.videoWidth < 2 || v.videoHeight < 2) return null;
  try {
    return await drawToJpeg(v, v.videoWidth, v.videoHeight);
  } catch {
    return null;
  }
}

async function captureBlob(): Promise<Blob | null> {
  const track = streamRef?.getVideoTracks().find((t) => t.readyState === 'live' && t.enabled !== false);
  // Prefer playing <video> (works on Safari + Continuity Camera); ImageCapture as fallback
  if (videoEl) {
    const fromVideo = await blobFromVideo(videoEl);
    if (isJpegBlob(fromVideo)) return fromVideo;
  }
  if (track) {
    const fromTrack = await blobFromTrack(track);
    if (isJpegBlob(fromTrack)) return fromTrack;
  }
  return null;
}

function rescheduleTimer() {
  if (!publishing) return;
  if (timer) window.clearInterval(timer);
  timer = window.setInterval(() => void pushFrame(), currentInterval);
}

async function pushFrame() {
  if (!publishing || inFlight) return;
  inFlight = true;
  const started = Date.now();
  const { fast: INTERVAL_FAST_MS, slow: INTERVAL_SLOW_MS } = liveFrameIntervalMs('host');
  try {
    const blob = await captureBlob();
    if (!blob || !publishing) {
      consecutiveFails += 1;
      lastErr = streamRef?.getVideoTracks().length ? 'no-frame' : 'no-track';
      if (videoEl) void videoEl.play().catch(() => undefined);
      return;
    }
    const res = await fetch(FRAME_URL, {
      method: 'POST',
      body: blob,
      headers: { 'Content-Type': 'image/jpeg' },
      cache: 'no-store',
    });
    if (!res.ok) {
      consecutiveFails += 1;
      lastErr = `http-${res.status}`;
      if (currentInterval < INTERVAL_SLOW_MS) {
        currentInterval = INTERVAL_SLOW_MS;
        rescheduleTimer();
      }
      return;
    }
    lastOkAt = Date.now();
    lastErr = null;
    consecutiveFails = 0;
    const elapsed = Date.now() - started;
    const next = elapsed > 130 ? INTERVAL_SLOW_MS : INTERVAL_FAST_MS;
    if (next !== currentInterval) {
      currentInterval = next;
      rescheduleTimer();
    }
  } catch (e) {
    consecutiveFails += 1;
    lastErr = e instanceof Error ? e.message : 'push-fail';
    if (currentInterval < INTERVAL_SLOW_MS) {
      currentInterval = INTERVAL_SLOW_MS;
      rescheduleTimer();
    }
  } finally {
    inFlight = false;
  }
}

function ensureHiddenVideo(stream: MediaStream) {
  // Never capture from the remountable React preview — a detached <video>
  // leaves the host stage blank and stops JPEG publish for viewers.
  const needsNew =
    !ownHiddenVideo || !videoEl || (typeof videoEl.isConnected === 'boolean' && !videoEl.isConnected);
  if (needsNew) {
    if (ownHiddenVideo && videoEl) {
      try {
        videoEl.srcObject = null;
        videoEl.remove();
      } catch {
        /* ignore */
      }
    }
    videoEl = document.createElement('video');
    ownHiddenVideo = true;
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.playsInline = true;
    videoEl.autoplay = true;
    videoEl.setAttribute('playsinline', 'true');
    videoEl.setAttribute('webkit-playsinline', 'true');
    videoEl.setAttribute('muted', '');
    Object.assign(videoEl.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '480px',
      height: '270px',
      opacity: '0.02',
      pointerEvents: 'none',
      zIndex: '-1',
    });
    document.body.appendChild(videoEl);
  }
  if (videoEl && videoEl.srcObject !== stream) videoEl.srcObject = stream;
  void videoEl?.play().catch(() => undefined);
}

/** Start pushing frames from the host camera MediaStream (Mac). */
export function startLiveFramePublish(stream: MediaStream, fromVideo?: HTMLVideoElement | null) {
  const track = stream.getVideoTracks().find((t) => t.readyState === 'live');
  if (!track) {
    lastErr = 'no-track';
    return;
  }
  track.enabled = true;
  streamRef = stream;
  publishing = true;
  consecutiveFails = 0;
  currentInterval = liveFrameIntervalMs('host').fast;

  // Always encode from a stable hidden <video>. Optional fromVideo is display-only.
  ensureHiddenVideo(stream);
  if (fromVideo) {
    if (fromVideo.srcObject !== stream) fromVideo.srcObject = stream;
    void fromVideo.play().catch(() => undefined);
  }

  if (timer) window.clearInterval(timer);
  void pushFrame();
  timer = window.setInterval(() => void pushFrame(), currentInterval);
}

export function attachLiveFramePreview(fromVideo: HTMLVideoElement | null) {
  if (!publishing || !streamRef) return;
  // Keep JPEG capture on the hidden element; only rebind the visible preview.
  ensureHiddenVideo(streamRef);
  if (!fromVideo) return;
  if (fromVideo.srcObject !== streamRef) fromVideo.srcObject = streamRef;
  void fromVideo.play().catch(() => undefined);
}

export function stopLiveFramePublish() {
  publishing = false;
  streamRef = null;
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }
  if (ownHiddenVideo && videoEl) {
    try {
      videoEl.srcObject = null;
      videoEl.remove();
    } catch {
      /* ignore */
    }
    videoEl = null;
    ownHiddenVideo = false;
  }
  void fetch(`${FRAME_URL}?clear=1`, { method: 'POST' }).catch(() => undefined);
}

export function liveFramePublishStats() {
  return { publishing, lastOkAt, lastErr, consecutiveFails, ageMs: lastOkAt ? Date.now() - lastOkAt : null };
}

export async function remoteFrameIsLive(): Promise<boolean> {
  try {
    const res = await fetch(FRAME_META, { cache: 'no-store' });
    if (!res.ok) return false;
    const data = (await res.json()) as { live?: boolean; ageMs?: number };
    return Boolean(data.live);
  } catch {
    return false;
  }
}

/** Cache-busting URL for the latest host frame. */
export function liveFrameSrc(ts = Date.now()) {
  return `${FRAME_URL}?t=${ts}`;
}
