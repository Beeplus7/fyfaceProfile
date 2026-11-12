import { useEffect, useState } from "react";
import logoM1 from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoM2 from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import imgSewing from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import imgFinal from "../assets/b4766d628a527e91-image_20261029_180641.webp";
import imgMeasure from "../assets/a57a388e71b1e926-image_20261029_223418.webp";
import imgFabric from "../assets/56b18e947fda16ba-image_20261029_223419.webp";

type Blessing = { id:string; value:{name:string; message:string; at:string}; created_at:string };

export default function BlogDetailPage(){
  const [blessings, setBlessings] = useState<Blessing[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  const loadBlessings = async ()=>{
    try{
      const res = await fetch("actions",{method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({action:"records.list", args:{collection:"blessings"}})});
      const j = await res.json();
      if(j.data) setBlessings(j.data.records.reverse());
    }catch{}
  };
  useEffect(()=>{ loadBlessings(); },[]);

  const submitBlessing = async ()=>{
    if(!name.trim() || !msg.trim()) return;
    setBusy(true);
    try{
      await fetch("actions",{method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({action:"records.create", args:{collection:"blessings", value:{name:name.trim(), message:msg.trim(), at:new Date().toISOString()}}})});
      setName(""); setMsg("");
      await loadBlessings();
    }catch(e){ console.log(e); }
    setBusy(false);
  };

  const timeline = [
    { k:"Day 1 • Design", title:"Measuring at Spindlegate, OL1", img: imgMeasure, desc:"Aisha meets the bride at AYO'S TAILORS, Spindlegate Oldham OL1. Ankara notes, bust/waist/hips logged. WorkCut auto-trims 47 mins of measuring into a 12-sec holy loop. Work Feed pushes to 500 people within 10mi searching 'tailor Oldham' — no post needed.", tags:["WORKCUT 12SEC","SPINDLEGATE OL1","ASO-EBI CLIENT"] },
    { k:"Day 1 • Fabric", title:"Luxury Aso-Ebi Stack — Beads, Sequins, Gold", img: imgFabric, desc:"Green, yellow, fuchsia, coral, blue — sequins, pearls, beads stacked. Shop lists Silk £45/m, Ankara Wax Print Adire Blue, Coral Gold Lace. Customer taps 'Buy Fabric' inside the profile, not DMs. Work Feed shows this stack to 247 tailors searching.", tags:["SHOP £45/M","LUXURY STACK","247 TAILORS"] },
    { k:"Day 3 • Sewing", title:"Touch of GOD in Every Stitch — Lace Detail", img: imgSewing, desc:"Close-up: hands guiding lace under needle. Live Fitting at 142 viewers, Gift Crown 100 MFC from bride's sister. WorkCut stitches highlight reel automatically. Milestone auto-posted: Day 3 Fitting Complete.", tags:["LIVE 142 VIEWERS","GIFT CROWN 100 MFC","TOUCH OF GOD"] },
    { k:"Day 5 • Final Reveal", title:"Alterations Complete — 12.09.2024", img: imgFinal, desc:"Final wedding dress on mannequin, veil falling. 'Alterations Complete' tag, 12.09.2024. Bride cries. Trust Ledger +1, £320 avg job, £15K revenue total. Escrow Secured via Stripe — released after approval.", tags:["FINAL REVEAL","ESCROW SECURED","£15K REVENUE"] },
  ];

  return (
    <div data-safe-area-inset-root style={{boxSizing:"border-box", paddingTop:"var(--safe-area-inset-top)", background:"var(--bg)", minHeight:"100vh", overflowX:"clip"}} className="w-full antialiased selection:bg-[var(--lime)] selection:text-black">
      
      {/* BG Glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-[30%] left-[-10%] w-[70%] h-[60%] rounded-full opacity-[0.18] blur-[120px]" style={{background:"radial-gradient(circle at center, #8FFF4A, transparent 60%)"}}/>
        <div className="absolute top-[40%] right-[-15%] w-[60%] h-[50%] rounded-full opacity-[0.15] blur-[120px]" style={{background:"radial-gradient(circle at center, #FF8A00, transparent 60%)"}}/>
        <div className="absolute top-[120%] left-[20%] w-[80%] h-[80%] rounded-full opacity-[0.08] blur-[140px]" style={{background:"radial-gradient(circle at center, #8FFF4A, transparent 60%)"}}/>
      </div>

      {/* NAV */}
      <header data-safe-area-sticky-top style={{top:"var(--safe-area-inset-top)"}} className="sticky z-40 w-full border-b border-[#D4CBB8] bg-[#FFFDF7]/90 backdrop-blur-[20px]">
        <div className="mx-auto max-w-[1240px] px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-[36px] w-[36px] rounded-[12px] overflow-hidden divine-glow bg-white">
              <img src={logoM1} alt="M logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex items-baseline gap-[2px]">
              <span className="font-[Poppins] font-extrabold text-[18px] tracking-[-0.02em]">My</span>
              <span className="font-[Poppins] font-extrabold text-[18px] tracking-[-0.02em]">Face</span>
              <span className="ml-1 mono text-[10px] px-[6px] py-[2px] rounded-[6px] bg-white text-black font-medium">PROFILE</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-2 text-[13px]">
            <span className="px-3 py-1.5 rounded-full glass mono text-[#5B6470]">Home</span>
            <span className="px-3 py-1.5 rounded-full glass mono text-[#5B6470]">Work</span>
            <span className="px-3 py-1.5 rounded-full glass mono text-[#5B6470]">Shop</span>
            <span className="px-3 py-1.5 rounded-full bg-white text-black mono font-medium shadow-[0_0_20px_rgba(255,255,255,0.3)]">Blog • active</span>
            <span className="px-3 py-1.5 rounded-full glass mono text-[#5B6470]">Live</span>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass">
              <div className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" />
              <span className="mono text-[10px]">Page 21 of 24</span>
            </div>
            <button className="h-9 px-4 rounded-full bg-white text-black text-[12px] font-semibold">Open App</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-[1240px] px-6 pt-12 md:pt-16 pb-10">
        {/* Eyebrow */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="mono text-[10px] tracking-[0.14em] px-3 py-1.5 rounded-full glass grad-border">PAGE 21 OF 24 • BLOG • AISHA'S STORY • 47 WEDDING DRESSES • £15K REVENUE • 4.9 TRUST • TOUCH OF GOD</span>
          <span className="mono text-[10px] px-2.5 py-1.5 rounded-full bg-[var(--lime)] text-black font-bold">LIVE 142 VIEWERS</span>
          <span className="mono text-[10px] px-2.5 py-1.5 rounded-full bg-[var(--orange)] text-black font-bold">BLOG DETAIL STANDALONE</span>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 md:gap-10 items-start">
          <div>
            <h1 className="text-[32px] md:text-[52px] leading-[0.92] tracking-[-0.04em]">
              How Aisha Made 47 Wedding Dresses in Oldham — £15K Revenue, 4.9 Trust, Live 142 Viewers
            </h1>
            <h2 className="mt-4 text-[22px] md:text-[30px] leading-[1.05] tracking-[-0.03em] grad-text">
              From Fabric to Final Reveal — Touch of GOD in Every Stitch
            </h2>
            <p className="mt-5 text-[15px] md:text-[17px] leading-[1.6] text-[var(--muted)] max-w-[560px]">
              247 tailors in Oldham already showing wedding dresses, Aso-Ebi, alterations — with Projects, Shop, Live Fittings, Gifts — not posts. This is Aisha's Work Profile, not Instagram.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="glass rounded-[16px] px-4 py-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center font-mono text-[10px] text-black font-bold">M</div>
                <div>
                  <div className="text-[12px] font-semibold leading-none">Aisha • AYO'S TAILORS</div>
                  <div className="mono text-[10px] text-[#5B6470] leading-none mt-1">Spindlegate Oldham OL1 • 47 projects • 4.9 ★</div>
                </div>
                <span className="ml-2 mono text-[10px] px-2 py-1 rounded-full bg-white text-black">VERIFIED</span>
              </div>
              <div className="glass rounded-[16px] px-4 py-2.5 flex items-center gap-4">
                <div><div className="mono text-[10px] text-[#5B6470]">AVG JOB</div><div className="text-[14px] font-bold">£320</div></div>
                <div className="w-px h-8 bg-[#F0E9DB]" />
                <div><div className="mono text-[10px] text-[#5B6470]">REVENUE</div><div className="text-[14px] font-bold">£15K</div></div>
                <div className="w-px h-8 bg-[#F0E9DB]" />
                <div><div className="mono text-[10px] text-[#5B6470]">LIVE</div><div className="text-[14px] font-bold">142</div></div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 max-w-[520px]">
              {[
                {l:"Projects", v:"47"},
                {l:"Trust", v:"4.9 (63)"},
                {l:"Fabric", v:"£45/m"},
              ].map(s=>(
                <div key={s.l} className="glass rounded-[14px] p-3">
                  <div className="mono text-[10px] text-[#5B6470] uppercase tracking-[0.12em]">{s.l}</div>
                  <div className="mt-1 font-bold text-[14px]">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Card */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-[28px] opacity-60 blur-[18px]" style={{background:"var(--grad)"}} />
            <div className="relative rounded-[24px] overflow-hidden glass divine-glow p-[1px]">
              <div className="rounded-[23px] overflow-hidden bg-[#F0E9DB] relative">
                <img src={imgFinal} alt="Final wedding dress reveal on mannequin Alterations Complete" className="w-full h-[520px] md:h-[640px] object-cover" />
                {/* overlay labels */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[#0A1931]/85 backdrop-blur text-white border border-[#D4CBB8]">DAY 5 FINAL REVEAL</span>
                  <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[var(--lime)] text-black font-bold">ALTERATIONS COMPLETE 12.09.2024</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <div className="glass rounded-[16px] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden bg-white"><img src={logoM2} alt="M" className="h-full w-full object-cover" /></div>
                      <span className="mono text-[11px]">WorkCut • Auto-trimmed 12sec • Touch of GOD</span>
                    </div>
                    <span className="mono text-[10px] px-2 py-1 rounded-full bg-white text-black">HOLY</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="mono text-[10px] px-3 py-1.5 rounded-full glass">247 tailors Oldham • Not posts</span>
              <span className="mono text-[10px] px-3 py-1.5 rounded-full glass">Projects • Shop • Live • Gifts</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 TIMELINE */}
      <section className="mx-auto max-w-[1240px] px-6 pb-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="mono text-[11px] tracking-[0.18em] text-[#5B6470]">SECTION 01 • STORY TIMELINE</div>
            <h3 className="text-[28px] md:text-[36px] leading-[0.95] mt-2">Day 1 Design → Day 5 Final Reveal<br/><span className="grad-text">Touch of GOD workflow</span></h3>
          </div>
          <div className="hidden md:flex gap-2">
            {timeline.map((_,i)=>(
              <button key={i} onClick={()=>setActiveDay(i)} className={`h-9 px-4 rounded-full mono text-[11px] transition ${activeDay===i?'bg-white text-black':'glass text-[#5B6470] hover:text-[#0A1931]'}`}>{timeline[i].k}</button>
            ))}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 -mx-6 px-6">
          {timeline.map((t,i)=>(
            <button key={i} onClick={()=>setActiveDay(i)} className={`shrink-0 h-9 px-4 rounded-full mono text-[11px] ${activeDay===i?'bg-white text-black':'glass text-[#5B6470]'}`}>{t.k}</button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Big active card */}
          <div className="lg:col-span-7">
            <div className="rounded-[24px] overflow-hidden glass divine-glow">
              <div className="relative">
                <img src={timeline[activeDay].img} alt={timeline[activeDay].title} className="w-full h-[420px] md:h-[540px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {timeline[activeDay].tags.map(tag=>(
                      <span key={tag} className="mono text-[9px] tracking-[0.12em] px-2.5 py-1 rounded-full bg-white/90 text-black font-bold">{tag}</span>
                    ))}
                  </div>
                  <h4 className="text-[26px] leading-[0.95] max-w-[520px]">{timeline[activeDay].title}</h4>
                  <p className="mt-3 text-[13px] leading-[1.6] text-[#5B6470] max-w-[560px]">{timeline[activeDay].desc}</p>
                </div>
                <div className="absolute top-4 right-4 mono text-[10px] px-3 py-1.5 rounded-full bg-[#0A1931]/85 backdrop-blur border border-[#D4CBB8] text-white">TOUCH OF GOD IN EVERY STITCH</div>
              </div>
            </div>
          </div>

          {/* Side list */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {timeline.map((t,i)=>(
              <button key={t.k} onClick={()=>setActiveDay(i)} className={`text-left rounded-[20px] p-4 flex gap-4 transition ${activeDay===i?'glass border-[#D4CBB8] shadow-[0_0_40px_rgba(143,255,74,0.15)]':'glass opacity-60 hover:opacity-100'}`}>
                <div className="h-[64px] w-[64px] rounded-[14px] overflow-hidden shrink-0"><img src={t.img} alt={t.title} className="h-full w-full object-cover" /></div>
                <div className="min-w-0">
                  <div className="mono text-[10px] tracking-[0.12em] text-[#5B6470]">{t.k}</div>
                  <div className="text-[14px] font-semibold leading-[1.1] mt-1">{t.title}</div>
                  <div className="mono text-[10px] text-[#5B6470] mt-1 line-clamp-2">{t.desc.slice(0,90)}…</div>
                </div>
                <div className={`ml-auto h-6 w-6 rounded-full grid place-items-center text-[12px] ${activeDay===i?'bg-white text-black':'bg-[#F0E9DB]'}`}>→</div>
              </button>
            ))}

            <div className="rounded-[20px] p-5 glass grad-border">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" />
                <span className="mono text-[10px] tracking-[0.16em]">WORK FEED LOGIC • FREE TRAFFIC</span>
              </div>
              <p className="mt-3 text-[13px] leading-[1.5] text-[#5B6470]">
                WorkCut auto-trims 47-min jobs into 12-sec divine loops. Work Feed shows to <b className="text-[#0A1931]">500 within 10mi searching "tailor Oldham"</b>. Not followers — buyers. Blog ranks forever: tailor Oldham, wedding dress tailor Manchester, Aso-Ebi specialist Oldham.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 HOW SHE GREW */}
      <section className="mx-auto max-w-[1240px] px-6 pb-16">
        <div className="rounded-[28px] p-[1px] bg-gradient-to-br from-white/20 via-white/5 to-white/10">
          <div className="rounded-[27px] bg-[#F0E9DB] p-6 md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="mono text-[11px] tracking-[0.18em] text-[#5B6470]">SECTION 02 • HOW SHE GREW</div>
                <h3 className="mt-3 text-[30px] md:text-[42px] leading-[0.92]">Gift Crown, Milestones, Shop,<br/>Trust Ledger, Escrow</h3>
              </div>
              <div className="glass rounded-[16px] px-4 py-3 flex items-center gap-3">
                <div className="text-[22px]">👑</div>
                <div>
                  <div className="mono text-[10px] text-[#5B6470]">LIVE GIFT</div>
                  <div className="text-[13px] font-bold">Crown 100 MFC • 142 viewers • Touch of GOD</div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid md:grid-cols-12 gap-5">
              {/* Milestone */}
              <div className="md:col-span-4 rounded-[20px] glass p-5">
                <div className="mono text-[10px] tracking-[0.14em] text-[#5B6470]">MILESTONES • AUTO POSTED</div>
                <div className="mt-4 space-y-3">
                  {[
                    {d:"Day 1", t:"Design + Fabric Chosen", c:"Spindlegate OL1"},
                    {d:"Day 3", t:"Fitting • Live 142", c:"Gift Crown 100 MFC"},
                    {d:"Day 5", t:"Final Reveal", c:"Alterations Complete 12.09.2024"},
                  ].map(m=>(
                    <div key={m.d} className="flex gap-3">
                      <div className="mt-1 h-6 w-6 rounded-full bg-white text-black grid place-items-center mono text-[10px] font-bold">{m.d.split(' ')[1]}</div>
                      <div>
                        <div className="text-[13px] font-semibold">{m.t}</div>
                        <div className="mono text-[10px] text-[#5B6470]">{m.c}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 h-px bg-[#F0E9DB]" />
                <div className="mt-4 mono text-[10px] text-[#5B6470] leading-[1.5]">No captions. Work Profile builds timeline from actual work, not content creation.</div>
              </div>

              {/* Shop */}
              <div className="md:col-span-4 rounded-[20px] glass p-5">
                <div className="flex items-center justify-between">
                  <div className="mono text-[10px] tracking-[0.14em] text-[#5B6470]">SHOP FABRIC</div>
                  <span className="mono text-[10px] px-2 py-1 rounded-full bg-[var(--lime)] text-black font-bold">£45/m</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    {n:"Silk", p:"£45/m", img:imgFabric},
                    {n:"Ankara Wax Print Adire Blue", p:"£45/m", img:imgFabric},
                    {n:"Aso-Ebi Lace Coral Gold", p:"£52/m", img:imgFabric},
                    {n:"Sequins + Pearls", p:"£38/m", img:imgFabric},
                  ].map(s=>(
                    <div key={s.n} className="rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-2">
                      <div className="h-[72px] rounded-[10px] overflow-hidden"><img src={s.img} alt={s.n} className="h-full w-full object-cover" /></div>
                      <div className="mt-2 text-[11px] font-semibold leading-[1.1]">{s.n}</div>
                      <div className="mono text-[10px] text-[#5B6470]">{s.p}</div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full h-10 rounded-full bg-white text-black text-[12px] font-semibold">View Shop — Buy inside profile, not DM</button>
              </div>

              {/* Trust */}
              <div className="md:col-span-4 rounded-[20px] glass p-5">
                <div className="mono text-[10px] tracking-[0.14em] text-[#5B6470]">TRUST LEDGER + ESCROW</div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white text-black grid place-items-center text-[18px] font-bold">4.9</div>
                  <div>
                    <div className="text-[14px] font-bold leading-none">4.9 Trust (63 jobs)</div>
                    <div className="mono text-[10px] text-[#5B6470] mt-1">£320 avg job • £15K revenue • Verified</div>
                  </div>
                  <div className="ml-auto mono text-[10px] px-2 py-1 rounded-full bg-[#F0E9DB]">ESCROW SECURED STRIPE</div>
                </div>
                <div className="mt-5 space-y-2">
                  {[
                    "Escrow Secured — client pays, Stripe holds, released after approval",
                    "No fake reviews — only completed jobs count",
                    "Touch of GOD badge for on-time holy delivery",
                    "Live Fittings build trust before wedding day",
                  ].map(l=>(
                    <div key={l} className="flex gap-2 text-[11px] leading-[1.4] text-[#5B6470]">
                      <span className="text-[#8FFF4A]">✓</span><span>{l}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-[12px] bg-[rgba(143,255,74,0.1)] border border-[rgba(143,255,74,0.2)] p-3 mono text-[10px] leading-[1.5]">
                  “Touch of GOD in Every Stitch” — not a slogan. Every milestone auto-verified. No SaaS fluff. Just work.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 SEO + MULTI-SKILL */}
      <section className="mx-auto max-w-[1240px] px-6 pb-16">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="rounded-[24px] glass p-7 md:p-8">
            <div className="mono text-[11px] tracking-[0.18em] text-[#5B6470]">SECTION 03 • SEO + MULTI-SKILL • BLOG RANKS FOREVER</div>
            <h3 className="mt-4 text-[28px] md:text-[36px] leading-[0.95]">Blog ranks for tailor Oldham,<br/>wedding dress tailor Manchester,<br/><span className="grad-text">Aso-Ebi specialist Oldham — free Google traffic forever</span></h3>
            <p className="mt-5 text-[14px] leading-[1.7] text-[#5B6470]">
              This page is Page 21 of 24 — Blog Detail Standalone — built to rank. Google loves Work Profiles with real projects, real location (Spindlegate Oldham OL1), real revenue. Not posts. Each blog is 100 stories of Touch of GOD.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["tailor Oldham","wedding dress tailor Manchester","Aso-Ebi specialist Oldham","alterations Oldham","Ankara tailor Manchester"].map(k=>(
                <span key={k} className="mono text-[10px] px-3 py-1.5 rounded-full bg-white text-black font-medium">{k}</span>
              ))}
            </div>
            <div className="mt-8 grid sm:grid-cols-3 gap-3">
              {[
                {icon:"🔧", title:"Mechanic • 12 stories", desc:"Engine rebuilds, MOT, live diagnostics — same Work Feed"},
                {icon:"👷", title:"Builder • 18 stories", desc:"Extensions, roofing, £20K jobs, Trust 4.9"},
                {icon:"💈", title:"Barber • 9 stories", desc:"Fades, beard trim, Live 90 viewers, Gift Crown"},
              ].map(c=>(
                <div key={c.title} className="rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-4">
                  <div className="text-[18px]">{c.icon}</div>
                  <div className="mt-2 text-[12px] font-bold">{c.title}</div>
                  <div className="mono text-[10px] text-[#5B6470] mt-1 leading-[1.4]">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] overflow-hidden glass">
              <div className="p-5 flex items-center justify-between">
                <span className="mono text-[11px]">BLESSING WALL • TOUCH OF GOD</span>
                <span className="mono text-[10px] px-2 py-1 rounded-full bg-[#F0E9DB]">{blessings.length} blessings</span>
              </div>
              <div className="px-5 pb-5">
                <div className="grid gap-2">
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="h-10 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] px-4 text-[13px] outline-none focus:border-white/30" />
                  <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Leave a blessing — how Aisha's story touched you..." className="min-h-[88px] rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 text-[13px] outline-none focus:border-white/30 resize-none" />
                  <button onClick={submitBlessing} disabled={busy} className="h-10 rounded-full bg-white text-black text-[12px] font-bold disabled:opacity-50">{busy?"Sending...":"Send Blessing • Touch of GOD"}</button>
                </div>
                <div className="mt-5 max-h-[220px] overflow-y-auto pr-1 space-y-2">
                  {blessings.length===0 && <div className="mono text-[11px] text-[#5B6470] py-6 text-center">No blessings yet — be first to honor 47 dresses</div>}
                  {blessings.map(b=>(
                    <div key={b.id} className="rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold">{b.value.name}</span>
                        <span className="mono text-[9px] text-[#5B6470]">{new Date(b.value.at).toLocaleDateString()}</span>
                      </div>
                      <div className="mono text-[11px] text-[#5B6470] mt-1 leading-[1.5]">{b.value.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[20px] glass p-5 flex gap-4 items-center">
              <div className="h-14 w-14 rounded-[14px] overflow-hidden bg-white shrink-0"><img src={logoM1} alt="M" className="h-full w-full object-cover" /></div>
              <div>
                <div className="mono text-[10px] text-[#5B6470]">BRAND • MY FACE PROFILE</div>
                <div className="text-[13px] font-bold">M Gradient #8FFF4A → #FF8A00 • cream #FFFDF7 • Glassmorphism • Holy Blog Feel</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer className="mx-auto max-w-[1240px] px-6 pb-16">
        <div className="rounded-[32px] p-[1px]" style={{background:"var(--grad)"}}>
          <div className="rounded-[31px] bg-[#FFFDF7] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.12]" style={{background:"radial-gradient(600px 400px at 20% 20%, #8FFF4A, transparent), radial-gradient(600px 400px at 80% 20%, #FF8A00, transparent)"}} />
            <div className="relative">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="mono text-[10px] px-3 py-1.5 rounded-full bg-white text-black font-bold">Page 21 of 24 • Blog Detail Standalone</span>
                <span className="mono text-[10px] px-3 py-1.5 rounded-full glass">Touch of GOD in Every Project</span>
                <span className="mono text-[10px] px-3 py-1.5 rounded-full glass">100 Blog Posts</span>
              </div>
              <h3 className="text-[32px] md:text-[54px] leading-[0.90] tracking-[-0.04em] max-w-[900px]">
                Read More Stories — 100 Blog Posts — <span className="grad-text">Touch of GOD in Every Project</span>
              </h3>

              <div className="mt-10 flex flex-wrap gap-6 items-center">
                <div className="flex gap-3">
                  <div className="h-12 px-5 rounded-[14px] bg-white text-black flex items-center gap-2">
                    <div className="text-[20px]"></div><div className="leading-[1]"><div className="mono text-[9px]">Download on</div><div className="text-[13px] font-bold -mt-0.5">App Store</div></div>
                  </div>
                  <div className="h-12 px-5 rounded-[14px] glass flex items-center gap-2">
                    <div className="text-[18px]">▶</div><div className="leading-[1]"><div className="mono text-[9px] text-[#5B6470]">Get it on</div><div className="text-[13px] font-bold -mt-0.5">Google Play</div></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    {k:"47 projects", v:"Wedding dresses"},
                    {k:"4.9 Trust", v:"63 jobs"},
                    {k:"£320 avg", v:"Per job"},
                    {k:"142 live viewers", v:"Fittings"},
                    {k:"Touch of GOD", v:"In Every Stitch"},
                  ].map(s=>(
                    <div key={s.k} className="glass rounded-[14px] px-4 py-2">
                      <div className="text-[12px] font-bold">{s.k}</div>
                      <div className="mono text-[10px] text-[#5B6470]">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex flex-wrap justify-between gap-4 pt-6 border-t border-[#D4CBB8]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-[10px] overflow-hidden bg-white"><img src={logoM2} alt="logo" className="h-full w-full object-cover" /></div>
                  <span className="mono text-[11px] text-[#5B6470]">My Face Profile © 2026 • Spindlegate Oldham OL1 • Built with Touch of GOD</span>
                </div>
                <div className="mono text-[10px] text-[#5B6470]">apps/marketing/app/blog/[slug]/page.tsx • Production-ready Tailwind • cream #FFFDF7 • M #8FFF4A→#FF8A00 • Poppins 800 • Inter • JetBrains Mono</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
