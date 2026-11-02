import type { LiveRecording } from './liveRecordings';
import { pickRecorderMime, saveLiveClip } from './liveRecordingMedia';

/** Build a short stand-in clip so older metadata-only drafts can still Play / open in WorkCut. */
export async function ensureStandInClip(rec: LiveRecording): Promise<Blob> {
  const mime = pickRecorderMime(true);
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no canvas');
  const stream = canvas.captureStream(24);
  return recordCanvas(stream, canvas, ctx, rec, mime);
}

async function recordCanvas(
  stream: MediaStream,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  rec: LiveRecording,
  mime: string,
): Promise<Blob> {
  const chunks: Blob[] = [];
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  } catch {
    recorder = new MediaRecorder(stream);
  }

  const durationMs = Math.min(6000, Math.max(2800, Math.min(rec.durationSec || 6, 12) * 400));
  const started = performance.now();
  let raf = 0;

  const draw = () => {
    const t = (performance.now() - started) / 1000;
    ctx.fillStyle = '#0B1220';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, '#1A7CFF');
    g.addColorStop(1, '#8FFF4A');
    ctx.fillStyle = g;
    ctx.fillRect(40, 180, canvas.width - 80, 420);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 42px system-ui';
    ctx.fillText('LIVE REPLAY', 70, 280);
    ctx.font = '28px system-ui';
    ctx.fillText(rec.title.slice(0, 28), 70, 340);
    ctx.font = '22px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText(`${rec.mode.toUpperCase()} · ${rec.durationSec}s`, 70, 390);
    ctx.fillText(`t=${t.toFixed(1)}s`, 70, 430);
    if (performance.now() - started < durationMs) raf = requestAnimationFrame(draw);
  };
  draw();

  recorder.ondataavailable = (e) => {
    if (e.data?.size) chunks.push(e.data);
  };

  const blob = await new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      cancelAnimationFrame(raf);
      stream.getTracks().forEach((tr) => tr.stop());
      const out = new Blob(chunks, { type: recorder.mimeType || mime || 'video/webm' });
      if (!out.size) reject(new Error('empty stand-in'));
      else resolve(out);
    };
    recorder.onerror = () => reject(new Error('stand-in record failed'));
    recorder.start(200);
    window.setTimeout(() => {
      try {
        recorder.stop();
      } catch {
        reject(new Error('stand-in stop failed'));
      }
    }, durationMs);
  });

  await saveLiveClip(rec.id, blob);
  const { readLiveRecordings, writeLiveRecordings } = await import('./liveRecordings');
  const list = readLiveRecordings();
  const idx = list.findIndex((r) => r.id === rec.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], hasMedia: true, mimeType: blob.type };
    writeLiveRecordings(list);
  }
  return blob;
}
