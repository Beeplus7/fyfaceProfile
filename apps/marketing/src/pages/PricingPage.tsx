import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Gift,
  Video,
  Wallet,
  Check,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Coins,
  Scissors,
  Wrench,
  ChefHat,
  BadgeCheck,
  Hand,
  Mic,
  Lightbulb,
  Eye,
  Banknote,
  Smartphone,
  Globe,
} from 'lucide-react';

const videoTypes = [
  { id:"Standard", name:"Standard Work Video", film:"Tailor sewing, Mechanic fixing, Chef cooking", buyer:"$60/hr", you:"$18/hr", gbp:14, naira:"₦27,000", quality:"90%+ Quality", detail:"Hands in view • Clear audio", example:"1hr = £14" },
  { id:"Premium", name:"Premium Work Video", film:"Rare trade, Tesla BMS, EV, Complex repair", buyer:"$97/hr", you:"$30/hr", gbp:23, naira:"₦45,000", quality:"95%+ Quality", detail:"Rare skill, precise steps", example:"1hr = £23" },
  { id:"Language", name:"Language Video", film:"Work + Yoruba / Pidgin / Igbo / Hausa / Swahili voice", buyer:"$120/hr", you:"$38/hr", gbp:29, naira:"₦57,000", quality:"95%+ + Language clear", detail:"Speak your language while you work", example:"1hr = £29" },
  { id:"Live", name:"Live Directed Video", film:"Lab directs you live, repeat moves", buyer:"$100/hr", you:"$32/hr", gbp:25, naira:"₦48,000", quality:"Live, follow spec", detail:"Directed session, live feedback", example:"1hr = £25" },
  { id:"Clip", name:"Short Clip · 30-sec", film:"Language clip, tool use, one step", buyer:"$2–$4 / clip", you:"$1 / clip", gbp:0.77, naira:"₦1,500", quality:"Clear, 30 sec", detail:"One sharp step, well lit", example:"20 clips = £15.40" },
];
const gifts = [
  { name:"Clap", emoji:"👏", mcl:10, you:"£0.08", when:"Nice work" },
  { name:"Rose", emoji:"🌹", mcl:50, you:"£0.40", when:"Love this" },
  { name:"Star", emoji:"⭐", mcl:100, you:"£0.80", when:"Amazing skill" },
  { name:"Fire", emoji:"🔥", mcl:250, you:"£2.00", when:"You’re on fire" },
  { name:"Crown", emoji:"👑", mcl:500, you:"£4.00", when:"Master!" },
  { name:"Diamond", emoji:"💎", mcl:1000, you:"£8.00", when:"GOAT" },
  { name:"Golden Tool", emoji:"🛠️", mcl:2500, you:"£20.00", when:"Best in trade" },
];
const packs = [
  { mcl:"100 MCL", price:"£1", bonus:"Starter pack" },
  { mcl:"550 MCL", price:"£5", bonus:"10% bonus" },
  { mcl:"1,200 MCL", price:"£10", bonus:"20% bonus" },
  { mcl:"3,500 MCL", price:"£25", bonus:"40% bonus" },
];
const faqs = [
  { q:"Is it really free?", a:"Yes. Everything is free to join. We earn only when you earn — from a share of dataset sales, gifts and bookings. No subscription, no listing fee, no hidden fee." },
  { q:"When do I get paid?", a:"Weekly on Monday, once your video is approved and you have given consent. Withdraw from £5 / ₦5,000." },
  { q:"What is MCL?", a:"MCL is MyFace Coin — the digital gift coin in the system. 100 MCL = £1. Viewers tip you in MCL, you convert it to cash, and you keep 80% of gifts." },
  { q:"Can I delete my video?", a:"Yes, anytime. Your rights are protected under GDPR + NDPC. You choose face-blur ON/OFF and Allow Sale YES/NO." },
  { q:"Do I need to show my face?", a:"No. Choose hands-only, or use face-blur. Your work is your face — not your CV, and not a face reveal." },
  { q:"What if my video is rejected?", a:"You get clear feedback, you re-film, and there is no penalty. Most rejections are audio, lighting or hands out of view." },
  { q:"How do I withdraw in Nigeria? In the UK?", a:"Nigeria: Opay, PalmPay, Bank or Airtime. UK: Stripe or Bank. Also M-Pesa in supported regions." },
];

