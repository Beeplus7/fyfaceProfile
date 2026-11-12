import React, { useEffect, useRef, useState } from 'react';

import logoDark from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoLight from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import tailorSew from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import liveGirl from "../assets/bd87313c9fb90d22-image_20261029_175419.webp";
import phoneGift from "../assets/2f721bcceb44c761-image_20261029_175423.webp";
import crmPipe from "../assets/475083c6f4c99ece-image_20261029_175423_1.webp";
import delivery from "../assets/1269da9d7e2d4f51-image_20261029_175429.webp";
import mechanic from "../assets/862320100e7b980d-image_20261029_173915.webp";
import builders from "../assets/727cc9fbccc433e9-image_20261029_173918.webp";
import barber from "../assets/f05e570703efee3a-image_20261029_173914.webp";

// ----- Small UI helpers -----
const Badge = ({ children, dot }: { children: React.ReactNode; dot?: boolean }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[rgba(255,255,255,0.06)] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-[#5B6470] backdrop-blur-xl">
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] shadow-[0_0_12px_#8FFF4A]" />}
    <span className="mono uppercase tracking-[0.12em]">{children}</span>
  </div>
);

const GradientText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span
    className={className}
    style={{
      background: 'var(--grad-m)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
    }}
  >
    {children}
  </span>
);

// Floating gift icons
const GiftFloaters = () => {
  const gifts = ['🪙','❤️','🎁','👑','🔨','✂️','🏆','💎'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {gifts.map((g,i)=>(
        <span
          key={i}
          className="absolute text-[20px] will-change-transform"
          style={{
            left: `${10 + (i*11)}%`,
            bottom: `${5 + Math.random()*25}%`,
            animation: `giftRise ${3+i%3}s ease-in-out ${i*0.45}s infinite`,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
          }}
        >{g}</span>
      ))}
    </div>
  );
};

