import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Calculator,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  HandCoins,
  Layers,
  Lock,
  Play,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

const fmt = (n: number, d = 0) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const money = (n: number) => '$' + fmt(n);
const money2 = (n: number) => '$' + fmt(n, 2);

const months = [
  {
    id: 1,
    label: 'Month 1',
    users: 100,
    raw: 1200,
    sellable: 1020,
    base: 61200,
    cons: 33660,
    payout: 18360,
    grossBase: 42840,
    grossCons: 15300,
    note: 'Cash landed: $0 from Troveo hold + $18,360 Mercor bi-weekly portion',
    focus: 'Prove quality. Ship the 10-hour sample pack.',
  },
  {
    id: 2,
    label: 'Month 2',
    users: 300,
    raw: 3600,
    sellable: 3060,
    base: 183600,
    cons: 100980,
    payout: 55080,
    grossBase: 128520,
    grossCons: 45900,
    note: 'Scale only after the quality gate passes.',
    focus: 'Grow the cohort while payout discipline stays weekly.',
  },
  {
    id: 3,
    label: 'Month 3',
    users: 1000,
    raw: 12000,
    sellable: 10200,
    base: 612000,
    cons: 336600,
    payout: 183600,
    grossBase: 428400,
    grossCons: 153000,
    note: 'Largest front, largest landed value.',
    focus: 'Hold the 30% reserve. Do not front beyond the breaker.',
  },
];

const engines = [
  {
    n: '1',
    name: 'Live Dataset Capture',
    share: '30%',
    price: '$50/hr',
    perUser: '$459',
    total: '$45,900',
    why: 'Lab directs live, highest trust',
  },
  {
    n: '2',
    name: 'Recorded Dataset Licensing',
    share: '40%',
    price: '$60/hr',
    perUser: '$734.40',
    total: '$73,440',
    why: 'Troveo / Defined.ai',
  },
  {
    n: '3',
    name: 'B2B Bundle / Custom Contract',
    share: '15%',
    price: '$97/hr',
    perUser: '$445.05',
    total: '$44,505',
    why: '1,000hr bundles',
  },
  {
    n: '4',
    name: 'Language Dataset',
    share: '10%',
    price: '$120/hr',
    perUser: '$367.20',
    total: '$36,720',
    why: 'Yoruba / Pidgin / Hausa — rarest',
  },
  {
    n: '5',
    name: 'Existing MyFaceProfile',
    share: '+20% uplift',
    price: '—',
    perUser: '$367.20',
    total: '$36,720',
    why: 'Bookings + Gifts + Boost from live',
  },
];

const buyers = [
  {
    name: 'Troveo',
    rate: '$1–$4/min',
    hr: '$60–$240/hr',
    terms: 'Paid only after client pays · up to 4–5 months · no fixed schedule',
    own: 'Ownership never transfers',
    use: 'Volume',
    color: '#00E5C0',
  },
  {
    name: 'Mercor',
    rate: '$12–$18/hr approved',
    hr: 'Recurring',
    terms: 'Paid bi-weekly to business',
    own: 'Recurring work',
    use: 'Cash flow',
    color: '#1A7CFF',
  },
  {
    name: 'Defined.ai',
    rate: '$100–$300/hr',
    hr: 'Longer films',
    terms: 'Quote-based · custom',
    own: 'Custom scope',
    use: 'Premium',
    color: '#FF8A00',
  },
];

