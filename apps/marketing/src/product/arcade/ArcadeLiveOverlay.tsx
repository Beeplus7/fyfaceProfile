import { useEffect, useState } from 'react';

/** Arcade Live — stream while playing (Mux/LiveKit stub, same pattern as Live Workshop). */
export function ArcadeLiveOverlay({
  live,
  onToggle,
  gameTitle,
}: {
  live: boolean;
  onToggle: () => void;
  gameTitle: string;
}) {
  const [viewers, setViewers] = useState(0);
  const [gifts, setGifts] = useState<{ id: number; text: string }[]>([]);

  useEffect(() => {
    if (!live) {
      setViewers(0);
      return;
    }
    setViewers(3);
    const tick = setInterval(() => setViewers((v) => Math.min(240, v + Math.floor(Math.random() * 4) + 1)), 1200);
    const rain = setInterval(() => {
      const emoji = ['🔨', '✂️', '💜', '👑', '🏆'][Math.floor(Math.random() * 5)];
      setGifts((g) =>
        [{ id: Date.now(), text: `${emoji} gift from viewer` }, ...g].slice(0, 5),
      );
    }, 2800);
    return () => {
      clearInterval(tick);
      clearInterval(rain);
    };
  }, [live]);

  return (
    <div className="rounded-xl border border-white/10 bg-black/50 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="mono text-[10px] tracking-[0.14em] text-white/40 uppercase font-semibold">Arcade Live</div>
        <div className="flex items-center gap-2 mono text-[10px] text-white/55">
          <span className={`h-1.5 w-1.5 rounded-[2px] ${live ? 'bg-red-400' : 'bg-white/30'}`} />
          {live ? 'LIVE' : 'OFF'} · {viewers} · {gameTitle}
        </div>
      </div>
      {live ? (
        <div className="space-y-1 max-h-[72px] overflow-hidden">
          {gifts.map((g) => (
            <div key={g.id} className="mono text-[10px] text-white/70">
              {g.text}
            </div>
          ))}
          {!gifts.length ? (
            <div className="mono text-[10px] text-white/35">Waiting for gift rain…</div>
          ) : null}
        </div>
      ) : (
        <div className="mono text-[10px] text-white/40">Stream this run · record → Work Feed</div>
      )}
      <button
        type="button"
        onClick={onToggle}
        className="w-full h-9 rounded-lg border border-white/15 bg-white text-black text-[11px] font-semibold hover:bg-white/90"
      >
        {live ? 'End live' : 'Start live'}
      </button>
    </div>
  );
}

export default ArcadeLiveOverlay;
