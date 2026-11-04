import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CRM_ICON_BTN, CRM_ICON_BTN_ACTIVE, CRM_RAIL_ITEM, CRM_RAIL_ITEM_ACTIVE } from '../crmChrome';
import {
  clearLocalBroadcastOnly,
  readBroadcast,
  setBroadcast,
  type BroadcastMode,
  type BroadcastState,
} from '../demo/testLab';
import FeedLiveNowStage from '../live/FeedLiveNowStage';
import GoLivePicker, { type GoLivePick } from '../live/GoLivePicker';
import { broadcastMetaFromAudience } from '../live/liveAudience';
import { openWhatsAppPrivateLiveBroadcast, privateLiveInviteUrl } from '../live/liveWhatsAppShare';
import LiveGiftPortal from '../live/LiveGiftPortal';
import LiveHostJoinInbox from '../live/LiveHostJoinInbox';
import { focusLiveChat, openLiveGiftShop, readMfcWallet } from '../live/liveGifts';
import { getOrCreateGuestIdentity } from '../live/liveGuests';
import { fetchRemoteLive, publishRemoteLiveMusic } from '../live/liveRemote';
import { isLiveAudioPublishing, setLiveMusicBed, startLiveAudioOnlyPublish } from '../live/liveAudioRelay';
import { sharedStreamIsLive } from '../live/liveCameraBus';
import { isLocalLiveHost } from '../live/liveHost';
import { isLiveMediaSourceActive, startLiveMediaSource } from '../live/liveMediaSource';
import { startSessionRecording } from '../live/liveSessionRecorder';
import { acquireLiveCamera } from '../live/useLiveCamera';
import {
  formatDuration,
  LIVE_RECORDINGS_EVENT,
  readPublishedLiveRecordings,
  type LiveRecording,
} from '../live/liveRecordings';
import { liveClipUrl } from '../live/liveRecordingMedia';
import { MusicDrawer, type Music, type MusicSource } from '../music/MusicDrawer';
import {
  createFeedUserPost,
  FEED_USER_POSTS_EVENT,
  formatPostDuration,
  readFeedUserPosts,
  type FeedUserPost,
} from './feedUserPosts';
import UploadPostSheet from './UploadPostSheet';
import {
  IconBook,
  IconBookmark,
  IconBookmarkFill,
  IconComment,
  IconCommand,
  IconGames,
  IconHeart,
  IconHeartFill,
  IconHome,
  IconLive,
  IconMore,
  IconMute,
  IconMusic,
  IconShare,
  IconShop,
  IconVolume,
} from '../ui/icons';

const SAVED_FEED_KEY = 'myface.feed.saved.v1';

function readSavedFeedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SAVED_FEED_KEY);
    if (!raw) return new Set();
    const list = JSON.parse(raw) as string[];
    return new Set(Array.isArray(list) ? list : []);
  } catch {
    return new Set();
  }
}

