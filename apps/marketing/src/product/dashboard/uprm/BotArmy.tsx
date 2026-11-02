const BOTS = [
  { id: "milo", name: "Milo", role: "Onboarding" },
  { id: "cutty", name: "Cutty", role: "WorkCut" },
  { id: "quoto", name: "Quoto", role: "Quotes" },
  { id: "timi", name: "Timi", role: "Schedule" },
  { id: "findy", name: "Findy", role: "Discovery" },
  { id: "helpy", name: "Helpy", role: "FAQ" },
  { id: "veri", name: "Veri", role: "Trust" },
  { id: "growy", name: "Growy", role: "Boost" },
  { id: "lingo", name: "Lingo", role: "Langs" },
];

export function BotArmy({ activeIds }: { activeIds?: string[] }) {
  const active = new Set(activeIds ?? BOTS.map((b) => b.id));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">Bot Army · 9</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {BOTS.map((b) => {
          const on = active.has(b.id);
          return (
            <div
              key={b.id}
              className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 flex items-center gap-2"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: on ? "#8FFF4A" : "#64748B" }}
              />
              <span className="text-[12px] font-bold text-white">{b.name}</span>
              <span className="mono text-[9px] text-white/45">{b.role}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BotArmy;