export default function PricingPage() {
  const [activeVideo, setActiveVideo] = useState('Standard');
  const [hours, setHours] = useState(3);
  const [weeks, setWeeks] = useState(12);
  const [calcType, setCalcType] = useState('Standard');
  const [giftTab, setGiftTab] = useState<'menu' | 'packs' | 'split'>('menu');
  const [giftFilter, setGiftFilter] = useState<'all' | 'small' | 'big'>('all');
  const [openFaq, setOpenFaq] = useState(0);
  const [withdrawNote, setWithdrawNote] = useState('');
  const [joined, setJoined] = useState(false);
  const [selectedGift, setSelectedGift] = useState('Crown');

  const calc = useMemo(() => {
    const t = videoTypes.find((x) => x.id === calcType) || videoTypes[0];
    const totalHours = hours * weeks;
    const dataset = totalHours * t.gbp;
    const giftsEst = Math.round(totalHours * 3.33);
    const buyerUsd =
      totalHours * (calcType === 'Standard' ? 60 : calcType === 'Premium' ? 97 : 120);
    return { t, totalHours, dataset, giftsEst, total: dataset + giftsEst, buyerUsd };
  }, [hours, weeks, calcType]);

  const visibleGifts = gifts.filter((g) =>
    giftFilter === 'all' ? true : giftFilter === 'small' ? g.mcl <= 100 : g.mcl >= 250,
  );

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const Tab = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-sm font-bold ${
        active
          ? 'border-[#0A1931] bg-[#0A1931] text-white'
          : 'border-[#D4CBB8] bg-[#FFFDF7] text-[#0A1931]'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div
      data-safe-area-inset-root
      className="pricing-public min-h-screen overflow-x-clip bg-[#FFFDF7] text-[#0A1931] selection:bg-[#FFC300]/35"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <div className="bg-[#0A1931] px-4 py-3 text-center text-white">
        <p className="mx-auto max-w-6xl text-[12px] font-semibold leading-snug tracking-wide sm:text-[13px]">
          <span className="text-[#8FFF4A]">PUBLIC CREATOR PRICING —</span> EVERYTHING FREE TO JOIN ·{' '}
          <span className="text-[#FFE600]">YOU GET PAID, YOU DON&apos;T PAY</span>
        </p>
      </div>

      <div className="sticky top-[calc(64px+var(--safe-area-inset-top))] z-30 border-b border-[#D4CBB8] bg-[#FFFDF7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <nav className="hidden items-center gap-5 text-[13px] font-semibold text-[#5B6470] lg:flex">
            <button type="button" onClick={() => scrollTo('pay')} className="hover:text-[#0A1931]">
              How you get paid
            </button>
            <button type="button" onClick={() => scrollTo('video')} className="hover:text-[#0A1931]">
              Video pay
            </button>
            <button type="button" onClick={() => scrollTo('mcl')} className="hover:text-[#0A1931]">
              MCL gifts
            </button>
            <button type="button" onClick={() => scrollTo('cash')} className="hover:text-[#0A1931]">
              Video to Cash
            </button>
            <button type="button" onClick={() => scrollTo('faq')} className="hover:text-[#0A1931]">
              FAQ
            </button>
          </nav>
          <div className="ml-auto flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => scrollTo('calculator')}
              className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-4 py-2.5 text-[13px] font-bold"
            >
              Calculate My Pay
            </button>
            <Link
              to="/signup"
              className="rounded-full bg-[#0A1931] px-4 py-2.5 text-[13px] font-bold text-white"
            >
              Join Free →
            </Link>
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div className="pricing-grad absolute inset-0 opacity-[0.14]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-16 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-1.5 text-[12px] font-bold shadow-sm">
              <Sparkles className="h-4 w-4 text-[#FF8A00]" /> PUBLIC PRICING · FOR CREATORS & WORKERS · NOT
              ADMIN PRICING
            </div>
            <h1 className="font-display mt-5 text-[clamp(38px,7vw,72px)] font-black leading-[0.95] text-[#0A1931]">
              Everything Free.
              <br />
              <span className="pricing-grad-text">You Get Paid</span>
              <br />
              For Your Work.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#5B6470] sm:text-lg">
              No subscription. No monthly fee. No CV. Join free, go live doing what you do best, get paid for
              your video + gifts.{' '}
              <strong className="text-[#0A1931]">We only earn when you earn.</strong>
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['FREE TO JOIN', 'NO MONTHLY FEE', 'WITHDRAW £5 / ₦5,000 MIN', 'PAID WEEKLY · MONDAY'].map(
                (b) => (
                  <span
                    key={b}
                    className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-2 text-[11px] font-extrabold shadow-sm sm:text-xs"
                  >
                    {b}
                  </span>
                ),
              )}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/signup"
                onClick={() => setJoined(true)}
                className="flex items-center gap-2 rounded-full bg-[#0A1931] px-6 py-4 text-[15px] font-bold text-white"
              >
                Join Free — Start Filming <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => scrollTo('calculator')}
                className="flex items-center gap-2 rounded-full border-2 border-[#0A1931] bg-[#FFF8E1] px-6 py-4 text-[15px] font-bold"
              >
                <Calculator className="h-5 w-5" /> Calculate My Pay
              </button>
              <Link
                to="/video-to-cash"
                className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-6 py-4 text-[15px] font-bold"
              >
                Video → Cash guide
              </Link>
            </div>
            {joined ? (
              <p className="mt-4 rounded-xl border border-[#8FFF4A] bg-[#EFFFDF] px-4 py-3 text-sm font-semibold">
                ✓ You&apos;re on the right page. Joining is free — create your profile, show your work, and film
                your first video.
              </p>
            ) : null}
            <p className="mt-4 text-xs text-[#5B6470]">
              For first-time users in Africa + UK · Plain language · No hidden fees
            </p>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7] shadow-[0_18px_50px_rgba(10,25,49,.10)]">
            <div className="pricing-grad h-2" />
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-widest text-[#5B6470]">MY WALLET · SAMPLE</p>
                  <p className="font-display mt-1 text-[26px] font-black">Total £171.50</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A1931] text-white">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F0E9DB] p-4">
                <div className="flex items-center gap-3">
                  <div className="pricing-grad flex h-10 w-10 items-center justify-center rounded-full">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#5B6470]">MCL BALANCE</p>
                    <p className="font-mono2 text-lg font-extrabold">2,450 MCL</p>
                  </div>
                </div>
                <p className="font-bold">= £24.50</p>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  ['Dataset pay', '£42.00'],
                  ['Bookings', '£105.00'],
                  ['Gifts (MCL)', '£24.50'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-dashed border-[#D4CBB8] pb-2">
                    <span className="text-[#5B6470]">{k}</span>
                    <strong className="font-mono2">{v}</strong>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setWithdrawNote(
                    'Withdrawals are paid every Monday. Minimum £5 / ₦5,000. Choose Opay, PalmPay, M-Pesa, Bank, Stripe or Airtime.',
                  )
                }
                className="mt-5 w-full rounded-full bg-[#0A1931] py-3.5 font-bold text-white"
              >
                Withdraw
              </button>
              {withdrawNote ? (
                <p className="mt-3 rounded-xl bg-[#EFF7FF] p-3 text-[13px] leading-relaxed">{withdrawNote}</p>
              ) : null}
              <p className="mt-3 text-center text-[11px] text-[#5B6470]">
                Sample wallet — your real balance appears after your first approved video.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pay" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-extrabold tracking-[0.2em] text-[#1A7CFF]">SECTION 1 · HOW YOU GET PAID</p>
        <h2 className="font-display mt-2 text-[clamp(28px,4.5vw,46px)] font-extrabold leading-tight">
          One video, <span className="pricing-grad-text">3 pays.</span>
        </h2>
        <p className="mt-2 max-w-2xl text-[#5B6470]">You do the work once. It can pay you three different ways.</p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: <Video className="h-6 w-6" />,
              n: '01',
              t: 'PAY PER VIDEO',
              s: 'Dataset Pay',
              d: 'AI Labs buy your anonymized work video.',
              big: '$18/hr',
              sub: 'to you · Buyer pays $60/hr base',
              tag: 'PAID WEEKLY',
            },
            {
              icon: <Gift className="h-6 w-6" />,
              n: '02',
              t: 'GIFTS',
              s: 'MCL Coins',
              d: 'Viewers tip you live while you work.',
              big: '80% to you',
              sub: '100 MCL = £1 / ₦2,000 · We keep 20%',
              tag: 'INSTANT TO WALLET',
            },
            {
              icon: <Banknote className="h-6 w-6" />,
              n: '03',
              t: 'BOOKINGS',
              s: 'Customer Books You',
              d: 'Customer sees your live work, books you.',
              big: '90% to you',
              sub: 'Stripe escrow · We keep 10% service',
              tag: 'SECURE ESCROW',
            },
          ].map((c) => (
            <article
              key={c.t}
              className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-6 shadow-[0_12px_32px_rgba(10,25,49,0.08)] transition-shadow hover:shadow-lg"
            >
              <div className="flex justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A1931] text-white">
                  {c.icon}
                </div>
                <span className="font-mono2 text-xs text-[#5B6470]">{c.n}</span>
              </div>
              <p className="mt-5 text-[11px] font-extrabold tracking-widest text-[#1A7CFF]">{c.t}</p>
              <h3 className="font-display mt-1 text-2xl font-extrabold">{c.s}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6470]">{c.d}</p>
              <p className="font-display mt-4 text-[28px] font-black">{c.big}</p>
              <p className="text-sm text-[#5B6470]">{c.sub}</p>
              <span className="mt-4 inline-block rounded-full bg-[#EFF7FF] px-3 py-1.5 text-[11px] font-extrabold">
                {c.tag}
              </span>
            </article>
          ))}
        </div>
        <div className="mt-4 flex flex-col justify-between gap-4 rounded-[24px] bg-[#0A1931] p-5 text-white sm:flex-row sm:items-center sm:p-6">
          <div>
            <p className="text-xs font-extrabold tracking-widest text-[#8FFF4A]">EXAMPLE · SAME HOUR OF WORK</p>
            <p className="font-display mt-1 text-xl font-extrabold sm:text-2xl">
              1hr Tailor = £15 dataset + £8 gifts + £35 booking
            </p>
            <p className="mt-1 text-sm text-white/70">For work you already do.</p>
          </div>
          <p className="whitespace-nowrap font-display text-[36px] font-black sm:text-[44px]">= £58</p>
        </div>
      </section>

      <section id="video" className="border-y border-[#D4CBB8] bg-[#F0E9DB]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-xs font-extrabold tracking-[0.2em] text-[#00A66B]">
            SECTION 2 · PAY PER VIDEO · THE CORE
          </p>
          <h2 className="font-display mt-2 text-[clamp(28px,4.5vw,46px)] font-extrabold leading-tight">
            Video Inclusion Pricing
          </h2>
          <p className="mt-2 max-w-3xl text-[#5B6470]">
            Pick a video type below. The table shows what the buyer pays us, what you get, and the quality bar.
          </p>

          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Video types">
            {videoTypes.slice(0, 4).map((v) => (
              <Tab key={v.id} active={activeVideo === v.id} onClick={() => setActiveVideo(v.id)}>
                {v.name}
              </Tab>
            ))}
          </div>

          {(() => {
            const v = videoTypes.find((x) => x.id === activeVideo)!;
            return (
              <div className="mt-4 grid gap-5 rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7] p-5 sm:p-6 md:grid-cols-3">
                <div>
                  <p className="text-xs font-bold text-[#5B6470]">WHAT YOU FILM</p>
                  <p className="mt-1 text-lg font-bold leading-snug">{v.film}</p>
                  <p className="mt-2 text-sm text-[#5B6470]">{v.detail}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#F0E9DB] p-4">
                    <p className="text-xs text-[#5B6470]">BUYER PAYS US</p>
                    <p className="font-mono2 mt-1 text-xl font-extrabold">{v.buyer}</p>
                  </div>
                  <div className="rounded-2xl bg-[#0A1931] p-4 text-white">
                    <p className="text-xs text-white/70">YOU GET</p>
                    <p className="font-mono2 mt-1 text-xl font-extrabold">{v.you}</p>
                    <p className="text-sm">
                      £{v.gbp} / {v.naira}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#5B6470]">QUALITY NEEDED</p>
                  <p className="mt-1 font-bold">{v.quality}</p>
                  <p className="mt-3 rounded-xl bg-[#FFF7D6] px-3 py-2 text-sm font-bold">
                    Example: {v.example}
                  </p>
                </div>
              </div>
            );
          })()}

          <div className="mt-5 overflow-x-auto rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7]">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="bg-[#0A1931] text-white">
                  <th className="p-4">Video Type</th>
                  <th className="p-4">What You Film</th>
                  <th className="p-4">Buyer Pays Us</th>
                  <th className="p-4">You Get</th>
                  <th className="p-4">Quality Needed</th>
                  <th className="p-4">Example</th>
                </tr>
              </thead>
              <tbody>
                {videoTypes.map((v) => (
                  <tr key={v.id} className="border-t border-[#D4CBB8]">
                    <td className="p-4 font-bold">{v.name}</td>
                    <td className="p-4 text-[#5B6470]">{v.film}</td>
                    <td className="p-4 font-mono2 font-bold">{v.buyer}</td>
                    <td className="p-4 font-mono2 font-bold text-[#00A66B]">
                      {v.you}
                      <br />
                      <span className="text-xs text-[#5B6470]">
                        £{v.gbp} / {v.naira}
                      </span>
                    </td>
                    <td className="p-4">
                      {v.quality}
                      <br />
                      <span className="text-xs text-[#5B6470]">{v.detail}</span>
                    </td>
                    <td className="p-4 font-bold">{v.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 rounded-2xl border border-[#D4CBB8] bg-[#FFFDF7] p-4 text-[13px] leading-relaxed">
            <strong>Market note:</strong> Prices based on 2026 market — Troveo $1–$4/min ($60–$240/hr),
            Defined.ai $100–$300/hr, Mercor $12–$18/hr floor.{' '}
            <strong>We pay ABOVE the Mercor floor</strong> because you are a professional, not chores.
          </p>

          <div
            id="calculator"
            className="mt-8 grid overflow-hidden rounded-[28px] border border-[#D4CBB8] bg-[#FFFDF7] shadow-lg lg:grid-cols-2"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#1A7CFF]" />
                <h3 className="font-display text-2xl font-extrabold">Calculate My Pay</h3>
              </div>
              <p className="mt-1 text-sm text-[#5B6470]">Move the sliders. See your pay instantly.</p>
              <div className="mt-6">
                <div className="flex justify-between text-sm font-bold">
                  <span>Hours per week</span>
                  <span className="font-mono2 text-lg">{hours} hrs</span>
                </div>
                <input
                  aria-label="Hours per week"
                  type="range"
                  min={1}
                  max={20}
                  value={hours}
                  onChange={(e) => setHours(+e.target.value)}
                  className="pricing-range mt-2"
                />
                <p className="mt-1 text-xs text-[#5B6470]">1 to 20 hours per week</p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-sm font-bold">
                  <span>Weeks</span>
                  <span className="font-mono2 text-lg">{weeks} weeks</span>
                </div>
                <input
                  aria-label="Weeks"
                  type="range"
                  min={1}
                  max={12}
                  value={weeks}
                  onChange={(e) => setWeeks(+e.target.value)}
                  className="pricing-range mt-2"
                />
                <p className="mt-1 text-xs text-[#5B6470]">1 to 12 weeks</p>
              </div>
              <div className="mt-6">
                <p className="mb-2 text-sm font-bold">Video type</p>
                <div className="flex flex-wrap gap-2">
                  {['Standard', 'Premium', 'Language'].map((t) => (
                    <Tab key={t} active={calcType === t} onClick={() => setCalcType(t)}>
                      {t} · £{videoTypes.find((v) => v.id === t)?.gbp}/hr
                    </Tab>
                  ))}
                </div>
              </div>
              <p className="mt-6 text-xs text-[#5B6470]">
                Example default: 3 hrs/week × 12 weeks Standard = 36 hrs × £14 = £504 dataset + £120 gifts =
                £624 total.
              </p>
            </div>
            <div className="bg-[#0A1931] p-6 text-white sm:p-8">
              <p className="text-xs font-extrabold tracking-widest text-[#8FFF4A]">
                YOUR ESTIMATE · {calc.t.name.toUpperCase()}
              </p>
              <p className="font-display mt-3 text-[clamp(36px,6vw,54px)] font-black leading-none">
                £{calc.total.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-white/70">
                Total over {weeks} weeks · {calc.totalHours} hours
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/15 pb-2">
                  <span>Dataset pay</span>
                  <strong className="font-mono2">£{calc.dataset.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between border-b border-white/15 pb-2">
                  <span>Gifts estimate</span>
                  <strong className="font-mono2">£{calc.giftsEst.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between border-b border-white/15 pb-2">
                  <span>Buyer pays (USD)</span>
                  <strong className="font-mono2">${calc.buyerUsd.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Your rate</span>
                  <strong className="font-mono2">£{calc.t.gbp}/hr</strong>
                </div>
              </div>
              <div className="pricing-grad mt-5 rounded-2xl p-[2px]">
                <div className="rounded-2xl bg-[#0A1931] p-4 text-sm">
                  At <strong>{hours} hrs/week</strong> for <strong>{weeks} weeks</strong>, you film{' '}
                  <strong>{calc.totalHours} hours</strong>. Bookings are extra — on top of this estimate.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mcl" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-extrabold tracking-[0.2em] text-[#FF8A00]">SECTION 3 · MCL GIFT COINS</p>
        <h2 className="font-display mt-2 text-[clamp(28px,4.5vw,46px)] font-extrabold leading-tight">
          The Gift System, <span className="pricing-grad-text">explained.</span>
        </h2>
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[24px] border border-[#D4CBB8] bg-[#FFF9E6] p-6">
            <Coins className="h-8 w-8" />
            <h3 className="font-display mt-3 text-xl font-extrabold">What is MCL?</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#4A4430]">
              MyFace Coin / MyFaceProfile Coin — the digital gift coin in the system. Viewers buy MCL to tip
              you, you convert MCL to cash.
            </p>
            <p className="font-mono2 mt-4 text-lg font-extrabold">100 MCL = £1 = ₦2,000 = $1.30</p>
          </div>
          <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-6">
            <h3 className="font-display text-xl font-extrabold">How it works</h3>
            <ol className="mt-3 space-y-2 text-sm leading-relaxed">
              {[
                'Viewer buys an MCL pack',
                'Watches you live',
                'Taps a gift',
                'MCL lands in your wallet instantly',
                'You withdraw Monday — min 500 MCL = £5',
              ].map((s, i) => (
                <li key={s} className="flex gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0A1931] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[24px] border border-[#D4CBB8] bg-[#EFF7FF] p-6">
            <h3 className="font-display text-xl font-extrabold">MCL vs MFC</h3>
            <p className="mt-2 text-sm leading-relaxed">
              MFC was the old name. <strong>MCL is the new public name.</strong>
            </p>
            <p className="font-mono2 mt-3 font-extrabold">1 MCL = 1 MFC</p>
            <p className="mt-2 text-sm">Same value, same wallet. If you had MFC, it is now MCL.</p>
            <p className="mt-4 rounded-xl bg-[#FFFDF7] p-3 text-sm font-bold">
              Boost with MCL: 100 MCL = £1 Boost. Optional — boosts your video to more viewers. Not required.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Gift tabs">
          {(['menu', 'packs', 'split'] as const).map((t) => (
            <Tab key={t} active={giftTab === t} onClick={() => setGiftTab(t)}>
              {t === 'menu' ? 'Gift Menu' : t === 'packs' ? 'MCL Packs for Viewers' : 'Your Split'}
            </Tab>
          ))}
        </div>

        {giftTab === 'menu' ? (
          <div className="mt-4 rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl font-extrabold">Gift Menu</h3>
              <div className="flex gap-2">
                {(['all', 'small', 'big'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setGiftFilter(f)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                      giftFilter === f
                        ? 'border-[#0A1931] bg-[#0A1931] text-white'
                        : 'border-[#D4CBB8] bg-[#F0E9DB]'
                    }`}
                  >
                    {f === 'all' ? 'All gifts' : f === 'small' ? 'Small · ≤100 MCL' : 'Big · 250+ MCL'}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleGifts.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => setSelectedGift(g.name)}
                  className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left ${
                    selectedGift === g.name
                      ? 'border-[#0A1931] ring-2 ring-[#0A1931]'
                      : 'border-[#D4CBB8] bg-[#F0E9DB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{g.emoji}</span>
                    <div>
                      <p className="font-bold">{g.name}</p>
                      <p className="text-xs text-[#5B6470]">{g.when}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono2 font-extrabold">{g.mcl} MCL</p>
                    <p className="text-sm font-bold text-[#00A66B]">You: {g.you}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-[#F0E9DB] p-3 text-sm">
              Selected: <strong>{selectedGift}</strong> — tap any gift to see it highlighted. Viewers send it
              live; it lands in your wallet instantly.
            </p>
          </div>
        ) : null}

        {giftTab === 'packs' ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {packs.map((p) => (
              <div key={p.mcl} className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5">
                <p className="font-mono2 text-xl font-extrabold">{p.mcl}</p>
                <p className="font-display mt-1 text-2xl font-black">{p.price}</p>
                <p className="mt-1 text-sm text-[#5B6470]">{p.bonus}</p>
                <span className="mt-3 inline-block rounded-full bg-[#FFFDF7] px-3 py-1 text-xs font-bold">
                  FOR VIEWERS
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {giftTab === 'split' ? (
          <div className="mt-4 grid items-center gap-6 rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7] p-6 md:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-extrabold">You keep 80% of gifts</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6470]">
                MyFaceProfile keeps 20% for platform + payment fees. Example: a 1,000 MCL gift = £10 bought,{' '}
                <strong>you get £8</strong>.
              </p>
            </div>
            <div>
              <div className="flex h-12 overflow-hidden rounded-full text-sm font-bold">
                <div className="flex items-center justify-center bg-[#8FFF4A] text-[#0A1931]" style={{ width: '80%' }}>
                  YOU 80%
                </div>
                <div className="flex items-center justify-center bg-[#0A1931] text-white" style={{ width: '20%' }}>
                  20%
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-[#5B6470]">
                <span>£8 to you</span>
                <span>£2 platform + fees</span>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section id="cash" className="bg-[#0A1931] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-xs font-extrabold tracking-[0.2em] text-[#8FFF4A]">SECTION 4 · VIDEO TO CASH</p>
          <h2 className="font-display mt-2 text-[clamp(28px,4.5vw,46px)] font-extrabold leading-tight">
            From filming to cash,
            <br />
            step by step.
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { t: '1 · Join Free', d: 'No fee, create profile, show your work.', i: <Check className="h-5 w-5" /> },
              {
                t: '2 · Film',
                d: 'Go Live or Record. Hands in view, say steps. 1hr video.',
                i: <Video className="h-5 w-5" />,
              },
              {
                t: '3 · Quality Check',
                d: 'Hands ✓ Audio ✓ Lighting ✓ Steps ✓ Score 90%+ = Approved.',
                i: <BadgeCheck className="h-5 w-5" />,
              },
              {
                t: '4 · Consent',
                d: 'Face-blur ON/OFF. Allow Sale YES/NO. You choose.',
                i: <Eye className="h-5 w-5" />,
              },
              {
                t: '5 · Get Paid',
                d: 'Dataset $18/hr + Gifts + Bookings. Wallet shows MCL + £ + ₦.',
                i: <Wallet className="h-5 w-5" />,
              },
            ].map((s) => (
              <div key={s.t} className="rounded-[22px] border border-white/15 bg-white/10 p-5">
                <div className="pricing-grad flex h-10 w-10 items-center justify-center rounded-xl text-[#0A1931]">
                  {s.i}
                </div>
                <h3 className="mt-3 font-bold">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid items-center gap-5 rounded-[24px] bg-[#FFFDF7] p-5 text-[#0A1931] sm:p-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-extrabold tracking-widest text-[#1A7CFF]">TIMELINE</p>
              <p className="font-display mt-1 text-2xl font-extrabold">
                Day 1 Film → Day 2 Approved → Day 3 Paid + Sample
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {['Day 1 · Film', 'Day 2 · Approved', 'Day 3 · Paid'].map((x) => (
                  <span key={x} className="rounded-full bg-[#EFF7FF] px-3 py-2 font-bold">
                    {x}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-extrabold tracking-widest">WITHDRAW WITH</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Opay', 'PalmPay', 'M-Pesa', 'Bank', 'Stripe', 'Airtime'].map((x) => (
                  <span
                    key={x}
                    className="flex items-center gap-1 rounded-full border border-[#D4CBB8] px-3 py-2 text-sm font-semibold"
                  >
                    <Smartphone className="h-4 w-4" />
                    {x}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-[#5B6470]">Min £5 / ₦5,000 · Paid weekly Monday</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-extrabold tracking-[0.2em] text-[#1A7CFF]">SECTION 5 · TRANSPARENCY</p>
        <h2 className="font-display mt-2 text-[clamp(28px,4.5vw,46px)] font-extrabold leading-tight">
          What is free vs what we take
        </h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-6">
            <h3 className="font-display flex items-center gap-2 text-xl font-extrabold">
              <ShieldCheck className="text-[#00A66B]" /> Free, always
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                'Joining',
                'Creating Profile',
                'Going Live',
                'Recording',
                'WorkCut Editing',
                'Quality Check',
              ].map((x) => (
                <li key={x} className="flex justify-between border-b border-dashed border-[#D4CBB8] pb-2">
                  <span>{x}</span>
                  <strong className="text-[#00A66B]">FREE</strong>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-[#FFFDF7] p-3 text-sm">
              <strong>Withdraw:</strong> FREE — except payment provider fee 1.5% Stripe / 1.5% Paystack.
            </p>
          </div>
          <div className="rounded-[24px] bg-[#0A1931] p-6 text-white">
            <h3 className="font-display text-xl font-extrabold">What we take — only when you earn</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                ['Dataset', 'We keep $42 of $60 (labelling, QC, sales, storage)'],
                ['Gifts', 'We keep 20%'],
                ['Bookings', 'We keep 10% service'],
              ].map(([k, v]) => (
                <li key={k} className="border-b border-white/15 pb-3">
                  <strong>{k}</strong>
                  <span className="mt-0.5 block text-white/70">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-white/10 p-3 text-sm">
              <strong>You NEVER pay:</strong> No monthly subscription · No listing fee · No hidden fee · No fee
              to withdraw under £100.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#D4CBB8] bg-[#EFF7FF]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-xs font-extrabold tracking-[0.2em] text-[#1A7CFF]">SECTION 6 · EXAMPLE PAYCHECKS</p>
          <h2 className="font-display mt-2 text-[clamp(28px,4.5vw,46px)] font-extrabold leading-tight">
            What could a month look like?
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <Scissors className="h-6 w-6" />,
                name: 'Tailor · Lagos',
                line: '3 hrs/week · Standard',
                hrs: '12 hrs/mo',
                rows: [
                  ['Dataset', '£168'],
                  ['Gifts', '£60'],
                  ['Bookings', '£140'],
                ],
                total: '£368/mo',
                color: 'bg-[#FFF7D6]',
              },
              {
                icon: <Wrench className="h-6 w-6" />,
                name: 'Mechanic · Lagos',
                line: '5 hrs/week · Premium',
                hrs: '20 hrs/mo',
                rows: [
                  ['Dataset', '£460'],
                  ['Gifts', '£80'],
                  ['Bookings', '£300'],
                ],
                total: '£840/mo',
                color: 'bg-[#EFFFDF]',
              },
              {
                icon: <ChefHat className="h-6 w-6" />,
                name: 'Chef · Accra',
                line: '2 hrs/week · Language',
                hrs: '8 hrs/mo',
                rows: [
                  ['Dataset', '£232'],
                  ['Gifts', '£40'],
                  ['Bookings', '£100'],
                ],
                total: '£372/mo',
                color: 'bg-[#FFEDE6]',
              },
            ].map((p) => (
              <article key={p.name} className="rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7] p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.color}`}>
                  {p.icon}
                </div>
                <h3 className="font-display mt-4 text-xl font-extrabold">{p.name}</h3>
                <p className="text-sm text-[#5B6470]">
                  {p.line} · {p.hrs}
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  {p.rows.map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-dashed border-[#D4CBB8] pb-2">
                      <span>{k}</span>
                      <strong className="font-mono2">{v}</strong>
                    </div>
                  ))}
                </div>
                <p className="font-display mt-4 text-[30px] font-black">{p.total}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 rounded-2xl border border-[#D4CBB8] bg-[#FFFDF7] p-4 text-[13px]">
            These are examples using base rates, <strong>not guarantees</strong>. Your pay depends on Quality,
            Hours, Trade demand.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[.85fr_1.15fr]">
        <div>
          <p className="text-xs font-extrabold tracking-[0.2em] text-[#1A7CFF]">SECTION 7 · FOR LABS / BUYERS</p>
          <h2 className="font-display mt-2 text-[30px] font-extrabold leading-tight">Are you a lab?</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5B6470]">
            This page is for creators. If you buy datasets, go to the B2B Dataset Store.
          </p>
          <div className="mt-4 rounded-[24px] bg-[#0A1931] p-6 text-white">
            <Globe className="h-6 w-6 text-[#8FFF4A]" />
            <p className="font-display mt-2 text-xl font-extrabold">B2B Dataset Store</p>
            <p className="mt-1 text-sm text-white/70">
              Buy 1,000 hrs at $60–$300/hr. Quality-checked, consented, anonymized work video.
            </p>
            <Link
              to="/dataset-store"
              className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0A1931]"
            >
              Open Dataset Store →
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#5B6470]">
            <span className="flex items-center gap-1">
              <Hand className="h-4 w-4" /> Hands in view
            </span>
            <span className="flex items-center gap-1">
              <Mic className="h-4 w-4" /> Clear audio
            </span>
            <span className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" /> Good lighting
            </span>
          </div>
        </div>
        <div id="faq">
          <p className="text-xs font-extrabold tracking-[0.2em] text-[#FF8A00]">SECTION 8 · FAQ</p>
          <h2 className="font-display mt-2 text-[30px] font-extrabold">Questions? Answered.</h2>
          <div className="mt-4 space-y-2">
            {faqs.map((f, i) => (
              <div key={f.q} className="overflow-hidden rounded-2xl border border-[#D4CBB8] bg-[#F0E9DB]">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-[15px] font-bold"
                >
                  {f.q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i ? (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-[#5B6470]">{f.a}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="pricing-grad rounded-[28px] p-[2px]">
          <div className="rounded-[26px] bg-[#0A1931] p-6 text-center text-white sm:p-10">
            <p className="font-display text-[clamp(28px,4vw,44px)] font-black leading-tight">
              Your work is already valuable.
              <br />
              Now it pays you three ways.
            </p>
            <p className="mt-3 text-white/70">Join free · Film · Get paid weekly Monday</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="rounded-full bg-white px-6 py-4 font-bold text-[#0A1931]">
                Join Free — Start Filming
              </Link>
              <button
                type="button"
                onClick={() => scrollTo('calculator')}
                className="rounded-full border border-white/30 px-6 py-4 font-bold"
              >
                Calculate My Pay
              </button>
              <Link
                to="/revenue-model"
                className="rounded-full border border-white/30 px-6 py-4 font-bold"
              >
                Board Revenue Model
              </Link>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1 text-xs text-white/50">
              <Clock className="h-4 w-4" /> Paid weekly Monday · Min £5 / ₦5,000
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#D4CBB8]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div>
            <p className="font-display text-lg font-extrabold">
              MyFaceProfile <span className="text-sm font-medium text-[#5B6470]">· AiKOVA</span>
            </p>
            <p className="mt-1 text-sm text-[#5B6470]">“Your Work Is Your Face. Not Your CV.”</p>
          </div>
          <div className="text-sm text-[#5B6470]">
            <p>hello@myfaceprofile.com</p>
            <p className="mt-1">Oldham OL1 · Lagos</p>
            <p className="mt-1 text-xs">
              Public user pricing. Admin / agricultural architecture pricing no longer applies here.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
