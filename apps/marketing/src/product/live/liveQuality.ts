/**
 * Shared live AV quality knobs (JPEG relay + WAV PCM).
 * Tuned for dual/group live on typical Wi‑Fi; dials down on slow nets / save-data.
 */

export type LiveNetClass = 'high' | 'mid' | 'low';

export function liveNetClass(): LiveNetClass {
  try {
    const c = (navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean; downlink?: number };
    }).connection;
    if (c?.saveData) return 'low';
    const t = c?.effectiveType;
    if (t === '2g' || t === 'slow-2g') return 'low';
    if (t === '3g') return 'mid';
    if (typeof c?.downlink === 'number' && c.downlink > 0 && c.downlink < 1.5) return 'mid';
  } catch {
    /* ignore */
  }
  return 'high';
}

/** Max encode width for host / guest JPEG. */
export function liveEncodeMaxWidth(role: 'host' | 'guest' = 'host'): number {
  const net = liveNetClass();
  const desktop = (() => {
    try {
      return window.matchMedia('(min-width: 900px)').matches;
    } catch {
      return false;
    }
  })();
  if (net === 'low') return role === 'guest' ? 640 : 720;
  if (net === 'mid') return role === 'guest' ? 848 : 1080;
  if (desktop) return role === 'guest' ? 1080 : 1440;
  return role === 'guest' ? 960 : 1280;
}

/** JPEG quality 0–1 */
export function liveJpegQuality(role: 'host' | 'guest' = 'host'): number {
  const net = liveNetClass();
  if (net === 'low') return 0.82;
  if (net === 'mid') return role === 'guest' ? 0.88 : 0.9;
  return role === 'guest' ? 0.92 : 0.94;
}

/** Frame push interval (ms). */
export function liveFrameIntervalMs(role: 'host' | 'guest' = 'host'): { fast: number; slow: number } {
  const net = liveNetClass();
  if (net === 'low') return { fast: 140, slow: 220 };
  if (net === 'mid') return { fast: 95, slow: 150 };
  // ~15–18 fps host, ~12–14 guest on good Wi‑Fi
  return role === 'guest' ? { fast: 75, slow: 120 } : { fast: 55, slow: 95 };
}

/** WAV encode rate for speech + music beds (keep high for group clarity). */
export function liveAudioTargetRate(): number {
  const net = liveNetClass();
  if (net === 'low') return 32000;
  if (net === 'mid') return 44100;
  return 48000;
}

/**
 * Chunk length — longer under multi-guest = fewer POSTs / fewer dropped pending WAVs.
 * @param guestCount active guest slots on the call (0 = host-only)
 */
export function liveAudioChunkSec(guestCount = 0): number {
  const net = liveNetClass();
  const multi = guestCount >= 1;
  if (net === 'low') return multi ? 0.38 : 0.32;
  if (net === 'mid') return multi ? 0.32 : 0.26;
  return multi ? 0.28 : 0.22;
}

/** Viewer poll interval — slightly slower when many slots to reduce decode thrash. */
export function liveAudioPollMs(guestCount = 0): number {
  if (guestCount >= 2) return 160;
  if (guestCount >= 1) return 150;
  return 130;
}

/** getUserMedia video constraints for guests in split live — portrait-friendly. */
export function liveGuestVideoConstraints(): MediaTrackConstraints {
  const net = liveNetClass();
  if (net === 'low') {
    return {
      facingMode: { ideal: 'user' },
      width: { ideal: 640 },
      height: { ideal: 960 },
      frameRate: { ideal: 24, max: 24 },
    };
  }
  if (net === 'mid') {
    return {
      facingMode: { ideal: 'user' },
      width: { ideal: 720 },
      height: { ideal: 1280 },
      frameRate: { ideal: 28, max: 30 },
    };
  }
  return {
    facingMode: { ideal: 'user' },
    width: { ideal: 720 },
    height: { ideal: 1280 },
    frameRate: { ideal: 30, max: 30 },
  };
}

/**
 * Mic constraints for group live.
 * Always keep AEC; enable NS on mid/low OR when multi-guest (overlapping mics).
 */
export function liveMicConstraints(opts?: { multiGuest?: boolean }): MediaTrackConstraints {
  const net = liveNetClass();
  const multi = Boolean(opts?.multiGuest);
  return {
    echoCancellation: true,
    noiseSuppression: multi || net !== 'high',
    autoGainControl: true,
    channelCount: { ideal: 1 },
    sampleRate: { ideal: 48000 },
  };
}
