import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getSharedLiveStream,
  setSharedLiveStream,
  sharedStreamIsLive,
  stopSharedLiveStream,
} from './liveCameraBus';
import { attachLiveFramePreview, startLiveFramePublish, stopLiveFramePublish } from './liveFrameRelay';
import { startLiveAudioPublish, stopLiveAudioPublish } from './liveAudioRelay';
import { liveMicConstraints } from './liveQuality';

function beginFrameRelay(stream: MediaStream, preview?: HTMLVideoElement | null) {
  try {
    startLiveFramePublish(stream, preview || null);
  } catch {
    /* relay is best-effort */
  }
  try {
    startLiveAudioPublish(stream);
  } catch {
    /* audio relay is best-effort */
  }
}

function endFrameRelay() {
  stopLiveFramePublish();
  stopLiveAudioPublish();
}

/** Ensure the host stream has a live mic track (viewers need it). */
async function ensureMicOnStream(stream: MediaStream): Promise<MediaStream> {
  const liveAudio = stream.getAudioTracks().find((t) => t.readyState === 'live');
  if (liveAudio) {
    liveAudio.enabled = true;
    return stream;
  }
  try {
    const mic = await navigator.mediaDevices.getUserMedia({
      audio: liveMicConstraints(),
      video: false,
    });
    mic.getAudioTracks().forEach((t) => {
      t.enabled = true;
      stream.addTrack(t);
    });
  } catch {
    /* mic denied — video-only still works */
  }
  return stream;
}

export type CameraStatus = 'idle' | 'requesting' | 'live' | 'denied' | 'unavailable';
export type CameraFacing = 'user' | 'environment';

type Hook = {
  videoRef: (el: HTMLVideoElement | null) => void;
  status: CameraStatus;
  error: string | null;
  facing: CameraFacing;
  switching: boolean;
  /** Call from a click handler so Mac Chrome/Safari show the permission prompt. */
  startCamera: () => Promise<boolean>;
  stopCamera: () => void;
  /** Flip front ↔ back (or cycle cameras on desktop). Keep audio + live relay. */
  switchCamera: () => Promise<boolean>;
};

let preferredFacing: CameraFacing = 'user';

export function getPreferredFacing(): CameraFacing {
  return preferredFacing;
}

export function setPreferredFacing(facing: CameraFacing) {
  preferredFacing = facing;
}

function isDenied(err: unknown) {
  const name = err instanceof DOMException ? err.name : err instanceof Error ? err.name : '';
  return name === 'NotAllowedError' || name === 'PermissionDeniedError';
}

/** Imperative acquire for Go Live click handlers (Feed → Live) before navigation. */
export async function acquireLiveCamera(): Promise<MediaStream> {
  const existing = getSharedLiveStream();
  if (existing && sharedStreamIsLive()) {
    void beginFrameRelay(existing);
    return existing;
  }
  const stream = await requestStream();
  setSharedLiveStream(stream);
  void beginFrameRelay(stream);
  return stream;
}

function facingFromTrack(track: MediaStreamTrack | undefined): CameraFacing {
  try {
    const settings = track?.getSettings?.() || {};
    if (settings.facingMode === 'environment') return 'environment';
    if (settings.facingMode === 'user') return 'user';
  } catch {
    /* ignore */
  }
  return preferredFacing;
}

async function requestStream(facing: CameraFacing = preferredFacing): Promise<MediaStream> {
  if (!window.isSecureContext) {
    throw Object.assign(new Error('insecure'), { name: 'SecurityError' });
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    throw Object.assign(new Error('no mediaDevices'), { name: 'NotSupportedError' });
  }

  preferredFacing = facing;

  // Prefer facingMode first on phones; HD desktop next.
  const attempts: MediaStreamConstraints[] = [
    {
      video: {
        facingMode: { ideal: facing },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30, max: 30 },
      },
      audio: liveMicConstraints(),
    },
    {
      video: {
        facingMode: { ideal: facing },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      },
      audio: liveMicConstraints(),
    },
    { video: { facingMode: facing }, audio: liveMicConstraints() },
    { video: { facingMode: { ideal: facing } }, audio: true },
    { video: true, audio: liveMicConstraints() },
    { video: true, audio: true },
    { video: { facingMode: facing }, audio: false },
  ];

  let lastErr: unknown;
  for (const constraints of attempts) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return await ensureMicOnStream(stream);
    } catch (err) {
      lastErr = err;
      // Don't burn the gesture / re-prompt loop once the user (or OS) denied.
      if (isDenied(err)) throw err;
    }
  }
  throw lastErr;
}

