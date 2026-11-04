import { useEffect, useMemo, useState, type ComponentType, type SVGProps } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdRevenueScorecard from '../arcade/AdRevenueScorecard';
import { AGGREGATORS, ARCADE_GAMES, MFC_ANCHOR, type GameId } from '../arcade/mfcEconomy';
import { useArcadeWallet } from '../arcade/useArcadeWallet';
import { useAuth } from '../auth/AuthProvider';
import {
  L_BTN,
  L_BTN_GHOST,
  L_BTN_QUIET,
  L_CARD,
  L_CARD_IN,
  L_EYE,
  L_INPUT,
  L_NAV_ACTIVE,
  L_NAV_IDLE,
  L_PAGE,
  L_PILL,
  L_RAIL_ACTIVE,
  L_RAIL_IDLE,
  L_TITLE,
} from '../crmLight';
import { readBroadcast, setBroadcast, type BroadcastMode } from '../demo/testLab';
import GoLivePicker, { type GoLivePick } from '../live/GoLivePicker';
import { startLiveMediaSource } from '../live/liveMediaSource';
import { startSessionRecording } from '../live/liveSessionRecorder';
import { isOnboardingDone, loadProfile } from '../onboarding/storage';
import {
  IconChart,
  IconCollapse,
  IconCommand,
  IconExpand,
  IconGames,
  IconHome,
  IconLive,
  IconPeople,
  IconScissors,
  IconSettings,
  IconShield,
  IconWallet,
} from '../ui/icons';

type NavId =
  | 'dashboard'
  | 'projects'
  | 'games'
  | 'adrev'
  | 'live'
  | 'feed'
  | 'stream'
  | 'workcut'
  | 'profile'
  | 'trust'
  | 'contacts'
  | 'pricing'
  | 'readiness'
  | 'settings';

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const NAV: { id: NavId; label: string; Icon: IconCmp }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: IconHome },
  { id: 'projects', label: 'Projects', Icon: IconCommand },
  { id: 'contacts', label: 'Contacts', Icon: IconPeople },
  { id: 'profile', label: 'Maker Profile', Icon: IconPeople },
  { id: 'games', label: 'Games Arcade', Icon: IconGames },
  { id: 'adrev', label: 'Ad Revenue', Icon: IconChart },
  { id: 'live', label: 'Live Workshop', Icon: IconLive },
  { id: 'feed', label: 'Timeline Feed', Icon: IconLive },
  { id: 'stream', label: 'Streaming Studio', Icon: IconLive },
  { id: 'workcut', label: 'WorkCut Studio', Icon: IconScissors },
  { id: 'trust', label: 'Trust & Safety', Icon: IconShield },
  { id: 'pricing', label: 'Pricing · MFC', Icon: IconWallet },
  { id: 'readiness', label: 'Readiness', Icon: IconChart },
  { id: 'settings', label: 'Settings', Icon: IconSettings },
];

const PROFILE_ASSESS = [
  { id: 'name-handle', label: 'Display name + @handle (left), avatar right', ok: true },
  { id: 'live-ring', label: 'LIVE ring / badge on avatar when streaming', ok: true },
  { id: 'stats', label: 'Following · Followers · Likes row', ok: true },
  { id: 'actions', label: 'Follow + Message + suggest CTA', ok: true },
  { id: 'bio-pills', label: 'Bio + LIVE / WorkCut pills', ok: true },
  { id: 'tabs', label: 'Grid / Private / Reposts tabs', ok: true },
  { id: 'grid', label: '3-column WorkCut grid · Pinned + views', ok: true },
  { id: 'dashboard', label: 'Assessible from Command Center', ok: true },
] as const;

type ProjectStatus = 'idea' | 'crafting' | 'live' | 'gifted';
type Project = { id: string; title: string; status: ProjectStatus; trade: string; pins: number; mfc: number };

const SEED_PROJECTS: Project[] = [
  { id: 'p1', title: 'Aso-Ebi lace hem — Bridal', status: 'crafting', trade: 'tailor', pins: 4, mfc: 320 },
  { id: 'p2', title: 'Consumer unit 230V', status: 'live', trade: 'electrician', pins: 2, mfc: 180 },
  { id: 'p3', title: 'Corolla OBD2 P0302', status: 'idea', trade: 'mechanic', pins: 1, mfc: 0 },
  { id: 'p4', title: 'Stopcock replace OL1', status: 'gifted', trade: 'plumber', pins: 3, mfc: 450 },
  { id: 'p5', title: 'Skin fade + line-up', status: 'crafting', trade: 'barber', pins: 2, mfc: 90 },
  { id: 'p6', title: 'Fabric restock lace', status: 'idea', trade: 'tailor', pins: 1, mfc: 0 },
];

type ShellContact = {
  id: string;
  name: string;
  trade: string;
  status: string;
  last: string;
  mfc: number;
};

