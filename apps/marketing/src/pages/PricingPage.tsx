import { useEffect, useRef, useState } from "react";
import logo1 from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logo2 from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import giftBox from "../assets/06d52eba7e0ac6c4-image_20261029_184125.webp";
import phoneLive from "../assets/9d6013af7e4e2a36-image_20261029_175423.webp";
import payoutProof from "../assets/1d451fa6796e3167-image_20261029_184126.webp";
import escrowHold from "../assets/23253a68703eae99-image_20261029_181606.webp";
import reviewVerified from "../assets/278ca298819af13d-image_20261029_181559.webp";
import tailorWork from "../assets/840990accfbeab9d-image_20261029_173924.webp";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how" },
  { label: "Work OS", href: "#work" },
  { label: "UPRM", href: "#uprm" },
  { label: "Projects", href: "#projects" },
  { label: "Pricing", href: "#pricing", active: true },
  { label: "Trust", href: "#trust" },
];

const PACKS = [
  { mfc: 100, price: "£0.99", save: "", popular: false },
  { mfc: 500, price: "£4.49", save: "Save 10%", popular: false },
  { mfc: 1500, price: "£12.99", save: "Save 13% • Most Gifted", popular: true },
  { mfc: 5000, price: "£39.99", save: "Save 20% • Creator Choice", popular: false },
];

const GIFTS = [
  { icon: "🔨", name: "Hammer", mfc: 10, desc: "Respect the grind" },
  { icon: "✂️", name: "Scissors", mfc: 25, desc: "Clean cut" },
  { icon: "❤️", name: "Craft Heart", mfc: 50, desc: "Made with love" },
  { icon: "👑", name: "Crown", mfc: 100, desc: "Master work" },
  { icon: "🏆", name: "Trophy", mfc: 500, desc: "Legendary" },
];

const MONETIZATION = [
  {
    id: 1,
    title: "Gift Economy MFC",
    take: "30% Take",
    math: "1,000 gifters × 2.5 gifts × 80 MFC avg",
    revenue: 600,
    note: "Emotional, not transactional",
    color: "#8FFF4A",
  },
  {
    id: 2,
    title: "Transaction Escrow",
    take: "10% Jobs / 5% Shop",
    math: "350 jobs × £180 × 10%",
    revenue: 6300,
    note: "Stripe Connect holds funds",
    color: "#00E5C0",
  },
  {
    id: 3,
    title: "Video → Cash Dataset",
    take: "Transparent split",
    math: "Approved work video hrs × lab rate",
    revenue: 4200,
    note: "Consent-first AI training data • NEW",
    color: "#FFC300",
  },
  {
    id: 4,
    title: "Boosted Discovery",
    take: "£5 per boost",
    math: "300 pros × £5 = £1,500",
    revenue: 1500,
    note: "500 reach within 10mi",
    color: "#FFE600",
  },
  {
    id: 5,
    title: "Supplier Ads in WorkCut",
    take: "£2.5 CPM",
    math: "WorkCut exports + templates",
    revenue: 500,
    note: "Native, non-intrusive",
    color: "#FF8A00",
  },
  {
    id: 6,
    title: "Lead Unlock",
    take: "£3 per lead",
    math: "100 leads × £3",
    revenue: 300,
    note: "Verified intent only",
    color: "#8FFF4A",
  },
  {
    id: 6,
    title: "Pro Subscription",
    take: "£29 / mo",
    math: "450 pros × £29",
    revenue: 3262,
    note: "Later phase",
    color: "#00E5C0",
  },
];

