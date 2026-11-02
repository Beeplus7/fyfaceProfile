import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import posterLace from '../../assets/c580b278bd1bf106-image_20261029_175419.webp';
import posterSew from '../../assets/2f721bcceb44c761-image_20261029_175423.webp';
import posterDress from '../../assets/1269da9d7e2d4f51-image_20261029_175429.webp';
import posterStudio from '../../assets/bd87313c9fb90d22-image_20261029_175419.webp';
import posterFit from '../../assets/1f34e182625d0051-image_20261029_181559.webp';
import posterDetail from '../../assets/35ca56917d3e0882-image_20261029_180640.webp';
import { readBroadcast } from '../demo/testLab';
import { TEMPLATE_MAKERS } from '../makers/templateMakers';
import { WORK_CATEGORIES } from '../makers/workCategories';
import { isOnboardingDone } from '../onboarding/storage';

const POSTERS = [posterLace, posterSew, posterDress, posterStudio, posterFit, posterDetail];

/** Matches feed top-rail categories — each opens Discover with ?cat= */
const CATEGORIES = ['All', 'For You', 'Following', 'WorkCuts', 'Live Replays', 'Oldham OL1', ...WORK_CATEGORIES] as const;

type Category = (typeof CATEGORIES)[number];

const TRADES = ['All', ...WORK_CATEGORIES] as const;

const TRENDING = TEMPLATE_MAKERS.map((m) => ({
  id: m.id,
  title: `${m.trade} · 30s WorkCut template`,
  maker: m.name,
  trade: m.trade,
  views: '—',
  tag: 'WorkCut' as const,
  live: false,
  loc: m.loc,
}));

function parseCategory(raw: string | null): Category {
  if (!raw) return 'All';
  const hit = CATEGORIES.find((c) => c.toLowerCase() === raw.toLowerCase());
  return hit ?? 'All';
}

function matchesCategory(
  item: (typeof TRENDING)[number],
  cat: Category,
): boolean {
  if (cat === 'All' || cat === 'For You') return true;
  if (cat === 'Following') return TEMPLATE_MAKERS.slice(0, 6).some((m) => m.name === item.maker);
  if (cat === 'WorkCuts') return item.tag === 'WorkCut';
  if (cat === 'Live Replays') return item.live;
  if (cat === 'Oldham OL1') return item.loc === 'OL1';
  return item.trade.toLowerCase() === cat.toLowerCase();
}

const NEARBY = TEMPLATE_MAKERS.slice(0, 12).map((m, i) => ({
  id: m.id,
  name: m.name,
  trade: m.trade,
  loc: `Oldham ${m.loc}`,
  trust: 4.8,
  mfc: 0,
  mi: Math.round((0.5 + i * 0.35) * 10) / 10,
}));

const LIVE_TITLES = [
  'Lace hem marathon',
  'Bridal fitting room',
  'Workshop Q&A',
  'Aso-Ebi night cut',
  'Fade design live',
  'Boiler bleed OL1',
  'Consumer unit check',
  'Agbada stitch stream',
  'Gift rain hour',
  'Quote Royale live',
];

const LIVE_MAKERS = ["AYO'S", 'SARAH', 'BOLA', 'NAILAH', 'TUNDE', 'KEMI', 'CHIDI', 'FATIMA'];

/** ~30 active live sessions inside radius (demo seed for nearby Oldham). */
const LIVE_NEARBY = Array.from({ length: 30 }, (_, i) => ({
  id: `live_${i + 1}`,
  title: LIVE_TITLES[i % LIVE_TITLES.length],
  maker: LIVE_MAKERS[i % LIVE_MAKERS.length],
  viewers: 18 + ((i * 17) % 220),
  mi: Number((0.4 + (i % 10) * 0.9 + (i % 3) * 0.2).toFixed(1)),
  trade: TRADES[1 + (i % (TRADES.length - 1))],
}));

const HASHTAGS = ['#Oldham', '#AsoEbi', '#WorkCut', '#Tailors', '#GiftRain', '#OL1', '#Wedding', '#TrustScore'];

