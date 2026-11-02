import { Link } from "react-router-dom";
import { UPRM_CARD, UPRM_CARD_INNER, UPRM_EYE } from "../../uprmChrome";

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
    <div className={`${UPRM_CARD} p-4`}>
      <div className="flex items-center justify-between">
        <div className={UPRM_EYE}>MFC Wallet</div>
        <div className="text-[22px] font-extrabold text-white">{balance.toLocaleString()}</div>
      </div>
      <div className="mono text-[10px] text-white/40 mt-1">Gift split 70% pro · 30% platform · spend-only</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className={`${UPRM_CARD_INNER} px-2 py-2 text-center`}>
          <div className="mono text-[9px] text-white/40 uppercase">Buy</div>
          <div className="text-[11px] font-bold text-white mt-0.5">Stripe packs</div>
        </div>
        <Link
          to="/app/arcade"
          className="rounded-xl border border-[#8FFF4A]/35 bg-[#8FFF4A]/10 px-2 py-2 text-center hover:bg-[#8FFF4A]/20"
        >
          <div className="mono text-[9px] text-[#8FFF4A]/80 uppercase">Earn</div>
          <div className="text-[11px] font-bold text-[#8FFF4A] mt-0.5">Play games</div>
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {PACKS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onBuyPack?.(p.id)}
            className={`${UPRM_CARD_INNER} px-2 py-2 text-center hover:bg-white/[0.08]`}
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
