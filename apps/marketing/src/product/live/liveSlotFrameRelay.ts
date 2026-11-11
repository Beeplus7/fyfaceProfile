/**
 * Per-slot JPEG frame publish/poll for multi-guest live (g1/g2/g3).
 * Quality tracks liveQuality.ts (adaptive width / JPEG / FPS).
 */

import { liveEncodeMaxWidth, liveFrameIntervalMs, liveJpegQuality } from './liveQuality';

const FRAME_URL = '/api/live-frame';
const MIN_BYTES = 400;

type SlotPub = {
  slot: string;
  publishing: boolean;
  timer: number | null;
  stream: MediaStream | null;
  video: HTMLVideoElement | null;
  ownVideo: boolean;
  inFlight: boolean;
  interval: number;
  canvas: HTMLCanvasElement | null;
};

const pubs = new Map<string, SlotPub>();

function ensurePub(slot: string): SlotPub {
  let p = pubs.get(slot);
  if (!p) {
    p = {
      slot,
      publishing: false,
      timer: null,
      stream: null,
      video: null,
      ownVideo: false,
      inFlight: false,
      interval: liveFrameIntervalMs('guest').fast,
      canvas: null,
    };
    pubs.set(slot, p);
  }
  return p;
}

function slotUrl(slot: string, qs: string) {
  const s = encodeURIComponent(slot);
  return qs ? `${FRAME_URL}?slot=${s}&${qs}` : `${FRAME_URL}?slot=${s}`;
}

function activeGuestSlots(): number {
  let n = 0;
  for (const p of pubs.values()) {
    if (p.publishing) n += 1;
  }
  return Math.max(1, n);
}

function drawToJpeg(p: SlotPub, source: CanvasImageSource, srcW: number, srcH: number): Promise<Blob | null> {
  if (!p.canvas) p.canvas = document.createElement('canvas');
  const c = p.canvas;
  const guests = activeGuestSlots();
  const maxW = liveEncodeMaxWidth('guest', guests);
  const scale = Math.min(1, maxW / srcW);
  c.width = Math.max(2, Math.round(srcW * scale));
  c.height = Math.max(2, Math.round(srcH * scale));
  const ctx = c.getContext('2d', { alpha: false });
  if (!ctx) return Promise.resolve(null);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, c.width, c.height);
  const q = liveJpegQuality('guest', guests);
  return new Promise((resolve) => c.toBlob(resolve, 'image/jpeg', q));
}

async function capture(p: SlotPub): Promise<Blob | null> {
  const v = p.video;
  if (v && v.readyState >= 2 && v.videoWidth > 2) {
    try {
      return await drawToJpeg(p, v, v.videoWidth, v.videoHeight);
    } catch {
      return null;
    }
  }
  const track = p.stream?.getVideoTracks().find((t) => t.readyState === 'live');
  if (!track) return null;
  try {
    const IC = (
      window as unknown as {
        ImageCapture?: new (t: MediaStreamTrack) => { grabFrame: () => Promise<ImageBitmap> };
      }
    ).ImageCapture;
    if (!IC) return null;
    const bitmap = await new IC(track).grabFrame();
    try {
      return await drawToJpeg(p, bitmap, bitmap.width, bitmap.height);
    } finally {
      bitmap.close?.();
    }
  } catch {
    return null;
  }
}

function reschedule(p: SlotPub) {
  if (!p.publishing) return;
  if (p.timer) window.clearInterval(p.timer);
  p.timer = window.setInterval(() => void push(p), p.interval);
}

async function push(p: SlotPub) {
  if (!p.publishing || p.inFlight) return;
  p.inFlight = true;
  const started = Date.now();
  const { fast, slow } = liveFrameIntervalMs('guest', activeGuestSlots());
  try {
    const blob = await capture(p);
    if (!blob || blob.size < MIN_BYTES || !p.publishing) return;
    const res = await fetch(slotUrl(p.slot, ''), {
      method: 'POST',
      body: blob,
      headers: { 'Content-Type': 'image/jpeg' },
      cache: 'no-store',
    });
    if (!res.ok) {
      if (p.interval !== slow) {
        p.interval = slow;
        reschedule(p);
      }
      return;
    }
    const elapsed = Date.now() - started;
    const next = elapsed > 140 ? slow : fast;
    if (next !== p.interval) {
      p.interval = next;
      reschedule(p);
    }
  } catch {
    if (p.interval !== slow) {
      p.interval = slow;
      reschedule(p);
    }
  } finally {
    p.inFlight = false;
  }
}

