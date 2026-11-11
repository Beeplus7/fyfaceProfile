import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logoM from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoM2 from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import {
  Play,
  Sparkles,
  Zap,
  Gift,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  Scissors,
  Hammer,
  ArrowUpRight,
  BadgeCheck,
  Clock,
  MapPin,
  Video,
  Wallet,
  Coins,
  Building2,
  Check,
} from "lucide-react";
import PagesDirectory from "../components/PagesDirectory";

const WorkFeed = [
  { name: "Aisha Khan", role: "Tailor • Bridal", img: "🧵", color: "#8FFF4A", trust: "4.9", dist: "0.3mi", task: "Sewing Silk Lehenga — Day 3/5" },
  { name: "Marcus Reid", role: "Mechanic • Toyota Specialist", img: "🔧", color: "#00E5C0", trust: "5.0", dist: "1.1mi", task: "Diagnosing Hybrid Prius Noise" },
  { name: "Elena Voss", role: "Builder • Renovations", img: "🧱", color: "#00BFFF", trust: "4.8", dist: "0.8mi", task: "3-Bed Loft Conversion Bricklaying" },
  { name: "Chef Luca", role: "Chef • Private Dining", img: "👨‍🍳", color: "#FFE600", trust: "4.9", dist: "2.4mi", task: "Plating 12-Course Tasting Menu" },
];

const LIVE_TICKER = [
  "Mechanic gift • 250 MFC",
  "Chef booked in Accra • ₦22,000",
  "Builder booked in Nairobi • KSh 8,500",
  "Braider gift • 400 MFC",
  "Tailor booked in Oldham • £180",
];

