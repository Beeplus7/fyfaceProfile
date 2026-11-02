/**
 * Guest-slot WAV audio publish + viewer (parallel to host /api/live-audio).
 */

import { liveAudioChunkSec, liveAudioTargetRate, liveMicConstraints } from './liveQuality';

const AUDIO_URL = '/api/live-audio';

function slotUrl(slot: string, qs = '') {
  const s = encodeURIComponent(slot);
  return qs ? `${AUDIO_URL}?slot=${s}&${qs}` : `${AUDIO_URL}?slot=${s}`;
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const write = (o: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(o + i, str.charCodeAt(i));
  };
  write(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

function softNormalize(samples: Float32Array): Float32Array {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]!));
  if (peak < 0.0008) return samples;
  const gain = Math.min(4.2, 0.75 / peak);
  if (gain <= 1.02) return samples;
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i]! * gain;
    out[i] = v > 0.95 ? 0.95 : v < -0.95 ? -0.95 : v;
  }
  return out;
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
  pcm: Float32Array[];
  pcmSamples: number;
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
      pcm: [],
      pcmSamples: 0,
    };
    pubs.set(slot, p);
  }
  return p;
}

async function postWav(p: SlotAudioPub, blob: Blob) {
  if (!p.publishing || blob.size < 100 || p.inFlight) return;
  p.inFlight = true;
  p.seq += 1;
  try {
    await fetch(slotUrl(p.slot), {
      method: 'POST',
      body: blob,
      headers: {
        'Content-Type': 'audio/wav',
        'X-Live-Seq': String(p.seq),
        'X-Live-Mime': 'audio/wav',
      },
      cache: 'no-store',
    });
  } catch {
    /* ignore */
  } finally {
    p.inFlight = false;
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
}

/** Publish guest mic (from existing stream or fresh getUserMedia) to a slot. */
export async function startSlotAudioPublish(slot: string, stream?: MediaStream | null) {
  stopSlotAudioPublish(slot);
  const p = ensure(slot);
  p.publishing = true;
  p.seq = 0;

  let mic = stream?.getAudioTracks().some((t) => t.readyState === 'live') ? stream! : null;
  if (!mic) {
    try {
      mic = await navigator.mediaDevices.getUserMedia({
        audio: liveMicConstraints(),
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
  const chunkSec = liveAudioChunkSec();
  const need = Math.max(1, Math.floor(target * chunkSec));
  const rate = p.ctx.sampleRate || target;
  const src = p.ctx.createMediaStreamSource(new MediaStream(tracks));
  const bus = p.ctx.createGain();
  bus.gain.value = 1.15;
  const silent = p.ctx.createGain();
  silent.gain.value = 0;
  const processor = p.ctx.createScriptProcessor(4096, 1, 1);
  p.processor = processor;

  processor.onaudioprocess = (ev) => {
    if (!p.publishing) return;
    const input = ev.inputBuffer.getChannelData(0);
    const step = Math.max(1, Math.round(rate / target));
    const outRate = Math.round(rate / step);
    const reduced = new Float32Array(Math.ceil(input.length / step));
    for (let i = 0, j = 0; i < input.length; i += step, j++) reduced[j] = input[i]!;
    p.pcm.push(reduced);
    p.pcmSamples += reduced.length;
    if (p.pcmSamples >= need) {
      const merged = softNormalize(
        (() => {
          const out = new Float32Array(p.pcmSamples);
          let o = 0;
          for (const c of p.pcm) {
            out.set(c, o);
            o += c.length;
          }
          return out;
        })(),
      );
      p.pcm = [];
      p.pcmSamples = 0;
      void postWav(p, encodeWav(merged, outRate));
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

/** Viewer for one guest audio slot. */
export function createSlotAudioViewer(slot: string) {
  let stopped = false;
  let lastSeq = 0;
  let timer: number | null = null;
  let current: HTMLAudioElement | null = null;
  let unlocked = false;
  let muted = false;

  const unlock = () => {
    unlocked = true;
  };

  const tick = async () => {
    if (stopped || !unlocked || muted) return;
    try {
      const metaRes = await fetch(slotUrl(slot, 'meta=1'), { cache: 'no-store' });
      if (!metaRes.ok) return;
      const meta = (await metaRes.json()) as { live?: boolean; seq?: number };
      if (!meta.live || !meta.seq || meta.seq === lastSeq) return;
      lastSeq = meta.seq;
      const res = await fetch(slotUrl(slot, `t=${meta.seq}`), { cache: 'no-store' });
      if (!res.ok) return;
      const blob = await res.blob();
      if (blob.size < 100) return;
      const obj = URL.createObjectURL(blob);
      const el = new Audio();
      el.setAttribute('playsinline', 'true');
      el.src = obj;
      el.volume = muted ? 0 : 0.95;
      el.onended = () => URL.revokeObjectURL(obj);
      el.onerror = () => URL.revokeObjectURL(obj);
      try {
        await el.play();
        if (current) {
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
      }
    } catch {
      /* ignore */
    }
  };

  return {
    unlock,
    setMuted(next: boolean) {
      muted = next;
      if (current) current.volume = muted ? 0 : 0.95;
    },
    start() {
      stopped = false;
      if (timer) window.clearInterval(timer);
      void tick();
      timer = window.setInterval(() => void tick(), 260);
    },
    stop() {
      stopped = true;
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      if (current) {
        try {
          current.pause();
          if (current.src.startsWith('blob:')) URL.revokeObjectURL(current.src);
        } catch {
          /* ignore */
        }
        current = null;
      }
    },
  };
}
