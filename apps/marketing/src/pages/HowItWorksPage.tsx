import { useEffect, useRef, useState } from 'react';
import logoM from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoWord from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";

type LoopNode = {
  id: string;
  label: string;
  sub: string;
  desc: string;
  example: string;
  metric: string;
  gradient: string;
  pos: { x: number; y: number };
  posMobile: { order: number };
};

const LOOP_NODES: LoopNode[] = [
  {
    id: "work",
    label: "WORK",
    sub: "You do real work",
    desc: "Tailor sews dress, mechanic fixes Toyota, builder lays bricks. Raw, unfiltered, valuable.",
    example: "Aisha sewing • 7:42AM • Workshop",
    metric: "1 project = 3 assets",
    gradient: "from-[#8FFF4A] to-[#00E5C0]",
    pos: { x: 50, y: 8 },
    posMobile: { order: 0 },
  },
  {
    id: "content",
    label: "CONTENT",
    sub: "Work auto-becomes content",
    desc: "WorkCut turns raw workshop clip into 3 viral clips. No editing skills. Timeline + Live Studio.",
    example: "WorkCut: Before/After • Auto-trim • Template 04",
    metric: "11 sec → viral",
    gradient: "from-[#00E5C0] to-[#7CFF6A]",
    pos: { x: 86, y: 32 },
    posMobile: { order: 1 },
  },
  {
    id: "discovery",
    label: "DISCOVERY",
    sub: "Content becomes discovery",
    desc: "Work Feed shows it to 500 people within 10mi searching 'tailor near me' — not followers.",
    example: "Work Feed • 0.8mi away • Trust Badges > Likes",
    metric: "500 reach • 10mi",
    gradient: "from-[#FFE600] to-[#FFD600]",
    pos: { x: 78, y: 78 },
    posMobile: { order: 2 },
  },
  {
    id: "trust",
    label: "TRUST",
    sub: "Discovery becomes trust",
    desc: "Verified jobs, before/after, milestones, team, TrustScore 4.9. No fake reviews. Proof > Promise.",
    example: "Project Detail • Milestones • Team • 4.9 TrustScore",
    metric: "TrustScore 4.9/5",
    gradient: "from-[#FFE600] to-[#FF8A00]",
    pos: { x: 22, y: 78 },
    posMobile: { order: 3 },
  },
  {
    id: "commerce",
    label: "COMMERCE",
    sub: "Trust becomes commerce",
    desc: "Book, Shop physical, Gift MFC Crown. Escrow 10%, Shop 5%, Gifts 30%. Money moves when work is done.",
    example: "Booking + Shop + Gift Crown animation • Escrow protected",
    metric: "$2.4k avg order",
    gradient: "from-[#FF8A00] to-[#8FFF4A]",
    pos: { x: 14, y: 32 },
    posMobile: { order: 4 },
  },
];

const DEEP_DIVE = [
  {
    k: "01",
    title: "SHOW Your Work",
    headline: "Phone recording becomes Project OS",
    desc: "Start with what you already do. Hit record in workshop. Our Timeline turns it into a Project object with milestones, team, location, and before/after automatically.",
    features: ["Timeline — drag-drop milestones", "Live Studio — multi-cam workshop", "WorkCut templates — Before/After, Process, Reveal"],
    visual: "SHOW",
    cta: "See Aisha's workflow",
  },
  {
    k: "02",
    title: "CONTENT Becomes Discovery",
    headline: "Trust badges, not likes",
    desc: "We don't optimize for dopamine. We optimize for proximity + proof. Your work appears to 500 people searching within 10 miles. AI Findy Bot answers 'who can fix this?'",
    features: ["Work Feed — chronological by proximity", "Nearby — map + list, no algorithm tax", "AI Findy Bot — natural search 'tailor who sews Ankara'"],
    visual: "DISCOVERY",
    cta: "Open Work Feed demo",
  },
  {
    k: "03",
    title: "DISCOVERY Becomes Trust",
    headline: "Verified. Not viral.",
    desc: "Every job is a Project with verifiable artifacts: photos, team who worked, time spent, materials, client check-ins. Trust Ledger is immutable. No pay-to-play reviews.",
    features: ["Project object — the atomic unit of Work Graph", "Verified reviews — only after escrow release", "Trust Ledger — on-chain proof of work"],
    visual: "TRUST",
    cta: "Inspect Project #2491",
  },
  {
    k: "04",
    title: "TRUST Becomes Commerce",
    headline: "Three rails. One checkout.",
    desc: "Book service (escrow 10%), Shop physical products (5%), Gift MFC Crowns (30% take). All native. No Stripe dashboard needed. Money only releases when client marks done.",
    features: ["Escrow — 10% to start, 90% on approval", "Shop — inventory from your work", "MFC Gifts — fans fund your next project"],
    visual: "COMMERCE",
    cta: "View checkout flow",
  },
  {
    k: "05",
    title: "COMMERCE Becomes New Work",
    headline: "Pipeline that feeds itself",
    desc: "Completed job → auto-generated case study → repeat customer discount → referral credit → UPRM Orchestrator schedules next availability. Loop closed.",
    features: ["UPRM Orchestrator — availability + pricing auto-adjusts", "Repeat engine — 43% return rate", "Referral graph — work begets work"],
    visual: "REPEAT",
    cta: "See Kanban pipeline",
  },
];

