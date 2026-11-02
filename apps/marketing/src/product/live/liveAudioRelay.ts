/**
 * Cross-device live audio via PCM/WAV chunks.
 * MediaRecorder webm/mp4 slices are unreliable on iOS↔desktop; WAV plays everywhere.
 */

import {
  liveAudioChunkSec,
  liveAudioPollMs,
  liveAudioTargetRate,
  liveMicConstraints,
} from './liveQuality';
import {
  createGaplessWavViewer,
  downsamplePcm,
  encodeWav,
  mergePcm,
  softNormalize,
} from './livePcmAudio';

const AUDIO_URL = '/api/live-audio';
const AUDIO_META = '/api/live-audio?meta=1';

let publishing = false;
let micStream: MediaStream | null = null;
let ownMic = false;
let mixCtx: AudioContext | null = null;
let micNode: MediaStreamAudioSourceNode | null = null;
let elementNode: MediaElementAudioSourceNode | null = null;
let mixBus: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicEl: HTMLAudioElement | null = null;
let musicNode: MediaElementAudioSourceNode | null = null;
let processor: ScriptProcessorNode | null = null;
let silentGain: GainNode | null = null;
let monitorGain: GainNode | null = null;
let seq = 0;
let lastOkAt = 0;
let lastErr: string | null = null;
let pcm: Float32Array[] = [];
let pcmSamples = 0;
let inFlight = false;
/** Short queue while a POST is in flight — reduces chop under multi-guest load */
const pendingQueue: Blob[] = [];
const MAX_PENDING = 3;

async function postWav(blob: Blob) {
  if (!publishing || blob.size < 100) return;
  if (inFlight) {
    pendingQueue.push(blob);
    while (pendingQueue.length > MAX_PENDING) pendingQueue.shift();
    return;
  }
  inFlight = true;
  seq += 1;
  try {
    const res = await fetch(AUDIO_URL, {
      method: 'POST',
      body: blob,
      headers: {
        'Content-Type': 'audio/wav',
        'X-Live-Seq': String(seq),
        'X-Live-Mime': 'audio/wav',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      lastErr = `http-${res.status}`;
      return;
    }
    lastOkAt = Date.now();
    lastErr = null;
  } catch (e) {
    lastErr = e instanceof Error ? e.message : 'push-fail';
  } finally {
    inFlight = false;
    if (pendingQueue.length && publishing) {
      const next = pendingQueue.shift()!;
      void postWav(next);
    }
  }
}

function teardownGraph() {
  try {
    processor?.disconnect();
  } catch {
    /* ignore */
  }
  try {
    micNode?.disconnect();
  } catch {
    /* ignore */
  }
  try {
    elementNode?.disconnect();
  } catch {
    /* ignore */
  }
  try {
    musicNode?.disconnect();
  } catch {
    /* ignore */
  }
  try {
    musicGain?.disconnect();
  } catch {
    /* ignore */
  }
  try {
    mixBus?.disconnect();
  } catch {
    /* ignore */
  }
  try {
    silentGain?.disconnect();
  } catch {
    /* ignore */
  }
  try {
    monitorGain?.disconnect();
  } catch {
    /* ignore */
  }
  processor = null;
  micNode = null;
  elementNode = null;
  musicNode = null;
  musicGain = null;
  mixBus = null;
  silentGain = null;
  monitorGain = null;
  if (musicEl) {
    try {
      musicEl.pause();
      musicEl.removeAttribute('src');
      musicEl.load();
    } catch {
      /* ignore */
    }
    musicEl = null;
  }
  if (mixCtx) {
    void mixCtx.close().catch(() => undefined);
    mixCtx = null;
  }
  pcm = [];
  pcmSamples = 0;
}

function startPcmCapture(stream: MediaStream) {
  teardownGraph();
  const tracks = stream.getAudioTracks().filter((t) => t.readyState === 'live');
  if (!tracks.length) {
    lastErr = 'no-mic';
    return;
  }
  tracks.forEach((t) => {
    t.enabled = true;
  });

  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  mixCtx = new Ctx();
  if (mixCtx.state === 'suspended') void mixCtx.resume();

  const micOnly = new MediaStream(tracks);
  micNode = mixCtx.createMediaStreamSource(micOnly);
  // ScriptProcessor is deprecated but still the most portable live PCM tap
  const bufferSize = 4096;
  processor = mixCtx.createScriptProcessor(bufferSize, 1, 1);
  const targetRate = liveAudioTargetRate();
  const chunkSec = liveAudioChunkSec(1);
  const rate = mixCtx.sampleRate || targetRate;
  const need = Math.max(1, Math.floor(targetRate * chunkSec));
  let lastOutRate = targetRate;

  processor.onaudioprocess = (ev) => {
    if (!publishing) return;
    if (mixCtx?.state === 'suspended') void mixCtx.resume();
    const input = ev.inputBuffer.getChannelData(0);
    const { samples: reduced, outRate } = downsamplePcm(input, rate, targetRate);
    lastOutRate = outRate;
    pcm.push(reduced);
    pcmSamples += reduced.length;
    if (pcmSamples >= need) {
      const merged = softNormalize(mergePcm(pcm, pcmSamples));
      pcm = [];
      pcmSamples = 0;
      let peak = 0;
      for (let i = 0; i < merged.length; i++) peak = Math.max(peak, Math.abs(merged[i]!));
      if (peak < 0.0008) lastErr = 'silent';
      else lastErr = null;
      void postWav(encodeWav(merged, lastOutRate));
    }
  };

  // mixBus = mic (+ optional BGM) → processor → silent destination (keeps graph alive)
  mixBus = mixCtx.createGain();
  mixBus.gain.value = 1;
  silentGain = mixCtx.createGain();
  silentGain.gain.value = 0;
  micNode.connect(mixBus);
  mixBus.connect(processor);
  processor.connect(silentGain);
  silentGain.connect(mixCtx.destination);
}

/** Acquire mic-only (audio live / when camera stream has no audio). */
export async function acquireLiveMic(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: liveMicConstraints({ multiGuest: true }),
    video: false,
  });
  ownMic = true;
  return stream;
}