/**
 * Replace the video track on an existing live stream (keep mic).
 * Used by host hook + guest split-live.
 */
export async function switchStreamCamera(
  current: MediaStream,
  nextFacing?: CameraFacing,
): Promise<{ stream: MediaStream; facing: CameraFacing }> {
  const oldVideo = current.getVideoTracks().find((t) => t.readyState === 'live');
  const from = facingFromTrack(oldVideo);
  let target: CameraFacing = nextFacing || (from === 'user' ? 'environment' : 'user');

  // Desktop / multi-cam: cycle deviceId when facingMode flip fails or isn't available
  let deviceId: string | undefined;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices.filter((d) => d.kind === 'videoinput');
    if (cams.length > 1 && oldVideo) {
      const curId = oldVideo.getSettings?.().deviceId;
      const idx = Math.max(0, cams.findIndex((c) => c.deviceId === curId));
      const next = cams[(idx + 1) % cams.length];
      deviceId = next?.deviceId;
      // Heuristic label → facing for UI
      const label = (next?.label || '').toLowerCase();
      if (/back|rear|environment|world/i.test(label)) target = 'environment';
      else if (/front|user|face/i.test(label)) target = 'user';
    }
  } catch {
    /* ignore */
  }

  // 1) Try applyConstraints in place (fast path on some mobiles)
  if (oldVideo && !deviceId) {
    try {
      await oldVideo.applyConstraints({ facingMode: { exact: target } });
      preferredFacing = target;
      return { stream: current, facing: target };
    } catch {
      try {
        await oldVideo.applyConstraints({ facingMode: { ideal: target } });
        preferredFacing = facingFromTrack(oldVideo);
        return { stream: current, facing: preferredFacing };
      } catch {
        /* fall through to new getUserMedia */
      }
    }
  }

  const videoConstraint: MediaTrackConstraints = deviceId
    ? {
        deviceId: { exact: deviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      }
    : {
        facingMode: { ideal: target },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      };

  let fresh: MediaStream;
  try {
    fresh = await navigator.mediaDevices.getUserMedia({ video: videoConstraint, audio: false });
  } catch {
    fresh = await navigator.mediaDevices.getUserMedia({
      video: deviceId ? { deviceId: { ideal: deviceId } } : { facingMode: target },
      audio: false,
    });
  }

  const newVideo = fresh.getVideoTracks()[0];
  if (!newVideo) {
    fresh.getTracks().forEach((t) => t.stop());
    throw Object.assign(new Error('No video track'), { name: 'NotFoundError' });
  }
  newVideo.enabled = true;

  // Swap onto the shared stream object when possible
  if (oldVideo) {
    try {
      current.removeTrack(oldVideo);
      oldVideo.stop();
    } catch {
      /* ignore */
    }
  }
  current.addTrack(newVideo);
  // Stop unused tracks from fresh (we only wanted the video track)
  fresh.getTracks().forEach((t) => {
    if (t !== newVideo) t.stop();
  });

  preferredFacing = facingFromTrack(newVideo) || target;
  return { stream: current, facing: preferredFacing };
}

async function bindVideo(el: HTMLVideoElement, stream: MediaStream) {
  if (el.srcObject !== stream) el.srcObject = stream;
  el.muted = true;
  el.defaultMuted = true;
  el.playsInline = true;
  el.autoplay = true;
  el.setAttribute('playsinline', 'true');
  el.setAttribute('webkit-playsinline', 'true');
  el.setAttribute('muted', '');
  try {
    await el.play();
  } catch {
    /* muted autoplay — track is still live */
  }
}

