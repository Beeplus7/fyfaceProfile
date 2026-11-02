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

/** WAV encode rate for speech + music beds */
export function liveAudioTargetRate(): number {
  const net = liveNetClass();
  if (net === 'low') return 24000;
  if (net === 'mid') return 32000;
  return 48000;
}

export function liveAudioChunkSec(): number {
  const net = liveNetClass();
  if (net === 'low') return 0.35;
  return 0.22;
}

/** getUserMedia video constraints for guests in split live */
export function liveGuestVideoConstraints(): MediaTrackConstraints {
  const net = liveNetClass();
  if (net === 'low') {
    return {
      facingMode: 'user',
      width: { ideal: 640 },
      height: { ideal: 960 },
      frameRate: { ideal: 24, max: 24 },
    };
  }
  if (net === 'mid') {
    return {
      facingMode: 'user',
      width: { ideal: 960 },
      height: { ideal: 1280 },
      frameRate: { ideal: 28, max: 30 },
    };
  }
  return {
    facingMode: 'user',
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 30 },
  };
}

export function liveMicConstraints(): MediaTrackConstraints | boolean {
  return {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    channelCount: { ideal: 1 },
    sampleRate: { ideal: 48000 },
  };
}