/** Start pushing mic / file audio as WAV chunks. Pass camera stream, file stream, or mic-only. */
export function startLiveAudioPublish(
  stream: MediaStream,
  opts?: { allowMicFallback?: boolean },
) {
  publishing = true;
  seq = 0;
  lastErr = null;
  const allowMicFallback = opts?.allowMicFallback !== false;

  const usable = stream.getAudioTracks().filter((t) => t.readyState === 'live');
  if (!usable.length) {
    lastErr = 'no-track';
    if (!allowMicFallback) return;
    void acquireLiveMic()
      .then((mic) => {
        if (!publishing) {
          mic.getTracks().forEach((t) => t.stop());
          return;
        }
        if (ownMic && micStream) micStream.getTracks().forEach((t) => t.stop());
        micStream = mic;
        ownMic = true;
        startPcmCapture(mic);
      })
      .catch(() => {
        lastErr = 'mic-denied';
      });
    return;
  }

  if (ownMic && micStream && micStream !== stream) {
    micStream.getTracks().forEach((t) => t.stop());
  }
  micStream = stream;
  ownMic = false;
  startPcmCapture(stream);
}

/**
 * Publish soundtrack from a playing <video>/<audio> element (file/link live).
 * Uses one AudioContext so muted autoplay still reaches viewers via MediaElementSource.
 */
export function startLiveElementAudioPublish(
  el: HTMLMediaElement,
  opts?: { monitorGain?: number },
) {
  publishing = true;
  seq = 0;
  lastErr = null;
  if (micStream && ownMic) {
    micStream.getTracks().forEach((t) => t.stop());
  }
  micStream = null;
  ownMic = false;

  teardownGraph();
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  mixCtx = new Ctx();
  if (mixCtx.state === 'suspended') void mixCtx.resume();

  try {
    elementNode = mixCtx.createMediaElementSource(el);
  } catch (e) {
    lastErr = e instanceof Error ? e.message : 'element-audio';
    return;
  }

  const bufferSize = 4096;
  processor = mixCtx.createScriptProcessor(bufferSize, 1, 1);
  const targetRate = liveAudioTargetRate();
  const chunkSec = liveAudioChunkSec(1);
  const rate = mixCtx.sampleRate || targetRate;
  const need = Math.max(1, Math.floor(targetRate * chunkSec));
  let lastOutRate = targetRate;

  processor.onaudioprocess = (ev) => {
    if (!publishing) return;
    if (mixCtx?.state === 'suspended') void mixCtx.resume();
    const input = ev.inputBuffer.getChannelData(0);
    const { samples: reduced, outRate } = downsamplePcm(input, rate, targetRate);
    lastOutRate = outRate;
    pcm.push(reduced);
    pcmSamples += reduced.length;
    if (pcmSamples >= need) {
      const merged = softNormalize(mergePcm(pcm, pcmSamples));
      pcm = [];
      pcmSamples = 0;
      let peak = 0;
      for (let i = 0; i < merged.length; i++) peak = Math.max(peak, Math.abs(merged[i]!));
      if (peak < 0.0008) lastErr = 'silent';
      else lastErr = null;
      void postWav(encodeWav(merged, lastOutRate));
    }
  };

  mixBus = mixCtx.createGain();
  mixBus.gain.value = 1.35;
  silentGain = mixCtx.createGain();
  silentGain.gain.value = 0;
  monitorGain = mixCtx.createGain();
  monitorGain.gain.value = opts?.monitorGain ?? 0.5;

  elementNode.connect(mixBus);
  mixBus.connect(processor);
  processor.connect(silentGain);
  silentGain.connect(mixCtx.destination);
  // Host hears the file locally at monitor level
  mixBus.connect(monitorGain);
  monitorGain.connect(mixCtx.destination);

  void mixCtx.resume().catch(() => undefined);
}

