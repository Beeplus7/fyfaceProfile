/** Shared local camera stream so Live page + Feed can both show YOU live. */

let sharedStream: MediaStream | null = null;
const listeners = new Set<() => void>();

export function getSharedLiveStream() {
  return sharedStream;
}

export function setSharedLiveStream(stream: MediaStream | null) {
  if (sharedStream && sharedStream !== stream) {
    // Don't stop tracks here when replacing with same device — caller owns lifecycle
  }
  sharedStream = stream;
  listeners.forEach((fn) => fn());
}

export function stopSharedLiveStream() {
  sharedStream?.getTracks().forEach((t) => t.stop());
  sharedStream = null;
  listeners.forEach((fn) => fn());
}

export function subscribeSharedLiveStream(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function sharedStreamIsLive() {
  const s = sharedStream;
  if (!s) return false;
  return s.getVideoTracks().some((t) => t.readyState === 'live' && t.enabled);
}
