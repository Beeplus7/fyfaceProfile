import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Cloud,
  CreditCard,
  Globe,
  Landmark,
  Megaphone,
  ShieldCheck,
  Users,
} from 'lucide-react';

type Region = 'UK' | 'NG' | 'COMPARE';
type Row = { item: string; detail: string; cost: string };
type Section = {
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  rows: Row[];
  foot: string;
};

const STORAGE_KEY = 'mfp-go-live-checklist-v1';

const ukSections: Section[] = [
  {
    title: '1 · Business Registration',
    icon: Building2,
    rows: [
      {
        item: 'Companies House online incorporation',
        detail: 'From 1 Feb 2026 — was £50, now £100',
        cost: '£100 one-off',
      },
      { item: 'Confirmation Statement', detail: 'Annual filing', cost: '£50 / yr' },
      { item: 'Registered Office Address', detail: 'Oldham virtual office', cost: '£120 / yr' },
      { item: 'Director ID Verification', detail: 'Identity check', cost: '£30 one-off' },
      { item: 'SIC Codes 62012 + 63110', detail: 'Business software + data processing', cost: '£0' },
      {
        item: 'ICO Data Protection Fee — Tier 1',
        detail: 'Micro org up to £632k turnover · £47 by Direct Debit',
        cost: '£52 / yr',
      },
      { item: 'Accountant — Ltd accounts + CT600', detail: '£75 / mo equivalent', cost: '£900 / yr' },
      { item: 'Business Bank — Tide / Wise', detail: 'No setup or monthly fee', cost: '£0' },
      {
        item: 'Trademark UK — MyFaceProfile wordmark',
        detail: 'One class',
        cost: '£170 one-off',
      },
      {
        item: 'Terms + Privacy + Creator Licence',
        detail: 'Solicitor draft · or £0 template + review',
        cost: '£800 one-off',
      },
    ],
    foot: 'Subtotal — One-off £1,100 · Annual £1,172',
  },
  {
    title: '2 · Domain + Branding',
    icon: Globe,
    rows: [
      { item: 'myfaceprofile.aikova.co.uk', detail: 'Already owned', cost: '£0' },
      { item: 'myfaceprofile.com + .co.uk', detail: '£15 / yr + £12 / yr', cost: '£27 / yr' },
      { item: 'Email — Google Workspace', detail: '£6 / user / mo × 3', cost: '£18 / mo' },
      { item: 'Logo / Brand kit', detail: 'Already done', cost: '£0' },
    ],
    foot: 'Brand is owned. Keep renewals on auto-renew.',
  },
  {
    title: '3 · Server + Infrastructure · 10k users',
    icon: Cloud,
    rows: [
      { item: 'Vercel Pro', detail: '1 seat', cost: '£16 / mo' },
      {
        item: 'Supabase Pro',
        detail: '100k MAU · 8GB included · then $0.00325 / MAU',
        cost: '£20 / mo',
      },
      {
        item: 'Video Storage — Cloudflare R2 / S3',
        detail: '2TB · 1,000 hrs × 2GB · $0.015 / GB',
        cost: '£24 / mo',
      },
      {
        item: 'CDN / Bandwidth — Cloudflare Pro',
        detail: '250GB egress included in Supabase',
        cost: '£16 / mo',
      },
      {
        item: 'Transcoding — Stream / Mux',
        detail: '1,000 hrs transcoded at 10k users',
        cost: '£150 / mo',
      },
      {
        item: 'Backups + Monitoring',
        detail: 'Sentry $29 / mo + UptimeRobot',
        cost: '£23 / mo*',
      },
    ],
    foot: 'Server: £255 / mo at 1k users · £505 / mo at 10k users. *Sentry converted at stated planning rate.',
  },
  {
    title: '4 · API Billing · Pay-as-you-go',
    icon: Landmark,
    rows: [
      {
        item: 'OpenAI GPT-4o-mini labelling',
        detail: '$0.15 / $0.60 per 1M tokens · $0.12 per video',
        cost: '£96 / mo · 800 videos',
      },
      {
        item: 'Whisper Transcription',
        detail: '$0.006 / min · 1,000 hrs = 60k mins · use batch',
        cost: '£288 / mo',
      },
      {
        item: 'Content Moderation',
        detail: 'OpenAI Moderation API £0 + Hive £0.02 / image',
        cost: '£0 + usage',
      },
      { item: 'Maps / Geocoding', detail: 'Google Maps free tier, then usage', cost: '£40 / mo' },
      {
        item: 'SMS / OTP — Twilio',
        detail: '£0.04 / SMS · heavy at onboarding, then lighter',
        cost: '£320 onboarding → £40',
      },
      { item: 'Email — Resend', detail: '$20 / mo', cost: '£16 / mo' },
    ],
    foot: 'API: £480 / mo at 10k · £120 / mo at 100 users.',
  },
  {
    title: '5 · Payments + Licensing + Payout',
    icon: CreditCard,
    rows: [
      {
        item: 'Stripe UK',
        detail: '1.5% + 20p domestic · 2.5% + 20p international · no monthly fee',
        cost: '£170 on £10k sales',
      },
      { item: 'Stripe Payout to pros', detail: '£0.20 per payout × 1,000', cost: '£160 / mo' },
      { item: 'PayPal backup', detail: '2.9% + 30p · no monthly fee', cost: '£0 / mo' },
      {
        item: 'Video / broadcast licence',
        detail: 'Data supplier, not broadcaster — no Ofcom licence needed',
        cost: '£0',
      },
      {
        item: 'Music licence — PPL / PRS',
        detail: 'Use royalty-free · else £200 / yr',
        cost: '£0 planned',
      },
      {
        item: 'Insurance — Cyber + Public Liability',
        detail: 'Hiscox · £29 / mo',
        cost: '£350 / yr',
      },
    ],
    foot: 'Payments: variable % + £189 / mo fixed.',
  },
  {
    title: '6 · Team + Compliance',
    icon: Users,
    rows: [
      { item: 'Founder', detail: 'Sweat equity', cost: '£0' },
      {
        item: 'Part-time Moderator / QC',
        detail: '20 hrs / week at 10k users',
        cost: '£800 / mo',
      },
      {
        item: 'Part-time Community / Onboarding',
        detail: 'Creator onboarding + support',
        cost: '£600 / mo',
      },
      { item: 'Legal review — DPA + Lab contracts', detail: 'One-off', cost: '£500 one-off' },
      { item: 'GDPR + Consent tool', detail: 'OneTrust free / CookieYes', cost: '£15 / mo' },
    ],
    foot: 'Team: £1,415 / mo at full 10k staffing.',
  },
  {
    title: '7 · Marketing + Launch · 100 → 1,000',
    icon: Megaphone,
    rows: [
      {
        item: 'Launch ads — TikTok / IG',
        detail: 'Test, measure, then scale',
        cost: '£300 / mo',
      },
      {
        item: 'Creator onboarding — 100 test users',
        detail: '£5 gift each',
        cost: '£500 one-off',
      },
    ],
    foot: 'Marketing: £500 one-off + £300 / mo.',
  },
];

