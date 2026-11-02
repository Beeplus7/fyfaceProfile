'use client';

import { useEffect, useState } from 'react';
import { getSession, sendGift, startLive, stopLive, type GiftKind } from '../../lib/live';

const GIFTS: GiftKind[] = ['Hammer', 'Scissors', 'Heart', 'Crown', 'Trophy'];

export function LiveWorkshop({
  onGoLive,
  viewers: viewersProp = 0,
}: {
  onGoLive?: (live: boolean) => void;
  viewers?: number;
}) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [viewers, setViewers] = useState(viewersProp);
  const [chat, setChat] = useState<string[]>([]);
  const [projectNote, setProjectNote] = useState<string | null>(null);
  const live = !!sessionId && !!getSession(sessionId)?.isLive;

  useEffect(() => {
    if (!sessionId) return;
    const id = setInterval(() => {
      const s = getSession(sessionId);
      if (s) {
        setViewers(s.viewers);
        setChat(s.chat.slice(-4).map((c) => `${c.user}: ${c.text}`));
      }
    }, 800);
    return () => clearInterval(id);
  }, [sessionId]);

  const toggle = async () => {
    if (!live) {
      const s = await startLive('ayo-tailors');
      setSessionId(s.id);
      setProjectNote(null);
      onGoLive?.(true);
    } else if (sessionId) {
      const res = await stopLive(sessionId);
      setSessionId(null);
      setProjectNote(
        `Saved project draft · ${res.projectDraft.title} · peak ${res.projectDraft.viewers_peak} · gifts ${res.projectDraft.gift_count}`,
      );
      onGoLive?.(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">Live Workshop</div>
        <div className="flex items-center gap-2 mono text-[10px] text-white/60">
          <span className={`h-2 w-2 rounded-full ${live ? 'bg-red-500 animate-pulse' : 'bg-white/30'}`} />
          {live ? 'LIVE' : 'OFF'} · {viewers} viewers
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-black/50 aspect-video grid place-items-center relative overflow-hidden">
        <div className="absolute right-3 top-3 w-16 h-28 rounded-lg border border-white/20 bg-black/60 grid place-items-center mono text-[8px] text-white/50">
          PiP
          <br />
          Tripod
        </div>
        <div className="text-center px-4">
          <div className="text-[14px] font-bold text-white">
            {live ? 'Streaming · Mux/LiveKit stub' : 'Ready to Go Live'}
          </div>
          <div className="mono text-[10px] text-white/45 mt-1">Findy 10mi · gift rain · record→project</div>
          {chat.length ? (
            <div className="mt-2 text-left mono text-[9px] text-white/60 space-y-0.5">
              {chat.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {live && sessionId ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {GIFTS.map((g) => (
            <button
              key={g}
              type="button"
              className="rounded-full border border-white/15 px-2 py-1 text-[10px] text-white"
              onClick={() => void sendGift(sessionId, g, 'Viewer')}
            >
              {g}
            </button>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => void toggle()}
        className={`mt-3 w-full h-11 rounded-xl font-bold text-[13px] ${
          live
            ? 'bg-white/10 text-white border border-white/15'
            : 'text-white bg-gradient-to-r from-red-500 to-orange-500'
        }`}
      >
        {live ? 'End Live · Save to Project' : 'Go Live · Gift Rain'}
      </button>
      {projectNote ? <div className="mt-2 mono text-[10px] text-[#8FFF4A]">{projectNote}</div> : null}
    </div>
  );
}

export default LiveWorkshop;
