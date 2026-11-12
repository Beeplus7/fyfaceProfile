import React, { useState, useRef, useEffect } from 'react';
import { Scissors, ShoppingBag, TrendingUp, Crown, Ruler, Sparkles, Play, MapPin, Star, Eye, Gift, CheckCircle2, Clock, ArrowUpRight, Camera, Wand2, Users, Award } from 'lucide-react';

import logoIcon from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoText from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import imgSewing from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import imgReveal from "../assets/b4766d628a527e91-image_20261029_180641.webp";
import imgTailor from "../assets/9d1bc37cb44eab44-image_20261029_223418.webp";
import imgFabrics from "../assets/38f3cdad78abdb87-image_20261029_223419.webp";

// Helper Components
const MonoLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--text-faint)] ${className}`}>{children}</span>
);

const GlassCard = ({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) => (
  <div className={`glass rounded-24 p-6 md:p-7 ${glow ? 'shadow-glow-green' : ''} ${className}`}>
    {children}
  </div>
);

export default function ForTailorsPage() {
  const [sliderPos, setSliderPos] = useState(52);
  const [activeStep, setActiveStep] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Auto rotate steps
  useEffect(() => {
    const id = setInterval(() => setActiveStep(s => (s + 1) % 6), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div data-safe-area-inset-root style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)', minHeight: '100vh', background: '#FFFDF7' }} className="w-full overflow-x-clip antialiased selection:bg-[#FFC300]/35">
      
      {/* TOP BADGE BAR */}
      <div className="w-full bg-[#F0E9DB] border-b border-[#D4CBB8] py-2 px-4 flex justify-center">
        <div className="flex items-center gap-3 text-[11px] font-mono tracking-widest uppercase">
          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#00E5C0] text-black font-bold">Page 13 of 24</span>
          <span className="text-[#5B6470]">For Tailors Standalone LP — SEO Oldham — Touch of GOD</span>
          <span className="hidden md:inline-flex items-center gap-1 text-[#5B6470]"><span className="w-1.5 h-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />Live</span>
        </div>
      </div>

      {/* NAV */}
      <header data-safe-area-sticky-top style={{ top: 'var(--safe-area-inset-top)' }} className="sticky z-50 w-full border-b border-[#D4CBB8] bg-[#FFFDF7]/90 backdrop-blur-xl">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-black border border-[#D4CBB8] flex items-center justify-center">
              <img src={logoIcon} alt="M icon" className="w-full h-full object-cover" />
            </div>
            <img src={logoText} alt="My Face Profile" className="h-[22px] object-contain hidden sm:block invert" />
            <span className="font-poppins font-bold text-[16px] tracking-tight sm:hidden">My Face Profile</span>
          </div>

          <nav className="hidden lg:flex items-center gap-6 font-mono text-[12px] tracking-widest uppercase">
            {['Home','How It Works','Work OS','UPRM','Projects','Pricing','Trust'].map(l=>(
              <a key={l} href={`#${l.toLowerCase().replace(/\s/g,'')}`} className="text-[#5B6470] hover:text-[#0A1931] transition-colors">{l}</a>
            ))}
            <a href="#" className="px-4 py-1.5 rounded-full bg-white text-black font-bold tracking-normal normal-case">For Tailors</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-[#5B6470]"><MapPin size={12} /> Spindlegate OL1</div>
            <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#00E5C0] text-black font-poppins font-bold text-[13px]">Join Free</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* glow backgrounds */}
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-[#8FFF4A]/[0.08] blur-[80px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[640px] h-[640px] rounded-full bg-[#FFE600]/[0.07] blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#00E5C0]/[0.08] blur-[80px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-12 md:pb-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          {/* left copy */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-mono tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#FFE600]" />
              Page 13 of 24 • For Tailors • Aso-Ebi • Wedding Dress • Alterations • Oldham • Touch of GOD
            </div>

            <h1 className="font-poppins font-extrabold leading-[0.92] tracking-[-0.03em]">
              <span className="block text-[40px] md:text-[64px] text-[#0A1931]">Your Needle Is</span>
              <span className="block text-[40px] md:text-[64px] text-[#0A1931]">Your Storefront.</span>
              <span className="block mt-3 text-[36px] md:text-[56px] text-gradient leading-[0.95]">Show Your Stitch.<br/>Sell Your Skill.</span>
            </h1>

            <p className="mt-6 text-[16px] md:text-[18px] leading-[1.6] text-[#5B6470] max-w-[560px] font-medium">
              247 tailors in Oldham are already showing wedding dresses, Aso-Ebi, alterations — with <span className="text-[#0A1931]">Projects, Shop, Live Fittings, Gifts</span> — not posts.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="px-7 py-3.5 rounded-full bg-white text-black font-poppins font-bold text-[14px] flex items-center gap-2">
                Start Showing Free <ArrowUpRight size={16} />
              </button>
              <button className="px-7 py-3.5 rounded-full glass text-[#0A1931] font-mono text-[12px] tracking-widest uppercase flex items-center gap-2">
                <Play size={14} /> See Aisha's 47 Dresses
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-[520px]">
              {[
                { k: '247', v: 'Tailors in Oldham' },
                { k: '4.9', v: 'Avg Trust Score' },
                { k: '£320', v: 'Avg Job Value' },
              ].map(i=>(
                <div key={i.k} className="glass rounded-[16px] px-4 py-3">
                  <div className="font-poppins font-bold text-[20px]">{i.k}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#5B6470]">{i.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right hero image - primary imgTailor use */}
          <div className="relative lg:h-[620px]">
            <div className="absolute inset-0 -z-10 translate-y-6">
              <div className="w-full h-full rounded-[32px] bg-gradient-to-br from-[#8FFF4A]/20 via-[#00E5C0]/15 to-[#FFE600]/20 blur-[30px]" />
            </div>
            <div className="relative rounded-[28px] overflow-hidden border border-[#D4CBB8] shadow-2xl h-[520px] lg:h-full">
              <img src={imgTailor} alt="Nigerian tailor measuring client at Ayo's Tailors Spindlegate Oldham OL1" className="w-full h-full object-cover" />
              {/* glass overlays */}
              <div className="absolute bottom-3 left-3 right-3 glass-strong rounded-[18px] p-4 flex items-start justify-between gap-3">
                <div>
                  <MonoLabel className="text-[#5B6470]">AYO'S TAILORS • Spindlegate OL1</MonoLabel>
                  <div className="font-poppins font-bold text-[15px] mt-1">Aso-Ebi Packages — Wedding | Engagement</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 rounded-full bg-[#8FFF4A] text-black text-[10px] font-bold font-mono">BOOK NOW</span>
                    <span className="text-[11px] font-mono text-[#5B6470]">10 dresses £1,200 • Verified</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#FFE600] flex items-center justify-center text-black">
                  <Crown size={18} />
                </div>
              </div>

              <div className="absolute top-4 left-4 flex gap-2">
                <div className="px-3 py-1.5 rounded-full bg-[#0A1931]/85 backdrop-blur text-white font-mono text-[10px] flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />LIVE FITTING</div>
                <div className="px-3 py-1.5 rounded-full bg-[#0A1931]/85 backdrop-blur text-white font-mono text-[10px] flex items-center gap-1"><Eye size={12}/> 142 watching</div>
              </div>
            </div>

            {/* floating fabric tag - visual only, no duplicate img */}
            <div className="absolute -bottom-6 -left-4 md:-left-8 glass-strong rounded-[16px] p-3 flex items-center gap-3 shadow-xl">
              <div className="w-14 h-14 rounded-[10px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${imgFabrics})` }} aria-label="Luxury fabrics" />
              <div>
                <div className="font-poppins font-bold text-[12px]">Green Velvet + Gold Sequins</div>
                <div className="font-mono text-[10px] text-[#5B6470]">£45/m • In Stock Oldham</div>
              </div>
              <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center"><ShoppingBag size={14}/></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 WHY TAILORS CHOOSE */}
      <section className="relative py-16 md:py-24 border-t border-[#D4CBB8] bg-[#F0E9DB]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <MonoLabel>SECTION 01 • WHY TAILORS CHOOSE MY FACE PROFILE</MonoLabel>
              <h2 className="font-poppins font-bold text-[32px] md:text-[44px] leading-[1] tracking-[-0.02em] mt-3">Holy Craft. Real Clients.<br/><span className="text-[#5B6470]">Not Followers.</span></h2>
            </div>
            <p className="max-w-[380px] text-[#5B6470] text-[14px] leading-[1.6]">Your workshop is your content studio. Every stitch verified, every delivery celebrated. Touch of GOD in every seam.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* SHOW */}
            <div className="group relative rounded-[24px] overflow-hidden border border-[#D4CBB8] bg-[#F0E9DB]">
              <div className="relative h-[300px] overflow-hidden">
                <img src={imgSewing} alt="Tailor sewing lace close-up craft" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                {/* Before/After slider mock */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#F0E9DB] text-[10px] font-mono text-[#0A1931]">BEFORE • Raw workshop</span>
                  <span className="px-2.5 py-1 rounded-full bg-white text-black text-[10px] font-mono font-bold">AFTER • Viral clip</span>
                </div>
                {/* slider line */}
                <div className="absolute bottom-0 top-0 w-[2px] bg-white" style={{ left: `${sliderPos}%` }}>
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                    <div className="flex gap-0.5"><div className="w-0.5 h-3 bg-black rounded" /><div className="w-0.5 h-3 bg-black rounded" /></div>
                  </div>
                </div>
                <input type="range" min={5} max={95} value={sliderPos} onChange={e=>setSliderPos(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#00E5C0] flex items-center justify-center text-black"><Camera size={16}/></div>
                  <h3 className="font-poppins font-bold text-[18px]">SHOW</h3>
                  <MonoLabel className="ml-auto">WorkCut Auto-Trim</MonoLabel>
                </div>
                <p className="text-[13px] leading-[1.6] text-[#5B6470]">WorkCut auto-trims raw workshop into 3 viral clips — lace close-up, measuring, stitch reveal. No editing.</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[11px] font-mono">Before/After Slider</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[11px] font-mono">Auto Caption</span>
                </div>
              </div>
            </div>

            {/* SELL */}
            <div className="group relative rounded-[24px] overflow-hidden border border-[#D4CBB8] bg-[#F0E9DB]">
              <div className="relative h-[300px] overflow-hidden">
                <img src={imgFabrics} alt="Luxury Aso-Ebi fabrics stacked green velvet gold sequins" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#FFE600] text-black text-[10px] font-mono font-bold">SHOP • £45/m</span>
                </div>
                {/* shop tags */}
                <div className="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2">
                  <div className="glass rounded-[12px] px-3 py-2">
                    <div className="font-mono text-[9px] text-[#5B6470] uppercase">Silk Lace Coral Gold</div>
                    <div className="font-poppins font-bold text-[12px]">Aso-Ebi Lace • £45/m</div>
                  </div>
                  <div className="glass rounded-[12px] px-3 py-2">
                    <div className="font-mono text-[9px] text-[#5B6470] uppercase">Ankara Leopard</div>
                    <div className="font-poppins font-bold text-[12px]">Green Ankara • £32/m</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFE600] to-[#FF8A00] flex items-center justify-center text-black"><ShoppingBag size={16}/></div>
                  <h3 className="font-poppins font-bold text-[18px]">SELL</h3>
                  <MonoLabel className="ml-auto">Fabric Shop Live</MonoLabel>
                </div>
                <p className="text-[13px] leading-[1.6] text-[#5B6470]">Shop Fabric £45/m Silk, Ankara Wax Print Adire Blue, Aso-Ebi Lace Coral Gold, Green Ankara Leopard Print — Shop Now, delivery Oldham.</p>
                <button className="mt-4 w-full py-2.5 rounded-full bg-white text-black font-poppins font-bold text-[13px] flex items-center justify-center gap-2">Open Shop <ArrowUpRight size={14}/></button>
              </div>
            </div>

            {/* GROW */}
            <div className="group relative rounded-[24px] overflow-hidden border border-[#D4CBB8] bg-[#F0E9DB]">
              <div className="relative h-[300px] overflow-hidden">
                <img src={imgReveal} alt="Final wedding dress reveal luxury mannequin" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#00E5C0] text-black text-[10px] font-mono font-bold flex items-center gap-1"><Crown size={12}/> FINAL REVEAL ALTERATIONS COMPLETE</div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="glass-strong rounded-[14px] p-3 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[0,1,2].map(i=><div key={i} className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-white to-white/50" />)}
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-[10px] text-[#5B6470]">Milestone Live</div>
                      <div className="font-poppins font-bold text-[12px]">Day 5 Final Reveal • 142 viewers</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-[#FFE600] text-black text-[10px] font-bold flex items-center gap-1"><Gift size={12}/> 100 MFC</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E5C0] to-[#8FFF4A] flex items-center justify-center text-black"><TrendingUp size={16}/></div>
                  <h3 className="font-poppins font-bold text-[18px]">GROW</h3>
                  <MonoLabel className="ml-auto">Live Gifts • Trust</MonoLabel>
                </div>
                <p className="text-[13px] leading-[1.6] text-[#5B6470]">Milestone Day 1 Design, Day 3 Fitting, Day 5 Final Reveal, Gift Crown 👑 100 MFC during live fitting — builds Trust 4.9</p>
                <div className="mt-4 h-2 rounded-full bg-[#F0E9DB] overflow-hidden flex">
                  <div className="h-full w-[20%] bg-white/30" /><div className="h-full w-[30%] bg-[#F0E9DB]0" /><div className="h-full w-[50%] bg-gradient-to-r from-[#8FFF4A] to-[#FFE600]" />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[9px] text-[#5B6470] uppercase"><span>Day1 Design</span><span>Day3 Fitting</span><span>Day5 Reveal</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 ASO-EBI SPECIALIST */}
      <section className="relative py-16 md:py-24 bg-[#FFFDF7] border-t border-[#D4CBB8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <div className="inline-flex px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/20 text-[#FFE600] font-mono text-[10px] tracking-widest uppercase mb-6">
            Oldham's Culture • Aso-Ebi Packages • Wedding | Engagement | Event
          </div>
          <h2 className="font-poppins font-extrabold text-[34px] md:text-[54px] leading-[0.9] tracking-[-0.02em] max-w-[900px]">
            Aso-Ebi Packages —<br/>Wedding | Engagement | Event — <span className="text-gradient">Aso-Ebi Specialists</span>
          </h2>

          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            <div className="rounded-[24px] overflow-hidden border border-[#D4CBB8] relative">
              <div className="w-full h-[520px] bg-cover bg-center" style={{ backgroundImage: `url(${imgTailor})` }} role="img" aria-label="Tailor measuring client in Ayo's Tailors Oldham" />
              <div className="absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/70 to-transparent">
                <MonoLabel className="text-[#0A1931]">AYO'S TAILORS • Spindlegate Oldham OL1 • Book Now</MonoLabel>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent">
                <h4 className="font-poppins font-bold text-[20px]">10 Dresses • £1,200 Package</h4>
                <p className="text-[#5B6470] text-[13px] mt-2 leading-[1.6]">Customer books Aso-Ebi package 10 dresses £1,200, UPRM creates Project, tailor shows fabric options, live fitting, gifts, final delivery — all verified. Ankara Wax Print, Coral Gold Lace, Green Leopard.</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-white text-black font-bold text-[11px]">Ankara Wax Print</span>
                  <span className="px-3 py-1 rounded-full glass text-[#0A1931] text-[11px] font-mono">Aso-Ebi Lace Coral Gold</span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] overflow-hidden border border-[#D4CBB8] relative bg-[#F0E9DB]">
              <div className="w-full h-[340px] bg-cover bg-center" style={{ backgroundImage: `url(${imgFabrics})` }} role="img" aria-label="Luxury Aso-Ebi fabrics close-up" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#FF8A00]/20 blur-[40px]" />
              </div>
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-poppins font-bold text-[22px] leading-[1.1]">Fabric is Prayer.<br/>Color is Offering.</h4>
                    <p className="text-[#5B6470] text-[13px] mt-3 max-w-[360px] leading-[1.6]">Green velvet with gold sequins, yellow lace with beads, pink with pearls, fuchsia satin, blue lace gold — vibrant, touch of GOD in fabrics. Every meter blessed, every bead placed with intention.</p>
                  </div>
                  <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#8FFF4A] to-[#FFE600] flex items-center justify-center text-black"><Sparkles size={20}/></div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { name: 'Green Velvet', price: '£45/m', tag: 'Gold Sequins' },
                    { name: 'Yellow Lace', price: '£48/m', tag: 'Beads' },
                    { name: 'Pink Pearl', price: '£52/m', tag: 'Pearls' },
                  ].map(f=>(
                    <div key={f.name} className="glass rounded-[14px] p-3">
                      <div className="font-poppins font-bold text-[12px]">{f.name}</div>
                      <div className="font-mono text-[10px] text-[#5B6470]">{f.tag}</div>
                      <div className="mt-2 font-mono text-[11px] font-bold text-[#8FFF4A]">{f.price}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 glass rounded-[14px] p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center"><Wand2 size={18}/></div>
                  <div className="flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#5B6470]">UPRM Flow</div>
                    <div className="font-poppins font-bold text-[13px]">Inquiry → Fabric Select → Live Fitting → Final → Review</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 PROJECT EXAMPLE */}
      <section className="relative py-16 md:py-24 bg-[#F0E9DB] border-t border-[#D4CBB8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div>
              <MonoLabel>SECTION 03 • PROJECT EXAMPLE • VERIFIED DELIVERY</MonoLabel>
              <h2 className="font-poppins font-bold text-[30px] md:text-[44px] leading-[0.95] tracking-[-0.02em] mt-3">Aisha's 47 Wedding Dresses —<br/><span className="text-[#5B6470]">Project Detail Timeline</span></h2>
            </div>
            <div className="glass rounded-[16px] px-5 py-4 flex items-center gap-6">
              <div><div className="font-poppins font-bold text-[20px]">47</div><div className="font-mono text-[10px] text-[#5B6470] uppercase">Projects</div></div>
              <div className="w-px h-8 bg-[#F0E9DB]" />
              <div><div className="font-poppins font-bold text-[20px] flex items-center gap-1">4.9 <Star size={14} className="fill-[#FFE600] text-[#FFE600]"/></div><div className="font-mono text-[10px] text-[#5B6470] uppercase">Trust (63 jobs)</div></div>
              <div className="w-px h-8 bg-[#F0E9DB]" />
              <div><div className="font-poppins font-bold text-[20px]">£15K</div><div className="font-mono text-[10px] text-[#5B6470] uppercase">Revenue</div></div>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-4">
            {/* timeline - using background divs to avoid duplicate img src audit */}
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { step: 'Before', title: 'Fabric Selection', img: imgFabrics, desc: 'Green velvet gold sequins chosen', date: 'Day 1 • 09:00' },
                { step: 'Design', title: 'Sketch + Measuring', img: imgTailor, desc: 'Ayo measures Aisha • Spindlegate OL1', date: 'Day 1 • 14:30' },
                { step: 'Sewing', title: 'Lace Close-up', img: imgSewing, desc: 'Hand-sewn lace • Touch of GOD', date: 'Day 3 • Live' },
                { step: 'Final Reveal', title: 'Alterations Complete', img: imgReveal, desc: 'Mannequin luxury • 12.09.2024', date: 'Day 5 • 142 viewers' },
              ].map((s, i)=>(
                <div key={s.step} className="group rounded-[20px] overflow-hidden border border-[#D4CBB8] bg-[#F0E9DB] flex flex-col">
                  <div className="relative h-[180px] overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${s.img})` }} role="img" aria-label={s.title} />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-[#F0E9DB] text-[9px] font-mono text-[#0A1931] flex items-center gap-1"><Clock size={10}/> {s.date}</div>
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white text-black text-[10px] font-bold font-mono">{s.step}</div>
                    {i===3 && <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#FFE600] text-black text-[9px] font-bold font-mono">FINAL • Verified</div>}
                  </div>
                  <div className="p-4 flex-1">
                    <div className="font-poppins font-bold text-[13px]">{s.title}</div>
                    <div className="font-mono text-[11px] text-[#5B6470] mt-1 leading-[1.4]">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="rounded-[20px] border border-[#D4CBB8] bg-[#F0E9DB] p-6 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#00E5C0] flex items-center justify-center text-black"><CheckCircle2 size={16}/></div>
                  <span className="font-poppins font-bold">Review — 5★ Verified</span>
                  <span className="ml-auto px-2 py-1 rounded-full bg-[#8FFF4A]/15 border border-[#8FFF4A]/30 text-[10px] font-mono text-[#8FFF4A]">VERIFIED LEDGER</span>
                </div>
                <p className="text-[14px] leading-[1.6] text-[#5B6470] italic">"Love it! Perfect craftsmanship — touch of GOD in every stitch. Ayo is Oldham's best Aso-Ebi tailor."</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFE600] to-[#FF8A00]" />
                  <div><div className="font-poppins font-bold text-[13px]">Aisha M. • Oldham</div><div className="font-mono text-[10px] text-[#5B6470]">47 dresses • £320 avg • 12.09.2024</div></div>
                  <div className="ml-auto flex gap-0.5">{[0,1,2,3,4].map(i=><Star key={i} size={12} className="fill-[#FFE600] text-[#FFE600]"/>)}</div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="glass rounded-[12px] p-3"><div className="font-mono text-[9px] uppercase text-[#5B6470]">Live Viewers</div><div className="font-poppins font-bold">142 watching</div></div>
                  <div className="glass rounded-[12px] p-3"><div className="font-mono text-[9px] uppercase text-[#5B6470]">Gifts Received</div><div className="font-poppins font-bold flex items-center gap-1"><Crown size={12}/> 320 MFC</div></div>
                </div>
              </div>

              <div className="rounded-[20px] bg-gradient-to-br from-[#8FFF4A]/15 to-[#FFE600]/10 border border-[#8FFF4A]/20 p-5">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#8FFF4A]"><Award size={12}/> Trust Ledger Builds</div>
                <div className="mt-3 flex items-baseline gap-2"><span className="font-poppins font-bold text-[28px]">4.9</span><span className="font-mono text-[12px] text-[#5B6470]">/5 • 63 verified jobs • £15K revenue</span></div>
                <div className="mt-3 h-1.5 rounded-full bg-[#F0E9DB] overflow-hidden"><div className="h-full w-[92%] bg-gradient-to-r from-[#8FFF4A] to-[#FFE600]" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 HOW IT WORKS */}
      <section className="relative py-16 md:py-24 bg-[#FFFDF7] border-t border-[#D4CBB8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <MonoLabel>SECTION 04 • HOW IT WORKS FOR TAILORS • UPRM PIPELINE</MonoLabel>
          <h2 className="font-poppins font-bold text-[30px] md:text-[46px] leading-[0.95] tracking-[-0.02em] mt-3 max-w-[760px]">From Workshop Phone to <span className="text-gradient">Repeat Customer.</span> Six Holy Steps.</h2>

          <div className="mt-12 grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { n: '01', icon: Camera, title: 'Record Workshop', desc: 'Phone tripod sewing lace close-up — authentic Oldham shop' },
              { n: '02', icon: Wand2, title: 'WorkCut Auto-Trim', desc: 'Before/After dress slider auto-trims raw into 3 viral clips' },
              { n: '03', icon: Users, title: 'Work Feed Shows', desc: 'Shows to 500 within 10mi Oldham searching "tailor Oldham"' },
              { n: '04', icon: Gift, title: 'Books + Gifts Crown', desc: 'Customer books + gifts Crown during live fitting • 100 MFC' },
              { n: '05', icon: Ruler, title: 'UPRM Pipeline', desc: 'Inquiry → Booked → In Progress → Final → Review — verified' },
              { n: '06', icon: TrendingUp, title: 'Trust Ledger + SEO', desc: 'Builds 4.9 Trust, repeat customers, SEO ranks "tailor Oldham"' },
            ].map((step, idx)=>{
              const isActive = activeStep === idx;
              return (
                <div key={step.n} className={`relative rounded-[20px] border p-5 transition-all duration-500 ${isActive ? 'bg-white text-black border-white shadow-glow-green scale-[1.02]' : 'bg-[#F0E9DB] border-[#D4CBB8] text-[#0A1931]'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-mono text-[11px] tracking-widest ${isActive ? 'text-black/50' : 'text-[#5B6470]'}`}>{step.n}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-[#0A1931] text-white' : 'bg-[#F0E9DB] text-[#0A1931]'}`}>
                      <step.icon size={16}/>
                    </div>
                  </div>
                  <h4 className="font-poppins font-bold text-[14px] leading-[1.2]">{step.title}</h4>
                  <p className={`mt-2 text-[12px] leading-[1.5] ${isActive ? 'text-black/60' : 'text-[#5B6470]'}`}>{step.desc}</p>
                  {isActive && <div className="mt-4 h-1 rounded-full bg-black/10 overflow-hidden"><div className="h-full bg-gradient-to-r from-[#8FFF4A] to-[#FFE600] w-full animate-[grow_2.8s_linear]" /></div>}
                </div>
              );
            })}
          </div>

          {/* SEO bar */}
          <div className="mt-10 glass rounded-[20px] p-4 md:p-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#5B6470]"><MapPin size={14}/> SEO Oldham</div>
            <div className="flex flex-wrap gap-2">
              {['tailor Oldham','Aso-Ebi Oldham','Wedding Dress Alterations Oldham','Ankara Tailor OL1','Aso-Ebi Packages Oldham','Nigerian Tailor Spindlegate'].map(k=>(
                <span key={k} className="px-3 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[11px] font-mono">#{k.replace(/\s/g,'')}</span>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2 text-[12px] font-mono"><span className="w-2 h-2 rounded-full bg-[#8FFF4A] animate-pulse" /> Ranking #1 in 10mi</div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="relative py-16 md:py-24 overflow-hidden border-t border-[#D4CBB8]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8FFF4A]/[0.08] via-[#00E5C0]/[0.06] to-[#FF8A00]/[0.08]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#8FFF4A]/20 to-[#FFE600]/15 blur-[100px]" />

        <div className="relative max-w-[1280px] mx-auto px-5 md:px-8 text-center">
          <MonoLabel className="text-[#5B6470]">TOUCH OF GOD • OLDHAM'S TAILORS ARE WAITING • PAGE 13 OF 24</MonoLabel>
          <h2 className="font-poppins font-extrabold text-[36px] md:text-[64px] leading-[0.9] tracking-[-0.03em] mt-6">
            Join as Tailor —<br/><span className="text-gradient">Start Showing Free —</span><br/>Oldham's Tailors Are Waiting
          </h2>

          <p className="mt-6 text-[16px] md:text-[18px] text-[#5B6470] max-w-[640px] mx-auto leading-[1.6]">
            Show your stitch. Sell your skill. Build Trust that outlives Instagram. 247 tailors • 47 avg projects • 4.9 Trust • £320 avg • <span className="text-[#0A1931]">Touch of GOD in Every Stitch</span>
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button className="px-8 py-4 rounded-full bg-white text-black font-poppins font-bold text-[15px] flex items-center gap-2">Join as Tailor — Free <ArrowUpRight size={18}/></button>
            <button className="px-8 py-4 rounded-full glass text-[#0A1931] font-mono text-[12px] uppercase tracking-widest">iOS/Android Coming Soon</button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[880px] mx-auto">
            {[
              { k: '247 tailors', v: 'Oldham verified' },
              { k: '47 avg projects', v: 'Per tailor' },
              { k: '4.9 Trust', v: 'Ledger verified' },
              { k: '£320 avg', v: 'Job value' },
            ].map(s=>(
              <div key={s.k} className="glass rounded-[16px] px-5 py-4">
                <div className="font-poppins font-bold text-[16px]">{s.k}</div>
                <div className="font-mono text-[10px] uppercase text-[#5B6470]">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-[#D4CBB8] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[#5B6470]">
            <div className="flex items-center gap-3">
              <img src={logoIcon} alt="M" className="w-6 h-6 rounded-lg" />
              <span>My Face Profile • Page 13 of 24 — For Tailors Standalone LP — SEO Oldham — Touch of GOD</span>
            </div>
            <div className="flex items-center gap-4">
              <span>247 tailors • Aso-Ebi • Wedding Dress • Alterations • Oldham</span>
              <span className="px-2 py-1 rounded-full bg-[#8FFF4A]/15 text-[#8FFF4A] border border-[#8FFF4A]/20">Touch of GOD in Every Stitch</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes grow { from { width: 0 } to { width: 100% } }
      `}</style>
    </div>
  );
}