/** Start audio-only publish (Go Live → Audio). */
export async function startLiveAudioOnlyPublish(): Promise<boolean> {
  try {
    const mic = await acquireLiveMic();
    startLiveAudioPublish(mic);
    return true;
  } catch {
    lastErr = 'mic-denied';
    return false;
  }
}

/**
 * Play BGM on the host and, when mic relay is active, mix HTTPS/blob audio into the
 * live WAV stream so viewers hear it. YouTube is synced separately via live-status.
 */
export function setLiveMusicBed(url: string | null, opts?: { volume?: number; loop?: boolean }) {
  const vol = opts?.volume ?? 0.42;
  if (!url) {
    try {
      musicNode?.disconnect();
    } catch {
      /* ignore */
    }
    try {
      musicGain?.disconnect();
    } catch {
      /* ignore */
    }
    musicNode = null;
    musicGain = null;
    if (musicEl) {
      musicEl.pause();
      musicEl.removeAttribute('src');
      musicEl = null;
    }
    return;
  }

  if (!musicEl) {
    musicEl = new Audio();
    if (/^https?:\/\//i.test(url)) musicEl.crossOrigin = 'anonymous';
    musicEl.setAttribute('playsinline', 'true');
    musicEl.preload = 'auto';
  }
  musicEl.loop = opts?.loop !== false;
  musicEl.volume = vol;
  if (musicEl.src !== url) {
    musicEl.src = url;
  }

  // Mix into live PCM when publishing (Jamendo / upload beds)
  if (publishing && mixCtx && mixBus) {
    if (mixCtx.state === 'suspended') void mixCtx.resume();
    try {
      if (!musicNode) {
        musicNode = mixCtx.createMediaElementSource(musicEl);
        musicGain = mixCtx.createGain();
        musicGain.gain.value = vol;
        musicNode.connect(musicGain);
        musicGain.connect(mixBus);
        // Host hears BGM through Web Audio after createMediaElementSource
        musicNode.connect(mixCtx.destination);
      } else if (musicGain) {
        musicGain.gain.value = vol;
      }
    } catch {
      /* element already bound — still try play() */
    }
  }

  void musicEl.play().catch(() => undefined);
}

export function stopLiveAudioPublish() {
  publishing = false;
  pendingQueue.length = 0;
  teardownGraph();
  if (ownMic && micStream) {
    micStream.getTracks().forEach((t) => t.stop());
  }
  micStream = null;
  ownMic = false;
  void fetch(`${AUDIO_URL}?clear=1`, { method: 'POST' }).catch(() => undefined);
}

export function liveAudioPublishStats() {
  return { publishing, lastOkAt, lastErr, seq, ageMs: lastOkAt ? Date.now() - lastOkAt : null };
}

export function isLiveAudioPublishing() {
  return publishing;
}

export type RemoteAudioMeta = {
  live: boolean;
  seq?: number;
  mime?: string;
  ageMs?: number;
};

export async function remoteAudioIsLive(): Promise<RemoteAudioMeta> {
  try {
    const res = await fetch(AUDIO_META, { cache: 'no-store' });
    if (!res.ok) return { live: false };
    return (await res.json()) as RemoteAudioMeta;
  } catch {
    return { live: false };
  }
}

export function liveAudioSrc(seq: number) {
  return `${AUDIO_URL}?t=${seq}&mime=wav`;
}

/** Viewer: gapless WAV chunk playback after a user gesture (Watch / Join). */
export function createLiveAudioViewer() {
  return createGaplessWavViewer({
    metaUrl: AUDIO_META,
    audioUrl: (seq) => liveAudioSrc(seq),
    pollMs: liveAudioPollMs(0),
    volume: 1,
  });
}