function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-5 sm:mb-7">
      <div className="flex items-center gap-2">
        <span className="revenue-gradient-bar h-[7px] w-10 rounded-full" />
        <span className="font-mono2 text-[11px] sm:text-xs font-bold tracking-[0.18em] text-[#1A7CFF]">
          {kicker}
        </span>
      </div>
      <h2 className="font-display mt-3 text-[clamp(1.65rem,5vw,2.55rem)] leading-[1.02] font-extrabold tracking-tight text-[#0A1931]">
        {title}
      </h2>
      {sub ? <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[#5B6470]">{sub}</p> : null}
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-1.5 text-xs font-semibold text-[#0A1931]">
      {children}
    </span>
  );
}

export default function RevenueModelPage() {
  const [users, setUsers] = useState(100);
  const [price, setPrice] = useState(60);
  const [approval, setApproval] = useState(85);
  const [scenario, setScenario] = useState<'base' | 'conservative' | 'resale'>('base');
  const [month, setMonth] = useState(1);
  const [calcOpen, setCalcOpen] = useState(false);

  const activeMonth = months.find((m) => m.id === month)!;
  const calc = useMemo(() => {
    const sellable = 36 * (approval / 100);
    const mult = scenario === 'resale' ? 2 : 1;
    const revPer = sellable * price * mult;
    const payPer = sellable * 18;
    const grossPer = revPer - payPer;
    const revenue = revPer * users;
    const payout = payPer * users;
    const gross = grossPer * users;
    const uplift = revenue * 0.2;
    return {
      sellable,
      revPer,
      payPer,
      grossPer,
      revenue,
      payout,
      gross,
      uplift,
      totalWithUplift: revenue + uplift,
      raw: users * 36,
      totalSellable: sellable * users,
    };
  }, [users, price, approval, scenario]);

  const pickScenario = (s: 'base' | 'conservative' | 'resale') => {
    setScenario(s);
    if (s === 'base') setPrice(60);
    if (s === 'conservative') setPrice(33);
    if (s === 'resale') setPrice(60);
  };

  return (
    <div
      data-safe-area-inset-root
      className="revenue-model min-h-screen overflow-x-clip bg-[#FFFDF7] text-[#0A1931] selection:bg-[#FFC300]/35"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <div className="revenue-gradient-bar px-4 py-3 text-center">
        <p className="font-mono2 text-[10px] sm:text-xs font-extrabold tracking-[0.14em] text-[#0A1931]">
          MYFACEPROFILE · REVENUE MODEL · 100 USERS → 1,000 USERS · 3 MONTHS
        </p>
      </div>

      <main className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6">
        {/* HERO */}
        <section className="pt-7 sm:pt-10">
          <div className="flex flex-wrap gap-2">
            <Chip>
              <Sparkles className="h-3.5 w-3.5 text-[#FF8A00]" /> Calculation scenario
            </Chip>
            <Chip>
              <ShieldCheck className="h-3.5 w-3.5 text-[#00A66B]" /> 2026 published rates as inputs
            </Chip>
            <Chip>Not a forecast</Chip>
            <Chip>
              <Link to="/video-to-cash" className="font-bold text-[#007A5C]">
                Video → Cash live →
              </Link>
            </Chip>
          </div>
          <div className="mt-5 grid items-end gap-6 lg:grid-cols-[1.35fr_.65fr]">
            <div>
              <h1 className="font-display text-[clamp(2.5rem,8vw,5.2rem)] leading-[0.92] font-black tracking-tight text-[#0A1931]">
                Real work.
                <br />
                <span className="revenue-gradient-text">Real dataset.</span>
                <br />
                Real revenue.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#5B6470] sm:text-lg">
                MyFaceProfile turns professional, first-person work into licensed data. No popularity
                contest. No chores. The value is in hands, tools, language, and real work — sold once,
                licensed again. Dual pay with Video → Cash: customers + dataset wallet.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#calculator"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0A1931] px-5 text-sm font-extrabold text-white"
                >
                  Open calculator <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/video-to-cash"
                  className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-[#0A1931] bg-[#FFF8E1] px-5 text-sm font-extrabold text-[#0A1931]"
                >
                  See Video → Cash
                </Link>
              </div>
            </div>
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 shadow-[0_12px_32px_rgba(10,25,49,0.1)]">
              <p className="font-mono2 text-xs font-bold tracking-[0.16em] text-[#1A7CFF]">THE CORE IDEA</p>
              <p className="mt-3 font-display text-xl font-bold leading-snug text-[#0A1931]">
                36 hours becomes 30.6 sellable hours. The platform keeps the spread.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#5B6470]">
                Pay the pro $18/hr. Sell the approved hour at $60 base or $33 conservative. The difference
                funds the model.
              </p>
            </div>
          </div>
          <p className="mt-5 rounded-2xl border border-[#D4CBB8] bg-[#FFF8D6] px-4 py-3 text-sm font-medium text-[#5A4500]">
            Calculation scenario using 2026 published rates as inputs, not a forecast.
          </p>
        </section>

        {/* SCORECARD */}
        <section className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
              <div className="flex items-center justify-between">
                <Users className="h-6 w-6 text-[#0A1931]" />
                <span className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[11px] font-bold text-[#0A1931]">
                  COHORT
                </span>
              </div>
              <p className="mt-5 font-mono2 text-[11px] font-bold tracking-widest text-[#5B6470]">
                TEST COHORT
              </p>
              <p className="font-display mt-2 text-2xl font-extrabold text-[#0A1931]">100 → 300 → 1,000</p>
              <p className="mt-2 text-sm text-[#5B6470]">Month 1 · Month 2 · Month 3</p>
            </article>
            <article className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
              <Clock3 className="h-6 w-6 text-[#0A1931]" />
              <p className="mt-5 font-mono2 text-[11px] font-bold tracking-widest text-[#5B6470]">
                TOTAL SELLABLE HOURS
              </p>
              <p className="font-display mt-2 text-[clamp(1.8rem,4vw,2.4rem)] font-extrabold text-[#0A1931]">
                14,280 <span className="text-base">hrs</span>
              </p>
              <p className="mt-2 text-sm text-[#5B6470]">16,800 raw × 85% approval over 3 months</p>
            </article>
            <article className="rounded-[24px] bg-[#0A1931] p-5 text-white shadow-[0_12px_32px_rgba(10,25,49,0.2)]">
              <Wallet className="h-6 w-6 text-[#8FFF4A]" />
              <p className="mt-5 font-mono2 text-[11px] font-bold tracking-widest text-white/60">
                REAL LIABILITY · PAYOUT FRONTED
              </p>
              <p className="font-display mt-2 text-[clamp(1.8rem,4vw,2.4rem)] font-extrabold">$257,040</p>
              <p className="mt-2 text-sm text-white/70">14,280 × $18 · what you pay pros weekly</p>
            </article>
            <article className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
              <TrendingUp className="h-6 w-6 text-[#1A7CFF]" />
              <p className="mt-5 font-mono2 text-[11px] font-bold tracking-widest text-[#5B6470]">
                SCENARIO REVENUE · BASE
              </p>
              <p className="font-display mt-2 text-[clamp(1.8rem,4vw,2.4rem)] font-extrabold text-[#0A1931]">
                $856,800
              </p>
              <p className="mt-2 text-sm text-[#5B6470]">
                $471,240 conservative · Gross $599,760 base / $214,200 cons · Before resale
              </p>
            </article>
          </div>
        </section>

        {/* CALCULATOR */}
        <section id="calculator" className="mt-10 scroll-mt-28">
          <SectionHead
            kicker="INTERACTIVE CALCULATOR"
            title="Move the levers. Watch the model move."
            sub="Start from the base case, then test approval, price, cohort size, and resale. Payout stays at $18 per approved hour unless resale is on — then revenue doubles and payout stays 1×."
          />
          <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 sm:p-7 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario">
                {(
                  [
                    ['base', 'Base · $60'],
                    ['conservative', 'Conservative · $33'],
                    ['resale', 'Resale 2× · $60'],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => pickScenario(k)}
                    aria-pressed={scenario === k}
                    className={`rounded-full px-4 py-2.5 text-sm font-bold ${
                      scenario === k
                        ? 'bg-[#0A1931] text-white'
                        : 'border border-[#D4CBB8] bg-[#FFFDF7] text-[#0A1931]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-8 space-y-7">
                <div>
                  <div className="flex items-end justify-between">
                    <label htmlFor="users" className="font-display font-bold text-[#0A1931]">
                      Active users
                    </label>
                    <span className="font-mono2 text-2xl font-extrabold text-[#0A1931]">{fmt(users)}</span>
                  </div>
                  <input
                    id="users"
                    className="revenue-range mt-3"
                    type="range"
                    min={100}
                    max={1000}
                    step={10}
                    value={users}
                    onChange={(e) => setUsers(Number(e.target.value))}
                  />
                  <div className="mt-1 flex justify-between text-xs text-[#5B6470]">
                    <span>100</span>
                    <span>1,000</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-end justify-between">
                    <label htmlFor="price" className="font-display font-bold text-[#0A1931]">
                      Buyer price per hour
                    </label>
                    <span className="font-mono2 text-2xl font-extrabold text-[#0A1931]">${fmt(price)}</span>
                  </div>
                  <input
                    id="price"
                    className="revenue-range mt-3"
                    type="range"
                    min={33}
                    max={97}
                    step={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                  <div className="mt-1 flex justify-between text-xs text-[#5B6470]">
                    <span>$33 marketplace median</span>
                    <span>$97 bundle</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-end justify-between">
                    <label htmlFor="approval" className="font-display font-bold text-[#0A1931]">
                      Approval rate
                    </label>
                    <span className="font-mono2 text-2xl font-extrabold text-[#0A1931]">{approval}%</span>
                  </div>
                  <input
                    id="approval"
                    className="revenue-range mt-3"
                    type="range"
                    min={70}
                    max={95}
                    step={1}
                    value={approval}
                    onChange={(e) => setApproval(Number(e.target.value))}
                  />
                  <div className="mt-1 flex justify-between text-xs text-[#5B6470]">
                    <span>70%</span>
                    <span>95%</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCalcOpen((v) => !v)}
                className="mt-7 flex w-full items-center justify-between rounded-2xl bg-[#E8DFCC] px-4 py-3 text-left text-sm font-bold text-[#0A1931]"
              >
                {calcOpen ? 'Hide the maths' : 'Show the maths behind this result'}
                <ChevronRight className={`h-5 w-5 transition ${calcOpen ? 'rotate-90' : ''}`} />
              </button>
              {calcOpen ? (
                <p className="mt-3 rounded-xl bg-[#FFFDF7] border border-[#D4CBB8] p-4 font-mono2 text-xs leading-relaxed text-[#0A1931]">
                  {fmt(users)} users × 36 hrs × {approval}% = {fmt(calc.totalSellable, 1)} sellable hrs.
                  Revenue = {fmt(calc.totalSellable, 1)} × ${price}
                  {scenario === 'resale' ? ' × 2 resale' : ''} = {money(calc.revenue)}. Payout ={' '}
                  {fmt(calc.totalSellable, 1)} × $18 = {money(calc.payout)}.
                </p>
              ) : null}
            </div>
            <div className="overflow-hidden rounded-[24px] bg-[#0A1931] p-5 text-white sm:p-7 shadow-[0_16px_40px_rgba(10,25,49,0.25)]">
              <div className="flex items-center justify-between">
                <p className="font-mono2 text-xs font-bold tracking-[0.16em] text-[#8FFF4A]">LIVE RESULT</p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold capitalize">
                  {scenario} scenario
                </span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Sellable / user</p>
                  <p className="font-mono2 mt-2 text-2xl font-extrabold">{calc.sellable.toFixed(1)} hrs</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Revenue / user</p>
                  <p className="font-mono2 mt-2 text-2xl font-extrabold">{money2(calc.revPer)}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Payout / user</p>
                  <p className="font-mono2 mt-2 text-2xl font-extrabold">{money2(calc.payPer)}</p>
                </div>
                <div className="rounded-2xl bg-[#8FFF4A] p-4 text-[#0A1931]">
                  <p className="text-xs font-bold">Gross / user</p>
                  <p className="font-mono2 mt-2 text-2xl font-extrabold">{money2(calc.grossPer)}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 border-t border-white/15 pt-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Total revenue</span>
                  <strong className="font-mono2">{money(calc.revenue)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total payout</span>
                  <strong className="font-mono2">{money(calc.payout)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Existing +20% uplift</span>
                  <strong className="font-mono2 text-[#00E5C0]">+{money(calc.uplift)}</strong>
                </div>
                <div className="flex justify-between border-t border-white/15 pt-3 text-base">
                  <span>Gross to platform</span>
                  <strong className="font-mono2 text-[#8FFF4A]">{money(calc.gross)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>With uplift</span>
                  <strong className="font-mono2">{money(calc.revenue + calc.uplift)}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PER USER MATH */}
        <section id="model" className="mt-14 scroll-mt-28">
          <SectionHead
            kicker="01 · PER USER MATH"
            title="The 36-hour journey"
            sub="One person, three months, three hours a week. The model does not need virality — it needs completed, approved work."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                n: '36 hrs',
                l: 'RAW TIME',
                d: '3 hrs/week × 12 weeks. Filming real professional work.',
                i: <Clock3 />,
              },
              {
                n: '30.6 hrs',
                l: 'SELLABLE TIME',
                d: '36 hrs × 85% approval. Quality is the gate.',
                i: <BadgeCheck />,
              },
              {
                n: '$550.80',
                l: 'LIABILITY / USER',
                d: '30.6 hrs × $18/hr paid to the pro.',
                i: <HandCoins />,
              },
              {
                n: '$1,836',
                l: 'BASE REVENUE / USER',
                d: '30.6 hrs × $60/hr. Platform gross: $1,285.20.',
                i: <CircleDollarSign />,
              },
              {
                n: '$1,009.80',
                l: 'CONSERVATIVE / USER',
                d: '30.6 hrs × $33/hr. Platform gross: $459.00.',
                i: <Calculator />,
              },
              {
                n: '3.33× / 1.83×',
                l: 'RATIO VS PAYOUT',
                d: 'Base 3.33× · Conservative 1.83× the payout.',
                i: <Scale />,
              },
            ].map((x) => (
              <article
                key={x.l}
                className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 shadow-[0_12px_32px_rgba(10,25,49,0.08)]"
              >
                <div className="flex items-center justify-between text-[#1A7CFF]">
                  {x.i}
                  <span className="font-mono2 text-[11px] font-bold tracking-widest text-[#5B6470]">{x.l}</span>
                </div>
                <p className="font-display mt-5 text-3xl font-extrabold text-[#0A1931]">{x.n}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#5B6470]">{x.d}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#FFF3D6] p-5 sm:p-6">
              <p className="font-display text-xl font-extrabold text-[#0A1931]">Old model: chores at $3/hr</p>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6470]">
                Low-trust, low-skill tasks compete on price and disappear. The work is interchangeable.
              </p>
              <p className="mt-4 font-display text-xl font-extrabold text-[#0A1931]">
                New model: professional work at $60/hr
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6470]">
                The buyer is buying skill, judgement, tools, and context — not just minutes.
              </p>
            </div>
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 sm:p-6 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
              <p className="font-mono2 text-xs font-bold tracking-widest text-[#1A7CFF]">WHY THE UPLIFT?</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#0A1931]">
                {[
                  'Professional work — tailor, mechanic, chef — not chores.',
                  'Rare African data + language premium.',
                  'Hands + tools + real work, in real environments.',
                  'Egocentric video shows process, not performance.',
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00A66B]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ENGINES */}
        <section id="engines" className="mt-14 scroll-mt-28">
          <SectionHead
            kicker="02 · FIVE REVENUE ENGINES"
            title="The pump model"
            sub="Dataset revenue is the core. Existing MyFaceProfile revenue sits on top — not mixed into the dataset maths."
          />
          <div className="overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#0A1931] text-white">
                  <tr>
                    <th className="px-4 py-4">Engine</th>
                    <th className="px-4 py-4">% of hours</th>
                    <th className="px-4 py-4">Price/hr</th>
                    <th className="px-4 py-4">Rev / user</th>
                    <th className="px-4 py-4">Total · 100 users</th>
                  </tr>
                </thead>
                <tbody>
                  {engines.map((e) => (
                    <tr key={e.name} className="border-t border-[#D4CBB8]">
                      <td className="px-4 py-4">
                        <strong className="text-[#0A1931]">
                          {e.n}. {e.name}
                        </strong>
                        <span className="block text-xs text-[#5B6470]">{e.why}</span>
                      </td>
                      <td className="px-4 py-4 font-mono2 font-bold text-[#0A1931]">{e.share}</td>
                      <td className="px-4 py-4 font-mono2 text-[#0A1931]">{e.price}</td>
                      <td className="px-4 py-4 font-mono2 font-bold text-[#0A1931]">{e.perUser}</td>
                      <td className="px-4 py-4 font-mono2 font-bold text-[#0A1931]">{e.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-[#0A1931] p-5 text-white">
              <p className="text-sm text-white/60">Dataset core per user</p>
              <p className="font-display mt-1 text-3xl font-extrabold">
                $1,836 <span className="text-base font-semibold text-white/60">base</span>
              </p>
            </div>
            <div className="rounded-[24px] bg-[#8FFF4A] p-5 text-[#0A1931]">
              <p className="text-sm font-bold">With existing uplift</p>
              <p className="font-display mt-1 text-3xl font-extrabold">
                $2,203 <span className="text-base font-semibold">$1,836 + $367</span>
              </p>
              <p className="mt-1 text-sm">
                Existing = +20% on dataset revenue. Keep it visible, keep it separate.
              </p>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section id="timeline" className="mt-14 scroll-mt-28">
          <SectionHead
            kicker="03 · 3-MONTH SPACE TIME"
            title="100 → 1,000, in three moves"
            sub="Cohort size changes each month. Hours, revenue, payout, and gross scale with it — and so does the float."
          />
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Month">
            {months.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={month === m.id}
                onClick={() => setMonth(m.id)}
                className={`rounded-full px-5 py-3 text-sm font-bold ${
                  month === m.id
                    ? 'bg-[#0A1931] text-white'
                    : 'border border-[#D4CBB8] bg-[#FFFDF7] text-[#0A1931]'
                }`}
              >
                {m.label} · {fmt(m.users)} users
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 sm:p-6 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono2 text-xs font-bold tracking-widest text-[#1A7CFF]">
                    {activeMonth.label.toUpperCase()}
                  </p>
                  <h3 className="font-display mt-2 text-3xl font-extrabold text-[#0A1931]">
                    {fmt(activeMonth.users)} active users
                  </h3>
                  <p className="mt-2 text-sm text-[#5B6470]">{activeMonth.focus}</p>
                </div>
                <span className="rounded-full bg-[#EEF4FF] px-3 py-1.5 text-xs font-bold text-[#0A1931]">
                  {fmt(activeMonth.sellable)} sellable hrs
                </span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#E8DFCC] p-4">
                  <p className="text-xs text-[#5B6470]">Raw hours</p>
                  <p className="font-mono2 mt-1 text-xl font-extrabold text-[#0A1931]">
                    {fmt(activeMonth.raw)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#E8DFCC] p-4">
                  <p className="text-xs text-[#5B6470]">Revenue base</p>
                  <p className="font-mono2 mt-1 text-xl font-extrabold text-[#0A1931]">
                    {money(activeMonth.base)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#E8DFCC] p-4">
                  <p className="text-xs text-[#5B6470]">Revenue cons.</p>
                  <p className="font-mono2 mt-1 text-xl font-extrabold text-[#0A1931]">
                    {money(activeMonth.cons)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FFF3D6] p-4">
                  <p className="text-xs text-[#0A1931]">Payout $18</p>
                  <p className="font-mono2 mt-1 text-xl font-extrabold text-[#0A1931]">
                    {money(activeMonth.payout)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#E7FFF3] p-4">
                  <p className="text-xs text-[#0A1931]">Gross base</p>
                  <p className="font-mono2 mt-1 text-xl font-extrabold text-[#0A1931]">
                    {money(activeMonth.grossBase)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#E7FFF3] p-4">
                  <p className="text-xs text-[#0A1931]">Gross cons.</p>
                  <p className="font-mono2 mt-1 text-xl font-extrabold text-[#0A1931]">
                    {money(activeMonth.grossCons)}
                  </p>
                </div>
              </div>
              <p className="mt-5 rounded-xl bg-[#E8DFCC] px-4 py-3 text-sm text-[#0A1931]">
                {activeMonth.note}
              </p>
            </div>
            <div className="rounded-[24px] bg-[#0A1931] p-5 text-white sm:p-6">
              <CalendarDays className="h-7 w-7 text-[#8FFF4A]" />
              <p className="font-display mt-4 text-2xl font-bold">Month 1 cash is the test</p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Troveo cash lands after a 4–5 month hold. Month 1 shows $0 landed from that route, plus
                $18,360 from the Mercor bi-weekly portion. The model works only if fast cash and slow cash
                are planned together.
              </p>
              <div className="mt-5 border-t border-white/15 pt-4">
                <p className="font-mono2 text-xs tracking-widest text-white/50">IF RESALE 2× · 3 MONTHS</p>
                <p className="font-display mt-2 text-3xl font-extrabold text-[#8FFF4A]">$1,713,600</p>
                <p className="text-sm text-white/70">Revenue base · Gross $1,456,560 · payout stays 1×</p>
              </div>
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-xs sm:text-sm">
                <thead className="bg-[#0A1931] text-white">
                  <tr>
                    <th className="px-3 py-3">Month</th>
                    <th className="px-3 py-3">Users</th>
                    <th className="px-3 py-3">Raw</th>
                    <th className="px-3 py-3">Sellable</th>
                    <th className="px-3 py-3">Rev base</th>
                    <th className="px-3 py-3">Rev cons</th>
                    <th className="px-3 py-3">Payout</th>
                    <th className="px-3 py-3">Gross base</th>
                    <th className="px-3 py-3">Gross cons</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...months,
                    {
                      id: 0,
                      label: 'TOTAL 3 MONTHS',
                      users: 1400,
                      raw: 16800,
                      sellable: 14280,
                      base: 856800,
                      cons: 471240,
                      payout: 257040,
                      grossBase: 599760,
                      grossCons: 214200,
                    },
                  ].map((m) => (
                    <tr
                      key={m.label}
                      className={`border-t border-[#D4CBB8] ${m.id === 0 ? 'bg-[#E8DFCC] font-bold' : ''}`}
                    >
                      <td className="px-3 py-3 font-bold text-[#0A1931]">{m.label}</td>
                      <td className="px-3 py-3 font-mono2 text-[#0A1931]">{fmt(m.users)}</td>
                      <td className="px-3 py-3 font-mono2 text-[#0A1931]">{fmt(m.raw)}</td>
                      <td className="px-3 py-3 font-mono2 text-[#0A1931]">{fmt(m.sellable)}</td>
                      <td className="px-3 py-3 font-mono2 text-[#0A1931]">{money(m.base)}</td>
                      <td className="px-3 py-3 font-mono2 text-[#0A1931]">{money(m.cons)}</td>
                      <td className="px-3 py-3 font-mono2 text-[#0A1931]">{money(m.payout)}</td>
                      <td className="px-3 py-3 font-mono2 text-[#0A1931]">{money(m.grossBase)}</td>
                      <td className="px-3 py-3 font-mono2 text-[#0A1931]">{money(m.grossCons)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#5B6470]">
            Total users shown as 1,400 user-months across the three months.
          </p>
        </section>

        {/* WALLET */}
        <section id="wallet" className="mt-14 scroll-mt-28">
          <SectionHead
            kicker="04 · WALLET FLOW + FLOAT"
            title="Pay weekly. Get paid in 30–120 days."
            sub="The economics can be right and the cash flow still break the model. Float is the operating problem to solve first."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 sm:p-6 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
              <p className="font-display text-lg font-extrabold text-[#0A1931]">Pro side · fast</p>
              <div className="mt-5 space-y-0">
                {[
                  'Pro films',
                  'Quality check',
                  'Approved',
                  'Wallet credited $18/hr',
                  'Withdraw Mon · min £5 / ₦5,000',
                ].map((s, i) => (
                  <div key={s} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0A1931] font-mono2 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      {i < 4 ? <span className="h-5 w-px bg-[#D4CBB8]" /> : null}
                    </div>
                    <p className="pb-5 pt-1 text-sm font-semibold text-[#0A1931]">{s}</p>
                  </div>
                ))}
              </div>
              <p className="rounded-xl bg-[#E8DFCC] px-3 py-2.5 text-sm text-[#0A1931]">
                Via Opay / PalmPay / M-Pesa / Stripe
              </p>
            </div>
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 sm:p-6 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
              <p className="font-display text-lg font-extrabold text-[#0A1931]">Lab side · slow</p>
              <div className="mt-5 space-y-4">
                {[
                  ['Lab buys', 'Invoice issued'],
                  [
                    'Lab pays in 30–120 days',
                    'Troveo up to 4–5 months · Mercor bi-weekly · Defined.ai quote',
                  ],
                ].map(([a, b]) => (
                  <div key={a} className="rounded-2xl border border-[#D4CBB8] bg-[#FFFDF7] p-4">
                    <p className="font-bold text-[#0A1931]">{a}</p>
                    <p className="mt-1 text-sm text-[#5B6470]">{b}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-[#E7FFF3] p-3">
                  <p className="font-mono2 font-extrabold text-[#0A1931]">M1</p>
                  <p className="text-xs text-[#5B6470]">$18,360 front</p>
                </div>
                <div className="rounded-xl bg-[#FFF3D6] p-3">
                  <p className="font-mono2 font-extrabold text-[#0A1931]">M2</p>
                  <p className="text-xs text-[#5B6470]">$55,080</p>
                </div>
                <div className="rounded-xl bg-[#FFE7E7] p-3">
                  <p className="font-mono2 font-extrabold text-[#0A1931]">M3</p>
                  <p className="text-xs text-[#5B6470]">$183,600</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-[#0A1931] p-5 text-white">
              <p className="font-mono2 text-xs tracking-widest text-[#8FFF4A]">TOTAL FLOAT IF YOU FRONT ALL</p>
              <p className="font-display mt-2 text-3xl font-extrabold">$257,040</p>
              <p className="mt-2 text-sm text-white/70">Weekly payout, 30–120 day receipts.</p>
            </div>
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5">
              <p className="font-display font-bold text-[#0A1931]">The split</p>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6470]">
                50% via Mercor bi-weekly fast cash + 50% via Troveo / Defined.ai slow cash + keep a 30%
                reserve.
              </p>
            </div>
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5">
              <p className="font-display font-bold text-[#0A1931]">Circuit breaker</p>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6470]">
                Daily cap · quality gate · KYC after 3 payouts. Stop before the float stops you.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 rounded-[24px] border-2 border-dashed border-[#1A7CFF] bg-[#EEF4FF] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono2 text-xs font-bold tracking-widest text-[#1A7CFF]">DAY 0 → DAY 90</p>
              <p className="font-display mt-1 text-xl font-extrabold text-[#0A1931]">
                Front $1,800 in week one for 100 users. Day 90 landed value: $856k base.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#0A1931] px-4 py-2 font-mono2 text-sm font-bold text-white">
              100 × $18 = $1,800
            </span>
          </div>
        </section>

        {/* EVOLUTION */}
        <section className="mt-14">
          <SectionHead
            kicker="05 · EVOLUTION"
            title="From chores to professional data"
            sub="The comparison is not just price. It is who the work needs, and how long the value lasts."
          />
          <div className="overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[#0A1931] text-white">
                  <tr>
                    <th className="px-4 py-4">Model</th>
                    <th className="px-4 py-4">Per user</th>
                    <th className="px-4 py-4">100 users</th>
                    <th className="px-4 py-4">Needs popularity?</th>
                    <th className="px-4 py-4">Durability</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#D4CBB8]">
                    <td className="px-4 py-4 font-bold text-[#0A1931]">Old Atlas Chores</td>
                    <td className="px-4 py-4 font-mono2 text-[#0A1931]">$3/hr</td>
                    <td className="px-4 py-4 font-mono2 text-[#0A1931]">$90 / 3mo</td>
                    <td className="px-4 py-4 text-[#0A1931]">No</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#FFE7E7] px-2.5 py-1 text-xs font-bold text-[#0A1931]">
                        Low
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-[#D4CBB8]">
                    <td className="px-4 py-4 font-bold text-[#0A1931]">Visaguide Yield Router</td>
                    <td className="px-4 py-4 font-mono2 text-[#0A1931]">£3,139 / 120k taps</td>
                    <td className="px-4 py-4 font-mono2 text-[#0A1931]">£313,900</td>
                    <td className="px-4 py-4 text-[#0A1931]">Yes</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#FFF3D6] px-2.5 py-1 text-xs font-bold text-[#0A1931]">
                        Medium
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-[#D4CBB8] bg-[#E7FFF3]">
                    <td className="px-4 py-4 font-bold text-[#0A1931]">MyFaceProfile Dataset</td>
                    <td className="px-4 py-4 font-mono2 text-[#0A1931]">$1,836 base / $1,009 cons</td>
                    <td className="px-4 py-4 font-mono2 text-[#0A1931]">$183,600 base / $100,980 cons</td>
                    <td className="px-4 py-4 text-[#0A1931]">No — needs real work</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#8FFF4A] px-2.5 py-1 text-xs font-bold text-[#0A1931]">
                        High · evergreen
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* BUYERS */}
        <section id="buyers" className="mt-14 scroll-mt-28">
          <SectionHead
            kicker="06 · TOP 3 BUYERS"
            title="Approach with pricing and pay terms"
            sub="Each buyer solves a different part of the model. Do not ask one buyer to solve all three."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {buyers.map((b) => (
              <article
                key={b.name}
                className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 shadow-[0_12px_32px_rgba(10,25,49,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-extrabold text-[#0A1931]">{b.name}</h3>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold text-[#0A1931]"
                    style={{ background: b.color + '33' }}
                  >
                    {b.use}
                  </span>
                </div>
                <p className="font-mono2 mt-4 text-lg font-extrabold text-[#0A1931]">{b.rate}</p>
                <p className="text-sm text-[#5B6470]">{b.hr}</p>
                <p className="mt-4 border-t border-[#D4CBB8] pt-4 text-sm leading-relaxed text-[#0A1931]">
                  {b.terms}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#0A1931]">{b.own}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-[24px] bg-[#0A1931] p-5 text-white sm:p-6">
            <p className="font-mono2 text-xs font-bold tracking-widest text-[#8FFF4A]">
              WHICH TO USE FOR WHAT
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <p>
                <strong>Troveo</strong>
                <br />
                <span className="text-white/70 text-sm">Volume. Non-exclusive licensing, resale upside.</span>
              </p>
              <p>
                <strong>Mercor</strong>
                <br />
                <span className="text-white/70 text-sm">
                  Cash flow. Bi-weekly receipts fund weekly payout.
                </span>
              </p>
              <p>
                <strong>Defined.ai</strong>
                <br />
                <span className="text-white/70 text-sm">
                  Premium. Custom, longer films at the top rate.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* REGISTRATION */}
        <section className="mt-14">
          <SectionHead
            kicker="07 · REGISTRATION + APPROACH"
            title="Register before you approach"
            sub="Buyers need a clean legal and consent trail. Build it before the first sample pack leaves."
          />
          <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 sm:p-6 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
              <p className="flex items-center gap-2 font-display text-lg font-extrabold text-[#0A1931]">
                <FileCheck2 className="h-5 w-5 text-[#1A7CFF]" /> Registration checklist
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  'UK Ltd',
                  'SIC 62012 + 63110',
                  'ICO registration',
                  'Creator Licence Agreement',
                  'Consent Form — GDPR + NDPC',
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 rounded-2xl bg-[#E8DFCC] px-4 py-3 text-sm font-semibold text-[#0A1931]"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#8FFF4A]">
                      <Check className="h-4 w-4 text-[#0A1931]" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-2xl bg-[#EEF4FF] p-4">
                <p className="text-xs font-bold tracking-widest text-[#1A7CFF]">CATEGORY</p>
                <p className="mt-1 font-bold text-[#0A1931]">Data Supplier / Dataset Licensor</p>
                <p className="text-sm text-[#5B6470]">Physical AI / Egocentric Work Video</p>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#0A1931] p-5 text-white sm:p-6">
              <p className="flex items-center gap-2 font-display text-lg font-extrabold">
                <Play className="h-5 w-5 text-[#8FFF4A]" /> 10-hour sample pack
              </p>
              <p className="mt-2 text-sm text-white/70">
                2 hours per trade. Enough to prove quality, consent, framing, and language coverage.
              </p>
              <div className="mt-6 space-y-3">
                {(
                  [
                    ['Day 1', 'Troveo', '#8FFF4A'],
                    ['Day 2', 'Mercor', '#1A7CFF'],
                    ['Day 3', 'Defined.ai', '#FF8A00'],
                  ] as const
                ).map(([d, n, c]) => (
                  <div
                    key={n}
                    className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3"
                  >
                    <span className="font-mono2 text-sm font-bold" style={{ color: c }}>
                      {d}
                    </span>
                    <span className="font-bold">{n}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-sm">
                Send the same pack. Compare terms, speed, and quality feedback — not just headline rate.
              </p>
            </div>
          </div>
        </section>

        {/* CTA + FOOTER */}
        <section className="mt-14 overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7]">
          <div className="revenue-gradient-bar h-2" />
          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#0A1931]" />
                <h2 className="font-display text-2xl font-extrabold text-[#0A1931]">What this is / isn’t</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#5B6470]">
                This is a calculation scenario using 2026 published rates as inputs — not a forecast. It
                assumes 85% approval, $60 base / $33 conservative buyer pricing, $18 payout, and 3 hrs/week
                per user. It is not a guarantee. A circuit breaker is required.
              </p>
              <p className="mt-4 flex flex-wrap gap-2">
                {['Troveo', 'Mercor', 'Defined.ai', 'Scale AI'].map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1.5 text-xs font-bold text-[#0A1931]"
                  >
                    Source · {s}
                  </span>
                ))}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/video-to-cash"
                  className="inline-flex h-11 items-center rounded-full bg-[#FFC300] px-5 text-sm font-extrabold text-[#0A1931]"
                >
                  Open Video → Cash →
                </Link>
                <Link
                  to="/go-live-expenditure"
                  className="inline-flex h-11 items-center rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-5 text-sm font-bold text-[#0A1931]"
                >
                  Go Live Expenditure
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex h-11 items-center rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-5 text-sm font-bold text-[#0A1931]"
                >
                  Pricing · MFC
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex h-11 items-center rounded-full bg-[#0A1931] px-5 text-sm font-extrabold text-white"
                >
                  Start showing — free
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-[#F0E9DB] border border-[#D4CBB8] p-5">
              <p className="flex items-center gap-2 font-bold text-[#0A1931]">
                <Lock className="h-4 w-4" /> Decision guardrails
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[#5B6470]">
                <li>• Do not front payout beyond the reserve.</li>
                <li>• Do not promise buyers hours before approval.</li>
                <li>• Keep consent, licence, and payout records clean.</li>
              </ul>
              <p className="mt-4 font-mono2 text-xs leading-relaxed text-[#5B6470]">
                BASE $856,800 · CONS $471,240 · GROSS BASE $599,760 · GROSS CONS $214,200 · BEFORE RESALE
              </p>
            </div>
          </div>
          <div className="border-t border-[#D4CBB8] px-5 py-4 sm:px-8">
            <p className="text-xs text-[#5B6470]">
              MyFaceProfile · Revenue Model · 100 users → 1,000 users · 3 months. Calculation scenario, not
              a forecast.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
