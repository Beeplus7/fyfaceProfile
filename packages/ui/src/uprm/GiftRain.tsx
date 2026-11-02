import { useEffect, useState } from "react";

const GIFTS = [
  { kind: "Hammer", emoji: "🔨", coins: 10 },
  { kind: "Scissors", emoji: "✂", coins: 25 },
  { kind: "Heart", emoji: "❤", coins: 50 },
  { kind: "Crown", emoji: "👑", coins: 100 },
  { kind: "Trophy", emoji: "🏆", coins: 500 },
];

type Drop = { id: number; emoji: string; x: number };

export function GiftRain({
  trigger,
  onGift,
}: {
  trigger?: number;
  onGift?: (kind: string, coins: number) => void;
}) {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const batch: Drop[] = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      emoji: GIFTS[i % GIFTS.length].emoji,
      x: Math.random() * 90 + 5,
    }));
    setDrops((d) => [...d, ...batch]);
    const t = setTimeout(() => setDrops((d) => d.slice(batch.length)), 2200);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 overflow-hidden min-h-[120px]">
      <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">Gift Rain · MFC</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {GIFTS.map((g) => (
          <button
            key={g.kind}
            type="button"
            onClick={() => onGift?.(g.kind, g.coins)}
            className="rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[12px] text-white hover:bg-black/60"
          >
            {g.emoji} {g.kind} · {g.coins}
          </button>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0">
        {drops.map((d) => (
          <span
            key={d.id}
            className="absolute text-2xl animate-bounce"
            style={{ left: `${d.x}%`, top: "10%" }}
          >
            {d.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

export default GiftRain;
