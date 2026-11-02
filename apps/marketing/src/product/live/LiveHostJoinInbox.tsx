/**
 * Always-on host inbox for join requests (feed + /app/live).
 * Fixes: Accept was only on the feed live card and easy to miss.
 */
import { useEffect, useState } from 'react';
import {
  approveGuest,
  denyGuest,
  fetchLiveGuests,
  kickGuest,
  type LiveGuestActive,
  type LiveGuestPending,
  type LiveGuestsState,
} from './liveGuests';
import { stopSlotAudioPublish } from './liveSlotAudioRelay';
import { stopSlotFramePublish } from './liveSlotFrameRelay';

type Props = {
  /** When false, component still polls but hides UI (optional). */
  active?: boolean;
  className?: string;
};

export default function LiveHostJoinInbox({ active = true, className = '' }: Props) {
  const [state, setState] = useState<LiveGuestsState>({ pending: [], guests: [] });
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const tick = async () => {
      const next = await fetchLiveGuests();
      if (!cancelled) setState(next);
    };
    void tick();
    const id = window.setInterval(() => void tick(), 700);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [active]);

  if (!active) return null;
  if (!state.pending.length && !state.guests.length && !err) return null;

  const onApprove = async (p: LiveGuestPending) => {
    setBusy(p.id);
    setErr(null);
    // Optimistic: move pending → guests locally so Accept feels instant
    setState((prev) => ({
      ...prev,
      pending: prev.pending.filter((x) => x.id !== p.id),
      guests: prev.guests.some((g) => g.id === p.id)
        ? prev.guests
        : [
            ...prev.guests,
            {
              id: p.id,
              name: p.name,
              avatar: p.avatar,
              slot: `g${Math.min(3, prev.guests.length + 1)}` as 'g1' | 'g2' | 'g3',
              heartbeat: Date.now(),
            },
          ],
    }));
    try {
      const next = await approveGuest(p.id, { name: p.name, avatar: p.avatar });
      if (!next.ok) {
        setErr(next.error === 'full' ? 'Live is full (3 guests)' : next.error || 'Accept failed — try again');
        setState(await fetchLiveGuests());
        return;
      }
      setState(next);
    } catch {
      setErr('Accept failed — check connection');
      setState(await fetchLiveGuests());
    } finally {
      setBusy(null);
    }
  };

  const onDeny = async (id: string) => {
    setBusy(id);
    setErr(null);
    setState((prev) => ({ ...prev, pending: prev.pending.filter((x) => x.id !== id) }));
    try {
      const next = await denyGuest(id);
      if (next.ok) setState(next);
      else setState(await fetchLiveGuests());
    } finally {
      setBusy(null);
    }
  };

  const onKick = async (g: LiveGuestActive) => {
    setBusy(g.id);
    setErr(null);
    try {
      if (g.slot) {
        stopSlotFramePublish(String(g.slot));
        stopSlotAudioPublish(String(g.slot));
      }
      const next = await kickGuest(g.id);
      if (next.ok) setState(next);
      else setState(await fetchLiveGuests());
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className={`pointer-events-auto ${className}`}
      style={{ zIndex: 80 }}
      onClick={(e) => e.stopPropagation()}
    >
      {err ? (
        <div className="mb-2 rounded-xl border border-red-400/40 bg-red-500/20 px-3 py-2 mono text-[11px] font-bold text-red-100">
          {err}
          <button type="button" className="ml-2 underline" onClick={() => setErr(null)}>
            dismiss
          </button>
        </div>
      ) : null}

      {state.pending.length > 0 ? (
        <div className="space-y-2 mb-2">
          {state.pending.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 rounded-2xl bg-[#111]/95 border-2 border-[#FFE600] px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-md"
            >
              <div className="h-9 w-9 rounded-full bg-[#FFE600] text-black grid place-items-center text-[13px] font-black shrink-0">
                {p.avatar || 'G'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mono text-[12px] font-bold truncate text-white">{p.name} wants to join</div>
                <div className="mono text-[9px] text-[#FFE600]">Split-screen · tap Accept</div>
              </div>
              <button
                type="button"
                disabled={busy === p.id}
                className="h-9 px-3.5 rounded-full bg-[#8FFF4A] text-black font-bold text-[12px] disabled:opacity-50"
                onClick={() => void onApprove(p)}
              >
                {busy === p.id ? '…' : 'Accept'}
              </button>
              <button
                type="button"
                disabled={busy === p.id}
                className="h-9 px-2.5 rounded-full bg-white/10 border border-white/25 mono text-[10px] font-bold text-white"
                onClick={() => void onDeny(p.id)}
              >
                Deny
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {state.guests.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 justify-end">
          {state.guests.map((g) => (
            <button
              key={g.id}
              type="button"
              disabled={busy === g.id}
              className="rounded-full bg-black/80 border border-white/20 px-2.5 h-7 mono text-[10px] font-bold text-white"
              onClick={() => void onKick(g)}
              title="Remove from live"
            >
              ✕ {g.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
