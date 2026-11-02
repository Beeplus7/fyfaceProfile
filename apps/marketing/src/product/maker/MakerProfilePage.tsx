import { Link, useParams } from 'react-router-dom';
import { CRM_BTN, CRM_BTN_GHOST } from '../crmChrome';
import { readBroadcast } from '../demo/testLab';
import { getTemplateMaker, TEMPLATE_MAKERS } from '../makers/templateMakers';
import { sharedStreamIsLive } from '../live/liveCameraBus';
import { isLiveAudioPublishing } from '../live/liveAudioRelay';
import { isLiveMediaSourceActive } from '../live/liveMediaSource';

export default function MakerProfilePage() {
  const { makerId = TEMPLATE_MAKERS[0]?.id ?? 'tpl_01' } = useParams();
  const tpl = getTemplateMaker(makerId) ?? TEMPLATE_MAKERS[0]!;
  const initials = tpl.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
  const hostingHere = sharedStreamIsLive() || isLiveAudioPublishing() || isLiveMediaSourceActive();
  const live = Boolean(readBroadcast()?.live && hostingHere);

  return (
    <div className="min-h-dvh bg-[#050505] text-white pb-[max(24px,env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur-xl px-3 h-12 flex items-center gap-2">
        <Link to="/app/feed" className={CRM_BTN_GHOST + ' !px-2.5'}>
          ← Feed
        </Link>
        <div className="min-w-0 flex-1 truncate text-[13px] font-bold">{tpl.name}</div>
        {live ? (
          <Link to="/app/feed?live=1" className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold">
            ● LIVE
          </Link>
        ) : null}
      </header>

      <div className="relative h-36 bg-gradient-to-br from-[#1A7CFF] via-[#0B1220] to-black">
        <div className="absolute -bottom-10 left-4 flex items-end gap-3">
          <div
            className={`h-20 w-20 rounded-full grid place-items-center text-black text-[22px] font-black border-4 border-[#050505] ${
              live ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-[#050505]' : ''
            }`}
            style={{ background: tpl.color }}
          >
            {initials}
          </div>
          <div className="pb-2">
            <div className="flex items-center gap-1.5">
              <h1 className="poppins text-[18px] font-extrabold">{tpl.name}</h1>
              <span className="h-5 w-5 rounded-full bg-[#1A7CFF] grid place-items-center text-[11px]">✓</span>
            </div>
            <div className="mono text-[11px] text-white/55">
              {tpl.trade} · Oldham {tpl.loc}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-14 space-y-4">
        <p className="text-[13px] text-white/75 leading-relaxed">{tpl.bio}</p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 mono text-[10px]">Template account</span>
          <span className="rounded-full bg-white/10 px-3 py-1 mono text-[10px]">@{tpl.handle}</span>
          <span className="rounded-full border border-white/15 px-3 py-1 mono text-[10px] text-white/70">
            {tpl.trade}
          </span>
          <span className="rounded-full border border-white/15 px-3 py-1 mono text-[10px] text-white/70">
            30s WorkCut slot
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to={live ? '/app/feed?live=1' : '/app/live?mode=video'} className={CRM_BTN}>
            {live ? 'Back to LIVE' : 'Go Live room'}
          </Link>
          <Link to="/app/feed?upload=1" className={CRM_BTN_GHOST}>
            Upload 30s
          </Link>
          <Link to="/app/dashboard" className={CRM_BTN_GHOST}>
            Work OS
          </Link>
        </div>

        <section>
          <h2 className="poppins text-[14px] font-extrabold mb-2">Template · ready for upload</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
            <div className="text-[13px] font-semibold">{tpl.trade} · 30s WorkCut</div>
            <div className="mono text-[10px] text-white/45 mt-0.5">
              Use this account as a template — any user can upload a 30-second clip to feed the timeline.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
