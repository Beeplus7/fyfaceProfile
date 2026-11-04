import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTemplateMaker, TEMPLATE_MAKERS } from '../makers/templateMakers';
import { loadProfile } from '../onboarding/storage';
import {
  DM_EVENT,
  ensureDmThread,
  markDmRead,
  readDmThreads,
  scheduleDmAutoReply,
  sendDmMessage,
  type DmThread,
} from './dmStore';

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function peerInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
}

/** Inbox + thread — DMs with maker profiles. */
export default function DirectMessagesPage() {
  const { peerId } = useParams();
  const navigate = useNavigate();
  const profile = loadProfile();
  const myName = profile?.shopName || profile?.answers?.displayName || 'You';
  const [threads, setThreads] = useState<DmThread[]>(() => readDmThreads());
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const sync = () => setThreads(readDmThreads());
    sync();
    window.addEventListener(DM_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(DM_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Open / create thread when landing on /messages/:peerId
  useEffect(() => {
    if (!peerId) return;
    const tpl = getTemplateMaker(peerId) || TEMPLATE_MAKERS.find((t) => t.id === peerId);
    if (tpl) {
      ensureDmThread({
        id: tpl.id,
        name: tpl.name,
        handle: tpl.handle,
        color: tpl.color,
        trade: tpl.trade,
      });
    }
    markDmRead(peerId);
    setThreads(readDmThreads());
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [peerId]);

  const active = useMemo(
    () => (peerId ? threads.find((t) => t.peerId === peerId) || null : null),
    [threads, peerId],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [active?.messages.length, peerId]);

  const onSend = () => {
    if (!peerId || !active) return;
    const text = draft.trim();
    if (!text) return;
    sendDmMessage(peerId, text, active.peer);
    setDraft('');
    setThreads(readDmThreads());
    scheduleDmAutoReply(peerId);
  };

  const showInbox = !peerId;

  return (
    <div className="min-h-dvh bg-white text-[#0F172A] flex flex-col">
      <header
        className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-black/5 px-3 h-12 flex items-center gap-2"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {peerId ? (
          <button
            type="button"
            aria-label="Back to inbox"
            onClick={() => navigate('/app/messages')}
            className="h-9 w-9 rounded-full grid place-items-center text-[18px] font-bold"
          >
            ←
          </button>
        ) : (
          <Link
            to="/app/feed"
            className="h-9 px-2.5 rounded-full grid place-items-center text-[13px] font-semibold text-[#64748B]"
          >
            ← Feed
          </Link>
        )}
        <div className="min-w-0 flex-1">
          {active ? (
            <button
              type="button"
              className="text-left min-w-0"
              onClick={() => navigate(`/app/maker/${active.peerId}`)}
            >
              <div className="text-[14px] font-extrabold truncate leading-tight">{active.peer.name}</div>
              <div className="text-[11px] text-[#94A3B8] truncate">
                @{active.peer.handle || active.peerId}
                {active.peer.trade ? ` · ${active.peer.trade}` : ''}
              </div>
            </button>
          ) : (
            <div className="text-[15px] font-extrabold">Messages</div>
          )}
        </div>
        <Link
          to="/app/dashboard?pane=messages"
          className="h-9 px-2.5 rounded-full text-[11px] font-bold text-[#64748B]"
        >
          OS
        </Link>
      </header>

      {showInbox ? (
        <div className="flex-1 overflow-y-auto pb-[max(20px,env(safe-area-inset-bottom))]">
          {threads.length === 0 ? (
            <div className="px-6 py-16 text-center space-y-3">
              <div className="text-[18px] font-extrabold">No messages yet</div>
              <p className="text-[13px] text-[#64748B] leading-relaxed max-w-sm mx-auto">
                Open a maker profile and tap <span className="font-semibold text-[#0F172A]">Message</span> to start a
                DM about a quote, booking, or WorkCut.
              </p>
              <Link
                to="/app/maker/tpl_01"
                className="inline-flex h-11 px-5 rounded-xl bg-[#FE2C55] text-white text-[14px] font-bold items-center"
              >
                Message a maker
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-black/5">
              {threads.map((t) => {
                const last = t.messages[t.messages.length - 1];
                return (
                  <li key={t.peerId}>
                    <button
                      type="button"
                      onClick={() => navigate(`/app/messages/${t.peerId}`)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#F8FAFC]"
                    >
                      <div
                        className="h-12 w-12 rounded-full grid place-items-center text-black text-[14px] font-black shrink-0"
                        style={{ background: t.peer.color || '#FFE600' }}
                      >
                        {peerInitials(t.peer.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[14px] font-bold truncate">{t.peer.name}</div>
                          <div className="text-[11px] text-[#94A3B8] shrink-0">
                            {last ? formatTime(last.ts) : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div
                            className={`text-[13px] truncate flex-1 ${
                              t.unread ? 'text-[#0F172A] font-semibold' : 'text-[#64748B]'
                            }`}
                          >
                            {last
                              ? `${last.from === 'me' ? 'You: ' : ''}${last.text}`
                              : 'Say hello…'}
                          </div>
                          {t.unread ? (
                            <span className="h-5 min-w-5 px-1.5 rounded-full bg-[#FE2C55] text-white text-[10px] font-black grid place-items-center shrink-0">
                              {t.unread}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : active ? (
        <>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-[#F8FAFC]">
            {active.messages.map((m) => {
              const mine = m.from === 'me';
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-snug whitespace-pre-wrap break-words ${
                      mine
                        ? 'bg-[#FE2C55] text-white rounded-br-md'
                        : 'bg-white border border-black/8 text-[#0F172A] rounded-bl-md'
                    }`}
                  >
                    {m.text}
                    <div
                      className={`mt-1 text-[10px] ${mine ? 'text-white/70' : 'text-[#94A3B8]'}`}
                    >
                      {formatTime(m.ts)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          <form
            className="border-t border-black/5 bg-white px-3 py-2.5 flex items-center gap-2 pb-[max(10px,env(safe-area-inset-bottom))]"
            onSubmit={(e) => {
              e.preventDefault();
              onSend();
            }}
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, 500))}
              placeholder={`Message as ${myName}…`}
              className="flex-1 h-11 rounded-full border border-black/10 bg-[#F8FAFC] px-4 text-[14px] outline-none focus:border-[#FE2C55]/40"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="h-11 px-4 rounded-full bg-[#FE2C55] text-white text-[13px] font-bold disabled:opacity-40 shrink-0"
            >
              Send
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 grid place-items-center px-6 text-center text-[13px] text-[#64748B]">
          Conversation not found.
          <Link to="/app/messages" className="mt-3 text-[#FE2C55] font-bold">
            Back to inbox
          </Link>
        </div>
      )}
    </div>
  );
}
