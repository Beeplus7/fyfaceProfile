/** Cross-device live session chat. */

const CHAT_URL = '/api/live-chat';

export type LiveChatMessage = {
  id: string;
  who: string;
  text: string;
  ts?: number;
};

export type LiveChatState = {
  updatedAt?: string;
  messages: LiveChatMessage[];
};

function empty(): LiveChatState {
  return { messages: [] };
}

export async function fetchLiveChat(): Promise<LiveChatState> {
  try {
    const res = await fetch(CHAT_URL, { cache: 'no-store' });
    if (!res.ok) return empty();
    const data = (await res.json()) as LiveChatState;
    return {
      updatedAt: data.updatedAt,
      messages: Array.isArray(data.messages) ? data.messages : [],
    };
  } catch {
    return empty();
  }
}

export async function sendLiveChat(who: string, text: string): Promise<LiveChatState> {
  const cleaned = text.trim().slice(0, 240);
  if (!cleaned) return fetchLiveChat();
  try {
    const res = await fetch(CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send',
        id: `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
        who: who.trim().slice(0, 32) || 'Guest',
        text: cleaned,
      }),
      keepalive: true,
    });
    if (!res.ok) return fetchLiveChat();
    const data = (await res.json()) as LiveChatState;
    return {
      updatedAt: data.updatedAt,
      messages: Array.isArray(data.messages) ? data.messages : [],
    };
  } catch {
    return empty();
  }
}

export async function clearLiveChat(): Promise<void> {
  try {
    await fetch(CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'clear' }),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}