function ensureHiddenVideo(p: SlotPub, stream: MediaStream) {
  const needsNew =
    !p.ownVideo ||
    !p.video ||
    (typeof p.video.isConnected === 'boolean' && !p.video.isConnected);
  if (needsNew) {
    if (p.ownVideo && p.video) {
      try {
        p.video.srcObject = null;
        p.video.remove();
      } catch {
        /* ignore */
      }
    }
    const videoEl = document.createElement('video');
    p.ownVideo = true;
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.playsInline = true;
    videoEl.autoplay = true;
    videoEl.setAttribute('playsinline', 'true');
    videoEl.setAttribute('muted', '');
    Object.assign(videoEl.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '540px',
      height: '720px',
      opacity: '0.02',
      pointerEvents: 'none',
      zIndex: '-1',
    });
    document.body.appendChild(videoEl);
    p.video = videoEl;
  }
  if (p.video && p.video.srcObject !== stream) p.video.srcObject = stream;
  void p.video?.play().catch(() => undefined);
}

/** Publish camera frames for a guest slot (g1 / g2 / g3). */
export function startSlotFramePublish(
  slot: string,
  stream: MediaStream,
  fromVideo?: HTMLVideoElement | null,
) {
  const p = ensurePub(slot);
  const track = stream.getVideoTracks().find((t) => t.readyState === 'live');
  if (!track) return;
  track.enabled = true;
  try {
    // Portrait box tiles — do NOT force 16:9 landscape (was stretching group live horizontal).
    void track.applyConstraints({
      frameRate: { ideal: 30, max: 30 },
      width: { ideal: 900 },
      height: { ideal: 1200 },
      aspectRatio: { ideal: 0.75 },
    });
  } catch {
    try {
      void track.applyConstraints({
        frameRate: { ideal: 28, max: 30 },
        width: { ideal: 720 },
        height: { ideal: 960 },
      });
    } catch {
      /* ignore */
    }
  }
  p.stream = stream;
  p.publishing = true;
  p.interval = liveFrameIntervalMs('guest', Math.max(1, pubs.size)).fast;
  // Always encode from a stable hidden <video> — tile remounts kill Safari publish
  ensureHiddenVideo(p, stream);
  if (fromVideo) {
    if (fromVideo.srcObject !== stream) fromVideo.srcObject = stream;
    void fromVideo.play().catch(() => undefined);
  }
  if (p.timer) window.clearInterval(p.timer);
  void push(p);
  p.timer = window.setInterval(() => void push(p), p.interval);
}

export function stopSlotFramePublish(slot: string) {
  const p = pubs.get(slot);
  if (!p) return;
  p.publishing = false;
  p.stream = null;
  if (p.timer) {
    window.clearInterval(p.timer);
    p.timer = null;
  }
  if (p.ownVideo && p.video) {
    try {
      p.video.srcObject = null;
      p.video.remove();
    } catch {
      /* ignore */
    }
    p.video = null;
    p.ownVideo = false;
  }
  p.canvas = null;
  void fetch(slotUrl(slot, 'clear=1'), { method: 'POST' }).catch(() => undefined);
  pubs.delete(slot);
}

export function stopAllSlotFramePublish() {
  for (const slot of [...pubs.keys()]) stopSlotFramePublish(slot);
}

export async function remoteSlotFrameIsLive(slot: string): Promise<boolean> {
  try {
    const res = await fetch(slotUrl(slot, 'meta=1'), { cache: 'no-store' });
    if (!res.ok) return false;
    const data = (await res.json()) as { live?: boolean };
    return Boolean(data.live);
  } catch {
    return false;
  }
}

export function liveSlotFrameSrc(slot: string, ts = Date.now()) {
  return slotUrl(slot, `t=${ts}`);
}
