import { useState } from "react";

export function LiveWorkshop({
  onGoLive,
  viewers = 0,
}: {
  onGoLive?: (live: boolean) => void;
  viewers?: number;
}) {
  const [live, setLive] = useState(false);
  const toggle = () => {
    const next = !live;
    setLive(next);
    onGoLive?.(next);
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">Live Workshop</div>
        <div className="flex items-center gap-2 mono text-[10px] text-white/60">
          <span className={`h-2 w-2 rounded-full ${live ? "bg-red-500 animate-pulse" : "bg-white/30"}`} />
          {live ? "LIVE" : "OFF"} · {viewers} viewers
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-black/50 aspect-video grid place-items-center relative overflow-hidden">
        <div className="absolute right-3 top-3 w-16 h-28 rounded-lg border border-white/20 bg-black/60 grid place-items-center mono text-[8px] text-white/50">
          PiP
          <br />
          Tripod
        </div>
        <div className="text-center">
          <div className="text-[14px] font-bold text-white">{live ? "Streaming · Mux stub" : "Ready to Go Live"}</div>
          <div className="mono text-[10px] text-white/45 mt-1">LiveKit/Mux Sprint 2 · Findy 10mi</div>
        </div>
      </div>
      <button
        type="button"
        onClick={toggle}
        className={`mt-3 w-full h-11 rounded-xl font-bold text-[13px] ${
          live
            ? "bg-white/10 text-white border border-white/15"
            : "text-white bg-gradient-to-r from-red-500 to-orange-500"
        }`}
      >
        {live ? "End Live · Save to Project" : "Go Live · Gift Rain"}
      </button>
    </div>
  );
}

export default LiveWorkshop;
