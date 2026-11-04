import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { readBroadcast } from '../demo/testLab';
import { getTemplateMaker, TEMPLATE_MAKERS } from '../makers/templateMakers';
import { sharedStreamIsLive } from '../live/liveCameraBus';
import { isLiveAudioPublishing } from '../live/liveAudioRelay';
import { isLiveMediaSourceActive } from '../live/liveMediaSource';
import { IconShare } from '../ui/icons';
import posterLace from '../../assets/c580b278bd1bf106-image_20261029_175419.webp';
import posterSew from '../../assets/2f721bcceb44c761-image_20261029_175423.webp';
import posterDress from '../../assets/1269da9d7e2d4f51-image_20261029_175429.webp';
import posterStudio from '../../assets/bd87313c9fb90d22-image_20261029_175419.webp';
import posterFit from '../../assets/1f34e182625d0051-image_20261029_181559.webp';
import posterDetail from '../../assets/35ca56917d3e0882-image_20261029_180640.webp';

const POSTERS = [posterLace, posterSew, posterDress, posterStudio, posterFit, posterDetail];

type ProfileTab = 'grid' | 'private' | 'reposts';

function hashSeed(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toLocaleString();
}

/** TikTok-style maker profile — stats, Follow/Message, bio pills, 3-col WorkCut grid. */
export default function MakerProfilePage() {
  const { makerId = TEMPLATE_MAKERS[0]?.id ?? 'tpl_01' } = useParams();
  const navigate = useNavigate();
  const tpl = getTemplateMaker(makerId) ?? TEMPLATE_MAKERS[0]!;
  const initials = tpl.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
  const hostingHere = sharedStreamIsLive() || isLiveAudioPublishing() || isLiveMediaSourceActive();
  const live = Boolean(readBroadcast()?.live && hostingHere);
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<ProfileTab>('grid');

  const stats = useMemo(() => {
    const s = hashSeed(tpl.id);
    return {
      following: 800 + (s % 4200),
      followers: 1200 + (s % 9800),
      likes: 2500 + (s % 18000),
    };
  }, [tpl.id]);

  const clips = useMemo(() => {
    const s = hashSeed(tpl.id + ':clips');
    return Array.from({ length: 9 }, (_, i) => {
      const views = 400 + ((s + i * 997) % 9200);
      return {
        id: `${tpl.id}_c${i + 1}`,
        poster: POSTERS[(s + i) % POSTERS.length]!,
        views,
        pinned: i < 3,
        multi: i % 4 === 1,
        title: `${tpl.trade} WorkCut ${i + 1}`,
      };
    });
  }, [tpl.id, tpl.trade]);

  const visibleClips = tab === 'grid' ? clips : tab === 'private' ? clips.slice(0, 3) : clips.slice(3, 6);

  return (
    <div className="min-h-dvh bg-white text-[#0F172A] pb-[max(28px,env(safe-area-inset-bottom))]">
      {/* Top chrome */}
      <header
        className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-black/5 px-3 h-12 flex items-center gap-2"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-full grid place-items-center text-[18px] font-bold text-[#0F172A]"
        >
          ←
        </button>
        <div className="min-w-0 flex-1" />
        <button
          type="button"
          aria-label="Notify"
          className="h-9 w-9 rounded-full grid place-items-center text-[16px] text-[#0F172A]/80"
        >
          ⌂
        </button>
        <button
          type="button"
          aria-label="Share profile"
          className="h-9 w-9 rounded-full grid place-items-center text-[#0F172A]/80"
          onClick={() => {
            const url = `${window.location.origin}/app/maker/${tpl.id}`;
            void navigator.clipboard?.writeText(url).catch(() => undefined);
          }}
        >
          <IconShare size={18} />
        </button>
      </header>

      <div className="px-4 pt-3 pb-2">
        {/* Name left · avatar right (TikTok pattern) */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 pt-1">
            <h1 className="text-[22px] font-extrabold tracking-tight leading-tight truncate">{tpl.name}</h1>
            <div className="mt-0.5 text-[14px] text-[#64748B] truncate">@{tpl.handle}</div>
          </div>
          <Link
            to={live ? '/app/feed?live=1' : `/app/maker/${tpl.id}`}
            className="relative shrink-0"
            aria-label={live ? 'Watch live' : 'Profile photo'}
          >
            <div
              className={`h-[88px] w-[88px] rounded-full grid place-items-center text-black text-[26px] font-black ${
                live ? 'ring-[3px] ring-[#FE2C55] ring-offset-2 ring-offset-white' : 'ring-1 ring-black/10'
              }`}
              style={{ background: tpl.color }}
            >
              {initials}
            </div>
            {live ? (
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 rounded-md bg-[#FE2C55] px-2 h-5 inline-flex items-center text-[10px] font-black text-white tracking-wide shadow">
                LIVE
              </span>
            ) : null}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-end gap-6">
          {(
            [
              ['Following', stats.following],
              ['Followers', stats.followers],
              ['Likes', stats.likes],
            ] as const
          ).map(([label, n]) => (
            <div key={label} className="min-w-0">
              <div className="text-[17px] font-extrabold tabular-nums leading-none">{formatCount(n)}</div>
              <div className="mt-1 text-[12px] text-[#94A3B8]">{label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFollowing((v) => !v)}
            className={`flex-[1.4] h-11 rounded-xl text-[15px] font-bold transition ${
              following
                ? 'bg-[#F1F5F9] text-[#0F172A] border border-black/10'
                : 'bg-[#FE2C55] text-white'
            }`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
          <Link
            to={`/app/messages/${tpl.id}`}
            className="flex-1 h-11 rounded-xl bg-[#F1F5F9] text-[#0F172A] text-[15px] font-bold grid place-items-center border border-black/5"
          >
            Message
          </Link>
          <Link
            to="/app/dashboard?pane=profile"
            aria-label="Assess profile in dashboard"
            className="h-11 w-11 rounded-xl bg-[#F1F5F9] border border-black/5 grid place-items-center text-[16px] font-black text-[#0F172A] shrink-0"
          >
            +
          </Link>
        </div>

        {/* Bio */}
        <p className="mt-3.5 text-[14px] leading-relaxed text-[#0F172A] whitespace-pre-wrap">
          {tpl.bio}
          {'\n'}
          <span className="text-[#64748B]">Oldham {tpl.loc} · WorkCuts & live jobs</span>
        </p>

        {/* Pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to={live ? '/app/feed?live=1' : '/app/live?mode=video'}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-black/10 bg-white text-[12px] font-semibold"
          >
            <span className={`h-2 w-2 rounded-sm ${live ? 'bg-[#FE2C55]' : 'bg-[#94A3B8]'}`} />
            LIVE
          </Link>
          <Link
            to="/app/feed?upload=1"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-black/10 bg-white text-[12px] font-semibold"
          >
            <span className="text-[#FE2C55]">✦</span>
            WorkCut
          </Link>
          <span className="inline-flex items-center h-8 px-3 rounded-full border border-black/10 bg-white text-[12px] font-semibold text-[#64748B]">
            {tpl.trade}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-2 border-b border-black/8 flex items-stretch">
        {(
          [
            { id: 'grid' as const, label: 'Grid', icon: '▦' },
            { id: 'private' as const, label: 'Private', icon: '🔒' },
            { id: 'reposts' as const, label: 'Reposts', icon: '↻' },
          ] as const
        ).map((t) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 h-11 grid place-items-center text-[16px] relative ${
                on ? 'text-[#0F172A]' : 'text-[#94A3B8]'
              }`}
              aria-label={t.label}
            >
              <span className="font-bold">{t.icon}</span>
              {on ? <span className="absolute left-4 right-4 bottom-0 h-[2px] bg-black rounded-full" /> : null}
            </button>
          );
        })}
      </div>

      {/* 3-col grid */}
      <div className="grid grid-cols-3 gap-[2px] bg-[#F8FAFC]">
        {visibleClips.map((clip) => (
          <button
            key={clip.id}
            type="button"
            onClick={() => navigate('/app/feed')}
            className="relative aspect-[3/4] overflow-hidden bg-[#0B1220] text-left"
          >
            <img src={clip.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            {clip.pinned ? (
              <span className="absolute left-1.5 top-1.5 rounded-[4px] bg-[#FE2C55] px-1.5 h-5 inline-flex items-center text-[10px] font-bold text-white">
                Pinned
              </span>
            ) : null}
            {clip.multi ? (
              <span className="absolute right-1.5 top-1.5 text-white text-[12px] drop-shadow">▣</span>
            ) : null}
            <span className="absolute left-1.5 bottom-1.5 inline-flex items-center gap-1 text-white text-[11px] font-semibold drop-shadow">
              ▶ {formatCount(clip.views)}
            </span>
          </button>
        ))}
      </div>

      {tab !== 'grid' ? (
        <div className="px-4 py-4 text-center text-[12px] text-[#94A3B8]">
          {tab === 'private' ? 'Private WorkCuts · template preview' : 'Reposted WorkCuts · template preview'}
        </div>
      ) : null}

      <div className="px-4 pt-4 flex flex-wrap gap-2">
        <Link
          to={live ? '/app/feed?live=1' : '/app/live?mode=video'}
          className="h-10 px-4 rounded-xl bg-[#0F172A] text-white text-[13px] font-bold grid place-items-center"
        >
          {live ? 'Back to LIVE' : 'Go Live'}
        </Link>
        <Link
          to="/app/feed?upload=1"
          className="h-10 px-4 rounded-xl border border-black/10 text-[13px] font-bold grid place-items-center"
        >
          Upload 30s
        </Link>
        <Link
          to={`/app/messages/${tpl.id}`}
          className="h-10 px-4 rounded-xl border border-black/10 text-[13px] font-bold grid place-items-center"
        >
          Open DM
        </Link>
        <Link
          to="/app/dashboard?pane=profile"
          className="h-10 px-4 rounded-xl border border-black/10 text-[13px] font-bold grid place-items-center"
        >
          Assess in dashboard
        </Link>
      </div>
    </div>
  );
}
