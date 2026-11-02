'use client';

import { useState } from 'react';
import {
  WORKCUT_TEMPLATES,
  applyTemplate,
  cuttyAutoTools,
  exportVideo,
  type WorkCutTemplateId,
} from '../../lib/workcut';

export function WorkCutEditor({ onExport }: { onExport?: (template: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<string>('');
  const cutty = cuttyAutoTools('Tailor');

  const run = async (id: WorkCutTemplateId) => {
    setBusy(true);
    try {
      const timeline = applyTemplate(id, {
        template: id,
        cost: 320,
        materials: [{ name: 'Lace', cost: 45 }],
        team: ['Ayo', '+2'],
        milestones: [
          { label: 'Cutting', done: true },
          { label: 'Sewing', done: true },
          { label: 'Fitting', done: false },
        ],
        trade: 'Tailor',
      });
      const out = await exportVideo(timeline);
      setPreview(out.url);
      setMode(out.mode);
      onExport?.(id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">
        WorkCut · CapCut-like · Cutty
      </div>
      <div className="mt-2 text-[13px] text-white/80">
        Templates · FFmpeg.wasm when installed · Export 1080×1920 15s · Price Reveal £320
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(WORKCUT_TEMPLATES) as WorkCutTemplateId[]).map((id) => (
          <button
            key={id}
            type="button"
            disabled={busy}
            onClick={() => void run(id)}
            className="rounded-full px-3 py-1.5 text-[11px] font-bold text-black disabled:opacity-50"
            style={{
              background:
                'linear-gradient(90deg, #8FFF4A 0%, #00E5C0 25%, #1A7CFF 50%, #FFE600 75%, #FF8A00 100%)',
            }}
          >
            {WORKCUT_TEMPLATES[id].label}
          </button>
        ))}
      </div>
      <div className="mt-3 mono text-[10px] text-white/40">
        Auto-tools: {cutty.stickers.join(' · ')} · captions {cutty.captions.join('/')} · mode {mode || '—'}
      </div>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="WorkCut export preview" className="mt-3 w-full max-h-48 object-cover rounded-xl border border-white/10" />
      ) : null}
    </div>
  );
}

export default WorkCutEditor;
