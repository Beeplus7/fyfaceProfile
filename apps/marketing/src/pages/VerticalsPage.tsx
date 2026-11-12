import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo1 from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logo2 from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import tailorSew from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import tailorFinal from "../assets/b4766d628a527e91-image_20261029_180641.webp";
import mechanicImg from "../assets/862320100e7b980d-image_20261029_173915.webp";
import builderImg from "../assets/727cc9fbccc433e9-image_20261029_173918.webp";
import barberImg from "../assets/f05e570703efee3a-image_20261029_173914.webp";
import electricianImg from "../assets/c898e4b8391d7d79-image_20261029_190128.webp";
import plumberImg from "../assets/b9ca48ae7cf46ed6-image_20261029_190129.webp";

type Vertical = {
  id: string;
  label: string;
  kicker: string;
  title: string;
  subtitle: string;
  href: string;
  stats: { v: string; l: string }[];
  features: { icon: string; text: string }[];
  seo: string[];
  cta: string;
  image: string;
  image2?: string;
  accent: string;
  glow: string;
  trust: string;
};

const VERTICALS: Vertical[] = [
  {
    id: "tailors",
    href: "/for-tailors",
    label: "FOR TAILORS",
    kicker: "Wedding Dress, Aso-Ebi, Alterations",
    title: "For Tailors",
    subtitle: "Wedding Dress, Aso-Ebi, Alterations",
    stats: [
      { v: "247", l: "tailors in Oldham" },
      { v: "4.9", l: "avg Trust" },
      { v: "£320", l: "avg job" },
    ],
    features: [
      { icon: "◐", text: "Before/After slider — lace to gown reveal" },
      { icon: "◑", text: "Shop Fabric £45/m — integrated store" },
      { icon: "◎", text: "Live Fitting — clients watch stitch live" },
      { icon: "◒", text: "Milestone Day 1-5 — WorkCut timeline" },
      { icon: "✦", text: "Gift Crown during live — MFC economy" },
    ],
    seo: ["tailor Oldham", "wedding dress tailor Manchester", "Aso-Ebi specialist"],
    cta: "Join as Tailor — Free",
    image: tailorSew,
    image2: tailorFinal,
    accent: "#8FFF4A",
    glow: "rgba(143,255,74,0.22)",
    trust: "Trusted by Brides Across GM",
  },
  {
    id: "mechanics",
    href: "/for-mechanics",
    label: "FOR MECHANICS",
    kicker: "Engine, MOT, Diagnostics",
    title: "For Mechanics",
    subtitle: "Engine, MOT, Diagnostics",
    stats: [
      { v: "189", l: "mechanics" },
      { v: "4.8", l: "Trust" },
      { v: "£195", l: "avg job" },
      { v: "1.2mi", l: "nearby" },
    ],
    features: [
      { icon: "⬡", text: "OBD2 Scanner live — J. Martinez method" },
      { icon: "◈", text: "Quoto Bot auto-quote £195 — no ghosting" },
      { icon: "⬔", text: "Parts Shop Brake Pads — escrow secured" },
      { icon: "⬣", text: "Escrow Secured — work proves pay" },
      { icon: "▶", text: "Video proof engine noise — Trust Ledger" },
    ],
    seo: ["mechanic Oldham", "Toyota engine fix OL8"],
    cta: "Join as Mechanic",
    image: mechanicImg,
    accent: "#00E5C0",
    glow: "rgba(0,229,192,0.22)",
    trust: "OBD2 Verified • Toyota • BMW • Ford",
  },
  {
    id: "builders",
    href: "/for-builders",
    label: "FOR BUILDERS",
    kicker: "Renovation, Extension, Brickwork",
    title: "For Builders",
    subtitle: "Renovation, Extension, Brickwork",
    stats: [
      { v: "124", l: "builders" },
      { v: "4.8", l: "Trust" },
      { v: "£8,400", l: "avg project" },
      { v: "14d", l: "avg days" },
    ],
    features: [
      { icon: "◫", text: "Project timeline — 14 day build board" },
      { icon: "⧉", text: "Blueprint + Materials List $2,480 — UPRM" },
      { icon: "⬙", text: "Team: Architect + Builder + Electrician + Plumber" },
      { icon: "◐", text: "Before/After slider — Oldham Builds" },
      { icon: "◑", text: "Escrow milestones — brick by brick" },
    ],
    seo: ["builder Oldham", "house renovation Oldham before after"],
    cta: "Join as Builder",
    image: builderImg,
    accent: "#FFE600",
    glow: "rgba(255,230,0,0.22)",
    trust: "Oldham Builders • Extensions • Trust Ledger",
  },
  {
    id: "barbers",
    href: "/for-barbers",
    label: "FOR BARBERS",
    kicker: "Fade, Line, Beard, Live Cutting",
    title: "For Barbers",
    subtitle: "Fade, Line, Beard, Live Cutting",
    stats: [
      { v: "98", l: "barbers" },
      { v: "4.9", l: "Trust" },
      { v: "£25", l: "avg" },
      { v: "Live", l: "Now" },
    ],
    features: [
      { icon: "✂", text: "Live fade — line design in real time" },
      { icon: "✦", text: "Gift Scissors ✂️ 25 MFC — viewers gift" },
      { icon: "◑", text: "Shop Clippers — Wahl, Andis" },
      { icon: "◎", text: "Booking — no walk-in chaos" },
      { icon: "★", text: "Reviews verified — face = trust" },
    ],
    seo: ["barber Oldham", "fade Oldham"],
    cta: "Join as Barber",
    image: barberImg,
    accent: "#FF8A00",
    glow: "rgba(255,138,0,0.24)",
    trust: "Fade Kings • Verified Cuts",
  },
  {
    id: "electricians",
    href: "/for-electricians",
    label: "FOR ELECTRICIANS",
    kicker: "Consumer Unit, Wiring, Safety Cert",
    title: "For Electricians",
    subtitle: "Consumer Unit, Wiring, Safety Cert",
    stats: [
      { v: "87", l: "electricians" },
      { v: "4.9", l: "Trust" },
      { v: "£180", l: "avg" },
      { v: "Cert", l: "BS 7671" },
    ],
    features: [
      { icon: "⚡", text: "Electrical Installation Certificate BS 7671 Part P Compliant" },
      { icon: "◍", text: "Consumer Unit 230V ~50Hz, RCD 30mA — live check" },
      { icon: "⎙", text: "Materials clipboard — WorkCut verified" },
      { icon: "🛡", text: "Safety badge — CAT helmet, yellow vest" },
      { icon: "⬔", text: "Escrow — cert before cash" },
    ],
    seo: ["electrician Oldham", "consumer unit installation Oldham"],
    cta: "Join as Electrician",
    image: electricianImg,
    accent: "#8FFF4A",
    glow: "rgba(143,255,74,0.20)",
    trust: "BS 7671 • Part P • RCD 30mA • 230V Certified",
  },
  {
    id: "plumbers",
    href: "/for-plumbers",
    label: "FOR PLUMBERS",
    kicker: "Boiler, Heating, Gas Safe",
    title: "For Plumbers",
    subtitle: "Boiler, Heating, Gas Safe",
    stats: [
      { v: "76", l: "plumbers" },
      { v: "4.9", l: "Trust" },
      { v: "£150", l: "avg" },
      { v: "123456", l: "Gas Safe ID" },
    ],
    features: [
      { icon: "⬡", text: "Gas Safe Register badge — 123456 verified" },
      { icon: "♨", text: "Boiler Worcester Bosch 68°C — live temp" },
      { icon: "◍", text: "Pressure check 1.2 bar — WorkCut proof" },
      { icon: "✓", text: "Flue secure + Gas tightness test Pass" },
      { icon: "⬔", text: "Escrow Secured — heat before payment" },
    ],
    seo: ["plumber Oldham", "boiler fix Oldham", "Gas Safe Oldham"],
    cta: "Join as Plumber",
    image: plumberImg,
    accent: "#00E5C0",
    glow: "rgba(0,229,192,0.22)",
    trust: "J. Martin • Worcester Bosch • Gas Safe 123456",
  },
];

