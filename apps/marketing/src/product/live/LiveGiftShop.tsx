import { useEffect, useMemo, useState } from 'react';
import {
  LIVE_GIFT_CATEGORIES,
  LIVE_GIFTS,
  broadcastLiveGift,
  giftsInCategory,
  readMfcWallet,
  writeMfcWallet,
  type LiveGift,
  type LiveGiftCategory,
} from './liveGifts';
import './liveGifts.css';

/** Screenshot-style tab labels; data categories stay unchanged. */
const TAB_LABEL: Record<LiveGiftCategory, string> = {
  Popular: 'Gifts',
  Animals: 'Interactive',
  Rockets: 'Exclusive',
  Tools: 'Tools',
  Premium: 'Premium',
};

const BADGE_GIFTS = new Set([
  'dragon',
  'phoenix',
  'galaxy',
  'diamond',
  'castle',
  'yacht',
  'legend',
  'firework',
  'unicorn',
]);

type Props = {
  open: boolean;
  onClose: () => void;
  fromName: string;
  onSent?: (gift: LiveGift) => void;
};

function Coin({ lg }: { lg?: boolean }) {
  return <span className={`lg-coin ${lg ? 'lg-coin-lg' : ''}`} aria-hidden>¢</span>;
}

export default function LiveGiftShop({ open, onClose, fromName, onSent }: Props) {
  const [cat, setCat] = useState<LiveGiftCategory>('Popular');
  const [selected, setSelected] = useState<LiveGift | null>(LIVE_GIFTS[0] ?? null);
  const [balance, setBalance] = useState(() => readMfcWallet());
  const [lowFlash, setLowFlash] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setBalance(readMfcWallet());
    const sync = () => setBalance(readMfcWallet());
    window.addEventListener('myface-mfc-wallet', sync);
    return () => window.removeEventListener('myface-mfc-wallet', sync);
  }, [open]);

  const items = useMemo(() => giftsInCategory(cat), [cat]);

  useEffect(() => {
    if (!items.length) return;
    if (!selected || selected.category !== cat) setSelected(items[0]);
  }, [cat, items, selected]);

  if (!open) return null;

  const sendGift = (gift: LiveGift) => {
    if (sending) return;
    const bal = readMfcWallet();
    if (bal < gift.coins) {
      setLowFlash(true);
      window.setTimeout(() => setLowFlash(false), 1100);
      return;
    }
    setSending(true);
    writeMfcWallet(bal - gift.coins);
    setBalance(bal - gift.coins);
    broadcastLiveGift({ gift, fromName, at: Date.now() });
    onSent?.(gift);
    setSending(false);
  };

  const recharge = () => {
    const next = readMfcWallet() + 100;
    writeMfcWallet(next);
    setBalance(next);
    setLowFlash(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end" role="dialog" aria-label="Gifts">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close gifts" onClick={onClose} />

      <div className="lg-sheet relative flex max-h-[58svh] flex-col overflow-hidden rounded-t-[18px] bg-[#1a1a1a]/98 shadow-[0_-8px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        {/* Grab + header */}
        <div className="shrink-0 px-3.5 pt-2.5 pb-1">
          <div className="mx-auto mb-2.5 h-1 w-9 rounded-full bg-white/20" />
          <div className="flex items-center gap-1.5 text-[13px] font-medium leading-tight text-white/75">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-[#FE2C55]">
              <path
                d="M12 2l1.2 4.2L17 7.5l-3.8 1.3L12 13l-1.2-4.2L7 7.5l3.8-1.3L12 2zM18.5 13l.7 2.4 2.3.8-2.3.8-.7 2.4-.7-2.4-2.3-.8 2.3-.8.7-2.4zM6.5 14l.5 1.8 1.7.6-1.7.6-.5 1.8-.5-1.8-1.7-.6 1.7-.6.5-1.8z"
                fill="currentColor"
              />
            </svg>
            <span className="truncate">Explore unique ways to express your love</span>
          </div>
        </div>

        {/* Gift grid */}
        <div className="lg-shop-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-1">
          <div className="grid grid-cols-4 gap-x-0.5 gap-y-1">
            {items.map((g) => {
              const active = selected?.id === g.id;
              const showNew = BADGE_GIFTS.has(g.id) || g.coins >= 999;
              const showVideo = g.anim === 'combo' || g.category === 'Premium' || g.coins >= 299;
              return (
                <button
                  key={g.id}
                  type="button"
                  className={`lg-tile-press relative flex flex-col items-center rounded-xl px-1 pb-1.5 pt-2 transition-colors ${
                    active ? 'lg-tile-active' : 'hover:bg-white/[0.04]'
                  }`}
                  onClick={() => {
                    if (active) sendGift(g);
                    else setSelected(g);
                  }}
                >
                  {showNew ? (
                    <span className="absolute left-1 top-1 z-[1] rounded-[3px] bg-[#FE2C55] px-[4px] py-[1px] text-[8px] font-extrabold leading-none tracking-wide text-white">
                      NEW
                    </span>
                  ) : null}
                  {showVideo ? (
                    <span
                      className="absolute right-1 top-1 z-[1] flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-black/45 text-white/70"
                      title="Full-screen animation"
                    >
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                        <rect x="1" y="2" width="7" height="8" rx="1" opacity="0.9" />
                        <rect x="4" y="1" width="7" height="8" rx="1" opacity="0.55" />
                      </svg>
                    </span>
                  ) : null}

                  <span
                    className="lg-tile-emoji text-[42px] leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
                    style={
                      active
                        ? { filter: `drop-shadow(0 0 12px ${g.tint}) drop-shadow(0 0 4px ${g.tint})` }
                        : undefined
                    }
                  >
                    {g.emoji}
                  </span>

                  {active ? (
                    <span className="lg-send-pill mt-1.5 flex h-[26px] w-[72px] items-center justify-center rounded-full bg-[#FE2C55] text-[12px] font-bold text-white shadow-[0_2px_10px_rgba(254,44,85,0.45)]">
                      Send
                    </span>
                  ) : (
                    <span className="mt-1.5 w-full truncate px-0.5 text-center text-[11px] leading-tight text-white/80">
                      {g.name}
                    </span>
                  )}

                  <span className="mt-0.5 flex items-center justify-center gap-[3px] text-[11px] font-semibold tabular-nums text-[#FFD400]">
                    <Coin />
                    {g.coins}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom chrome: tabs + recharge (TikTok layout) */}
        <div className="shrink-0 border-t border-white/[0.08] bg-[#141414]/95 px-2 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))]">
          <div className="flex items-end gap-0.5">
            <div className="flex min-w-0 flex-1 items-end gap-0 overflow-x-auto scrollbar-none">
              {LIVE_GIFT_CATEGORIES.map((c) => {
                const on = cat === c;
                return (
                  <button
                    key={c}
                    type="button"
                    className={`relative shrink-0 px-2.5 pb-2 pt-1.5 text-[13px] font-semibold transition-colors ${
                      on ? 'text-white' : 'text-white/40'
                    }`}
                    onClick={() => setCat(c)}
                  >
                    {TAB_LABEL[c]}
                    {on ? (
                      <span className="absolute bottom-0.5 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#FE2C55]" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mb-1.5 flex shrink-0 items-center gap-1.5 pl-1">
              <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-full text-[13px] font-bold text-white/45"
                aria-label="Help"
              >
                ?
              </button>
              <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-full text-[14px] text-[#FFD400]"
                aria-label="Rankings"
              >
                ♛
              </button>
              <button
                type="button"
                onClick={recharge}
                className={`flex h-8 items-center gap-1 rounded-full pl-1.5 pr-2.5 text-[12px] font-bold transition ${
                  lowFlash
                    ? 'animate-pulse bg-[#FE2C55] text-white'
                    : 'bg-transparent text-[#FFD400]'
                }`}
              >
                <Coin lg />
                <span className="tabular-nums text-white/90">{balance.toLocaleString()}</span>
                <span className={lowFlash ? 'text-white/90' : 'text-[#FFD400]'}>Recharge ›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
