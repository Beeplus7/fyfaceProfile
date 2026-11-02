import { Link, Navigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import {
  CRM_BTN,
  CRM_BTN_GHOST,
  CRM_CARD,
  CRM_CARD_IN,
  CRM_EYE,
  CRM_TITLE,
} from '../crmChrome';
import { isOnboardingDone, loadProfile } from '../onboarding/storage';
import ArcadeLiveOverlay from './ArcadeLiveOverlay';
import GameFrame from './GameFrame';
import { ARCADE_GAMES, GIFT_CATALOG, GAME_REWARDS, type GameId } from './mfcEconomy';
import { useArcadeWallet } from './useArcadeWallet';

function isGameId(id: string | undefined): id is GameId {
  return Boolean(id && ARCADE_GAMES.some((g) => g.id === id));
}

export default function ArcadeShell() {
  const { user, configured } = useAuth();
  const profile = loadProfile();
  const { gameId } = useParams();
  const wallet = useArcadeWallet();
  const [live, setLive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!isOnboardingDone()) {
    return <Navigate to="/app/onboarding" replace />;
  }

  const active = isGameId(gameId) ? ARCADE_GAMES.find((g) => g.id === gameId)! : null;

  const earn = (game: GameId, amount: number, note: string) => {
    wallet.creditGame(game, amount, note);
    if (amount > 0) {
      setToast(`+${amount} MFC · ${note}`);
      window.setTimeout(() => setToast(null), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header
        className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl"
        style={{ top: 'var(--safe-area-inset-top)' }}
      >
        <div className="mx-auto max-w-[1400px] px-4 h-14 flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <div className={CRM_EYE}>Games Arcade</div>
            <div className="text-[13px] font-semibold truncate">
              {profile?.shopName || 'Play · Earn · Gift'}
              {user?.email ? ` · ${user.email}` : ''}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 px-3 rounded-lg border border-white/10 mono text-[11px] tabular-nums">
              {wallet.balance.toLocaleString()} MFC
            </div>
            <Link to="/app/dashboard?pane=games" className={CRM_BTN_GHOST}>
              Command
            </Link>
            <Link to="/app/dashboard" className={CRM_BTN_GHOST}>
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-lg border border-white/15 bg-[#111] px-4 py-2 mono text-[12px] text-white/85">
          {toast}
        </div>
      ) : null}

      {active ? (
        <div className="mx-auto max-w-[1400px] px-4 py-6 grid lg:grid-cols-[1.35fr_0.65fr] gap-4">
          <div className={CRM_CARD + ' p-4 md:p-5'}>
            <Link to="/app/arcade" className="mono text-[11px] text-white/40 hover:text-white/70">
              ← All games
            </Link>
            <div className={CRM_EYE + ' mt-3'}>HTML playable</div>
            <h1 className="font-display text-[24px] md:text-[28px] mt-1">{active.title}</h1>
            <p className="mono text-[12px] text-white/50 mt-1">{active.blurb}</p>
            <div className="mt-4">
              <GameFrame
                gameId={active.id}
                src={active.src}
                title={active.title}
                sessionEarned={wallet.sessionEarned[active.id] ?? 0}
                onEarn={(n, note) => earn(active.id, n, note)}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className={CRM_CARD + ' p-1'}>
              <ArcadeLiveOverlay live={live} onToggle={() => setLive((v) => !v)} gameTitle={active.title} />
            </div>
            <div className={CRM_CARD + ' p-4'}>
              <div className={CRM_EYE}>Spend · celebrate craft</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {GIFT_CATALOG.slice(0, 4).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    disabled={wallet.balance < g.mfc}
                    onClick={() => wallet.spendGift(g.mfc, `Gifted ${g.name}`)}
                    className={CRM_CARD_IN + ' px-3 py-3 text-left disabled:opacity-40 hover:bg-white/[0.06]'}
                  >
                    <div className="text-[16px]">{g.emoji}</div>
                    <div className="mono text-[12px] mt-1">{g.name}</div>
                    <div className="mono text-[10px] text-white/40">{g.mfc} MFC</div>
                  </button>
                ))}
              </div>
            </div>
            <div className={CRM_CARD + ' p-4 max-h-[200px] overflow-auto'}>
              <div className={CRM_EYE}>Ledger</div>
              <div className="mt-2 space-y-1">
                {wallet.ledger.length === 0 ? (
                  <div className="mono text-[11px] text-white/35">Play to earn</div>
                ) : (
                  wallet.ledger.slice(0, 12).map((row) => (
                    <div key={row.id} className="mono text-[10px] text-white/50 flex justify-between gap-2">
                      <span className="truncate">{row.note}</span>
                      <span className="tabular-nums text-white/75">
                        {row.amount >= 0 ? '+' : ''}
                        {row.amount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1400px] px-4 py-10 space-y-6">
          <div className={CRM_CARD + ' p-6'}>
            <h1 className={CRM_TITLE + ' !text-[28px]'}>Games Arcade</h1>
            <p className="mono text-[12px] text-white/45 mt-2 max-w-xl leading-relaxed">
              Six Oldham gift-economy playables — rain, lace clash, multiplayer hub, raid MMO, quote
              royale, cosmic craft. Earn ticks → gift makers.
            </p>
            <Link to="/app/dashboard?pane=games" className={CRM_BTN + ' mt-4'}>
              Open in Command Center
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ARCADE_GAMES.map((g) => (
              <Link key={g.id} to={`/app/arcade/${g.id}`} className={CRM_CARD + ' p-4 hover:bg-white/[0.06] transition'}>
                <div className="flex justify-between gap-2">
                  <div className="font-display text-[16px]">{g.title}</div>
                  <span className="mono text-[9px] text-white/40 border border-white/10 rounded-md px-1.5 py-0.5 h-fit">
                    Playable
                  </span>
                </div>
                <p className="mono text-[11px] text-white/45 mt-2 leading-snug">{g.blurb}</p>
                <div className="mono text-[10px] text-white/35 mt-3">
                  Cap {wallet.sessionEarned[g.id] ?? 0}/{GAME_REWARDS[g.id].sessionCap} MFC
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
