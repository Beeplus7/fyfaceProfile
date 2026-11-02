const TEMPLATES = ["Before/After", "Timelapse", "Milestone", "Price Reveal"];

export function WorkCutEditor({ onExport }: { onExport?: (template: string) => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">
        WorkCut · CapCut-like stub
      </div>
      <div className="mt-2 text-[13px] text-white/80">
        Templates ready — FFmpeg.wasm / Cloudinary in Sprint 2 · Cutty bot
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onExport?.(t)}
            className="rounded-full px-3 py-1.5 text-[11px] font-bold text-black"
            style={{
              background:
                "linear-gradient(90deg, #8FFF4A 0%, #00E5C0 25%, #1A7CFF 50%, #FFE600 75%, #FF8A00 100%)",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-3 mono text-[10px] text-white/40">
        Auto-tools: trim · captions Yoruba/Hausa · blur trust badge · stickers
      </div>
    </div>
  );
}

export default WorkCutEditor;
