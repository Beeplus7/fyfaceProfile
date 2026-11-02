/**
 * Live Workshop engine — Sprint 2 Day 6-7
 * Mux/LiveKit stub + gift rain + viewers + record → project.
 */

export type GiftKind = 'Hammer' | 'Scissors' | 'Heart' | 'Crown' | 'Trophy';

export const GIFT_COINS: Record<GiftKind, number> = {
  Hammer: 10,
  Scissors: 25,
  Heart: 50,
  Crown: 100,
  Trophy: 500,
};

export type LiveSessionState = {
  id: string;
  isLive: boolean;
  viewers: number;
  muxId?: string;
  chat: { id: string; user: string; text: string; at: string }[];
  gifts: { id: string; kind: GiftKind; coins: number; from: string; at: string }[];
  startedAt?: string;
};

const sessions = new Map<string, LiveSessionState>();

export async function startLive(userId: string): Promise<LiveSessionState> {
  const id = `live_${userId}_${Date.now()}`;
  const state: LiveSessionState = {
    id,
    isLive: true,
    viewers: 0,
    muxId: `mux_stub_${id}`,
    chat: [{ id: 'c0', user: 'System', text: 'Go Live · PiP tripod ready (Mux/LiveKit stub)', at: new Date().toISOString() }],
    gifts: [],
    startedAt: new Date().toISOString(),
  };
  sessions.set(id, state);
  // Simulate viewers climbing
  let v = 0;
  const tick = setInterval(() => {
    const s = sessions.get(id);
    if (!s || !s.isLive) {
      clearInterval(tick);
      return;
    }
    v = Math.min(100, v + Math.floor(Math.random() * 4) + 1);
    s.viewers = v;
  }, 1200);
  (state as any)._tick = tick;
  return state;
}

export async function updateViewers(sessionId: string, viewers: number) {
  const s = sessions.get(sessionId);
  if (!s) return null;
  s.viewers = viewers;
  return s;
}

export async function sendGift(
  sessionId: string,
  kind: GiftKind,
  from = 'Viewer',
) {
  const s = sessions.get(sessionId);
  if (!s) throw new Error('session not found');
  const gift = {
    id: `g_${Date.now()}`,
    kind,
    coins: GIFT_COINS[kind],
    from,
    at: new Date().toISOString(),
  };
  s.gifts.push(gift);
  s.chat.push({ id: `c_${Date.now()}`, user: from, text: `sent ${kind} ${gift.coins}`, at: gift.at });
  return gift;
}

export type StopLiveResult = {
  session: LiveSessionState;
  projectDraft: {
    title: string;
    description: string;
    recording_url: string;
    mux_id: string;
    gift_count: number;
    viewers_peak: number;
  };
};

export async function stopLive(sessionId: string): Promise<StopLiveResult> {
  const s = sessions.get(sessionId);
  if (!s) throw new Error('session not found');
  s.isLive = false;
  if ((s as any)._tick) clearInterval((s as any)._tick);
  const giftCount = s.gifts.reduce((n, g) => n + g.coins, 0);
  return {
    session: s,
    projectDraft: {
      title: `Live Workshop · ${new Date().toLocaleDateString()}`,
      description: `Recorded live · peak ${s.viewers} viewers · gifts ${giftCount} coins`,
      recording_url: `stub://recording/${sessionId}.mp4`,
      mux_id: s.muxId || '',
      gift_count: giftCount,
      viewers_peak: s.viewers,
    },
  };
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId) || null;
}
