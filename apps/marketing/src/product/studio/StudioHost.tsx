import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CRM_BTN, CRM_BTN_GHOST, CRM_BTN_QUIET, CRM_EYE, CRM_LIVE_PILL } from '../crmChrome';
import { readBroadcast, setBroadcast } from '../demo/testLab';
import { IconMore } from '../ui/icons';

/** Twitch-style theater host for admin studio artifacts. */
export default function StudioHost({
  title,
  eyebrow,
  src,
  links = [],
  enableBroadcast = false,
}: {
  title: string;
  eyebrow: string;
  src: string;
  links?: { to: string; label: string }[];
  enableBroadcast?: boolean;
}) {
  const [broadcast, setBc] = useState(readBroadcast());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sync = () => setBc(readBroadcast());
    window.addEventListener('myface-broadcast', sync);
    return () => window.removeEventListener('myface-broadcast', sync);
  }, []);

  const uptime = (() => {
    if (!broadcast?.live || !broadcast.startedAt) return null;
    const sec = Math.max(0, Math.floor((Date.now() - Date.parse(broadcast.startedAt)) / 1000));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  })();

  return (
    <div className="h-dvh min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden">
      <header className="shrink-0 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 md:px-4 bg-black/60">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/app/dashboard" className={CRM_BTN_GHOST}>
            ← Command
          </Link>
          <div className="min-w-0">
            <div className={CRM_EYE}>{eyebrow}</div>
            <div className="font-display text-[15px] tracking-tight truncate">{title}</div>
          </div>
          {enableBroadcast && broadcast?.live ? (
            <span className={CRM_LIVE_PILL}>
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
              {typeof broadcast.viewers === 'number' ? ` · ${broadcast.viewers}` : ''}
              {uptime ? ` · ${uptime}` : ''}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={CRM_BTN_GHOST}>
              {l.label}
            </Link>
          ))}
          {enableBroadcast ? (
            <button
              type="button"
              className={CRM_BTN}
              onClick={() => {
                const on = !(broadcast?.live);
                setBroadcast(on, { viewers: on ? 144 : 0, title: `${title} · OL1` });
                setBc(readBroadcast());
              }}
            >
              {broadcast?.live ? 'End stream' : 'Go Live'}
            </button>
          ) : null}
          <div className="relative">
            <button type="button" className={CRM_BTN_QUIET} onClick={() => setMenuOpen((v) => !v)} aria-label="More">
              <IconMore size={16} />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] rounded-lg border border-white/12 bg-[#0F0F0F] p-1 shadow-xl">
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md px-3 py-2 mono text-[11px] text-white/70 hover:bg-white/[0.06]"
                  onClick={() => setMenuOpen(false)}
                >
                  Open source HTML
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <div className="relative flex-1 min-h-0 bg-black">
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 w-full h-full border-0 bg-black"
          allow="autoplay; fullscreen; camera; microphone; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
