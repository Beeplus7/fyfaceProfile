const PACKS = [
  { id: "starter", label: "Starter", coins: 100, price: "£0.99" },
  { id: "creator", label: "Creator", coins: 500, price: "£19.99" },
  { id: "pro", label: "Pro Pack", coins: 2000, price: "£49.99" },
];

export function MFCWallet({
  balance = 1247,
  feed = [],
  onBuyPack,
}: {
  balance?: number;
  feed?: { id: string; text: string }[];
  onBuyPack?: (packId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">MFC Wallet</div>
        <div className="text-[22px] font-extrabold text-white">{balance.toLocaleString()}</div>
      </div>
      <div className="mono text-[10px] text-white/40 mt-1">Gift split 70% pro · 30% platform</div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {PACKS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onBuyPack?.(p.id)}
            className="rounded-xl border border-white/10 bg-black/40 px-2 py-2 text-center hover:bg-black/60"
          >
            <div className="text-[12px] font-bold text-white">{p.label}</div>
            <div className="mono text-[10px] text-white/50">{p.coins} · {p.price}</div>
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-1 max-h-[100px] overflow-auto">
        {(feed.length ? feed : [{ id: "1", text: "Crown 100 from viewer · live" }]).map((f) => (
          <div key={f.id} className="mono text-[10px] text-white/55 border border-white/5 rounded-lg px-2 py-1">
            {f.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MFCWallet;