const SEED_CONTACTS: ShellContact[] = [
  { id: 'c1', name: 'Aisha Bridal', trade: 'tailor', status: 'Quote', last: '2026-10-28', mfc: 94 },
  { id: 'c2', name: 'Mrs Okafor', trade: 'tailor', status: 'Repeat', last: '2026-10-30', mfc: 87 },
  { id: 'c3', name: 'Cooper Levin', trade: 'tailor', status: 'Inquiry', last: '2026-10-31', mfc: 72 },
  { id: 'c4', name: 'Anika Rosser', trade: 'tailor', status: 'Engagement', last: '2026-10-29', mfc: 65 },
  { id: 'c5', name: 'Fatima Bello', trade: 'tailor', status: 'Booked', last: '2026-11-01', mfc: 81 },
];

const COLS: ProjectStatus[] = ['idea', 'crafting', 'live', 'gifted'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const BARS = [42, 55, 48, 62, 88, 70, 58, 65, 72];

function parseNav(raw: string | null): NavId {
  const ok = NAV.some((n) => n.id === raw);
  return ok ? (raw as NavId) : 'dashboard';
}

export default function CommandShell() {
  const { user, signOut, configured } = useAuth();
  const profile = loadProfile();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const activeNav = parseNav(params.get('pane'));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [dragId, setDragId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [arcadeLive, setArcadeLive] = useState(false);
  const [goLiveOpen, setGoLiveOpen] = useState(false);
  const [contactRows, setContactRows] = useState<ShellContact[]>(SEED_CONTACTS);
  const [selectedContact, setSelectedContact] = useState(SEED_CONTACTS[0]?.id ?? 'c1');
  const [dbHint, setDbHint] = useState<string | null>(null);
  const [mfcPerGbp, setMfcPerGbp] = useState<number>(MFC_ANCHOR.mfcPerGbp);
  const [gross, setGross] = useState(0.8);
  const [fee, setFee] = useState(40);
  const wallet = useArcadeWallet();

  useEffect(() => {
    if (!supabase || !user?.id) {
      setContactRows(SEED_CONTACTS);
      setDbHint(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const { data, error } = await supabase
        .from('uprm_contacts')
        .select('id,name,relationship_strength,journey_state,role,last_interaction')
        .eq('user_id', user.id)
        .order('relationship_strength', { ascending: false });
      if (cancelled) return;
      if (error || !data?.length) {
        setContactRows(SEED_CONTACTS);
        setDbHint(error ? `DB fallback · ${error.message}` : 'DB empty · showing seed');
        return;
      }
      const mapped: ShellContact[] = data.map((row) => ({
        id: String(row.id),
        name: row.name,
        trade: String(row.role || 'tailor').toLowerCase().includes('suit') ? 'tailor' : 'tailor',
        status: String(row.journey_state || 'Discovery'),
        last: row.last_interaction ? String(row.last_interaction).slice(0, 10) : '—',
        mfc: Number(row.relationship_strength || 0),
      }));
      setContactRows(mapped);
      setSelectedContact(mapped[0]?.id ?? selectedContact);
      setDbHint(`${mapped.length} contacts from Supabase`);

      const { data: walletRow } = await supabase
        .from('mfc_wallet')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!cancelled && typeof walletRow?.balance === 'number') {
        setDbHint(`${mapped.length} contacts · wallet ${walletRow.balance} MFC`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (!isOnboardingDone()) return <Navigate to="/app/onboarding" replace />;

  const setPane = (id: NavId) => {
    if (id === 'readiness') {
      navigate('/readiness');
      return;
    }
    if (id === 'live') {
      navigate('/app/live');
      return;
    }
    if (id === 'feed') {
      navigate('/app/feed');
      return;
    }
    if (id === 'stream') {
      navigate('/app/studio/stream');
      return;
    }
    if (id === 'workcut') {
      navigate('/app/studio/workcut');
      return;
    }
    setParams(id === 'dashboard' ? {} : { pane: id });
    setMobileOpen(false);
  };

  const calc = useMemo(() => {
    const userGbp = gross * (1 - fee / 100);
    const mfc = Math.ceil(userGbp * mfcPerGbp);
    return { userGbp, mfc, hammers: Math.floor(mfc / 100) };
  }, [gross, fee, mfcPerGbp]);

  const contacts = useMemo(
    () =>
      contactRows.filter((c) => {
        const q = search.toLowerCase();
        const okQ = !q || c.name.toLowerCase().includes(q) || c.trade.includes(q) || c.status.toLowerCase().includes(q);
        const okT = tradeFilter === 'all' || c.trade === tradeFilter;
        return okQ && okT;
      }),
    [contactRows, search, tradeFilter],
  );

  const moveProject = (id: string, status: ProjectStatus) => {
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, status } : p)));
    setDragId(null);
  };

  const shop = profile?.shopName || "AYO'S TAILORS";
  const loc = profile?.location || 'Spindlegate OL1';
  const activeContact = contactRows.find((c) => c.id === selectedContact) || contactRows[0] || SEED_CONTACTS[0];
  const liveCount = projects.filter((p) => p.status === 'live').length;
  const giftedMfc = projects.reduce((s, p) => s + p.mfc, 0);

  const Sidebar = (
    <div className={`flex flex-col h-full ${collapsed ? 'px-2' : 'px-3'} py-3 gap-3`}>
      <div className="flex items-center justify-between px-1">
        {!collapsed ? (
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Menu</div>
        ) : (
          <span className="sr-only">Menu</span>
        )}
        <button
          type="button"
          className={L_RAIL_IDLE}
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          {collapsed ? <IconExpand size={16} /> : <IconCollapse size={16} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = activeNav === item.id;
          const Icon = item.Icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPane(item.id)}
              className={
                collapsed
                  ? active
                    ? L_RAIL_ACTIVE + ' w-full'
                    : L_RAIL_IDLE + ' w-full'
                  : active
                    ? L_NAV_ACTIVE
                    : L_NAV_IDLE
              }
              title={item.label}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed ? <span className="text-[13px] font-medium truncate">{item.label}</span> : null}
            </button>
          );
        })}
      </nav>

      {!collapsed ? (
        <div className={L_CARD_IN + ' p-3.5'}>
          <div className={L_EYE}>MFC wallet</div>
          <div className="font-display text-[22px] mt-1 tabular-nums text-[#0F172A]">
            {wallet.balance.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Spend-only · gifts / boost</div>
          <div className="mt-3 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
            <div className="h-full rounded-full bg-[#2F6BFF]" style={{ width: '67%' }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              className={L_BTN_GHOST}
              onClick={() => wallet.creditBuy(5000, 'Quick buy stub · £5 pack')}
            >
              Buy +5k
            </button>
            <button type="button" className={L_BTN_GHOST} onClick={() => setPane('games')}>
              Earn
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={L_RAIL_IDLE + ' w-full'}
          title={`${wallet.balance.toLocaleString()} MFC`}
          onClick={() => setPane('pricing')}
        >
          <IconWallet size={18} />
        </button>
      )}
    </div>
  );

  return (
    <div className={L_PAGE + ' flex flex-col'}>
      <header
        className="sticky z-40 border-b border-[#E7EBF0] bg-white/90 backdrop-blur-xl"
        style={{ top: 'var(--safe-area-inset-top)' }}
      >
        <div className="h-14 px-3 md:px-5 flex items-center justify-between gap-3 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" className={L_BTN_QUIET + ' md:hidden'} onClick={() => setMobileOpen(true)}>
              Menu
            </button>
            <div className="w-8 h-8 rounded-xl bg-[#2F6BFF] grid place-items-center text-[11px] font-bold text-white">
              MF
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-[13px] font-semibold truncate text-[#0F172A]">
                {shop} · {loc}
              </div>
              <div className="text-[11px] text-[#94A3B8] truncate">
                {user?.email || 'Command Center'}
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-1 ml-4">
              {['Overview', 'Projects', 'Live', 'Arcade'].map((t, i) => (
                <button
                  key={t}
                  type="button"
                  className={
                    i === 0
                      ? 'rounded-full bg-[#EEF3FF] text-[#2F6BFF] px-3 h-8 text-[12px] font-semibold'
                      : 'rounded-full px-3 h-8 text-[12px] font-medium text-[#64748B] hover:bg-[#F1F5F9]'
                  }
                  onClick={() => {
                    if (t === 'Projects') setPane('projects');
                    else if (t === 'Live') setPane('live');
                    else if (t === 'Arcade') setPane('games');
                    else setPane('dashboard');
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl border border-[#E7EBF0] bg-white text-[11px] text-[#64748B]">
              <span className={`w-1.5 h-1.5 rounded-full ${arcadeLive ? 'bg-red-500' : 'bg-[#CBD5E1]'}`} />
              {arcadeLive ? 'Live' : 'Idle'} · {ARCADE_GAMES.length} games
            </div>
            <div className="h-9 px-3 rounded-xl border border-[#E7EBF0] bg-white text-[12px] font-semibold tabular-nums text-[#0F172A]">
              {wallet.balance.toLocaleString()} MFC
            </div>
            <button
              type="button"
              className={L_BTN_QUIET + ' hidden md:inline-flex'}
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <IconExpand size={14} /> : <IconCollapse size={14} />}
            </button>
            <Link to="/" className={L_BTN_GHOST}>
              Marketing
            </Link>
            {configured ? (
              <button type="button" className={L_BTN_GHOST} onClick={() => void signOut()}>
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 max-w-[1600px] mx-auto w-full">
        <aside
          className={`hidden md:flex flex-col shrink-0 border-r border-[#E7EBF0] bg-[#F7F8FA] sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden transition-[width] duration-200 ease-out ${
            collapsed ? 'w-[72px]' : 'w-[248px]'
          }`}
        >
          {Sidebar}
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[84%] max-w-[300px] bg-[#F7F8FA] border-r border-[#E7EBF0] overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between p-3 border-b border-[#E7EBF0] bg-white">
                <span className="text-[13px] font-semibold">Command</span>
                <button type="button" className={L_BTN_QUIET} onClick={() => setMobileOpen(false)}>
                  Close
                </button>
              </div>
              <div className="px-1">{Sidebar}</div>
            </div>
          </div>
        ) : null}

        <main className="flex-1 min-w-0 px-4 md:px-6 py-6 space-y-5 overflow-x-hidden">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={L_PILL}>UPRM</span>
                <span className={L_PILL}>{NAV.find((n) => n.id === activeNav)?.label}</span>
              </div>
              <h1 className="font-display text-[26px] md:text-[30px] leading-[1.1] tracking-tight text-[#0F172A]">
                {activeNav === 'dashboard' ? 'Management Overview' : NAV.find((n) => n.id === activeNav)?.label}
              </h1>
              <p className="text-[13px] text-[#64748B] mt-1 max-w-2xl">
                Projects, contacts, earn MFC, gift craft — Oldham maker OS.
              </p>
            </div>
            {activeNav === 'dashboard' ? (
              <div className="flex flex-wrap gap-2">
                <button type="button" className={L_BTN_GHOST} onClick={() => setPane('projects')}>
                  + Create project
                </button>
                <button type="button" className={L_BTN_GHOST} onClick={() => setPane('profile')}>
                  Assess profile
                </button>
                <button type="button" className={L_BTN} onClick={() => setPane('adrev')}>
                  Get AI insight
                </button>
              </div>
            ) : null}
          </div>

          {activeNav === 'dashboard' ? (
            <>
              <section className="grid lg:grid-cols-3 gap-4">
                <div className={L_CARD + ' p-5 lg:col-span-2'}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className={L_TITLE}>Gift & reach performance</div>
                      <div className="text-[12px] text-[#94A3B8] mt-0.5">Monthly MFC velocity · Oldham</div>
                    </div>
                    <button type="button" className={L_BTN_QUIET} onClick={() => setPane('adrev')}>
                      Expand
                    </button>
                  </div>
                  <div className="flex items-end gap-2 h-44 pt-2">
                    {BARS.map((h, i) => {
                      const active = i === 4;
                      return (
                        <div key={MONTHS[i]} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <div
                            className={`w-full max-w-[36px] rounded-t-lg transition ${
                              active
                                ? 'bg-[#2F6BFF]'
                                : 'bg-[#D7E4FF] bg-[repeating-linear-gradient(-45deg,#D7E4FF_0_4px,#C5D7FF_4px_8px)]'
                            }`}
                            style={{ height: `${h}%` }}
                            title={active ? '£139,817 eq.' : undefined}
                          />
                          <span className={`text-[10px] ${active ? 'font-semibold text-[#2F6BFF]' : 'text-[#94A3B8]'}`}>
                            {MONTHS[i]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#EEF3FF] px-3 py-1.5 text-[12px] font-semibold text-[#2F6BFF]">
                    May peak · £139,817 eq. reach
                  </div>
                </div>

                <div className={L_CARD + ' p-5 flex flex-col'}>
                  <div className={L_EYE}>Productivity value</div>
                  <div className="font-display text-[32px] tracking-tight mt-2 tabular-nums">
                    £{(giftedMfc * 0.08).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="mt-1 text-[12px] font-semibold text-[#16A34A]">+16.2% vs last month</div>
                  <div className="mt-auto pt-6 space-y-3">
                    <div className="h-2 rounded-full overflow-hidden flex">
                      <div className="bg-[#2F6BFF]" style={{ width: '34%' }} />
                      <div className="bg-[#7C5CFF]" style={{ width: '22%' }} />
                      <div className="bg-[#22C55E]" style={{ width: '18%' }} />
                      <div className="bg-[#F59E0B]" style={{ width: '26%' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#64748B]">
                      <span>
                        <span className="inline-block w-2 h-2 rounded-full bg-[#2F6BFF] mr-1.5" />
                        Live {liveCount}
                      </span>
                      <span>
                        <span className="inline-block w-2 h-2 rounded-full bg-[#7C5CFF] mr-1.5" />
                        Crafting
                      </span>
                      <span>
                        <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E] mr-1.5" />
                        Gifted
                      </span>
                      <span>
                        <span className="inline-block w-2 h-2 rounded-full bg-[#F59E0B] mr-1.5" />
                        Ideas
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex flex-wrap gap-2 items-center">
                <select className={L_INPUT + ' w-auto min-w-[140px]'} value={tradeFilter} onChange={(e) => setTradeFilter(e.target.value)}>
                  <option value="all">All trades</option>
                  <option value="tailor">Tailor</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="plumber">Plumber</option>
                </select>
                <input
                  className={L_INPUT + ' max-w-[240px]'}
                  placeholder="Search contacts"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="button" className={L_BTN_GHOST} onClick={() => setPane('contacts')}>
                  Open CRM
                </button>
              </div>

              <section className="grid lg:grid-cols-5 gap-4">
                <div className={L_CARD + ' p-4 lg:col-span-2'}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className={L_TITLE}>Action center</div>
                      {dbHint ? <div className="text-[10px] text-[#64748B] mt-0.5">{dbHint}</div> : null}
                    </div>
                    <button type="button" className={L_BTN_QUIET} onClick={() => setPane('contacts')}>
                      View all
                    </button>
                  </div>
                  <div className="space-y-2">
                    {contacts.map((c) => {
                      const selected = c.id === selectedContact;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedContact(c.id)}
                          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                            selected ? 'bg-[#2F6BFF] text-white' : 'hover:bg-[#F8FAFC] text-[#0F172A]'
                          }`}
                        >
                          <div
                            className={`h-9 w-9 rounded-full grid place-items-center text-[11px] font-bold shrink-0 ${
                              selected ? 'bg-white/20 text-white' : 'bg-[#EEF3FF] text-[#2F6BFF]'
                            }`}
                          >
                            {c.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-semibold truncate">{c.name}</div>
                            <div className={`text-[11px] truncate ${selected ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                              {c.trade} · {c.status}
                            </div>
                          </div>
                          <div className={`text-[12px] font-semibold tabular-nums ${selected ? 'text-white' : 'text-[#0F172A]'}`}>
                            {c.mfc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={L_CARD + ' overflow-hidden lg:col-span-3 flex flex-col'}>
                  <div className="bg-[#2F6BFF] text-white px-5 py-4">
                    <div className="text-[12px] text-white/70">Selected contact</div>
                    <div className="font-display text-[22px] mt-1">{activeContact.name}</div>
                    <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-white/85">
                      <span>Trade · {activeContact.trade}</span>
                      <span>Status · {activeContact.status}</span>
                      <span>ID · {activeContact.id.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={L_TITLE}>Next action</div>
                      <button type="button" className="rounded-xl bg-[#16A34A] text-white text-[12px] font-semibold px-3 h-8">
                        Approve quote
                      </button>
                    </div>
                    <div className={L_CARD_IN + ' p-4 space-y-2 text-[13px]'}>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Last touch</span>
                        <span className="font-medium">{activeContact.last}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">MFC gifted</span>
                        <span className="font-medium">{activeContact.mfc.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Pipeline</span>
                        <span className="font-medium capitalize">{activeContact.status}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className={L_BTN_GHOST} onClick={() => setPane('projects')}>
                        Open projects
                      </button>
                      <Link to="/app/live" className={L_BTN_GHOST}>
                        Start live
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              <section className={L_CARD + ' p-4 md:p-5'}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className={L_TITLE}>Project pipeline</h2>
                    <div className="text-[12px] text-[#94A3B8] mt-0.5">Idea → Crafting → Live → Gifted</div>
                  </div>
                  <button type="button" className={L_BTN_GHOST} onClick={() => setPane('projects')}>
                    Full board
                  </button>
                </div>
                <Kanban projects={projects} dragId={dragId} setDragId={setDragId} onDrop={moveProject} />
              </section>

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className={L_TITLE}>Games Arcade</h2>
                  <button type="button" className={L_BTN_GHOST} onClick={() => setPane('games')}>
                    View all
                  </button>
                </div>
                <GamesGrid
                  onPlay={(id) => navigate(`/app/arcade/${id}`)}
                  live={arcadeLive}
                  onToggleLive={() => setArcadeLive((v) => !v)}
                />
              </section>

              <AdRevCompact
                mfcPerGbp={mfcPerGbp}
                setMfcPerGbp={setMfcPerGbp}
                gross={gross}
                setGross={setGross}
                fee={fee}
                setFee={setFee}
                calc={calc}
                onOpenFull={() => setPane('adrev')}
              />
            </>
          ) : null}

          {activeNav === 'projects' ? (
            <section className={L_CARD + ' p-4 md:p-5'}>
              <h2 className={L_TITLE + ' mb-4'}>Projects — Work OS board</h2>
              <Kanban projects={projects} dragId={dragId} setDragId={setDragId} onDrop={moveProject} />
            </section>
          ) : null}

          {activeNav === 'contacts' ? (
            <section className={L_CARD + ' p-4 md:p-5 space-y-4'}>
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <h2 className={L_TITLE}>Contacts pipeline</h2>
                <div className="flex flex-wrap gap-2">
                  <input
                    className={L_INPUT + ' w-[180px]'}
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select
                    className={L_INPUT + ' w-[140px]'}
                    value={tradeFilter}
                    onChange={(e) => setTradeFilter(e.target.value)}
                  >
                    <option value="all">All trades</option>
                    <option value="tailor">Tailor</option>
                    <option value="mechanic">Mechanic</option>
                    <option value="plumber">Plumber</option>
                  </select>
                </div>
              </div>
              <ContactsTable contacts={contacts} />
            </section>
          ) : null}

          {activeNav === 'games' ? (
            <section className="space-y-4">
              <h2 className={L_TITLE}>Games Arcade Center</h2>
              <GamesGrid
                onPlay={(id) => navigate(`/app/arcade/${id}`)}
                live={arcadeLive}
                onToggleLive={() => setArcadeLive((v) => !v)}
              />
            </section>
          ) : null}

          {activeNav === 'adrev' ? (
            <section className="space-y-3">
              <h2 className={L_TITLE}>Ad Revenue Economics</h2>
              <div className={L_CARD + ' overflow-hidden'}>
                <AdRevenueScorecard embedded />
              </div>
            </section>
          ) : null}

          {activeNav === 'profile' ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className={L_TITLE}>Maker Profile · TikTok parity</h2>
                  <p className="text-[13px] text-[#64748B] mt-1 max-w-xl leading-relaxed">
                    Assess the public maker profile layout against TikTok: stats, Follow/Message, bio pills, and
                    3-column WorkCut grid.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to="/app/maker/tpl_01" className={L_BTN}>
                    Open sample profile
                  </Link>
                  <Link to="/app/maker/tpl_04" className={L_BTN_GHOST}>
                    Plumber template
                  </Link>
                  <Link to="/app/feed" className={L_BTN_GHOST}>
                    From feed avatars
                  </Link>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
                <div className={L_CARD + ' p-4 space-y-3'}>
                  <div className={L_EYE}>Assessment checklist</div>
                  <ul className="space-y-2">
                    {PROFILE_ASSESS.map((row) => (
                      <li
                        key={row.id}
                        className="flex items-start gap-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC] px-3 py-2.5"
                      >
                        <span
                          className={`mt-0.5 h-5 w-5 rounded-md grid place-items-center text-[11px] font-black shrink-0 ${
                            row.ok ? 'bg-[#8FFF4A] text-black' : 'bg-[#FEE2E2] text-[#B91C1C]'
                          }`}
                        >
                          {row.ok ? '✓' : '!'}
                        </span>
                        <span className="text-[13px] font-medium text-[#0F172A] leading-snug">{row.label}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mono text-[10px] text-[#94A3B8] pt-1">
                    Route · /app/maker/:makerId · Dashboard pane · ?pane=profile
                  </div>
                </div>

                <div className={L_CARD + ' p-4 space-y-3'}>
                  <div className={L_EYE}>Phone preview</div>
                  <div className="mx-auto w-full max-w-[320px] rounded-[28px] border-[10px] border-[#0F172A] bg-[#0F172A] shadow-xl overflow-hidden">
                    <div className="bg-white aspect-[9/16] relative">
                      <iframe
                        title="Maker profile preview"
                        src="/app/maker/tpl_01"
                        className="absolute inset-0 h-full w-full border-0"
                      />
                    </div>
                  </div>
                  <p className="text-[12px] text-[#64748B] text-center leading-relaxed">
                    Live iframe of <span className="font-semibold text-[#0F172A]">/app/maker/tpl_01</span>. Open full
                    screen to tap Follow, LIVE, and grid clips.
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          {activeNav === 'live' ? (
            <section className={L_CARD + ' p-5 space-y-4'}>
              <h2 className={L_TITLE}>Live Workshop</h2>
              <p className="text-[13px] text-[#64748B] leading-relaxed">
                Live Session Viewer — gift rain, chat, shop lace, boost reach, Work Feed.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to="/app/live" className={L_BTN}>
                  Open live session
                </Link>
                <Link to="/app/feed" className={L_BTN_GHOST}>
                  Open timeline feed
                </Link>
                <Link to="/app/studio/stream" className={L_BTN_GHOST}>
                  Streaming Studio
                </Link>
                <Link to="/app/studio/workcut" className={L_BTN_GHOST}>
                  WorkCut Studio
                </Link>
                <button
                  type="button"
                  className={L_BTN_GHOST}
                  onClick={() => {
                    if (readBroadcast()?.live || arcadeLive) {
                      setBroadcast(false);
                      setArcadeLive(false);
                      return;
                    }
                    setGoLiveOpen(true);
                  }}
                >
                  {readBroadcast()?.live || arcadeLive ? 'End stream' : 'Go Live'}
                </button>
              </div>
            </section>
          ) : null}

          {activeNav === 'trust' ? (
            <section className={L_CARD + ' p-5'}>
              <h2 className={L_TITLE}>Trust & Safety</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-2">
                {AGGREGATORS.slice(0, 6).map((a) => (
                  <div key={a.name} className={L_CARD_IN + ' p-3'}>
                    <div className="flex justify-between text-[12px]">
                      <span className="font-medium">{a.name}</span>
                      <span className="text-[#94A3B8]">{a.status}</span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8] mt-1">
                      Cap {a.userCap} · Fee {a.fee}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeNav === 'pricing' ? (
            <section className={L_CARD + ' p-5'}>
              <h2 className={L_TITLE}>MFC packs</h2>
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { name: 'Starter', price: '£4.99', mfc: 5000 },
                  { name: 'Creator', price: '£14.99', mfc: 18000 },
                  { name: 'Hero', price: '£39', mfc: 50000 },
                  { name: 'Earn free', price: '—', mfc: 0 },
                ].map((p) => (
                  <div key={p.name} className={L_CARD_IN + ' p-4'}>
                    <div className={L_EYE}>{p.name}</div>
                    <div className="font-display text-[20px] mt-1">{p.price}</div>
                    <div className="text-[12px] text-[#64748B] mt-1">
                      {p.mfc ? `${p.mfc.toLocaleString()} MFC` : 'Play / offers'}
                    </div>
                    <button
                      type="button"
                      className={L_BTN_GHOST + ' w-full mt-3'}
                      onClick={() => {
                        if (p.name === 'Earn free') setPane('games');
                        else wallet.creditBuy(p.mfc, `${p.name} pack stub`);
                      }}
                    >
                      {p.name === 'Earn free' ? 'Open arcade' : 'Buy (credits wallet)'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeNav === 'settings' ? (
            <section className={L_CARD + ' p-5 space-y-3'}>
              <h2 className={L_TITLE}>Settings</h2>
              <Link to="/demo" className={L_BTN}>
                Open Test Lab
              </Link>
              <Link to="/app/onboarding" className={L_BTN_GHOST}>
                Re-run onboarding
              </Link>
              <Link to="/readiness" className={L_BTN_GHOST}>
                Production readiness
              </Link>
              <button
                type="button"
                className={L_BTN_GHOST}
                onClick={() => {
                  void signOut();
                  navigate('/demo');
                }}
              >
                Sign out → Test Lab
              </button>
            </section>
          ) : null}
        </main>
      </div>

      <GoLivePicker
        open={goLiveOpen}
        onClose={() => setGoLiveOpen(false)}
        theme="light"
        title="Go Live"
        contacts={contactRows.map((c) => ({
          id: c.id,
          name: c.name,
          trade: c.trade,
          status: c.status,
        }))}
        onChoose={(pick: GoLivePick) => {
          void (async () => {
            if (pick.kind === 'post') {
              setGoLiveOpen(false);
              navigate('/app/feed?upload=1');
              return;
            }
            const { broadcastMetaFromAudience } = await import('../live/liveAudience');
            const audienceMeta = broadcastMetaFromAudience(
              pick.audience,
              contactRows.map((c) => ({
                id: c.id,
                name: c.name,
                trade: c.trade,
                status: c.status,
              })),
            );
            const goPublic = Boolean(
              pick.audience.publicFeed || pick.audience.visibility === 'public',
            );
            if (pick.kind === 'youtube') {
              try {
                const { stopLiveMediaSource } = await import('../live/liveMediaSource');
                stopLiveMediaSource();
                const mins = Math.round(pick.durationSec / 60);
                const n = pick.playlist.length;
                setBroadcast(true, {
                  mode: 'video',
                  viewers: 144,
                  youtubeId: pick.youtubeId,
                  youtubePlaylistIds: pick.playlist.map((p) => p.id),
                  youtubePlaylist: pick.playlist,
                  youtubeDurationSec: pick.durationSec,
                  title: `YouTube · ${n} vid · ${mins}m`,
                  ...audienceMeta,
                });
                setArcadeLive(true);
                setGoLiveOpen(false);
                navigate(goPublic ? '/app/feed?live=1' : '/app/live?mode=video');
              } catch (err) {
                window.alert(err instanceof Error ? err.message : 'Could not start YouTube live');
              }
              return;
            }
            if (pick.kind === 'file' || pick.kind === 'link') {
              try {
                await startLiveMediaSource(pick.kind === 'file' ? pick.file : pick.url);
                void startSessionRecording({ mode: 'video' });
                setBroadcast(true, {
                  mode: 'video',
                  viewers: 144,
                  title:
                    pick.kind === 'file'
                      ? `File Live · ${pick.file.name.slice(0, 28)}`
                      : 'Link Live · AYO stream',
                  ...audienceMeta,
                });
                setArcadeLive(true);
                setGoLiveOpen(false);
                navigate(goPublic ? '/app/feed?live=1' : '/app/live?mode=video');
              } catch (err) {
                window.alert(err instanceof Error ? err.message : 'Could not start media stream');
              }
              return;
            }
            const mode = pick.mode;
            setBroadcast(true, {
              mode,
              viewers: 144,
              title: mode === 'audio' ? "Audio Live · AYO'S · OL1" : "Video Live · AYO'S · OL1",
              ...audienceMeta,
            });
            try {
              if (mode === 'video') sessionStorage.setItem('myface.live.needCamera', '1');
              else sessionStorage.removeItem('myface.live.needCamera');
            } catch {
              /* ignore */
            }
            setArcadeLive(true);
            setGoLiveOpen(false);
            navigate(mode === 'audio' ? '/app/live?mode=audio' : '/app/live?mode=video');
          })();
        }}
      />
    </div>
  );
}

function Kanban({
  projects,
  dragId,
  setDragId,
  onDrop,
}: {
  projects: Project[];
  dragId: string | null;
  setDragId: (id: string | null) => void;
  onDrop: (id: string, status: ProjectStatus) => void;
}) {
  return (
    <div className="grid md:grid-cols-4 gap-3">
      {COLS.map((col) => {
        const list = projects.filter((p) => p.status === col);
        return (
          <div
            key={col}
            className={L_CARD_IN + ' p-2.5 min-h-[200px]'}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragId) onDrop(dragId, col);
            }}
          >
            <div className="flex justify-between mb-2 px-1">
              <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">{col}</span>
              <span className="text-[10px] text-[#CBD5E1]">{list.length}</span>
            </div>
            <div className="space-y-2">
              {list.map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => setDragId(p.id)}
                  className="rounded-xl border border-[#E7EBF0] bg-white p-2.5 cursor-grab active:cursor-grabbing shadow-sm"
                >
                  <div className="text-[12px] leading-snug font-medium text-[#0F172A]">{p.title}</div>
                  <div className="mt-2 flex justify-between text-[10px] text-[#94A3B8]">
                    <span>{p.trade}</span>
                    <span>
                      {p.pins} pins · {p.mfc} MFC
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GamesGrid({
  onPlay,
  live,
  onToggleLive,
}: {
  onPlay: (id: GameId) => void;
  live: boolean;
  onToggleLive: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ARCADE_GAMES.map((g) => (
          <div key={g.id} className={L_CARD + ' p-3.5 flex flex-col'}>
            <div className="flex items-start justify-between gap-2">
              <div className="font-display text-[14px] leading-tight text-[#0F172A]">{g.title}</div>
              <span className="text-[9px] text-[#64748B] border border-[#E7EBF0] rounded-lg px-1.5 py-0.5 shrink-0">
                {g.status}
              </span>
            </div>
            <p className="text-[12px] text-[#64748B] mt-2 leading-snug flex-1">{g.blurb}</p>
            <div className="mt-3 space-y-1 text-[11px] text-[#94A3B8]">
              <div className="flex justify-between gap-2">
                <span>Earn</span>
                <span className="text-[#475569]">{g.earn}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Cap</span>
                <span className="text-[#475569]">{g.cap}</span>
              </div>
            </div>
            <button
              type="button"
              disabled={!g.playable}
              className={(g.playable ? L_BTN : L_BTN_GHOST) + ' w-full mt-3'}
              onClick={() => g.playable && onPlay(g.id)}
            >
              {g.playable ? 'Play' : 'Soon'}
            </button>
          </div>
        ))}
      </div>
      <div className={L_CARD + ' p-4 flex flex-wrap items-center justify-between gap-3'}>
        <div>
          <div className={L_EYE}>Arcade live</div>
          <div className="text-[12px] text-[#64748B] mt-1">Stream canvas + gift overlay · record → project</div>
        </div>
        <button type="button" className={L_BTN} onClick={onToggleLive}>
          {live ? 'Stop live' : 'Start live'}
        </button>
      </div>
    </div>
  );
}

function AdRevCompact({
  mfcPerGbp,
  setMfcPerGbp,
  gross,
  setGross,
  fee,
  setFee,
  calc,
  onOpenFull,
}: {
  mfcPerGbp: number;
  setMfcPerGbp: (n: number) => void;
  gross: number;
  setGross: (n: number) => void;
  fee: number;
  setFee: (n: number) => void;
  calc: { userGbp: number; mfc: number; hammers: number };
  onOpenFull: () => void;
}) {
  return (
    <section className={L_CARD + ' p-4 md:p-5'}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className={L_TITLE}>Ad revenue · compact</h2>
          <div className="text-[12px] text-[#94A3B8] mt-0.5">ceil(user_share × MFC/£) · VisaGuide caps</div>
        </div>
        <button type="button" className={L_BTN_GHOST} onClick={onOpenFull}>
          Full calculator
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <div className={L_CARD_IN + ' p-3'}>
          <div className={L_EYE}>VisaGuide anchor</div>
          <div className="text-[12px] mt-2 text-[#475569]">45k VGC = £39 → 1153.85 /£</div>
        </div>
        <div className={L_CARD_IN + ' p-3'}>
          <div className={L_EYE}>MyFace MFC/£</div>
          <input
            type="number"
            className={L_INPUT + ' mt-2'}
            value={mfcPerGbp}
            onChange={(e) => setMfcPerGbp(Number(e.target.value) || 1200)}
          />
        </div>
        <div className={L_CARD_IN + ' p-3'}>
          <div className={L_EYE}>Mini calc</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="text-[10px] text-[#94A3B8]">
              Gross £
              <input
                type="number"
                step="0.1"
                className={L_INPUT + ' mt-1'}
                value={gross}
                onChange={(e) => setGross(Number(e.target.value) || 0)}
              />
            </label>
            <label className="text-[10px] text-[#94A3B8]">
              Fee %
              <input
                type="number"
                className={L_INPUT + ' mt-1'}
                value={fee}
                onChange={(e) => setFee(Number(e.target.value) || 0)}
              />
            </label>
          </div>
          <div className="text-[12px] mt-2 text-[#475569]">
            £{calc.userGbp.toFixed(2)} → {calc.mfc} MFC → {calc.hammers} Hammers
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px]">
          <thead className="text-[#94A3B8] border-b border-[#E7EBF0]">
            <tr>
              {['Aggregator', 'Gross', 'Cap', 'Fee', 'Net', 'MFC', 'Status'].map((h) => (
                <th key={h} className="py-2 font-medium pr-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AGGREGATORS.map((a) => (
              <tr key={a.name} className="border-b border-[#F1F5F9]">
                <td className="py-2 pr-3 font-medium text-[#0F172A]">{a.name}</td>
                <td className="pr-3 text-[#64748B]">{a.gross}</td>
                <td className="pr-3 text-[#64748B]">{a.userCap}</td>
                <td className="pr-3 text-[#64748B]">{a.fee}</td>
                <td className="pr-3 text-[#64748B]">{a.net}</td>
                <td className="pr-3 text-[#0F172A]">{a.mfc}</td>
                <td className="text-[#94A3B8]">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ContactsTable({ contacts }: { contacts: typeof SEED_CONTACTS }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12px] text-left">
        <thead className="text-[#94A3B8] border-b border-[#E7EBF0]">
          <tr>
            {['Name', 'Trade', 'Status', 'Last', 'MFC gifted'].map((h) => (
              <th key={h} className="py-2 font-medium pr-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id} className="border-b border-[#F1F5F9]">
              <td className="py-2.5 pr-3 font-medium text-[#0F172A]">{c.name}</td>
              <td className="pr-3 text-[#64748B]">{c.trade}</td>
              <td className="pr-3 text-[#64748B]">{c.status}</td>
              <td className="pr-3 text-[#94A3B8]">{c.last}</td>
              <td className="text-[#0F172A]">{c.mfc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