export default function VerticalsPage() {
  const [activeJoin, setActiveJoin] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [records, setRecords] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // records api helpers
  const loadRecords = async () => {
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "records.list", args: { collection: "vertical_waitlist" } }),
      });
      const json = await res.json();
      if (json.data) setRecords(json.data.records || []);
    } catch {}
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const createRow = async (row: any) => {
    const res = await fetch("actions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "records.create",
        args: {
          collection: "vertical_waitlist",
          value: row,
          idempotency_key: `${row.trade}-${row.phone}-${row.name}`.slice(0, 80),
        },
      }),
    });
    const j = await res.json();
    if (j.error) throw new Error(j.error);
    return j.data;
  };

  const handleJoinSubmit = async (tradeId: string) => {
    if (!formName || !formPhone) return;
    setBusy(true);
    try {
      const row = {
        trade: tradeId,
        name: formName,
        phone: formPhone,
        created_at_str: new Date().toISOString(),
        source: "No.9 Verticals Hub",
      };
      await createRow(row);
      setSavedCount((c) => c + 1);
      setShowSuccess(tradeId);
      setTimeout(() => setShowSuccess(null), 3000);
      setFormName("");
      setFormPhone("");
      setActiveJoin(null);
      await loadRecords();
    } catch (e: any) {
      alert(e.message || "Could not save");
    } finally {
      setBusy(false);
    }
  };

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full overflow-x-clip bg-[#FFFDF7] text-[#0A1931]"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }}
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 w-full border-b border-[#D4CBB8] backdrop-blur-[16px]"
        style={{
          top: "var(--safe-area-inset-top)",
          background: "rgba(255,253,247,0.92)",
        }}
      >
        <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-[10px] shadow-drop">
              <div className="absolute inset-0 bg-[var(--gradient-m)]" />
              <span className="absolute inset-0 grid place-items-center font-poppins text-[18px] font-[800] leading-none text-black">
                M
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-poppins text-[15px] font-[700] tracking-[-0.02em]">My Face Profile</span>
              <span className="hidden rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-[#5B6470] md:inline-flex">
                No.9 of 24 • VERTICALS • Touch of GOD
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {[
              { l: "Home", to: "/" },
              { l: "How It Works", to: "/how-it-works" },
              { l: "Work OS", to: "/work-os" },
              { l: "UPRM", to: "/uprm" },
              { l: "Projects", to: "/projects" },
              { l: "Pricing", to: "/pricing" },
            ].map((item) => (
              <Link
                key={item.l}
                to={item.to}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#5B6470] transition hover:text-[#0A1931]"
              >
                {item.l}
              </Link>
            ))}
            <div className="relative group/nav">
              <button className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-black">
                Verticals
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[#0A1931] text-[10px] text-white">▼</span>
              </button>
              <div className="pointer-events-none absolute -right-2 top-full mt-2 hidden w-[200px] rounded-[16px] border border-[#D4CBB8] bg-[#FFFDF7] p-2 shadow-drop group-hover/nav:pointer-events-auto group-hover/nav:block md:group-hover/nav:block">
                <div className="grid gap-1">
                  {VERTICALS.map((v) => (
                    <Link key={v.id} to={v.href} className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-[12px] text-[#5B6470] hover:bg-[#F0E9DB] hover:text-[#0A1931]">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: v.accent }} />
                      {v.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden h-8 w-8 overflow-hidden rounded-full border border-[#D4CBB8] md:block">
              <img src={logo1} alt="My Face Profile" className="h-full w-full object-cover" />
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-[#D4CBB8] md:hidden">
              <span className="block h-[2px] w-4 bg-white" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-[1440px] overflow-hidden px-4 pb-10 pt-10 md:px-8 md:pb-16 md:pt-16">
        {/* background glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[700px] w-[1200px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[120px]" style={{ background: "var(--gradient-m)" }} />
        <div className="pointer-events-none absolute right-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-[#00E5C0]/[0.12] blur-[90px]" />
        <div className="pointer-events-none absolute left-[-80px] top-[40%] h-[360px] w-[360px] rounded-full bg-[#FF8A00]/[0.10] blur-[80px]" />

        <div className="relative">
          <div className="mx-auto max-w-[1020px] text-center">
            <div className="animate-slide inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#5B6470]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8FFF4A]" />
              No.9 of 24 • Verticals • Built for Every Craft • Touch of GOD
            </div>

            <h1 className="font-poppins mt-6 text-balance text-[32px] font-[800] leading-[0.95] tracking-[-0.04em] md:text-[64px]">
              <span className="block">One OS. Every Trade.</span>
              <span className="block">Your Work Is Your Face.</span>
            </h1>

            <h2 className="font-poppins mx-auto mt-5 max-w-[860px] text-pretty text-[18px] font-[700] leading-[1.15] tracking-[-0.02em] md:text-[28px]">
              <span className="gradient-text">
                Tailors, Mechanics, Builders, Barbers, Electricians, Plumbers — All Welcome.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-[640px] text-pretty text-[15px] leading-[1.6] text-[#5B6470] md:text-[17px]">
              My Face Profile OS is not for influencers. It's for people who work with hands, tools, fabric, engines, bricks,
              wires, pipes — <span className="text-[#0A1931]">real work that deserves trust.</span>
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={scrollToGrid}
                className="group relative inline-flex h-[48px] items-center justify-center gap-2 overflow-hidden rounded-full px-7 font-poppins text-[14px] font-[700] tracking-[-0.01em] text-black transition hover:scale-[1.02]"
                style={{ background: "var(--gradient-m)" }}
              >
                <span>Find Your Trade</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#0A1931] text-white transition group-hover:translate-x-0.5">→</span>
              </button>
              <div className="flex items-center gap-3 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-4 py-2">
                <div className="flex -space-x-2">
                  {[logo1, logo2, tailorSew].map((img, i) => (
                    <img key={i} src={img} alt="" className="h-6 w-6 rounded-full border border-black object-cover" />
                  ))}
                </div>
                <span className="font-mono text-[11px] text-[#5B6470]">1,247 pros live • Touch of GOD</span>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 rounded-[20px] border border-[#D4CBB8] bg-white/[0.02] p-3 md:grid-cols-4">
              {[
                { k: "1,247 pros", v: "Across 6 trades" },
                { k: "12K Projects", v: "WorkCut verified" },
                { k: "4.9 Avg Trust", v: "Face = Trust Ledger" },
                { k: "Touch of GOD", v: "In every craft" },
              ].map((it) => (
                <div key={it.k} className="rounded-[14px] bg-[#F0E9DB] px-4 py-3 text-left">
                  <div className="font-poppins text-[14px] font-[700] leading-none">{it.k}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#5B6470]">{it.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VERTICALS GRID */}
      <section ref={gridRef} className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-[#8FFF4A] to-transparent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5B6470]">6 Holy Trades • Mini Landing Pages</span>
          </div>
          <div className="font-mono text-[11px] text-[var(--text-faint)]">
            {records.length} waitlist • {savedCount} just now
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((v, idx) => (
            <article
              key={v.id}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[var(--surface)] shadow-drop transition hover:border-[var(--border-strong)] hover:shadow-[0_16px_40px_rgba(10,25,49,0.12)]"
              style={{ animation: `slideUp 0.8s cubic-bezier(0.16,1,0.3,1) ${idx * 0.08}s both` }}
            >
              {/* divine glow */}
              <div
                className="pointer-events-none absolute -top-20 left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full blur-[60px] transition group-hover:blur-[70px]"
                style={{ background: v.glow, opacity: 0.9 }}
              />

              {/* Image */}
              <div className="relative h-[260px] w-full overflow-hidden rounded-[24px] rounded-b-none">
                <img
                  src={v.image}
                  alt={`${v.title} ${v.kicker}`}
                  className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-[1.06]"
                />
                {/* second image for tailors */}
                {v.image2 && (
                  <div className="absolute bottom-3 right-3 h-[88px] w-[88px] overflow-hidden rounded-[16px] border border-[#D4CBB8] shadow-drop">
                    <img src={v.image2} alt={`${v.title} final`} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-1 left-1 rounded-full bg-[#0A1931]/85 px-1.5 py-0.5 font-mono text-[8px] uppercase text-white">Final</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                {/* top badges */}
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F0E9DB] px-2.5 py-1 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: v.accent }} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0A1931]">{v.label}</span>
                  </div>
                  <div className="inline-flex rounded-full bg-white px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-black">
                    {v.trust}
                  </div>
                </div>
                {/* bottom title over image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="inline-flex rounded-full border border-[#D4CBB8] bg-[#FFFDF7]/95 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0A1931]">
                    {v.kicker}
                  </div>
                  <h3 className="font-poppins mt-2 text-[20px] font-[800] leading-[1] tracking-[-0.02em] text-white">{v.title}</h3>
                </div>
              </div>

              {/* content */}
              <div className="flex flex-1 flex-col p-5">
                {/* stats */}
                <div className="grid grid-cols-3 gap-2">
                  {v.stats.map((s) => (
                    <div key={s.v + s.l} className="rounded-[12px] border border-[#D4CBB8] bg-[#F0E9DB] px-2.5 py-2">
                      <div className="font-poppins text-[14px] font-[800] leading-none">{s.v}</div>
                      <div className="mt-1 font-mono text-[9px] uppercase leading-[1.1] tracking-[0.08em] text-[#5B6470]">{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* features */}
                <div className="mt-4 grid gap-2">
                  {v.features.map((f) => (
                    <div key={f.text} className="flex items-start gap-2.5 rounded-[10px] bg-white/[0.02] px-2.5 py-2">
                      <span
                        className="mt-0.5 grid h-5 w-5 place-items-center rounded-full border text-[11px]"
                        style={{ borderColor: `${v.accent}55`, background: `${v.accent}15`, color: v.accent }}
                      >
                        {f.icon}
                      </span>
                      <span className="font-mono text-[11px] leading-[1.35] text-[#5B6470]">{f.text}</span>
                    </div>
                  ))}
                </div>

                {/* seo */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {v.seo.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full border border-[#D4CBB8] bg-white/[0.02] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-faint)]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-5">
                  {activeJoin === v.id ? (
                    <div className="rounded-[16px] border border-[#D4CBB8] bg-[#F0E9DB] p-3 animate-slide">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5B6470]">Join {v.title} waitlist</span>
                        <button onClick={() => setActiveJoin(null)} className="text-[12px] text-[var(--text-faint)]">✕</button>
                      </div>
                      <input
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Your name — J. Martinez"
                        className="mb-2 w-full rounded-[10px] border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-2 font-mono text-[12px] outline-none placeholder:text-[var(--text-faint)] focus:border-[#D4CBB8]"
                      />
                      <input
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="Phone / WhatsApp"
                        className="mb-3 w-full rounded-[10px] border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-2 font-mono text-[12px] outline-none placeholder:text-[var(--text-faint)] focus:border-[#D4CBB8]"
                      />
                      <button
                        disabled={busy}
                        onClick={() => handleJoinSubmit(v.id)}
                        className="flex w-full items-center justify-center rounded-full px-4 py-2.5 font-poppins text-[13px] font-[700] text-black transition hover:scale-[1.01] disabled:opacity-50"
                        style={{ background: "var(--gradient-m)" }}
                      >
                        {busy ? "Saving..." : `Join as ${v.title.split(" ")[1]} — Free`}
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <Link
                        to={v.href}
                        className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-[13px] font-poppins text-[13px] font-[700] text-black transition hover:scale-[1.01]"
                        style={{ background: "var(--gradient-m)" }}
                      >
                        <span>{v.cta}</span>
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0A1931] text-[11px] text-white transition group-hover/btn:translate-x-0.5">↗</span>
                      </Link>
                      <button
                        onClick={() => setActiveJoin(v.id)}
                        className="w-full rounded-full border border-[#D4CBB8] bg-white px-4 py-2 font-mono text-[11px] text-[#5B6470] hover:text-[#0A1931]"
                      >
                        Join waitlist
                      </button>
                    </div>
                  )}
                  {showSuccess === v.id && (
                    <div className="mt-2 rounded-full bg-[#8FFF4A]/15 px-3 py-1 text-center font-mono text-[10px] text-[#8FFF4A]">✓ Added to Trust Ledger — touch of GOD recorded</div>
                  )}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition group-hover:opacity-100" style={{ background: `linear-gradient(180deg, transparent 60%, ${v.glow})` }} />
            </article>
          ))}
        </div>
      </section>

      {/* WHY ONE OS */}
      <section className="relative mx-auto max-w-[1440px] px-4 pb-12 md:px-8 md:pb-20">
        <div className="relative overflow-hidden rounded-[28px] border border-[#D4CBB8] bg-[var(--surface)] p-6 md:p-10">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full opacity-[0.14] blur-[80px]" style={{ background: "var(--gradient-m)" }} />
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#5B6470]">
                <span className="h-1 w-1 rounded-full bg-[#FFE600]" />
                Why One OS For All Trades
              </div>
              <h3 className="font-poppins mt-4 text-[28px] font-[800] leading-[0.95] tracking-[-0.04em] md:text-[44px]">
                Same Pipeline.
                <br />
                Same Trust.
                <br />
                <span className="gradient-text">Different Craft.</span>
              </h3>
              <p className="mt-4 max-w-[560px] text-[15px] leading-[1.6] text-[#5B6470]">
                Whether you sew a wedding dress in Oldham or fix a Worcester Bosch boiler at 68°C, the OS is identical:
                <span className="text-[#0A1931]"> UPRM Pipeline</span> captures the work,
                <span className="text-[#0A1931]"> WorkCut</span> proves it frame by frame,
                <span className="text-[#0A1931]"> Trust Ledger</span> keeps the face honest,
                <span className="text-[#0A1931]"> MFC Gift Economy</span> lets people gift a Crown, Scissors, or Wrench,
                and <span className="text-[#0A1931]"> Escrow</span> holds money until work is holy.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { t: "UPRM Pipeline", d: "Capture → Upload → Review → Monetize. Tailor or plumber, same flow." },
                  { t: "WorkCut", d: "Before/After, OBD2 live, Boiler pressure 1.2 bar — proof, not promise." },
                  { t: "Trust Ledger", d: "4.9 average because face = work. No filters, no fake reviews." },
                  { t: "MFC + Escrow", d: "Gifts + secured pay. £25 fade to £8,400 build, same reverence." },
                ].map((b) => (
                  <div key={b.t} className="rounded-[14px] border border-[#D4CBB8] bg-white/[0.02] p-4">
                    <div className="font-poppins text-[13px] font-[700]">{b.t}</div>
                    <div className="mt-1 font-mono text-[11px] leading-[1.4] text-[#5B6470]">{b.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid gap-3">
                <div className="glass rounded-[18px] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#5B6470]">Touch of GOD — Holy Trades Manifesto</div>
                  <div className="mt-3 font-poppins text-[16px] font-[700] leading-[1.25]">
                    “We do not build categories. We honor crafts. The tailor’s lace, the mechanic’s torque wrench, the builder’s brick,
                    the barber’s line, the electrician’s RCD 30mA, the plumber’s Gas Safe 123456 — each is prayer in motion.”
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <img src={logo2} alt="" className="h-7 w-7 rounded-full object-cover" />
                    <span className="font-mono text-[11px] text-[#5B6470]">My Face Profile • No.9 • Reverent Work</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { n: "247", l: "Tailors", c: "#8FFF4A" },
                    { n: "189", l: "Mechanics", c: "#00E5C0" },
                    { n: "124", l: "Builders", c: "#FFE600" },
                    { n: "98", l: "Barbers", c: "#FF8A00" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-[14px] border border-[#D4CBB8] bg-[#F0E9DB] p-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: s.c }} />
                        <span className="font-poppins text-[18px] font-[800] leading-none">{s.n}</span>
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#5B6470]">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[16px] bg-[#F0E9DB] p-3 font-mono text-[10px] leading-[1.5] text-[#5B6470]">
                  <div className="text-[#0A1931]">UPRM_LOG // No.9 Verticals</div>
                  <div>{">"} tailor_oldham: WorkCut uploaded 173924.webp + 180641.webp ✓</div>
                  <div>{">"} mechanic_ol8: OBD2 scan P0301 fixed, video proof ✓</div>
                  <div>{">"} builder_oldham: blueprint $2,480, team sync ✓</div>
                  <div>{">"} barber_fade: live gift ✂️ 25 MFC received ✓</div>
                  <div>{">"} electrician: BS 7671 cert 230V RCD 30mA ✓</div>
                  <div>{">"} plumber: Gas Safe 123456, 1.2 bar, Pass ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="mx-auto max-w-[1440px] px-4 pb-10 md:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-[#D4CBB8] bg-[#F0E9DB] p-6 md:p-10">
          <div className="absolute inset-0 opacity-[0.18]" style={{ background: "var(--gradient-m)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="relative">
            <div className="mx-auto max-w-[900px] text-center">
              <div className="inline-flex rounded-full bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-black">No.9 of 24 • Verticals — Touch of GOD</div>
              <h3 className="font-poppins mt-5 text-[32px] font-[800] leading-[0.9] tracking-[-0.04em] text-[#0A1931] md:text-[56px]">
                Find Your Trade —
                <br />
                <span className="text-black" style={{ WebkitTextStroke: "1px white" }}>
                  Start Showing Free
                </span>
              </h3>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={scrollToGrid}
                  className="inline-flex h-[52px] items-center justify-center rounded-full bg-white px-8 font-poppins text-[15px] font-[800] text-black"
                >
                  Browse 6 Trades →
                </button>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-4 py-2 font-mono text-[11px] text-[#5B6470]">
                  <span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" />
                  iOS / Android Coming Soon • Web Live Now
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
                {[
                  "1,247 pros",
                  "6 trades",
                  "12K Projects",
                  "4.9 Avg Trust",
                  "Touch of GOD in Every Craft",
                ].map((t) => (
                  <div key={t} className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-4 py-2 font-mono text-[11px] text-[#5B6470]">
                    {t}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-3 opacity-60">
                <img src={logo1} alt="logo" className="h-8 w-8 rounded-full object-cover" />
                <span className="font-poppins text-[12px] font-[700] tracking-[-0.02em] text-[#0A1931]">My Face Profile</span>
                <span className="font-mono text-[10px] text-[#5B6470]">© 2026 • Oldham • Manchester • Built for hands that work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#D4CBB8] py-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
        Production Marketing Page • No.9 of 24 • Verticals Hub • Poppins 700/800 • Inter • JetBrains Mono • Glassmorphism • Touch of GOD
      </footer>
    </div>
  );
}
