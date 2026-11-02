import { useMemo, useState } from "react";

export type KanbanCard = {
  id: string;
  title: string;
  status: string;
  meta?: string;
};

const COLS = [
  "Discovery",
  "Engagement",
  "Inquiry",
  "Quote",
  "Booked",
  "In Progress",
  "Final",
  "Review",
  "Repeat",
] as const;

export function PipelineKanban({
  cards: initial,
  onMove,
}: {
  cards: KanbanCard[];
  onMove?: (id: string, status: string) => void;
}) {
  const [cards, setCards] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);

  const byCol = useMemo(() => {
    const map: Record<string, KanbanCard[]> = Object.fromEntries(COLS.map((c) => [c, []]));
    for (const card of cards) {
      const key = COLS.includes(card.status as (typeof COLS)[number]) ? card.status : "Discovery";
      map[key].push(card);
    }
    return map;
  }, [cards]);

  const drop = (status: string) => {
    if (!dragId) return;
    setCards((prev) => prev.map((c) => (c.id === dragId ? { ...c, status } : c)));
    onMove?.(dragId, status);
    setDragId(null);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 overflow-x-auto">
      <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase mb-3">
        Pipeline · Discovery→Repeat
      </div>
      <div className="flex gap-2 min-w-max">
        {COLS.map((col) => (
          <div
            key={col}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(col)}
            className="w-[140px] shrink-0 rounded-xl border border-white/10 bg-black/30 p-2 min-h-[160px]"
          >
            <div className="mono text-[9px] text-white/50 mb-2">
              {col} · {byCol[col].length}
            </div>
            <div className="space-y-1.5">
              {byCol[col].map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => setDragId(card.id)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 cursor-grab active:cursor-grabbing"
                >
                  <div className="text-[11px] font-semibold text-white leading-tight">{card.title}</div>
                  {card.meta ? (
                    <div className="mono text-[9px] text-white/40 mt-0.5">{card.meta}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PipelineKanban;