export default function LiveWorkshopPage(){
  const [liveViewers, setLiveViewers] = useState(142);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'inquiry'|'booking'|'project'>('booking');

  useEffect(()=>{
    const id = setInterval(()=> setLiveViewers(v=> v + (Math.random()>0.5?1:-1)), 2400);
    return ()=> clearInterval(id);
  },[]);

  // slide-in observer
  useEffect(()=>{
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting) (e.target as HTMLElement).style.animationDelay = '0s';
      });
    },{threshold:0.15});
    document.querySelectorAll('[data-reveal]').forEach(el=> io.observe(el));
    return ()=> io.disconnect();
  },[]);

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-[#FFFDF7] text-[#0A1931] overflow-x-clip"
      style={{ boxSizing:'border-box', paddingTop:'var(--safe-area-inset-top)' } as React.CSSProperties}
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-40 w-full border-b border-[#D4CBB8] bg-[#FFFDF7]/90 backdrop-blur-[22px]"
        style={{ top: 'var(--safe-area-inset-top)' } as React.CSSProperties}
      >
        <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-[11px] bg-white p-[1px]">
              <div className="absolute inset-[1px] rounded-[10px] bg-[#FFFDF7] grid place-items-center">
                <span className="poppins text-[18px] font-extrabold tracking-[-0.02em]" style={{ background: 'var(--grad-m)', WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent' }}>M</span>
              </div>
              <div className="absolute inset-0 rounded-[11px]" style={{ background:'var(--grad-m)', opacity:0.9, WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite:'xor', maskComposite:'exclude', padding:'1px' }} />
            </div>
            <span className="poppins text-[16px] font-bold tracking-[-0.02em]">My Face Profile</span>
            <span className="hidden md:inline-flex ml-2 rounded-full border border-[#D4CBB8] px-2.5 py-1 text-[10px] tracking-widest mono text-[#5B6470]">NO.4</span>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-[13px]">
            {[
              {label:'Home', href:'#'},
              {label:'How It Works', href:'#'},
              {label:'Work OS', href:'#'},
              {label:'UPRM', active:true, href:'#uprm'},
              {label:'Live Workshop', href:'#live'},
              {label:'Projects', href:'#story'},
              {label:'Pricing', href:'#pricing'},
            ].map(l=>(
              <a key={l.label} href={l.href} className={`relative transition ${l.active ? 'text-[#0A1931] font-semibold' : 'text-[#5B6470] hover:text-[#0A1931]'}`}>
                {l.label}
                {l.active && <span className="absolute -bottom-[18px] left-0 right-0 h-[2px]" style={{ background:'var(--grad-m)' }} />}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1.5 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#8FFF4A]" />
              <span className="mono text-[11px] text-[#5B6470]">{liveViewers} live now • Oldham</span>
            </div>
            <button className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black hover:bg-white/90 transition">Go Live</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} className="relative mx-auto max-w-[1320px] px-5 md:px-8 pt-8 md:pt-14 pb-10">
        {/* soft gradient wash */}
        <div className="pointer-events-none absolute left-0 top-0 h-[560px] w-full opacity-60" style={{ background:'radial-gradient(600px 320px at 18% 8%, rgba(143,255,74,0.22), transparent), radial-gradient(500px 340px at 85% 15%, rgba(0,229,192,0.18), transparent), radial-gradient(400px 300px at 50% 40%, rgba(255,230,0,0.10), transparent)' }} />
        
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-start">
          <div className="relative">
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge dot>No.4 of 24 • UPRM + Live Workshop OS • The Heart</Badge>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-bold text-black mono">IMAGES SPEAK LOUDER</span>
            </div>

            <h1 className="poppins text-[42px] md:text-[66px] font-extrabold leading-[0.92] tracking-[-0.04em]">
              <span className="block">Your Relationships</span>
              <span className="block">Are Your Business.</span>
              <span className="mt-3 block">
                <GradientText>UPRM Orchestrates</GradientText>
              </span>
              <span className="block">
                <GradientText>Every Gift, Every Booking.</GradientText>
              </span>
            </h1>

            <p className="mt-6 max-w-[560px] text-[16px] md:text-[18px] leading-[1.6] text-[#5B6470]">
              While you work, UPRM manages leads, quotes, bookings, gifts and trust — and <span className="text-[#0A1931] font-medium">Live Workshop turns your workshop into a storefront.</span> No dances. Just real craft, real people, real money.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button className="group relative rounded-full p-[1px]" style={{ background:'var(--grad-m)' }}>
                <span className="flex items-center gap-2 rounded-full bg-black px-6 py-[13px] text-[14px] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#FF3B3B] animate-pulse" /> Start Live Workshop
                  <span className="transition group-hover:translate-x-0.5">→</span>
                </span>
              </button>
              <button className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-5 py-[13px] text-[14px] font-medium backdrop-blur hover:bg-[#F0E9DB]">See UPRM Demo</button>
              <div className="mono ml-1 text-[11px] text-[#5B6470]">1,247 pros live • 4.9 avg Trust</div>
            </div>

            {/* Trust row */}
            <div className="mt-8 grid grid-cols-3 max-w-[520px] divide-x divide-white/10 rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] backdrop-blur">
              {[
                {k:'Pipeline', v:'£18.4k'},
                {k:'TrustScore', v:'4.9/5'},
                {k:'Live viewers avg', v:'142'},
              ].map(s=>(
                <div key={s.k} className="px-4 py-3.5">
                  <div className="mono text-[10px] uppercase tracking-widest text-[#5B6470]">{s.k}</div>
                  <div className="poppins text-[18px] font-bold">{s.v}</div>
                </div>
              ))}
            </div>

            {/* mini logos */}
            <div className="mt-6 flex items-center gap-3 opacity-70">
              <img src={logoLight} alt="My Face Profile logo light" className="h-7 w-auto rounded-md object-contain bg-white p-1" />
              <img src={logoDark} alt="My Face Profile logo dark" className="h-7 w-auto rounded-md object-contain bg-white p-1" />
              <span className="mono text-[10px] text-[#5B6470]">Trusted by makers across Greater Manchester</span>
            </div>
          </div>

          {/* HERO RIGHT IMAGE */}
          <div className="relative lg:sticky lg:top-[88px]">
            <div className="relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#0F0F0F] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-0 z-10 rounded-[24px] p-[1px]" style={{ background:'var(--grad-m)', WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite:'xor', maskComposite:'exclude' }} />
              
              <img src={liveGirl} alt="young female entrepreneur live streaming workshop on tripod, authentic" className="aspect-[4/5] w-full object-cover" />

              {/* Glass overlays */}
              <div className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-xl border border-[#D4CBB8]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="mono text-[11px] font-bold text-[#0A1931]">LIVE</span>
                <span className="mono text-[11px] text-[#5B6470]">{liveViewers} watching</span>
              </div>

              <div className="absolute right-3 top-3 z-20 rounded-full bg-white px-3 py-1.5 mono text-[11px] font-bold text-black shadow-lg">Atelier No.12 • Tailoring Live</div>

              <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
                <div className="rounded-[16px] border border-[#D4CBB8] bg-black/60 p-3 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={tailorSew} alt="tailor sewing lace close-up inset" className="h-9 w-9 rounded-full object-cover border border-[#D4CBB8]" />
                      <div>
                        <div className="text-[12px] font-semibold leading-none">Sewing Silk Lace • Live</div>
                        <div className="mono text-[10px] text-[#5B6470]">Hands-free tripod mode</div>
                      </div>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-black">Gift</div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex gap-2 text-[11px]"><span className="text-[#5B6470]">Aisha</span><span className="text-[#0A1931]">This stitching is incredible! ❤️</span></div>
                    <div className="flex gap-2 text-[11px]"><span className="text-[#FFE600] font-bold">Liam</span><span>sent Gift Box x5 🎁</span></div>
                    <div className="flex gap-2 text-[11px]"><span className="text-[#8FFF4A] font-bold">Sofia</span><span>sent Gold Coin x20 🪙</span></div>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[
                      {e:'🔨', l:'Hammer 10 MFC'},
                      {e:'✂️', l:'Scissors 25 MFC'},
                      {e:'👑', l:'Crown 100 MFC'},
                      {e:'🏆', l:'Trophy 250 MFC'},
                    ].map(g=>(
                      <button key={g.l} className="rounded-[10px] border border-[#D4CBB8] bg-[#F0E9DB] py-2 text-center hover:bg-[#F0E9DB] transition">
                        <div className="text-[16px]">{g.e}</div>
                        <div className="mono text-[8px] text-[#5B6470] mt-0.5">{g.l}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <GiftFloaters />
            </div>

            <div className="mt-3 flex items-center justify-between rounded-[14px] border border-[#D4CBB8] bg-[#F0E9DB] px-4 py-3 backdrop-blur">
              <div className="mono text-[10px] uppercase tracking-widest text-[#5B6470]">Live Commerce Overlay</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-16 rounded-full bg-[#F0E9DB] overflow-hidden">
                  <div className="h-full w-[68%] rounded-full" style={{ background:'var(--grad-m)' }} />
                </div>
                <span className="mono text-[11px]">Trust 4.9</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 — LIVE WORKSHOP IN ACTION */}
      <section id="live" className="mx-auto max-w-[1320px] px-5 md:px-8 py-12 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <Badge>Section 01 • Live Workshop — Images Speak</Badge>
            <h2 className="poppins mt-4 text-[34px] md:text-[54px] font-extrabold leading-[0.95] tracking-[-0.03em]">Go Live While You Work —<br/>Hands-Free, Human-First.</h2>
          </div>
          <p className="max-w-[420px] text-[15px] leading-[1.6] text-[#5B6470]">
            One tap, tripod, phone records workshop. Viewers watch real work, gift MFC coins, ask questions, book. No dancing. Real craft sells.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
          {/* Big phone image */}
          <div className="relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#101010]">
            <img src={phoneGift} alt="phone showing Atelier No.12 Tailoring Live Custom Suit Fitting live chat with gifts raining" className="aspect-[16/10] w-full object-cover lg:aspect-[16/11]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            
            <div className="absolute left-4 top-4 rounded-full border border-[#D4CBB8] bg-black/60 px-3 py-1.5 backdrop-blur mono text-[11px] text-[#0A1931] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Atelier No.12 Tailoring Live • Custom Suit Fitting
            </div>

            {/* Chat overlay like Figma */}
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[320px] rounded-[18px] border border-[#D4CBB8] bg-black/70 p-3 backdrop-blur-xl">
              <div className="mono text-[10px] tracking-widest text-[#5B6470] mb-2">LIVE CHAT</div>
              <div className="space-y-2 text-[12px]">
                <div className="rounded-[10px] bg-[#F0E9DB] px-3 py-2"><span className="font-semibold">Emma •</span> This stitching is incredible! ❤️</div>
                <div className="rounded-[10px] border border-[#FFE600]/30 bg-[#FFE600]/10 px-3 py-2 flex justify-between"><span>🪙 Gold Coin x20 from @mike_builds</span><span className="mono text-[10px]">+40 MFC</span></div>
                <div className="rounded-[10px] bg-[#F0E9DB] px-3 py-2">🎁 Gift Box x5 from Sofia • Custom dress?</div>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="flex-1 rounded-full bg-[#F0E9DB] px-3 py-2 mono text-[11px] text-[#5B6470]">Ask about fabric...</div>
                <button className="rounded-full px-4 py-2 text-[11px] font-bold text-black" style={{ background:'var(--grad-m)' }}>Book £180</button>
              </div>
            </div>

            <GiftFloaters />
          </div>

          {/* Right copy + feature */}
          <div className="flex flex-col gap-6">
            <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-6 backdrop-blur">
              <div className="flex gap-4">
                <img src={tailorSew} alt="tailor sewing lace close-up" className="h-[86px] w-[86px] rounded-[16px] object-cover border border-[#D4CBB8]" />
                <div>
                  <h3 className="poppins text-[18px] font-bold leading-tight">Real work is the content.<br/>Gift economy is the checkout.</h3>
                  <p className="mt-2 text-[13px] leading-[1.6] text-[#5B6470]">While Emma sews silk lace, 142 people watch. 12 gift. 3 book. UPRM captures every event automatically — no extra app.</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  {label:'Avg Watch', value:'11m 42s'},
                  {label:'Gift Rate', value:'18%'},
                  {label:'Book Rate', value:'7.2%'},
                ].map(k=>(
                  <div key={k.label} className="rounded-[14px] bg-black/40 border border-[#D4CBB8] p-3">
                    <div className="mono text-[10px] text-[#5B6470] uppercase">{k.label}</div>
                    <div className="poppins text-[15px] font-bold mt-1">{k.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {title:'Hands-Free Tripod Mode', desc:'Phone on tripod, auto-focus on hands. No crew.', img: liveGirl, stat:'142 watching'},
                {title:'Gift Rain', desc:'🔨 ✂️ 👑 🏆 Coins + hearts rain = MFC.', img: phoneGift, stat:'Gift Box x5'},
                {title:'Trust While Live', desc:'TrustScore overlay + verified bookings.', img: delivery, stat:'4.9 Trust'},
                {title:'Shop Pinned', desc:'Silk Fabric £45/m pinned during live.', img: tailorSew, stat:'£45/m'},
              ].map(card=>(
                <div key={card.title} className="group relative overflow-hidden rounded-[20px] border border-[#D4CBB8] bg-[#131313]">
                  <img src={card.img} alt={card.title} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full bg-black/60 border border-[#D4CBB8] px-2.5 py-1 mono text-[9px] text-[#5B6470] backdrop-blur">{card.stat}</div>
                  <div className="absolute bottom-0 p-3.5">
                    <div className="poppins text-[13px] font-bold leading-tight">{card.title}</div>
                    <div className="mono text-[10px] text-[#5B6470] mt-1 leading-[1.4]">{card.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — UPRM */}
      <section id="uprm" className="relative border-y border-[#D4CBB8] bg-[#F0E9DB]">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background:'radial-gradient(800px 400px at 20% 20%, rgba(143,255,74,0.12), transparent), radial-gradient(600px 400px at 80% 80%, rgba(0,229,192,0.10), transparent)' }} />
        <div className="relative mx-auto max-w-[1320px] px-5 md:px-8 py-12 md:py-20">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-[640px]">
              <Badge>Section 02 • UPRM Orchestrator — The Heart</Badge>
              <h2 className="poppins mt-4 text-[32px] md:text-[52px] font-extrabold leading-[0.95] tracking-[-0.03em]">Every View Becomes a Relationship. <GradientText>Every Relationship Becomes Revenue.</GradientText></h2>
              <p className="mt-4 text-[15px] leading-[1.6] text-[#5B6470]">UPRM listens to every InteractionEvent — video_viewed, gift_sent, inquiry_created, quote_sent, deposit_paid, milestone_completed — and turns it into pipeline.</p>
            </div>
            <div className="rounded-[16px] border border-[#D4CBB8] bg-black p-4 mono text-[11px] leading-[1.6] text-[#5B6470] max-w-[360px]">
              <div className="text-[#5B6470] mb-2">InteractionEvent {`{`}</div>
              <div className="pl-3 space-y-1">
                <div><span className="text-[#8FFF4A]">video_viewed</span> <span className="text-[#5B6470]">→ +1 intent</span></div>
                <div><span className="text-[#FFE600]">gift_sent</span> <span className="text-[#5B6470]">→ +5 warmth</span></div>
                <div><span className="text-[#00E5C0]">inquiry_created</span> <span className="text-[#5B6470]">→ new lead</span></div>
                <div><span className="text-[#0A1931]">quote_sent, deposit_paid</span></div>
                <div><span className="text-[#FF8A00]">milestone_completed</span> <span className="text-[#5B6470]">→ +10 trust</span></div>
              </div>
              <div className="text-[#5B6470] mt-2">{`}`} — event sourcing</div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            {/* CRM visual */}
            <div className="relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#0E0E0E]">
              <div className="flex items-center justify-between border-b border-[#D4CBB8] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-[10px] grid place-items-center bg-white text-black font-bold poppins">F</div>
                  <div>
                    <div className="poppins text-[13px] font-bold leading-none">FlowCRM Pipeline • Reference</div>
                    <div className="mono text-[10px] text-[#5B6470]">1,248 leads • $284k pipeline</div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <span className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1 mono text-[10px]">Dark Mode</span>
                  <span className="rounded-full px-3 py-1 mono text-[10px] text-black font-bold" style={{ background:'var(--grad-m)' }}>Live Sync</span>
                </div>
              </div>
              <div className="relative">
                <img src={crmPipe} alt="FlowCRM pipeline dashboard dark mode showing Customer Pipeline 1,248 leads, $284k pipeline — as UPRM reference" className="w-full aspect-[16/9] object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
              </div>

              {/* Kanban */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-[#D4CBB8] divide-y md:divide-y-0 md:divide-x divide-white/10 bg-[#F0E9DB]">
                {[
                  {col:'Inquiries (12)', value:'£3,200', color:'#FFE600'},
                  {col:'Bookings (8)', value:'£6,800', color:'#00E5C0'},
                  {col:'Projects (4)', value:'£8,400', color:'#8FFF4A'},
                ].map(c=>(
                  <div key={c.col} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="mono text-[11px] font-bold tracking-wide">{c.col}</div>
                      <span className="h-2 w-2 rounded-full" style={{ background:c.color }} />
                    </div>
                    <div className="mt-3 space-y-3">
                      {[1,2].map(i=>(
                        <div key={i} className="rounded-[14px] border border-[#D4CBB8] bg-[#F0E9DB] p-3">
                          <div className="flex items-center gap-2">
                            <img src={i===1 ? tailorSew : liveGirl} alt="lead" className="h-7 w-7 rounded-full object-cover" />
                            <div className="mono text-[11px] font-semibold">Emma R • Wedding Dress</div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="mono text-[10px] text-[#5B6470]">£320 • New Lead</span>
                            <span className="rounded-full bg-white px-2 py-0.5 mono text-[9px] font-bold text-black">Hot</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 mono text-[11px] text-[#5B6470]">Pipeline value {c.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Branded UPRM cards */}
            <div className="flex flex-col gap-4">
              <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="poppins text-[15px] font-bold">My Face Profile UPRM</div>
                  <div className="flex gap-1">
                    {['Inquiries','Bookings','Projects'].map(t=>(
                      <button key={t} onClick={()=> setActiveTab(t.toLowerCase() as any)} className={`rounded-full px-3 py-1 mono text-[10px] font-bold transition ${activeTab===t.toLowerCase() ? 'bg-white text-black' : 'bg-[#F0E9DB] text-[#5B6470] hover:text-[#0A1931]'}`}>{t}</button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    {name:'Emma Rodriguez', job:'Wedding Dress • £320', status:'New Lead', img:delivery, trust:'Gift 50 MFC during live'},
                    {name:'James Park', job:'Suit Fitting • £180', status:'Confirmed', img:tailorSew, trust:'Deposit paid • £90'},
                    {name:'Aisha Khan', job:'Silk Lace Repair • £45', status:'In Make', img:tailorSew, trust:'Milestone: Lace pinned'},
                  ].map(row=>(
                    <div key={row.name} className="group flex items-center gap-3 rounded-[16px] border border-[#D4CBB8] bg-black/40 p-3 hover:bg-black/60 transition cursor-pointer">
                      <img src={row.img} alt={row.name} className="h-10 w-10 rounded-full object-cover border border-[#D4CBB8]" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold leading-tight truncate">{row.name} • {row.job}</div>
                        <div className="mono text-[10px] text-[#5B6470] truncate">{row.trust}</div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 mono text-[10px] font-bold ${row.status==='Confirmed' ? 'bg-[#8FFF4A] text-black' : row.status==='In Make' ? 'bg-[#FFE600] text-black' : 'bg-[#F0E9DB] text-[#0A1931]'}`}>{row.status}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[14px] bg-black border border-[#D4CBB8] p-3 flex items-center justify-between">
                  <div>
                    <div className="mono text-[10px] text-[#5B6470] uppercase">Pipeline Value</div>
                    <div className="poppins text-[20px] font-extrabold">£18,400</div>
                  </div>
                  <div className="text-right">
                    <div className="mono text-[10px] text-[#5B6470]">Trust Growth</div>
                    <div className="text-[13px] font-bold text-[#8FFF4A]">+12% this week</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 flex gap-3 items-center">
                <div className="h-10 w-10 rounded-full grid place-items-center bg-white text-black font-bold">M</div>
                <div className="text-[12px] leading-[1.4]"><span className="font-bold">UPRM auto-creates Project</span> from gift → quote → deposit. You sew, we orchestrate. <span className="text-[#5B6470] mono text-[11px]">No forms.</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — GIFT TO DELIVERY */}
      <section id="story" className="mx-auto max-w-[1320px] px-5 md:px-8 py-12 md:py-20">
        <Badge>Section 03 • From Gift to Delivery — Image Story</Badge>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
          <div className="relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#101010]">
            <img src={delivery} alt="diverse happy customers receiving custom wedding dress delivery, trust moment" className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 p-5 w-full">
              <div className="rounded-[16px] border border-[#D4CBB8] bg-black/60 backdrop-blur-xl p-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[tailorSew, liveGirl, delivery].map((im,i)=>(
                    <img key={i} src={im} alt="customer" className="h-8 w-8 rounded-full border-2 border-black object-cover" />
                  ))}
                </div>
                <div className="text-right">
                  <div className="poppins text-[14px] font-bold">Trust Moment Captured</div>
                  <div className="mono text-[10px] text-[#5B6470]">5★ review → referral +10</div>
                </div>
              </div>
            </div>
            <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 mono text-[11px] font-bold text-black">Delivery Day • Oldham • Today</div>
          </div>

          <div>
            <h2 className="poppins text-[34px] md:text-[48px] font-extrabold leading-[0.95] tracking-[-0.03em]">Gift → Book → Make → Deliver → Review → Repeat</h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-[#5B6470] max-w-[520px]">Images tell the story words can't. Every step is visible, every gift becomes trust, every delivery becomes referral. UPRM keeps the chain unbroken.</p>

            <div className="mt-8 relative">
              <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-[#8FFF4A] via-[#FFE600] to-[#FF8A00] opacity-60 hidden md:block" />
              <div className="space-y-4">
                {[
                  {step:'Gift', icon:'🎁', desc:'Customer gifts 50 MFC during live • Warmth +5', meta:'£2.50 value • Instant', img: phoneGift},
                  {step:'Book', icon:'📅', desc:'Books custom dress £320 • Inquiry → Booking', meta:'Quote sent auto • 4 min', img: liveGirl},
                  {step:'Make', icon:'✂️', desc:'UPRM creates Project • Tailor sews (live optional)', meta:'Image 173924 • Silk lace', img: tailorSew},
                  {step:'Deliver', icon:'📦', desc:'Delivery moment • Customers receiving dress', meta:'Image 175429 • Trust captured', img: delivery},
                  {step:'Review → Repeat', icon:'⭐', desc:'Review 5★ • Relationship strength +10 → Referral', meta:'Loop restarts • Lifetime value £1,240', img: delivery},
                ].map((s, idx)=>(
                  <div key={s.step} className="relative flex gap-4 rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 backdrop-blur hover:bg-[#F0E9DB] transition">
                    <div className="hidden md:grid h-9 w-9 place-items-center rounded-full border border-[#D4CBB8] bg-black text-[16px] z-10">{s.icon}</div>
                    <div className="flex-1 flex gap-4">
                      <img src={s.img} alt={s.step} className="h-14 w-14 rounded-[12px] object-cover border border-[#D4CBB8] hidden sm:block" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="poppins text-[14px] font-bold">{idx+1}. {s.step}</span>
                          <span className="mono text-[10px] rounded-full bg-[#F0E9DB] px-2 py-0.5 text-[#5B6470]">{s.meta}</span>
                        </div>
                        <div className="mt-1 text-[13px] leading-[1.5] text-[#5B6470]">{s.desc}</div>
                      </div>
                    </div>
                    <div className="hidden lg:block mono text-[10px] text-[#5B6470] mt-1">→ next</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHY IMAGES > WORDS */}
      <section className="border-t border-[#D4CBB8] bg-[#080808]">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8 py-12 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <Badge>Section 04 • Why Images &gt; Words</Badge>
              <h2 className="poppins mt-4 text-[32px] md:text-[48px] font-extrabold leading-[0.95] tracking-[-0.03em]">Proof is in the workshop.<br/>Not in the pitch deck.</h2>
            </div>
            <div className="mono text-[12px] text-[#5B6470] max-w-[360px]">Real pros, real stats. Each card is a living profile — live status, TrustScore, pipeline. Book direct, no middleman.</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {img: tailorSew, name:'Atelier No.12', craft:'Tailor • Wedding Dresses', stats:['147 projects','4.9 Trust','142 live viewers'], live:false},
              {img: mechanic, name:'Rashid Motors', craft:'Mechanic • OBD2 Diagnostics', stats:['89 diagnostics','4.8 Trust','OBD2 live'], live:true},
              {img: builders, name:'Oldham Build Co.', craft:'Builders • Extensions', stats:['24 active','£284k pipeline','On-site now'], live:false},
              {img: barber, name:'Fade House', craft:'Barber • Fades', stats:['312 fades','4.9 Trust','live now'], live:true},
            ].map(card=>(
              <div key={card.name} data-reveal className="group relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#121212] animate-slide">
                <div className="absolute inset-0 rounded-[24px] p-[1px] opacity-0 group-hover:opacity-100 transition" style={{ background:'var(--grad-m)' }}>
                  <div className="h-full w-full rounded-[23px] bg-[#121212]" />
                </div>
                <div className="relative">
                  <img src={card.img} alt={`${card.name} ${card.craft}`} className="aspect-[4/3] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  {card.live && <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 mono text-[10px] font-bold text-[#0A1931]"><span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />LIVE</div>}
                  <div className="absolute right-3 top-3 rounded-full border border-[#D4CBB8] bg-black/60 px-2.5 py-1 mono text-[10px] text-[#5B6470] backdrop-blur">Oldham • 0.8mi</div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="poppins text-[16px] font-bold leading-tight">{card.name}</div>
                    <div className="mono text-[11px] text-[#5B6470]">{card.craft}</div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {card.stats.map(s=>(
                        <span key={s} className="rounded-full border border-[#D4CBB8] bg-black/50 px-2.5 py-1 mono text-[10px] text-[#5B6470] backdrop-blur">{s}</span>
                      ))}
                    </div>
                    <button className="mt-3 w-full rounded-full bg-white py-2.5 text-[13px] font-bold text-black hover:bg-white/90 transition">Book This Pro</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-[20px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border border-[#D4CBB8]"><img src={tailorSew} alt="sew" className="h-full w-full object-cover" /></div>
              <div><div className="poppins text-[14px] font-bold">Lace close-up speaks more than 1000 words</div><div className="mono text-[11px] text-[#5B6470]">Shot on iPhone • No filter • Real hands</div></div>
            </div>
            <div className="rounded-[20px] border border-[#D4CBB8] bg-[#F0E9DB] p-5">
              <div className="mono text-[10px] uppercase tracking-widest text-[#5B6470]">Gift Economy Live</div>
              <div className="mt-2 flex items-center gap-2 text-[22px]"><span>🪙</span><span>❤️</span><span>🎁</span><span className="poppins text-[16px] font-bold ml-2">+£320 booked in 8 min live</span></div>
            </div>
            <div className="rounded-[20px] p-[1px]" style={{ background:'var(--grad-m)' }}>
              <div className="rounded-[19px] bg-black p-5 flex justify-between items-center">
                <div><div className="mono text-[10px] text-[#5B6470] uppercase">Oldham Live Right Now</div><div className="poppins text-[18px] font-extrabold">1,247 pros • 142 viewers avg</div></div>
                <div className="h-10 w-10 rounded-full grid place-items-center bg-white text-black font-bold">→</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section id="pricing" className="relative overflow-hidden border-t border-[#D4CBB8]">
        <div className="absolute inset-0" style={{ background:'radial-gradient(900px 500px at 30% 0%, rgba(143,255,74,0.18), transparent), radial-gradient(700px 500px at 90% 20%, rgba(255,230,0,0.14), transparent), radial-gradient(600px 400px at 50% 100%, rgba(0,229,192,0.12), transparent)' }} />
        <div className="relative mx-auto max-w-[1320px] px-5 md:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div>
              <Badge dot>Final CTA • No.4 of 24</Badge>
              <h2 className="poppins mt-5 text-[38px] md:text-[64px] font-extrabold leading-[0.90] tracking-[-0.04em]">
                Upgrade Your Workshop<br/>
                <GradientText>to Storefront —</GradientText><br/>
                Go Live Now
              </h2>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button className="rounded-full px-7 py-4 text-[15px] font-bold text-black shadow-[0_12px_40px_rgba(143,255,74,0.35)]" style={{ background:'var(--grad-m)' }}>Start Live Workshop Free</button>
                <div className="flex items-center gap-3">
                  <div className="rounded-[12px] border border-[#D4CBB8] bg-white p-2"><div className="h-12 w-12 rounded-[8px] bg-black grid place-items-center text-[10px] mono text-white">QR<br/>OLDHAM</div></div>
                  <div className="mono text-[11px] leading-[1.4] text-[#5B6470]">Scan to join waitlist<br/>iOS / Android Coming Soon<br/><span className="text-[#0A1931]">1,247 pros live</span></div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {['No commission first 10 bookings','MFC gift economy','TrustScore verified','Tripod + phone only'].map(b=>(
                  <span key={b} className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3.5 py-1.5 mono text-[11px] text-[#5B6470]">{b}</span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB]">
                <img src={liveGirl} alt="live workshop footer" className="aspect-[4/3] w-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="rounded-[16px] border border-[#D4CBB8] bg-black/70 backdrop-blur p-4">
                    <div className="flex justify-between items-center">
                      <div className="poppins text-[14px] font-bold">Today in Oldham</div>
                      <span className="rounded-full bg-[#8FFF4A] px-2.5 py-1 mono text-[10px] font-bold text-black">LIVE</span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-[12px] bg-[#F0E9DB] p-2"><div className="poppins font-bold">142</div><div className="mono text-[9px] text-[#5B6470]">viewers</div></div>
                      <div className="rounded-[12px] bg-[#F0E9DB] p-2"><div className="poppins font-bold">£18.4k</div><div className="mono text-[9px] text-[#5B6470]">pipeline</div></div>
                      <div className="rounded-[12px] bg-[#F0E9DB] p-2"><div className="poppins font-bold">4.9</div><div className="mono text-[9px] text-[#5B6470]">trust</div></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[18px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 backdrop-blur flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={logoLight} alt="logo" className="h-7 w-auto rounded bg-white p-1" />
                  <span className="poppins text-[13px] font-bold">My Face Profile</span>
                </div>
                <span className="mono text-[10px] text-[#5B6470]">No.4 of 24 — UPRM + Live Workshop — Images Speak Louder</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#D4CBB8] pt-6 mono text-[11px] text-[#5B6470]">
            <div>© 2026 My Face Profile • Oldham, Greater Manchester • Built with craft, not code.</div>
            <div className="flex gap-4"><span>How It Works</span><span>Work OS</span><span className="text-[#0A1931] font-bold">UPRM Active</span><span>Live Workshop</span></div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 390px){
          h1{ font-size: 36px !important; }
          h2{ font-size: 28px !important; }
        }
      `}</style>
    </div>
  );
}
