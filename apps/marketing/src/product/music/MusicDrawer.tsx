import { useEffect, useMemo, useRef, useState } from 'react';
import { jamendoConfigured, searchJamendoTracks } from './jamendo';
import YoutubeEmbed from './YoutubeEmbed';
import { searchYoutubeTracks, youtubeApiConfigured } from './youtube';

export type MusicSource = 'Jamendo' | 'Spotify' | 'Apple' | 'YouTube' | 'SoundCloud' | 'Upload';

export type Music = {
  title: string;
  artist: string;
  source: MusicSource;
  api?: string;
  duration?: string;
  color?: string;
  objectUrl?: string;
  license?: string;
  jamendoId?: string;
  youtubeId?: string;
  thumbnail?: string;
};

export const MOCK_SONGS: Record<string, Music[]> = {
  Spotify: [
    { title: 'Jaiye Jaiye', artist: 'Wizkid ft Femi Kuti', source: 'Spotify', api: 'Spotify Web API', duration: '0:30', color: '#1DB954' },
    { title: 'Peru', artist: 'Fireboy DML', source: 'Spotify', api: 'Spotify Web API', duration: '0:30', color: '#1DB954' },
    { title: 'Essence', artist: 'Wizkid ft Tems', source: 'Spotify', api: 'Spotify Web API', duration: '0:30', color: '#1DB954' },
    { title: 'Oldham Nights', artist: 'Burna Boy', source: 'Spotify', api: 'Spotify Web API', duration: '0:30', color: '#1DB954' },
    { title: 'Yoruba Fuji', artist: 'Ayinde Barrister', source: 'Spotify', api: 'Spotify Web API', duration: '0:15', color: '#1DB954' },
  ],
  Apple: [
    { title: 'Calm Down', artist: 'Rema', source: 'Apple', api: 'Apple MusicKit', duration: '0:30', color: '#FA243C' },
    { title: 'Rush', artist: 'Ayra Starr', source: 'Apple', api: 'Apple MusicKit', duration: '0:30', color: '#FA243C' },
    { title: 'Aso-Ebi Anthem', artist: 'K1 De Ultimate', source: 'Apple', api: 'Apple MusicKit', duration: '0:22', color: '#FA243C' },
  ],
  SoundCloud: [
    { title: 'Fuji Percussions 140bpm', artist: 'Afro Drums', source: 'SoundCloud', api: 'SoundCloud API', duration: '0:30', color: '#FF5500' },
    { title: 'Oldham Street Amapiano', artist: 'DJ Lims', source: 'SoundCloud', api: 'SoundCloud API', duration: '0:30', color: '#FF5500' },
  ],
};

const TABS: MusicSource[] = ['Jamendo', 'Spotify', 'Apple', 'YouTube', 'SoundCloud', 'Upload'];