export default function DiscoverPage() {
  const [params, setParams] = useSearchParams();
  const liveOnly = params.get('mode') === 'live';
  const radius = Math.max(1, Number(params.get('radius') || 10) || 10);
  const catFromUrl = parseCategory(params.get('cat'));

  const [q, setQ] = useState('');
  const [category, setCategory] = useState<Category>(catFromUrl);
  const [hostLive, setHostLive] = useState(() => readBroadcast());
  const onboardingDone = isOnboardingDone();

  useEffect(() => {
    setCategory(catFromUrl);
  }, [catFromUrl]);

  useEffect(() => {
    const sync = () => setHostLive(readBroadcast());
    sync();
    window.addEventListener('myface-broadcast', sync);
    return () => window.removeEventListener('myface-broadcast', sync);
  }, []);

  const setCategoryParam = (nextCat: Category) => {
    setCategory(nextCat);
    const next = new URLSearchParams(params);
    if (nextCat === 'All') next.delete('cat');
    else next.set('cat', nextCat);
    setParams(next, { replace: true });
  };

  const liveInRadius = useMemo(() => {
    const seeded = LIVE_NEARBY.filter((s) => {
      if (s.mi > radius) return false;
      if (category === 'All' || category === 'For You' || category === 'Live Replays') return true;
      if (category === 'Oldham OL1') return s.mi <= 3;
      if (category === 'Aso-Ebi') {
        const blob = `${s.title} ${s.maker} ${s.trade}`.toLowerCase();
        return blob.includes('aso') || blob.includes('ebi') || s.trade === 'Wedding';
      }
      if ((TRADES as readonly string[]).includes(category)) {
        return s.trade.toLowerCase() === category.toLowerCase();
      }
      return true;
    });
    if (!hostLive?.live) return seeded;
    return [
      {
        id: 'host_live',
        title: hostLive.title,
        maker: "AYO'S",
        viewers: hostLive.viewers,
        mi: 0.1,
        trade: 'Tailors' as const,
      },
      ...seeded,
    ];
  }, [radius, category, hostLive]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return TRENDING.filter((item) => {
      if (liveOnly && !item.live) return false;
      if (!matchesCategory(item, category)) return false;
      const okQ =
        !needle ||
        item.title.toLowerCase().includes(needle) ||
        item.maker.toLowerCase().includes(needle) ||
        item.trade.toLowerCase().includes(needle) ||
        item.tag.toLowerCase().includes(needle);
      return okQ;
    });
  }, [q, category, liveOnly]);

  const clearLiveMode = () => {
    const next = new URLSearchParams(params);
    next.delete('mode');
    next.delete('radius');
    setParams(next, { replace: true });
  };

  if (!onboardingDone) {
    return <Navigate to="/app/onboarding" replace />;
  }

  return (
    <div className="min-h-dvh bg-[#050505] text-white flex flex-col">
      <header
        className="sticky z-30 border-b border-white/10 bg-[#050505]/92 backdrop-blur-xl"
        style={{ top: 'var(--safe-area-inset-top, 0px)', paddingTop: 'var(--safe-area-inset-top, 0px)' }}
      >
        <div className="px-4 pt-3 pb-2 flex items-center gap-3">
          <Link to="/app/feed" className="h-9 w-9 rounded-full border border-white/12 bg-white/5 flex items-center justify-center text-[16px]">
            ←
          </Link>
          <div className="min-w-0 flex-1">
            <div className="poppins text-[15px] font-extrabold tracking-tight">
              {liveOnly ? 'Live nearby' : category === 'All' ? 'Discover' : category}
            </div>
            <div className="mono text-[10px] text-white/45">
              {liveOnly
                ? `${liveInRadius.length} active live · within ${radius} mi of Oldham OL1`
                : category === 'All'
                  ? 'Makers · WorkCuts · Live · Oldham'
                  : `Category · ${category}`}
            </div>
          </div>
          {liveOnly ? (
            <button
              type="button"
              onClick={clearLiveMode}
              className="rounded-full border border-white/12 bg-white/5 px-3 h-9 inline-flex items-center mono text-[10px] font-bold"
            >
              All Discover
            </button>
          ) : (
            <Link
              to={`/app/discover?mode=live&radius=${radius}`}
              className="rounded-full border border-red-500/40 bg-red-500/15 px-3 h-9 inline-flex items-center mono text-[10px] font-bold"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />
              {liveInRadius.length} LIVE
            </Link>
          )}
        </div>

        <div className="px-4 pb-3">
          <label className="flex items-center gap-2 h-11 rounded-full border border-white/12 bg-white/[0.04] px-4">
            <span className="text-white/40">⌕</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={liveOnly ? 'Search live sessions…' : 'Plumber, engineer, electrician, barber…'}
              className="flex-1 bg-transparent outline-none mono text-[12px] placeholder:text-white/30"
            />
            {q ? (
              <button type="button" className="text-white/40 text-[12px]" onClick={() => setQ('')}>
                Clear
              </button>
            ) : null}
          </label>
        </div>

        {!liveOnly ? (
          <div className="px-3 pb-3 flex gap-1.5 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((t) => {
              const active = category === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCategoryParam(t)}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-semibold border transition ${
                    active
                      ? 'bg-white text-black border-white'
                      : 'border-white/12 text-white/65 bg-white/[0.03] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-3 pb-3 flex gap-1.5 overflow-x-auto scrollbar-none">
            {[5, 10, 15, 25].map((mi) => {
              const active = radius === mi;
              return (
                <button
                  key={mi}
                  type="button"
                  onClick={() => {
                    const next = new URLSearchParams(params);
                    next.set('mode', 'live');
                    next.set('radius', String(mi));
                    setParams(next, { replace: true });
                  }}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-semibold border transition ${
                    active
                      ? 'bg-red-500 text-white border-red-400'
                      : 'border-white/12 text-white/65 bg-white/[0.03]'
                  }`}
                >
                  {mi} mi
                </button>
              );
            })}
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-[calc(88px+env(safe-area-inset-bottom,0px))] space-y-6">
        {/* Live sessions — primary when mode=live */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="poppins text-[14px] font-extrabold">
              {liveOnly ? `Live within ${radius} mi` : 'Live now'}
            </h2>
            <Link to="/app/live" className="mono text-[10px] text-[#8FFF4A]">
              Open viewer →
            </Link>
          </div>
          <div className={liveOnly ? 'grid grid-cols-2 gap-2.5' : 'flex gap-3 overflow-x-auto scrollbar-none pb-1'}>
            {(liveOnly ? liveInRadius : liveInRadius.slice(0, 6))
              .filter((live) => {
                const needle = q.trim().toLowerCase();
                if (!needle) return true;
                return (
                  live.title.toLowerCase().includes(needle) ||
                  live.maker.toLowerCase().includes(needle) ||
                  live.trade.toLowerCase().includes(needle)
                );
              })
              .map((live, i) => (
                <Link
                  key={live.id}
                  to="/app/live"
                  className={
                    liveOnly
                      ? 'relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10'
                      : 'shrink-0 w-[148px] rounded-2xl overflow-hidden border border-white/10 relative'
                  }
                >
                  <img
                    src={POSTERS[i % POSTERS.length]}
                    alt=""
                    className={liveOnly ? 'absolute inset-0 h-full w-full object-cover' : 'h-44 w-full object-cover'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 mono text-[9px] font-bold">
                    LIVE · {live.viewers}
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-black/50 border border-white/15 px-2 py-0.5 mono text-[8px]">
                    {live.mi} mi
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-[12px] font-bold truncate">{live.title}</div>
                    <div className="mono text-[9px] text-white/60">
                      @{live.maker} · {live.trade}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          {liveOnly && !liveInRadius.length ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center mono text-[11px] text-white/45">
              No live sessions in {radius} mi. Widen radius.
            </div>
          ) : null}
        </section>

        {!liveOnly ? (
          <>
            <section>
              <h2 className="poppins text-[14px] font-extrabold mb-3">Trending tags</h2>
              <div className="flex flex-wrap gap-2">
                {HASHTAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQ(tag.replace('#', ''))}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 mono text-[11px] text-[#8FFF4A]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="poppins text-[14px] font-extrabold">Nearby · Oldham</h2>
                <span className="mono text-[10px] text-white/40">10 mi</span>
              </div>
              <div className="space-y-2">
                {NEARBY.filter((m) => {
                  if (category === 'All' || category === 'For You' || category === 'Following') return true;
                  if (category === 'Oldham OL1') return m.loc.toLowerCase().includes('ol1');
                  if (category === 'Aso-Ebi') return m.trade === 'Wedding' || m.trade === 'Tailors';
                  if (TRADES.includes(category as (typeof TRADES)[number])) return m.trade === category;
                  return true;
                }).map((m) => (
                  <Link
                    key={m.id}
                    to="/app/feed"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06] transition"
                  >
                    <div className="h-11 w-11 rounded-full m-gradient text-black font-black text-[12px] grid place-items-center">
                      {m.name.slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold truncate">{m.name}</div>
                      <div className="mono text-[10px] text-white/50">
                        {m.trade} · {m.loc} · {m.mi} mi · Trust {m.trust}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mono text-[10px] text-[#FFE600] font-bold">{m.mfc} MFC</div>
                      <div className="mono text-[9px] text-white/40">Follow</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="poppins text-[14px] font-extrabold">Trending WorkCuts</h2>
                <span className="mono text-[10px] text-white/40">{filtered.length} results</span>
              </div>
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center mono text-[11px] text-white/45">
                  No matches. Try Tailors or clear search.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {filtered.map((item, i) => (
                    <Link
                      key={item.id}
                      to="/app/feed"
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group"
                    >
                      <img
                        src={POSTERS[i % POSTERS.length]}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span
                          className={`rounded-full px-2 py-0.5 mono text-[8px] font-bold ${
                            item.live ? 'bg-red-500 text-white' : 'bg-black/50 border border-white/15'
                          }`}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-[12px] font-bold leading-tight line-clamp-2">{item.title}</div>
                        <div className="mono text-[9px] text-white/60 mt-1 truncate">
                          {item.maker} · {item.views}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="grid grid-cols-2 gap-2.5">
              {[
                { to: '/app/studio/workcut', label: 'WorkCut Studio', sub: 'CapCut editor' },
                { to: '/app/studio/stream', label: 'Go Live', sub: 'Streaming studio' },
                { to: '/app/arcade', label: 'Games Arcade', sub: 'Earn MFC' },
                { to: '/app/dashboard', label: 'Command', sub: 'UPRM OS' },
              ].map((x) => (
                <Link
                  key={x.to}
                  to={x.to}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition"
                >
                  <div className="text-[13px] font-bold">{x.label}</div>
                  <div className="mono text-[10px] text-white/45 mt-1">{x.sub}</div>
                </Link>
              ))}
            </section>
          </>
        ) : null}
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#050505]/92 backdrop-blur-xl px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          {[
            { label: 'Home', icon: '⌂', to: '/app/feed', active: false },
            { label: 'Discover', icon: '◍', to: '/app/discover', active: true },
            { label: 'Live', icon: '◉', to: '/app/live', center: true },
            { label: 'Games', icon: '◐', to: '/app/arcade', active: false },
            { label: 'Profile', icon: '◍', to: '/app/dashboard', active: false },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 min-w-[52px] ${item.center ? '-mt-4' : ''}`}
            >
              <div
                className={
                  item.center
                    ? 'h-12 w-12 rounded-full m-gradient flex items-center justify-center text-black text-[20px] font-black shadow-[0_0_24px_rgba(143,255,74,0.45)]'
                    : item.active
                      ? 'h-8 w-8 rounded-full bg-white text-black flex items-center justify-center'
                      : 'h-8 w-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/80'
                }
              >
                {item.icon}
              </div>
              {!item.center ? (
                <span className={`mono text-[9px] ${item.active ? 'text-white font-bold' : 'text-white/50'}`}>
                  {item.label}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
