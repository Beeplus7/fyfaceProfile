/**
 * Stream a local video file or direct video URL onto the live feed relay
 * (JPEG frames + WAV soundtrack).
 *
 * Keep the element muted for autoplay; soundtrack is tapped via
 * startLiveElementAudioPublish (MediaElementSource) so viewers hear audio.
 */

import { setSharedLiveStream, stopSharedLiveStream } from './liveCameraBus';
import { attachLiveFramePreview, startLiveFramePublish, stopLiveFramePublish } from './liveFrameRelay';
import { startLiveElementAudioPublish, stopLiveAudioPublish } from './liveAudioRelay';

let mediaEl: HTMLVideoElement | null = null;
let objectUrl: string | null = null;
let canvas: HTMLCanvasElement | null = null;
let drawTimer: number | null = null;
let canvasStream: MediaStream | null = null;
let active = false;
/** True when this module replaced the shared bus with a file/link capture (not dual+camera). */
let mediaOwnsShared = false;

function teardownMediaOnly() {
  if (drawTimer) {
    window.cancelAnimationFrame(drawTimer);
    drawTimer = null;
  }
  canvasStream = null;
  canvas = null;
  if (mediaEl) {
    try {
      mediaEl.pause();
      mediaEl.removeAttribute('src');
      mediaEl.load();
      mediaEl.remove();
    } catch {
      /* ignore */
    }
    mediaEl = null;
  }
  if (objectUrl) {
    try {
      URL.revokeObjectURL(objectUrl);
    } catch {
      /* ignore */
    }
    objectUrl = null;
  }
}

export function isLiveMediaSourceActive() {
  return active;
}

export function getLiveMediaElement() {
  return mediaEl;
}

function captureFromElement(video: HTMLVideoElement): MediaStream {
  const anyV = video as HTMLVideoElement & {
    captureStream?: (fps?: number) => MediaStream;
    mozCaptureStream?: (fps?: number) => MediaStream;
  };
  if (typeof anyV.captureStream === 'function') {
    return anyV.captureStream(24);
  }
  if (typeof anyV.mozCaptureStream === 'function') {
    return anyV.mozCaptureStream(24);
  }

  // Safari / older: canvas video frames (audio handled separately)
  canvas = document.createElement('canvas');
  const w = Math.max(2, video.videoWidth || 960);
  const h = Math.max(2, video.videoHeight || 540);
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { alpha: false });
  canvasStream = canvas.captureStream(18);

  const paint = () => {
    if (!active || !mediaEl || !ctx || !canvas) return;
    if (mediaEl.readyState >= 2) {
      try {
        ctx.drawImage(mediaEl, 0, 0, canvas.width, canvas.height);
      } catch {
        /* tainted / not ready */
      }
    }
    drawTimer = window.requestAnimationFrame(paint);
  };
  drawTimer = window.requestAnimationFrame(paint);
  return canvasStream;
}

function ensureVisiblePreview(video: HTMLVideoElement) {
  Object.assign(video.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '4px',
    height: '4px',
    opacity: '0.01',
    pointerEvents: 'none',
    zIndex: '-1',
  });
  if (!video.isConnected) document.body.appendChild(video);
}

async function loadMediaElement(source: File | string): Promise<HTMLVideoElement> {
  const isFile = source instanceof File;
  if (!isFile) {
    const raw = source.trim();
    if (!/^https?:\/\//i.test(raw)) {
      throw Object.assign(new Error('URL must start with http(s)://'), { name: 'TypeError' });
    }
    if (/youtube\.com|youtu\.be|vimeo\.com|tiktok\.com/i.test(raw)) {
      throw Object.assign(
        new Error('Use a direct video file link (mp4/webm), not a YouTube/Vimeo page URL'),
        { name: 'NotSupportedError' },
      );
    }
  }

  if (isFile) {
    const type = (source.type || '').toLowerCase();
    const name = source.name.toLowerCase();
    const ok =
      type.startsWith('video/') ||
      /\.(mp4|webm|mov|m4v|mpeg|mpg|avi|mkv)$/i.test(name);
    if (!ok) {
      throw Object.assign(new Error('Choose a video file (mp4, mov, webm…)'), { name: 'TypeError' });
    }
  }

  // Tear down prior file/link only — do not kill the creator camera bus
  active = false;
  teardownMediaOnly();

  const url = isFile ? URL.createObjectURL(source) : source.trim();
  if (isFile) objectUrl = url;

  const video = document.createElement('video');
  video.playsInline = true;
  video.setAttribute('playsinline', 'true');
  video.setAttribute('webkit-playsinline', 'true');
  video.loop = true;
  video.preload = 'auto';
  if (!isFile) video.crossOrigin = 'anonymous';
  // Muted for autoplay; MediaElementSource still gets decoded audio for viewers
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 1;
  video.src = url;
  ensureVisiblePreview(video);
  mediaEl = video;

  await new Promise<void>((resolve, reject) => {
    let settled = false;
    const onReady = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const onErr = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(
        Object.assign(new Error(isFile ? 'Could not open that video file' : 'Could not load video URL'), {
          name: 'MediaError',
        }),
      );
    };
    const cleanup = () => {
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('error', onErr);
    };
    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    video.addEventListener('error', onErr);
    video.load();
    window.setTimeout(() => {
      if (!settled && video.readyState >= 2) onReady();
    }, 2500);
  });

  try {
    await video.play();
  } catch {
    /* muted autoplay should work after file pick gesture */
  }

  if (video.paused) {
    try {
      await video.play();
    } catch {
      /* ignore */
    }
  }

  active = true;
  return video;
}

/**
 * Play a file/link beside the creator camera (split dual). Does not replace the camera bus.
 */
export async function startLiveMediaCompanion(source: File | string): Promise<HTMLVideoElement> {
  mediaOwnsShared = false;
  return loadMediaElement(source);
}

/**
 * Start publishing a File or direct media URL (mp4/webm/mov/m4v) alone to the live feed.
 * Prefer startLiveMediaCompanion + dual compose when the creator camera should stay on.
 * YouTube/Vimeo page links are not supported — use a direct file URL.
 */
export async function startLiveMediaSource(source: File | string): Promise<MediaStream> {
  stopLiveMediaSource();

  const video = await loadMediaElement(source);
  const stream = captureFromElement(video);
  if (!stream.getVideoTracks().length) {
    active = false;
    teardownMediaOnly();
    throw Object.assign(new Error('Browser could not capture video from that file'), {
      name: 'NotSupportedError',
    });
  }

  mediaOwnsShared = true;
  setSharedLiveStream(stream);
  startLiveFramePublish(stream, video);
  attachLiveFramePreview(video);
  // Soundtrack → WAV relay (same AudioContext as PCM encoder)
  startLiveElementAudioPublish(video, { monitorGain: 0.55 });

  return stream;
}

export function stopLiveMediaSource() {
  active = false;
  if (mediaOwnsShared) {
    stopLiveFramePublish();
    stopLiveAudioPublish();
    stopSharedLiveStream();
    mediaOwnsShared = false;
  }
  teardownMediaOnly();
}