export function MusicDrawer({
  open,
  onClose,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  selected,
  onSelect,
  onSave,
  contextLabel = 'content',
  allowUpload = true,
}: {
  open: boolean;
  onClose: () => void;
  activeTab: MusicSource;
  onTabChange: (tab: MusicSource) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selected: Music | null;
  onSelect: (m: Music | null) => void;
  onSave: () => void;
  contextLabel?: string;
  allowUpload?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadName, setUploadName] = useState('');
  const [trimSec, setTrimSec] = useState(30);
  const [volume, setVolume] = useState(0.8);
  const [loop, setLoop] = useState(true);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [jamendoHits, setJamendoHits] = useState<Music[]>([]);
  const [jamendoLoading, setJamendoLoading] = useState(false);
  const [jamendoError, setJamendoError] = useState<string | null>(null);
  const [youtubeHits, setYoutubeHits] = useState<Music[]>([]);
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);

  const mockResults = useMemo(() => {
    if (activeTab === 'Jamendo' || activeTab === 'YouTube' || activeTab === 'Upload') return [];
    const pool = MOCK_SONGS[activeTab] || [];
    if (!searchQuery) return pool;
    const q = searchQuery.toLowerCase();
    return pool.filter(
      (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q),
    );
  }, [searchQuery, activeTab]);

  useEffect(() => {
    if (!open || activeTab !== 'Jamendo') return;
    if (!jamendoConfigured()) {
      setJamendoError('Add VITE_JAMENDO_CLIENT_ID to env');
      setJamendoHits([]);
      return;
    }

    let cancelled = false;
    const handle = window.setTimeout(() => {
      setJamendoLoading(true);
      setJamendoError(null);
      void searchJamendoTracks(searchQuery || 'afrobeat', 24)
        .then((rows) => {
          if (cancelled) return;
          setJamendoHits(
            rows.map((r) => ({
              title: r.title,
              artist: r.artist,
              source: 'Jamendo' as const,
              api: r.api,
              duration: r.duration,
              color: r.color,
              objectUrl: r.objectUrl,
              license: r.license,
              jamendoId: r.jamendoId,
            })),
          );
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setJamendoHits([]);
          setJamendoError(err instanceof Error ? err.message : 'Jamendo search failed');
        })
        .finally(() => {
          if (!cancelled) setJamendoLoading(false);
        });
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [open, activeTab, searchQuery]);

  useEffect(() => {
    if (!open || activeTab !== 'YouTube') return;

    let cancelled = false;
    const handle = window.setTimeout(() => {
      setYoutubeLoading(true);
      setYoutubeError(null);
      void searchYoutubeTracks(searchQuery)
        .then((rows) => {
          if (cancelled) return;
          setYoutubeHits(
            rows.map((r) => ({
              title: r.title,
              artist: r.artist,
              source: 'YouTube' as const,
              api: youtubeApiConfigured() ? 'YouTube Data API v3' : 'YouTube embed · curated / URL',
              duration: r.duration || 'video',
              color: '#FF0000',
              youtubeId: r.youtubeId,
              thumbnail: r.thumbnail,
            })),
          );
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setYoutubeHits([]);
          setYoutubeError(err instanceof Error ? err.message : 'YouTube search failed');
        })
        .finally(() => {
          if (!cancelled) setYoutubeLoading(false);
        });
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [open, activeTab, searchQuery]);

  if (!open) return null;

  const searchResults =
    activeTab === 'Jamendo' ? jamendoHits : activeTab === 'YouTube' ? youtubeHits : mockResults;
  const listLoading =
    (activeTab === 'Jamendo' && jamendoLoading) || (activeTab === 'YouTube' && youtubeLoading);
  const liveConnected =
    activeTab === 'Jamendo'
      ? jamendoConfigured() && !jamendoError
      : activeTab === 'YouTube'
        ? !youtubeError
        : activeTab !== 'Upload';

  const simulateDownload = () => {
    if (!selected) return;
    setDownloading(true);
    setProgress(0);
    let p = 0;
    const id = window.setInterval(() => {
      p += 12 + Math.random() * 18;
      if (p >= 100) {
        p = 100;
        window.clearInterval(id);
        setDownloading(false);
        setProgress(100);
        try {
          localStorage.setItem(
            'myface.music.ledger',
            JSON.stringify({
              ...(JSON.parse(localStorage.getItem('myface.music.ledger') || '{}') as object),
              [selected.title]: {
                music: selected,
                bucket: 'myface-media',
                at: Date.now(),
                context: contextLabel,
              },
            }),
          );
        } catch {
          /* ignore */
        }
      }
      setProgress(Math.min(100, Math.floor(p)));
    }, 180);
  };

  const onFile = (file: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      window.alert('10MB limit');
      return;
    }
    const url = URL.createObjectURL(file);
    setUploadName(file.name);
    onSelect({
      title: file.name.replace(/\.[^.]+$/, ''),
      artist: 'Upload',
      source: 'Upload',
      api: 'MyFace storage',
      duration: `0:${String(Math.min(60, Math.max(15, trimSec))).padStart(2, '0')}`,
      color: '#8FFF4A',
      objectUrl: url,
    });
  };

  const tabIcon = (tab: MusicSource) => {
    if (tab === 'Jamendo') return '♪';
    if (tab === 'Spotify') return '♫';
    if (tab === 'Apple') return '';
    if (tab === 'YouTube') return '▶';
    return '☁';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[6px]" onClick={onClose} />
      <div className="relative w-full max-w-[520px] max-h-[86dvh] rounded-t-[28px] bg-[#0F0F0F] border-t border-white/15 overflow-hidden flex flex-col shadow-[0_-20px_80px_rgba(0,0,0,0.8)]">
        <div className="p-1 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <div className="px-5 pt-3 pb-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="poppins text-[16px] font-extrabold">Add music</div>
            <div className="mono text-[10px] text-white/50 mt-0.5 truncate">
              Attach to {contextLabel} · Jamendo live · mocks · Upload
            </div>
          </div>
          <button type="button" onClick={onClose} className="glass rounded-full h-8 w-8 flex items-center justify-center shrink-0">
            ✕
          </button>
        </div>

        <div className="px-3 py-2 flex gap-1.5 overflow-x-auto border-y border-white/10 bg-white/[0.02]">
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`whitespace-nowrap rounded-full px-4 py-2 mono text-[11px] font-bold border transition flex items-center gap-1.5 ${
                  active ? 'bg-white text-black border-white' : 'glass border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {tab}
                {tab === 'Jamendo' || tab === 'YouTube' || tab === 'Upload' ? (
                  <span
                    className={`h-2 w-2 rounded-full inline-block ${
                      tab === 'Jamendo' && jamendoConfigured()
                        ? 'bg-[#8FFF4A] animate-pulse'
                        : tab === 'YouTube'
                          ? 'bg-[#FF0000] animate-pulse'
                          : 'bg-white/30'
                    }`}
                  />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-white/25 inline-block" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab !== 'Upload' ? (
            <>
              <div className="glass rounded-full px-4 h-11 flex items-center gap-2.5">
                <span className="text-white/40">⌕</span>
                <input
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={
                    activeTab === 'Jamendo'
                      ? 'Search Jamendo (afrobeat, ambient…)'
                      : activeTab === 'YouTube'
                        ? 'Paste YouTube URL or search lofi…'
                        : `Search ${activeTab}`
                  }
                  className="flex-1 bg-transparent outline-none mono text-[12px] placeholder:text-white/30"
                />
                <span
                  className={`mono text-[9px] px-2 py-1 rounded-lg ${
                    liveConnected ? 'bg-white/10 text-[#8FFF4A]' : 'bg-white/10 text-white/40'
                  }`}
                >
                  {activeTab === 'Jamendo'
                    ? jamendoLoading
                      ? 'Searching…'
                      : jamendoConfigured()
                        ? 'Live'
                        : 'Setup'
                    : activeTab === 'YouTube'
                      ? youtubeLoading
                        ? 'Loading…'
                        : youtubeApiConfigured()
                          ? 'API'
                          : 'Embed'
                      : 'Mock'}
                </span>
              </div>

              <div className="glass rounded-[14px] p-3 flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center text-[16px]"
                  style={{
                    background:
                      activeTab === 'Jamendo'
                        ? '#FF5E3A'
                        : activeTab === 'YouTube'
                          ? '#FF0000'
                          : MOCK_SONGS[activeTab]?.[0]?.color || '#fff',
                  }}
                >
                  {tabIcon(activeTab)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mono text-[11px] font-bold flex items-center gap-2 flex-wrap">
                    {activeTab}
                    <span
                      className={`h-2 w-2 rounded-full inline-block ${
                        liveConnected ? 'bg-[#8FFF4A]' : 'bg-white/30'
                      }`}
                    />
                    <span className={liveConnected ? 'text-[#8FFF4A]' : 'text-white/40'}>
                      {activeTab === 'Jamendo'
                        ? jamendoConfigured()
                          ? 'API connected'
                          : 'Needs client id'
                        : activeTab === 'YouTube'
                          ? youtubeApiConfigured()
                            ? 'Data API + embed'
                            : 'Embed · paste URL / curated'
                          : 'Demo catalog'}
                    </span>
                  </div>
                  <div className="mono text-[9px] text-white/40 mt-0.5">
                    {activeTab === 'Jamendo'
                      ? 'CC stream · full track URL · license on each song'
                      : activeTab === 'YouTube'
                        ? 'Paste youtube.com / youtu.be link · curated lofi · optional API key'
                        : 'Mock search · swap to Jamendo / YouTube for real audio'}
                  </div>
                </div>
              </div>

              {jamendoError && activeTab === 'Jamendo' ? (
                <div className="rounded-[12px] border border-red-500/30 bg-red-500/10 px-3 py-2 mono text-[10px] text-red-200">
                  {jamendoError}
                </div>
              ) : null}
              {youtubeError && activeTab === 'YouTube' ? (
                <div className="rounded-[12px] border border-red-500/30 bg-red-500/10 px-3 py-2 mono text-[10px] text-red-200">
                  {youtubeError}
                </div>
              ) : null}

              <div className="space-y-2">
                {listLoading && !searchResults.length ? (
                  <div className="glass rounded-[14px] p-4 mono text-[11px] text-white/50">
                    Loading {activeTab}…
                  </div>
                ) : null}
                {!listLoading && !searchResults.length ? (
                  <div className="glass rounded-[14px] p-4 mono text-[11px] text-white/50">
                    {activeTab === 'YouTube'
                      ? 'No videos found. Paste a YouTube URL or try “lofi”.'
                      : 'No tracks found.'}
                  </div>
                ) : null}
                {searchResults.map((song, i) => (
                  <button
                    key={`${song.source}-${song.youtubeId || song.jamendoId || song.title}-${i}`}
                    type="button"
                    onClick={() => onSelect(song)}
                    className={`w-full text-left rounded-[16px] p-3 flex items-center gap-3 border transition ${
                      selected?.title === song.title && selected?.artist === song.artist
                        ? 'bg-white text-black border-white'
                        : 'glass border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {song.thumbnail ? (
                      <img
                        src={song.thumbnail}
                        alt=""
                        className="h-11 w-11 rounded-[10px] object-cover shrink-0 border border-white/10"
                      />
                    ) : (
                      <div
                        className="h-11 w-11 rounded-[10px] flex items-center justify-center text-[18px] shrink-0"
                        style={{ background: `${song.color}22`, border: `1px solid ${song.color}44` }}
                      >
                        ♪
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`mono text-[12px] font-bold truncate ${
                          selected?.title === song.title && selected?.artist === song.artist
                            ? 'text-black'
                            : 'text-white'
                        }`}
                      >
                        {song.title}
                      </div>
                      <div
                        className={`mono text-[10px] truncate ${
                          selected?.title === song.title && selected?.artist === song.artist
                            ? 'text-black/60'
                            : 'text-white/50'
                        }`}
                      >
                        {song.artist} · {song.duration}
                        {song.source === 'Jamendo'
                          ? ' · stream'
                          : song.source === 'YouTube'
                            ? ' · embed'
                            : ' preview'}
                      </div>
                    </div>
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-[12px] ${
                        selected?.title === song.title && selected?.artist === song.artist
                          ? 'bg-black text-white'
                          : 'glass'
                      }`}
                    >
                      {selected?.title === song.title && selected?.artist === song.artist ? '✓' : '▶'}
                    </div>
                  </button>
                ))}
              </div>

              {selected && selected.source !== 'Upload' ? (
                <div className="space-y-2">
                  {selected.youtubeId ? (
                    <YoutubeEmbed youtubeId={selected.youtubeId} title={selected.title} autoplay />
                  ) : selected.objectUrl ? (
                    <audio
                      key={selected.objectUrl}
                      src={selected.objectUrl}
                      controls
                      autoPlay
                      loop={loop}
                      className="w-full"
                      ref={(el) => {
                        if (el) el.volume = volume;
                      }}
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={simulateDownload}
                    disabled={downloading}
                    className="w-full h-10 rounded-full bg-white text-black mono text-[11px] font-bold disabled:opacity-50"
                  >
                    {downloading
                      ? `Saving ${progress}%`
                      : selected.source === 'Jamendo'
                        ? 'Save Jamendo track to MyFace'
                        : selected.source === 'YouTube'
                          ? 'Save YouTube to MyFace BGM'
                          : `Save preview from ${selected.source}`}
                  </button>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full m-gradient transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="glass rounded-[12px] p-3 mono text-[10px] leading-[1.4] text-white/50">
                    <span className="text-[#FFE600] font-bold">License note:</span>{' '}
                    {selected.source === 'Jamendo' ? (
                      <>
                        Creative Commons stream via Jamendo.
                        {selected.license ? (
                          <>
                            {' '}
                            <a href={selected.license} target="_blank" rel="noreferrer" className="text-[#8FFF4A] underline">
                              View license
                            </a>
                          </>
                        ) : null}
                      </>
                    ) : selected.source === 'YouTube' ? (
                      <>
                        Plays via official YouTube embed. Respect the video’s license / Content ID for commercial
                        use. Add <span className="text-white/80">VITE_YOUTUBE_API_KEY</span> for full search.
                      </>
                    ) : (
                      <>Commercial use needs rights check. Mock catalogs stay demo-only.</>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          ) : allowUpload ? (
            <div className="space-y-3">
              <input
                ref={fileRef}
                type="file"
                accept="audio/mpeg,audio/wav,audio/x-wav,.mp3,.wav"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] || null)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-[18px] border border-dashed border-white/15 bg-white/[0.02] p-6 text-center hover:bg-white/[0.04]"
              >
                <div className="h-14 w-14 rounded-full glass mx-auto flex items-center justify-center text-[22px]">⬆</div>
                <div className="poppins text-[14px] font-bold mt-3">Drag drop MP3 / WAV</div>
                <div className="mono text-[11px] text-white/50 mt-1">10MB · MP3 / WAV · trim · MyFace storage</div>
                {uploadName ? <div className="mt-3 mono text-[11px] text-[#8FFF4A]">{uploadName}</div> : null}
              </button>

              <div className="glass rounded-[14px] p-4 space-y-3">
                <label className="block mono text-[10px] text-white/50">
                  Trim {trimSec}s (15–60)
                  <input
                    type="range"
                    min={15}
                    max={60}
                    value={trimSec}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setTrimSec(v);
                      if (selected?.source === 'Upload') {
                        onSelect({ ...selected, duration: `0:${String(v).padStart(2, '0')}` });
                      }
                    }}
                    className="mt-2 w-full accent-[#8FFF4A]"
                  />
                </label>
                <label className="block mono text-[10px] text-white/50">
                  Volume {Math.round(volume * 100)}%
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="mt-2 w-full accent-[#8FFF4A]"
                  />
                </label>
                <label className="flex items-center gap-2 mono text-[11px]">
                  <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} className="accent-[#8FFF4A]" />
                  Loop in live / timeline
                </label>
                {selected?.objectUrl ? (
                  <audio
                    src={selected.objectUrl}
                    controls
                    loop={loop}
                    className="w-full mt-1"
                    ref={(el) => {
                      if (el) el.volume = volume;
                    }}
                  />
                ) : null}
              </div>
            </div>
          ) : (
            <div className="glass rounded-[14px] p-4 mono text-[11px] text-white/50">Uploads disabled in this context.</div>
          )}

          {selected ? (
            <div className="glass-strong rounded-[16px] p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full m-gradient flex items-center justify-center text-black animate-pulse">♫</div>
              <div className="flex-1 min-w-0">
                <div className="mono text-[11px] font-bold truncate">
                  {selected.title} · {selected.artist}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[38%] m-gradient animate-pulse" />
                  </div>
                  <span className="mono text-[9px] text-white/40">{selected.duration}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-4 border-t border-white/10 bg-[#0F0F0F] flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 h-12 rounded-full glass mono text-[12px] font-bold">
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!selected}
            className="flex-[1.6] h-12 rounded-full m-gradient text-black poppins font-extrabold text-[13px] disabled:opacity-40 disabled:grayscale"
          >
            Save to content
          </button>
        </div>
      </div>
    </div>
  );
}

export default MusicDrawer;