/** Local camera preview — shares stream with Feed via liveCameraBus. */
export function useLiveCamera(): Hook {
  const elRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>(() => (sharedStreamIsLive() ? 'live' : 'idle'));
  const [error, setError] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraFacing>(preferredFacing);
  const [switching, setSwitching] = useState(false);

  const attach = useCallback(async (stream: MediaStream) => {
    const el = elRef.current;
    if (!el) return false;
    await bindVideo(el, stream);
    attachLiveFramePreview(el);
    beginFrameRelay(stream, el);
    return true;
  }, []);

  const stopCamera = useCallback(() => {
    endFrameRelay();
    stopSharedLiveStream();
    streamRef.current = null;
    if (elRef.current) elRef.current.srcObject = null;
    setStatus('idle');
    setError(null);
  }, []);

  const startCamera = useCallback(async () => {
    setStatus('requesting');
    setError(null);
    try {
      const existing = getSharedLiveStream();
      if (existing && sharedStreamIsLive()) {
        streamRef.current = existing;
        setFacing(facingFromTrack(existing.getVideoTracks()[0]));
        // Retry attach a few frames — video node may mount after Go Live setState
        for (let i = 0; i < 8; i++) {
          if (await attach(existing)) break;
          await new Promise((r) => requestAnimationFrame(() => r(undefined)));
        }
        void beginFrameRelay(existing);
        setStatus('live');
        return true;
      }

      if (streamRef.current && streamRef.current !== existing) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      // getUserMedia MUST stay in the click stack — do not await React renders before this.
      const stream = await requestStream(preferredFacing);
      streamRef.current = stream;
      setSharedLiveStream(stream);
      setFacing(facingFromTrack(stream.getVideoTracks()[0]));

      for (let i = 0; i < 12; i++) {
        if (await attach(stream)) break;
        await new Promise((r) => requestAnimationFrame(() => r(undefined)));
      }

      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack || videoTrack.readyState === 'ended') {
        setStatus('unavailable');
        setError('Camera track ended. Close Zoom/Meet/FaceTime, then retry.');
        return false;
      }
      videoTrack.enabled = true;
      void beginFrameRelay(stream);
      setStatus('live');
      setError(null);
      return true;
    } catch (err) {
      const name = err instanceof DOMException ? err.name : err instanceof Error ? err.name : 'Error';
      if (isDenied(err)) {
        setStatus('denied');
        setError(
          'Camera blocked. Click the lock icon in the address bar → Camera = Allow. Also System Settings → Privacy & Security → Camera → turn on for Chrome/Safari, then tap Enable camera again.',
        );
      } else if (name === 'SecurityError') {
        setStatus('unavailable');
        setError('Open https://myfaceprofile.aikova.co.uk (HTTPS required for camera).');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setStatus('unavailable');
        setError('No camera found on this Mac.');
      } else if (name === 'NotReadableError' || name === 'TrackStartError') {
        setStatus('unavailable');
        setError('Camera busy — quit Zoom, Meet, FaceTime or Photo Booth, then retry.');
      } else if (name === 'OverconstrainedError') {
        setStatus('unavailable');
        setError('Camera rejected constraints — tap Enable camera to retry with defaults.');
      } else {
        setStatus('unavailable');
        setError(`Could not open camera (${name}).`);
      }
      return false;
    }
  }, [attach]);

  const switchCamera = useCallback(async () => {
    const stream = streamRef.current || getSharedLiveStream();
    if (!stream || !sharedStreamIsLive()) return false;
    setSwitching(true);
    setError(null);
    try {
      const { stream: next, facing: face } = await switchStreamCamera(stream);
      streamRef.current = next;
      setSharedLiveStream(next);
      setFacing(face);
      // Rebind preview + keep JPEG/WAV publishing on the new track
      const el = elRef.current;
      if (el) {
        await bindVideo(el, next);
        attachLiveFramePreview(el);
      }
      beginFrameRelay(next, el);
      setStatus('live');
      return true;
    } catch (err) {
      const name = err instanceof DOMException ? err.name : err instanceof Error ? err.name : 'Error';
      setError(`Could not switch camera (${name}).`);
      return false;
    } finally {
      setSwitching(false);
    }
  }, []);

  const videoRef = useCallback(
    (el: HTMLVideoElement | null) => {
      elRef.current = el;
      const stream = streamRef.current || getSharedLiveStream();
      if (el && stream && sharedStreamIsLive()) {
        streamRef.current = stream;
        void bindVideo(el, stream).then(() => {
          attachLiveFramePreview(el);
          beginFrameRelay(stream, el);
          setStatus('live');
          setFacing(facingFromTrack(stream.getVideoTracks()[0]));
        });
      } else if (!el && stream && sharedStreamIsLive()) {
        // Preview left the DOM (navigate away) — keep JPEG relay on hidden video
        attachLiveFramePreview(null);
        beginFrameRelay(stream);
      }
    },
    [],
  );

  useEffect(() => {
    const existing = getSharedLiveStream();
    if (existing && sharedStreamIsLive()) {
      streamRef.current = existing;
      setFacing(facingFromTrack(existing.getVideoTracks()[0]));
      void attach(existing).then((ok) => {
        if (ok) setStatus('live');
      });
    }
  }, [attach]);

  useEffect(
    () => () => {
      if (elRef.current) elRef.current.srcObject = null;
    },
    [],
  );

  return { videoRef, status, error, facing, switching, startCamera, stopCamera, switchCamera };
}
