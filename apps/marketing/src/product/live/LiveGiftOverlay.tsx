import { useEffect, useState } from 'react';
import {
  LIVE_GIFT_EVENT,
  type LiveGiftAnim,
  type LiveGiftSendPayload,
} from './liveGifts';
import './liveGifts.css';

type Effect = {
  id: string;
  payload: LiveGiftSendPayload;
};

const ANIM_MS: Record<LiveGiftAnim, number> = {
  float: 2500,
  burst: 1700,
  rain: 2300,
  rocket: 2200,
  orbit: 2700,
  stampede: 2100,
  spin: 1800,
  combo: 2800,
};

function animClass(anim: LiveGiftAnim): string {
  return anim === 'combo' ? 'lg-combo-hero' : `lg-${anim}`;
}

function particleCount(anim: LiveGiftAnim, premium: boolean): number {
  if (anim === 'combo' || premium) return 12;
  if (anim === 'rain' || anim === 'stampede') return 9;
  if (anim === 'burst' || anim === 'orbit') return 7;
  return 5;
}

export default function LiveGiftOverlay() {
  const [effects, setEffects] = useState<Effect[]>([]);

  useEffect(() => {
    const onGift = (ev: Event) => {
      const detail = (ev as CustomEvent<LiveGiftSendPayload>).detail;
      if (!detail?.gift) return;
      const id = `g_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setEffects((prev) => [...prev.slice(-6), { id, payload: detail }]);
      const ms = ANIM_MS[detail.gift.anim] ?? 2200;
      window.setTimeout(() => {
        setEffects((prev) => prev.filter((e) => e.id !== id));
      }, ms + 200);
    };
    window.addEventListener(LIVE_GIFT_EVENT, onGift);
    return () => window.removeEventListener(LIVE_GIFT_EVENT, onGift);
  }, []);

  if (!effects.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden" aria-hidden>
      {effects.map(({ id, payload }, idx) => {
        const { gift, fromName } = payload;
        const premium = gift.category === 'Premium' || gift.anim === 'combo';
        const n = particleCount(gift.anim, premium);
        const glyphs = [gift.emoji, ...(gift.particles ?? [])];
        const heroSize = premium ? 'text-[80px] md:text-[104px]' : 'text-[64px] md:text-[80px]';
        const bannerTop = 14 + (idx % 3) * 7;

        return (
          <div key={id} className="absolute inset-0">
            {/* TikTok-style combo / send banner */}
            <div
              className="lg-banner absolute left-0 z-[2] flex max-w-[78%] items-center gap-2 overflow-hidden rounded-r-full py-1.5 pl-1.5 pr-4"
              style={{
                top: `${bannerTop}%`,
                background: `linear-gradient(90deg, ${gift.tint}ee 0%, ${gift.tint}99 42%, rgba(0,0,0,0.55) 100%)`,
                boxShadow: `0 4px 24px ${gift.tint}66`,
              }}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/35 text-[18px] ring-1 ring-white/25">
                {gift.emoji}
              </span>
              <div className="min-w-0 leading-tight">
                <div className="truncate text-[12px] font-extrabold text-white drop-shadow">
                  {fromName}
                </div>
                <div className="truncate text-[11px] font-semibold text-white/90">
                  sent {gift.name}
                </div>
              </div>
              <span className="ml-1 shrink-0 text-[22px] drop-shadow">{gift.emoji}</span>
            </div>

            {/* Hero emoji */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`${animClass(gift.anim)} ${heroSize} drop-shadow-[0_12px_40px_rgba(0,0,0,0.7)]`}
                style={{ filter: `drop-shadow(0 0 22px ${gift.tint})` }}
              >
                {gift.emoji}
              </span>
            </div>

            {/* Particles */}
            {Array.from({ length: n }).map((_, i) => {
              const glyph = glyphs[i % glyphs.length];
              const left = 6 + ((i * 17 + gift.coins) % 84);
              const top = 10 + ((i * 23) % 72);
              const delay = i * 0.07;
              const size = premium ? 30 + (i % 4) * 6 : 22 + (i % 3) * 4;
              return (
                <span
                  key={`${id}_p${i}`}
                  className={animClass(gift.anim === 'combo' ? 'burst' : gift.anim)}
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    top: `${top}%`,
                    fontSize: size,
                    animationDelay: `${delay}s`,
                    opacity: 0.95,
                  }}
                >
                  {glyph}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