const ngSections: Section[] = [
  {
    title: '1 · Business Registration — Lagos',
    icon: Building2,
    rows: [
      {
        item: 'CAC Ltd Registration',
        detail:
          'All-inclusive with agent · Official: ₦1,000 reservation + ₦10,000 incorporation + ₦750 stamp for ₦100k capital',
        cost: '₦60,000 one-off',
      },
      { item: 'CAC Annual Returns', detail: 'Annual filing', cost: '₦10,000 / yr' },
      {
        item: 'NDPC Registration — EHL Tier',
        detail: '1,000–4,999 data subjects in 6 months · UHL ₦250k if 5k+ · OHL ₦10k if 200–999',
        cost: '₦100,000',
      },
      {
        item: 'NDPC Compliance Audit Return',
        detail: 'Via DPCO · range ₦100k–₦1,000,000 by tier',
        cost: '₦150,000 / yr',
      },
      { item: 'Tax — FIRS TIN + VAT', detail: 'VAT 7.5%', cost: 'Free to register' },
      {
        item: 'SCUML (if fintech)',
        detail: 'Not needed — data supplier, not fintech',
        cost: '£0 · ₦0',
      },
      { item: 'Trademark Nigeria', detail: 'One class', cost: '₦150,000 one-off' },
      {
        item: 'Lawyer — CAC + NDPC + Contracts',
        detail: 'One-off',
        cost: '₦250,000 one-off',
      },
    ],
    foot: 'Subtotal — ₦810,000 one-off · ₦260,000 annual.',
  },
  {
    title: '2 · Domain + Branding',
    icon: Globe,
    rows: [
      { item: 'myfaceprofile.com.ng', detail: 'NiRA, VAT included · .ng ₦13,975 / yr', cost: '₦6,450 / yr' },
      { item: '.com', detail: 'International domain', cost: '₦15,500 / yr' },
      { item: 'Email — Google Workspace', detail: '₦9,000 / user / mo × 3', cost: '₦27,000 / mo' },
    ],
    foot: 'Local .ng builds trust for Nigerian creators and labs.',
  },
  {
    title: '3 · Server + Infra · Same $ stack',
    icon: Cloud,
    rows: [
      { item: 'Vercel $20', detail: 'Pay in Naira via card', cost: '₦30,000 / mo' },
      { item: 'Supabase $25', detail: 'Same capacity as UK', cost: '₦37,500 / mo' },
      { item: 'R2 / S3 $30', detail: 'Video storage', cost: '₦45,000 / mo' },
      { item: 'Cloudflare $20', detail: 'CDN / bandwidth', cost: '₦30,000 / mo' },
      { item: 'Mux $150', detail: 'Transcoding', cost: '₦225,000 / mo' },
      { item: 'Sentry $29', detail: 'Monitoring', cost: '₦43,500 / mo' },
      {
        item: 'Local alternative — QServers / HostAfrica',
        detail: 'Optional, not a replacement for the core stack',
        cost: '₦12,000 / mo',
      },
    ],
    foot: 'Server: ₦411,000 / mo at 10k users.',
  },
  {
    title: '4 · API Billing · Termii advantage',
    icon: Landmark,
    rows: [
      {
        item: 'OpenAI + Whisper + Maps + Email',
        detail: 'Same USD services · domiciliary card',
        cost: 'Included below',
      },
      {
        item: 'Twilio SMS in Nigeria',
        detail: '₦25 / SMS · expensive at scale',
        cost: '₦720,000 / mo at 10k',
      },
      {
        item: 'Termii SMS — recommended',
        detail: '₦5 / SMS · saves ~80% vs Twilio',
        cost: '₦450,000 / mo at 10k',
      },
      { item: 'API at 100 users', detail: 'Low-volume start', cost: '₦180,000 / mo' },
    ],
    foot: 'API Nigeria: ₦450,000 / mo at 10k using Termii.',
  },
  {
    title: '5 · Payments + Payout',
    icon: CreditCard,
    rows: [
      {
        item: 'Paystack',
        detail: '1.5% + ₦100 local, capped ₦2,000 · International 3.9% + ₦100 · no monthly',
        cost: 'Variable',
      },
      {
        item: 'Flutterwave — backup',
        detail: '1.4% local · 3.8% international',
        cost: 'Variable',
      },
      {
        item: 'Opay / PalmPay / M-Pesa — pro payouts',
        detail: '₦10–₦50 per transfer, not % · cheapest for pros',
        cost: '₦50,000 / mo fees',
      },
      {
        item: 'Moniepoint / Kuda — business banking',
        detail: 'Everyday business banking',
        cost: 'Free',
      },
    ],
    foot: 'Payments: 1.5% of sales + ₦50,000 / mo payout fees.',
  },
  {
    title: '6 · Team + Compliance',
    icon: Users,
    rows: [
      { item: 'Moderator — Lagos', detail: 'Local moderation + QC', cost: '₦150,000 / mo' },
      {
        item: 'Community Onboarding',
        detail: 'Creator onboarding + support',
        cost: '₦120,000 / mo',
      },
      { item: 'Legal', detail: 'Already included in registration', cost: '₦0 extra' },
    ],
    foot: 'Team: ₦270,000 / mo — about 5× cheaper than UK on this plan.',
  },
  {
    title: '7 · Marketing + Launch',
    icon: Megaphone,
    rows: [
      {
        item: 'TikTok / IG ads — Nigeria',
        detail: 'Local creator acquisition',
        cost: '₦150,000 / mo',
      },
      { item: '100 test users gift', detail: '₦5,000 each', cost: '₦500,000 one-off' },
    ],
    foot: 'Marketing: ₦500,000 one-off + ₦150,000 / mo.',
  },
];

