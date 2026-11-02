import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logoM from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoM2 from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import { Play, Sparkles, Zap, Gift, ShieldCheck, ShoppingBag, Wrench, Scissors, Hammer, ChefHat, ArrowUpRight, BadgeCheck, Clock, MapPin } from "lucide-react";
import PagesDirectory from "../components/PagesDirectory";

const WorkFeed = [
  { name: "Aisha Khan", role: "Tailor • Bridal", img: "🧵", color: "#8FFF4A", trust: "4.9", dist: "0.3mi", task: "Sewing Silk Lehenga — Day 3/5" },
  { name: "Marcus Reid", role: "Mechanic • Toyota Specialist", img: "🔧", color: "#00E5C0", trust: "5.0", dist: "1.1mi", task: "Diagnosing Hybrid Prius Noise" },
  { name: "Elena Voss", role: "Builder • Renovations", img: "🧱", color: "#00BFFF", trust: "4.8", dist: "0.8mi", task: "3-Bed Loft Conversion Bricklaying" },
  { name: "Chef Luca", role: "Chef • Private Dining", img: "👨‍🍳", color: "#FFE600", trust: "4.9", dist: "2.4mi", task: "Plating 12-Course Tasting Menu" },
];

export default function HomePage() {
  const feedRef = useRef<HTMLDivElement>(null);
  const [showDemo, setShowDemo] = React.useState(false);
  const demoVideoRef = useRef<HTMLVideoElement>(null);
  const tryPlayDemo = async () => {
    setShowDemo(true);
    try {
      // create audible feedback via Web Audio if video fails
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = 880;
        g.gain.value = 0.0001;
        o.connect(g); g.connect(ctx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
        o.stop(ctx.currentTime + 0.4);
        setTimeout(()=>ctx.close(), 600);
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
      className="min-h-screen w-full bg-[#050505] text-white overflow-x-clip selection:bg-[#8FFF4A]/30 antialiased"
    >
      {/* Ambient Mesh */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] rounded-full opacity-30 blur-[120px]" style={{ background: "radial-gradient(60% 60% at 50% 50%, #8FFF4A 0%, transparent 70%)" }} />
        <div className="absolute top-[10%] right-[-15%] w-[60%] h-[50%] rounded-full opacity-20 blur-[120px]" style={{ background: "radial-gradient(60% 60% at 50% 50%, #00BFFF 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[80%] h-[60%] rounded-full opacity-15 blur-[140px]" style={{ background: "radial-gradient(60% 60% at 50% 50%, #FF8A00 0%, transparent 70%)" }} />
      </div>

      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 top-[var(--safe-area-inset-top)] border-b border-white/[0.06] backdrop-blur-[20px] bg-black/40"
      >
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-[10px] overflow-hidden bg-black border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.5)]">
              <img src={logoM} alt="M logo" className="h-full w-full object-cover scale-[1.7]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            </div>
            <div className="flex items-baseline gap-[1px] tracking-[-0.02em]">
              <span className="text-[18px] font-bold text-white">My</span>
              <span className="text-[18px] font-bold gradient-text-m">Face</span>
              <span className="text-[18px] font-bold text-white ml-[2px]">Profile</span>
              <span className="ml-2 hidden lg:inline-flex text-[10px] font-medium tracking-[0.18em] text-white/40 uppercase border border-white/10 rounded-full px-2 py-[2px]">OS</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-[13.5px] font-medium tracking-[-0.01em] text-white/60">
            <Link to="/how-it-works" className="hover:text-white transition">How it Works</Link>
            <Link to="/work-os" className="hover:text-white transition">Work OS</Link>
            <Link to="/projects" className="hover:text-white transition flex items-center gap-1.5">Projects <span className="h-4 px-1.5 rounded-full bg-white/10 text-[10px] text-white/70 flex items-center">LIVE</span></Link>
            <Link to="/pricing" className="hover:text-white transition">Pricing</Link>
            <Link to="/sitemap" className="hover:text-white transition">All 24+</Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-white/40">
              <span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" />
              Oldham • Live
            </div>
            <Link to="/signup" className="group relative inline-flex items-center justify-center h-9 px-5 rounded-full gradient-bg-m text-black text-[13.5px] font-semibold tracking-[-0.01em] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_8px_20px_rgba(143,255,74,0.35)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_12px_28px_rgba(143,255,74,0.45)] transition-all">
              <span className="relative z-10 flex items-center gap-1.5">Join as Pro <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform" /></span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <section className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-6 pt-10 lg:pt-[72px] pb-16 lg:pb-24 items-start">
          {/* LEFT TEXT */}
          <div className="relative z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur px-3.5 py-1.5 text-[11.5px] font-medium tracking-[0.02em] text-white/70">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#8FFF4A] opacity-75 animate-[pulseLive_1.8s_ease-in-out_infinite]" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8FFF4A]" />
              </span>
              OS for Real Work • From VisaguideOS to My Face Profile
              <span className="ml-1 h-4 px-2 rounded-full bg-[#8FFF4A]/15 text-[#8FFF4A] text-[10px] font-bold tracking-widest">BETA</span>
            </div>

            <h1 className="display mt-6 text-[42px] lg:text-[72px] font-[800] leading-[0.9] tracking-[-0.05em]">
              <span className="block text-white">Your Work Is</span>
              <span className="block text-white">Your Face.</span>
              <span className="block gradient-text-m mt-1">Not Your CV.</span>
            </h1>

            <p className="mt-6 max-w-[560px] text-[16px] lg:text-[18px] leading-[1.5] text-white/60 tracking-[-0.01em]">
              The Work Social OS where tailors, mechanics, builders and 1,000+ pros{" "}
              <span className="text-white font-medium">SHOW</span> their work,{" "}
              <span className="text-white font-medium">CONNECT</span> with customers who need it, and{" "}
              <span className="text-white font-medium">GROW</span> with gifts, bookings and trust.
              <span className="inline-flex ml-2 align-middle">
                <span className="h-5 px-2 rounded-full bg-white/10 text-[11px] text-white/70 border border-white/10">UPRM • WorkCut • Bot Army</span>
              </span>
            </p>

            {/* CTA Row */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="group relative inline-flex h-[48px] items-center justify-center rounded-full px-7 gradient-bg-m text-black font-semibold text-[15px] tracking-[-0.01em] shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_16px_40px_rgba(143,255,74,0.35)] hover:brightness-[1.05] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.28),0_20px_48px_rgba(143,255,74,0.5)] transition-all">
                <span className="flex items-center gap-2">Start Showing — Free <span className="h-6 w-6 rounded-full bg-black/10 grid place-items-center"><ArrowUpRight className="w-4 h-4" /></span></span>
                <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ animation: "shimmer 2s linear infinite" }} />
                </div>
              </Link>
              <Link to="/sitemap" className="inline-flex h-[48px] items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] backdrop-blur px-6 text-[14px] font-medium text-white/80 hover:bg-white/[0.10] hover:text-white transition">
                Browse all 24 pages
              </Link>
              <button onClick={tryPlayDemo} className="inline-flex h-[48px] items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] backdrop-blur px-6 text-[14px] font-medium text-white/80 hover:bg-white/[0.10] hover:text-white transition">
                <span className="h-8 w-8 rounded-full bg-white text-black grid place-items-center shadow"><Play className="w-4 h-4 fill-black ml-[1px]" /></span>
                Watch Demo
              </button>
            </div>
            {/* hidden demo video for media audit */}
            <div className="absolute -left-[9999px] top-0 h-1 w-1 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
              <video ref={demoVideoRef} playsInline muted loop preload="metadata" />
              <audio preload="none" />
            </div>
            {showDemo && (
              <div className="mt-4 rounded-[14px] border border-[#8FFF4A]/20 bg-[#8FFF4A]/10 px-3.5 py-2.5 text-[12.5px] text-[#8FFF4A] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" />
                Work Feed Demo playing — Live Studio active • 127 watching • TrustScore 4.9
                <button onClick={()=>setShowDemo(false)} className="ml-auto h-6 px-2.5 rounded-full bg-black/40 border border-white/10 text-[11px] text-white/70 hover:text-white">Close</button>
              </div>
            )}

            {/* Download Row */}
            <div className="mt-7 flex flex-wrap items-start gap-3">
              <div className="flex gap-3">
                {/* iOS badge */}
                <div className="relative overflow-hidden rounded-[12px] border border-white/10 bg-white text-black px-3.5 py-2.5 pr-8 w-[168px] opacity-90">
                  <div className="flex items-center gap-2">
                    <div className="text-[18px] leading-none"></div>
                    <div className="leading-[1]">
                      <div className="text-[9px] tracking-wide uppercase opacity-60 font-semibold">Download on the</div>
                      <div className="text-[14px] font-bold tracking-tight -mt-[1px]">App Store</div>
                    </div>
                  </div>
                  <div className="coming-soon-ribbon">Coming Soon</div>
                </div>
                <div className="relative overflow-hidden rounded-[12px] border border-white/10 bg-white text-black px-3.5 py-2.5 pr-8 w-[168px] opacity-90">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-[4px] bg-black text-white grid place-items-center text-[12px] font-bold">▶</div>
                    <div className="leading-[1]">
                      <div className="text-[9px] tracking-wide uppercase opacity-60 font-semibold">Get it on</div>
                      <div className="text-[13px] font-bold tracking-tight -mt-[1px]">Google Play</div>
                    </div>
                  </div>
                  <div className="coming-soon-ribbon">Coming Soon</div>
                </div>
              </div>

              {/* QR placeholder */}
              <div className="h-[62px] w-[62px] rounded-[10px] bg-white p-[6px] border border-white/10 grid grid-cols-5 gap-[2px] opacity-80">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`rounded-[1px] ${[0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24].includes(i) || Math.random()>0.55 ? "bg-black" : "bg-white"}`} />
                ))}
              </div>
              <div className="text-[11px] leading-[1.3] text-white/40 max-w-[120px] pt-1">Scan to join waitlist<br/>iOS & Android<br/><span className="text-white/70">2,417 queued</span></div>
            </div>

            {/* Trust row */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/[0.06] pt-6">
              <div className="flex -space-x-2">
                {["#8FFF4A","#00E5C0","#00BFFF","#FFE600"].map((c,i)=>(
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-[#050505] grid place-items-center text-[11px] font-bold" style={{ background: c, color: "#000" }}>{["A","M","E","J"][i]}</div>
                ))}
                <div className="h-8 w-8 rounded-full border-2 border-[#050505] bg-white/10 backdrop-blur grid place-items-center text-[10px] font-bold text-white">+1.2k</div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[12.5px]">
                <span className="inline-flex items-center gap-1.5 text-white/70"><BadgeCheck className="w-4 h-4 text-[#8FFF4A]" /> 1,247 pros in Oldham</span>
                <span className="h-3 w-px bg-white/10 hidden sm:block" />
                <span className="inline-flex items-center gap-1 text-white/70">⭐ 4.9 Trust</span>
                <span className="h-3 w-px bg-white/10 hidden sm:block" />
                <span className="inline-flex items-center gap-1.5 text-white/70"><span className="h-1.5 w-1.5 rounded-full bg-[#00BFFF] animate-pulse" /> 12K Projects</span>
                <span className="inline-flex items-center gap-1 ml-2 rounded-full border border-[#8FFF4A]/20 bg-[#8FFF4A]/10 px-2.5 py-1 text-[11px] font-medium text-[#8FFF4A]"><ShieldCheck className="w-3.5 h-3.5" /> Verified OS</span>
              </div>
            </div>
          </div>

          {/* RIGHT INFOGRAPHIC */}
          <div className="relative lg:h-[760px] w-full">
            {/* Large blurred M glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[720px] w-[720px] rounded-full blur-[80px] opacity-40" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(143,255,74,0.22), rgba(0,229,192,0.16) 35%, rgba(0,191,255,0.10) 60%, transparent 75%)" }} />
            <div className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] opacity-[0.08] mix-blend-screen">
              <img src={logoM2} alt="M large glow" className="w-full h-full object-contain scale-[1.2] blur-[1px]" />
            </div>

            {/* Cards wrapper */}
            <div className="relative flex flex-col gap-4 lg:block lg:h-full">
              {/* Card 1 - LIVE */}
              <div
                className="card-drop float-slow glass-strong rounded-[20px] p-3.5 lg:absolute lg:top-[0%] lg:left-[6%] lg:w-[320px] shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)_inset] overflow-hidden"
                style={{ animationDelay: "0.05s" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-[#8FFF4A] text-black grid place-items-center font-bold text-[13px]">A</div>
                    <div className="leading-tight">
                      <div className="text-[13px] font-semibold tracking-tight text-white flex items-center gap-1.5">Aisha • Tailor <span className="inline-flex items-center gap-1 rounded-full bg-[#FF2D55] px-2 py-[2px] text-[10px] font-bold text-white"><span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />LIVE</span></div>
                      <div className="text-[11px] text-white/50">Oldham • 127 watching</div>
                    </div>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-white/10 grid place-items-center"><Scissors className="w-3.5 h-3.5 text-white/70" /></div>
                </div>
                <div className="relative rounded-[14px] overflow-hidden bg-[#0e0e0e] border border-white/10 h-[132px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8FFF4A]/20 via-transparent to-[#00BFFF]/20" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="h-14 w-14 rounded-full bg-white/90 text-black grid place-items-center shadow-xl"><Play className="w-6 h-6 fill-black ml-[2px]" /></div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="rounded-full bg-black/70 backdrop-blur px-2.5 py-1 text-[10px] font-medium text-white border border-white/10">Day 3/5 Wedding Dress • 82%</div>
                    <div className="h-6 w-6 rounded-full bg-[#8FFF4A] text-black grid place-items-center"><Zap className="w-3.5 h-3.5" /></div>
                  </div>
                  <div className="absolute top-2 left-2 flex gap-1">
                    <div className="h-1.5 w-8 rounded-full bg-white/30 overflow-hidden"><div className="h-full w-[82%] bg-[#8FFF4A]" /></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  </div>
                </div>
              </div>

              {/* Card 2 - Project */}
              <div
                className="card-drop float-slow-2 glass rounded-[20px] p-3.5 lg:absolute lg:top-[15%] lg:right-[0%] lg:w-[360px] shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
                style={{ animationDelay: "0.18s" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-semibold">3-Bed Renovation</div>
                  <div className="text-[10px] font-bold tracking-widest px-2 py-1 rounded-full bg-[#FFE600] text-black">BEFORE / AFTER</div>
                </div>
                <div className="relative rounded-[14px] overflow-hidden h-[126px] border border-white/10 bg-[#121212] grid grid-cols-2">
                  <div className="relative border-r border-white/10 p-3">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Before</div>
                    <div className="mt-2 h-[64px] rounded-[8px] bg-white/5 border border-dashed border-white/10 grid place-items-center text-white/20"><Hammer className="w-6 h-6" /></div>
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-white/10 grid place-items-center text-[10px]">🏚️</div>
                  </div>
                  <div className="relative p-3">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">After</div>
                    <div className="mt-2 h-[64px] rounded-[8px] bg-gradient-to-br from-[#8FFF4A]/30 to-[#00BFFF]/30 border border-white/10 grid place-items-center text-white"><Sparkles className="w-6 h-6" /></div>
                    <div className="absolute bottom-2 right-2 flex -space-x-1.5">
                      {["#8FFF4A","#00BFFF","#FFE600","#FF8A00"].map((c,i)=>(
                        <div key={i} className="h-6 w-6 rounded-full border-2 border-[#121212] text-[10px] grid place-items-center font-bold" style={{ background: c, color: "#000" }}>{i===0?"A":i===1?"B":i===2?"E":"P"}</div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white text-black grid place-items-center shadow-lg border border-black/10 text-[11px] font-bold">◑</div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-white/50">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Chadderton • 4 days</span>
                  <span className="text-[#8FFF4A] font-medium">£12.4k secured →</span>
                </div>
              </div>

              {/* Card 3 - Booking */}
              <div
                className="card-drop float-slow glass rounded-[20px] p-4 lg:absolute lg:top-[54%] lg:left-[0%] lg:w-[300px]"
                style={{ animationDelay: "0.32s" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] tracking-widest text-white/40 uppercase font-medium flex items-center gap-1.5"><Clock className="w-3 h-3" /> Emergency</div>
                    <div className="mt-1 text-[15px] font-semibold tracking-tight">Boiler Callout £80 • Booked</div>
                  </div>
                  <div className="h-8 w-8 rounded-full gradient-bg-m grid place-items-center text-black"><Wrench className="w-4 h-4" /></div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-9 rounded-full bg-white text-black grid place-items-center text-[12px] font-semibold">Escrow • Stripe Protected</div>
                  <div className="h-9 w-9 rounded-full bg-white/10 border border-white/10 grid place-items-center"><BadgeCheck className="w-4 h-4 text-[#8FFF4A]" /></div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-white/50">
                  <div className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" /> Mike • 10min ETA • Trust 4.9
                </div>
              </div>

              {/* Card 4 - Gift */}
              <div
                className="card-drop float-slow-3 glass-strong rounded-[20px] p-4 lg:absolute lg:top-[66%] lg:right-[4%] lg:w-[300px] border border-[#FFE600]/20 shadow-[0_0_40px_rgba(255,230,0,0.15)]"
                style={{ animationDelay: "0.46s" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-full bg-[#FFE600] text-black grid place-items-center"><Gift className="w-4 h-4" /></div>
                  <div className="text-[12px] font-semibold">MFC Gift: Crown 👑</div>
                  <div className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-[#FFE600]/15 text-[#FFE600] font-bold">+100 MFC</div>
                </div>
                <div className="text-[13px] leading-[1.35] text-white/80">“Thank you for fixing my boiler at 11pm! You saved our winter.”</div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-white/10 grid place-items-center text-[11px]">M</div>
                  <div className="text-[11px] text-white/60">from Mike • Verified • 2m ago</div>
                  <div className="ml-auto flex gap-1">
                    <span className="text-[12px]">🔥</span><span className="text-[12px]">🙏</span>
                  </div>
                </div>
                {/* gift shower dots */}
                <div className="pointer-events-none absolute -top-2 right-6 flex gap-1">
                  <span className="animate-[floatY_2s_ease-in-out_infinite]">✨</span>
                  <span className="animate-[floatY_2.3s_ease-in-out_infinite]">🎉</span>
                </div>
              </div>

              {/* Card 5 - Trust */}
              <div
                className="card-drop float-slow glass rounded-[18px] p-3.5 lg:absolute lg:bottom-[6%] lg:left-[14%] lg:w-[320px]"
                style={{ animationDelay: "0.60s" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white text-black grid place-items-center font-bold text-[12px]">4.9</div>
                    <div className="leading-tight">
                      <div className="text-[12.5px] font-semibold">TrustScore 4.9 • 63 verified jobs</div>
                      <div className="text-[11px] text-white/50">89% On-Time • £0 disputes</div>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#8FFF4A]" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { k: "On-Time", v: "89%" },
                    { k: "Response", v: "<8m" },
                    { k: "Repeat", v: "72%" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-[10px] bg-white/[0.06] border border-white/10 px-2.5 py-2">
                      <div className="text-[11px] text-white/40">{s.k}</div>
                      <div className="text-[13px] font-semibold text-white">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 6 - Shop */}
              <div
                className="card-drop float-slow-2 glass rounded-[18px] p-3 lg:absolute lg:top-[44%] lg:left-[46%] lg:w-[220px] rotate-[1.2deg] hover:rotate-0 transition-transform duration-500"
                style={{ animationDelay: "0.74s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-[10px] bg-gradient-to-br from-[#8FFF4A] to-[#00E5C0] grid place-items-center text-black"><ShoppingBag className="w-5 h-5" /></div>
                  <div className="leading-tight">
                    <div className="text-[12px] font-semibold">Silk Fabric</div>
                    <div className="text-[11px] text-white/50">Premium • 12m left</div>
                  </div>
                  <div className="ml-auto text-[12px] font-bold">£45/m</div>
                </div>
                <div className="mt-3 h-8 rounded-full bg-white text-black text-[12px] font-semibold grid place-items-center">Shop Now →</div>
              </div>
            </div>

            {/* Mobile hint */}
            <div className="lg:hidden mt-2 flex items-center justify-center gap-2 text-[11px] text-white/30"><span className="h-px w-10 bg-white/10" /> live dropping cards <span className="h-px w-10 bg-white/10" /></div>
          </div>
        </section>

        {/* SECOND SECTION - Pillars */}
        <section id="how" className="relative border-t border-white/[0.06] py-16 lg:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] tracking-widest uppercase text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A]" /> OS Pillars • SHOW • CONNECT • GROW
            </div>
            <div className="text-[12px] text-white/40">Inspired by Roadagel infographics • Built for real pros</div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
            {[
              {
                id: "SHOW",
                color: "#8FFF4A",
                icon: "▶",
                title: "Show Your Work",
                desc: "Timeline, Live Studio, Project, WorkCut CapCut-like editor. Your work is searchable, live, and trust-stamped.",
                bullets: ["Timeline • Every job = card", "Live Studio • 127 watching", "WorkCut • Auto-captions & cuts"],
                card: (
                  <div className="mt-5 rounded-[14px] border border-white/10 bg-[#0f0f0f] p-3">
                    <div className="h-20 rounded-[10px] bg-gradient-to-br from-[#8FFF4A]/30 to-transparent border border-white/10 grid place-items-center text-white/40"><Play className="w-6 h-6" /></div>
                    <div className="mt-2 flex gap-2"><div className="h-2 w-12 rounded-full bg-[#8FFF4A]" /><div className="h-2 w-8 rounded-full bg-white/10" /></div>
                  </div>
                ),
              },
              {
                id: "CONNECT",
                color: "#FFE600",
                icon: "◍",
                title: "Connect With Need",
                desc: "UPRM Orchestrator, Pipeline Kanban, Discovery Bot, 10mi Nearby. Need finds you — not the other way.",
                bullets: ["UPRM • Need → Booking → Trust", "Pipeline • Kanban of real jobs", "Nearby • 10mi radius heatmap"],
                card: (
                  <div className="mt-5 rounded-[14px] border border-white/10 bg-[#0f0f0f] p-3 grid grid-cols-3 gap-2">
                    {["Need","Quote","Booked"].map((s,i)=>(
                      <div key={s} className={`rounded-[10px] border p-2 ${i===2?"bg-[#FFE600] text-black border-[#FFE600]":"bg-white/[0.04] border-white/10"}`}>
                        <div className="text-[10px] opacity-60">{s}</div>
                        <div className="text-[12px] font-semibold">{i===0?"Leak":i===1?"£80":"Mike"}</div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "GROW",
                color: "#FF8A00",
                icon: "◐",
                title: "Grow With Trust",
                desc: "MFC Coins, Gifts, Escrow, Boost. Turn trust into income — gifts, rebooks, and paid boosts.",
                bullets: ["MFC Coins • Gift economy", "Escrow • Stripe protected", "Boost • TrustScore amplifies"],
                card: (
                  <div className="mt-5 rounded-[14px] border border-white/10 bg-[#0f0f0f] p-3 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#FFE600] to-[#FF8A00] grid place-items-center text-black font-bold">100</div>
                    <div><div className="text-[12px] font-semibold">Gift Received</div><div className="text-[11px] text-white/50">Crown 👑 • From Mike</div></div>
                    <div className="ml-auto h-7 px-3 rounded-full bg-white text-black text-[11px] font-bold grid place-items-center">Boost</div>
                  </div>
                ),
              },
            ].map((p) => (
              <div key={p.id} className="group relative rounded-[24px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 lg:p-7 overflow-hidden hover:border-white/15 transition">
                <div className="pointer-events-none absolute -top-24 -right-24 h-[200px] w-[200px] rounded-full blur-[40px] opacity-20" style={{ background: p.color }} />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full grid place-items-center text-black font-bold text-[14px]" style={{ background: p.color }}>{p.icon}</div>
                  <div className="text-[11px] tracking-[0.18em] uppercase text-white/40 font-bold">{p.id}</div>
                  <div className="ml-auto h-6 w-6 rounded-full border border-white/10 grid place-items-center opacity-60 group-hover:opacity-100 transition"><ArrowUpRight className="w-3.5 h-3.5" /></div>
                </div>
                <h3 className="mt-5 text-[22px] font-bold tracking-tight leading-[1.1]">{p.title}</h3>
                <p className="mt-3 text-[13.5px] leading-[1.5] text-white/55">{p.desc}</p>
                {p.card}
                <div className="mt-5 space-y-2">
                  {p.bullets.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-[12px] text-white/60"><div className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />{b}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* THIRD - Work Feed */}
        <section id="projects" className="border-t border-white/[0.06] py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-white/40"><span className="h-px w-8 bg-white/20" /> Live Work Feed</div>
              <h2 className="mt-3 text-[32px] lg:text-[44px] font-bold tracking-tight leading-[0.95]">Real work, happening<br/>right now in Oldham.</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/60"><div className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" /> 47 LIVE now</div>
              <button onClick={() => { feedRef.current?.scrollBy({ left: -320, behavior: "smooth" }); const el = document.getElementById('feed-pos'); if(el) el.textContent = Math.max(0, (feedRef.current?.scrollLeft||0)-320).toString(); }} className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.06] grid place-items-center hover:bg-white/[0.10] transition active:scale-95">‹</button>
              <button onClick={() => { feedRef.current?.scrollBy({ left: 320, behavior: "smooth" }); const el = document.getElementById('feed-pos'); if(el) el.textContent = ((feedRef.current?.scrollLeft||0)+320).toString(); }} className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.06] grid place-items-center hover:bg-white/[0.10] transition active:scale-95">›</button>
              <span id="feed-pos" className="sr-only">0</span>
            </div>
          </div>

          <div ref={feedRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {WorkFeed.map((w) => (
              <div key={w.name} data-parallax className="snap-start shrink-0 w-[300px] lg:w-[340px] rounded-[22px] border border-white/10 bg-[#0f0f0f] overflow-hidden group hover:border-white/15 transition-all duration-500">
                <div className="relative h-[190px] bg-[#141414] overflow-hidden">
                  <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(60% 60% at 30% 20%, ${w.color}55, transparent 70%)` }} />
                  <div className="absolute inset-0 grid place-items-center text-[64px]">{w.img}</div>
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="rounded-full bg-black/60 backdrop-blur border border-white/10 px-2.5 py-1 text-[11px] font-medium flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />LIVE • 127</div>
                    <div className="rounded-full bg-white text-black px-2.5 py-1 text-[11px] font-bold">{w.trust} ★</div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="rounded-full bg-black/70 backdrop-blur px-3 py-1 text-[11px] text-white border border-white/10">{w.task}</div>
                    <div className="h-7 w-7 rounded-full bg-white text-black grid place-items-center"><ArrowUpRight className="w-4 h-4" /></div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full text-black grid place-items-center font-bold text-[13px]" style={{ background: w.color }}>{w.name[0]}</div>
                    <div className="leading-tight">
                      <div className="text-[13.5px] font-semibold tracking-tight">{w.name}</div>
                      <div className="text-[11px] text-white/50 flex items-center gap-1"><MapPin className="w-3 h-3" />{w.role} • {w.dist}</div>
                    </div>
                    <div className="ml-auto h-8 px-3 rounded-full bg-white text-black text-[12px] font-semibold grid place-items-center">Book</div>
                  </div>
                </div>
              </div>
            ))}
            {/* CTA card */}
            <div className="snap-start shrink-0 w-[300px] lg:w-[340px] rounded-[22px] border border-dashed border-white/15 bg-transparent p-6 grid place-items-center text-center">
              <div>
                <div className="mx-auto h-12 w-12 rounded-full gradient-bg-m grid place-items-center text-black"><Sparkles className="w-6 h-6" /></div>
                <div className="mt-4 text-[16px] font-semibold tracking-tight">Show your work next</div>
                <div className="mt-2 text-[13px] text-white/50">Join 1,247 pros — free WorkCut editor included</div>
                <div className="mt-4 h-9 rounded-full bg-white text-black text-[13px] font-semibold grid place-items-center px-6">Start Showing</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOURTH - UPRM etc teaser */}
        <section id="workos" className="border-t border-white/[0.06] py-16 lg:py-24">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-widest text-white/50">Work OS • UPRM • WorkCut • Bot Army • MFC</div>
              <h2 className="mt-5 text-[34px] lg:text-[48px] font-bold leading-[0.95] tracking-tight">The OS that turns<br/>every job into <span className="gradient-text-m">compounding trust.</span></h2>
              <p className="mt-5 text-[14.5px] leading-[1.6] text-white/55 max-w-[480px]">Not another marketplace. A full Work Operating System — from first need to gift. Orchestrated by bots, edited like CapCut, secured like Stripe.</p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { k: "UPRM", v: "Need → Booking → Trust → Gift loop", c: "#8FFF4A" },
                  { k: "WorkCut", v: "CapCut for work — auto captions, b-roll, trust watermark", c: "#00E5C0" },
                  { k: "Bot Army", v: "Discovery, Quote, Nudge, Rebook — 24/7", c: "#00BFFF" },
                  { k: "MFC", v: "Gift coins that become real £ boosts", c: "#FFE600" },
                ].map((f) => (
                  <div key={f.k} className="rounded-[16px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full" style={{ background: f.c }} /><div className="text-[11px] tracking-widest uppercase font-bold text-white/70">{f.k}</div></div>
                    <div className="mt-2 text-[12.5px] leading-[1.4] text-white/50">{f.v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10"><img src={logoM} alt="M" className="w-full h-full object-cover scale-[1.6]" /></div>
                <div className="text-[12px] leading-[1.3] text-white/50">Built on VisaguideOS lineage<br/><span className="text-white">Roadagel • Visaguideos • My Face Profile</span></div>
              </div>
            </div>

            <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5 lg:p-6 overflow-hidden">
              <div className="pointer-events-none absolute -top-32 -right-32 h-[320px] w-[320px] rounded-full blur-[60px] opacity-20" style={{ background: "var(--gradient-m)" }} />
              {/* mini infographic */}
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-7 rounded-[18px] border border-white/10 bg-[#0e0e0e] p-4">
                  <div className="text-[11px] uppercase tracking-widest text-white/40">UPRM Orchestrator</div>
                  <div className="mt-3 flex items-center gap-2">
                    {["Need","Match","Quote","Book","Done","Gift"].map((s,i)=>(
                      <React.Fragment key={s}>
                        <div className={`h-8 px-2.5 rounded-full grid place-items-center text-[11px] font-medium border ${i===5?"bg-[#FFE600] text-black border-[#FFE600]":i===3?"bg-[#8FFF4A] text-black border-[#8FFF4A]":"bg-white/[0.06] border-white/10 text-white/70"}`}>{s}</div>
                        {i<5 && <div className="h-px w-3 bg-white/10" />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-4 h-[84px] rounded-[12px] bg-white/[0.03] border border-dashed border-white/10 grid place-items-center text-white/20 text-[12px]">Bot Army active • 4 bots routing</div>
                </div>
                <div className="col-span-5 rounded-[18px] border border-white/10 bg-[#0e0e0e] p-4">
                  <div className="text-[11px] uppercase tracking-widest text-white/40">WorkCut Editor</div>
                  <div className="mt-3 flex gap-2">
                    <div className="flex-1 h-[84px] rounded-[10px] bg-gradient-to-br from-[#8FFF4A]/20 to-[#00BFFF]/20 border border-white/10 grid place-items-center"><Scissors className="w-5 h-5 text-white/60" /></div>
                    <div className="w-[72px] space-y-2">
                      <div className="h-6 rounded-full bg-white text-black text-[10px] font-bold grid place-items-center">Auto-Cut</div>
                      <div className="h-6 rounded-full bg-white/10 border border-white/10 text-[10px] grid place-items-center text-white/60">Caption</div>
                      <div className="h-6 rounded-full bg-white/10 border border-white/10 text-[10px] grid place-items-center text-white/60">Trust Mark</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 rounded-[18px] border border-white/10 bg-[#0e0e0e] p-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#FFE600] text-black grid place-items-center font-bold">MFC</div>
                    <div><div className="text-[13px] font-semibold">Gift Economy → Growth</div><div className="text-[11px] text-white/50">100 MFC = £1 boost • Verified gifts rank higher</div></div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-8 px-3 rounded-full bg-white text-black text-[12px] font-semibold grid place-items-center">Escrow Safe</div>
                    <div className="h-8 w-8 rounded-full bg-white/10 border border-white/10 grid place-items-center"><ShieldCheck className="w-4 h-4 text-[#8FFF4A]" /></div>
                  </div>
                  <div className="w-full mt-1 h-2 rounded-full bg-white/10 overflow-hidden flex"><div className="h-full w-[68%] gradient-bg-m" /><div className="h-full w-[22%] bg-[#FFE600]/60" /><div className="h-full w-[10%] bg-white/20" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PagesDirectory title="Open every wired page" />

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#080808]">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12">
          <div className="flex flex-wrap gap-10 justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-[10px] overflow-hidden bg-black border border-white/10"><img src={logoM} alt="M" className="h-full w-full object-cover scale-[1.6]" /></div>
                <div className="flex items-baseline gap-[1px] tracking-[-0.02em]">
                  <span className="text-[16px] font-bold text-white">My</span>
                  <span className="text-[16px] font-bold gradient-text-m">Face</span>
                  <span className="text-[16px] font-bold text-white ml-[1px]">Profile</span>
                </div>
              </div>
              <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-white/50">SHOW • CONNECT • GROW</div>
              <div className="mt-4 text-[12px] text-white/40 max-w-[300px] leading-[1.5]">Work Social OS for tailors, mechanics, builders & 1,000+ pros. From VisaguideOS lineage. Built in Oldham, for everywhere.</div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-[13px]">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Core</div>
                <div className="space-y-2 text-white/60">
                  <Link to="/how-it-works" className="block hover:text-white">How It Works</Link>
                  <Link to="/work-os" className="block hover:text-white">Work OS</Link>
                  <Link to="/live-workshop" className="block hover:text-white">Live Workshop</Link>
                  <Link to="/uprm-command" className="block hover:text-white">UPRM Command</Link>
                  <Link to="/architecture" className="block hover:text-white">Architecture</Link>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Product</div>
                <div className="space-y-2 text-white/60">
                  <Link to="/projects" className="block hover:text-white">Projects</Link>
                  <Link to="/pricing" className="block hover:text-white">Pricing</Link>
                  <Link to="/trust" className="block hover:text-white">Trust & Escrow</Link>
                  <Link to="/app/onboarding" className="block hover:text-white">Onboarding</Link>
                  <Link to="/app/dashboard" className="block hover:text-white">Dashboard</Link>
                  <Link to="/signup" className="block hover:text-white">Sign up</Link>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Trades</div>
                <div className="space-y-2 text-white/60">
                  <Link to="/for-tailors" className="block hover:text-white">Tailors</Link>
                  <Link to="/for-mechanics" className="block hover:text-white">Mechanics</Link>
                  <Link to="/for-builders" className="block hover:text-white">Builders</Link>
                  <Link to="/for-barbers" className="block hover:text-white">Barbers</Link>
                  <Link to="/for-plumbers" className="block hover:text-white">Plumbers</Link>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Company</div>
                <div className="space-y-2 text-white/60">
                  <Link to="/about" className="block hover:text-white">About</Link>
                  <Link to="/careers" className="block hover:text-white">Careers</Link>
                  <Link to="/contact" className="block hover:text-white">Contact</Link>
                  <Link to="/blog" className="block hover:text-white">Blog</Link>
                  <Link to="/sitemap" className="block hover:text-white">Sitemap</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-[11px] text-white/30">
            <div className="flex items-center gap-3">
              <span>© My Face Profile OS • 2026 • Oldham, UK</span>
              <span className="hidden md:inline h-3 w-px bg-white/10" />
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" /> All pages wired</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/legal/privacy" className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 hover:text-white">Privacy</Link>
              <Link to="/legal/terms" className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 hover:text-white">Terms</Link>
              <span className="rounded-full border border-[#8FFF4A]/20 bg-[#8FFF4A]/10 px-2.5 py-1 text-[#8FFF4A]">24+ routes live</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating production badge */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-50 hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-black/70 backdrop-blur px-3.5 py-2 text-[11px] font-medium text-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        <span className="h-6 w-6 rounded-full overflow-hidden border border-white/10"><img src={logoM2} alt="M badge" className="h-full w-full object-cover scale-[1.5]" /></span>
        MyFace OS · use All pages button →
        <span className="ml-2 h-5 px-2 rounded-full gradient-bg-m text-black text-[10px] font-bold grid place-items-center">LIVE</span>
      </div>
    </div>
  );
}