function writeSavedFeedIds(ids: Set<string>) {
  try {
    localStorage.setItem(SAVED_FEED_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

import posterLace from '../../assets/c580b278bd1bf106-image_20261029_175419.webp';
import posterSew from '../../assets/2f721bcceb44c761-image_20261029_175423.webp';
import posterDress from '../../assets/1269da9d7e2d4f51-image_20261029_175429.webp';
import posterStudio from '../../assets/bd87313c9fb90d22-image_20261029_175419.webp';
import posterFit from '../../assets/1f34e182625d0051-image_20261029_181559.webp';
import posterDetail from '../../assets/35ca56917d3e0882-image_20261029_180640.webp';
import { FEED_TOP_TABS, suggestWorkCategories, WORK_CATEGORIES } from '../makers/workCategories';
import { TEMPLATE_MAKERS, type TemplateMaker } from '../makers/templateMakers';
import './timeline.css';

const LIVE_NEARBY_COUNT = 30;
const LIVE_RADIUS_MI = 10;

const POSTERS = [posterLace, posterSew, posterDress, posterStudio, posterFit, posterDetail];

type CardType = 'workcut' | 'liveReplay' | 'liveNow';

interface Maker {
  id: string;
  name: string;
  trade: string;
  location: string;
  verified: boolean;
  trustScore: number;
  avatar: string;
  color: string;
  followers: string;
}
interface Card {
  id: string;
  type: CardType;
  liveMode?: BroadcastMode;
  maker: Maker;
  title: string;
  caption: string;
  hashtags: string[];
  videoPoster?: string;
  posterSrc?: string;
  images?: string[];
  music: Music;
  likes: number;
  comments: number;
  gifts: number;
  price?: string;
  projectTag?: string;
  shopItems?: { name: string; price: string; tagX: number; tagY: number }[];
  duration?: string;
  viewers?: number;
  /** YouTube video id when live source is YouTube */
  youtubeId?: string;
  /** Ordered playlist — next video autoplays when one ends */
  youtubePlaylistIds?: string[];
  youtubePlaylist?: { id: string; caption: string }[];
  /** Planned YouTube live length (sec); clip/playlist loops if shorter */
  youtubeDurationSec?: number;
  beforeAfter?: { before: string; after: string };
  /** IndexedDB clip for user-uploaded / recorded video */
  mediaId?: string;
  /** Empty template slot awaiting 30s WorkCut upload */
  isTemplate?: boolean;
}

function makerFromTemplate(t: TemplateMaker): Maker {
  const initials = t.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
  return {
    id: t.id,
    name: t.name,
    trade: t.trade,
    location: `Oldham ${t.loc}`,
    verified: true,
    trustScore: 4.8,
    avatar: initials,
    color: t.color,
    followers: '0',
  };
}

const MAKERS: Maker[] = TEMPLATE_MAKERS.map(makerFromTemplate);
const HOST_MAKER: Maker = MAKERS[0] ?? {
  id: 'tpl_01',
  name: 'AYO TAILORS',
  trade: 'Tailors',
  location: 'Oldham OL1',
  verified: true,
  trustScore: 4.9,
  avatar: 'AT',
  color: '#e11d48',
  followers: '0',
};

const MUSIC_POOL: Music[] = [
  { title: 'WorkCut Bed', artist: 'MyFace', source: 'Jamendo', api: 'Jamendo', duration: '0:30', color: '#8FFF4A' },
  { title: 'Oldham Pulse', artist: 'Local', source: 'Spotify', api: 'Spotify Web API', duration: '0:30', color: '#1DB954' },
  { title: 'Trade Focus', artist: 'Studio', source: 'YouTube', api: 'YouTube Data API v3', duration: '0:30', color: '#FF0000' },
];

/** 50 template WorkCut slots — one per maker account for 30s uploads */
function genTemplateCards(): Card[] {
  return TEMPLATE_MAKERS.map((t, idx) => {
    const maker = makerFromTemplate(t);
    const tag = `#${t.trade.replace(/\s+/g, '')}`;
    return {
      id: `tpl-slot-${t.id}`,
      type: 'workcut' as CardType,
      maker,
      title: `${t.trade} · 30s WorkCut template`,
      caption: `${t.bio} Upload a 30-second clip to this template account.`,
      hashtags: [tag, '#WorkCut', '#Oldham', `#${t.loc}`, '#Template'],
      videoPoster: `tpl-${idx}`,
      posterSrc: POSTERS[idx % POSTERS.length],
      music: MUSIC_POOL[idx % MUSIC_POOL.length]!,
      likes: 0,
      comments: 0,
      gifts: 0,
      projectTag: 'Template · 30s upload',
      duration: '0:30',
      isTemplate: true,
    };
  });
}

function recordingToCard(rec: LiveRecording, maker: Maker): Card {
  return {
    id: `pub-${rec.id}`,
    type: 'liveReplay',
    liveMode: rec.mode,
    maker,
    title: rec.title,
    caption: rec.caption,
    hashtags: ['#LIVE', '#Replay', '#Oldham', rec.mode === 'audio' ? '#AudioLive' : '#VideoLive'],
    videoPoster: rec.id,
    posterSrc: POSTERS[1],
    music: MUSIC_POOL[2]!,
    likes: 800 + (rec.viewers % 900),
    comments: 40 + (rec.gifts ?? 0),
    gifts: rec.gifts ?? 12,
    projectTag: 'From Live · posted public',
    duration: formatDuration(rec.durationSec),
    viewers: rec.viewers,
    mediaId: rec.hasMedia ? rec.id : undefined,
  };
}

function userPostToCard(post: FeedUserPost, maker: Maker): Card {
  return {
    id: `upost-${post.id}`,
    type: 'workcut',
    maker,
    title: post.title,
    caption: post.caption,
    hashtags: post.hashtags,
    videoPoster: post.id,
    posterSrc: POSTERS[0],
    music: MUSIC_POOL[0]!,
    likes: post.likes,
    comments: post.comments,
    gifts: post.gifts,
    projectTag: 'Uploaded · WorkCut',
    duration: post.durationSec ? formatPostDuration(post.durationSec) : undefined,
    mediaId: post.mediaId,
    isTemplate: false,
  };
}

type StoreRec = { id: string; value: Record<string, unknown> };
const STORE_KEY = 'myface.timeline.v1';

function readStore(): Record<string, StoreRec[]> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') as Record<string, StoreRec[]>;
  } catch {
    return {};
  }
}
function writeStore(data: Record<string, StoreRec[]>) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

async function callAPI(action: string, args: any) {
  const store = readStore();
  if (action === 'records.list') {
    return { records: store[args.collection] || [] };
  }
  if (action === 'records.create') {
    const col = args.collection as string;
    const list = store[col] || [];
    const id = args.idempotency_key || `${col}-${Date.now()}`;
    const next = list.filter((r) => r.id !== id);
    next.push({ id, value: args.value });
    store[col] = next;
    writeStore(store);
    return { id, value: args.value };
  }
  if (action === 'records.delete') {
    const col = args.collection as string;
    store[col] = (store[col] || []).filter((r) => r.id !== args.id);
    writeStore(store);
    return { ok: true };
  }
  return {};
}

export default function TimelineFeed() {
  const [cards, setCards] = useState<Card[]>(() => genTemplateCards());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(() => readSavedFeedIds());
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [wallet, setWallet] = useState(() => readMfcWallet());
  const [musicDrawerOpen, setMusicDrawerOpen] = useState(false);
  const [activeCardForMusic, setActiveCardForMusic] = useState<string | null>(null);
  const [activeMusicTab, setActiveMusicTab] = useState<MusicSource>('Jamendo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMusicPreview, setSelectedMusicPreview] = useState<Music | null>(null);
  const [isPlayingMap, setIsPlayingMap] = useState<Record<string, boolean>>({});
  /** true = muted. Default false (sound on) after unlock; browsers may force mute until gesture. */
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({});
  /** Session unlock so autoplay-with-sound works after Post / first unmute tap */
  const [feedSoundUnlocked, setFeedSoundUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('myface.feed.soundUnlocked') === '1';
    } catch {
      return false;
    }
  });
  const videoElsRef = useRef<Record<string, HTMLVideoElement | null>>({});
  const [giftBurst, setGiftBurst] = useState<string | null>(null);
  const [heartBurst, setHeartBurst] = useState<string | null>(null);
  const [showCaptions, setShowCaptions] = useState(true);
  const [lowMotion, setLowMotion] = useState(false);
  const [topTab, setTopTab] = useState('For You');
  const [feedSearchOpen, setFeedSearchOpen] = useState(false);
  const [feedSearch, setFeedSearch] = useState('');
  const [goLiveOpen, setGoLiveOpen] = useState(false);
  const [liveBroadcast, setLiveBroadcast] = useState<BroadcastState | null>(() => readBroadcast());
  const [publishedRecs, setPublishedRecs] = useState<LiveRecording[]>(() => readPublishedLiveRecordings());
  const [userPosts, setUserPosts] = useState<FeedUserPost[]>(() => readFeedUserPosts());
  const [uploadPostFile, setUploadPostFile] = useState<File | null>(null);
  const [mediaUrlMap, setMediaUrlMap] = useState<Record<string, string>>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading'|'ok'|'offline'>('loading');
  const [giftRainActive, setGiftRainActive] = useState<string | null>(null);
  const [caughtMFC, setCaughtMFC] = useState<{id:number,x:number,y:number}[]>([]);
  const [likedAnimationIds, setLikedAnimationIds] = useState<Set<string>>(new Set());
  const [actionSheet, setActionSheet] = useState<null | { kind: 'comment' | 'share' | 'book' | 'shop'; card: Card }>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const flashToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  };

  const unlockFeedSound = () => {
    setFeedSoundUnlocked(true);
    try {
      sessionStorage.setItem('myface.feed.soundUnlocked', '1');
    } catch {
      /* ignore */
    }
    // Sync gesture unlock (must run before any await) — helps unmuted video.play later
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        const ctx = new AC();
        const buf = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
        void ctx.resume();
      }
    } catch {
      /* ignore */
    }
  };

  const cardWantsMute = (cardId: string) =>
    mutedMap[cardId] === true || (mutedMap[cardId] !== false && !feedSoundUnlocked);

  const applyVideoAudio = (cardId: string, muted: boolean) => {
    const el = videoElsRef.current[cardId];
    if (!el) return;
    el.defaultMuted = muted;
    el.muted = muted;
    if (!muted) el.volume = 1;
    const play = el.play();
    if (play && typeof play.catch === 'function') {
      void play.catch(() => {
        // Autoplay with sound blocked — keep video going muted, show mute icon
        if (!muted) {
          el.muted = true;
          el.defaultMuted = true;
          setMutedMap((m) => ({ ...m, [cardId]: true }));
          void el.play().catch(() => undefined);
        }
      });
    }
  };

  // Keep header MFC balance in sync with gift shop wallet
  useEffect(() => {
    const sync = () => setWallet(readMfcWallet());
    sync();
    window.addEventListener('myface-mfc-wallet', sync);
    return () => window.removeEventListener('myface-mfc-wallet', sync);
  }, []);

  // ?live=1 from Watch Live — pin For You + scroll to live card (stay on feed)
  useEffect(() => {
    if (searchParams.get('live') !== '1') return;
    setTopTab('For You');
    setCurrentIndex(0);
    const t = window.setTimeout(() => {
      const el = cardRefs.current['live-now-host'];
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      else if (timelineRef.current) timelineRef.current.scrollTop = 0;
      const next = new URLSearchParams(searchParams);
      next.delete('live');
      setSearchParams(next, { replace: true });
    }, 120);
    return () => window.clearTimeout(t);
  }, [searchParams, setSearchParams]);

  // ?upload=1 — open create sheet focused on post-to-feed
  useEffect(() => {
    if (searchParams.get('upload') !== '1') return;
    setGoLiveOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete('upload');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const feedChromeRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load persisted likes/follows
  useEffect(()=>{
    (async()=>{
      try {
        const [likeRecs, followRecs, musicRecs] = await Promise.all([
          callAPI('records.list',{collection:'likes'}).catch(()=>({records:[]})),
          callAPI('records.list',{collection:'follows'}).catch(()=>({records:[]})),
          callAPI('records.list',{collection:'music_picks'}).catch(()=>({records:[]})),
        ]);
        if (likeRecs?.records) {
          setLiked(new Set(likeRecs.records.map((r:any)=>r.value.cardId)));
        }
        if (followRecs?.records) {
          setFollowed(new Set(followRecs.records.map((r:any)=>r.value.makerId)));
        }
        if (musicRecs?.records) {
          const map: Record<string,Music> = {};
          musicRecs.records.forEach((r:any)=>{
            if (r.value.cardId && r.value.music) map[r.value.cardId]=r.value.music;
          });
          setCards(prev=>prev.map(c=> map[c.id] ? {...c, music: map[c.id]} : c));
        }
        setApiStatus('ok');
      } catch {
        setApiStatus('offline');
      }
    })();
  },[]);

  // Pin active creator Live (local host with cam, else remote /api) + published recordings
  useEffect(() => {
    const syncLive = async () => {
      const local = readBroadcast();
      const hostingHere = isLocalLiveHost();
      const remote = await fetchRemoteLive();

      // Stale local "live" on a viewer phone must not block remote AYO or steal the host badge.
      // Never clear YouTube local hosts — they have no MediaStream.
      if (local?.live && local.from !== 'remote' && !hostingHere && !local.youtubeId) {
        clearLocalBroadcastOnly();
      }

      if (hostingHere && local?.live) {
        setLiveBroadcast(local);
        return;
      }
      if (remote?.live) {
        setLiveBroadcast(remote);
        return;
      }
      setLiveBroadcast(local?.live && hostingHere ? local : null);
    };
    const onLiveEvent = () => {
      void syncLive();
    };
    const syncRecs = () => {
      const next = readPublishedLiveRecordings();
      setPublishedRecs((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    const syncUserPosts = () => {
      const next = readFeedUserPosts();
      setUserPosts((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    void syncLive();
    syncRecs();
    syncUserPosts();
    window.addEventListener('myface-broadcast', onLiveEvent);
    window.addEventListener(LIVE_RECORDINGS_EVENT, syncRecs);
    window.addEventListener(FEED_USER_POSTS_EVENT, syncUserPosts);
    window.addEventListener('storage', onLiveEvent);
    window.addEventListener('storage', syncRecs);
    window.addEventListener('storage', syncUserPosts);
    // Poll live status only — do NOT rebuild recordings every 2s (that remounted videos)
    const id = window.setInterval(() => {
      void syncLive();
    }, 2000);
    return () => {
      window.removeEventListener('myface-broadcast', onLiveEvent);
      window.removeEventListener(LIVE_RECORDINGS_EVENT, syncRecs);
      window.removeEventListener(FEED_USER_POSTS_EVENT, syncUserPosts);
      window.removeEventListener('storage', onLiveEvent);
      window.removeEventListener('storage', syncRecs);
      window.removeEventListener('storage', syncUserPosts);
      window.clearInterval(id);
    };
  }, []);

  // Stable media id list — only resolve new blob URLs when clips are added/removed
  const mediaIdsKey = useMemo(() => {
    const ids: string[] = [];
    userPosts.forEach((p) => ids.push(p.mediaId));
    publishedRecs.forEach((r) => {
      if (r.hasMedia) ids.push(r.id);
    });
    return ids.sort().join('|');
  }, [userPosts, publishedRecs]);

  const mediaUrlMapRef = useRef<Record<string, string>>({});
  useEffect(() => {
    mediaUrlMapRef.current = mediaUrlMap;
  }, [mediaUrlMap]);

  // Resolve blob URLs for uploaded / recorded clips — reuse existing URLs so playback is not reset
  useEffect(() => {
    let cancelled = false;
    const wanted = new Set(mediaIdsKey ? mediaIdsKey.split('|').filter(Boolean) : []);
    void (async () => {
      const prev = mediaUrlMapRef.current;
      const next: Record<string, string> = {};
      const revoke: string[] = [];
      for (const [id, url] of Object.entries(prev)) {
        if (wanted.has(id)) next[id] = url;
        else revoke.push(url);
      }
      for (const id of wanted) {
        if (next[id]) continue;
        try {
          const url = await liveClipUrl(id);
          if (url) next[id] = url;
        } catch {
          /* ignore */
        }
      }
      if (cancelled) {
        for (const [id, url] of Object.entries(next)) {
          if (prev[id] !== url) URL.revokeObjectURL(url);
        }
        return;
      }
      const unchanged =
        Object.keys(next).length === Object.keys(prev).length &&
        Object.keys(next).every((id) => next[id] === prev[id]);
      if (unchanged) return;
      revoke.forEach((u) => URL.revokeObjectURL(u));
      setMediaUrlMap(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [mediaIdsKey]);

  const liveInviteOpen = searchParams.get('invite') === 'private';

  const liveNowCard = useMemo((): Card | null => {
    if (!liveBroadcast?.live) return null;
    // Private contacts-only lives stay off public For You unless host opts in
    // Invitees opening a WhatsApp link (?invite=private) can still join
    const isPublic = Boolean(liveBroadcast.publicFeed) || liveBroadcast.visibility === 'public';
    const isHostSession = liveBroadcast.from !== 'remote';
    if (!isPublic && !isHostSession && !liveInviteOpen) return null;
    const maker = HOST_MAKER;
    const mode = liveBroadcast.mode || 'video';
    const privateTag =
      !isPublic && (liveBroadcast.allowedContactIds?.length || 0) > 0
        ? `Private · ${liveBroadcast.allowedContactIds!.length} contacts`
        : !isPublic
          ? 'Private · contacts'
          : null;
    return {
      id: 'live-now-host',
      type: 'liveNow',
      liveMode: mode,
      maker,
      title: liveBroadcast.title || (mode === 'audio' ? 'Audio Live now' : 'Video Live now'),
      caption: mode === 'audio'
        ? 'Voice-only live · tap to join the room'
        : liveBroadcast.youtubeId
          ? 'YouTube Live on the feed · tap Watch Live'
          : privateTag
            ? `${privateTag} · not on public feed until you switch on`
            : 'Creator is LIVE on camera · tap to watch on the feed',
      hashtags: ['#LIVE', '#Oldham', `#${maker.trade.replace(/\s+/g, '')}`, '#VideoLive'],
      videoPoster: 'live-now',
      posterSrc: POSTERS[0],
      music: MUSIC_POOL[0]!,
      likes: 0,
      comments: 0,
      gifts: 0,
      projectTag: privateTag || (liveBroadcast.youtubeId ? 'YouTube Live' : 'Live session'),
      viewers: liveBroadcast.viewers,
      duration: liveBroadcast.startedAt,
      youtubeId: liveBroadcast.youtubeId,
      youtubePlaylistIds: liveBroadcast.youtubePlaylistIds,
      youtubePlaylist: liveBroadcast.youtubePlaylist,
      youtubeDurationSec: liveBroadcast.youtubeDurationSec,
    };
  }, [liveBroadcast, liveInviteOpen]);

  const feedCardH = useRef(0);
  const touchingRef = useRef(false);
  const indexRef = useRef(0);
  const hadLiveCardRef = useRef(false);

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  // Intersection observer autoplay — index from data-index, not brittle id parse
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const node = entry.target as HTMLElement;
          const id = node.dataset.cardid;
          if (!id) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            const raw = node.dataset.index;
            const idx = raw != null ? Number(raw) : NaN;
            if (Number.isFinite(idx)) {
              indexRef.current = idx;
              setCurrentIndex(idx);
            }
            setIsPlayingMap((prev) => ({ ...prev, [id]: true }));
          } else {
            setIsPlayingMap((prev) => ({ ...prev, [id]: false }));
          }
        });
      },
      { threshold: [0.55, 0.75], root: timelineRef.current },
    );
    Object.values(cardRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [cards, topTab, feedSearch, liveBroadcast?.live, publishedRecs, userPosts]);

  // Arrow keys up/down
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (musicDrawerOpen) return;
      const el = timelineRef.current;
      if (!el) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        el.scrollBy({ top: el.clientHeight, behavior: 'auto' });
      }
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        el.scrollBy({ top: -el.clientHeight, behavior: 'auto' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [musicDrawerOpen]);

  /** Keep card height locked to scroller pixels — %/svh drifts on iOS chrome. */
  const syncFeedCardHeight = (opts?: { preserveIndex?: boolean }) => {
    const el = timelineRef.current;
    if (!el) return;
    const h = Math.round(el.clientHeight);
    if (h <= 0) return;
    const prev = feedCardH.current;
    if (h === prev) return;
    feedCardH.current = h;
    el.style.setProperty('--feed-card-h', `${h}px`);
    // On chrome show/hide: keep the same card — don't re-round mid-gesture
    if (opts?.preserveIndex && prev > 0 && !touchingRef.current) {
      el.scrollTop = indexRef.current * h;
    }
  };

  /** Measure fixed top chrome so in-card badges clear it (no overlap). */
  useEffect(() => {
    const chrome = feedChromeRef.current;
    const root = document.querySelector('.timeline-root') as HTMLElement | null;
    if (!chrome || !root) return;
    const apply = () => {
      const h = Math.ceil(chrome.getBoundingClientRect().height);
      if (h > 0) root.style.setProperty('--feed-chrome-h', `${h}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(chrome);
    window.addEventListener('orientationchange', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', apply);
    };
  }, [liveBroadcast?.live, topTab]);

  /**
   * Soft mid-card rescue ONLY after scroll settles — never on touchend / every 60ms.
   * CSS snap does the main work; this only fixes rare hung mid-card stops.
   */
  const softCorrectMidCard = () => {
    if (touchingRef.current) return;
    const el = timelineRef.current;
    if (!el) return;
    const h = feedCardH.current || el.clientHeight || 1;
    const pos = el.scrollTop / h;
    const nearest = Math.round(pos);
    const frac = Math.abs(pos - nearest);
    if (frac < 0.12) {
      setCurrentIndex(Math.max(0, nearest));
      return;
    }
    const target = nearest * h;
    if (Math.abs(el.scrollTop - target) > 2) {
      el.scrollTo({ top: target, behavior: 'auto' });
    }
    setCurrentIndex(Math.max(0, nearest));
  };

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    syncFeedCardHeight();

    const ro = new ResizeObserver(() => {
      syncFeedCardHeight({ preserveIndex: true });
    });
    ro.observe(el);

    const onTouchStart = () => {
      touchingRef.current = true;
    };
    const onTouchEnd = () => {
      touchingRef.current = false;
    };
    const onScrollEnd = () => softCorrectMidCard();
    const onOrient = () => {
      window.setTimeout(() => syncFeedCardHeight({ preserveIndex: true }), 120);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    el.addEventListener('scrollend', onScrollEnd);
    window.addEventListener('orientationchange', onOrient);

    return () => {
      ro.disconnect();
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('orientationchange', onOrient);
    };
  }, []);

  // Track index from scroll — do NOT force scrollTo (CSS snap owns the motion)
  const handleScroll = () => {
    const el = timelineRef.current;
    if (!el) return;
    const h = feedCardH.current || el.clientHeight || 1;
    const idx = Math.max(0, Math.round(el.scrollTop / h));
    if (idx !== indexRef.current) {
      indexRef.current = idx;
      setCurrentIndex(idx);
    }
  };

  const toggleLike = async (cardId: string) => {
    const already = liked.has(cardId);
    const newSet = new Set(liked);
    if (already) newSet.delete(cardId); else newSet.add(cardId);
    setLiked(newSet);
    setHeartBurst(cardId);
    setLikedAnimationIds(prev=> new Set(prev).add(cardId));
    setTimeout(()=>setHeartBurst(null), 800);
    setTimeout(()=>setLikedAnimationIds(prev=>{const n=new Set(prev); n.delete(cardId); return n;}), 1200);

    // sound beep
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = 660; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.22);
      o.start(); o.stop(ctx.currentTime+0.22);
    } catch {}

    try {
      if (!already) {
        await callAPI('records.create',{collection:'likes', value:{cardId, at:Date.now()}, idempotency_key:`like-${cardId}`});
      } else {
        // find record id to delete - list again
        const data = await callAPI('records.list',{collection:'likes'}) as any;
        const rec = data.records?.find((r:any)=>r.value.cardId===cardId);
        if (rec) await callAPI('records.delete',{collection:'likes', id:rec.id});
      }
    } catch {}
  };

  const toggleSave = (cardId: string) => {
    const already = saved.has(cardId);
    const next = new Set(saved);
    if (already) next.delete(cardId);
    else next.add(cardId);
    setSaved(next);
    writeSavedFeedIds(next);
    flashToast(already ? 'Removed from saved' : 'Saved to collection');
  };

  const toggleFollow = async (makerId: string) => {
    const already = followed.has(makerId);
    const n = new Set(followed);
    if (already) n.delete(makerId); else n.add(makerId);
    setFollowed(n);
    try {
      if (!already) {
        await callAPI('records.create',{collection:'follows', value:{makerId, at:Date.now()}, idempotency_key:`follow-${makerId}`});
      } else {
        const data = await callAPI('records.list',{collection:'follows'}) as any;
        const rec = data.records?.find((r:any)=>r.value.makerId===makerId);
        if (rec) await callAPI('records.delete',{collection:'follows', id:rec.id});
      }
    } catch {}
  };

  const openMusicDrawer = (cardId: string) => {
    setActiveCardForMusic(cardId);
    // Live BGM needs real audio — Jamendo / YouTube / Upload (not Spotify stubs)
    if (cardId === 'live-now-host') setActiveMusicTab('Jamendo');
    setMusicDrawerOpen(true);
    const card = cards.find(c=>c.id===cardId);
    if (card) setSelectedMusicPreview(card.music);
  };

  const saveMusicToCard = async () => {
    if (!activeCardForMusic || !selectedMusicPreview) return;
    setCards(prev=>prev.map(c=> c.id===activeCardForMusic ? {...c, music: selectedMusicPreview} : c));
    setMusicDrawerOpen(false);
    // Only the device actually hosting may push BGM to the room
    const hostingHere = isLocalLiveHost();
    if (hostingHere) {
      const playableUrl =
        selectedMusicPreview.objectUrl &&
        (/^https?:\/\//i.test(selectedMusicPreview.objectUrl) ||
          selectedMusicPreview.objectUrl.startsWith('blob:'))
          ? selectedMusicPreview.objectUrl
          : null;
      const hasYt = Boolean(selectedMusicPreview.youtubeId);
      if (!playableUrl && !hasYt) {
        flashToast('Pick Jamendo, YouTube, or Upload — Spotify stubs have no audio');
      } else {
        void publishRemoteLiveMusic(selectedMusicPreview);
        if (playableUrl) setLiveMusicBed(playableUrl, { volume: 0.45, loop: true });
        else setLiveMusicBed(null);
        flashToast(`BGM · ${selectedMusicPreview.title}`);
      }
    } else if (activeCardForMusic === 'live-now-host' || Boolean(liveBroadcast?.live)) {
      flashToast('Music saved · only host can change live BGM');
    }
    try {
      await callAPI('records.create',{collection:'music_picks', value:{cardId:activeCardForMusic, music:selectedMusicPreview, at:Date.now()}, idempotency_key:`music-${activeCardForMusic}`});
    } catch {
      // if already exists, replace by listing and deleting then creating
      try {
        const data = await callAPI('records.list',{collection:'music_picks'}) as any;
        const rec = data.records?.find((r:any)=>r.value.cardId===activeCardForMusic);
        if (rec) await callAPI('records.delete',{collection:'music_picks', id:rec.id});
        await callAPI('records.create',{collection:'music_picks', value:{cardId:activeCardForMusic, music:selectedMusicPreview, at:Date.now()}});
      } catch {}
    }
  };

  const openGiftForCard = (cardId: string) => {
    const who = getOrCreateGuestIdentity().name;
    openLiveGiftShop({ fromName: who, cardId });
  };

  const onPortalGiftSent = (gift: { coins: number; emoji: string; name: string }, meta: { cardId?: string }) => {
    setWallet(readMfcWallet());
    const id = meta.cardId;
    if (!id) return;
    setGiftBurst(id);
    setGiftRainActive(id);
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, gifts: (c.gifts || 0) + 1 } : c)),
    );
    window.setTimeout(() => setGiftBurst(null), 1000);
    window.setTimeout(() => setGiftRainActive(null), 3000);
    flashToast(`Sent ${gift.emoji} ${gift.name}`);
  };

  const catchGift = (e: MouseEvent) => {
    const id = Date.now()+Math.random();
    setCaughtMFC(prev=>[...prev, {id, x:e.clientX, y:e.clientY}]);
    setWallet(w=>w+10);
    setTimeout(()=>setCaughtMFC(prev=>prev.filter(c=>c.id!==id)), 900);
  };


  /** TikTok-style single top rail — work-category keywords filter the snap feed */
  const TOP_TABS = FEED_TOP_TABS;

  // Seed follows on a few template makers so Following tab has content
  useEffect(() => {
    setFollowed((prev) => {
      if (prev.size) return prev;
      return new Set(TEMPLATE_MAKERS.slice(0, 6).map((m) => m.id));
    });
  }, []);

  useEffect(() => {
    if (!feedSearchOpen) return;
    const t = window.setTimeout(() => searchInputRef.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [feedSearchOpen]);

  const categorySuggestions = useMemo(
    () => suggestWorkCategories(feedSearch, 16),
    [feedSearch],
  );

  const visibleCards = useMemo(() => {
    const q = feedSearch.trim().toLowerCase();
    const tradeTabs = new Set<string>(WORK_CATEGORIES as unknown as string[]);
    const filtered = cards.filter((card) => {
      if (topTab === 'For You') {
        /* keep all templates + posts */
      } else if (topTab === 'Following') {
        if (!followed.has(card.maker.id)) return false;
      } else if (topTab === 'WorkCuts') {
        if (card.type !== 'workcut') return false;
      } else if (topTab === 'Live Replays') {
        if (card.type !== 'liveReplay' && card.type !== 'liveNow') return false;
      } else if (topTab === 'Oldham OL1') {
        if (!card.maker.location.toLowerCase().includes('ol1')) return false;
      } else if (tradeTabs.has(topTab)) {
        if (card.maker.trade.toLowerCase() !== topTab.toLowerCase()) return false;
      }

      if (!q) return true;
      const hay = `${card.title} ${card.caption} ${card.maker.name} ${card.maker.trade} ${card.maker.location} ${card.hashtags.join(' ')} ${card.music.title}`.toLowerCase();
      if (hay.includes(q)) return true;
      // keyword aliases (plumber → Plumbers, engineer → Engineers, …)
      return suggestWorkCategories(q, 8).some(
        (cat) => card.maker.trade.toLowerCase() === cat.toLowerCase(),
      );
    });

    const showLiveRail =
      topTab === 'For You' ||
      topTab === 'Following' ||
      topTab === 'Live Replays' ||
      topTab === 'Oldham OL1' ||
      tradeTabs.has(topTab);

    const publishedCards = showLiveRail
      ? publishedRecs
          .map((rec) => recordingToCard(rec, HOST_MAKER))
          .filter((card) => {
            if (!q) return true;
            const hay = `${card.title} ${card.caption} ${card.maker.name}`.toLowerCase();
            return hay.includes(q);
          })
      : [];

    const uploadedCards =
      topTab === 'For You' || topTab === 'Following' || topTab === 'WorkCuts' || tradeTabs.has(topTab)
        ? userPosts
            .map((p) => userPostToCard(p, HOST_MAKER))
            .filter((card) => {
              if (topTab === 'WorkCuts' && card.type !== 'workcut') return false;
              if (tradeTabs.has(topTab) && card.maker.trade.toLowerCase() !== topTab.toLowerCase()) return false;
              if (!q) return true;
              const hay = `${card.title} ${card.caption} ${card.maker.name}`.toLowerCase();
              return hay.includes(q);
            })
        : [];

    let next = filtered;
    if (publishedCards.length) {
      const ids = new Set(publishedCards.map((c) => c.id));
      next = [...publishedCards, ...next.filter((c) => !ids.has(c.id))];
    }
    if (uploadedCards.length) {
      const ids = new Set(uploadedCards.map((c) => c.id));
      next = [...uploadedCards, ...next.filter((c) => !ids.has(c.id))];
    }

    if (!liveNowCard || !showLiveRail) return next;

    if (q) {
      const hay = `${liveNowCard.title} ${liveNowCard.caption} ${liveNowCard.maker.name} live`.toLowerCase();
      if (!hay.includes(q)) return next;
    }

    return [liveNowCard, ...next.filter((c) => c.id !== liveNowCard.id)];
  }, [cards, topTab, followed, feedSearch, liveNowCard, publishedRecs, userPosts]);

  // When LIVE card appears/disappears at top, keep the same post under the finger
  const livePinned = Boolean(visibleCards[0]?.type === 'liveNow');
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const h = feedCardH.current || el.clientHeight || 0;
    if (!h) {
      hadLiveCardRef.current = livePinned;
      return;
    }
    if (livePinned && !hadLiveCardRef.current) {
      el.scrollTop += h;
      indexRef.current += 1;
      setCurrentIndex(indexRef.current);
    } else if (!livePinned && hadLiveCardRef.current) {
      el.scrollTop = Math.max(0, el.scrollTop - h);
      indexRef.current = Math.max(0, indexRef.current - 1);
      setCurrentIndex(indexRef.current);
    }
    hadLiveCardRef.current = livePinned;
  }, [livePinned]);

  const selectTopTab = (tab: string) => {
    setTopTab(tab);
    setCurrentIndex(0);
    if (timelineRef.current) timelineRef.current.scrollTop = 0;
    // Stay on feed while LIVE — filter in place (do not bounce to Discover)
  };

  const jumpToLive = () => {
    setTopTab('For You');
    setCurrentIndex(0);
    const el = cardRefs.current['live-now-host'];
    if (el) el.scrollIntoView({ behavior: lowMotion ? 'auto' : 'smooth', block: 'start' });
    else if (timelineRef.current) timelineRef.current.scrollTop = 0;
  };

  const hostingHere = isLocalLiveHost();

  const liveShareUrl = (card: Card) => {
    const privateLive =
      liveBroadcast?.live &&
      !liveBroadcast.publicFeed &&
      liveBroadcast.visibility !== 'public';
    if (privateLive) return privateLiveInviteUrl();
    return `${window.location.origin}/app/feed?live=1&maker=${encodeURIComponent(card.maker.id)}`;
  };

  const shareLiveSession = async (card: Card) => {
    const privateLive =
      liveBroadcast?.live &&
      !liveBroadcast.publicFeed &&
      liveBroadcast.visibility !== 'public';
    if (privateLive) {
      openWhatsAppPrivateLiveBroadcast({
        hostName: card.maker.name,
        title: card.title,
        contactNames: (liveBroadcast?.allowedContacts || []).map((c) => c.name),
      });
      flashToast('Opening WhatsApp…');
      return;
    }
    const url = liveShareUrl(card);
    const title = card.title || `${card.maker.name} is LIVE`;
    const text = `Watch ${card.maker.name} live on MyFace`;
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title, text, url });
        flashToast('Shared');
        return;
      }
    } catch (err) {
      // User cancelled share sheet — don't fall through as error
      if (err instanceof DOMException && err.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(url);
      flashToast('Live link copied');
      return;
    } catch {
      /* fallback below */
    }
    // Last resort: prompt so desktop browsers without clipboard still work
    window.prompt('Copy live link', url);
    flashToast('Copy the live link');
  };

  return (
    <div data-safe-area-inset-root className="timeline-root relative h-dvh max-h-dvh w-full bg-[#050505] text-white overflow-hidden" style={{ boxSizing: 'border-box' }}>
      <LiveGiftPortal onSent={onPortalGiftSent} />
      {/* Background glows (desktop only — mobile is full-bleed video) */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden lg:block">
        <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full blur-[120px] opacity-20" style={{background:'radial-gradient(circle,#8FFF4A 0%, transparent 70%)'}}/>
        <div className="absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full blur-[120px] opacity-15" style={{background:'radial-gradient(circle,#1A7CFF 0%, transparent 70%)'}}/>
        <div className="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full blur-[110px] opacity-10" style={{background:'radial-gradient(circle,#FFE600 0%, transparent 70%)'}}/>
      </div>

      {/* Host join inbox — fixed above feed chrome so Accept is always reachable */}
      {hostingHere ? (
        <div
          className="fixed left-3 right-14 pointer-events-none"
          style={{ top: 'calc(var(--feed-chrome-h, 72px) + 8px)', zIndex: 90 }}
        >
          <div className="pointer-events-auto max-w-lg">
            <LiveHostJoinInbox active />
          </div>
        </div>
      ) : null}

      {/* Top overlay — transparent TikTok chrome; video shows underneath */}
      <header
        data-safe-area-sticky-top
        className="feed-top-overlay pointer-events-none fixed inset-x-0 z-30"
        style={{ top: 'var(--safe-area-inset-top, 0px)' }}
      >
        <div
          ref={feedChromeRef}
          className="pointer-events-auto bg-gradient-to-b from-black/55 via-black/25 to-transparent pb-2"
        >
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 px-3 pt-2 lg:px-6">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-[9px] m-gradient flex items-center justify-center font-black text-black text-[11px] shrink-0">M</div>
              <div className="leading-none hidden sm:block">
                <div className="poppins text-[12px] font-extrabold tracking-[0.08em] drop-shadow">MYFACE</div>
              </div>
              <div className="hidden lg:flex items-center gap-2 ml-4">
                <div className="rounded-full px-3 py-1.5 flex items-center gap-2 text-[11px] mono bg-black/25 border border-white/10 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse"/>
                  LIVE 12
                  <span className="text-white/40">•</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${apiStatus==='ok' ? 'bg-[#8FFF4A]/20 text-[#8FFF4A]' : 'bg-white/10 text-white/60'}`}>{apiStatus==='ok' ? 'API Online' : apiStatus==='loading' ? 'Sync…' : 'Offline'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFeedSearchOpen(true)}
                className="h-8 w-8 rounded-full bg-black/25 border border-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition"
                aria-label="Search feed"
              >
                <span className="text-[15px]">⌕</span>
              </button>
              <div className="rounded-full px-2.5 h-8 flex items-center gap-1.5 bg-black/25 border border-white/10 backdrop-blur-md">
                <div className="h-4 w-4 rounded-full m-gradient flex items-center justify-center text-[8px] font-black text-black">M</div>
                <span className="mono text-[11px] font-bold">{wallet}</span>
              </div>
              <button
                type="button"
                className="h-8 w-8 rounded-full bg-black/25 border border-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition"
                aria-label="Music"
                onClick={() => {
                  const current = visibleCards[currentIndex] || cards[currentIndex];
                  const live =
                    cards.find((c) => c.type === 'liveNow' && c.id === current?.id) ||
                    cards.find((c) => c.type === 'liveNow');
                  openMusicDrawer(live?.id || current?.id || 'live-now-host');
                }}
              >
                <IconMusic size={15} />
              </button>
              <button
                type="button"
                className="h-8 w-8 rounded-full bg-black/25 border border-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition relative"
                aria-label="Gifts"
                onClick={() => {
                  const live = cards.find((c) => c.type === 'liveNow' && c.id === cards[currentIndex]?.id) || cards.find((c) => c.type === 'liveNow');
                  openGiftForCard(live?.id || cards[currentIndex]?.id || 'live-now-host');
                }}
              >
                <span className="text-[14px]">🎁</span>
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full m-gradient flex items-center justify-center text-[8px] font-black text-black">+</span>
              </button>
              <div className="hidden lg:flex items-center gap-2 ml-1">
                <label className="flex items-center gap-1.5 rounded-full px-2.5 py-1 mono text-[10px] cursor-pointer bg-black/25 border border-white/10">
                  <input type="checkbox" checked={showCaptions} onChange={e=>setShowCaptions(e.target.checked)} className="accent-[#8FFF4A]"/> CC
                </label>
                <label className="flex items-center gap-1.5 rounded-full px-2.5 py-1 mono text-[10px] cursor-pointer bg-black/25 border border-white/10">
                  <input type="checkbox" checked={lowMotion} onChange={e=>setLowMotion(e.target.checked)} className="accent-[#8FFF4A]"/> Low Motion
                </label>
              </div>
            </div>
          </div>

          {/* One compact rail: live chip + tabs (no stacked overflow) */}
          <div className="mx-auto max-w-[1440px] px-2 lg:px-4 mt-1 flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => {
                if (liveBroadcast?.live) {
                  jumpToLive();
                  return;
                }
                navigate(`/app/discover?mode=live&radius=${LIVE_RADIUS_MI}`);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 h-7 shrink-0 border backdrop-blur-md ${
                liveBroadcast?.live
                  ? 'border-red-500/50 bg-red-500/20'
                  : 'border-white/15 bg-black/30'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="mono text-[9px] font-bold tracking-wide whitespace-nowrap">
                {liveBroadcast?.live
                  ? isLocalLiveHost()
                    ? 'YOU LIVE · tap'
                    : 'LIVE · return'
                  : `${LIVE_NEARBY_COUNT} LIVE`}
              </span>
            </button>
            <div className="flex-1 min-w-0 flex items-center gap-0.5 overflow-x-auto scrollbar-none">
              {TOP_TABS.map((tab) => {
                const active = topTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => selectTopTab(tab)}
                    className={`relative whitespace-nowrap px-2.5 py-1.5 text-[12px] font-semibold tracking-tight transition shrink-0 ${
                      active ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {tab}
                    {active ? (
                      <span className="absolute left-2 right-2 -bottom-0.5 h-[2px] rounded-full bg-white" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Feed search overlay */}
      {feedSearchOpen ? (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col" style={{ paddingTop: 'var(--safe-area-inset-top, 0px)' }}>
          <div className="px-3 pt-3 pb-2 flex items-center gap-2">
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-white/10 border border-white/15"
              onClick={() => setFeedSearchOpen(false)}
              aria-label="Close search"
            >
              ←
            </button>
            <label className="flex-1 h-11 rounded-full border border-white/15 bg-white/[0.06] px-4 flex items-center gap-2">
              <span className="text-white/40">⌕</span>
              <input
                ref={searchInputRef}
                value={feedSearch}
                onChange={(e) => {
                  setFeedSearch(e.target.value);
                  setCurrentIndex(0);
                  if (timelineRef.current) timelineRef.current.scrollTop = 0;
                }}
                placeholder="Plumber, engineer, electrician, barber…"
                className="flex-1 bg-transparent outline-none mono text-[13px] placeholder:text-white/35"
              />
              {feedSearch ? (
                <button type="button" className="text-white/45 text-[12px]" onClick={() => setFeedSearch('')}>
                  Clear
                </button>
              ) : null}
            </label>
            <button
              type="button"
              className="h-10 px-3 rounded-full bg-white text-black mono text-[11px] font-bold"
              onClick={() => setFeedSearchOpen(false)}
            >
              Done
            </button>
          </div>
          <div className="px-4 py-2 mono text-[11px] text-white/50">
            {visibleCards.length} results in {topTab}
            {feedSearch ? ` · “${feedSearch}”` : ''}
          </div>
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {categorySuggestions.map((cat) => (
              <button
                key={cat}
                type="button"
                className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 mono text-[10px] font-semibold text-white/85"
                onClick={() => {
                  setFeedSearch(cat);
                  setTopTab(cat);
                  setCurrentIndex(0);
                  setFeedSearchOpen(false);
                  if (timelineRef.current) timelineRef.current.scrollTop = 0;
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="px-4 pb-1 mono text-[10px] text-white/40">
            Try plumber, engineer, electrician, barber, tailor…
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2">
            {visibleCards.slice(0, 24).map((card) => (
              <button
                key={`search-${card.id}`}
                type="button"
                className="w-full text-left rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex gap-3"
                onClick={() => {
                  setFeedSearchOpen(false);
                  const idx = visibleCards.findIndex((c) => c.id === card.id);
                  if (idx >= 0) {
                    setCurrentIndex(idx);
                    const el = cardRefs.current[card.id];
                    el?.scrollIntoView({ behavior: lowMotion ? 'auto' : 'smooth', block: 'start' });
                  }
                }}
              >
                <img src={card.posterSrc} alt="" className="h-14 w-11 rounded-lg object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold truncate">{card.title}</div>
                  <div className="mono text-[10px] text-white/50 truncate">
                    {card.maker.name} · {card.maker.trade}
                    {card.isTemplate ? ' · Template' : ''}
                  </div>
                </div>
              </button>
            ))}
            {!visibleCards.length ? (
              <div className="rounded-2xl border border-white/10 p-6 text-center mono text-[11px] text-white/45">
                No matches. Try plumber, engineer, electrician, or clear search.
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="feed-stage absolute inset-0 w-full flex justify-center bg-black gap-0">
        <aside className="hidden lg:flex sticky top-0 h-dvh w-14 shrink-0 flex-col items-center gap-1 py-4 border-r border-white/8 bg-black/40 z-20">
          {[
            {to:'/app/feed', label:'Home', Icon:IconHome, active:true},
            {to:'/app/live', label:'Live', Icon:IconLive},
            {to:'/app/arcade', label:'Games', Icon:IconGames},
            {to:'/app/dashboard', label:'OS', Icon:IconCommand},
          ].map(item=>(
            <Link key={item.label} to={item.to} className={item.active ? CRM_RAIL_ITEM_ACTIVE : CRM_RAIL_ITEM} title={item.label}>
              <item.Icon size={18} />
              <span className="mono text-[8px]">{item.label}</span>
            </Link>
          ))}
        </aside>
        <main className="w-full min-w-0 flex justify-center h-full">
          <div className="feed-column relative w-full h-full max-w-none md:max-w-[560px] lg:max-w-[620px] xl:max-w-[680px]">
            {/* Gift catch overlay */}
            {caughtMFC.map(c=>(
              <div key={c.id} className="pointer-events-none fixed z-[60] mono text-[12px] font-bold text-[#8FFF4A]" style={{left:c.x, top:c.y, animation:'floatUp 0.9s ease forwards'}}>
                +10 MFC
              </div>
            ))}

            <div
              ref={timelineRef}
              onScroll={handleScroll}
              className="feed-scroller relative w-full h-full overflow-y-auto overflow-x-hidden bg-black snap-y-mandatory"
              style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' } as CSSProperties}
            >
              {!visibleCards.length ? (
                <div className="feed-card relative w-full snap-start flex flex-col items-center justify-center bg-black px-6 text-center">
                  <div className="poppins text-[18px] font-extrabold">No posts in {topTab}</div>
                  <div className="mono text-[11px] text-white/50 mt-2 max-w-xs">
                    {feedSearch
                      ? `Nothing matched “${feedSearch}”. Clear search or switch tab.`
                      : topTab === 'Following'
                        ? 'Follow makers from the feed, then reopen Following.'
                        : 'Try For You or another trade tab.'}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <button type="button" className="rounded-full bg-white text-black px-4 py-2 mono text-[11px] font-bold" onClick={() => { setTopTab('For You'); setFeedSearch(''); }}>
                      For You
                    </button>
                    <button type="button" className="rounded-full border border-white/20 px-4 py-2 mono text-[11px]" onClick={() => setFeedSearchOpen(true)}>
                      Search
                    </button>
                  </div>
                </div>
              ) : null}
              {visibleCards.map((card, cardIndex)=>(
                <div
                  key={card.id}
                  data-cardid={card.id}
                  data-index={cardIndex}
                  ref={el=>{ cardRefs.current[card.id]=el; }}
                  className="feed-card relative w-full snap-start flex flex-col justify-end bg-black overflow-hidden"
                  onClick={catchGift}
                >
                  {/* Video / Poster area */}
                  <div className="absolute inset-0">
                    {card.type !== 'liveNow' ? (
                      <>
                        <img src={card.posterSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/80" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-black" />
                    )}
                    
                    {card.type==='workcut' && (
                      <div className="absolute inset-0">
                          {card.mediaId && mediaUrlMap[card.mediaId] ? (
                            <video
                              key={card.mediaId}
                              ref={(el) => {
                                videoElsRef.current[card.id] = el;
                                if (!el) return;
                                const muted = cardWantsMute(card.id);
                                el.defaultMuted = muted;
                                el.muted = muted;
                                if (!muted) el.volume = 1;
                              }}
                              src={mediaUrlMap[card.mediaId]}
                              className="absolute inset-0 h-full w-full object-cover bg-black"
                              playsInline
                              loop
                              autoPlay
                              muted={cardWantsMute(card.id)}
                              onLoadedData={() => {
                                applyVideoAudio(card.id, cardWantsMute(card.id));
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : null}
                          <button
                            type="button"
                            aria-label={cardWantsMute(card.id) ? 'Unmute' : 'Mute'}
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextMuted = !cardWantsMute(card.id);
                              if (!nextMuted) unlockFeedSound();
                              setMutedMap((m) => {
                                const n = { ...m, [card.id]: nextMuted };
                                if (!nextMuted) {
                                  Object.keys(videoElsRef.current).forEach((id) => {
                                    if (id !== card.id && n[id] !== true) n[id] = false;
                                  });
                                }
                                return n;
                              });
                              applyVideoAudio(card.id, nextMuted);
                            }}
                            className="absolute right-3 z-[5] h-9 w-9 rounded-lg border border-white/15 bg-black/40 backdrop-blur-md text-white flex items-center justify-center"
                            style={{ top: 'calc(var(--feed-chrome-h, 72px) + 8px)' }}
                          >
                            {cardWantsMute(card.id) ? <IconMute size={16} /> : <IconVolume size={16} />}
                          </button>
                      </div>
                    )}

                    {card.type==='liveNow' && (
                      <FeedLiveNowStage
                        title={card.title}
                        makerName={card.maker.name}
                        makerAvatar={card.maker.avatar}
                        makerColor={card.maker.color}
                        isHost={isLocalLiveHost()}
                        mode={card.liveMode || 'video'}
                        viewers={card.viewers}
                        cardId={card.id}
                        youtubeId={card.youtubeId}
                        youtubePlaylistIds={card.youtubePlaylistIds}
                        youtubePlaylist={card.youtubePlaylist}
                        youtubeDurationSec={card.youtubeDurationSec}
                        startedAt={liveBroadcast?.startedAt || card.duration}
                      />
                    )}

                    {card.type==='liveReplay' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[92%] rounded-[20px] glass-strong overflow-hidden">
                          <div className="flex items-center justify-between p-3 border-b border-white/10">
                            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-white/40"/><span className="mono text-[10px]">REPLAY • {card.duration} • {card.viewers} viewers • 47 gifts</span></div>
                            <span className="rounded-md border border-white/15 bg-black/40 px-2 py-0.5 mono text-[9px]">Replay</span>
                          </div>
                          <div className="h-[320px] bg-[#111] flex items-center justify-center flex-col gap-3">
                            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-xl">● REC</div>
                            <div className="mono text-[10px] text-white/40">Chat · gifts · viewers</div>
                            <div className="flex gap-2">{['👑','💚','✂️','💛'].map((e,i)=><div key={i} className="h-8 w-8 rounded-full glass flex items-center justify-center text-[14px]">{e}</div>)}</div>
                          </div>
                          <div className="p-2 flex gap-2 overflow-x-auto">
                            {Array.from({length:6}).map((_,k)=><div key={k} className="shrink-0 glass rounded-full px-3 py-1.5 mono text-[10px]">User{k}: ❤️ love this cut!</div>)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Progress bar — sits above bottom info, clear of nav */}
                    {card.type !== 'liveNow' ? (
                    <div className="absolute bottom-[128px] left-0 right-0 h-[2px] bg-white/15 lg:bottom-[100px]">
                      <div className="h-full m-gradient" style={{width: isPlayingMap[card.id] ? '44%' : '8%', transition: lowMotion ? 'none' : 'width 0.6s ease'}}/>
                    </div>
                    ) : null}
                  </div>

                  {/* Right action bar — above live chat overlays so Share/Gift stay tappable */}
                  <div
                    className={`absolute right-2.5 z-[45] flex flex-col items-center gap-3 pointer-events-auto ${
                      card.type === 'liveNow' ? 'top-[34%]' : 'top-[42%] -translate-y-1/2'
                    }`}
                  >
                    {[
                      {k:'like', label: `${(card.likes/1000).toFixed(1)}K`, active: liked.has(card.id), action:()=>toggleLike(card.id), Icon: liked.has(card.id) ? IconHeartFill : IconHeart},
                      {
                        k:'comment',
                        label:`${card.comments}`,
                        active:false,
                        action:() => {
                          if (card.type === 'liveNow') {
                            focusLiveChat();
                            flashToast('Live chat');
                            return;
                          }
                          setActionSheet({ kind: 'comment', card });
                        },
                        Icon: IconComment,
                      },
                      {
                        k:'share',
                        label:'Share',
                        active:false,
                        action:() => {
                          if (card.type === 'liveNow') {
                            void shareLiveSession(card);
                            return;
                          }
                          setActionSheet({ kind: 'share', card });
                        },
                        Icon: IconShare,
                      },
                      {
                        k: 'save',
                        label: saved.has(card.id) ? 'Saved' : 'Save',
                        active: saved.has(card.id),
                        action: () => toggleSave(card.id),
                        Icon: (saved.has(card.id) ? IconBookmarkFill : IconBookmark) as typeof IconHeart,
                      },
                      ...(card.type === 'liveNow'
                        ? [
                            {
                              k: 'follow',
                              label: followed.has(card.maker.id) ? 'Following' : 'Follow',
                              active: followed.has(card.maker.id),
                              action: () => void toggleFollow(card.maker.id),
                              Icon: IconHeart as typeof IconHeart,
                            },
                          ]
                        : []),
                      {k:'book', label:'Book', active:false, action:()=>setActionSheet({ kind: 'book', card }), Icon: IconBook},
                      {k:'shop', label:'Shop', active:false, action:()=>setActionSheet({ kind: 'shop', card }), Icon: IconShop},
                    ].map(btn=>(
                      <button key={btn.k} type="button" onClick={(e)=>{e.stopPropagation(); btn.action();}} className="flex flex-col items-center gap-1">
                        <div className={`${btn.active ? CRM_ICON_BTN_ACTIVE : CRM_ICON_BTN} ${likedAnimationIds.has(card.id) && btn.k==='like' ? 'animate-pulse' : ''}`}>
                          {btn.k === 'follow' ? (
                            <span className="text-[11px] font-black">{followed.has(card.maker.id) ? '✓' : '+'}</span>
                          ) : (
                            <btn.Icon size={18} />
                          )}
                        </div>
                        <span className="mono text-[10px] font-bold text-white/80 drop-shadow">{btn.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Heart burst */}
                  {heartBurst===card.id && (
                    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                      <div className="text-[92px]" style={{animation:'burst 0.8s ease forwards'}}>💚</div>
                      {Array.from({length:8}).map((_,k)=>(
                        <div key={k} className="absolute text-[22px]" style={{left:`${42+k*2}%`, top:`${48+k*1.2}%`, animation:`floatUp 0.9s ${k*0.05}s ease forwards`}}>💚</div>
                      ))}
                    </div>
                  )}
                  {giftBurst===card.id && (
                    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                      <div className="text-[84px]" style={{animation:'burst 0.9s ease forwards'}}>👑</div>
                      <div className="absolute inset-0 m-gradient opacity-20 blur-2xl" style={{animation:'burst 0.9s ease forwards'}}/>
                    </div>
                  )}

                  {/* Gift rain active */}
                  {giftRainActive===card.id && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      {Array.from({length:24}).map((_,k)=>(
                        <div key={k} className="absolute text-[18px]" style={{left:`${Math.random()*90}%`, top:`-10%`, animation:`floatUp 2.5s ${k*0.08}s linear forwards reverse`}}>👑</div>
                      ))}
                    </div>
                  )}

                  {/* Bottom info — skip chrome on liveNow so camera stays full-bleed */}
                  {card.type !== 'liveNow' ? (
                  <div className="relative z-10 p-3 pb-[calc(76px+env(safe-area-inset-bottom,0px))] lg:pb-4 bg-gradient-to-t from-black/90 via-black/55 to-transparent">
                    {/* Maker row — TikTok-style: avatar + follow up high, name only */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          className="h-11 w-11 rounded-full flex items-center justify-center font-black text-[12px] text-black ring-2 ring-white/80"
                          style={{background:card.maker.color}}
                          onClick={(e)=>{e.stopPropagation(); navigate(`/app/maker/${card.maker.id}`);}}
                          aria-label={`${card.maker.name} profile`}
                        >
                          {card.maker.avatar}
                        </button>
                        <button
                          type="button"
                          onClick={(e)=>{e.stopPropagation(); void toggleFollow(card.maker.id);}}
                          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-5 min-w-5 px-1 rounded-full text-[10px] font-black leading-none flex items-center justify-center shadow-md ${
                            followed.has(card.maker.id)
                              ? 'bg-white/90 text-black'
                              : 'bg-[#FE2C55] text-white'
                          }`}
                          aria-label={followed.has(card.maker.id) ? 'Following' : 'Follow'}
                        >
                          {followed.has(card.maker.id) ? '✓' : '+'}
                        </button>
                      </div>
                      <button
                        type="button"
                        className="flex-1 min-w-0 text-left"
                        onClick={(e)=>{e.stopPropagation(); navigate(`/app/maker/${card.maker.id}`);}}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="poppins text-[13px] font-extrabold tracking-wide truncate">{card.maker.name}</span>
                          {card.maker.verified && <span className="h-4 w-4 rounded-full bg-[#1A7CFF] flex items-center justify-center text-[10px] text-white shrink-0">✓</span>}
                        </div>
                      </button>
                      <button type="button" className="h-8 w-8 rounded-lg border border-white/12 bg-black/40 flex items-center justify-center text-white/70" onClick={(e)=>{e.stopPropagation(); navigate(`/app/maker/${card.maker.id}`);}}><IconMore size={16} /></button>
                    </div>

                    {/* Caption */}
                    <div className="mt-2.5">
                      <div className="poppins text-[13px] font-bold leading-[1.25]">{card.title}</div>
                      {card.hashtags.length > 0 ? (
                        <div className="mono text-[11px] leading-[1.4] text-[#8FFF4A] mt-1 line-clamp-1">{card.hashtags.join(' ')}</div>
                      ) : null}
                    </div>

                    {/* Project tag + shop */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      {card.projectTag && <span className="rounded-lg border border-white/15 bg-black/40 px-3 py-1 mono text-[10px] font-bold text-white/80">{card.projectTag}</span>}
                      {card.price && <span className="rounded-lg bg-white text-black px-2.5 py-1 mono text-[10px] font-bold">{card.price}</span>}
                    </div>

                    {/* Action row — keep light; Gift/Share/Book/Shop live on the right rail */}
                    <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto">
                      {[
                        { label: `♥ ${card.likes}`, active: liked.has(card.id), run: () => toggleLike(card.id) },
                        { label: `💬 ${card.comments}`, run: () => setActionSheet({ kind: 'comment', card }) },
                        ...(card.type === 'liveReplay' || typeof card.viewers === 'number'
                          ? [{ label: `👁 ${card.viewers ?? 0}`, active: false, run: () => flashToast(`${card.viewers ?? 0} watching`) }]
                          : []),
                      ].map((a, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            a.run();
                          }}
                          className={`whitespace-nowrap glass rounded-full px-2.5 py-1 mono text-[10px] ${a.active ? 'bg-white text-black' : 'text-white/70'}`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>

                    {/* Gift feed avatars */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {['S','A','B','K'].map((l,i)=><div key={i} className="h-6 w-6 rounded-full border-2 border-black bg-white/15 flex items-center justify-center mono text-[9px] font-bold">{l}</div>)}
                      </div>
                      <span className="mono text-[10px] text-white/50">Gift feed • 12 gifted • Wallet +100 MFC</span>
                      {showCaptions && <span className="ml-auto glass rounded-full px-2 py-0.5 mono text-[8px]">CC • Yoruba/Hausa/EN</span>}
                    </div>
                  </div>
                  ) : null}

                  {/* Double tap area — skip on liveNow so Show my live controls work */}
                  {card.type !== 'liveNow' ? (
                  <button aria-label="Like by double tap" className="absolute inset-0 z-5" onDoubleClick={()=>toggleLike(card.id)} style={{background:'transparent'}} />
                  ) : null}
                </div>
              ))}
              {loadingMore && (
                <div className="p-4 space-y-3">
                  <div className="h-[320px] rounded-[24px] shimmer"/>
                  <div className="h-4 rounded-full shimmer w-2/3"/>
                  <div className="h-3 rounded-full shimmer w-1/2"/>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Jump back to LIVE without ending the session */}
      {liveBroadcast?.live && visibleCards[currentIndex]?.id !== 'live-now-host' ? (
        <button
          type="button"
          onClick={jumpToLive}
          className="fixed z-[55] left-1/2 -translate-x-1/2 bottom-[calc(64px+env(safe-area-inset-bottom,0px))] flex items-center gap-2 rounded-full bg-red-600 pl-2.5 pr-3.5 py-2 shadow-[0_8px_28px_rgba(220,38,38,0.45)] border border-white/20"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
            <span className="relative rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <span className="text-[11px] font-extrabold tracking-wide text-white uppercase">
            Back to LIVE
          </span>
        </button>
      ) : null}

      {/* Bottom Mobile Fixed — translucent over video like TikTok */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-2 pt-3 pb-[max(8px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          <Link to="/app/feed" className="flex flex-col items-center gap-0.5 min-w-[52px]">
            <div className="h-8 w-8 rounded-full bg-white/95 text-black flex items-center justify-center">⌂</div>
            <span className="mono text-[9px] drop-shadow text-white font-bold">Home</span>
          </Link>
          <Link to="/app/discover" className="flex flex-col items-center gap-0.5 min-w-[52px]">
            <div className="h-8 w-8 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/80">◍</div>
            <span className="mono text-[9px] drop-shadow text-white/60">Discover</span>
          </Link>
          <button
            type="button"
            onClick={() => setGoLiveOpen(true)}
            className="flex flex-col items-center gap-0.5 min-w-[52px] -mt-4"
            aria-label="Create — post video or go live"
          >
            <div className="h-12 w-12 rounded-full m-gradient flex items-center justify-center text-black text-[22px] font-black shadow-[0_0_24px_rgba(143,255,74,0.45)]">
              +
            </div>
          </button>
          <Link to="/app/arcade" className="flex flex-col items-center gap-0.5 min-w-[52px]">
            <div className="h-8 w-8 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/80">◐</div>
            <span className="mono text-[9px] drop-shadow text-white/60">Games</span>
          </Link>
          <Link to="/app/dashboard" className="flex flex-col items-center gap-0.5 min-w-[52px]">
            <div className="h-8 w-8 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/80">◍</div>
            <span className="mono text-[9px] drop-shadow text-white/60">Profile</span>
          </Link>
        </div>
      </nav>

      {toast ? (
        <div className="fixed top-[72px] inset-x-4 z-[90] mx-auto max-w-sm rounded-2xl border border-[#8FFF4A]/35 bg-black/85 px-4 py-3 mono text-[12px] text-[#8FFF4A] text-center shadow-xl">
          {toast}
        </div>
      ) : null}

      {actionSheet ? (
        <div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center">
          <button type="button" className="absolute inset-0 bg-black/65 backdrop-blur-sm" aria-label="Close" onClick={() => setActionSheet(null)} />
          <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-white/12 bg-[#0B0B0B] p-5 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="mono text-[10px] uppercase tracking-wider text-white/45">{actionSheet.kind}</div>
                <div className="text-[16px] font-extrabold truncate">{actionSheet.card.maker.name}</div>
                <div className="mono text-[11px] text-white/50 truncate mt-0.5">{actionSheet.card.title}</div>
              </div>
              <button type="button" className="h-9 w-9 rounded-full border border-white/12" onClick={() => setActionSheet(null)}>✕</button>
            </div>

            {actionSheet.kind === 'comment' ? (
              <div className="space-y-3">
                <div className="space-y-2 max-h-[30svh] overflow-y-auto">
                  {['Love this cut 💚', 'How many metres of lace?', 'Book for Saturday fitting?', 'TrustScore says it all'].map((c) => (
                    <div key={c} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px]">{c}</div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    placeholder="Add a comment…"
                    className="flex-1 h-11 rounded-xl border border-white/15 bg-black/40 px-3 text-[13px] outline-none"
                  />
                  <button
                    type="button"
                    className="h-11 px-4 rounded-xl bg-white text-black font-bold text-[12px]"
                    onClick={() => {
                      if (!commentDraft.trim()) return;
                      setCommentDraft('');
                      setActionSheet(null);
                      flashToast('Comment posted');
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            ) : null}

            {actionSheet.kind === 'share' ? (
              <div className="grid gap-2">
                {[
                  {
                    label: actionSheet.card.type === 'liveNow' ? 'Copy live link' : 'Copy link',
                    run: async () => {
                      const url =
                        actionSheet.card.type === 'liveNow'
                          ? liveShareUrl(actionSheet.card)
                          : `${window.location.origin}/app/feed`;
                      try {
                        await navigator.clipboard.writeText(url);
                        flashToast(actionSheet.card.type === 'liveNow' ? 'Live link copied' : 'Link copied');
                      } catch {
                        window.prompt('Copy link', url);
                        flashToast('Copy the link');
                      }
                      setActionSheet(null);
                    },
                  },
                  {
                    label: 'Share via device…',
                    run: async () => {
                      const card = actionSheet.card;
                      if (card.type === 'liveNow') {
                        await shareLiveSession(card);
                        setActionSheet(null);
                        return;
                      }
                      const url = `${window.location.origin}/app/maker/${card.maker.id}`;
                      try {
                        if (typeof navigator.share === 'function') {
                          await navigator.share({ title: card.title, url });
                        } else {
                          await navigator.clipboard.writeText(url);
                          flashToast('Link copied');
                        }
                      } catch {
                        /* cancelled */
                      }
                      setActionSheet(null);
                    },
                  },
                  {
                    label: 'Open maker profile',
                    run: () => {
                      setActionSheet(null);
                      navigate(`/app/maker/${actionSheet.card.maker.id}`);
                    },
                  },
                  {
                    label: 'Message maker (DM)',
                    run: () => {
                      setActionSheet(null);
                      navigate(`/app/messages/${actionSheet.card.maker.id}`);
                    },
                  },
                ].map((row) => (
                  <button key={row.label} type="button" className="h-12 rounded-2xl border border-white/12 bg-white/[0.04] text-left px-4 font-semibold text-[13px]" onClick={() => void row.run()}>
                    {row.label}
                  </button>
                ))}
              </div>
            ) : null}

            {actionSheet.kind === 'book' ? (
              <div className="space-y-3">
                <p className="text-[13px] text-white/70">Book a fitting / consult with {actionSheet.card.maker.name} · Spindlegate OL1.</p>
                <button
                  type="button"
                  className="w-full h-12 rounded-2xl bg-white text-black font-bold"
                  onClick={() => {
                    setActionSheet(null);
                    flashToast('Booking request sent');
                    navigate(`/app/maker/${actionSheet.card.maker.id}`);
                  }}
                >
                  Request booking
                </button>
              </div>
            ) : null}

            {actionSheet.kind === 'shop' ? (
              <div className="space-y-2">
                {(actionSheet.card.shopItems || [
                  { name: 'Aso-Ebi lace 5m', price: '£180', tagX: 0, tagY: 0 },
                  { name: 'Gele wrap', price: '£45', tagX: 0, tagY: 0 },
                  { name: 'Fitting slot', price: '£60', tagX: 0, tagY: 0 },
                ]).map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="w-full flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3"
                    onClick={() => {
                      flashToast(`Added ${item.name}`);
                    }}
                  >
                    <span className="text-[13px] font-semibold">{item.name}</span>
                    <span className="mono text-[12px] text-[#8FFF4A] font-bold">{item.price}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className="w-full h-11 rounded-2xl border border-white/15 mt-1"
                  onClick={() => {
                    setActionSheet(null);
                    navigate(`/app/maker/${actionSheet.card.maker.id}`);
                  }}
                >
                  Open shop on profile
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <GoLivePicker
        open={goLiveOpen}
        onClose={() => setGoLiveOpen(false)}
        title="Go Live"
        onChoose={(pick: GoLivePick) => {
          void (async () => {
            try {
              if (pick.kind === 'post') {
                setGoLiveOpen(false);
                setUploadPostFile(pick.file);
                return;
              }
              const audienceMeta = broadcastMetaFromAudience(pick.audience);
              const goPublic = Boolean(
                pick.audience.publicFeed || pick.audience.visibility === 'public',
              );
              if (pick.kind === 'camera' && pick.mode === 'video') {
                try {
                  await acquireLiveCamera();
                } catch {
                  try {
                    sessionStorage.setItem('myface.live.needCamera', '1');
                  } catch {
                    /* ignore */
                  }
                }
                setBroadcast(true, {
                  mode: 'video',
                  viewers: 144,
                  title: goPublic ? "Video Live · AYO'S · OL1" : "Private Live · contacts",
                  ...audienceMeta,
                });
                setGoLiveOpen(false);
                flashToast(goPublic ? 'Live on public feed' : 'Private live · contacts only');
                // Group/split video only exists on the feed live stage — keep private lives there too
                navigate(goPublic ? '/app/feed?live=1' : '/app/feed?live=1&invite=private');
                return;
              }
              if (pick.kind === 'camera' && pick.mode === 'audio') {
                try {
                  sessionStorage.removeItem('myface.live.needCamera');
                } catch {
                  /* ignore */
                }
                await startLiveAudioOnlyPublish();
                setBroadcast(true, {
                  mode: 'audio',
                  viewers: 144,
                  title: goPublic ? "Audio Live · AYO'S · OL1" : 'Private Audio · contacts',
                  ...audienceMeta,
                });
                setGoLiveOpen(false);
                flashToast(goPublic ? 'Audio live on public feed' : 'Private audio · contacts only');
                navigate(goPublic ? '/app/feed?live=1' : '/app/feed?live=1&invite=private');
                return;
              }
              if (pick.kind === 'youtube') {
                try {
                  const { stopLiveMediaSource } = await import('../live/liveMediaSource');
                  stopLiveMediaSource();
                } catch {
                  /* ignore */
                }
                const mins = Math.round(pick.durationSec / 60);
                const n = pick.playlist.length;
                setBroadcast(true, {
                  mode: 'video',
                  viewers: 144,
                  youtubeId: pick.youtubeId,
                  youtubePlaylistIds: pick.playlist.map((p) => p.id),
                  youtubePlaylist: pick.playlist,
                  youtubeDurationSec: pick.durationSec,
                  title: goPublic
                    ? `YouTube · ${n} vid · ${mins}m`
                    : `Private YT · ${n} vid · ${mins}m`,
                  ...audienceMeta,
                });
                setGoLiveOpen(false);
                flashToast(
                  goPublic
                    ? `YouTube playlist · ${n} · ${mins}m`
                    : `Private YouTube playlist · ${n} · ${mins}m`,
                );
                navigate(goPublic ? '/app/feed?live=1' : '/app/feed?live=1&invite=private');
                return;
              }
              if (pick.kind === 'file' || pick.kind === 'link') {
                const src = pick.kind === 'file' ? pick.file : pick.url;
                await startLiveMediaSource(src);
                void startSessionRecording({ mode: 'video' });
                setBroadcast(true, {
                  mode: 'video',
                  viewers: 144,
                  title: goPublic
                    ? pick.kind === 'file'
                      ? `File Live · ${pick.file.name.slice(0, 28)}`
                      : 'Link Live · AYO stream'
                    : pick.kind === 'file'
                      ? `Private file · ${pick.file.name.slice(0, 20)}`
                      : 'Private link live',
                  ...audienceMeta,
                });
                setGoLiveOpen(false);
                flashToast(goPublic ? 'Streaming to public feed' : 'Private live · contacts only');
                navigate(goPublic ? '/app/feed?live=1' : '/app/feed?live=1&invite=private');
              }
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Could not start stream';
              flashToast(msg);
            }
          })();
        }}
      />

      <UploadPostSheet
        open={Boolean(uploadPostFile)}
        file={uploadPostFile}
        onClose={() => setUploadPostFile(null)}
        onPost={async ({ file, title, caption }) => {
          // Post click = user gesture: unlock audio BEFORE any await
          unlockFeedSound();
          const seedUrl = URL.createObjectURL(file);
          const warm = document.createElement('video');
          warm.playsInline = true;
          warm.setAttribute('playsinline', '');
          warm.src = seedUrl;
          warm.muted = false;
          warm.volume = 1;
          void warm.play().catch(() => undefined);

          const post = await createFeedUserPost({ file, title, caption });
          const cardId = `upost-${post.id}`;
          // Seed blob URL immediately so feed can play with sound without waiting on IDB
          setMediaUrlMap((m) => ({ ...m, [post.mediaId]: seedUrl }));
          setMutedMap((m) => ({ ...m, [cardId]: false }));
          setUserPosts(readFeedUserPosts());
          setUploadPostFile(null);
          setTopTab('For You');
          flashToast('Posted with sound · For You');
          warm.pause();
          requestAnimationFrame(() => {
            cardRefs.current[cardId]?.scrollIntoView({ behavior: 'auto', block: 'start' });
            window.setTimeout(() => applyVideoAudio(cardId, false), 80);
            window.setTimeout(() => applyVideoAudio(cardId, false), 350);
          });
        }}
      />

      <MusicDrawer
        open={musicDrawerOpen}
        onClose={() => setMusicDrawerOpen(false)}
        activeTab={activeMusicTab}
        onTabChange={setActiveMusicTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selected={selectedMusicPreview}
        onSelect={setSelectedMusicPreview}
        onSave={saveMusicToCard}
        contextLabel={activeCardForMusic === 'live-now-host' ? 'live session BGM' : 'timeline card'}
        allowUpload
      />

      {/* Pull to refresh indicator */}
      <div className="pointer-events-none fixed top-16 left-1/2 -translate-x-1/2 z-20 rounded-full px-3 py-1 mono text-[10px] opacity-0 bg-black/40">
        Pull to refresh
      </div>
    </div>
  );
}