export default function HomePage() {
  const feedRef = useRef<HTMLDivElement>(null);
  const [showDemo, setShowDemo] = React.useState(false);
  const demoVideoRef = useRef<HTMLVideoElement>(null);
  const tryPlayDemo = async () => {
    setShowDemo(true);
    try {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = 880;
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
        o.stop(ctx.currentTime + 0.4);
        setTimeout(() => ctx.close(), 600);
      }
      await demoVideoRef.current?.play();
    } catch {}
  };

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cards = el.querySelectorAll("[data-parallax]");
        cards.forEach((c) => {
          const rect = (c as HTMLElement).getBoundingClientRect();
          const center = window.innerWidth / 2;
          const dist = (rect.left + rect.width / 2 - center) / center;
          (c as HTMLElement).style.transform = `perspective(900px) rotateY(${dist * -6}deg) translateZ(0)`;
        });
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-safe-area-inset-root
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }}
      className="min-h-screen w-full bg-[#FFFDF7] text-[#0A0A0A] overflow-x-clip selection:bg-[#FFC300]/35 antialiased"
    >
      {/* Ambient warm mesh — Africa Pay surface */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#FFFDF7]" />
        <div
          className="absolute top-[-18%] left-[-8%] w-[65%] h-[55%] rounded-full opacity-50 blur-[110px]"
          style={{ background: "radial-gradient(60% 60% at 50% 50%, #FFF3C4 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[8%] right-[-12%] w-[55%] h-[48%] rounded-full opacity-40 blur-[110px]"
          style={{ background: "radial-gradient(60% 60% at 50% 50%, #DFF7EE 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-8%] left-[18%] w-[70%] h-[50%] rounded-full opacity-35 blur-[120px]"
          style={{ background: "radial-gradient(60% 60% at 50% 50%, #FFD88A 0%, transparent 70%)" }}
        />
      </div>

      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 top-[var(--safe-area-inset-top)] border-b border-[#EDE7DA] backdrop-blur-[20px] bg-[#FFFDF7]/85"
      >
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-[10px] overflow-hidden bg-[#0A1931] border border-[#D4CBB8] shadow-[0_8px_24px_rgba(10,25,49,0.12)]">
              <img src={logoM} alt="M logo" className="h-full w-full object-cover scale-[1.7]" />
            </div>
            <div className="flex items-baseline gap-[1px] tracking-[-0.02em]">
              <span className="text-[18px] font-bold text-[#0A1931]">My</span>
              <span className="text-[18px] font-bold gradient-text-m">Face</span>
              <span className="text-[18px] font-bold text-[#0A1931] ml-[2px]">Profile</span>
              <span className="ml-2 hidden lg:inline-flex text-[10px] font-medium tracking-[0.18em] text-[#5B6470] uppercase border border-[#D4CBB8] rounded-full px-2 py-[2px] bg-white">
                OS
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-[13.5px] font-medium tracking-[-0.01em] text-[#5B6470]">
            <Link to="/how-it-works" className="hover:text-[#0A1931] transition">
              How it Works
            </Link>
            <Link to="/work-os" className="hover:text-[#0A1931] transition">
              Work OS
            </Link>
            <Link to="/video-to-cash" className="hover:text-[#0A1931] transition flex items-center gap-1.5">
              Video → Cash{" "}
              <span className="h-4 px-1.5 rounded-full bg-[#FFC300] text-[10px] text-[#0A1931] font-bold flex items-center">NEW</span>
            </Link>
            <Link to="/pricing" className="hover:text-[#0A1931] transition">
              Pricing
            </Link>
            <Link to="/sitemap" className="hover:text-[#0A1931] transition">
              All 24+
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-[#5B6470]">
              <span className="h-2 w-2 rounded-full bg-[#00C896] animate-pulse" />
              Oldham → Lagos → Nairobi
            </div>
            <Link
              to="/signup"
              className="group relative inline-flex items-center justify-center h-9 px-5 rounded-full bg-[#FFC300] text-[#0A1931] text-[13.5px] font-extrabold tracking-[-0.01em] shadow-[0_8px_20px_rgba(255,195,0,0.35)] hover:brightness-[1.03] transition-all"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Go Live & Earn <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 lg:px-8">
        {/* ═══ BANNER 1 — Euro classic ═══ */}
        <section className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-6 pt-10 lg:pt-[64px] pb-14 lg:pb-20 items-start">
          <div className="relative z-10">
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="mkt-chip bg-[#FFF8E1]">✦ 1,000+ Pros</span>
              <span className="mkt-chip">Oldham • UK live</span>
              <span className="mkt-chip bg-[#EFFAF6]">Paid in £ • ₦ • KSh • Cedis</span>
            </div>

            <h1 className="display mt-6 text-[42px] lg:text-[68px] font-[800] leading-[0.92] tracking-[-0.05em]">
              <span className="block text-[#0A1931]">Your Work Is</span>
              <span className="block text-[#0A1931]">Your Face.</span>
              <span className="block gradient-text-m mt-1">Not Your CV.</span>
            </h1>

            <p className="mt-6 max-w-[560px] text-[16px] lg:text-[18px] leading-[1.55] text-[#5B6470] tracking-[-0.01em]">
              The Work Social OS where tailors, mechanics, builders and 1,000+ pros{" "}
              <span className="text-[#0A1931] font-semibold">SHOW</span> their work,{" "}
              <span className="text-[#0A1931] font-semibold">CONNECT</span> with customers, and{" "}
              <span className="text-[#0A1931] font-semibold">GROW</span> with gifts, bookings — and now{" "}
              <span className="text-[#0A1931] font-semibold">video-to-cash</span> dataset payouts.
              <span className="inline-flex ml-2 align-middle">
                <span className="h-5 px-2 rounded-full bg-white text-[11px] text-[#5B6470] border border-[#D4CBB8]">
                  UPRM • WorkCut • Bot Army
                </span>
              </span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/signup"
                className="group relative inline-flex h-[48px] items-center justify-center rounded-full px-7 bg-[#FFC300] text-[#0A1931] font-extrabold text-[15px] tracking-[-0.01em] shadow-[0_12px_28px_rgba(255,195,0,0.35)] hover:brightness-[1.04] transition-all"
              >
                <span className="flex items-center gap-2">
                  Start Showing — Free{" "}
                  <span className="h-6 w-6 rounded-full bg-[#0A1931]/10 grid place-items-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </span>
              </Link>
              <Link
                to="/video-to-cash"
                className="inline-flex h-[48px] items-center gap-2.5 rounded-full border-2 border-[#0A1931] bg-white px-6 text-[14px] font-extrabold text-[#0A1931] hover:bg-[#FFF8E1] transition"
              >
                <Coins className="w-4 h-4" />
                See Video → Cash
              </Link>
              <button
                onClick={tryPlayDemo}
                className="inline-flex h-[48px] items-center gap-2.5 rounded-full border border-[#D4CBB8] bg-white px-6 text-[14px] font-medium text-[#5B6470] hover:text-[#0A1931] transition"
              >
                <span className="h-8 w-8 rounded-full bg-[#0A1931] text-white grid place-items-center shadow">
                  <Play className="w-4 h-4 fill-white ml-[1px]" />
                </span>
                Watch Demo
              </button>
            </div>

            <div className="absolute -left-[9999px] top-0 h-1 w-1 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
              <video ref={demoVideoRef} playsInline muted loop preload="metadata" />
            </div>
            {showDemo && (
              <div className="mt-4 rounded-[14px] border border-[#00C896]/30 bg-[#EFFAF6] px-3.5 py-2.5 text-[12.5px] text-[#007A5C] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00C896] animate-pulse" />
                Work Feed Demo — Live Studio active • TrustScore 4.9
                <button
                  onClick={() => setShowDemo(false)}
                  className="ml-auto h-6 px-2.5 rounded-full bg-white border border-[#D4CBB8] text-[11px] text-[#5B6470]"
                >
                  Close
                </button>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#EDE7DA] pt-6">
              <div className="flex -space-x-2">
                {["#8FFF4A", "#00E5C0", "#00BFFF", "#FFE600"].map((c, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-[#FFFDF7] grid place-items-center text-[11px] font-bold"
                    style={{ background: c, color: "#000" }}
                  >
                    {["A", "M", "E", "J"][i]}
                  </div>
                ))}
                <div className="h-8 w-8 rounded-full border-2 border-[#FFFDF7] bg-white grid place-items-center text-[10px] font-bold text-[#0A1931]">
                  +1.2k
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-[#5B6470]">
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-[#00C896]" /> 1,247 pros in Oldham
                </span>
                <span className="inline-flex items-center gap-1">⭐ 4.9 Trust</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00C896]/25 bg-[#EFFAF6] px-2.5 py-1 text-[11px] font-medium text-[#007A5C]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified OS
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT INFOGRAPHIC — Euro cards on cream */}
          <div className="relative lg:h-[720px] w-full">
            <div className="relative flex flex-col gap-4 lg:block lg:h-full">
              <div
                className="card-drop float-slow mkt-card rounded-[20px] p-3.5 lg:absolute lg:top-[0%] lg:left-[6%] lg:w-[320px] overflow-hidden"
                style={{ animationDelay: "0.05s" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-[#8FFF4A] text-black grid place-items-center font-bold text-[13px]">A</div>
                    <div className="leading-tight">
                      <div className="text-[13px] font-semibold tracking-tight flex items-center gap-1.5">
                        Aisha • Tailor{" "}
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FF3B30] px-2 py-[2px] text-[10px] font-bold text-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          LIVE
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5B6470]">Oldham • 127 watching</div>
                    </div>
                  </div>
                  <Scissors className="w-4 h-4 text-[#5B6470]" />
                </div>
                <div className="relative rounded-[14px] overflow-hidden border border-[#D4CBB8] h-[132px] bg-gradient-to-br from-[#FFF8E1] to-[#EFFAF6]">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="h-14 w-14 rounded-full bg-white text-[#0A1931] grid place-items-center shadow-xl border border-[#D4CBB8]">
                      <Play className="w-6 h-6 fill-[#0A1931] ml-[2px]" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-medium border border-[#D4CBB8]">
                      Day 3/5 Wedding Dress • 82%
                    </div>
                    <div className="h-6 w-6 rounded-full bg-[#8FFF4A] text-black grid place-items-center">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="card-drop float-slow-2 mkt-card rounded-[20px] p-3.5 lg:absolute lg:top-[15%] lg:right-[0%] lg:w-[360px]"
                style={{ animationDelay: "0.18s" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-semibold">3-Bed Renovation</div>
                  <div className="text-[10px] font-bold tracking-widest px-2 py-1 rounded-full bg-[#FFC300] text-[#0A1931]">
                    BEFORE / AFTER
                  </div>
                </div>
                <div className="relative rounded-[14px] overflow-hidden h-[126px] border border-[#D4CBB8] bg-[#FFF8E1] grid grid-cols-2">
                  <div className="relative border-r border-[#EDE7DA] p-3">
                    <div className="text-[10px] text-[#5B6470] uppercase tracking-widest">Before</div>
                    <div className="mt-2 h-[64px] rounded-[8px] bg-white border border-dashed border-[#EDE7DA] grid place-items-center text-[#5B6470]/40">
                      <Hammer className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="relative p-3">
                    <div className="text-[10px] text-[#5B6470] uppercase tracking-widest">After</div>
                    <div className="mt-2 h-[64px] rounded-[8px] bg-gradient-to-br from-[#8FFF4A]/30 to-[#00BFFF]/30 border border-[#D4CBB8] grid place-items-center">
                      <Sparkles className="w-6 h-6 text-[#0A1931]" />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#5B6470]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> Chadderton • 4 days
                  </span>
                  <span className="text-[#00C896] font-semibold">£12.4k secured →</span>
                </div>
              </div>

              <div
                className="card-drop float-slow mkt-card rounded-[20px] p-4 lg:absolute lg:top-[54%] lg:left-[0%] lg:w-[300px]"
                style={{ animationDelay: "0.32s" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] tracking-widest text-[#5B6470] uppercase font-medium flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Emergency
                    </div>
                    <div className="mt-1 text-[15px] font-semibold tracking-tight">Boiler Callout £80 • Booked</div>
                  </div>
                  <div className="h-8 w-8 rounded-full gradient-bg-m grid place-items-center text-black">
                    <Wrench className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-9 rounded-full bg-[#0A1931] text-white grid place-items-center text-[12px] font-semibold">
                    Escrow • Protected
                  </div>
                  <div className="h-9 w-9 rounded-full bg-[#EFFAF6] border border-[#D4CBB8] grid place-items-center">
                    <BadgeCheck className="w-4 h-4 text-[#00C896]" />
                  </div>
                </div>
              </div>

              <div
                className="card-drop float-slow-3 mkt-card rounded-[20px] p-4 lg:absolute lg:top-[66%] lg:right-[4%] lg:w-[300px] border border-[#FFC300]/40 shadow-[0_0_40px_rgba(255,195,0,0.15)]"
                style={{ animationDelay: "0.46s" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-full bg-[#FFC300] text-[#0A1931] grid place-items-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div className="text-[12px] font-semibold">MFC Gift: Crown 👑</div>
                  <div className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#7A5A00] font-bold">+100 MFC</div>
                </div>
                <div className="text-[13px] leading-[1.35] text-[#5B6470]">
                  “Thank you for fixing my boiler at 11pm! You saved our winter.”
                </div>
              </div>

              <div
                className="card-drop float-slow mkt-card rounded-[18px] p-3 lg:absolute lg:top-[44%] lg:left-[46%] lg:w-[220px] rotate-[1.2deg]"
                style={{ animationDelay: "0.74s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-[10px] bg-gradient-to-br from-[#8FFF4A] to-[#00E5C0] grid place-items-center text-black">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[12px] font-semibold">Silk Fabric</div>
                    <div className="text-[11px] text-[#5B6470]">Premium • 12m left</div>
                  </div>
                  <div className="ml-auto text-[12px] font-bold">£45/m</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BANNER 2 — Africa Pay You Live (featured) ═══ */}
        <section
          id="pay-live"
          className="relative overflow-hidden rounded-[28px] border border-[#D4CBB8] bg-gradient-to-br from-[#FFF8E1] via-[#FFFDF3] to-[#EFFAF6] p-6 sm:p-10 lg:p-12 mb-6"
        >
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="mkt-chip bg-[#F0E9DB]">✦ Live while at work</span>
                <span className="mkt-chip bg-[#EFFAF6]">Camera ON. Money COMING.</span>
              </div>
              <h2 className="mt-5 text-[32px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[0.98] tracking-[-0.04em] text-[#0A1931]">
                We Pay You For Recording And Going Live While At Work Doing What You Do Best.
              </h2>
              <p className="mt-5 text-[16px] sm:text-[17px] leading-relaxed text-[#5B6470] max-w-[620px]">
                No extra work. No chores. No CV. Tailor is sewing. Mechanic is fixing. Chef is cooking. Builder is
                building. <b className="text-[#0A0A0A]">Camera ON. Money COMING.</b> You get paid twice — once by
                customers who book you, once by AI labs who buy your work video as training data.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 bg-[#FFC300] px-5 py-3.5 rounded-full font-extrabold text-[#0A1931] shadow-lg shadow-yellow-200/60"
                >
                  <Video className="w-[18px] h-[18px]" /> Go Live & Earn Now
                </Link>
                <Link
                  to="/app/live"
                  className="inline-flex items-center gap-2 border-2 border-[#0A1931] px-5 py-3.5 rounded-full font-extrabold bg-white text-[#0A1931]"
                >
                  <Play className="w-[18px] h-[18px]" /> Watch A Pro Live
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-2 overflow-hidden">
                {LIVE_TICKER.map((v) => (
                  <span key={v} className="mkt-chip text-[11px]">
                    ✦ {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Phone-style live mock — warm gradient from Africa file */}
            <div className="relative mx-auto w-full max-w-[320px]">
              <div className="relative rounded-[40px] border-4 border-[#0A1931] overflow-hidden shadow-2xl aspect-[9/18] max-h-[560px] bg-gradient-to-b from-[#FFD88A] via-[#FF9D6B] to-[#4D2B1A]">
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="rounded-full bg-black/50 text-white text-[11px] font-bold px-2.5 py-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B30] animate-pulse" /> LIVE
                  </div>
                  <div className="rounded-full bg-black/40 text-white text-[11px] px-2.5 py-1">Adaeze • Braider</div>
                </div>
                <div className="absolute inset-0 flex items-end justify-center">
                  <div className="w-[78%] h-[58%] rounded-t-[40px] bg-[#FF6B35]/80 border-4 border-white/30 flex items-center justify-center text-white font-extrabold text-center px-4 text-[15px] leading-snug">
                    Your work
                    <br />
                    na your face.
                  </div>
                </div>
                <div className="absolute bottom-5 left-4 right-4 flex gap-2">
                  <div className="flex-1 rounded-full bg-white text-[#0A1931] text-[12px] font-extrabold h-10 grid place-items-center">
                    Gift MFC
                  </div>
                  <div className="flex-1 rounded-full bg-[#FFC300] text-[#0A1931] text-[12px] font-extrabold h-10 grid place-items-center">
                    Book
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ONE VIDEO, TWO PAYS — revenue model ═══ */}
        <section id="earn" className="border-t border-[#EDE7DA] py-14 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3.5 py-1.5 text-[11px] tracking-widest uppercase text-[#5B6470] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFC300]" /> One video, two pays
          </div>
          <h2 className="mt-4 text-[32px] lg:text-[44px] font-extrabold tracking-tight leading-[1.02] text-[#0A1931] max-w-[720px]">
            One video. Two pays. Work you were already doing.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#5B6470] max-w-[620px]">
            Your live work does two jobs at once. Customers see the real thing. AI labs learn from the real thing. You
            get paid for both.
          </p>

          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <div className="mkt-card p-6 sm:p-7 bg-[#E8DFCC]">
              <div className="flex justify-between items-start">
                <span className="text-[12px] font-extrabold tracking-widest text-[#5B6470]">PAY 01 • CUSTOMERS</span>
                <Gift className="w-5 h-5 text-[#FFC300]" />
              </div>
              <h3 className="mt-3 text-[22px] font-extrabold text-[#0A1931]">Bookings, gifts & escrow</h3>
              <p className="mt-2 text-[14px] text-[#5B6470] leading-relaxed">
                Viewers gift MFC, book jobs into Stripe-style escrow, and rebook high TrustScores. Emotional tips + real
                commerce on the same live.
              </p>
              <ul className="mt-4 space-y-2 text-[13px] font-semibold text-[#0A1931]">
                {["MFC gift economy", "Escrow-protected bookings", "Boost when TrustScore rises"].map((t) => (
                  <li key={t} className="flex gap-2 items-center">
                    <Check className="w-4 h-4 text-[#00C896]" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mkt-card p-6 sm:p-7 bg-[#EFFAF6]">
              <div className="flex justify-between items-start">
                <span className="text-[12px] font-extrabold tracking-widest text-[#5B6470]">PAY 02 • AI LABS</span>
                <Building2 className="w-5 h-5 text-[#00C896]" />
              </div>
              <h3 className="mt-3 text-[22px] font-extrabold text-[#0A1931]">Dataset wallet · video-to-cash</h3>
              <p className="mt-2 text-[14px] text-[#5B6470] leading-relaxed">
                Anonymized, quality-checked work video sells as training data. You approve each sale. Hands-only option.
                Withdraw from £5 / ₦5,000.
              </p>
              <ul className="mt-4 space-y-2 text-[13px] font-semibold text-[#0A1931]">
                {["Consent first — you choose what sells", "Face-blur / hands-only", "Transparent dataset split"].map(
                  (t) => (
                    <li key={t} className="flex gap-2 items-center">
                      <Check className="w-4 h-4 text-[#00C896]" /> {t}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            {[
              { n: "01", t: "Go Live In WorkCut", d: "Open Capture Bot, tap Go Live. Steps called out. Hands in view checked.", i: Video },
              { n: "02", t: "Do What You Do Best", d: "Sew, fix, cook, build. Customers watch, gift MFC, and book you.", i: Sparkles },
              { n: "03", t: "Get Paid Twice", d: "Customer escrow + Dataset wallet. Withdraw from £5 / ₦5,000.", i: Wallet },
            ].map((s) => (
              <div key={s.n} className="mkt-card p-6 relative overflow-hidden">
                <span className="text-[64px] font-extrabold text-[#FFC300]/30 absolute right-3 top-1 leading-none">{s.n}</span>
                <div className="w-11 h-11 rounded-2xl bg-[#0A1931] text-white grid place-items-center relative z-10">
                  <s.i size={20} />
                </div>
                <h3 className="text-xl font-extrabold mt-4 relative z-10 text-[#0A1931]">{s.t}</h3>
                <p className="mt-2 text-[13px] text-[#5B6470] relative z-10 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars */}
        <section id="how" className="relative border-t border-[#EDE7DA] py-16 lg:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3.5 py-1.5 text-[11px] tracking-widest uppercase text-[#5B6470]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C896]" /> OS Pillars • SHOW • CONNECT • GROW
            </div>
            <div className="text-[12px] text-[#5B6470]">Euro OS + Africa Pay revenue in one loop</div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
            {[
              {
                id: "SHOW",
                color: "#8FFF4A",
                icon: "▶",
                title: "Show Your Work",
                desc: "Timeline, Live Studio, WorkCut. Your work is searchable, live, and trust-stamped — and now dataset-ready.",
                bullets: ["Timeline • Every job = card", "Live Studio • Go Live & Earn", "WorkCut • Auto-captions & cuts"],
              },
              {
                id: "CONNECT",
                color: "#FFE600",
                icon: "◍",
                title: "Connect With Need",
                desc: "UPRM Orchestrator, Pipeline Kanban, Discovery Bot, 10mi Nearby. Need finds you — not the other way.",
                bullets: ["UPRM • Need → Booking → Trust", "Pipeline • Kanban of real jobs", "Nearby • 10mi radius heatmap"],
              },
              {
                id: "GROW",
                color: "#FF8A00",
                icon: "◐",
                title: "Grow With Two Pays",
                desc: "MFC gifts, escrow bookings, and AI dataset wallet. Turn trust into income — twice per video.",
                bullets: ["MFC Coins • Gift economy", "Escrow • Protected bookings", "Dataset wallet • Video → cash"],
              },
            ].map((p) => (
              <div
                key={p.id}
                className="group relative rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-6 lg:p-7 overflow-hidden hover:shadow-[0_16px_40px_rgba(10,25,49,0.08)] transition"
              >
                <div
                  className="pointer-events-none absolute -top-24 -right-24 h-[200px] w-[200px] rounded-full blur-[40px] opacity-25"
                  style={{ background: p.color }}
                />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full grid place-items-center text-black font-bold text-[14px]" style={{ background: p.color }}>
                    {p.icon}
                  </div>
                  <div className="text-[11px] tracking-[0.18em] uppercase text-[#5B6470] font-bold">{p.id}</div>
                </div>
                <h3 className="mt-5 text-[22px] font-bold tracking-tight leading-[1.1] text-[#0A1931]">{p.title}</h3>
                <p className="mt-3 text-[13.5px] leading-[1.5] text-[#5B6470]">{p.desc}</p>
                <div className="mt-5 space-y-2">
                  {p.bullets.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-[12px] text-[#5B6470]">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Feed */}
        <section id="projects" className="border-t border-[#EDE7DA] py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#5B6470]">
                <span className="h-px w-8 bg-[#EDE7DA]" /> Live Work Feed
              </div>
              <h2 className="mt-3 text-[32px] lg:text-[44px] font-bold tracking-tight leading-[0.95] text-[#0A1931]">
                Real work, happening
                <br />
                right now in Oldham.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1.5 text-[12px] text-[#5B6470]">
                <div className="h-2 w-2 rounded-full bg-[#00C896] animate-pulse" /> 47 LIVE now
              </div>
              <button
                onClick={() => feedRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
                className="h-9 w-9 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] grid place-items-center hover:bg-[#FFF8E1] transition"
              >
                ‹
              </button>
              <button
                onClick={() => feedRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
                className="h-9 w-9 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] grid place-items-center hover:bg-[#FFF8E1] transition"
              >
                ›
              </button>
            </div>
          </div>

          <div ref={feedRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {WorkFeed.map((w) => (
              <div
                key={w.name}
                data-parallax
                className="snap-start shrink-0 w-[300px] lg:w-[340px] rounded-[22px] border border-[#D4CBB8] bg-[#F0E9DB] overflow-hidden group hover:shadow-[0_16px_40px_rgba(10,25,49,0.08)] transition-all duration-500"
              >
                <div className="relative h-[190px] bg-[#FFF8E1] overflow-hidden">
                  <div className="absolute inset-0 opacity-50" style={{ background: `radial-gradient(60% 60% at 30% 20%, ${w.color}55, transparent 70%)` }} />
                  <div className="absolute inset-0 grid place-items-center text-[64px]">{w.img}</div>
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="rounded-full bg-[#0A1931]/75 backdrop-blur border border-white/20 px-2.5 py-1 text-[11px] font-medium flex items-center gap-1.5 text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />
                      LIVE • 127
                    </div>
                    <div className="rounded-full bg-white text-[#0A1931] px-2.5 py-1 text-[11px] font-bold">{w.trust} ★</div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] text-[#0A1931] border border-[#D4CBB8]">
                      {w.task}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full text-black grid place-items-center font-bold text-[13px]" style={{ background: w.color }}>
                      {w.name[0]}
                    </div>
                    <div className="leading-tight">
                      <div className="text-[13.5px] font-semibold tracking-tight text-[#0A1931]">{w.name}</div>
                      <div className="text-[11px] text-[#5B6470] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {w.role} • {w.dist}
                      </div>
                    </div>
                    <div className="ml-auto h-8 px-3 rounded-full bg-[#0A1931] text-white text-[12px] font-semibold grid place-items-center">
                      Book
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="snap-start shrink-0 w-[300px] lg:w-[340px] rounded-[22px] border border-dashed border-[#EDE7DA] bg-transparent p-6 grid place-items-center text-center">
              <div>
                <div className="mx-auto h-12 w-12 rounded-full gradient-bg-m grid place-items-center text-black">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="mt-4 text-[16px] font-semibold tracking-tight text-[#0A1931]">Show your work next</div>
                <div className="mt-2 text-[13px] text-[#5B6470]">Join free — WorkCut + dataset wallet included</div>
                <Link to="/signup" className="mt-4 h-9 rounded-full bg-[#FFC300] text-[#0A1931] text-[13px] font-extrabold grid place-items-center px-6">
                  Start Showing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing teaser from Africa */}
        <section className="border-t border-[#EDE7DA] py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="mkt-card p-7 sm:p-9 bg-[#0A1931] text-white">
              <div className="text-xs font-extrabold tracking-widest text-white/60">PRICING FOR PROS</div>
              <h3 className="text-[32px] font-extrabold mt-2 leading-tight">
                Free to join.
                <br />
                Built to pay you.
              </h3>
              <ul className="mt-5 space-y-2 font-bold text-sm">
                {["Free to join", "0% to go live", "You keep 100% of tips", "Small escrow fee on bookings only", "Dataset split transparent"].map(
                  (v) => (
                    <li key={v} className="flex gap-2 items-center">
                      <Check className="w-4 h-4 text-[#FFC300]" /> {v}
                    </li>
                  ),
                )}
              </ul>
              <Link to="/pricing" className="mt-7 inline-flex h-11 items-center px-5 rounded-full bg-[#FFC300] text-[#0A1931] font-extrabold">
                Open pricing →
              </Link>
            </div>
            <div className="mkt-card p-7 sm:p-9">
              <div className="text-xs font-extrabold tracking-widest text-[#5B6470]">B2B DATASET STORE</div>
              <h3 className="text-[28px] font-extrabold mt-2 leading-tight text-[#0A1931]">
                Buy verified work video hours for AI labs.
              </h3>
              <p className="mt-3 text-[14px] text-[#5B6470] leading-relaxed">
                Tailor, Mechanic, Chef and Builder datasets. Quality-checked, labelled, diverse. Real work — not staged
                tasks. Pros consent first.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {["Tailor", "Mechanic", "Chef", "Builder"].map((v) => (
                  <span key={v} className="mkt-chip !px-4 !py-2">
                    {v}
                  </span>
                ))}
              </div>
              <Link to="/contact" className="mt-7 inline-flex h-11 items-center px-5 rounded-full border-2 border-[#0A1931] font-extrabold text-[#0A1931]">
                Talk to AiKOVA →
              </Link>
            </div>
          </div>
        </section>

        {/* Work OS teaser */}
        <section id="workos" className="border-t border-[#EDE7DA] py-16 lg:py-24">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1 text-[11px] uppercase tracking-widest text-[#5B6470]">
                Work OS • UPRM • WorkCut • Dataset Wallet
              </div>
              <h2 className="mt-5 text-[34px] lg:text-[48px] font-bold leading-[0.95] tracking-tight text-[#0A1931]">
                The OS that turns
                <br />
                every job into <span className="gradient-text-m">compounding trust.</span>
              </h2>
              <p className="mt-5 text-[14.5px] leading-[1.6] text-[#5B6470] max-w-[480px]">
                Not another marketplace. A full Work Operating System — from first need to gift to dataset payout.
                Orchestrated by bots, edited like CapCut, secured like Stripe.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { k: "UPRM", v: "Need → Booking → Trust → Gift loop", c: "#8FFF4A" },
                  { k: "WorkCut", v: "CapCut for work — live capture + captions", c: "#00E5C0" },
                  { k: "Bot Army", v: "Discovery, Quote, Nudge, Rebook — 24/7", c: "#00BFFF" },
                  { k: "Video→Cash", v: "Customer escrow + AI dataset wallet", c: "#FFC300" },
                ].map((f) => (
                  <div key={f.k} className="rounded-[16px] border border-[#D4CBB8] bg-[#F0E9DB] p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: f.c }} />
                      <div className="text-[11px] tracking-widest uppercase font-bold text-[#0A1931]">{f.k}</div>
                    </div>
                    <div className="mt-2 text-[12.5px] leading-[1.4] text-[#5B6470]">{f.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[28px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 lg:p-6 overflow-hidden">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 rounded-[18px] border border-[#D4CBB8] bg-[#FFF8E1] p-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#FFC300] text-[#0A1931] grid place-items-center font-bold">2×</div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#0A1931]">Dual revenue on every live</div>
                      <div className="text-[11px] text-[#5B6470]">Bookings + gifts + approved dataset sales</div>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-8 px-3 rounded-full bg-[#0A1931] text-white text-[12px] font-semibold grid place-items-center">
                      Escrow Safe
                    </div>
                    <div className="h-8 px-3 rounded-full bg-[#EFFAF6] border border-[#D4CBB8] text-[12px] font-semibold text-[#007A5C] grid place-items-center">
                      Dataset OK
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-[#D4CBB8]">
                  <img src={logoM} alt="M" className="w-full h-full object-cover scale-[1.6]" />
                </div>
                <div className="text-[12px] leading-[1.3] text-[#5B6470]">
                  Built on VisaguideOS lineage
                  <br />
                  <span className="text-[#0A1931] font-semibold">Roadagel • Visaguideos • My Face Profile • AiKOVA</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PagesDirectory title="Open every wired page" />

      <footer className="border-t border-[#EDE7DA] bg-[#FFF8E1]">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12">
          <div className="flex flex-wrap gap-10 justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-[10px] overflow-hidden bg-[#0A1931] border border-[#D4CBB8]">
                  <img src={logoM} alt="M" className="h-full w-full object-cover scale-[1.6]" />
                </div>
                <div className="flex items-baseline gap-[1px] tracking-[-0.02em]">
                  <span className="text-[16px] font-bold text-[#0A1931]">My</span>
                  <span className="text-[16px] font-bold gradient-text-m">Face</span>
                  <span className="text-[16px] font-bold text-[#0A1931] ml-[1px]">Profile</span>
                </div>
              </div>
              <div className="mt-3 inline-flex rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-[#5B6470]">
                SHOW • CONNECT • GROW • EARN
              </div>
              <div className="mt-4 text-[12px] text-[#5B6470] max-w-[300px] leading-[1.5]">
                Work Social OS — gifts, bookings, and video-to-cash. Built in Oldham, for everywhere.
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-[13px]">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#5B6470]/70 mb-3">Core</div>
                <div className="space-y-2 text-[#5B6470]">
                  <Link to="/how-it-works" className="block hover:text-[#0A1931]">
                    How It Works
                  </Link>
                  <Link to="/video-to-cash" className="block hover:text-[#0A1931]">
                    Video → Cash
                  </Link>
                  <Link to="/work-os" className="block hover:text-[#0A1931]">
                    Work OS
                  </Link>
                  <Link to="/pricing" className="block hover:text-[#0A1931]">
                    Pricing
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#5B6470]/70 mb-3">Product</div>
                <div className="space-y-2 text-[#5B6470]">
                  <Link to="/projects" className="block hover:text-[#0A1931]">
                    Projects
                  </Link>
                  <Link to="/app/dashboard" className="block hover:text-[#0A1931]">
                    Dashboard
                  </Link>
                  <Link to="/signup" className="block hover:text-[#0A1931]">
                    Sign up
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#5B6470]/70 mb-3">Trades</div>
                <div className="space-y-2 text-[#5B6470]">
                  <Link to="/for-tailors" className="block hover:text-[#0A1931]">
                    Tailors
                  </Link>
                  <Link to="/for-mechanics" className="block hover:text-[#0A1931]">
                    Mechanics
                  </Link>
                  <Link to="/for-builders" className="block hover:text-[#0A1931]">
                    Builders
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#5B6470]/70 mb-3">Company</div>
                <div className="space-y-2 text-[#5B6470]">
                  <Link to="/about" className="block hover:text-[#0A1931]">
                    About
                  </Link>
                  <Link to="/contact" className="block hover:text-[#0A1931]">
                    Contact
                  </Link>
                  <Link to="/sitemap" className="block hover:text-[#0A1931]">
                    Sitemap
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#EDE7DA] pt-6 text-[11px] text-[#5B6470]">
            <div className="flex items-center gap-3">
              <span>© My Face Profile OS • 2026 • Oldham, UK</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C896] animate-pulse" /> Video → Cash live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/legal/privacy" className="rounded-full border border-[#D4CBB8] bg-white px-2.5 py-1 hover:text-[#0A1931]">
                Privacy
              </Link>
              <Link to="/legal/terms" className="rounded-full border border-[#D4CBB8] bg-white px-2.5 py-1 hover:text-[#0A1931]">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <div className="pointer-events-none fixed bottom-4 left-4 z-50 hidden lg:flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-white/90 backdrop-blur px-3.5 py-2 text-[11px] font-medium text-[#5B6470] shadow-[0_8px_24px_rgba(10,25,49,0.1)]">
        <span className="h-6 w-6 rounded-full overflow-hidden border border-[#D4CBB8]">
          <img src={logoM2} alt="M badge" className="h-full w-full object-cover scale-[1.5]" />
        </span>
        MyFace OS · cream surface · dual pay
        <span className="ml-2 h-5 px-2 rounded-full bg-[#FFC300] text-[#0A1931] text-[10px] font-bold grid place-items-center">LIVE</span>
      </div>
    </div>
  );
}
