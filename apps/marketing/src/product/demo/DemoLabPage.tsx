import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { CRM_BTN, CRM_BTN_GHOST, CRM_CARD, CRM_EYE, CRM_TITLE } from '../crmChrome';
import {
  enterTestLab,
  exitTestLab,
  isDemoSession,
  readBroadcast,
  setBroadcast,
  TEST_ROUTES,
  creditBuyStub,
} from './testLab';
import { runGoLiveChecks, summarizeChecks, type GoLiveCheck } from './goLiveChecks';

const DEMO_EMAIL = 'ayo@oldham.demo';
const DEMO_PASSWORD = 'OldhamDemo!234';

/** One-click Oldham go-live test lab — seed + probes + smoke links. */
export default function DemoLabPage() {
  const navigate = useNavigate();
  const { signIn, configured, user } = useAuth();
  const [ready, setReady] = useState(isDemoSession());
  const [broadcast, setBc] = useState(readBroadcast());
  const [note, setNote] = useState<string | null>(null);
  const [checks, setChecks] = useState<GoLiveCheck[]>([]);
  const [probing, setProbing] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    const sync = () => setBc(readBroadcast());
    window.addEventListener('myface-broadcast', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('myface-broadcast', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    void refreshChecks();
  }, [ready, broadcast?.live, user?.id]);

  const refreshChecks = async () => {
    setProbing(true);
    try {
      setChecks(await runGoLiveChecks());
    } finally {
      setProbing(false);
    }
  };

  const boot = () => {
    const r = enterTestLab();
    setReady(true);
    setNote(`Seeded ${r.shop} · ${r.balance} MFC · demo session on`);
    setBc(null);
    void refreshChecks();
  };

  const goDash = () => {
    if (!isDemoSession()) boot();
    navigate('/app/dashboard', { replace: true });
  };

  const loginDemoUser = async () => {
    if (!configured) {
      setNote('Supabase not configured — use Enter test lab bypass');
      return;
    }
    setAuthBusy(true);
    try {
      enterTestLab();
      setReady(true);
      await signIn(DEMO_EMAIL, DEMO_PASSWORD);
      setNote(`Signed in ${DEMO_EMAIL} · seed contacts/wallet available via RLS`);
      navigate('/app/dashboard', { replace: true });
    } catch (e) {
      setNote(e instanceof Error ? e.message : 'Demo login failed');
    } finally {
      setAuthBusy(false);
    }
  };

  const summary = summarizeChecks(checks);

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <div className={CRM_EYE}>MyFace · Go-live Test Lab</div>
          <h1 className={CRM_TITLE + ' mt-1 text-[28px]'}>Close gaps · testing going live</h1>
          <p className="mono text-[12px] text-white/45 mt-2 leading-relaxed">
            Seeds Ayo Tailors Oldham, unlocks every product route, and probes Supabase + Jamendo before you
            hand the build to testers.
          </p>
        </div>

        <section className={CRM_CARD + ' p-5'}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-display text-[18px]">Readiness probe</div>
              <div className="mono text-[11px] text-white/45 mt-1">
                {probing
                  ? 'Running checks…'
                  : `${summary.score}% · ${summary.pass} pass · ${summary.warn} warn · ${summary.fail} fail`}
              </div>
            </div>
            <div
              className={`rounded-full px-3 py-1.5 mono text-[11px] font-bold ${
                summary.ready ? 'bg-[#8FFF4A]/15 text-[#8FFF4A]' : 'bg-red-500/15 text-red-300'
              }`}
            >
              {summary.ready ? 'READY FOR TEST' : 'FIX FAILS FIRST'}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {checks.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
              >
                <span
                  className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                    c.status === 'pass' ? 'bg-[#8FFF4A]' : c.status === 'warn' ? 'bg-[#FFE600]' : 'bg-red-500'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="mono text-[12px] font-bold">{c.label}</div>
                  <div className="mono text-[10px] text-white/45 mt-0.5 break-words">{c.detail}</div>
                </div>
                <span className="mono text-[9px] uppercase text-white/35">{c.status}</span>
              </div>
            ))}
          </div>
          <button type="button" className={CRM_BTN_GHOST + ' mt-3'} onClick={() => void refreshChecks()} disabled={probing}>
            Re-run probes
          </button>
        </section>

        <section className={CRM_CARD + ' p-5 space-y-3'}>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={CRM_BTN} onClick={boot}>
              {ready ? 'Re-seed test lab' : 'Enter test lab'}
            </button>
            <button type="button" className={CRM_BTN} onClick={goDash}>
              Open Command Center
            </button>
            <button type="button" className={CRM_BTN_GHOST} onClick={() => void loginDemoUser()} disabled={authBusy}>
              {authBusy ? 'Signing in…' : 'Login demo user (Supabase)'}
            </button>
            <button
              type="button"
              className={CRM_BTN_GHOST}
              onClick={() => {
                const live = !(broadcast?.live);
                setBroadcast(live, { viewers: live ? 144 : 0 });
                setBc(readBroadcast());
                setNote(live ? 'Broadcast ON · Live Viewer / Streaming share flag' : 'Broadcast OFF');
              }}
            >
              {broadcast?.live ? 'Stop broadcast flag' : 'Start broadcast flag'}
            </button>
            <button
              type="button"
              className={CRM_BTN_GHOST}
              onClick={() => {
                const bal = creditBuyStub(5000, 'Test pack £5 → 5000 MFC stub');
                setNote(`Wallet +5000 · balance ${bal}`);
              }}
            >
              Buy +5000 MFC stub
            </button>
            <button
              type="button"
              className={CRM_BTN_GHOST}
              onClick={() => {
                exitTestLab();
                setReady(false);
                setNote('Demo session cleared (profile/wallet kept)');
                void refreshChecks();
              }}
            >
              Exit demo session
            </button>
          </div>
          {note ? <p className="mono text-[11px] text-[#8FFF4A]">{note}</p> : null}
          <p className="mono text-[11px] text-white/40">
            Session: {ready ? 'DEMO ON' : 'off'} · Auth: {user?.email || 'guest'} · Broadcast:{' '}
            {broadcast?.live ? `LIVE · ${broadcast.viewers}` : 'idle'}
          </p>
          <p className="mono text-[10px] text-white/30">
            Demo login · {DEMO_EMAIL} · password set in Test Lab (Supabase auth site URL → myfaceprofile)
          </p>
        </section>

        <section className={CRM_CARD + ' p-5'}>
          <h2 className="font-display text-[16px]">Smoke routes</h2>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {TEST_ROUTES.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                onClick={() => {
                  if (!isDemoSession()) enterTestLab();
                }}
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 mono text-[12px] hover:bg-white/[0.06]"
              >
                {r.label}
                <div className="text-[10px] text-white/35 mt-0.5">{r.path}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className={CRM_CARD + ' p-5 space-y-2 mono text-[11px] text-white/50 leading-relaxed'}>
          <div className="text-white/70 font-semibold">Suggested go-live pass</div>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Enter test lab → confirm READY FOR TEST on probes</li>
            <li>Command Center · light bento · Action Center contacts</li>
            <li>Feed · TikTok full-bleed · Discover button → /app/discover</li>
            <li>Live Viewer · Jamendo / YouTube BGM · gift chrome</li>
            <li>Streaming Studio + WorkCut · music drawer · Go Live flag</li>
            <li>Arcade · Bank score · Ad Revenue scorecard export</li>
            <li>Optional: Login demo user for real Supabase RLS data</li>
          </ol>
          <div className="flex flex-wrap gap-3 mt-3">
            <Link to="/readiness" className="text-[#00E5C0]">
              Readiness →
            </Link>
            <Link to="/login" className="text-[#00E5C0]">
              Login →
            </Link>
            <Link to="/app/discover" className="text-[#00E5C0]">
              Discover →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
