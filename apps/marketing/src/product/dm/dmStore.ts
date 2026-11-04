/** Local-first direct messages between the signed-in maker and profile peers. */

export const DM_STORAGE_KEY = 'myface.dm.threads.v1';
export const DM_EVENT = 'myface-dm';

export type DmPeer = {
  id: string;
  name: string;
  handle?: string;
  color?: string;
  trade?: string;
};

export type DmMessage = {
  id: string;
  from: 'me' | 'peer';
  text: string;
  ts: number;
};

export type DmThread = {
  peerId: string;
  peer: DmPeer;
  messages: DmMessage[];
  updatedAt: number;
  unread: number;
};

function emit() {
  window.dispatchEvent(new Event(DM_EVENT));
}

function readAll(): DmThread[] {
  try {
    const raw = localStorage.getItem(DM_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as DmThread[];
    if (!Array.isArray(list)) return [];
    return list
      .filter((t) => t && typeof t.peerId === 'string' && Array.isArray(t.messages))
      .map((t) => ({
        peerId: t.peerId,
        peer: {
          id: t.peer?.id || t.peerId,
          name: t.peer?.name || 'Maker',
          handle: t.peer?.handle,
          color: t.peer?.color,
          trade: t.peer?.trade,
        },
        messages: t.messages
          .filter((m) => m && typeof m.text === 'string')
          .map((m): DmMessage => ({
            id: m.id || `m_${m.ts}`,
            from: m.from === 'peer' ? ('peer' as const) : ('me' as const),
            text: String(m.text).slice(0, 500),
            ts: typeof m.ts === 'number' ? m.ts : Date.now(),
          })),
        updatedAt: typeof t.updatedAt === 'number' ? t.updatedAt : Date.now(),
        unread: Math.max(0, Number(t.unread) || 0),
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function writeAll(list: DmThread[]) {
  localStorage.setItem(DM_STORAGE_KEY, JSON.stringify(list.slice(0, 80)));
  emit();
}

export function readDmThreads(): DmThread[] {
  return readAll();
}

export function readDmThread(peerId: string): DmThread | null {
  return readAll().find((t) => t.peerId === peerId) || null;
}

export function unreadDmCount(): number {
  return readAll().reduce((n, t) => n + (t.unread || 0), 0);
}

export function ensureDmThread(peer: DmPeer): DmThread {
  const list = readAll();
  const existing = list.find((t) => t.peerId === peer.id);
  if (existing) {
    const next = {
      ...existing,
      peer: { ...existing.peer, ...peer, id: peer.id },
    };
    writeAll([next, ...list.filter((t) => t.peerId !== peer.id)]);
    return next;
  }
  const thread: DmThread = {
    peerId: peer.id,
    peer: { ...peer, id: peer.id },
    messages: [
      {
        id: `sys_${Date.now().toString(36)}`,
        from: 'peer',
        text: `Hi — thanks for messaging ${peer.name}. Ask about a quote, booking, or WorkCut.`,
        ts: Date.now(),
      },
    ],
    updatedAt: Date.now(),
    unread: 1,
  };
  writeAll([thread, ...list]);
  return thread;
}

export function markDmRead(peerId: string) {
  const list = readAll();
  const next = list.map((t) => (t.peerId === peerId ? { ...t, unread: 0 } : t));
  writeAll(next);
}

export function sendDmMessage(peerId: string, text: string, peer?: DmPeer): DmThread | null {
  const cleaned = text.trim().slice(0, 500);
  if (!cleaned) return readDmThread(peerId);
  let list = readAll();
  let thread = list.find((t) => t.peerId === peerId);
  if (!thread) {
    if (!peer) return null;
    thread = ensureDmThread(peer);
    list = readAll();
    thread = list.find((t) => t.peerId === peerId) || thread;
  }
  const mine: DmMessage = {
    id: `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    from: 'me',
    text: cleaned,
    ts: Date.now(),
  };
  const updated: DmThread = {
    ...thread!,
    messages: [...thread!.messages, mine].slice(-200),
    updatedAt: mine.ts,
    unread: 0,
  };
  writeAll([updated, ...list.filter((t) => t.peerId !== peerId)]);
  return updated;
}

/** Lightweight template auto-reply so DMs feel two-sided in the demo. */
export function scheduleDmAutoReply(peerId: string) {
  window.setTimeout(() => {
    const thread = readDmThread(peerId);
    if (!thread) return;
    const last = thread.messages[thread.messages.length - 1];
    if (!last || last.from !== 'me') return;
    const replies = [
      'Got it — I can do that this week in Oldham. What day works?',
      'Thanks! Send a photo of the job and I’ll quote you.',
      'Happy to help. Are you booking a visit or a WorkCut upload?',
      'Noted. I’ll check my slots and message you back shortly.',
    ];
    const text = replies[Math.floor(Math.random() * replies.length)]!;
    const reply: DmMessage = {
      id: `r_${Date.now().toString(36)}`,
      from: 'peer',
      text,
      ts: Date.now(),
    };
    const list = readAll();
    const cur = list.find((t) => t.peerId === peerId);
    if (!cur) return;
    const onThread =
      typeof window !== 'undefined' &&
      window.location.pathname.includes(`/messages/${peerId}`);
    writeAll([
      {
        ...cur,
        messages: [...cur.messages, reply].slice(-200),
        updatedAt: reply.ts,
        unread: onThread ? 0 : cur.unread + 1,
      },
      ...list.filter((t) => t.peerId !== peerId),
    ]);
  }, 900 + Math.floor(Math.random() * 900));
}