export default function HowItWorksPage() {
  const [activeNode, setActiveNode] = useState<string>("work");
  const [mobileMenu, setMobileMenu] = useState(false);
  const loopRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisibleRows((prev) => new Set(prev).add((e.target as HTMLElement).dataset.row || ""));
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll("[data-row]").forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const activeData = LOOP_NODES.find((n) => n.id === activeNode) || LOOP_NODES[0];

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-[#FFFDF7] text-[#0A0A0A] overflow-x-clip selection:bg-[#FFC300]/35"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }}
    >
      {/* GRID + VIGNETTE */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-[0.35]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] m-glow opacity-60" />
      </div>

      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 border-b border-[#D4CBB8] backdrop-blur-[22px] bg-[#FFFDF7]/90"
        style={{ top: "var(--safe-area-inset-top)" }}
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-[36px] h-[36px] rounded-[10px] overflow-hidden bg-white flex items-center justify-center">
                <img src={logoM} alt="M" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <img src={logoWord} alt="My Face Profile" className="h-[22px] w-auto object-contain invert brightness-[10]" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#5B6470] ml-2 mt-1">No.2 / 24</span>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-1 text-[13px]">
              {[
                { l: "Home", href: "#", active: false },
                { l: "How It Works", href: "#how", active: true },
                { l: "Work OS", href: "#workos" },
                { l: "Projects", href: "#projects" },
                { l: "Pricing", href: "#pricing" },
              ].map((item) => (
                <a
                  key={item.l}
                  href={item.href}
                  className={`px-4 py-2 rounded-full transition ${item.active ? "bg-white text-black font-[600]" : "text-[#5B6470] hover:text-[#0A1931] hover:bg-[#F0E9DB]"}`}
                >
                  {item.l}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#cta"
              className="hidden md:inline-flex h-[36px] px-5 rounded-full items-center justify-center text-[13px] font-[700] text-black"
              style={{ background: "var(--gradient-m)" }}
            >
              Join as Pro →
            </a>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden w-9 h-9 rounded-full bg-[#F0E9DB] grid place-items-center">
              <div className="w-4 h-[10px] flex flex-col justify-between">
                <span className="h-[1.5px] bg-white w-full" />
                <span className="h-[1.5px] bg-white w-full" />
                <span className="h-[1.5px] bg-white w-2/3" />
              </div>
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="lg:hidden border-t border-[#D4CBB8] px-5 py-4 flex flex-col gap-2 bg-[#F0E9DB]">
            {["Home", "How It Works", "Work OS", "Projects", "Pricing"].map((l) => (
              <a key={l} className="py-2 text-[15px] text-[#5B6470]" href="#">
                {l}
              </a>
            ))}
            <a href="#cta" className="mt-2 h-[44px] rounded-full grid place-items-center font-bold text-black" style={{ background: "var(--gradient-m)" }}>
              Join as Pro
            </a>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* HERO MINI */}
        <section className="mx-auto max-w-[1280px] px-5 md:px-8 pt-16 md:pt-24 pb-10">
          <div className="max-w-[980px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] font-mono text-[10px] tracking-[0.18em] text-[#5B6470] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />
              How It Works • The Work Graph • No.2 of 24
            </div>

            <h1 className="mt-6 font-display text-[34px] md:text-[64px] leading-[0.95] tracking-[-0.03em]">
              Work Is Content.
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-m)" }}>
                Content Is Discovery.
              </span>
              <br />
              Discovery Is Trust.
              <br />
              Trust Is Commerce.
            </h1>

            <p className="mt-6 text-[17px] md:text-[20px] leading-[1.4] text-[#5B6470] max-w-[680px]">
              Not another marketplace. An OS where your real work becomes your storefront. No ads. No followers tax. Just{" "}
              <span className="text-[#0A1931] font-medium">SHOW → CONNECT → GROW.</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-[13px] font-mono text-[#5B6470]">
                <span className="w-6 h-6 rounded-full bg-white text-black grid place-items-center text-[11px] font-bold">1</span> Built for tailors, mechanics, builders, chefs
              </div>
              <div className="h-6 w-px bg-[#F0E9DB] hidden md:block" />
              <div className="flex items-center gap-2 text-[13px] font-mono text-[#5B6470]">
                <span className="w-6 h-6 rounded-full bg-[#8FFF4A] text-black grid place-items-center text-[11px] font-bold">↗</span> Work Graph = 4.9 avg TrustScore
              </div>
            </div>
          </div>
        </section>

        {/* LOOP SECTION */}
        <section ref={loopRef} className="relative mx-auto max-w-[1280px] px-5 md:px-8 pb-20 md:pb-28">
          {/* Glow behind */}
          <div className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[120px] opacity-30" style={{ background: "radial-gradient(40% 40% at 50% 50%, #8FFF4A 0%, #00E5C0 35%, #FFE600 60%, transparent 75%)" }} />

          {/* DESKTOP LOOP */}
          <div className="hidden lg:block relative w-full aspect-[1280/760] max-h-[760px] mt-4">
            {/* SVG Path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1280 760" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="loopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8FFF4A" />
                  <stop offset="35%" stopColor="#00E5C0" />
                  <stop offset="68%" stopColor="#FFE600" />
                  <stop offset="100%" stopColor="#FF8A00" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* main loop figure-8ish */}
              <path
                d="M640 80 C 980 120, 1050 360, 860 520 C 720 620, 560 620, 420 520 C 210 360, 300 120, 640 80 Z M 640 80 C 600 220, 560 420, 640 680 C 720 420, 680 220, 640 80"
                stroke="url(#loopGrad)"
                strokeWidth="1.5"
                strokeDasharray="12 14"
                strokeLinecap="round"
                opacity="0.9"
                style={{ animation: "flowDash 2.4s linear infinite" }}
              />
              <path
                d="M640 80 C 980 120, 1050 360, 860 520 C 720 620, 560 620, 420 520 C 210 360, 300 120, 640 80 Z"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                fill="none"
              />
              {/* particles */}
              <g>
                {[0, 0.25, 0.5, 0.75].map((off) => (
                  <circle key={off} r="4" fill="#8FFF4A" opacity="0.9">
                    <animateMotion dur="6s" repeatCount="indefinite" begin={`${off * 1.5}s`} path="M640 80 C 980 120, 1050 360, 860 520 C 720 620, 560 620, 420 520 C 210 360, 300 120, 640 80 Z" />
                  </circle>
                ))}
              </g>
            </svg>

            {/* Nodes positioned */}
            {LOOP_NODES.map((node) => (
              <button
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                onMouseEnter={() => setActiveNode(node.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group text-left"
                style={{ left: `${node.pos.x}%`, top: `${node.pos.y}%` }}
              >
                <div
                  className={`relative w-[228px] rounded-[20px] p-[1px] transition-all duration-500 ${activeNode === node.id ? "scale-[1.06]" : "scale-100 opacity-80 hover:opacity-100"}`}
                  style={{ background: activeNode === node.id ? "var(--gradient-m)" : "rgba(255,255,255,0.12)" }}
                >
                  <div className="rounded-[19px] glass-strong p-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-full grid place-items-center text-[13px] font-black text-black bg-gradient-to-br ${node.gradient}`}>{node.label[0]}</div>
                      <span className="font-mono text-[10px] tracking-widest text-[#5B6470]">{LOOP_NODES.findIndex((n) => n.id === node.id) + 1 < 10 ? `0${LOOP_NODES.findIndex((n) => n.id === node.id) + 1}` : LOOP_NODES.findIndex((n) => n.id === node.id) + 1}</span>
                    </div>
                    <div className="mt-3">
                      <div className="font-[800] text-[15px] tracking-[-0.01em]">{node.label}</div>
                      <div className="mt-1 font-mono text-[11px] leading-[1.3] text-[#5B6470]">{node.sub}</div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-[2px] flex-1 rounded-full" style={{ background: "var(--gradient-m)" }} />
                      <span className="font-mono text-[10px] text-[#5B6470]">{node.metric}</span>
                    </div>
                  </div>
                </div>
                {activeNode === node.id && <div className="absolute -inset-2 -z-10 rounded-[24px] blur-[18px] opacity-30" style={{ background: "var(--gradient-m)" }} />}
              </button>
            ))}

            {/* Center detail card */}
            <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[360px]">
              <div className="rounded-[24px] p-[1px]" style={{ background: "var(--gradient-m)" }}>
                <div className="rounded-[23px] bg-[#0F0F0F] p-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full grid place-items-center font-black text-black bg-gradient-to-br ${activeData.gradient}`}>{activeData.label[0]}</div>
                    <div>
                      <div className="text-[13px] font-mono tracking-widest text-[#5B6470]">NOW SHOWING</div>
                      <div className="font-[800] text-[18px] -mt-1">{activeData.label} →</div>
                    </div>
                    <div className="ml-auto w-7 h-7 rounded-full bg-white text-black grid place-items-center text-[12px]">↗</div>
                  </div>
                  <p className="mt-4 text-[14px] leading-[1.5] text-[#5B6470]">{activeData.desc}</p>
                  <div className="mt-4 rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-black grid place-items-center overflow-hidden">
                      <div className="w-full h-full" style={{ background: "var(--gradient-m)", opacity: 0.8 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[11px] text-[#5B6470] truncate">{activeData.example}</div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-[#F0E9DB] overflow-hidden">
                        <div className="h-full w-[72%] rounded-full" style={{ background: "var(--gradient-m)" }} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-white text-black text-[11px] font-bold">LIVE</span>
                    <span className="px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[11px] font-mono text-[#5B6470]">{activeData.metric}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center font-mono text-[10px] tracking-[0.2em] text-white/25">WORK → CONTENT → DISCOVERY → TRUST → COMMERCE → REPEAT</div>
            </div>
          </div>

          {/* MOBILE LOOP — vertical stack */}
          <div className="lg:hidden relative mt-8">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#8FFF4A] via-[#FFE600] to-[#FF8A00] opacity-60" />
            <div className="flex flex-col gap-6">
              {LOOP_NODES.sort((a, b) => a.posMobile.order - b.posMobile.order).map((node, i) => (
                <div key={node.id} className="relative pl-14">
                  <div className="absolute left-[18px] top-6 w-[18px] h-[18px] rounded-full border-2 border-[#050505] bg-[#8FFF4A] grid place-items-center shadow-[0_0_0_6px_rgba(143,255,74,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  </div>
                  {i !== LOOP_NODES.length - 1 && <div className="absolute left-[26px] top-[42px] w-px h-[calc(100%+24px)] bg-[#F0E9DB]" />}
                  <button onClick={() => setActiveNode(node.id)} className="w-full text-left">
                    <div className={`rounded-[20px] p-[1px] ${activeNode === node.id ? "" : "opacity-90"}`} style={{ background: activeNode === node.id ? "var(--gradient-m)" : "rgba(255,255,255,0.1)" }}>
                      <div className="rounded-[19px] glass p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full grid place-items-center font-black text-black bg-gradient-to-br ${node.gradient}`}>{node.label[0]}</div>
                            <div>
                              <div className="font-bold text-[14px]">{node.label}</div>
                              <div className="font-mono text-[11px] text-[#5B6470]">{node.sub}</div>
                            </div>
                          </div>
                          <span className="font-mono text-[11px] text-[#5B6470]">0{i + 1}</span>
                        </div>
                        {activeNode === node.id && (
                          <div className="mt-3 pt-3 border-t border-[#D4CBB8]">
                            <p className="text-[13px] leading-[1.5] text-[#5B6470]">{node.desc}</p>
                            <div className="mt-3 rounded-xl bg-black/50 border border-[#D4CBB8] p-3">
                              <div className="font-mono text-[11px] text-[#5B6470]">{node.example}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
              <div className="pl-14">
                <div className="rounded-full h-10 px-4 inline-flex items-center gap-2 bg-white text-black font-bold text-[13px]">
                  ↺ Commerce → New Work <span className="font-mono text-[11px] opacity-60">LOOP CLOSED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loop explainer strip */}
          <div className="mt-10 lg:mt-4 mx-auto max-w-[980px] grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { t: "Not a marketplace", d: "Marketplaces rent attention. OS compounds proof." },
              { t: "Work = Storefront", d: "Your workshop feed is your SEO, portfolio, and shop in one." },
              { t: "Trust > Followers", d: "We rank proof of work, not engagement bait." },
            ].map((c) => (
              <div key={c.t} className="glass rounded-[16px] px-4 py-3 flex gap-3 items-start">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#8FFF4A] flex-shrink-0" />
                <div>
                  <div className="text-[13px] font-bold">{c.t}</div>
                  <div className="text-[12px] text-[#5B6470] leading-[1.4] mt-1">{c.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECOND SECTION — 5 Steps */}
        <section className="relative border-t border-[#D4CBB8] bg-[#080808]">
          <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-20 md:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
              <div>
                <div className="font-mono text-[11px] tracking-[0.2em] text-[#5B6470] uppercase">Deep Dive • 5 Steps</div>
                <h2 className="mt-3 font-display text-[32px] md:text-[52px] leading-[0.95] tracking-[-0.02em]">Every step is software.<br />Every software is proof.</h2>
              </div>
              <div className="font-mono text-[12px] text-[#5B6470] max-w-[320px]">Scroll. Each card drops in like a Linear issue — built for makers, not marketers.</div>
            </div>

            <div className="flex flex-col gap-20 md:gap-28">
              {DEEP_DIVE.map((row) => {
                const visible = visibleRows.has(row.k);
                return (
                  <div
                    key={row.k}
                    data-row={row.k}
                    className={`grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-10 items-center transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
                  >
                    {/* Visual */}
                    <div className="relative order-2 md:order-1">
                      <div className="rounded-[28px] p-[1px]" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))" }}>
                        <div className="rounded-[27px] bg-[#101010] overflow-hidden">
                          <div className="h-[320px] md:h-[420px] relative">
                            {/* fake UI */}
                            <div className="absolute inset-0 p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-[#F0E9DB]" />
                                  <div className="h-3 w-24 rounded-full bg-[#F0E9DB]" />
                                </div>
                                <div className="px-2 py-1 rounded-full bg-[#8FFF4A] text-black font-mono text-[10px] font-bold">LIVE • {row.visual}</div>
                              </div>

                              <div className="mt-8 grid grid-cols-12 gap-3 h-[260px]">
                                <div className="col-span-8 rounded-[18px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                                    <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                                    <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
                                    <span className="ml-2 font-mono text-[10px] text-[#5B6470]">{row.k} • {row.title}.studio</span>
                                  </div>
                                  {row.k === "01" && (
                                    <div className="space-y-3">
                                      <div className="h-[140px] rounded-[14px] bg-gradient-to-br from-[#8FFF4A]/20 to-[#00E5C0]/20 border border-[#D4CBB8] grid place-items-center">
                                        <div className="text-center">
                                          <div className="w-12 h-12 rounded-full mx-auto bg-white grid place-items-center text-black">▶</div>
                                          <div className="mt-2 font-mono text-[11px] text-[#5B6470]">Aisha_sowing_07:42.mp4</div>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        {["Timeline", "Live", "WorkCut"].map((b) => (
                                          <div key={b} className="px-3 py-1 rounded-full bg-[#F0E9DB] text-[11px] font-mono">{b}</div>
                                        ))}
                                      </div>
                                      <div className="h-2 w-full rounded-full bg-[#F0E9DB]">
                                        <div className="h-full w-[68%] rounded-full" style={{ background: "var(--gradient-m)" }} />
                                      </div>
                                    </div>
                                  )}
                                  {row.k === "02" && (
                                    <div className="space-y-2">
                                      {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-3 p-2 rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8]">
                                          <div className="w-12 h-12 rounded-[10px] bg-[#F0E9DB]" />
                                          <div className="flex-1">
                                            <div className="h-2 w-3/4 rounded-full bg-white/20" />
                                            <div className="mt-2 flex gap-2">
                                              <span className="px-2 py-0.5 rounded-full bg-[#8FFF4A]/20 text-[9px] font-mono text-[#8FFF4A]">0.8mi</span>
                                              <span className="px-2 py-0.5 rounded-full bg-[#F0E9DB] text-[9px] font-mono">Trust 4.9</span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {row.k === "03" && (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-3 gap-2">
                                        {["Before", "Process", "After"].map((s) => (
                                          <div key={s} className="rounded-[10px] bg-[#F0E9DB] border border-[#D4CBB8] p-2 text-center">
                                            <div className="h-12 rounded-[8px] bg-[#F0E9DB]" />
                                            <div className="mt-1 font-mono text-[9px] text-[#5B6470]">{s}</div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="rounded-[10px] bg-[#F0E9DB] p-2">
                                        <div className="font-mono text-[10px] text-[#5B6470]">MILESTONES • 4/5 verified</div>
                                        <div className="mt-2 flex gap-1">
                                          {[1, 1, 1, 1, 0].map((f, idx) => (
                                            <div key={idx} className={`h-1.5 flex-1 rounded-full ${f ? "bg-[#8FFF4A]" : "bg-[#F0E9DB]"}`} />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {row.k === "04" && (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-3 gap-2">
                                        {[
                                          { l: "Book", p: "$240", c: "from-[#8FFF4A] to-[#00E5C0]" },
                                          { l: "Shop", p: "$85", c: "from-[#FFE600] to-[#FF8A00]" },
                                          { l: "Gift", p: "MFC", c: "from-[#FF8A00] to-[#8FFF4A]" },
                                        ].map((b) => (
                                          <div key={b.l} className="rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 text-center">
                                            <div className={`w-8 h-8 mx-auto rounded-full bg-gradient-to-br ${b.c}`} />
                                            <div className="mt-2 font-bold text-[12px]">{b.l}</div>
                                            <div className="font-mono text-[11px] text-[#5B6470]">{b.p}</div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="rounded-[10px] bg-[#8FFF4A] text-black p-2 text-center font-bold text-[12px]">Escrow Protected • Pay after approval</div>
                                    </div>
                                  )}
                                  {row.k === "05" && (
                                    <div className="space-y-2">
                                      <div className="flex gap-2">
                                        {["Backlog", "In Progress", "Completed", "Repeat"].map((col, idx) => (
                                          <div key={col} className="flex-1 rounded-[10px] bg-[#F0E9DB] border border-[#D4CBB8] p-2">
                                            <div className="font-mono text-[9px] text-[#5B6470]">{col}</div>
                                            <div className={`mt-2 h-10 rounded-[8px] ${idx === 2 ? "bg-[#8FFF4A]/30" : "bg-[#F0E9DB]"}`} />
                                            <div className={`mt-1 h-6 rounded-[6px] ${idx === 1 ? "bg-[#FFE600]/30" : "bg-[#F0E9DB]"}`} />
                                          </div>
                                        ))}
                                      </div>
                                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#5B6470]">
                                        <span className="w-2 h-2 rounded-full bg-[#8FFF4A]" /> UPRM auto-schedules next slot
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="col-span-4 space-y-3">
                                  <div className="rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                                    <div className="font-mono text-[10px] text-[#5B6470]">FEATURES</div>
                                    <div className="mt-2 space-y-2">
                                      {row.features.map((f) => (
                                        <div key={f} className="text-[11px] leading-[1.3] text-[#5B6470] flex gap-2">
                                          <span className="text-[#8FFF4A]">•</span> {f}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="rounded-[14px] p-[1px]" style={{ background: "var(--gradient-m)" }}>
                                    <div className="rounded-[13px] bg-black px-3 py-2 flex items-center justify-between">
                                      <span className="font-mono text-[11px]">See example</span>
                                      <span className="w-6 h-6 rounded-full bg-white text-black grid place-items-center text-[12px]">↗</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="order-1 md:order-2">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white text-black grid place-items-center font-black text-[14px]">{row.k}</div>
                        <div className="h-px flex-1 bg-[#F0E9DB]" />
                        <div className="font-mono text-[11px] tracking-[0.2em] text-[#5B6470] uppercase">{row.title}</div>
                      </div>
                      <h3 className="mt-6 font-display text-[28px] md:text-[36px] leading-[0.95]">{row.headline}</h3>
                      <p className="mt-4 text-[15px] leading-[1.6] text-[#5B6470]">{row.desc}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {row.features.map((f) => (
                          <span key={f} className="px-3 py-1.5 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[12px] font-mono text-[#5B6470]">
                            {f.split("—")[0]}
                          </span>
                        ))}
                      </div>
                      <a href="#cta" className="mt-8 inline-flex items-center gap-2 px-5 h-11 rounded-full bg-white text-black font-bold text-[13px]">
                        {row.cta} <span>→</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* THIRD — Comparison */}
        <section className="relative mx-auto max-w-[1280px] px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-[760px] mx-auto text-center">
            <div className="inline-flex px-3 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] font-mono text-[10px] tracking-widest text-[#5B6470] uppercase">Old World vs Work Graph OS</div>
            <h2 className="mt-6 font-display text-[32px] md:text-[56px] leading-[0.9]">Everyone nailed one piece.<br />We connected the loop.</h2>
            <p className="mt-4 text-[#5B6470] text-[15px]">Instagram has content but no trust. Fiverr has service but no content. TikTok Shop has product but no work. We have the loop.</p>
          </div>

          <div className="mt-12 grid md:grid-cols-4 gap-4">
            {[
              { name: "Instagram", tag: "Content but no trust", bullets: ["Likes > proof", "Followers tax", "No escrow", "No work object"], accent: "border-[#D4CBB8] opacity-60" },
              { name: "Fiverr / Upwork", tag: "Service but no content", bullets: ["Text gigs", "No workshop feed", "Race to bottom", "20% take, no trust ledger"], accent: "border-[#D4CBB8] opacity-60" },
              { name: "TikTok Shop", tag: "Product but no work", bullets: ["Viral > verified", "No before/after", "No team, no milestones", "Product not person"], accent: "border-[#D4CBB8] opacity-60" },
              { name: "My Face Profile", tag: "Work → Content → Trust → Commerce", bullets: ["Work = content auto", "Discovery = proximity + proof", "Trust = verified ledger", "Commerce = escrow + shop + gifts"], accent: "border-[#8FFF4A]/50 bg-[#8FFF4A]/[0.04] ring-1 ring-[#8FFF4A]/20", highlight: true },
            ].map((c) => (
              <div key={c.name} className={`relative rounded-[24px] p-[1px] ${c.highlight ? "md:-mt-4 md:mb-4" : ""}`} style={{ background: c.highlight ? "var(--gradient-m)" : "rgba(255,255,255,0.08)" }}>
                <div className={`rounded-[23px] p-6 h-full ${c.highlight ? "bg-[#0C0C0C]" : "bg-[#F0E9DB]"} ${c.accent}`}>
                  {c.highlight && <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#8FFF4A] text-black font-mono text-[10px] font-bold">YOU ARE HERE • OS</div>}
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[16px]">{c.name}</div>
                    {c.highlight ? <div className="w-6 h-6 rounded-full bg-white text-black grid place-items-center text-[12px]">✓</div> : <div className="w-6 h-6 rounded-full bg-[#F0E9DB]" />}
                  </div>
                  <div className={`mt-2 inline-flex px-2.5 py-1 rounded-full text-[11px] font-mono ${c.highlight ? "bg-[#8FFF4A] text-black font-bold" : "bg-[#F0E9DB] text-[#5B6470]"}`}>{c.tag}</div>
                  <div className="mt-5 space-y-2.5">
                    {c.bullets.map((b) => (
                      <div key={b} className="flex gap-2 text-[13px] leading-[1.4] text-[#5B6470]">
                        <span className={`${c.highlight ? "text-[#8FFF4A]" : "text-[#5B6470]"}`}>—</span> {b}
                      </div>
                    ))}
                  </div>
                  {c.highlight && (
                    <div className="mt-6 rounded-[12px] bg-white text-black p-3 flex items-center justify-between">
                      <span className="font-bold text-[13px]">SHOW CONNECT GROW</span>
                      <span className="font-mono text-[11px]">Loop closed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOURTH — UPRM + Bots + Coins */}
        <section className="border-y border-[#D4CBB8] bg-[#F0E9DB]">
          <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-16 md:py-20">
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-1 rounded-full bg-white text-black font-mono text-[10px] font-bold tracking-widest">NEXT UP • No.3-5 of 24</span>
              <span className="px-3 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] font-mono text-[10px] tracking-widest text-[#5B6470]">THE OS LAYERS</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { k: "No.3", title: "UPRM Orchestrator", desc: "Availability, pricing, pipeline — auto-adjusts when you complete work. Your calendar becomes a market.", cta: "Meet UPRM →", grad: "from-[#8FFF4A] to-[#00E5C0]" },
                { k: "No.4", title: "Bots • Findy + WorkCut", desc: "AI that finds clients by intent, not keywords. And cuts your raw clips into viral proof.", cta: "See Bots in action →", grad: "from-[#00E5C0] to-[#FFE600]" },
                { k: "No.5", title: "Coins • MFC + Crown", desc: "Fans gift MFC to fund your next project. You keep 70%. Culture funds work.", cta: "Explore Coins →", grad: "from-[#FFE600] to-[#FF8A00]" },
              ].map((card) => (
                <a key={card.k} href="#cta" className="group relative rounded-[24px] p-[1px] hover:scale-[1.01] transition">
                  <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition" style={{ background: `linear-gradient(135deg, var(--lime), var(--orange))` }} />
                  <div className="relative rounded-[23px] bg-[#F0E9DB] p-6 h-full">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] tracking-widest text-[#5B6470]">{card.k}</span>
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${card.grad}`} />
                    </div>
                    <h4 className="mt-4 font-display text-[22px] leading-[1]">{card.title}</h4>
                    <p className="mt-3 text-[13px] leading-[1.5] text-[#5B6470]">{card.desc}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold">
                      {card.cta} <span className="w-6 h-6 rounded-full bg-white text-black grid place-items-center text-[12px] group-hover:translate-x-0.5 transition">↗</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section id="cta" className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "var(--gradient-m)", opacity: 0.12 }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]" />
          <div className="relative mx-auto max-w-[1280px] px-5 md:px-8 py-20 md:py-28">
            <div className="rounded-[32px] p-[1px]" style={{ background: "var(--gradient-m)" }}>
              <div className="rounded-[31px] bg-[#FFFDF7] p-8 md:p-14">
                <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-black font-mono text-[10px] font-bold tracking-widest">No.2 COMPLETE • LOOP REVEALED</div>
                    <h2 className="mt-6 font-display text-[36px] md:text-[60px] leading-[0.9] tracking-[-0.03em]">
                      Start showing
                      <br />
                      your work —
                      <br />
                      <span className="text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-m)" }}>
                        free.
                      </span>
                    </h2>
                    <p className="mt-5 text-[16px] leading-[1.5] text-[#5B6470] max-w-[520px]">
                      Join 2,400+ pros already turning workshop clips into bookings. No credit card. Your first Project becomes content in 11 seconds.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a href="#" className="h-[48px] px-7 rounded-full bg-white text-black font-bold text-[14px] grid place-items-center">
                        Create Your Work Profile →
                      </a>
                      <a href="#" className="h-[48px] px-6 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[#0A1931] font-mono text-[13px] grid place-items-center">
                        Watch 45-sec Loop Demo
                      </a>
                    </div>
                    <div className="mt-8 flex items-center gap-6">
                      <div className="flex -space-x-2">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-white/20 grid place-items-center text-[10px]">★</div>
                        ))}
                      </div>
                      <div className="font-mono text-[12px] text-[#5B6470]">
                        <span className="text-[#0A1931] font-bold">4.9/5 TrustScore</span> • 12k verified jobs
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[20px] bg-[#0F0F0F] border border-[#D4CBB8] p-5">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-[11px] tracking-widest text-[#5B6470]">APP COMING SOON</div>
                        <div className="px-2 py-1 rounded-full bg-[#8FFF4A] text-black font-mono text-[10px] font-bold">QR • SCAN TO JOIN WAITLIST</div>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-[14px] bg-white p-3">
                          <div className="h-[88px] rounded-[10px] bg-black grid place-items-center">
                            <div className="w-16 h-16 rounded-[6px] border-2 border-white grid place-items-center">
                              <div className="font-mono text-[8px] text-[#0A1931]">QR</div>
                            </div>
                          </div>
                          <div className="mt-2 text-center font-bold text-[11px] text-black">iOS Waitlist</div>
                        </div>
                        <div className="rounded-[14px] bg-white p-3">
                          <div className="h-[88px] rounded-[10px] bg-black grid place-items-center">
                            <div className="w-16 h-16 rounded-[6px] border-2 border-white grid place-items-center">
                              <div className="font-mono text-[8px] text-[#0A1931]">QR</div>
                            </div>
                          </div>
                          <div className="mt-2 text-center font-bold text-[11px] text-black">Android</div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <div className="flex-1 h-10 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] grid place-items-center font-mono text-[11px] text-[#5B6470]"> iOS TestFlight</div>
                        <div className="flex-1 h-10 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] grid place-items-center font-mono text-[11px] text-[#5B6470]">▶ Play Beta</div>
                      </div>
                    </div>

                    <div className="rounded-[20px] p-[1px]" style={{ background: "var(--gradient-m)" }}>
                      <div className="rounded-[19px] bg-[#0F0F0F] p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                          <img src={logoM} alt="M" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-[13px]">My Face Profile OS</div>
                          <div className="font-mono text-[11px] text-[#5B6470]">SHOW • CONNECT • GROW</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white text-black grid place-items-center">↗</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#D4CBB8] flex flex-wrap justify-between gap-4 font-mono text-[11px] text-[#5B6470]">
                  <span>© 2026 My Face Profile • Work Graph OS • No.2 of 24</span>
                  <span className="flex gap-4">
                    <a href="#" className="hover:text-[#0A1931]">Privacy</a>
                    <a href="#" className="hover:text-[#0A1931]">Terms</a>
                    <a href="#" className="hover:text-[#0A1931]">Manifesto</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