const checklistUK = [
  'Registration — Companies House + ICO + Trademark',
  'Server — Vercel + Supabase live',
  'API — OpenAI, Whisper, Resend + moderation',
  'Payout — Stripe connected + tested',
  'Domain + Workspace — myfaceprofile + email',
  'Compliance — Terms, Privacy, Creator Licence',
  'Team — Moderator + Community rota',
  'Marketing — Launch ads + 100 test creators',
];

const checklistNG = [
  'Registration — CAC Ltd + NDPC EHL',
  'Server — Vercel + Supabase live',
  'API — Termii SMS + OpenAI + Whisper',
  'Payout — Paystack + Opay / PalmPay tested',
  'Domain — .com.ng + .com + Workspace',
  'Compliance — NDPC audit return + contracts',
  'Team — Lagos Moderator + Onboarding',
  'Marketing — Launch ads + 100 test creators',
];

function fmt(n: number) {
  return n.toLocaleString('en-GB', { maximumFractionDigits: 0 });
}

function loadChecks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function SectionList({ sections }: { sections: Section[] }) {
  return (
    <div className="grid gap-4">
      {sections.map((s) => {
        const Icon = s.icon;
        return (
          <section
            key={s.title}
            className="overflow-hidden rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] shadow-[0_12px_32px_rgba(10,25,49,0.08)]"
          >
            <div className="flex items-center gap-3 border-b border-[#D4CBB8] px-4 py-4 sm:px-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A1931] text-white">
                <Icon size={18} />
              </div>
              <h3 className="font-display text-[15px] font-extrabold leading-tight text-[#0A1931] sm:text-lg">
                {s.title}
              </h3>
            </div>
            <div className="overflow-x-auto bg-[#FFFDF7]">
              <table className="go-live-table w-full">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Detail</th>
                    <th className="text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {s.rows.map((r) => (
                    <tr key={r.item}>
                      <td className="min-w-[150px] font-semibold text-[#0A1931]">{r.item}</td>
                      <td className="min-w-[180px] text-[#5B6470]">{r.detail}</td>
                      <td className="go-live-num text-right text-[#0A1931]">{r.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="bg-[#E8DFCC] px-4 py-3 text-[13px] font-semibold text-[#0A1931] sm:px-5">
              {s.foot}
            </p>
          </section>
        );
      })}
    </div>
  );
}

function Totals({
  region,
  users,
  provider,
}: {
  region: string;
  users: number;
  provider: string;
}) {
  const ukServer =
    255 +
    Math.max(0, Math.min(1, (users - 1000) / 9000)) * 250 +
    (users < 1000 ? ((users - 100) / 900) * -75 : 0);
  const ukApi = 120 + Math.max(0, Math.min(1, (users - 100) / 9900)) * 360;
  const ukLive = 1980 + (ukServer - 505) + (ukApi - 480);
  const ngServer = 180000 + Math.max(0, Math.min(1, (users - 100) / 9900)) * 231000;
  const ngApi =
    provider === 'Termii'
      ? 180000 + Math.max(0, Math.min(1, (users - 100) / 9900)) * 270000
      : 220000 + Math.max(0, Math.min(1, (users - 100) / 9900)) * 500000;
  const ngLive = 1125000 + (ngServer - 411000) + (ngApi - 450000);

  if (region === 'UK') {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 sm:p-5">
          <p className="text-xs font-bold tracking-widest text-[#5B6470]">ONE-OFF</p>
          <p className="font-display mt-1 text-3xl font-black text-[#0A1931] sm:text-4xl">£2,842</p>
          <p className="mt-1 text-xs text-[#5B6470]">Registration + legal + launch gifts</p>
        </div>
        <div className="rounded-[18px] border-2 border-[#0A1931] bg-[#FFFDF7] p-4 sm:p-5">
          <p className="text-xs font-bold tracking-widest text-[#5B6470]">MONTHLY · LIVE ESTIMATE</p>
          <p className="font-display mt-1 text-3xl font-black text-[#0A1931] sm:text-4xl">
            £{fmt(Math.round(ukLive))}
            <span className="text-base">/mo</span>
          </p>
          <p className="mt-1 text-xs text-[#0A1931]">
            At {fmt(users)} users · Board rate at 10k: £1,980/mo
          </p>
        </div>
        <div className="rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 sm:p-5">
          <p className="text-xs font-bold tracking-widest text-[#5B6470]">3-MONTH RUNWAY</p>
          <p className="font-display mt-1 text-3xl font-black text-[#0A1931] sm:text-4xl">£8,782</p>
          <p className="mt-1 text-xs text-[#5B6470]">One-off + 3× monthly · Working capital separate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 sm:p-5">
        <p className="text-xs font-bold tracking-widest text-[#5B6470]">ONE-OFF</p>
        <p className="font-display mt-1 text-3xl font-black text-[#0A1931] sm:text-4xl">₦1,285,000</p>
        <p className="mt-1 text-xs text-[#5B6470]">≈ $857 · ≈ £642</p>
      </div>
      <div className="rounded-[18px] border-2 border-[#0A1931] bg-[#FFFDF7] p-4 sm:p-5">
        <p className="text-xs font-bold tracking-widest text-[#5B6470]">MONTHLY · LIVE ESTIMATE</p>
        <p className="font-display mt-1 text-3xl font-black text-[#0A1931] sm:text-4xl">
          ₦{fmt(Math.round(ngLive))}
        </p>
        <p className="mt-1 text-xs text-[#0A1931]">
          ≈ £{fmt(Math.round(ngLive / 2000))} · At {fmt(users)} users · {provider} · Board rate at 10k:
          ₦1,125,000
        </p>
      </div>
      <div className="rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 sm:p-5">
        <p className="text-xs font-bold tracking-widest text-[#5B6470]">3-MONTH RUNWAY</p>
        <p className="font-display mt-1 text-3xl font-black text-[#0A1931] sm:text-4xl">₦4,660,000</p>
        <p className="mt-1 text-xs text-[#5B6470]">≈ £2,330 · Working capital separate</p>
      </div>
    </div>
  );
}

export default function GoLiveExpenditurePage() {
  const [view, setView] = useState<Region>('UK');
  const [users, setUsers] = useState(10000);
  const [provider, setProvider] = useState('Termii');
  const [doneKeys, setDoneKeys] = useState<string[]>([]);
  const [syncMsg, setSyncMsg] = useState('');

  const activeRegion = view === 'COMPARE' ? 'UK' : view;
  const list = activeRegion === 'UK' ? checklistUK : checklistNG;
  const doneSet = useMemo(() => new Set(doneKeys), [doneKeys]);
  const doneCount = list.filter((_, i) => doneSet.has(`${activeRegion}-${i}`)).length;

  useEffect(() => {
    setDoneKeys(loadChecks());
  }, []);

  function toggleCheck(idx: number) {
    const key = `${activeRegion}-${idx}`;
    const next = doneSet.has(key) ? doneKeys.filter((k) => k !== key) : [...doneKeys, key];
    setDoneKeys(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSyncMsg(doneSet.has(key) ? 'Removed from launch checklist.' : 'Saved to your launch checklist.');
    } catch {
      setSyncMsg('Could not persist that tick on this device.');
    }
  }

  const ukServer = Math.round(
    255 +
      Math.max(0, Math.min(1, (users - 1000) / 9000)) * 250 +
      (users < 1000 ? ((users - 100) / 900) * -75 : 0),
  );
  const ukApi = Math.round(120 + Math.max(0, Math.min(1, (users - 100) / 9900)) * 360);
  const ngServer = Math.round(180000 + Math.max(0, Math.min(1, (users - 100) / 9900)) * 231000);
  const ngApi =
    provider === 'Termii'
      ? Math.round(180000 + Math.max(0, Math.min(1, (users - 100) / 9900)) * 270000)
      : Math.round(220000 + Math.max(0, Math.min(1, (users - 100) / 9900)) * 500000);

  return (
    <div
      data-safe-area-inset-root
      className="go-live-expend min-h-screen overflow-x-clip bg-[#FFFDF7] text-[#0A1931] selection:bg-[#FFC300]/35"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <div className="go-live-gradient px-4 py-3 text-center">
        <p className="font-mono2 text-[10px] font-extrabold tracking-[0.14em] text-[#0A1931] sm:text-xs">
          GO-LIVE EXPENDITURE · 10,000 USERS · UK + NIGERIA · 3 LAYERS
        </p>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <section className="pt-6 sm:pt-8">
          <div className="go-live-gradient rounded-[22px] p-[2px]">
            <div className="rounded-[20px] bg-[#FFFDF7] px-4 py-5 sm:px-7 sm:py-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1 text-xs font-semibold text-[#0A1931]">
                  <ShieldCheck size={14} /> 10,000 USERS · UK + NIGERIA
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4CBB8] bg-[#EFFAF6] px-3 py-1 text-xs font-bold text-[#007A5C]">
                  Layer 1 UK · Layer 2 NG · Layer 3 Compare
                </span>
              </div>
              <h1 className="font-display mt-3 text-[clamp(2rem,6vw,4.2rem)] font-black leading-[0.95] text-[#0A1931]">
                Go live.
                <br />
                <span className="go-live-text">Funded properly.</span>
              </h1>
              <p className="mt-3 max-w-3xl font-medium text-[#5B6470]">
                Calculation using 2026 published rates, not a forecast. Prices checked Nov 2026. Pair with
                the Revenue Model and Video → Cash Capture Guide.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/revenue-model"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0A1931] px-5 text-sm font-extrabold text-white"
                >
                  Revenue Model 100→1k <ArrowRight size={16} />
                </Link>
                <Link
                  to="/video-to-cash"
                  className="inline-flex h-11 items-center rounded-full border-2 border-[#0A1931] bg-[#FFF8E1] px-5 text-sm font-extrabold text-[#0A1931]"
                >
                  Video → Cash
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Setup view">
          {(
            [
              ['UK', 'UK SETUP'],
              ['NG', 'NIGERIA SETUP'],
              ['COMPARE', 'SIDE-BY-SIDE COMPARISON'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              className={`rounded-full border px-3.5 py-2.5 text-[13px] font-extrabold sm:px-4 ${
                view === id
                  ? 'border-[#0A1931] bg-[#0A1931] text-white'
                  : 'border-[#D4CBB8] bg-[#FFFDF7] text-[#0A1931]'
              }`}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {view !== 'COMPARE' ? (
          <>
            <section className="mt-6">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-xs font-bold tracking-widest text-[#5B6470]">
                    SET {view === 'UK' ? '1' : '2'}
                  </p>
                  <h2 className="font-display text-2xl font-black text-[#0A1931] sm:text-3xl">
                    {view === 'UK'
                      ? 'UK Setup — MyFaceProfile Ltd, Oldham'
                      : 'Nigeria Setup — MyFaceProfile Nigeria Ltd, Lagos'}
                  </h2>
                </div>
                <span className="inline-flex items-center rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1 text-xs font-semibold text-[#0A1931]">
                  {view === 'UK' ? 'Sell from the UK' : 'Supply from Nigeria'}
                </span>
              </div>
              <div className="mt-4">
                <Totals region={view} users={users} provider={provider} />
              </div>
            </section>

            <section className="mt-4 rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 shadow-[0_12px_32px_rgba(10,25,49,0.08)] sm:p-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="go-live-users" className="text-sm font-bold text-[#0A1931]">
                      Users — live cost slider
                    </label>
                    <span className="font-mono2 font-bold text-[#0A1931]">{fmt(users)} users</span>
                  </div>
                  <input
                    id="go-live-users"
                    className="go-live-range mt-3"
                    type="range"
                    min={100}
                    max={10000}
                    step={100}
                    value={users}
                    onChange={(e) => setUsers(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-[#5B6470]">
                    <span>100</span>
                    <span>5,000</span>
                    <span>10,000</span>
                  </div>
                  <p className="mt-2 text-xs text-[#5B6470]">
                    Server + API scale with users. Other board costs stay at the stated plan rate.
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold text-[#0A1931]">SMS provider — Nigeria saving</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`rounded-full border px-3 py-2 text-xs font-extrabold ${
                        provider === 'Termii'
                          ? 'border-[#0A1931] bg-[#0A1931] text-white'
                          : 'border-[#D4CBB8] bg-[#FFFDF7] text-[#0A1931]'
                      }`}
                      onClick={() => setProvider('Termii')}
                    >
                      Termii · ₦5 / SMS
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-3 py-2 text-xs font-extrabold ${
                        provider === 'Twilio'
                          ? 'border-[#0A1931] bg-[#0A1931] text-white'
                          : 'border-[#D4CBB8] bg-[#FFFDF7] text-[#0A1931]'
                      }`}
                      onClick={() => setProvider('Twilio')}
                    >
                      Twilio · ₦25 / SMS
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-[#E8DFCC] p-3">
                      <p className="text-xs text-[#5B6470]">Server now</p>
                      <p className="font-mono2 font-bold text-[#0A1931]">
                        {view === 'UK' ? `£${fmt(ukServer)} / mo` : `₦${fmt(ngServer)} / mo`}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#E8DFCC] p-3">
                      <p className="text-xs text-[#5B6470]">API now</p>
                      <p className="font-mono2 font-bold text-[#0A1931]">
                        {view === 'UK' ? `£${fmt(ukApi)} / mo` : `₦${fmt(ngApi)} / mo`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 sm:p-5">
                <p className="text-xs font-bold tracking-widest text-[#5B6470]">
                  WORKING CAPITAL — PRO PAYOUTS · SEPARATE
                </p>
                <h3 className="font-display mt-1 text-2xl font-black text-[#0A1931]">
                  {view === 'UK' ? '£18,360' : '₦2,700,000'}
                </h3>
                <p className="mt-1 text-sm text-[#5B6470]">
                  {view === 'UK'
                    ? 'For first 100 users. Fronted, recovered in 30–120 days from labs.'
                    : 'For first 100 users · 100 × ₦27,000 · $18 each at ₦1,500 / $.'}
                </p>
                {view === 'NG' ? (
                  <p className="mt-2 font-mono2 text-xs text-[#0A1931]">₦2,700,000 = $1,800 = £1,350</p>
                ) : null}
              </div>
              <div className="rounded-[18px] bg-[#0A1931] p-4 text-white sm:p-5">
                <p className="text-xs font-bold tracking-widest text-white/70">
                  GRAND TOTAL TO GO LIVE SAFELY
                </p>
                <h3 className="font-display mt-1 text-2xl font-black">
                  {view === 'UK' ? '£27,142' : '₦7,360,000 · £3,680'}
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  {view === 'UK'
                    ? 'One-off + 3-month runway + first payout float. 12-month runway: £26,602.'
                    : 'One-off + 3-month runway + first payout float. 12-month runway: ₦14,785,000 · £7,392.'}
                </p>
              </div>
            </section>

            <div className="mt-8">
              <SectionList sections={view === 'UK' ? ukSections : ngSections} />
            </div>

            <section className="mt-5 rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 shadow-[0_12px_32px_rgba(10,25,49,0.08)] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display flex items-center gap-2 text-xl font-black text-[#0A1931]">
                    <BadgeCheck /> Launch checklist — {view === 'UK' ? 'UK' : 'Nigeria'}
                  </h3>
                  <p className="text-sm text-[#5B6470]">
                    Tick a step to save it on this device. Progress stays local.
                  </p>
                </div>
                <span className="font-mono2 font-bold text-[#0A1931]">
                  {doneCount} / {list.length} done
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E8DFCC]">
                <div
                  className="go-live-gradient h-full transition-all"
                  style={{ width: `${(doneCount / list.length) * 100}%` }}
                />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {list.map((item, i) => {
                  const key = `${activeRegion}-${i}`;
                  const done = doneSet.has(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleCheck(i)}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left ${
                        done
                          ? 'border-[#00C896] bg-[#EFFAF6]'
                          : 'border-[#D4CBB8] bg-[#FFFDF7]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold ${
                          done
                            ? 'border-[#0A1931] bg-[#0A1931] text-white'
                            : 'border-[#D4CBB8] bg-white text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <span className="text-sm font-semibold text-[#0A1931]">{item}</span>
                    </button>
                  );
                })}
              </div>
              {syncMsg ? (
                <p role="status" className="mt-3 text-xs text-[#5B6470]">
                  {syncMsg}
                </p>
              ) : null}
            </section>
          </>
        ) : (
          <section className="mt-6">
            <h2 className="font-display text-2xl font-black text-[#0A1931] sm:text-3xl">
              Side-by-side comparison
            </h2>
            <p className="mt-1 text-sm text-[#5B6470]">
              Exchange guide used in this artefact: £1 = ₦2,000 · $1 = ₦1,500. Check the live rate before
              paying.
            </p>
            <div className="mt-4 overflow-hidden rounded-[18px] border border-[#D4CBB8] bg-[#FFFDF7] shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
              <div className="overflow-x-auto">
                <table className="go-live-table w-full">
                  <thead>
                    <tr>
                      <th>Line</th>
                      <th>UK</th>
                      <th>Nigeria</th>
                      <th>Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Registration one-off', '£1,100', '₦810k · £405', 'Nigeria 63% cheaper'],
                      [
                        'Server at 10k',
                        '£505 / mo',
                        '₦411k · £205 / mo',
                        'Same $ stack · Termii saves SMS',
                      ],
                      [
                        'Team',
                        '£1,415 / mo',
                        '₦270k · £135 / mo',
                        'Nigeria ~10× cheaper on this plan',
                      ],
                      ['Monthly at 10k', '£1,980', '₦1,125,000 · £562', 'Nigeria lower cash cost'],
                      [
                        '3-month runway',
                        '£8,782',
                        '₦4,660,000 · £2,330',
                        'Nigeria 73% cheaper',
                      ],
                      [
                        'Working capital · 100 users',
                        '£18,360',
                        '₦2,700,000 · £1,350',
                        'Separate float in both sets',
                      ],
                      [
                        'Grand total to go live safely',
                        '£27,142',
                        '₦7,360,000 · £3,680',
                        'Dual-entity total is a decision, not a sum to double-count',
                      ],
                    ].map(([line, uk, ng, verdict]) => (
                      <tr key={line}>
                        <td className="font-semibold text-[#0A1931]">{line}</td>
                        <td className="go-live-num text-[#0A1931]">{uk}</td>
                        <td className="go-live-num text-[#0A1931]">{ng}</td>
                        <td className="text-[#5B6470]">{verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="go-live-gradient mt-4 rounded-2xl p-[2px]">
              <div className="rounded-[14px] bg-[#FFFDF7] p-5">
                <h3 className="font-display text-xl font-black text-[#0A1931]">Recommendation</h3>
                <p className="mt-2 leading-relaxed text-[#0A1931]">
                  <b>Register UK Ltd FIRST</b> — for lab trust + Stripe + $ deals.{' '}
                  <b>Register Nigeria Ltd SECOND</b> — for pro onboarding + Paystack + NDPC + local trust.
                  Use the UK for selling, Nigeria for supplying. Dual entity = cheapest + most trusted.
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold text-[#0A1931]">
                  See both breakdowns <ArrowRight size={16} />
                  <button type="button" className="underline" onClick={() => setView('UK')}>
                    UK detail
                  </button>
                  ·
                  <button type="button" className="underline" onClick={() => setView('NG')}>
                    Nigeria detail
                  </button>
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4">
                <p className="font-bold text-[#0A1931]">UK strengths</p>
                <p className="mt-1 text-sm text-[#5B6470]">
                  Stripe, Companies House credibility, lab procurement, $ contracts.
                </p>
              </div>
              <div className="rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4">
                <p className="font-bold text-[#0A1931]">Nigeria strengths</p>
                <p className="mt-1 text-sm text-[#5B6470]">
                  Paystack + Opay payouts, NDPC compliance, local creator supply, lower team cost.
                </p>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-12 border-t-2 border-[#0A1931] pt-5">
          <p className="font-display text-lg font-black text-[#0A1931]">Sources</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#5B6470]">
            Companies House £100 online from 1 Feb 2026 · ICO Tier 1 £52, Tier 2 £78 · CAC all-in ₦60k Ltd ·
            NDPC EHL ₦100k, UHL ₦250k, OHL ₦10k · Stripe UK 1.5% + 20p · Paystack 1.5% + ₦100 · Flutterwave
            1.4% · Vercel Pro $20 · Supabase Pro $25 · OpenAI GPT-4o $2.50 / $10 per 1M · GPT-4o-mini $0.15 /
            $0.60 · .com.ng ₦6,450 · .ng ₦13,975.
          </p>
          <p className="mt-3 text-[13px] font-semibold text-[#0A1931]">
            Disclaimer: Calculation scenario, not a forecast. Exchange rates: £1 = ₦2,000, $1 = ₦1,500 used
            for conversion — check live rate.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/revenue-model"
              className="inline-flex h-10 items-center rounded-full bg-[#FFC300] px-4 text-sm font-extrabold text-[#0A1931]"
            >
              Revenue Model →
            </Link>
            <Link
              to="/pricing"
              className="inline-flex h-10 items-center rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-4 text-sm font-bold text-[#0A1931]"
            >
              Pricing
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-10 items-center rounded-full bg-[#0A1931] px-4 text-sm font-extrabold text-white"
            >
              Start showing — free
            </Link>
          </div>
          <p className="mt-3 text-xs text-[#5B6470]">
            MyFaceProfile · Oldham + Lagos · Up to 10,000 users · Production expenditure artefact.
          </p>
        </footer>
      </main>
    </div>
  );
}
