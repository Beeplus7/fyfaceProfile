import { useRef, useState, useEffect } from 'react';

import logoIcon from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoFull from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import barberImg from "../assets/f05e570703efee3a-image_20261029_173914.webp";
import mechanicImg from "../assets/862320100e7b980d-image_20261029_173915.webp";
import buildersImg from "../assets/727cc9fbccc433e9-image_20261029_173918.webp";
import tailorImg from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import kitchenAfterImg from "../assets/ddfcf617e1ff99cd-image_20261029_180640.webp";
import weddingDressImg from "../assets/b4766d628a527e91-image_20261029_180641.webp";
import kitchenBeforeImg from "../assets/6e245bf7565bda6f-image_20261029_180642.webp";
import blueprintImg from "../assets/e2e9e7cd2b263a5f-image_20261029_180643.webp";
import liveStreamImg from "../assets/c580b278bd1bf106-image_20261029_175419.webp";
import giftRainImg from "../assets/9d6013af7e4e2a36-image_20261029_175423.webp";
import reviewImg from "../assets/1f34e182625d0051-image_20261029_181559.webp";
import escrowImg from "../assets/081c08b43602d625-image_20261029_181606.webp";

export default function ProjectDetailPage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(52);
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const updateFromClientX = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(92, Math.max(8, (x / rect.width) * 100));
    setPos(pct);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      updateFromClientX(clientX);
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [dragging]);

  const milestones = [
    {
      id: 1,
      title: "Design & Blueprint",
      date: "10 Oct 2026",
      cost: "£400",
      status: "Completed ✓",
      bg: blueprintImg,
      team: "Sarah K. — Architect",
      desc: "Foundation Plan + Materials List. Lumber 20pcs, Concrete Mix 12 bags, Roofing Nails 5 boxes. Est Total $2,480 approved.",
      video: true,
    },
    {
      id: 2,
      title: "Demolition",
      date: "12 Oct 2026",
      cost: "£650",
      status: "Completed ✓",
      bg: kitchenBeforeImg,
      team: "Oldham Builders — Lead Crew",
      desc: "Strip floral wallpaper, remove 1990s cabinets, expose brick. Dust contained, waste cleared same day.",
      video: true,
    },
    {
      id: 3,
      title: "Build In Progress",
      date: "18 Oct 2026",
      cost: "£3,200",
      status: "In Progress → Done",
      bg: buildersImg,
      isPrimaryImg: true,
      team: "Marcus & Team — Builders",
      desc: "Brick laying, plumbing reroute, electrical for black hood vent. 4-man crew, 6 days.",
      video: false,
    },
    {
      id: 4,
      title: "Final Reveal",
      date: "24 Oct 2026",
      cost: "£4,000",
      status: "Completed ✓",
      bg: kitchenAfterImg,
      bg2: weddingDressImg,
      team: "Elena — Finishing & Styling",
      desc: "White shaker install, marble countertop, matte black hood. Inspiration pulled from couture finishing — craft as worship.",
      video: true,
    },
    {
      id: 5,
      title: "Client Approval",
      date: "26 Oct 2026",
      cost: "Escrow Released",
      status: "Approved 5★",
      bg: reviewImg,
      team: "Client — Verified",
      desc: "Love it! Perfect craftsmanship, delivery was fast. Exactly what I wanted. 5/5 — highly recommend!",
      video: false,
    },
  ];

  const materials = [
    { name: "Lumber (Pine) 2x4", qty: "20 pcs", cost: "£320" },
    { name: "Concrete Mix 50lb", qty: "12 bags", cost: "£180" },
    { name: "Roofing Nails 1-1/4\"", qty: "5 boxes", cost: "£75" },
    { name: "White Shaker Cabinets", qty: "8 units", cost: "£1,200" },
    { name: "Marble Countertop", qty: "3.2m", cost: "£800" },
    { name: "Matte Black Hood 90cm", qty: "1 pc", cost: "£450" },
    { name: "Ceramic Tile + Grout", qty: "24 m²", cost: "£380" },
    { name: "Labor & Disposal", qty: "14 days", cost: "£3,995" },
  ];

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen bg-[#FFFDF7] text-[#0A1931] antialiased overflow-x-clip"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <header
        data-safe-area-sticky-top
        className="sticky z-50 border-b border-[#D4CBB8] bg-[#FFFDF7]/90 backdrop-blur-xl"
        style={{ top: 'var(--safe-area-inset-top)' }}
      >
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[12px] overflow-hidden gradient-m flex items-center justify-center font-black text-black text-[18px] tracking-tighter">
              <img src={logoIcon} alt="My Face Profile logo M icon" className="h-full w-full object-cover mix-blend-multiply opacity-90" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-[Poppins] font-extrabold text-[17px] tracking-tight">My Face Profile</span>
              <span className="hidden md:inline-flex ml-2 mono text-[10px] tracking-[0.18em] uppercase px-2 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[#0A1931]">No.6 of 24</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            {[
              { l: "Home", active: false },
              { l: "How It Works", active: false },
              { l: "Work OS", active: false },
              { l: "UPRM", active: false },
              { l: "Projects", active: true },
              { l: "Pricing", active: false },
            ].map(i => (
              <a key={i.l} href={`#${i.l.toLowerCase().replace(/\s/g,'')}`} className={`text-[13.5px] tracking-tight transition ${i.active ? 'text-[#0A1931] font-semibold border-b border-white pb-0.5' : 'text-[#5B6470] hover:text-[#0A1931]'}`}>
                {i.l}
              </a>
            ))}
            <button className="ml-2 gradient-m text-black font-bold text-[13px] px-4 py-2 rounded-full">List Your Skill</button>
          </nav>

          <button className="md:hidden h-9 w-9 rounded-full bg-[#E8DFCC] border border-[#D4CBB8] grid place-items-center">☰</button>
        </div>

        <div className="border-t border-[#D4CBB8] bg-[#FFF8E1]">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8 h-[40px] flex items-center gap-2 mono text-[11px] text-[#5B6470]">
            <a href="#" className="hover:text-[#0A1931]">Projects</a>
            <span className="text-[#5B6470]">›</span>
            <a href="#" className="hover:text-[#0A1931]">Kitchen Renovation</a>
            <span className="text-[#5B6470]">›</span>
            <span className="text-[#0A1931]">12 Thornbury Rd</span>
            <span className="ml-auto hidden md:flex items-center gap-2 text-[10px]">
              <span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" />
              LIVE ESCROW VERIFIED
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 lg:px-8 pb-24">
        <section className="pt-10 lg:pt-14 grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-start">
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[#0A1931]">Project #PRJ-2847 • Verified • Oldham Builders • 4.8 (127 jobs)</span>
              <span className="mono text-[10px] tracking-[0.18em] uppercase px-2.5 py-1.5 rounded-full bg-[#8FFF4A] text-black font-bold">Touch of GOD • No.6</span>
            </div>

            <h1 className="font-[Poppins] font-[800] leading-[0.95] tracking-[-0.03em] text-[36px] sm:text-[48px] lg:text-[56px]">
              Modern Kitchen
              <span className="block gradient-text">Renovation</span>
              <span className="block text-[24px] sm:text-[30px] font-bold tracking-tight mt-2 text-[#BDBDB2]">1990s → 2024 • 12 Thornbury Rd</span>
            </h1>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] px-4 py-3 flex items-center gap-3">
                <img src={escrowImg} alt="Escrow Secured Stripe proof" className="h-10 w-10 rounded-[10px] object-cover" />
                <div className="leading-tight">
                  <div className="mono text-[10px] text-[#8FFF4A] tracking-[0.18em] uppercase">Escrow Secured</div>
                  <div className="text-[13px] font-semibold">£80 held • Booking confirmed • Stripe</div>
                </div>
              </div>
              <div className="rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] px-4 py-3">
                <div className="mono text-[10px] text-[#5B6470] tracking-[0.18em] uppercase">Location • Duration • Cost</div>
                <div className="text-[13px] font-medium mt-1">12 Thornbury Rd, London SW11 3PT • 14 days • <span className="text-[#0A1931] font-bold">£8,400</span></div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-[18px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                <div className="mono text-[10px] text-[#777] uppercase tracking-[0.18em]">TrustScore</div>
                <div className="font-bold text-[18px] mt-1">98.4<span className="text-[#8FFF4A]">•</span></div>
                <div className="text-[11px] text-[#5B6470]">Completion 98% • On-Time 89%</div>
              </div>
              <div className="rounded-[18px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                <div className="mono text-[10px] text-[#777] uppercase tracking-[0.18em]">Status</div>
                <div className="font-bold text-[15px] mt-1 text-[#8FFF4A]">Completed ✓</div>
                <div className="text-[11px] text-[#5B6470]">Client Approval 5★</div>
              </div>
              <div className="rounded-[18px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 col-span-2">
                <div className="mono text-[10px] text-[#777] uppercase tracking-[0.18em]">Team • Architect + Builder + Electrician + Plumber</div>
                <div className="flex -space-x-2 mt-2">
                  <div className="h-8 w-8 rounded-full border-2 border-[#111] bg-cover bg-center" style={{ backgroundImage: `url(${tailorImg})` }} />
                  <div className="h-8 w-8 rounded-full border-2 border-[#111] bg-cover bg-center" style={{ backgroundImage: `url(${buildersImg})` }} />
                  <div className="h-8 w-8 rounded-full border-2 border-[#111] bg-cover bg-center" style={{ backgroundImage: `url(${mechanicImg})` }} />
                  <div className="h-8 w-8 rounded-full border-2 border-[#111] bg-cover bg-center" style={{ backgroundImage: `url(${barberImg})` }} />
                  <div className="h-8 w-8 rounded-full bg-[#E8DFCC] border-2 border-[#D4CBB8] grid place-items-center text-[10px] font-bold">+3</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })} className="gradient-m text-black font-[Poppins] font-bold text-[14px] px-6 py-3 rounded-full shadow-[0_0_30px_rgba(143,255,74,0.25)] hover:scale-[1.02] transition">Hire This Team — £8.4k</button>
              <button onClick={() => setActiveTab(activeTab === 'overview' ? 'materials' : 'overview')} className="rounded-full bg-[#E8DFCC] border border-[#D4CBB8] px-6 py-3 text-[13px] font-semibold hover:bg-[#D4CBB8] transition">View Ledger</button>
            </div>

            <div className="mt-6 mono text-[11px] text-[#5B6470] leading-relaxed max-w-[520px]">
              Production Marketing Page for My Face Profile — Project Detail [ID] — Touch of GOD. Craft as worship: warm divine glow behind final reveal, reverent finish, holy craft. Investor + customer trust instantly. SEO goldmine.
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-10 h-[240px] w-[240px] rounded-full gradient-m blur-[60px] opacity-20 pointer-events-none" />
            <div
              ref={sliderRef}
              onMouseDown={() => setDragging(true)}
              onTouchStart={() => setDragging(true)}
              className="relative rounded-[24px] overflow-hidden border border-[#D4CBB8] bg-[#F0E9DB] aspect-[4/3] select-none touch-none cursor-ew-resize group"
            >
              <img src={kitchenBeforeImg} alt="Kitchen Before - 1990s floral wallpaper peeling" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#0A1931]/85 backdrop-blur mono text-[10px] tracking-[0.18em] uppercase text-white border border-[#D4CBB8]">Before • 1990s • Peeling</div>

              <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
                <img src={kitchenAfterImg} alt="Kitchen After - modern white kitchen with black hood and marble countertop" className="absolute inset-0 h-full w-full object-cover" style={{ width: `${100 * (100 / pos)}%`, maxWidth: 'none' }} />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#8FFF4A] text-black mono text-[10px] font-bold tracking-[0.18em] uppercase">After • 2024 • Marble + Black Hood</div>
              </div>

              <div className="absolute top-0 bottom-0 w-[2px] bg-white/80 shadow-[0_0_20px_white]" style={{ left: `${pos}%` }}>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-white text-black grid place-items-center font-bold text-[16px] shadow-xl border border-black/10">↔</div>
              </div>

              <div className="absolute bottom-0 inset-x-0 h-[64px] bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between mono text-[10px] text-white/90">
                <span>DRAG TO REVEAL →</span><span>{pos.toFixed(0)}% AFTER</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="rounded-[16px] overflow-hidden border border-[#D4CBB8] aspect-[4/3] relative bg-cover bg-center" style={{ backgroundImage: `url(${kitchenAfterImg})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 mono text-[9px] text-white">FINAL REVEAL</div>
              </div>
              <div className="rounded-[16px] overflow-hidden border border-[#D4CBB8] aspect-[4/3] relative bg-cover bg-center" style={{ backgroundImage: `url(${blueprintImg})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 mono text-[9px] text-white">BLUEPRINT</div>
              </div>
              <div className="rounded-[16px] overflow-hidden border border-[#D4CBB8] aspect-[4/3] relative bg-cover bg-center" style={{ backgroundImage: `url(${reviewImg})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 mono text-[9px] text-[#8FFF4A]">5★ VERIFIED</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 lg:mt-28">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-[Poppins] font-bold text-[28px] lg:text-[36px] tracking-tight">Milestones Timeline — Holy Craft Log</h2>
            <span className="mono text-[11px] text-[#5B6470]">5 MILESTONES • VIDEO BADGE • COST TRACKED</span>
          </div>

          <div className="relative grid lg:grid-cols-[80px_1fr] gap-6">
            <div className="hidden lg:block relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] rounded-full" style={{ background: 'linear-gradient(to bottom, #8FFF4A, #00E5C0, #FFE600, #FF8A00)' }} />
            </div>

            <div className="space-y-6">
              {milestones.map((m, idx) => (
                <div key={m.id} className="group relative rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] p-4 lg:p-5 flex flex-col lg:flex-row gap-5 hover:border-[#C4B89E] transition">
                  {idx === 3 && <div className="divine-glow rounded-[24px]" />}
                  
                  <div className="lg:w-[260px] shrink-0">
                    <div className="relative rounded-[18px] overflow-hidden border border-[#D4CBB8] aspect-[4/3] bg-[#F0E9DB]">
                      {m.isPrimaryImg ? (
                        <img src={buildersImg} alt="Builders laying bricks in progress" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${m.bg})` }} />
                      )}
                      {m.bg2 && idx === 3 && (
                        <img src={weddingDressImg} alt="Wedding dress inspiration for finishing detail" className="absolute bottom-2 right-2 h-[58%] w-[42%] rounded-[12px] border-2 border-white/80 object-cover shadow-xl" />
                      )}
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <span className="px-2 py-1 rounded-full bg-[#0A1931]/85 backdrop-blur mono text-[9px] text-white border border-[#D4CBB8]">{m.status}</span>
                        {m.video && <span className="px-2 py-1 rounded-full bg-[#FFE600] text-black mono text-[9px] font-bold">VIDEO</span>}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-[#E8DFCC] border border-[#D4CBB8] grid place-items-center text-[11px]">{m.id}</div>
                      <div className="mono text-[11px] text-[#5B6470]">{m.date} • {m.cost}</div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-[Poppins] font-bold text-[20px] tracking-tight">{m.title}</h3>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full border border-[#333] bg-cover bg-center" style={{ backgroundImage: `url(${[tailorImg, buildersImg, buildersImg, tailorImg, reviewImg][idx]})` }} />
                        <span className="mono text-[11px] text-[#BEBEB0]">{m.team}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-[14px] leading-[1.6] text-[#B8B8AE]">{m.desc}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[#E8DFCC] border border-[#D4CBB8] text-[#0A1931]">COST TRACKED: {m.cost}</span>
                      <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[#0A1931] border border-[#D4CBB8] text-[#FFE600]">VERIFIED JOB</span>
                      {idx === 4 && <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[#8FFF4A] text-black font-bold">ESCROW RELEASED →</span>}
                    </div>

                    {idx === 3 && (
                      <div className="mt-4 rounded-[14px] bg-[#F0E9DB] border border-[#FFE600]/20 p-3 flex gap-3">
                        <div className="h-10 w-10 rounded-[10px] gradient-m grid place-items-center text-black font-bold">✦</div>
                        <div className="text-[12px] leading-[1.5]">
                          <span className="font-bold text-[#FFE600]">Touch of GOD:</span> <span className="text-[#5B6470]">Warm divine glow behind final reveal — craft as worship. Marble reflects light like an altar. Every seam prayed over.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="materials" className="mt-20 lg:mt-28 grid lg:grid-cols-3 gap-6">
          <div className="rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-[Poppins] font-bold text-[18px]">Materials Ledger</h3>
              <span className="mono text-[10px] px-2 py-1 rounded-full bg-[#E8DFCC] border border-[#D4CBB8] text-[#0A1931]">FROM BLUEPRINT 180643</span>
            </div>
            <div className="rounded-[18px] overflow-hidden border border-[#D4CBB8] mb-4">
              <img src={blueprintImg} alt="Blueprint materials list foundation plan" className="w-full h-[160px] object-cover" />
            </div>
            <div className="space-y-2.5">
              {materials.map(m => (
                <div key={m.name} className="flex items-center justify-between text-[13px] border-b border-[#D4CBB8] py-2 last:border-0">
                  <div>
                    <div className="font-medium text-[#E8E8E0]">{m.name}</div>
                    <div className="mono text-[11px] text-[#5B6470]">{m.qty}</div>
                  </div>
                  <div className="font-semibold text-[#FFE600]">{m.cost}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex justify-between mono text-[12px]">
              <span className="text-[#5B6470]">EST TOTAL</span><span className="font-bold text-[#0A1931]">$2,480 / £2,480</span>
            </div>
          </div>

          <div className="rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] p-6">
            <h3 className="font-[Poppins] font-bold text-[18px] mb-5">Team — Oldham Builders</h3>
            <div className="space-y-4">
              <div className="group rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex items-center gap-3 hover:border-[#C4B89E] cursor-pointer transition">
                <img src={tailorImg} alt="Sarah K Architect" className="h-12 w-12 rounded-[12px] object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13px]">Sarah K. — Architect • Lead Design</div>
                  <div className="mono text-[11px] text-[#5B6470]">47 jobs • TrustScore 98.4</div>
                </div>
                <div className="h-7 w-7 rounded-full bg-[#E8DFCC] border border-[#D4CBB8] grid place-items-center text-[10px] group-hover:bg-white group-hover:text-black transition">↗</div>
              </div>

              <div className="group rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex items-center gap-3 hover:border-[#C4B89E] cursor-pointer transition">
                <div className="h-12 w-12 rounded-[12px] bg-cover bg-center border border-[#D4CBB8]" style={{ backgroundImage: `url(${buildersImg})` }} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13px]">Marcus O. — Builder • Site Lead</div>
                  <div className="mono text-[11px] text-[#5B6470]">127 jobs • TrustScore 97.9</div>
                </div>
                <div className="h-7 w-7 rounded-full bg-[#E8DFCC] border border-[#D4CBB8] grid place-items-center text-[10px]">↗</div>
              </div>

              <div className="group rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex items-center gap-3 hover:border-[#C4B89E] cursor-pointer transition">
                <img src={mechanicImg} alt="David L Electrician" className="h-12 w-12 rounded-[12px] object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13px]">David L. — Electrician • Certified</div>
                  <div className="mono text-[11px] text-[#5B6470]">89 jobs • TrustScore 96.2</div>
                </div>
                <div className="h-7 w-7 rounded-full bg-[#E8DFCC] border border-[#D4CBB8] grid place-items-center text-[10px]">↗</div>
              </div>

              <div className="group rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex items-center gap-3 hover:border-[#C4B89E] cursor-pointer transition">
                <img src={barberImg} alt="Jamal R Plumber" className="h-12 w-12 rounded-[12px] object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13px]">Jamal R. — Plumber • Finishing</div>
                  <div className="mono text-[11px] text-[#5B6470]">64 jobs • TrustScore 95.8</div>
                </div>
                <div className="h-7 w-7 rounded-full bg-[#E8DFCC] border border-[#D4CBB8] grid place-items-center text-[10px]">↗</div>
              </div>
            </div>
            <div className="mt-5 rounded-[14px] gradient-m p-[1px]">
              <div className="rounded-[13px] bg-[#F0E9DB] p-3 flex items-center gap-2">
                <img src={logoFull} alt="My Face Profile full brand logo" className="h-8 w-auto rounded-[6px]" />
                <div className="mono text-[10px] leading-tight text-[#5B6470]">Profiles verified via UPRM • Face + Work OS linked • <span className="text-[#0A1931] font-bold">4.8★ avg</span></div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-[200px] w-[200px] rounded-full bg-[#FFE600]/10 blur-[40px] pointer-events-none" />
            <h3 className="font-[Poppins] font-bold text-[18px] mb-5">Cost Breakdown + Escrow</h3>
            
            <div className="space-y-3">
              {[
                { label: "Materials", pct: 30, color: "#8FFF4A" },
                { label: "Labor", pct: 50, color: "#00E5C0" },
                { label: "Design", pct: 10, color: "#FFE600" },
                { label: "Escrow Fee", pct: 10, color: "#FF8A00" },
              ].map(c => (
                <div key={c.label}>
                  <div className="flex justify-between mono text-[11px] mb-1"><span className="text-[#5B6470]">{c.label}</span><span className="text-[#0A1931] font-bold">{c.pct}%</span></div>
                  <div className="h-2 rounded-full bg-[#E8DFCC] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${c.pct}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[18px] bg-[#F0E9DB] border border-[#D4CBB8] p-4">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-[12px] bg-cover bg-center border border-[#333]" style={{ backgroundImage: `url(${escrowImg})` }} />
                <div>
                  <div className="mono text-[10px] tracking-[0.18em] uppercase text-[#8FFF4A]">Escrow Secured • Stripe</div>
                  <div className="font-bold text-[14px] leading-tight">Booking confirmed £80 held securely</div>
                  <div className="mono text-[11px] text-[#5B6470]">Payment authorized • Held in escrow • Release on approval</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 mono text-[11px]">
                <div className="rounded-[10px] bg-[#F0E9DB] border border-[#D4CBB8] p-2"><span className="text-[#5B6470]">Total Project</span><br/><span className="text-[#0A1931] font-bold text-[14px]">£8,400</span></div>
                <div className="rounded-[10px] bg-[#F0E9DB] border border-[#D4CBB8] p-2"><span className="text-[#5B6470]">Held Now</span><br/><span className="text-[#8FFF4A] font-bold text-[14px]">£80</span></div>
              </div>
            </div>

            <div className="mt-5 mono text-[10px] text-[#5B6470]">Payment authorized • Held in escrow • Booking confirmed • Escrow Secured pattern from 181606</div>
          </div>
        </section>

        <section id="book" className="mt-20 lg:mt-28">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="font-[Poppins] font-bold text-[28px] lg:text-[36px] tracking-tight">Shop & Book This Team</h2>
              <p className="mono text-[12px] text-[#5B6470] mt-2 max-w-[560px]">Pinned products used in project — Project becomes commerce. Every material verifiable, every purchase tracked to build.</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full bg-white text-black font-bold text-[13px] px-5 py-2.5">Request Quote</button>
              <button className="rounded-full gradient-m text-black font-bold text-[13px] px-5 py-2.5">Book Now — Escrow</button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] overflow-hidden group hover:border-[#C4B89E] transition">
              <div className="relative h-[220px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${kitchenAfterImg})` }}>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0A1931]/85 backdrop-blur mono text-[10px] text-white border border-[#D4CBB8]">8 units • Soft Close</div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#8FFF4A] text-black mono text-[10px] font-bold">SHOP NOW</div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[14px]">White Shaker Cabinets</div>
                  <div className="mono text-[11px] text-[#5B6470]">Used in 12 Thornbury Rd • Verified</div>
                </div>
                <div className="font-[Poppins] font-bold text-[16px]">£1,200</div>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] overflow-hidden group hover:border-[#C4B89E] transition">
              <div className="relative h-[220px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${blueprintImg})` }}>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0A1931]/85 backdrop-blur mono text-[10px] text-white border border-[#D4CBB8]">3.2m • Calacatta</div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#8FFF4A] text-black mono text-[10px] font-bold">SHOP NOW</div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[14px]">Marble Countertop</div>
                  <div className="mono text-[11px] text-[#5B6470]">Used in 12 Thornbury Rd • Verified</div>
                </div>
                <div className="font-[Poppins] font-bold text-[16px]">£800</div>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] overflow-hidden group hover:border-[#C4B89E] transition">
              <div className="relative h-[220px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${buildersImg})` }}>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0A1931]/85 backdrop-blur mono text-[10px] text-white border border-[#D4CBB8]">Matte • 720m³/h</div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#8FFF4A] text-black mono text-[10px] font-bold">SHOP NOW</div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[14px]">Black Hood 90cm</div>
                  <div className="mono text-[11px] text-[#5B6470]">Used in 12 Thornbury Rd • Verified</div>
                </div>
                <div className="font-[Poppins] font-bold text-[16px]">£450</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] gradient-m p-[1px]">
            <div className="rounded-[23px] bg-[#F0E9DB] p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-[16px] bg-cover bg-center border border-[#D4CBB8]" style={{ backgroundImage: `url(${buildersImg})` }} />
                <div>
                  <div className="font-[Poppins] font-bold text-[18px]">Hire Oldham Builders for Similar Project</div>
                  <div className="mono text-[12px] text-[#5B6470]">From £6,200 • 14-day avg • 127 jobs • 4.8★ • Escrow protected</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="rounded-full bg-[#E8DFCC] border border-[#D4CBB8] px-6 py-3 text-[13px] font-semibold">View Profile</button>
                <button className="rounded-full bg-white text-black font-bold text-[13px] px-8 py-3">Book Consultation £80</button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 lg:mt-28 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="rounded-[28px] bg-[#F0E9DB] border border-[#D4CBB8] p-6 lg:p-8 relative overflow-hidden">
            <div className="divine-glow opacity-60" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-[#8FFF4A] text-black mono text-[10px] font-bold tracking-[0.18em] uppercase">Verified Review • Trust Ledger</span>
                <span className="mono text-[11px] text-[#5B6470]">5★ • Verified Purchase • Escrow Released</span>
              </div>

              <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                <div className="rounded-[18px] overflow-hidden border border-[#D4CBB8] bg-[#F0E9DB] aspect-[4/5] relative">
                  <img src={reviewImg} alt="Client holding custom wallet with phone showing 5 star verified review" className="h-full w-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent h-[50%]" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="mono text-[9px] text-[#5B6470]">REVIEW CUSTOM WALLET 181559 ADAPTED</div>
                    <div className="text-[12px] font-bold text-[#0A1931] mt-1">Verified Buyer • Phone Review</div>
                  </div>
                </div>
                <div>
                  <div className="flex gap-1 text-[18px]">★★★★★</div>
                  <blockquote className="mt-4 font-[Poppins] font-bold text-[20px] lg:text-[24px] leading-[1.25] tracking-tight">
                    “This kitchen renovation is exactly what I wanted. Perfect craftsmanship, great quality, delivery was fast. 5/5 — highly recommend! — Verified Buyer”
                  </blockquote>
                  <p className="mt-4 text-[13px] leading-[1.6] text-[#B0B0A6]">
                    Client: Sarah T. • 12 Thornbury Rd • London SW11 3PT • Project #PRJ-2847 • Materials: White Shaker + Marble + Black Hood • Escrow: £80 → £8,400 released on approval. Touch of GOD finish — every edge reverent.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-[#E8DFCC] border border-[#D4CBB8] mono text-[11px]">Completion Rate 98%</span>
                    <span className="px-3 py-1.5 rounded-full bg-[#E8DFCC] border border-[#D4CBB8] mono text-[11px]">On-Time 89%</span>
                    <span className="px-3 py-1.5 rounded-full bg-[#8FFF4A] text-black mono text-[11px] font-bold">Verified Jobs 127</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-[#F0E9DB] border border-[#D4CBB8] p-6 lg:p-8">
            <h3 className="font-[Poppins] font-bold text-[18px] mb-6">Trust Ledger — Oldham Builders</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "Completion Rate", v: "98%", sub: "127 jobs" },
                { k: "On-Time", v: "89%", sub: "Avg delay 1.2d" },
                { k: "Verified Jobs", v: "127", sub: "All escrow" },
                { k: "Repeat Customers", v: "34", sub: "27% return" },
                { k: "Response Rate", v: "95%", sub: "< 2h avg" },
                { k: "TrustScore", v: "98.4", sub: "Top 3% London" },
              ].map(s => (
                <div key={s.k} className="rounded-[16px] bg-[#E8DFCC] border border-[#D4CBB8] p-4">
                  <div className="mono text-[10px] tracking-[0.18em] uppercase text-[#5B6470]">{s.k}</div>
                  <div className="font-[Poppins] font-bold text-[22px] mt-1">{s.v}</div>
                  <div className="mono text-[11px] text-[#5B6470]">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-4 flex gap-3">
              <div className="h-12 w-12 rounded-[10px] bg-cover bg-center border border-[#333] shrink-0" style={{ backgroundImage: `url(${escrowImg})` }} />
              <div className="text-[12px] leading-[1.5]">
                <div className="font-bold">Stripe Escrow — Booking Confirmed</div>
                <div className="text-[#5B6470] mono text-[11px]">£80 held securely • Escrow Secured • Payment authorized • Release only on client 5★ approval. Image 181606 proof.</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <img src={giftRainImg} alt="Phone gift rain engagement celebration" className="h-[64px] w-[64px] rounded-[14px] object-cover border border-[#D4CBB8]" />
              <img src={liveStreamImg} alt="Live streaming tripod setup for build documentation" className="h-[64px] w-[64px] rounded-[14px] object-cover border border-[#D4CBB8]" />
              <div className="flex-1 rounded-[14px] bg-[#E8DFCC] border border-[#D4CBB8] p-3 mono text-[10px] text-[#5B6470]">Live build streams • Gift rain • Community verified • Work OS logs</div>
            </div>
          </div>
        </section>

        <section className="mt-20 lg:mt-28">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-[Poppins] font-bold text-[28px] lg:text-[32px] tracking-tight">More Projects by Same Team — SEO Cluster</h2>
            <a href="#" className="mono text-[11px] text-[#8FFF4A] hover:underline">View All 127 →</a>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] overflow-hidden hover:border-[#C4B89E] transition group">
              <div className="relative h-[200px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${tailorImg})` }}>
                <div className="absolute bottom-2 right-2 h-[60%] w-[38%] rounded-[12px] border-2 border-white/70 bg-cover bg-center shadow-lg" style={{ backgroundImage: `url(${weddingDressImg})` }} />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0A1931]/85 backdrop-blur mono text-[10px] text-white border border-[#D4CBB8]">OLDHAM NETWORK</div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-[14px]">Wedding Dress Atelier</div>
                <div className="mono text-[11px] text-[#5B6470] mt-1">Couture • 3 fittings • £2,400 • Verified • Escrow</div>
                <button className="mt-3 w-full rounded-full bg-[#E8DFCC] border border-[#D4CBB8] py-2 mono text-[11px] font-bold hover:bg-[#0A1931] hover:text-white transition">VIEW PROJECT →</button>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] overflow-hidden hover:border-[#C4B89E] transition group">
              <div className="relative h-[200px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${mechanicImg})` }}>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0A1931]/85 backdrop-blur mono text-[10px] text-white border border-[#D4CBB8]">OLDHAM NETWORK</div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-[14px]">Mechanic Diagnostics</div>
                <div className="mono text-[11px] text-[#5B6470] mt-1">Auto • OBD • £120 • Verified • Escrow</div>
                <button className="mt-3 w-full rounded-full bg-[#E8DFCC] border border-[#D4CBB8] py-2 mono text-[11px] font-bold hover:bg-[#0A1931] hover:text-white transition">VIEW PROJECT →</button>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] overflow-hidden hover:border-[#C4B89E] transition group">
              <div className="relative h-[200px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${barberImg})` }}>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0A1931]/85 backdrop-blur mono text-[10px] text-white border border-[#D4CBB8]">OLDHAM NETWORK</div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-[14px]">Fade & Craft — Barber</div>
                <div className="mono text-[11px] text-[#5B6470] mt-1">Fade • Beard • £35 • Verified • Escrow</div>
                <button className="mt-3 w-full rounded-full bg-[#E8DFCC] border border-[#D4CBB8] py-2 mono text-[11px] font-bold hover:bg-[#0A1931] hover:text-white transition">VIEW PROJECT →</button>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[20px] bg-[#F0E9DB] border border-[#D4CBB8] p-5 mono text-[11px] leading-[1.7] text-[#5B6470]">
            <span className="text-[#0A1931] font-bold">SEO goldmine:</span> Kitchen Renovation London SW11, Oldham Builders review, 3-Bed House Renovation 12 Thornbury Rd, White Shaker Cabinets install, Marble Countertop cost UK, Black Hood extraction, Escrow builder London, My Face Profile verified projects. Project Detail [ID] pattern for apps/marketing/app/projects/[id]/page.tsx — Touch of GOD.
          </div>
        </section>

        <section className="mt-20 lg:mt-28 rounded-[32px] gradient-m p-[1px]">
          <div className="rounded-[31px] bg-[#FFFDF7] relative overflow-hidden p-8 lg:p-12">
            <div className="absolute inset-0">
              <div className="absolute -top-20 -left-20 h-[300px] w-[300px] rounded-full bg-[#8FFF4A]/15 blur-[50px]" />
              <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-[#FF8A00]/15 blur-[60px]" />
              <div className="grain absolute inset-0" />
            </div>
            <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
              <div>
                <div className="mono text-[11px] tracking-[0.2em] uppercase text-[#8FFF4A]">No.6 of 24 — Project Detail [ID] — Touch of GOD</div>
                <h2 className="mt-3 font-[Poppins] font-[800] text-[32px] lg:text-[48px] leading-[0.95] tracking-[-0.03em]">
                  Start Your Own Project —<br />
                  <span className="gradient-text">Show Your Work.</span>
                </h2>
                <p className="mt-4 text-[14px] leading-[1.6] text-[#5B6470] max-w-[520px]">
                  Every project becomes portfolio + escrow receipt + holy craft. Build like Oldham Builders — verified, paid securely, remembered. My Face Profile — Work OS + UPRM + Escrow.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="gradient-m text-black font-bold text-[14px] px-8 py-3 rounded-full">Start Project — Free</button>
                  <button className="rounded-full bg-[#E8DFCC] border border-[#D4CBB8] px-6 py-3 text-[13px] font-semibold">iOS Coming Soon</button>
                  <button className="rounded-full bg-[#E8DFCC] border border-[#D4CBB8] px-6 py-3 text-[13px] font-semibold">Android Coming Soon</button>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-[24px] overflow-hidden border border-[#D4CBB8] bg-[#F0E9DB] aspect-[4/3] relative bg-cover bg-center" style={{ backgroundImage: `url(${kitchenAfterImg})` }}>
                  <div className="divine-glow" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-[14px] bg-[#FFFDF7]/95 backdrop-blur border border-[#D4CBB8] p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-[10px] bg-cover bg-center" style={{ backgroundImage: `url(${logoIcon})` }} />
                    <div className="mono text-[11px] leading-tight"><span className="text-[#0A1931] font-bold">My Face Profile</span><br/><span className="text-[#8FFF4A]">Verified • Escrow • Touch of GOD</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-[#D4CBB8] pt-8 flex flex-wrap justify-between gap-4 mono text-[11px] text-[#5B6470]">
          <div>© 2026 My Face Profile • Project Detail [ID] • Production Marketing Page • cream #FFFDF7 • Gradient M #8FFF4A→#00E5C0→#FFE600→#FF8A00 • Poppins Bold 700/800 • Inter • JetBrains Mono</div>
          <div className="flex gap-4"><a href="#" className="hover:text-[#0A1931]">Privacy</a><a href="#" className="hover:text-[#0A1931]">Escrow Terms</a><a href="#" className="hover:text-[#0A1931]">UPRM</a></div>
        </footer>
      </main>
    </div>
  );
}
