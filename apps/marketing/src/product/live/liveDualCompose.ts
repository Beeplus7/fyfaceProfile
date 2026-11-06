/**
 * Split-screen live: playing file/link video + creator camera.
 * Composites both into the host JPEG relay so remote viewers see the same stack.
 * Host UI renders the real camera + media elements; flip swaps top/bottom.
 */

import { getSharedLiveStream, sharedStreamIsLive } from './liveCameraBus';
import { startLiveFramePublish, stopLiveFramePublish } from './liveFrameRelay';
import { startLiveAudioPublish, startLiveElementAudioPublish, stopLiveAudioPublish } from './liveAudioRelay';
import { getLiveMediaElement, isLiveMediaSourceActive } from './liveMediaSource';

let dualActive = false;
let mediaOnTop = true;
let paintTimer: number | null = null;
let canvas: HTMLCanvasElement | null = null;
let canvasStream: MediaStream | null = null;
let camVideo: HTMLVideoElement | null = null;
let wallpaperImg: HTMLImageElement | null = null;
let wallpaperUrl: string | null = null;

export function isLiveDualActive() {
  return dualActive;
}

export function getLiveDualMediaOnTop() {
  return mediaOnTop;
}

function ensureCamVideo(stream: MediaStream) {
  if (!camVideo) {
    camVideo = document.createElement('video');
    camVideo.muted = true;
    camVideo.defaultMuted = true;
    camVideo.playsInline = true;
    camVideo.autoplay = true;
    camVideo.setAttribute('playsinline', 'true');
    camVideo.setAttribute('muted', '');
    Object.assign(camVideo.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '4px',
      height: '4px',
      opacity: '0.01',
      pointerEvents: 'none',
      zIndex: '-1',
    });
    document.body.appendChild(camVideo);
  }
  if (camVideo.srcObject !== stream) camVideo.srcObject = stream;
  void camVideo.play().catch(() => undefined);
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  srcW: number,
  srcH: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  if (srcW < 2 || srcH < 2 || dw < 2 || dh < 2) return;
  const scale = Math.max(dw / srcW, dh / srcH);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (srcW - sw) / 2;
  const sy = (srcH - sh) / 2;
  ctx.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
}

function paint() {
  if (!dualActive || !canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    paintTimer = window.requestAnimationFrame(paint);
    return;
  }
  const w = canvas.width;
  const h = canvas.height;
  const half = Math.floor(h / 2);

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, w, h);

  if (wallpaperImg && wallpaperImg.complete && wallpaperImg.naturalWidth > 1) {
    drawCover(ctx, wallpaperImg, wallpaperImg.naturalWidth, wallpaperImg.naturalHeight, 0, 0, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, 0, w, h);
  }

  const media = getLiveMediaElement();
  const topY = 0;
  const botY = half;
  const mediaRect = mediaOnTop ? { y: topY, h: half } : { y: botY, h: h - half };
  const camRect = mediaOnTop ? { y: botY, h: h - half } : { y: topY, h: half };

  if (media && media.readyState >= 2 && media.videoWidth > 1) {
    drawCover(ctx, media, media.videoWidth, media.videoHeight, 0, mediaRect.y, w, mediaRect.h);
  } else {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, mediaRect.y, w, mediaRect.h);
  }

  if (camVideo && camVideo.readyState >= 2 && camVideo.videoWidth > 1) {
    // Mirror selfie for compose so remote matches host preview
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    drawCover(ctx, camVideo, camVideo.videoWidth, camVideo.videoHeight, 0, camRect.y, w, camRect.h);
    ctx.restore();
  } else {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, camRect.y, w, camRect.h);
  }

  // Hairline between panes
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(0, half - 1, w, 2);

  paintTimer = window.requestAnimationFrame(paint);
}

function bindWallpaper(url: string | null) {
  wallpaperUrl = url;
  if (!url) {
    wallpaperImg = null;
    return;
  }
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  wallpaperImg = img;
}

/** Optional wallpaper under the split (also used by host stage CSS). */
export function setLiveDualWallpaper(url: string | null) {
  bindWallpaper(url);
}

export function setLiveDualMediaOnTop(onTop: boolean) {
  mediaOnTop = Boolean(onTop);
}

/**
 * Start compositing camera + companion media into the host frame relay.
 * Requires an active shared camera stream and active live media element.
 */
export function startLiveDualCompose(opts?: {
  mediaOnTop?: boolean;
  wallpaperUrl?: string | null;
}): boolean {
  const stream = getSharedLiveStream();
  const media = getLiveMediaElement();
  if (!stream || !sharedStreamIsLive() || !media || !isLiveMediaSourceActive()) {
    return false;
  }

  stopLiveDualCompose({ keepMedia: true, keepCameraAudio: false });

  mediaOnTop = opts?.mediaOnTop !== false;
  if (opts?.wallpaperUrl !== undefined) bindWallpaper(opts.wallpaperUrl || null);

  ensureCamVideo(stream);

  canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return false;

  // Seed one frame so captureStream has content
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvasStream = canvas.captureStream(20);
  dualActive = true;
  paintTimer = window.requestAnimationFrame(paint);

  // Replace camera-only JPEG publish with composite (camera stream stays on bus for preview)
  stopLiveFramePublish();
  startLiveFramePublish(canvasStream);

  // Mic from camera + soundtrack from media file/link
  stopLiveAudioPublish();
  try {
    startLiveAudioPublish(stream);
  } catch {
    /* mic best-effort */
  }
  try {
    startLiveElementAudioPublish(media, { monitorGain: 0.45 });
  } catch {
    /* media audio best-effort */
  }

  return true;
}

export function stopLiveDualCompose(opts?: { keepMedia?: boolean; keepCameraAudio?: boolean }) {
  dualActive = false;
  if (paintTimer) {
    window.cancelAnimationFrame(paintTimer);
    paintTimer = null;
  }
  if (canvasStream) {
    canvasStream.getTracks().forEach((t) => t.stop());
    canvasStream = null;
  }
  canvas = null;
  if (camVideo) {
    try {
      camVideo.srcObject = null;
      camVideo.remove();
    } catch {
      /* ignore */
    }
    camVideo = null;
  }
  if (!opts?.keepMedia) {
    wallpaperImg = null;
    wallpaperUrl = null;
  }
  if (!opts?.keepCameraAudio) {
    // caller may restart camera publish
  }
}
