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
export function liveEncodeMaxWidth(role: 'host' | 'guest' = 'host', guestCount = 0): number {
  const net = liveNetClass();
  const desktop = (() => {
    try {
      return window.matchMedia('(min-width: 900px)').matches;
    } catch {
      return false;
    }
  })();
  // Group / boxed tiles benefit from a touch more guest detail (smaller on-screen → needs sharper source).
  const groupBump = guestCount >= 1 && role === 'guest' ? 80 : 0;
  if (net === 'low') return (role === 'guest' ? 720 : 800) + Math.min(groupBump, 40);
  if (net === 'mid') return (role === 'guest' ? 900 : 1120) + groupBump;
  if (desktop) return (role === 'guest' ? 1120 : 1440) + groupBump;
  return (role === 'guest' ? 1000 : 1280) + groupBump;
}

/** JPEG quality 0–1 */
export function liveJpegQuality(role: 'host' | 'guest' = 'host', guestCount = 0): number {
  const net = liveNetClass();
  const group = guestCount >= 1;
  if (net === 'low') return group ? 0.86 : 0.84;
  if (net === 'mid') return role === 'guest' ? (group ? 0.9 : 0.88) : 0.91;
  return role === 'guest' ? (group ? 0.94 : 0.92) : 0.95;
}

/** Frame push interval (ms). */
export function liveFrameIntervalMs(
  role: 'host' | 'guest' = 'host',
  guestCount = 0,
): { fast: number; slow: number } {
  const net = liveNetClass();
  // Slightly slower cadence when many slots to avoid decode thrash, but keep guest tiles snappy at 1–2.
  if (net === 'low') return { fast: guestCount >= 2 ? 150 : 135, slow: 230 };
  if (net === 'mid') return { fast: guestCount >= 2 ? 100 : 90, slow: 155 };
  if (guestCount >= 2) {
    return role === 'guest' ? { fast: 70, slow: 110 } : { fast: 55, slow: 95 };
  }
  // ~16–18 fps host, ~13–15 guest on good Wi‑Fi (boxed tiles)
  return role === 'guest' ? { fast: 65, slow: 105 } : { fast: 50, slow: 90 };
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

/** getUserMedia video constraints for guests in boxed group live — portrait 3:4 cards. */
export function liveGuestVideoConstraints(): MediaTrackConstraints {
  const net = liveNetClass();
  if (net === 'low') {
    return {
      facingMode: { ideal: 'user' },
      width: { ideal: 720 },
      height: { ideal: 960 },
      aspectRatio: { ideal: 0.75 },
      frameRate: { ideal: 24, max: 26 },
    };
  }
  if (net === 'mid') {
    return {
      facingMode: { ideal: 'user' },
      width: { ideal: 810 },
      height: { ideal: 1080 },
      aspectRatio: { ideal: 0.75 },
      frameRate: { ideal: 28, max: 30 },
    };
  }
  return {
    facingMode: { ideal: 'user' },
    width: { ideal: 900 },
    height: { ideal: 1200 },
    aspectRatio: { ideal: 0.75 },
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
