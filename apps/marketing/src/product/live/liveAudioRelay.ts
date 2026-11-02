/**
 * Cross-device live audio via PCM/WAV chunks.
 * MediaRecorder webm/mp4 slices are unreliable on iOS↔desktop; WAV plays everywhere.
 */

import { liveAudioChunkSec, liveAudioTargetRate, liveMicConstraints } from './liveQuality';

const AUDIO_URL = '/api/live-audio';
const AUDIO_META = '/api/live-audio?meta=1';
/** Soft AGC: boost quiet speech toward this peak, never clip above 0.95 */
const AGC_TARGET_PEAK = 0.78;
const AGC_MAX_GAIN = 4.2;

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

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

/** Encode mono float32 PCM (-1..1) as 16-bit WAV. */
function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

function mergePcm(chunks: Float32Array[], total: number): Float32Array {
  const out = new Float32Array(total);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

/** Soft peak normalize so quiet speech is louder on the viewer. */
function softNormalize(samples: Float32Array): Float32Array {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]!));
  if (peak < 0.0008) return samples;
  const gain = Math.min(AGC_MAX_GAIN, AGC_TARGET_PEAK / peak);
  if (gain <= 1.02) return samples;
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i]! * gain;
    // Soft knee limiter
    out[i] = v > 0.95 ? 0.95 : v < -0.95 ? -0.95 : v;
  }
  return out;
}

async function postWav(blob: Blob) {
  if (!publishing || blob.size < 100 || inFlight) return;
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
  const chunkSec = liveAudioChunkSec();
  const rate = mixCtx.sampleRate || targetRate;
  const need = Math.max(1, Math.floor(targetRate * chunkSec));

  processor.onaudioprocess = (ev) => {
    if (!publishing) return;
    const input = ev.inputBuffer.getChannelData(0);
    // Downsample toward target (24–48 kHz by network class)
    const step = Math.max(1, Math.round(rate / targetRate));
    const outRate = Math.round(rate / step);
    const reduced = new Float32Array(Math.ceil(input.length / step));
    for (let i = 0, j = 0; i < input.length; i += step, j++) reduced[j] = input[i]!;
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
      const wav = encodeWav(merged, outRate);
      void postWav(wav);
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
    audio: liveMicConstraints(),
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
  const chunkSec = liveAudioChunkSec();
  const rate = mixCtx.sampleRate || targetRate;
  const need = Math.max(1, Math.floor(targetRate * chunkSec));

  processor.onaudioprocess = (ev) => {
    if (!publishing) return;
    const input = ev.inputBuffer.getChannelData(0);
    const step = Math.max(1, Math.round(rate / targetRate));
    const outRate = Math.round(rate / step);
    const reduced = new Float32Array(Math.ceil(input.length / step));
    for (let i = 0, j = 0; i < input.length; i += step, j++) reduced[j] = input[i]!;
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
      const wav = encodeWav(merged, outRate);
      void postWav(wav);
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

/** Viewer: poll WAV chunks and play after a user gesture (Watch / Join). */
export function createLiveAudioViewer() {
  let stopped = false;
  let lastSeq = 0;
  let timer: number | null = null;
  let current: HTMLAudioElement | null = null;
  let unlocked = false;
  let muted = false;
  let playing = false;

  const unlock = () => {
    unlocked = true;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    try {
      const ctx = new Ctx();
      void ctx.resume();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
      window.setTimeout(() => void ctx.close().catch(() => undefined), 200);
    } catch {
      /* ignore */
    }
    if (!current) {
      current = new Audio();
      current.setAttribute('playsinline', 'true');
      current.preload = 'auto';
    }
  };

  const playBlobUrl = async (url: string) => {
    if (stopped || !unlocked) return;
    // Fetch as blob so Safari accepts WAV reliably
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return;
    const blob = await res.blob();
    if (blob.size < 100) return;
    const obj = URL.createObjectURL(blob);
    const el = new Audio();
    el.setAttribute('playsinline', 'true');
    el.preload = 'auto';
    el.src = obj;
    el.volume = muted ? 0 : 1;
    el.onended = () => {
      URL.revokeObjectURL(obj);
      playing = false;
    };
    el.onerror = () => {
      URL.revokeObjectURL(obj);
      playing = false;
    };
    try {
      playing = true;
      await el.play();
      if (current && current !== el) {
        try {
          current.pause();
          if (current.src.startsWith('blob:')) URL.revokeObjectURL(current.src);
        } catch {
          /* ignore */
        }
      }
      current = el;
    } catch {
      URL.revokeObjectURL(obj);
      playing = false;
    }
  };

  const tick = async () => {
    if (stopped || !unlocked) return;
    // Overlap next chunk ~80ms before end to reduce chop between WAV slices
    if (playing && current && !current.paused && !current.ended) {
      const remain = (current.duration || 0) - (current.currentTime || 0);
      if (Number.isFinite(remain) && remain > 0.08) return;
    }
    const meta = await remoteAudioIsLive();
    if (!meta.live || !meta.seq || meta.seq === lastSeq) return;
    lastSeq = meta.seq;
    await playBlobUrl(liveAudioSrc(meta.seq));
  };

  return {
    unlock,
    setMuted(next: boolean) {
      muted = next;
      if (current) current.volume = muted ? 0 : 1;
    },
    start() {
      stopped = false;
      if (timer) window.clearInterval(timer);
      void tick();
      timer = window.setInterval(() => void tick(), 200);
    },
    stop() {
      stopped = true;
      playing = false;
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      if (current) {
        try {
          current.pause();
          if (current.src.startsWith('blob:')) URL.revokeObjectURL(current.src);
          current.removeAttribute('src');
        } catch {
          /* ignore */
        }
        current = null;
      }
    },
  };
}
