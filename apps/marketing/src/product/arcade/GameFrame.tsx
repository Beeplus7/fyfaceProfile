import { useEffect, useRef, useState } from 'react';
import { CRM_BTN, CRM_BTN_GHOST, CRM_EYE } from '../crmChrome';
import { GAME_REWARDS, type GameId } from './mfcEconomy';

/** Hosts self-contained HTML React artifacts in a sandboxed iframe. */
export function GameFrame({
  gameId,
  src,
  title,
  sessionEarned = 0,
  onEarn,
}: {
  gameId: GameId;
  src: string;
  title: string;
  sessionEarned?: number;
  onEarn: (amount: number, note: string) => void;
}) {
  const [, setTicks] = useState(0);
  const [alive, setAlive] = useState(true);
  const started = useRef(Date.now());
  const cap = GAME_REWARDS[gameId].sessionCap;
  const per = GAME_REWARDS[gameId].perTick;
  const room = Math.max(0, cap - sessionEarned);

  useEffect(() => {
    if (!alive || room <= 0) return;
    const id = window.setInterval(() => {
      setTicks((t) => t + 1);
      onEarn(per, `${title} · play tick`);
    }, 12_000);
    return () => clearInterval(id);
  }, [alive, room, per, onEarn, title]);

  const bankBurst = () => {
    if (room <= 0) return;
    const grant = Math.min(room, per * 3);
    onEarn(grant, `${title} · banked run`);
  };

  const mins = Math.floor((Date.now() - started.current) / 60000);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className={CRM_EYE}>
          Session · {sessionEarned}/{cap} MFC · {mins}m
        </div>
        <div className="flex gap-2">
          <button type="button" className={CRM_BTN_GHOST} onClick={() => setAlive((a) => !a)}>
            {alive ? 'Pause earn' : 'Resume earn'}
          </button>
          <button type="button" className={CRM_BTN} disabled={room <= 0} onClick={bankBurst}>
            Bank score
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 overflow-hidden bg-black aspect-[16/10] min-h-[420px] relative">
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; gamepad"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
        />
      </div>
      <p className="mono text-[10px] text-white/35">
        Earn while you play (session capped). Gifts spend from wallet only.
      </p>
    </div>
  );
}

export default GameFrame;
