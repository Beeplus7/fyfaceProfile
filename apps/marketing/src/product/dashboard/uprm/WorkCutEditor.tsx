import { useState } from "react";

const TEMPLATES = [
  { id: "before-after", label: "Before/After" },
  { id: "timelapse", label: "Timelapse" },
  { id: "milestone", label: "Milestone" },
  { id: "price-reveal", label: "Price Reveal" },
] as const;

export function WorkCutEditor({ onExport }: { onExport?: (template: string) => void }) {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">
        WorkCut · CapCut-like · Cutty
      </div>
      <div className="mt-2 text-[13px] text-white/80">
        Templates Before/After · Timelapse · Milestone · Price Reveal £320 · Export 1080×1920 stub · FFmpeg path in apps/web/lib/workcut.ts
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setLast(t.id);
              onExport?.(t.id);
            }}
            className="rounded-full px-3 py-1.5 text-[11px] font-bold text-black"
            style={{
              background:
                "linear-gradient(90deg, #8FFF4A 0%, #00E5C0 25%, #1A7CFF 50%, #FFE600 75%, #FF8A00 100%)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-3 mono text-[10px] text-white/40">
        Auto-tools: trim · captions EN/YO/HA · blur trust badge · stickers Material Cost Duration Tool
        {last ? ` · last ${last}` : ""}
      </div>
    </div>
  );
}

export default WorkCutEditor;
