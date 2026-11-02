/**
 * Guest-slot WAV audio publish + gapless viewer (parallel to host /api/live-audio).
 * Group polish: short pending queue, NS mic, longer chunks, checked POSTs.
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
  softNormalize,
} from './livePcmAudio';

const AUDIO_URL = '/api/live-audio';
const MAX_PENDING = 3;

function slotUrl(slot: string, qs = '') {
  const s = encodeURIComponent(slot);
  return qs ? `${AUDIO_URL}?slot=${s}&${qs}` : `${AUDIO_URL}?slot=${s}`;
}

type SlotAudioPub = {
  slot: string;
  publishing: boolean;
  ctx: AudioContext | null;
  processor: ScriptProcessorNode | null;
  micStream: MediaStream | null;
  ownMic: boolean;
  seq: number;
  inFlight: boolean;
  /** Queue up to MAX_PENDING so multi-guest load doesn't drop every other chunk */
  pendingQueue: Blob[];
  pcm: Float32Array[];
  pcmSamples: number;
  lastOkAt: number;
  lastErr: string | null;
  guestCount: number;
};

const pubs = new Map<string, SlotAudioPub>();

function ensure(slot: string): SlotAudioPub {
  let p = pubs.get(slot);
  if (!p) {
    p = {
      slot,
      publishing: false,
      ctx: null,
      processor: null,
      micStream: null,
      ownMic: false,
      seq: 0,
      inFlight: false,
      pendingQueue: [],
      pcm: [],
      pcmSamples: 0,
      lastOkAt: 0,
      lastErr: null,
      guestCount: 1,
    };
    pubs.set(slot, p);
  }
  return p;
}

async function postWav(p: SlotAudioPub, blob: Blob) {
  if (!p.publishing || blob.size < 100) return;
  if (p.inFlight) {
    p.pendingQueue.push(blob);
    while (p.pendingQueue.length > MAX_PENDING) p.pendingQueue.shift();
    return;
  }
  p.inFlight = true;
  p.seq += 1;
  try {
    const res = await fetch(slotUrl(p.slot), {
      method: 'POST',
      body: blob,
      headers: {
        'Content-Type': 'audio/wav',
        'X-Live-Seq': String(p.seq),
        'X-Live-Mime': 'audio/wav',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      p.lastErr = `http-${res.status}`;
    } else {
      p.lastOkAt = Date.now();
      p.lastErr = null;
    }
  } catch (e) {
    p.lastErr = e instanceof Error ? e.message : 'push-fail';
  } finally {
    p.inFlight = false;
    if (p.pendingQueue.length && p.publishing) {
      const next = p.pendingQueue.shift()!;
      void postWav(p, next);
    }
  }
}

function teardown(p: SlotAudioPub) {
  try {
    p.processor?.disconnect();
  } catch {
    /* ignore */
  }
  p.processor = null;
  if (p.ctx) {
    void p.ctx.close().catch(() => undefined);
    p.ctx = null;
  }
  if (p.ownMic && p.micStream) {
    p.micStream.getTracks().forEach((t) => t.stop());
  }
  p.micStream = null;
  p.ownMic = false;
  p.pcm = [];
  p.pcmSamples = 0;
  p.pendingQueue = [];
}

/** Publish guest mic (from existing stream or fresh getUserMedia) to a slot. */
export async function startSlotAudioPublish(
  slot: string,
  stream?: MediaStream | null,
  opts?: { guestCount?: number },
) {
  stopSlotAudioPublish(slot);
  const p = ensure(slot);
  p.publishing = true;
  p.seq = 0;
  p.guestCount = Math.max(1, opts?.guestCount ?? 1);
  p.lastErr = null;

  let mic = stream?.getAudioTracks().some((t) => t.readyState === 'live') ? stream! : null;
  if (!mic) {
    try {
      mic = await navigator.mediaDevices.getUserMedia({
        audio: liveMicConstraints({ multiGuest: true }),
        video: false,
      });
      p.ownMic = true;
    } catch {
      p.publishing = false;
      return false;
    }
  }
  p.micStream = mic;

  const tracks = mic.getAudioTracks().filter((t) => t.readyState === 'live');
  if (!tracks.length) {
    p.publishing = false;
    return false;
  }
  tracks.forEach((t) => {
    t.enabled = true;
  });

  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  p.ctx = new Ctx();
  if (p.ctx.state === 'suspended') void p.ctx.resume();

  const target = liveAudioTargetRate();
  const chunkSec = liveAudioChunkSec(p.guestCount);
  const need = Math.max(1, Math.floor(target * chunkSec));
  const rate = p.ctx.sampleRate || target;
  let lastOutRate = target;
  const src = p.ctx.createMediaStreamSource(new MediaStream(tracks));
  const bus = p.ctx.createGain();
  // Slight boost so guest voice sits with host after softNormalize
  bus.gain.value = 1.12;
  const silent = p.ctx.createGain();
  silent.gain.value = 0;
  const processor = p.ctx.createScriptProcessor(4096, 1, 1);
  p.processor = processor;

  processor.onaudioprocess = (ev) => {
    if (!p.publishing) return;
    if (p.ctx?.state === 'suspended') void p.ctx.resume();
    const input = ev.inputBuffer.getChannelData(0);
    const { samples: reduced, outRate } = downsamplePcm(input, rate, target);
    lastOutRate = outRate;
    p.pcm.push(reduced);
    p.pcmSamples += reduced.length;
    if (p.pcmSamples >= need) {
      const out = new Float32Array(p.pcmSamples);
      let o = 0;
      for (const c of p.pcm) {
        out.set(c, o);
        o += c.length;
      }
      p.pcm = [];
      p.pcmSamples = 0;
      void postWav(p, encodeWav(softNormalize(out), lastOutRate));
    }
  };

  src.connect(bus);
  bus.connect(processor);
  processor.connect(silent);
  silent.connect(p.ctx.destination);
  return true;
}

export function stopSlotAudioPublish(slot: string) {
  const p = pubs.get(slot);
  if (!p) return;
  p.publishing = false;
  teardown(p);
  void fetch(slotUrl(slot, 'clear=1'), { method: 'POST' }).catch(() => undefined);
  pubs.delete(slot);
}

export function stopAllSlotAudioPublish() {
  for (const slot of [...pubs.keys()]) stopSlotAudioPublish(slot);
}

export function slotAudioPublishStats(slot: string) {
  const p = pubs.get(slot);
  if (!p) return null;
  return { lastOkAt: p.lastOkAt, lastErr: p.lastErr, publishing: p.publishing };
}

/** Viewer for one guest audio slot — gapless Web Audio scheduling. */
export function createSlotAudioViewer(slot: string, guestCount = 1) {
  return createGaplessWavViewer({
    metaUrl: slotUrl(slot, 'meta=1'),
    audioUrl: (seq) => slotUrl(slot, `t=${seq}`),
    pollMs: liveAudioPollMs(guestCount),
    volume: 1,
  });
}
