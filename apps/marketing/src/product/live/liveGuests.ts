/** TikTok-style multi-guest live: join requests, approve, slots g1–g3. */

const GUESTS_URL = '/api/live-guests';
const ID_KEY = 'myface.live.guestId';
const NAME_KEY = 'myface.live.guestName';

export type GuestSlot = 'g1' | 'g2' | 'g3';

export type LiveGuestPending = {
  id: string;
  name: string;
  avatar: string;
  ts?: number;
};

export type LiveGuestActive = {
  id: string;
  name: string;
  avatar: string;
  slot: GuestSlot | string;
  joinedAt?: string;
  heartbeat?: number;
};

export type LiveGuestsState = {
  updatedAt?: string;
  pending: LiveGuestPending[];
  guests: LiveGuestActive[];
};

function emptyState(): LiveGuestsState {
  return { pending: [], guests: [] };
}

export function getOrCreateGuestIdentity(): { id: string; name: string; avatar: string } {
  let id = '';
  let name = 'Guest';
  try {
    id = localStorage.getItem(ID_KEY) || '';
    name = localStorage.getItem(NAME_KEY) || '';
  } catch {
    /* ignore */
  }
  if (!id) {
    id = `g_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
    try {
      localStorage.setItem(ID_KEY, id);
    } catch {
      /* ignore */
    }
  }
  if (!name) {
    const n = Math.floor(10 + Math.random() * 89);
    name = `Guest ${n}`;
    try {
      localStorage.setItem(NAME_KEY, name);
    } catch {
      /* ignore */
    }
  }
  const avatar = name.trim().charAt(0).toUpperCase() || 'G';
  return { id, name, avatar };
}

export function setGuestDisplayName(name: string) {
  const cleaned = name.trim().slice(0, 40) || 'Guest';
  try {
    localStorage.setItem(NAME_KEY, cleaned);
  } catch {
    /* ignore */
  }
  return cleaned;
}

export async function fetchLiveGuests(): Promise<LiveGuestsState> {
  try {
    const res = await fetch(GUESTS_URL, { cache: 'no-store' });
    if (!res.ok) return emptyState();
    const data = (await res.json()) as LiveGuestsState;
    return {
      updatedAt: data.updatedAt,
      pending: Array.isArray(data.pending) ? data.pending : [],
      guests: Array.isArray(data.guests) ? data.guests : [],
    };
  } catch {
    return emptyState();
  }
}

function normalizeState(data: Partial<LiveGuestsState> | null | undefined): LiveGuestsState | null {
  if (!data) return null;
  if (!('pending' in data) && !('guests' in data)) return null;
  return {
    updatedAt: data.updatedAt,
    pending: Array.isArray(data.pending) ? data.pending : [],
    guests: Array.isArray(data.guests) ? data.guests : [],
  };
}

async function postAction(body: Record<string, unknown>): Promise<LiveGuestsState> {
  try {
    const res = await fetch(GUESTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
    const data = (await res.json().catch(() => null)) as
      | (LiveGuestsState & { state?: LiveGuestsState; error?: string })
      | null;
    const direct = normalizeState(data);
    if (direct) return direct;
    const nested = normalizeState(data?.state);
    if (nested) return nested;
    return fetchLiveGuests();
  } catch {
    return emptyState();
  }
}

export function requestJoinLive(identity = getOrCreateGuestIdentity()) {
  return postAction({
    action: 'request',
    id: identity.id,
    name: identity.name,
    avatar: identity.avatar,
  });
}

export function cancelJoinRequest(id = getOrCreateGuestIdentity().id) {
  return postAction({ action: 'cancel', id });
}

export function approveGuest(id: string, extras?: { name?: string; avatar?: string }) {
  return postAction({ action: 'approve', id, ...extras });
}

export function denyGuest(id: string) {
  return postAction({ action: 'deny', id });
}

export function leaveGuestLive(id = getOrCreateGuestIdentity().id) {
  return postAction({ action: 'leave', id });
}

export function kickGuest(id: string) {
  return postAction({ action: 'kick', id });
}

export function heartbeatGuest(id = getOrCreateGuestIdentity().id, name?: string) {
  return postAction({ action: 'heartbeat', id, ...(name ? { name } : {}) });
}

export function clearLiveGuests() {
  return postAction({ action: 'clear' });
}

export function myGuestRole(
  state: LiveGuestsState,
  id = getOrCreateGuestIdentity().id,
): { pending: boolean; guest: LiveGuestActive | null } {
  const guest = state.guests.find((g) => g.id === id) || null;
  const pending = !guest && state.pending.some((p) => p.id === id);
  return { pending, guest };
}