export default function PricingPage() {
  const [activeGift, setActiveGift] = useState(2);
  const [showToast, setShowToast] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(null), 2400);
    return () => clearTimeout(t);
  }, [showToast]);

  return (
    <div
      data-safe-area-inset-root
      style={{
        boxSizing: "border-box",
        paddingTop: "var(--safe-area-inset-top)",
        background: "var(--bg)",
        minHeight: "100vh",
        color: "var(--text)",
      }}
      className="overflow-x-clip antialiased selection:bg-[#FFC300]/35"
    >
      {/* Background grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      {/* NAV */}
      <header
        data-safe-area-sticky-top
        style={{ top: "var(--safe-area-inset-top)" }}
        className="sticky z-50 backdrop-blur-[22px] border-b"
      >
        <div
          className="w-full border-b border-[#D4CBB8]"
          style={{ background: "rgba(255,253,247,0.92)" }}
        >
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8 h-[64px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-[36px] w-[36px] rounded-[10px] overflow-hidden flex items-center justify-center" style={{ background: "var(--m-gradient)" }}>
                <span className="poppins font-[800] text-[20px] text-black leading-none">M</span>
                <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ background: `url(${logo1})`, backgroundSize: "cover" }} />
              </div>
              <div className="leading-none">
                <div className="poppins font-[700] text-[14px] tracking-[-0.02em]">My Face Profile</div>
                <div className="mono text-[9px] tracking-[0.18em] text-[#5B6470] uppercase mt-[2px]">Craft • Work • Holy</div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  className={`px-3 py-[7px] rounded-full text-[13px] font-medium transition ${
                    n.active
                      ? "bg-white text-black"
                      : "text-[#5B6470] hover:text-[#0A1931] hover:bg-[#F0E9DB]"
                  }`}
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1.5">
                <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#8FFF4A" }} />
                <span className="mono text-[10px] text-[#5B6470]">LIVE GIFTS • 1.2K</span>
              </div>
              <button
                onClick={() => setShowToast("Pricing is active — Free tier live")}
                className="h-[36px] px-4 rounded-full bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 transition"
              >
                Start Free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={giftBox} alt="Gift Economy box" className="w-full h-full object-cover opacity-[0.28] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/70 to-[#050505]" />
          <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(800px 600px at 70% 10%, rgba(143,255,74,0.18), transparent 60%), radial-gradient(600px 500px at 20% 80%, rgba(255,230,0,0.12), transparent), radial-gradient(700px 500px at 90% 90%, rgba(255,138,0,0.16), transparent)" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-5 lg:px-8 pt-[48px] lg:pt-[84px] pb-[48px] lg:pb-[88px]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-8 items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] backdrop-blur px-3 py-1.5 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />
                <span className="mono text-[10px] tracking-[0.14em] text-[#5B6470] uppercase">No.7 of 24 • Pricing • MFC Coin Economy • Free to Enter, Pay to Appreciate</span>
              </div>

              <h1 className="poppins font-[800] tracking-[-0.04em] leading-[0.9] text-[40px] sm:text-[54px] lg:text-[74px]">
                <span className="block">Free to Show.</span>
                <span className="block">Paid to Appreciate.</span>
                <span
                  className="block mt-2 text-transparent bg-clip-text"
                  style={{ backgroundImage: "var(--m-gradient)" }}
                >
                  Interface Free, Craft Paid.
                </span>
              </h1>

              <p className="mt-6 max-w-[560px] text-[16px] lg:text-[18px] leading-[1.5] text-[#5B6470]">
                From VisaguideOS VCG to MyFace Coins MFC — evolution of appreciation token. Watch free, gift to appreciate, book to grow.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowToast("Free profile created — welcome to gift economy")}
                  className="h-[48px] px-7 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-zinc-100 transition flex items-center gap-2"
                >
                  Start Showing — Free
                  <span className="h-5 w-5 rounded-full bg-[#0A1931] text-white grid place-items-center text-[12px]">→</span>
                </button>
                <button
                  onClick={() => document.getElementById("mfc")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-[48px] px-6 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] backdrop-blur text-[#0A1931] font-medium text-[14px] hover:bg-white/[0.1] transition"
                >
                  Explore MFC Economy
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-[520px]">
                {[
                  { k: "Gift Take", v: "30%" },
                  { k: "Escrow", v: "Stripe Connect" },
                  { k: "Cashout", v: "70% Instant" },
                ].map((s) => (
                  <div key={s.k} className="rounded-[16px] border border-[#D4CBB8] bg-[#F0E9DB] backdrop-blur p-3">
                    <div className="mono text-[10px] tracking-[0.12em] text-[#5B6470] uppercase">{s.k}</div>
                    <div className="poppins font-bold text-[15px] mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gift box card */}
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-[32px] blur-[40px] opacity-60"
                style={{ background: "var(--m-gradient-soft)" }}
              />
              <div
                className="relative rounded-[28px] overflow-hidden border border-[#D4CBB8] bg-[#F0E9DB]/80 backdrop-blur-[18px] shadow-[0_20px_50px_rgba(10,25,49,0.10)]"
                style={{ transform: `translate3d(${mouse.x}px, ${mouse.y}px, 0)` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={giftBox} alt="Gift Economy exploding box" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  {/* floating emojis */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[
                      { e: "🪙", x: 18, y: 22, d: 0 },
                      { e: "👑", x: 74, y: 18, d: 0.8 },
                      { e: "🏆", x: 82, y: 56, d: 1.2 },
                      { e: "💛", x: 12, y: 66, d: 0.4 },
                      { e: "🔨", x: 48, y: 12, d: 1.6 },
                      { e: "✂️", x: 58, y: 74, d: 0.6 },
                    ].map((f, i) => (
                      <span
                        key={i}
                        className="absolute text-[22px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
                        style={{
                          left: `${f.x}%`,
                          top: `${f.y}%`,
                          animation: `floaty 3.2s ease-in-out ${f.d}s infinite`,
                        }}
                      >
                        {f.e}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="rounded-full bg-[#0A1931]/85 border border-[#D4CBB8] backdrop-blur px-3 py-1.5 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#FFE600] animate-pulse" />
                      <span className="mono text-[10px] text-white">GIFT ECONOMY • LIVE</span>
                    </div>
                    <div className="rounded-full bg-white text-black px-3 py-1 mono text-[10px] font-bold">NOT CRYPTO • NO RESALE</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <img src={logo2} alt="M icon" className="h-9 w-9 rounded-full object-cover border border-[#D4CBB8]" />
                    <div>
                      <div className="poppins font-bold text-[14px]">Gift Shower Active</div>
                      <div className="text-[12px] text-[#5B6470]">Tailor Atelier • 1.4k watching • £84 gifted in last 10m</div>
                    </div>
                  </div>
                  <div className="mt-4 h-[56px] rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 w-[68%] bg-gradient-to-r from-[#8FFF4A]/30 via-[#00E5C0]/30 to-[#FFE600]/30" />
                    <div className="relative z-10 h-full flex items-center justify-between px-4">
                      <span className="mono text-[11px] text-[#5B6470]">GIFT RAIN • 24 gifts / min</span>
                      <span className="mono text-[11px] text-[#0A1931] font-bold">+£600 / week at 10K WAU</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] backdrop-blur p-3 flex gap-3 items-center">
                  <img src={phoneLive} alt="Live gifting phone" className="h-[52px] w-[38px] rounded-[8px] object-cover" />
                  <div>
                    <div className="mono text-[10px] text-[#5B6470]">LIVE WORKSHOP</div>
                    <div className="text-[12px] font-medium leading-tight">Atelier Tailoring<br/>gift rain 14 gifts</div>
                  </div>
                </div>
                <div className="rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] backdrop-blur p-3 flex gap-3 items-center">
                  <img src={payoutProof} alt="Payout proof" className="h-[52px] w-[52px] rounded-[10px] object-cover" />
                  <div>
                    <div className="mono text-[10px] text-[#5B6470]">PAYOUT PROOF</div>
                    <div className="text-[12px] font-medium leading-tight">$450 Escrow<br/>Released</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 — MFC EXPLANATORY */}
      <section id="mfc" className="relative border-t border-[#D4CBB8] bg-[#FFFDF7]">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-[56px] lg:py-[88px]">
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <div className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1 mono text-[10px] tracking-[0.14em]">SECTION 01 • MFC COIN ECONOMY</div>
            <div className="h-px flex-1 bg-[#F0E9DB] hidden lg:block" />
            <div className="mono text-[10px] text-[#5B6470]">TOUCH OF GOD • DIVINE GLOW BEHIND GIFT BOX</div>
          </div>

          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-14 items-start">
            {/* Left visual */}
            <div className="relative lg:sticky lg:top-[84px]">
              <div className="absolute -inset-4 rounded-[28px] blur-[32px] opacity-70" style={{ background: "radial-gradient(400px 300px at 50% 30%, rgba(143,255,74,0.22), transparent), radial-gradient(300px 300px at 80% 70%, rgba(255,230,0,0.18), transparent)" }} />
              <div className="relative rounded-[28px] overflow-hidden border border-[#D4CBB8] bg-[#F0E9DB]">
                <img src={giftBox} alt="Gift Economy box exploding" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute top-4 left-4 rounded-full bg-[#0A1931]/85 border border-[#D4CBB8] px-3 py-1.5 backdrop-blur flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FFE600]" />
                  <span className="mono text-[10px] text-white">GIFT ECONOMY • TAG</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="flex gap-2">
                    {GIFTS.map((g) => (
                      <div key={g.name} className="flex-1 rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] backdrop-blur py-2 text-center">
                        <div className="text-[16px]">{g.icon}</div>
                        <div className="mono text-[9px] text-[#5B6470] mt-1">{g.mfc} MFC</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { l: "Not Crypto", v: "No resale, only gift or cashout" },
                  { l: "Emotional", v: "Like street performer applause" },
                  { l: "Instant", v: "Gift cashout 70% via Connect" },
                ].map((c) => (
                  <div key={c.l} className="rounded-[16px] border border-[#D4CBB8] bg-[#F0E9DB] p-3">
                    <div className="mono text-[9px] text-[#5B6470] uppercase tracking-[0.12em]">{c.l}</div>
                    <div className="text-[11px] leading-[1.3] mt-1 text-[#5B6470]">{c.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right explanation */}
            <div>
              <h2 className="poppins font-[800] text-[28px] lg:text-[40px] leading-[0.95] tracking-[-0.03em]">
                What is MFC? <br />
                <span className="text-[#5B6470]">MyFace Coins, evolution of VCG.</span>
              </h2>
              <p className="mt-4 text-[14px] leading-[1.6] text-[#5B6470] max-w-[560px]">
                Internal appreciation token. Not crypto. No resale. No speculation. You buy packs, you gift during live workshops. Pro receives, cashes out 70%. Platform keeps 30% via Stripe Connect. Warm, human, holy craft.
              </p>

              {/* Flow diagram */}
              <div className="mt-8 rounded-[20px] border border-[#D4CBB8] bg-[#F0E9DB] backdrop-blur p-4 lg:p-6">
                <div className="mono text-[10px] tracking-[0.14em] text-[#5B6470] mb-4">FLOW DIAGRAM • 4 STEPS</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { step: "01", title: "Customer Buys", desc: "MFC Pack £0.99 → £39.99", img: null },
                    { step: "02", title: "Wallet → Gift", desc: "During Live Workshop", img: phoneLive },
                    { step: "03", title: "Pro Receives", desc: "Shower + Dopa hit", img: null },
                    { step: "04", title: "Cashout 70%", desc: "Via Connect Instant", img: payoutProof },
                  ].map((f) => (
                    <div key={f.step} className="relative rounded-[16px] border border-[#D4CBB8] bg-[#F0E9DB] p-3">
                      <div className="mono text-[10px] text-[#5B6470]">{f.step}</div>
                      <div className="poppins font-bold text-[13px] mt-1">{f.title}</div>
                      <div className="text-[11px] text-[#5B6470] mt-1 leading-[1.3]">{f.desc}</div>
                      {f.img && <img src={f.img} alt="" className="mt-3 h-[64px] w-full rounded-[10px] object-cover border border-[#D4CBB8]" />}
                      {f.step !== "04" && <div className="hidden sm:block absolute top-1/2 -right-2 h-px w-4 bg-white/20" />}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-[#5B6470]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A]" />
                  Stripe Connect holds 30% — trusted, holy transaction
                </div>
              </div>

              {/* Packs */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="poppins font-bold text-[16px]">MFC Packs</h3>
                  <span className="mono text-[10px] text-[#5B6470]">CHEAPEST APPLAUSE ON INTERNET</span>
                </div>
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {PACKS.map((p) => (
                    <div
                      key={p.mfc}
                      className={`relative rounded-[18px] border bg-[#F0E9DB] p-4 overflow-hidden group hover:border-[#D4CBB8] transition ${p.popular ? "border-[#FFE600]/30" : "border-[#D4CBB8]"}`}
                    >
                      {p.popular && (
                        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "var(--m-gradient)" }} />
                      )}
                      <div className="mono text-[10px] text-[#5B6470]">{p.mfc} MFC</div>
                      <div className="poppins font-[800] text-[22px] mt-1">{p.price}</div>
                      <div className="mono text-[9px] text-[#5B6470] mt-2 min-h-[28px] leading-[1.3]">{p.save || "Starter"}</div>
                      <button
                        onClick={() => setActiveGift(p.mfc === 1500 ? 2 : 0)}
                        className="mt-3 w-full h-[32px] rounded-full bg-white text-black text-[11px] font-semibold hover:bg-zinc-100 transition"
                      >
                        Buy Pack
                      </button>
                      <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full blur-[18px] opacity-30" style={{ background: "var(--m-gradient)" }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Gift icons */}
              <div className="mt-8 rounded-[20px] border border-[#D4CBB8] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="poppins font-bold text-[14px]">Gift Icons • Work-Themed</h3>
                  <span className="mono text-[10px] text-[#5B6470]">ANIMATED FLOATING</span>
                </div>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {GIFTS.map((g, idx) => (
                    <button
                      key={g.name}
                      onClick={() => setActiveGift(idx)}
                      className={`rounded-[16px] border p-3 text-left transition group ${activeGift === idx ? "bg-white text-black border-white" : "bg-[#F0E9DB] border-[#D4CBB8] hover:bg-[#F0E9DB]"}`}
                    >
                      <div className="text-[22px]" style={{ animation: activeGift === idx ? "floaty 1.2s ease-in-out infinite" : undefined }}>{g.icon}</div>
                      <div className={`poppins font-bold text-[12px] mt-2 ${activeGift === idx ? "text-black" : "text-[#0A1931]"}`}>{g.name}</div>
                      <div className={`mono text-[10px] ${activeGift === idx ? "text-black/60" : "text-[#5B6470]"}`}>{g.mfc} MFC</div>
                      <div className={`text-[10px] mt-1 leading-[1.2] ${activeGift === idx ? "text-black/60" : "text-[#5B6470]"}`}>{g.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex items-center gap-3">
                  <img src={tailorWork} alt="Tailor sewing" className="h-10 w-10 rounded-full object-cover" />
                  <div className="text-[11px] leading-[1.4] text-[#5B6470]">
                    <span className="text-[#0A1931] font-semibold">Why it works:</span> Like street performer, watching free, clapping with coins paid — emotional not transactional — live gift shower dopa hit, reverent appreciation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PRICING TIERS */}
      <section id="pricing" className="relative border-t border-[#D4CBB8] bg-[#FFFDF7]">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(600px 400px at 20% 0%, rgba(143,255,74,0.08), transparent), radial-gradient(500px 400px at 80% 100%, rgba(255,138,0,0.06), transparent)" }} />
        <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 py-[56px] lg:py-[88px]">
          <div className="max-w-[760px]">
            <div className="mono text-[10px] tracking-[0.16em] text-[#5B6470]">SECTION 02 • PRICING TIERS • FREE ENTRANCE</div>
            <h2 className="mt-4 poppins font-[800] text-[32px] lg:text-[52px] leading-[0.9] tracking-[-0.04em]">
              Free Forever.
              <br />
              <span className="text-[#5B6470]">Pay to Grow.</span>
            </h2>
            <p className="mt-4 text-[14px] text-[#5B6470] leading-[1.6]">Interface stays free. Craft stays paid. No paywall to show your work. Only paywall is to grow faster, with full bot army and boost.</p>
          </div>

          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            {/* FREE */}
            <div className="relative rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] backdrop-blur p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mono text-[11px] tracking-[0.14em] text-[#5B6470]">FREE</div>
                  <div className="poppins font-[800] text-[36px] leading-none mt-2">£0 <span className="text-[16px] font-[600] text-[#5B6470]">/ Forever</span></div>
                </div>
                <div className="h-[48px] w-[48px] rounded-full border border-[#D4CBB8] bg-[#F0E9DB] grid place-items-center text-[18px]">✦</div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  "Profile, 3 Projects, 10 Posts",
                  "Basic WorkCut (trim, captions)",
                  "Basic Bots (Milo, Veri)",
                  "Receive Gifts • MFC wallet",
                  "Basic UPRM Pipeline",
                  "Community Support",
                ].map((f) => (
                  <div key={f} className="flex gap-2 text-[13px] text-[#5B6470]">
                    <span className="mt-[2px] h-4 w-4 rounded-full bg-[#F0E9DB] grid place-items-center text-[10px]">✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => setShowToast("Free tier activated — 3 projects live")} className="mt-8 w-full h-[44px] rounded-full bg-white text-black font-semibold text-[14px] hover:bg-zinc-100 transition">
                Start Free
              </button>
              <div className="mt-3 text-center mono text-[10px] text-[#5B6470]">No card • No lock-in • Touch of GOD free</div>
            </div>

            {/* PRO */}
            <div className="relative rounded-[24px] border border-[#FFE600]/20 bg-[#F0E9DB] p-6 lg:p-8 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px]" style={{ background: "var(--m-gradient)" }} />
              <div className="absolute -top-20 -right-20 h-[240px] w-[240px] rounded-full blur-[40px] opacity-20" style={{ background: "var(--m-gradient)" }} />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="mono text-[11px] tracking-[0.14em] text-[#5B6470]">PRO</span>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-black" style={{ background: "var(--m-gradient)" }}>MOST POPULAR</span>
                  </div>
                  <div className="poppins font-[800] text-[36px] leading-none mt-2">£29 <span className="text-[16px] font-[600] text-[#5B6470]">/ mo (later)</span></div>
                </div>
                <img src={logo1} alt="M" className="h-[44px] w-[44px] rounded-[12px] object-cover border border-[#D4CBB8]" />
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Unlimited Projects & Posts",
                  "Advanced WorkCut 4K, Before/After, templates",
                  "Full Bot Army: Milo, Cutty, Quoto, Timi, Findy, Helpy, Veri, Growy, Lingo",
                  "Advanced UPRM + Analytics",
                  "5 Boost Credits / mo",
                  "Priority Support + Verified Pro Badge",
                ].map((f) => (
                  <div key={f} className="flex gap-2 text-[13px] text-[#5B6470]">
                    <span className="mt-[3px] h-4 w-4 rounded-full grid place-items-center text-[10px] text-black shrink-0" style={{ background: "var(--m-gradient)" }}>✓</span>
                    <span className="leading-[1.3]">{f}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowToast("Pro coming soon — join waitlist")} className="mt-8 w-full h-[44px] rounded-full font-semibold text-[14px] text-black hover:opacity-90 transition" style={{ background: "var(--m-gradient)" }}>
                Go Pro — Coming Soon
              </button>
              <div className="mt-3 text-center mono text-[10px] text-[#5B6470]">Interface stays free, Pro is for growth • Cancel anytime</div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="mt-12 rounded-[20px] border border-[#D4CBB8] overflow-hidden">
            <div className="grid grid-cols-[1.2fr_0.6fr_0.6fr] bg-[#F0E9DB] text-[11px] mono tracking-[0.12em] text-[#5B6470]">
              <div className="px-5 py-3">FEATURE</div>
              <div className="px-5 py-3 text-center">FREE</div>
              <div className="px-5 py-3 text-center">PRO £29</div>
            </div>
            {[
              ["Projects", "3", "Unlimited"],
              ["Posts", "10", "Unlimited"],
              ["WorkCut", "Basic trim", "4K + Before/After + Templates"],
              ["Bots", "Milo + Veri", "Full Army 9 bots"],
              ["UPRM Pipeline", "Basic", "Advanced + Analytics"],
              ["Boost Credits", "0", "5 / mo"],
              ["Receive Gifts", "✓", "✓ + Priority ranking"],
              ["Support", "Community", "Priority + Verified Badge"],
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-[1.2fr_0.6fr_0.6fr] text-[13px] border-t border-[#D4CBB8] ${i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}`}>
                <div className="px-5 py-3 text-[#5B6470]">{row[0]}</div>
                <div className="px-5 py-3 text-center text-[#5B6470]">{row[1]}</div>
                <div className="px-5 py-3 text-center text-[#0A1931] font-medium">{row[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — 6 WAYS MONETIZE */}
      <section className="relative border-t border-[#D4CBB8] bg-[#FFFDF7]">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-[56px] lg:py-[88px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mono text-[10px] tracking-[0.16em] text-[#5B6470]">SECTION 03 • 6 WAYS WE MONETIZE WITH 10K WAU</div>
              <h2 className="mt-3 poppins font-[800] text-[28px] lg:text-[42px] leading-[0.95] tracking-[-0.03em]">
                Without Charging Entrance.
                <br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "var(--m-gradient)" }}>£9.6K / week organic.</span>
              </h2>
            </div>
            <div className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-4 py-2 mono text-[10px] text-[#5B6470]">
              10K WAU → £51,528/mo → £618K ARR
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONETIZATION.map((m) => (
              <div key={m.id} className="group relative rounded-[20px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 overflow-hidden hover:border-[#D4CBB8] transition">
                <div className="absolute top-0 left-0 h-[2px] w-full" style={{ background: m.color, opacity: 0.6 }} />
                <div className="flex items-start justify-between">
                  <div className="h-8 w-8 rounded-[10px] grid place-items-center text-black font-bold text-[12px]" style={{ background: m.color }}>{m.id}</div>
                  <div className="rounded-full bg-[#F0E9DB] border border-[#D4CBB8] px-2.5 py-1 mono text-[9px] text-[#5B6470]">{m.take}</div>
                </div>
                <div className="poppins font-bold text-[15px] mt-4">{m.title}</div>
                <div className="mono text-[11px] text-[#5B6470] mt-1 leading-[1.4]">{m.math}</div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="mono text-[10px] text-[#5B6470]">REVENUE / WEEK</div>
                    <div className="poppins font-[800] text-[24px] leading-none mt-1">£{m.revenue.toLocaleString()}</div>
                  </div>
                  <div className="text-[11px] text-[#5B6470] max-w-[120px] leading-[1.3] text-right">{m.note}</div>
                </div>
                {/* tiny bar */}
                <div className="mt-4 h-1.5 rounded-full bg-[#F0E9DB] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 group-hover:w-full" style={{ width: `${Math.min(100, (m.revenue / 6300) * 100)}%`, background: m.color }} />
                </div>

                {m.id === 1 && (
                  <div className="absolute right-3 bottom-[52px] flex gap-1 opacity-60">
                    <img src={giftBox} alt="" className="h-8 w-8 rounded-full object-cover border border-[#D4CBB8]" />
                    <img src={phoneLive} alt="" className="h-8 w-8 rounded-full object-cover border border-[#D4CBB8]" />
                  </div>
                )}
                {m.id === 2 && (
                  <div className="absolute right-3 bottom-[52px] flex gap-1 opacity-60">
                    <img src={escrowHold} alt="" className="h-8 w-12 rounded-[6px] object-cover border border-[#D4CBB8]" />
                    <img src={payoutProof} alt="" className="h-8 w-12 rounded-[6px] object-cover border border-[#D4CBB8]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bar chart summary */}
          <div className="mt-8 rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-6 lg:p-8 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="poppins font-bold text-[16px]">Weekly Revenue Breakdown at 10K WAU</h3>
              <div className="flex gap-2">
                <div className="rounded-full bg-white text-black px-3 py-1 mono text-[10px] font-bold">WITHOUT PRO: £9,620 / week</div>
                <div className="rounded-full px-3 py-1 mono text-[10px] font-bold text-black" style={{ background: "var(--m-gradient)" }}>WITH PRO: £12,882 / week → £618K ARR</div>
              </div>
            </div>

            <div className="mt-8 flex items-end gap-2 lg:gap-3 h-[160px]">
              {MONETIZATION.map((m) => (
                <div key={m.id} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-[8px] transition-all" style={{ height: `${(m.revenue / 6300) * 120 + 16}px`, background: m.color }} />
                  <div className="mono text-[9px] text-[#5B6470] text-center leading-[1.2]">{m.title.split(" ")[0]}</div>
                  <div className="mono text-[10px] font-bold">£{m.revenue}</div>
                </div>
              ))}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-[8px] bg-white" style={{ height: `148px` }} />
                <div className="mono text-[9px] text-[#0A1931] text-center leading-[1.2] font-bold">TOTAL + PRO</div>
                <div className="mono text-[10px] font-bold">£12,882</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              <div className="rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                <div className="mono text-[#5B6470]">GIFT ECONOMY</div>
                <div className="text-[#5B6470] mt-1">1k gifters × 2.5 gifts × 80 MFC = £600/week — emotional dopa</div>
              </div>
              <div className="rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                <div className="mono text-[#5B6470]">ESCROW 10%</div>
                <div className="text-[#5B6470] mt-1">350 jobs × £180 — Stripe holds, releases on approval</div>
              </div>
              <div className="rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                <div className="mono text-[#5B6470]">DISCOVERY BOOST</div>
                <div className="text-[#5B6470] mt-1">£5 → 500 reach within 10mi — local craft discovery</div>
              </div>
              <div className="rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                <div className="mono text-[#5B6470]">ARR MATH</div>
                <div className="text-[#5B6470] mt-1">£9,620 × 4 = £38.5K/mo without Pro • With Pro £51.5K/mo → £618K ARR</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — ESCROW + TRUST */}
      <section id="trust" className="relative border-t border-[#D4CBB8] bg-[#FFFDF7]">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-[56px] lg:py-[88px]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <div className="mono text-[10px] tracking-[0.16em] text-[#5B6470]">SECTION 04 • ESCROW + TRUST • HOW MONEY IS SAFE</div>
              <h2 className="mt-4 poppins font-[800] text-[30px] lg:text-[44px] leading-[0.9] tracking-[-0.03em]">
                Stripe Trust.
                <br />
                <span className="text-[#5B6470]">Holy Transaction.</span>
              </h2>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="rounded-[20px] border border-[#D4CBB8] bg-[#F0E9DB] overflow-hidden">
                  <img src={escrowHold} alt="Booking confirmed escrow" className="w-full aspect-[4/3] object-cover" />
                  <div className="p-4">
                    <div className="mono text-[10px] text-[#5B6470]">STEP 01 • HOLD</div>
                    <div className="poppins font-bold text-[13px] mt-1">£80 Held Securely</div>
                    <div className="text-[11px] text-[#5B6470] mt-1 leading-[1.4]">Customer pays deposit → Stripe Connect holds in escrow → Verified booking confirmed. Pro sees guarantee.</div>
                  </div>
                </div>
                <div className="rounded-[20px] border border-[#D4CBB8] bg-[#F0E9DB] overflow-hidden">
                  <img src={payoutProof} alt="Payment received escrow released" className="w-full aspect-[4/3] object-cover" />
                  <div className="p-4">
                    <div className="mono text-[10px] text-[#5B6470]">STEP 02 • RELEASE</div>
                    <div className="poppins font-bold text-[13px] mt-1">$450 Escrow Released</div>
                    <div className="text-[11px] text-[#5B6470] mt-1 leading-[1.4]">Milestone approved → Release 90% to pro minus 10% platform. Gift cashout instant 70% via Connect.</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-5">
                <div className="flex items-center gap-3">
                  <img src={reviewVerified} alt="Verified review" className="h-12 w-12 rounded-[10px] object-cover border border-[#D4CBB8]" />
                  <div>
                    <div className="poppins font-bold text-[13px]">Verified Reviews Only From Verified Purchase</div>
                    <div className="text-[11px] text-[#5B6470] mt-1">No fake stars. Review unlocks only after escrow release + job completion. Trust badge shown.</div>
                  </div>
                  <div className="ml-auto hidden sm:flex rounded-full bg-[#8FFF4A]/15 border border-[#8FFF4A]/20 px-2.5 py-1 mono text-[10px] text-[#8FFF4A]">5★ VERIFIED</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { k: "Escrow Held", v: "Stripe Connect" },
                  { k: "Release", v: "90% to Pro" },
                  { k: "Platform", v: "10% Jobs / 5% Shop" },
                ].map((s) => (
                  <div key={s.k} className="rounded-[14px] border border-[#D4CBB8] bg-[#F0E9DB] p-3 text-center">
                    <div className="mono text-[9px] text-[#5B6470] uppercase">{s.k}</div>
                    <div className="poppins font-bold text-[12px] mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-[84px]">
              <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00E5C0] animate-pulse" />
                  <span className="mono text-[11px] tracking-[0.12em] text-[#5B6470]">HOW MONEY FLOWS • TOUCH OF GOD</span>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    { n: "Customer → Platform", d: "Pays £180 job deposit • Held in Stripe Connect escrow • Booking confirmed", c: "#8FFF4A" },
                    { n: "Platform → Escrow", d: "£80 held securely • Pro notified • Work starts • No payout until approval", c: "#00E5C0" },
                    { n: "Milestone → Release", d: "Client approves milestone • Release 90% to pro • Platform keeps 10% • Review unlocked", c: "#FFE600" },
                    { n: "Gift → Instant", d: "Customer gifts 100 MFC 👑 during live • Pro gets 70% instantly • Platform 30% • Dopa hit", c: "#FF8A00" },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-7 w-7 rounded-full grid place-items-center text-[11px] font-bold text-black" style={{ background: step.c }}>{i + 1}</div>
                        {i < 3 && <div className="w-px h-10 bg-[#F0E9DB] mt-1" />}
                      </div>
                      <div className="pb-6">
                        <div className="poppins font-bold text-[13px]">{step.n}</div>
                        <div className="text-[11px] text-[#5B6470] leading-[1.4] mt-1 max-w-[300px]">{step.d}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-4 flex gap-3 items-center">
                  <img src={tailorWork} alt="Tailor sewing" className="h-10 w-10 rounded-full object-cover border border-[#D4CBB8]" />
                  <div className="text-[11px] leading-[1.4] text-[#5B6470]">
                    Every transaction reverent — holy craft, not gig. Warm divine glow behind gift box. Touch of GOD in every release.
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[18px] border border-[#FFE600]/20 bg-gradient-to-b from-[#FFE600]/10 to-transparent p-4 flex items-center justify-between">
                <div>
                  <div className="mono text-[10px] text-[#5B6470]">TRUST SCORE</div>
                  <div className="poppins font-bold text-[14px] mt-1">Stripe + Verified + Escrow</div>
                </div>
                <div className="h-10 w-10 rounded-full grid place-items-center text-black font-bold" style={{ background: "var(--m-gradient)" }}>✓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer className="relative border-t border-[#D4CBB8] overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--m-gradient-soft)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 py-[56px] lg:py-[88px]">
          <div className="rounded-[32px] border border-[#D4CBB8] bg-[#F0E9DB]/80 backdrop-blur p-8 lg:p-12 text-center overflow-hidden relative">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full blur-[60px] opacity-30" style={{ background: "var(--m-gradient)" }} />
            <div className="relative">
              <div className="inline-flex rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1 mono text-[10px] tracking-[0.14em] text-[#5B6470]">
                No.7 of 24 — Pricing + MFC — Touch of GOD
              </div>
              <h2 className="mt-6 poppins font-[800] text-[30px] lg:text-[56px] leading-[0.9] tracking-[-0.04em]">
                Start Showing —
                <br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "var(--m-gradient)" }}>Free Forever, Appreciate with Coins</span>
              </h2>
              <p className="mt-4 max-w-[640px] mx-auto text-[14px] lg:text-[15px] text-[#5B6470] leading-[1.6]">
                10K WAU → £618K ARR — Touch of GOD in every transaction. Gift economy, escrow trust, holy craft. Interface free, craft paid. Join the work revolution.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button onClick={() => setShowToast("Free forever — profile live")} className="h-[48px] px-8 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-zinc-100 transition">
                  Start Free Forever
                </button>
                <div className="flex gap-2">
                  <div className="h-[48px] px-4 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] backdrop-blur flex items-center gap-2">
                    <span className="text-[16px]"></span>
                    <span className="text-[11px] leading-[1.1] text-left">iOS<br/><span className="font-semibold">Coming Soon</span></span>
                  </div>
                  <div className="h-[48px] px-4 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] backdrop-blur flex items-center gap-2">
                    <span className="text-[14px]">▶</span>
                    <span className="text-[11px] leading-[1.1] text-left">Android<br/><span className="font-semibold">Coming Soon</span></span>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-[800px] mx-auto">
                {[
                  { k: "WAU", v: "10K", sub: "Target community" },
                  { k: "Weekly", v: "£12,882", sub: "With Pro subs" },
                  { k: "Monthly", v: "£51,528", sub: "Organic + Pro" },
                  { k: "ARR", v: "£618K", sub: "Touch of GOD" },
                ].map((s) => (
                  <div key={s.k} className="rounded-[16px] border border-[#D4CBB8] bg-[#F0E9DB] p-4">
                    <div className="mono text-[10px] text-[#5B6470]">{s.k}</div>
                    <div className="poppins font-[800] text-[20px] mt-1">{s.v}</div>
                    <div className="mono text-[10px] text-[#5B6470] mt-1">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#5B6470] mono">
                <span>© My Face Profile • Craft • Work • Holy</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>Stripe Connect • Not Crypto • Escrow Secured</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#8FFF4A] inline-block" /> Touch of GOD</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] rounded-full bg-white text-black px-5 py-2.5 text-[13px] font-medium shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-black/10 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />
          {showToast}
        </div>
      )}

      <style>{`
        @keyframes floaty {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-8px) }
        }
      `}</style>
    </div>
  );
}
