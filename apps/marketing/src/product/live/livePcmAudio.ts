/**
 * Shared PCM/WAV helpers + gapless Web Audio viewer for live relays.
 * HTMLAudioElement-per-chunk caused choppy group-live audio; we schedule buffers.
 */

/** Soft AGC — speech-forward for group live without harsh pumping. */
const AGC_TARGET_PEAK = 0.78;
const AGC_MAX_GAIN = 3.0;

export function writeWavString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

/** Encode mono float32 PCM (-1..1) as 16-bit WAV. */
export function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeWavString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeWavString(view, 8, 'WAVE');
  writeWavString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeWavString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

export function mergePcm(chunks: Float32Array[], total: number): Float32Array {
  const out = new Float32Array(total);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

/** Soft peak normalize — quieter voice boost without heavy pumping. */
export function softNormalize(samples: Float32Array): Float32Array {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]!));
  if (peak < 0.0008) return samples;
  const gain = Math.min(AGC_MAX_GAIN, AGC_TARGET_PEAK / peak);
  if (gain <= 1.02) return samples;
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i]! * gain;
    out[i] = v > 0.92 ? 0.92 : v < -0.92 ? -0.92 : v;
  }
  return out;
}

/**
 * Downsample with box averaging (far less aliasing than pick-every-Nth).
 * Returns { samples, outRate }.
 */
export function downsamplePcm(
  input: Float32Array,
  inRate: number,
  targetRate: number,
): { samples: Float32Array; outRate: number } {
  if (inRate <= targetRate * 1.08) {
    return { samples: input.slice(), outRate: Math.round(inRate) };
  }
  const step = inRate / targetRate;
  const outLen = Math.max(1, Math.floor(input.length / step));
  const out = new Float32Array(outLen);
  for (let j = 0; j < outLen; j++) {
    const start = Math.floor(j * step);
    const end = Math.min(input.length, Math.floor((j + 1) * step));
    let sum = 0;
    const n = Math.max(1, end - start);
    for (let i = start; i < end; i++) sum += input[i]!;
    out[j] = sum / n;
  }
  return { samples: out, outRate: Math.round(targetRate) };
}

export type GaplessViewer = {
  unlock: () => void;
  setMuted: (next: boolean) => void;
  start: () => void;
  stop: () => void;
};

type GaplessOpts = {
  /** Build URL for meta / audio fetch. `meta=1` and `t=seq` style. */
  metaUrl: string;
  audioUrl: (seq: number) => string;
  pollMs?: number;
  volume?: number;
};

/**
 * Gapless WAV chunk player via AudioContext scheduling.
 * Much smoother than new Audio() per chunk (group live / multi-slot).
 */
export function createGaplessWavViewer(opts: GaplessOpts): GaplessViewer {
  const pollMs = opts.pollMs ?? 140;
  const baseVol = opts.volume ?? 1;
  let stopped = false;
  let unlocked = false;
  let muted = false;
  let lastSeq = 0;
  let timer: number | null = null;
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let nextTime = 0;
  let decoding = false;
  let pendingBlob: Blob | null = null;

  const ensureCtx = () => {
    if (ctx) return ctx;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctx();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : baseVol;
    master.connect(ctx.destination);
    return ctx;
  };

  const unlock = () => {
    unlocked = true;
    const c = ensureCtx();
    if (c.state === 'suspended') void c.resume();
    try {
      const osc = c.createOscillator();
      const g = c.createGain();
      g.gain.value = 0.0001;
      osc.connect(g);
      g.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.04);
    } catch {
      /* ignore */
    }
  };

  const scheduleBlob = async (blob: Blob) => {
    if (stopped || !unlocked || muted) return;
    const c = ensureCtx();
    if (c.state === 'suspended') await c.resume();
    if (decoding) {
      pendingBlob = blob;
      return;
    }
    decoding = true;
    try {
      const ab = await blob.arrayBuffer();
      const buf = await c.decodeAudioData(ab.slice(0));
      if (stopped) return;
      const src = c.createBufferSource();
      src.buffer = buf;
      src.connect(master!);
      const now = c.currentTime;
      // Small lookahead; if we fell behind, catch up without stacking echo
      if (nextTime < now + 0.03) nextTime = now + 0.03;
      // Cap backlog so multi-slot decode lag doesn't create delayed "radio" voice
      if (nextTime > now + 0.55) nextTime = now + 0.05;
      src.start(nextTime);
      nextTime += buf.duration;
    } catch {
      /* bad chunk — skip */
    } finally {
      decoding = false;
      if (pendingBlob && !stopped) {
        const next = pendingBlob;
        pendingBlob = null;
        void scheduleBlob(next);
      }
    }
  };

  const tick = async () => {
    if (stopped || !unlocked) return;
    try {
      const metaRes = await fetch(opts.metaUrl, { cache: 'no-store' });
      if (!metaRes.ok) return;
      const meta = (await metaRes.json()) as { live?: boolean; seq?: number };
      if (!meta.live || !meta.seq || meta.seq === lastSeq) return;
      lastSeq = meta.seq;
      const res = await fetch(opts.audioUrl(meta.seq), { cache: 'no-store' });
      if (!res.ok) return;
      const blob = await res.blob();
      if (blob.size < 100) return;
      await scheduleBlob(blob);
    } catch {
      /* ignore */
    }
  };

  return {
    unlock,
    setMuted(next: boolean) {
      muted = next;
      if (master) master.gain.value = muted ? 0 : baseVol;
    },
    start() {
      stopped = false;
      if (timer) window.clearInterval(timer);
      void tick();
      timer = window.setInterval(() => void tick(), pollMs);
    },
    stop() {
      stopped = true;
      pendingBlob = null;
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      if (ctx) {
        void ctx.close().catch(() => undefined);
        ctx = null;
        master = null;
        nextTime = 0;
      }
    },
  };
}
