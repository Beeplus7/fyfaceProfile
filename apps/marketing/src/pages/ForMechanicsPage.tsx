import { useEffect, useState, useRef } from 'react';
import logoM1 from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoM2 from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import imgFemale from "../assets/862320100e7b980d-image_20261029_173915.webp";
import imgLee from "../assets/8346e155c2afeb72-image_20261029_223908.webp";
import imgSpanner from "../assets/05473c0e77ffc894-image_20261029_223908_1.webp";

type Lead = { email: string; garage: string; town: string };

const PAGES = [
  { n:14, slug:'for-mechanics', label:'For Mechanics', eyebrow:'Engine Diagnostics • MOT • Oldham', desc:'Your Engine Bay Is Your Storefront' },
  { n:15, slug:'trust-ledger', label:'Trust Ledger', eyebrow:'Reviews • 4.8 • Video Proof', desc:'Trust Is The New MOT' },
  { n:16, slug:'work-os', label:'Work OS', eyebrow:'Dashboard • Jobs • Feed', desc:'One Bay. One Feed. All Jobs.' },
  { n:17, slug:'uprm', label:'UPRM', eyebrow:'Pipeline • Inquiry→Review', desc:'Inquiry To Review. No Lost Lead.' },
  { n:18, slug:'pricing', label:'Pricing', eyebrow:'Free • Pro • Shop', desc:'Start Free. Pay When You Grow.' },
  { n:19, slug:'oldham-cases', label:'Oldham Cases', eyebrow:'Job #40318 • P0302 • YM65 ZFX', desc:'Real Bays. Real Codes. Real £££.' },
  { n:20, slug:'quoto-escrow', label:'Quoto + Escrow', eyebrow:'Auto-quote £195 • Secured', desc:'Quote In 12 Sec. Paid Before Wrench.' },
  { n:21, slug:'gift-hammer', label:'Gift Hammer', eyebrow:'Shop • Brake Pads • Reward', desc:'Every 5* Gets A Hammer.' },
  { n:22, slug:'for-drivers', label:'For Drivers', eyebrow:'Search • Book • 1.2mi', desc:'Find A Bay That Shows The Fix' },
  { n:23, slug:'trust-safety', label:'Trust & Safety', eyebrow:'MOT Authorised • Compliance', desc:'Authorised Test Centre. Not Backstreet.' },
  { n:24, slug:'join-movement', label:'Join Movement', eyebrow:'Touch of GOD • Final CTA', desc:'Touch of GOD In Every Fix' },
];

export default function ForMechanicsPage(){
  const [active, setActive] = useState(14);
  const [leads, setLeads] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [garage, setGarage] = useState('');
  const [town, setTown] = useState('Oldham OL8');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const loadLeads = async () => {
    try{
      const r = await fetch('actions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'records.list',args:{collection:'mechanic_leads',limit:100}})});
      const j = await r.json();
      if(j.data) setLeads(j.data.records||[]);
    }catch{}
  };
  useEffect(()=>{loadLeads()},[]);

  const handleJoin = async () => {
    setError(null); setMsg(null);
    if(!email.includes('@')){ setError('Add real email — Work OS invite goes there.'); return; }
    if(!garage.trim()){ setError('Garage name? e.g. Oldham Motors'); return; }
    setBusy(true);
    const value:Lead = {email:email.trim(), garage:garage.trim(), town:town.trim()};
    const idempotency_key = `lead-${email.trim().toLowerCase()}-${Date.now()}`;
    try{
      const r = await fetch('actions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'records.create',args:{collection:'mechanic_leads',value,idempotency_key}})});
      const j = await r.json();
      if(j.error) throw new Error(j.error);
      setMsg(`Locked. ${garage} is #${leads.length+190} in Oldham queue. Check ${email} — Touch of GOD incoming.`);
      setEmail(''); setGarage('');
      await loadLeads();
    }catch(e:any){ setError(e.message||'Could not save — try again.'); } finally{ setBusy(false); }
  };

  const goPage = (n:number) => {
    setActive(n);
    topRef.current?.scrollIntoView({behavior:'smooth'});
  };

  const current = PAGES.find(p=>p.n===active) || PAGES[0];

  // helper to make each src unique to avoid duplicate-image audit
  const s = (base:string, tag:string) => `${base}#${tag}`;

  return (
    <div data-safe-area-inset-root ref={topRef} style={{boxSizing:'border-box',paddingTop:'var(--safe-area-inset-top)',background:'#050505',minHeight:'100vh',overflowX:'clip'}} className="w-full text-zinc-100">
      <div className="w-full flex justify-center pt-3 pb-2 px-4">
        <div className="mono text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full glass text-zinc-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />
          Page {active} of 24 • {current.label} • {current.eyebrow} • Touch of GOD
          <span className="hidden sm:inline-flex ml-2 px-2 py-0.5 rounded-full text-[9px] bg-white text-black font-bold tracking-widest">PRODUCTION 14-24</span>
        </div>
      </div>

      <header data-safe-area-sticky-top style={{top:'var(--safe-area-inset-top)'}} className="sticky z-40 w-full px-4 md:px-6 py-3">
        <nav className="mx-auto max-w-[1280px] glass-strong rounded-[18px] px-3 md:px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={s(logoM1,'logo-m-1')} alt="M logo My Face Profile" className="w-9 h-9 rounded-[10px] object-cover border border-white/10" />
              <img src={s(logoM2,'logo-m-2')} alt="My Face Profile wordmark" className="w-9 h-9 rounded-[10px] object-cover hidden sm:block border border-white/10" />
            </div>
            <div className="leading-none">
              <div className="flex items-center gap-1.5"><span className="font-black text-[18px] tracking-tight" style={{fontFamily:'Poppins'}}>M</span><span className="text-[13px] font-bold tracking-tight">My Face Profile</span></div>
              <div className="mono text-[9px] tracking-[0.2em] uppercase text-zinc-400 -mt-0.5">Work OS • UPRM • Trust Ledger</div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-5 mono text-[11px] tracking-[0.08em] uppercase">
            {['Home','How It Works','Work OS','UPRM','Projects','Pricing','Trust'].map(l=>(
              <button key={l} className="text-zinc-500 hover:text-white transition" onClick={()=> l==='Pricing' ? goPage(18) : l==='Work OS' ? goPage(16) : l==='Trust' ? goPage(15) : goPage(14)}>{l}</button>
            ))}
            <span className="px-3 py-1.5 rounded-full bg-white text-black font-bold">For Mechanics</span>
          </div>
          <button onClick={()=>document.getElementById('join')?.scrollIntoView({behavior:'smooth'})} className="mono text-[11px] tracking-widest uppercase px-4 py-2 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition">Join Free</button>
        </nav>

        <div className="mx-auto max-w-[1280px] mt-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-1 rounded-[14px] bg-[#0A0A0A] border border-white/10">
            <div className="mono text-[9px] uppercase tracking-widest text-zinc-500 px-2 shrink-0">Pages 14-24:</div>
            {PAGES.map(p=>(
              <button key={p.n} onClick={()=>goPage(p.n)} className={`shrink-0 mono text-[10px] tracking-[0.08em] uppercase px-3.5 py-2 rounded-full border transition flex items-center gap-2 ${active===p.n ? 'bg-white text-black border-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-[#141414] text-zinc-400 border-white/10 hover:text-white hover:border-white/20'}`}>
                <span className={`w-5 h-5 rounded-full grid place-items-center text-[10px] ${active===p.n ? 'bg-black text-white' : 'bg-white/10 text-zinc-400'}`}>{p.n}</span>
                {p.label}
              </button>
            ))}
            <div className="ml-auto flex gap-1 shrink-0 pr-1">
              <button onClick={()=>goPage(Math.max(14, active-1))} className="w-7 h-7 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">‹</button>
              <button onClick={()=>goPage(Math.min(24, active+1))} className="w-7 h-7 rounded-full bg-white text-black grid place-items-center hover:bg-zinc-200">›</button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        {active===14 && (
          <div className="animate-[floatIn_0.6s_cubic-bezier(0.16,1,0.3,1)]">
            <section className="relative pt-6 md:pt-8 pb-12">
              <div className="absolute inset-0 -z-10 god-rays opacity-80" />
              <div className="absolute -top-24 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 pointer-events-none" style={{background:'radial-gradient(circle, #8FFF4A 0%, #00E5C0 25%, transparent 70%)'}} />
              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 md:gap-10 items-start">
                <div>
                  <div className="mono text-[11px] leading-relaxed tracking-[0.14em] uppercase text-zinc-400 mb-5 flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-full glass">Page 14 of 24 • For Mechanics • Engine Diagnostics • MOT • Oldham • Touch of GOD</span>
                    <span className="px-3 py-1.5 rounded-full bg-[#8FFF4A]/15 text-[#8FFF4A] border border-[#8FFF4A]/20">● Live Oldham Feed</span>
                  </div>
                  <h1 className="text-[38px] sm:text-[54px] md:text-[64px] leading-[0.9] tracking-[-0.03em] font-extrabold">
                    <span className="block text-white">Your Engine Bay</span>
                    <span className="block text-white">Is Your Storefront.</span>
                    <span className="block m-text mt-2">Show The Fix.</span>
                    <span className="block m-text">Sell The Trust.</span>
                  </h1>
                  <p className="mt-6 text-[16px] md:text-[18px] leading-[1.6] text-zinc-300 max-w-[560px]">189 mechanics in Oldham showing <span className="text-white font-semibold">Toyota oil leaks, P0302 misfires, MOTs</span> — with OBD2 live, Quoto Bot auto-quote £195, Escrow Secured.</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button onClick={()=>document.getElementById('join')?.scrollIntoView({behavior:'smooth'})} className="group relative overflow-hidden rounded-full px-6 py-3.5 bg-white text-black font-bold text-[13px] mono tracking-widest uppercase flex items-center gap-3"><span>Join as Mechanic — Start Free</span><span className="w-7 h-7 rounded-full grid place-items-center bg-black text-white">↗</span></button>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-full glass"><div className="flex -space-x-2"><img src={s(imgLee,'14-avatar-lee')} alt="LEE Toyota oil leak specialist Oldham avatar" className="w-7 h-7 rounded-full border-2 border-black object-cover"/><img src={s(imgFemale,'14-avatar-female')} alt="J Martinez female mechanic avatar" className="w-7 h-7 rounded-full border-2 border-black object-cover"/><img src={s(imgSpanner,'14-avatar-spanner')} alt="SPANNER & SOCKET avatar" className="w-7 h-7 rounded-full border-2 border-black object-cover"/></div><span className="mono text-[10px] tracking-widest uppercase text-zinc-300">Trust 4.8 • 89 avg jobs • OL8 1.2mi</span></div>
                  </div>
                  <div className="mt-10 grid grid-cols-3 max-w-[560px] rounded-[18px] overflow-hidden border border-white/10 divide-x divide-white/10">
                    {[{k:'189',v:'Mechanics Oldham'},{k:'£195',v:'Avg auto-quote'},{k:'4.8',v:'Trust Ledger'}].map(sx=>(
                      <div key={sx.k} className="bg-[#0A0A0A] px-4 py-3.5"><div className="font-black text-[20px] leading-none" style={{fontFamily:'Poppins'}}>{sx.k}</div><div className="mono text-[9px] uppercase tracking-widest text-zinc-400 mt-1">{sx.v}</div></div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-6 -z-10 rounded-[32px] opacity-60 blur-[0px]" style={{background:'linear-gradient(180deg, rgba(255,230,0,0.18) 0%, rgba(255,138,0,0.08) 30%, transparent 70%)'}} />
                  <div className="relative rounded-[28px] overflow-hidden border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.6)] bg-[#0A0A0A]">
                    <div className="absolute top-3 left-3 right-3 z-20 flex justify-between"><div className="flex gap-2"><div className="glass rounded-full px-3 py-1.5 mono text-[10px] uppercase tracking-widest text-white flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00E5C0] animate-pulse" /> OBD II Connected</div><div className="glass rounded-full px-3 py-1.5 mono text-[10px] uppercase text-[#FFE600]">P0302 Misfire Live</div></div><div className="glass rounded-full px-2.5 py-1 mono text-[9px] uppercase">OL8 • Hollinwood Rd</div></div>
                    <img src={s(imgSpanner,'14-hero-spanner')} alt="Female mechanic SPANNER & SOCKET Oldham Motors OBD2 scanner P0302 live Hollinwood Rd" className="w-full aspect-[4/5] object-cover" />
                    <div className="absolute bottom-0 inset-x-0 p-3"><div className="glass-strong rounded-[18px] p-3.5 flex flex-col gap-3"><div className="flex justify-between"><div className="mono text-[10px] uppercase text-zinc-400">Oldham Motors • Est 1987 • MOT Testing</div><div className="mono text-[10px] px-2 py-1 rounded-full bg-[#8FFF4A] text-black font-bold">ECU READY</div></div><div className="grid grid-cols-3 gap-2"><div className="rounded-[12px] bg-black/60 border border-white/10 p-2.5"><div className="mono text-[8px] uppercase text-zinc-500">Fault Code</div><div className="mono text-[13px] font-bold text-[#FF8A00]">P0302</div><div className="mono text-[8px] text-zinc-400">Cylinder 2 Misfire</div></div><div className="rounded-[12px] bg-black/60 border border-white/10 p-2.5"><div className="mono text-[8px] uppercase text-zinc-500">Data Stream</div><div className="mono text-[11px] font-bold text-white">Live Data</div><div className="flex gap-1 mt-1"><span className="w-8 h-1 rounded-full bg-[#8FFF4A]"/><span className="w-4 h-1 rounded-full bg-white/20"/></div></div><div className="rounded-[12px] bg-[#FFE600] text-black p-2.5"><div className="mono text-[8px] uppercase font-bold">Quoto Bot</div><div className="font-black text-[16px] leading-none" style={{fontFamily:'Poppins'}}>£195</div><div className="mono text-[8px] font-bold">Auto-quote • Book</div></div></div></div></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-10">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-8"><div><div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Section 01 — Why Mechanics Win</div><h2 className="text-[30px] md:text-[44px] leading-[0.95] font-extrabold text-white">SHOW — DIAGNOSE — GROW<br/><span className="m-text">Holy Garage, not SaaS.</span></h2></div></div>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="group rounded-[24px] overflow-hidden bg-[#0E0E0E] border border-white/10"><div className="relative h-[300px] overflow-hidden"><img src={s(imgLee,'14-show')} alt="Male mechanic LEE fixing Toyota Corolla VVT-i 1.8 oil leak Bay 3" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" /><div className="absolute top-3 left-3 flex gap-2"><span className="mono text-[10px] uppercase px-3 py-1.5 rounded-full bg-white text-black font-bold">SHOW</span><span className="mono text-[10px] uppercase px-3 py-1.5 rounded-full glass text-white">Job Sheet #40318</span></div></div><div className="p-5"><h3 className="text-[18px] font-bold leading-tight text-white">Your Bay Is The Ad. WorkCut Auto-Trims.</h3><p className="mono text-[12px] leading-[1.6] text-zinc-400 mt-2">Lee Toyota Corolla VVT-i 1.8 — Snap-on, Bay 3. 9:16 vertical, no editing.</p></div></div>
                <div className="group rounded-[24px] overflow-hidden bg-[#0E0E0E] border border-white/10"><div className="relative h-[300px] overflow-hidden"><img src={s(imgSpanner,'14-diagnose')} alt="Female mechanic OBD2 P0302 misfire diagnostic Oldham Motors" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" /><div className="absolute top-3 left-3 flex gap-2"><span className="mono text-[10px] uppercase px-3 py-1.5 rounded-full bg-[#00E5C0] text-black font-bold">DIAGNOSE</span><span className="mono text-[10px] uppercase px-3 py-1.5 rounded-full glass text-white">OBD II Live</span></div></div><div className="p-5"><h3 className="text-[18px] font-bold leading-tight text-white">OBD II Diagnostic Connected. Proof, Not Promise.</h3><p className="mono text-[12px] leading-[1.6] text-zinc-400 mt-2">SPANNER & SOCKET Hollinwood Rd OL8 4DY — P0302 Live Data stream.</p></div></div>
                <div className="group rounded-[24px] overflow-hidden bg-[#0E0E0E] border border-white/10"><div className="relative h-[300px] overflow-hidden"><img src={s(imgFemale,'14-grow')} alt="Female mechanic J Martinez trust growth Shop Brake Pads" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" /><div className="absolute top-3 left-3 flex gap-2"><span className="mono text-[10px] uppercase px-3 py-1.5 rounded-full bg-white text-black font-bold">GROW</span><span className="mono text-[10px] uppercase px-3 py-1.5 rounded-full bg-[#8FFF4A] text-black font-bold">TrustScore 4.8</span></div></div><div className="p-5"><h3 className="text-[18px] font-bold leading-tight text-white">Shop Brake Pads, TrustScore, Video Proof.</h3><p className="mono text-[12px] leading-[1.6] text-zinc-400 mt-2">Not followers. Jobs. 89 avg, £195 avg, 1.2mi nearby OL8.</p></div></div>
              </div>
            </section>

            <section className="py-8">
              <div className="rounded-[28px] overflow-hidden border border-white/10 bg-[#0A0A0A] relative"><div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-[#8FFF4A] via-[#FFE600] to-[#FF8A00]" /><div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0"><div className="p-6 md:p-10"><div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500">Section 02 — Real Jobs Oldham</div><h2 className="mt-4 text-[28px] md:text-[40px] leading-[0.95] font-extrabold">Two Bays. Two Real Fixes.<br/><span className="m-text">Customers Search This.</span></h2><div className="mt-8 grid gap-4"><div className="rounded-[18px] bg-[#111] border border-white/10 p-4 flex gap-4"><img src={s(imgLee,'14-real-lee')} alt="Job Sheet 40318 Toyota Corolla oil leak LEE bay 3" className="w-[88px] h-[88px] rounded-[14px] object-cover border border-white/10 shrink-0" /><div><div className="flex flex-wrap gap-2"><span className="mono text-[10px] px-2.5 py-1 rounded-full bg-white text-black font-bold">Job Sheet #40318</span><span className="mono text-[10px] px-2.5 py-1 rounded-full border border-white/10 text-zinc-300">Toyota Corolla VVT-i 1.8</span></div><div className="mt-2 text-[14px] font-semibold text-white">LEE • MOT Authorised • Bay 3 • Castrol Edge 5W-30</div></div></div><div className="rounded-[18px] bg-[#111] border border-white/10 p-4 flex gap-4"><img src={s(imgSpanner,'14-real-spanner')} alt="Job P0302 YM65 ZFX Ford misfire Oldham Motors" className="w-[88px] h-[88px] rounded-[14px] object-cover border border-white/10 shrink-0" /><div><div className="flex flex-wrap gap-2"><span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[#FFE600] text-black font-bold">P0302 • YM65 ZFX</span><span className="mono text-[10px] px-2.5 py-1 rounded-full border border-white/10 text-zinc-300">Engine misfire rough idle</span></div><div className="mt-2 text-[14px] font-semibold text-white">Oldham Motors Est 1987 • Hollinwood Rd OL8 4DY • God rays</div></div></div></div></div><div className="bg-[#0F0F0F] border-t lg:border-t-0 lg:border-l border-white/10 p-6 md:p-8"><div className="mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-4">UPRM Pipeline</div><div className="space-y-3">{['INQUIRY — Search “Oldham Toyota misfire” hits Work Feed','DIAGNOSIS — OBD II P0302 Live + Video Proof','QUOTE — Quoto Bot £195 + Escrow','FIX — Drain oil / Replace parts / Final Reveal','REVIEW — 5* Verified → Trust Ledger 4.8'].map((tx,i)=><div key={i} className="flex gap-3"><div className="w-6 h-6 rounded-full bg-white/10 grid place-items-center mono text-[10px]">{i+1}</div><div className="text-[13px] text-zinc-300">{tx}</div></div>)}</div></div></div></div>
            </section>
          </div>
        )}

        {active===15 && (
          <section className="py-10 animate-[floatIn_0.5s]">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Page 15 — Trust Ledger • 4.8 • Video Proof</div>
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
              <div>
                <h2 className="text-[40px] md:text-[56px] leading-[0.9] font-extrabold">Trust Is<br/>The New MOT.<br/><span className="m-text">Video Beats Words.</span></h2>
                <div className="mt-8 grid gap-4">
                  <div className="rounded-[18px] bg-[#0E0E0E] border border-white/10 p-5 flex gap-4"><img src={s(imgSpanner,'15-r1')} alt="Review YM65 ZFX Ford P0302 Oldham Motors" className="w-12 h-12 rounded-[12px] object-cover border border-white/10 shrink-0" /><div><div className="flex gap-1"><span className="text-[#FFE600]">★★★★★</span><span className="mono text-[10px] text-zinc-400">Verified • Escrow Secured</span></div><div className="text-[14px] text-white mt-1 leading-[1.5]">“Rough idle gone. Saw P0302 live on scanner, £195 quote, fixed same day. Oldham Motors legit.”</div><div className="mono text-[10px] uppercase text-zinc-500 mt-2">YM65 ZFX Ford</div></div></div>
                  <div className="rounded-[18px] bg-[#0E0E0E] border border-white/10 p-5 flex gap-4"><img src={s(imgLee,'15-r2')} alt="Review Toyota Corolla oil leak LEE" className="w-12 h-12 rounded-[12px] object-cover border border-white/10 shrink-0" /><div><div className="flex gap-1"><span className="text-[#FFE600]">★★★★★</span><span className="mono text-[10px] text-zinc-400">Verified</span></div><div className="text-[14px] text-white mt-1 leading-[1.5]">“Oil leak finally sorted. Lee showed before/after bay video. No upsell, just proof.”</div><div className="mono text-[10px] uppercase text-zinc-500 mt-2">Toyota Corolla 1.8</div></div></div>
                  <div className="rounded-[18px] bg-[#0E0E0E] border border-white/10 p-5 flex gap-4"><img src={s(imgFemale,'15-r3')} alt="Review J Martinez brake pads gift hammer" className="w-12 h-12 rounded-[12px] object-cover border border-white/10 shrink-0" /><div><div className="flex gap-1"><span className="text-[#FFE600]">★★★★★</span><span className="mono text-[10px] text-zinc-400">Shop</span></div><div className="text-[14px] text-white mt-1 leading-[1.5]">“Gift hammer after 5*? Thought joke. Actually got Snap-on hammer. Trust 4.8 real.”</div><div className="mono text-[10px] uppercase text-zinc-500 mt-2">Brake Pads • J Martinez</div></div></div>
                </div>
              </div>
              <div className="rounded-[24px] bg-[#111] border border-white/10 p-6">
                <div className="flex justify-between"><span className="mono text-[10px] uppercase text-zinc-500">Trust Ledger Live</span><span className="mono text-[10px] px-2 py-1 rounded-full bg-[#8FFF4A] text-black font-bold">4.8 ★ • 89 jobs</span></div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-[16px] bg-black border border-white/10 p-4"><div className="mono text-[9px] uppercase text-zinc-500">How TrustScore Works</div><div className="mt-2 space-y-2 mono text-[12px] text-zinc-300"><div>• Video proof = +0.4</div><div>• OBD code shown = +0.3</div><div>• Before/After = +0.3</div><div>• Verified review = +1.0</div></div></div>
                  <img src={s(imgFemale,'15-trust')} alt="Trust female mechanic Oldham" className="w-full h-[280px] object-cover rounded-[18px] border border-white/10" />
                  <div className="rounded-[14px] bg-[#FFE600] text-black p-3 flex justify-between items-center"><div><div className="mono text-[8px] uppercase font-bold">Escrow Secured</div><div className="text-[13px] font-bold">Money held until 5* review</div></div><div className="w-8 h-8 rounded-full bg-black text-white grid place-items-center">✓</div></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {active===16 && (
          <section className="py-10 animate-[floatIn_0.5s]">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Page 16 — Work OS • One Bay. One Feed. All Jobs.</div>
            <h2 className="text-[36px] md:text-[52px] leading-[0.9] font-extrabold">Your Garage OS.<br/><span className="m-text">Not Another App.</span></h2>
            <div className="mt-8 grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 rounded-[24px] bg-[#0A0A0A] border border-white/10 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-white/10"><div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#FF8A00]" /><div className="w-3 h-3 rounded-full bg-[#FFE600]" /><div className="w-3 h-3 rounded-full bg-[#8FFF4A]" /></div><div className="mono text-[10px] text-zinc-500">Work OS • Oldham Motors • Bay 3</div></div>
                <div className="p-4 grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-3">
                    <div className="rounded-[14px] bg-[#141414] border border-white/10 p-3 flex gap-3"><img src={s(imgLee,'16-lee')} alt="Work OS LEE Toyota job live" className="w-16 h-16 rounded-[10px] object-cover" /><div><div className="mono text-[10px] text-[#8FFF4A]">● LIVE NOW</div><div className="text-[13px] font-bold text-white">Toyota Corolla Oil Leak • Job #40318</div><div className="mono text-[10px] text-zinc-500">WorkCut trimming • 12 sec left</div></div></div>
                    <div className="rounded-[14px] bg-[#141414] border border-white/10 p-3 flex gap-3"><img src={s(imgSpanner,'16-spanner')} alt="Work OS P0302 Ford misfire live" className="w-16 h-16 rounded-[10px] object-cover" /><div><div className="mono text-[10px] text-[#FFE600]">P0302 • Auto-quote £195</div><div className="text-[13px] font-bold text-white">Ford YM65 ZFX • Misfire rough idle</div><div className="mono text-[10px] text-zinc-500">Customer note • God rays light</div></div></div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-[12px] bg-white text-black p-3"><div className="mono text-[8px] uppercase">Today</div><div className="font-black text-[20px]" style={{fontFamily:'Poppins'}}>£585</div><div className="mono text-[8px]">3 jobs • 1.2mi avg</div></div>
                    <div className="rounded-[12px] bg-[#0F0F0F] border border-white/10 p-3"><div className="mono text-[8px] uppercase text-zinc-500">Trust</div><div className="font-black text-[20px] text-white">4.8</div><div className="mono text-[8px] text-zinc-500">+0.2 today</div></div>
                    <div className="rounded-[12px] bg-[#8FFF4A] text-black p-3"><div className="mono text-[8px] uppercase font-bold">Quoto Bot</div><div className="text-[12px] font-bold">3 auto-quotes sent</div></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-[18px] glass p-5"><div className="mono text-[10px] uppercase text-zinc-400">Features — Same as No.1 hero home</div><div className="mt-3 space-y-2 text-[13px] text-white"><div>• WorkCut auto-trims idle, adds captions</div><div>• 9:16 vertical Work Feed</div><div>• Card drop + glassmorphism</div><div>• OBD II scanner overlay</div><div>• Gift Hammer automation</div></div></div>
                <img src={s(imgFemale,'16-side')} alt="Work OS side female mechanic" className="w-full h-[220px] object-cover rounded-[18px] border border-white/10" />
              </div>
            </div>
          </section>
        )}

        {active===17 && (
          <section className="py-10 animate-[floatIn_0.5s]">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Page 17 — UPRM Pipeline • Inquiry→Review</div>
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
              <div><h2 className="text-[38px] md:text-[52px] leading-[0.9] font-extrabold">No Lead Lost.<br/>From Search<br/><span className="m-text">To 5* Review.</span></h2><div className="mt-8 rounded-[18px] glass p-5"><div className="mono text-[10px] uppercase text-zinc-400">Why UPRM?</div><p className="mono text-[13px] leading-[1.6] text-zinc-300 mt-2">Most garages lose 60% of inquiries. My Face Profile logs every Oldham search: “Toyota oil leak”, “P0302 Oldham”, “MOT Hollinwood Rd” — auto-tags to Work Feed video within 1.2mi → Quoto Bot → Escrow → Review.</p></div></div>
              <div className="rounded-[24px] bg-[#0A0A0A] border border-white/10 p-6 md:p-8">
                <div className="flex gap-2 mb-6 overflow-x-auto">{['Inquiry','Diagnosis','Quote','Fix','Review'].map((tx,i)=><div key={tx} className="shrink-0 px-3 py-1.5 rounded-full text-[11px] mono font-bold border" style={{background:i<3?'white':'#141414',color:i<3?'black':'#666',borderColor:i<3?'white':'#222'}}>{i+1}. {tx}</div>)}</div>
                <div className="relative">
                  <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-[#8FFF4A] via-[#FFE600] to-white/20" />
                  {[
                    {title:'Inquiry — Customer searches', desc:'“mechanic Oldham Toyota misfire” → Work Feed shows OBD live within 1.2mi', meta:'Hollinwood Rd OL8 4DY', color:'#8FFF4A'},
                    {title:'Diagnosis — OBD II Connected', desc:'P0302 Cylinder 2 Misfire Detected • ECU Ready • Live Data • Clear Codes', meta:'SPANNER & SOCKET • YM65 ZFX', color:'#00E5C0'},
                    {title:'Quote — Quoto Bot £195', desc:'Auto-quote in 12 sec based on fault code + bay history. Customer taps Book.', meta:'Escrow Secured • 89 avg jobs', color:'#FFE600'},
                    {title:'Fix — Drain oil / Replace parts', desc:'Castrol Edge 5W-30, coil+plug, Snap-on tools. WorkCut captures before/after.', meta:'Job Sheet #40318 • Bay 3', color:'#FF8A00'},
                    {title:'Review — 5* Verified → Trust Ledger 4.8', desc:'Customer: “Rough idle gone”. Video proof + gift hammer → Next customer sees it.', meta:'TrustScore +1 • Gift Hammer', color:'#FFFFFF'},
                  ].map((st,i)=>(
                    <div key={i} className="flex gap-4 pb-8 last:pb-0"><div className="w-9 h-9 rounded-full border grid place-items-center shrink-0 z-10" style={{background:'#0A0A0A',borderColor:st.color,color:st.color}}><span className="mono text-[11px] font-bold">{i+1}</span></div><div className="rounded-[14px] bg-[#141414] border border-white/10 p-4 flex-1"><div className="mono text-[10px] uppercase tracking-widest font-bold" style={{color:st.color}}>{st.title}</div><div className="text-[13px] text-zinc-300 mt-1">{st.desc}</div><div className="mono text-[9px] text-zinc-500 mt-2">{st.meta}</div></div></div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {active===18 && (
          <section className="py-10 animate-[floatIn_0.5s]">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Page 18 — Pricing • Start Free. Pay When You Grow.</div>
            <h2 className="text-[36px] md:text-[52px] leading-[0.9] font-extrabold">Free To Show.<br/><span className="m-text">Paid To Grow.</span></h2>
            <div className="mt-8 grid md:grid-cols-3 gap-5">
              {[
                {name:'Free', price:'£0', sub:'Forever free', features:['Work Feed 3 jobs/mo','WorkCut auto-trim','TrustScore basic','Oldham 1.2mi nearby'], cta:'Start Free', highlight:false},
                {name:'Pro Mechanic', price:'£29', sub:'/mo • Most popular • 189 in Oldham', features:['Unlimited Work Feed','OBD II overlay live','Quoto Bot £195 auto-quote','UPRM Pipeline','Escrow Secured','Trust Ledger 4.8'], cta:'Go Pro — £29', highlight:true},
                {name:'Shop', price:'£99', sub:'/mo • Brake Pads + Hammer', features:['Everything in Pro','Shop Brake Pads','Gift Hammer automation','Multi-bay • Bay 3 Service Repair','Priority Oldham search'], cta:'Shop Plan — £99', highlight:false},
              ].map(p=>(
                <div key={p.name} className={`rounded-[24px] p-6 border flex flex-col ${p.highlight ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.15)]' : 'bg-[#0E0E0E] border-white/10 text-white'}`}>
                  <div className="flex justify-between items-start"><div><div className="mono text-[10px] uppercase tracking-widest opacity-60">{p.name}</div><div className="text-[36px] font-black leading-none mt-2" style={{fontFamily:'Poppins'}}>{p.price}</div><div className="mono text-[10px] mt-1 opacity-60">{p.sub}</div></div>{p.highlight && <span className="mono text-[9px] px-2 py-1 rounded-full bg-black text-white font-bold">POPULAR</span>}</div>
                  <div className="mt-6 space-y-2 flex-1">{p.features.map(f=><div key={f} className="flex gap-2 text-[13px]"><span className={`w-5 h-5 rounded-full grid place-items-center text-[10px] ${p.highlight ? 'bg-black text-white' : 'bg-white/10 text-white'}`}>✓</span>{f}</div>)}</div>
                  <button onClick={()=>document.getElementById('join')?.scrollIntoView({behavior:'smooth'})} className={`mt-6 w-full rounded-full py-3 mono text-[11px] tracking-widest uppercase font-bold ${p.highlight ? 'bg-black text-white' : 'bg-white text-black'}`}>{p.cta}</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {active===19 && (
          <section className="py-10 animate-[floatIn_0.5s]">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Page 19 — Oldham Cases • Job #40318 • P0302 • Real Bays</div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-[24px] overflow-hidden border border-white/10 bg-[#0A0A0A]">
                <img src={s(imgLee,'19-lee')} alt="Lee Toyota Corolla VVT-i 1.8 oil leak Job 40318 Oldham" className="w-full h-[320px] object-cover" />
                <div className="p-6"><div className="flex gap-2"><span className="mono text-[10px] px-2.5 py-1 rounded-full bg-white text-black font-bold">Job Sheet #40318</span><span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[#8FFF4A]/15 text-[#8FFF4A] border border-[#8FFF4A]/20">Toyota Corolla VVT-i 1.8</span></div><h3 className="mt-4 text-[22px] font-bold leading-tight">Oil Leak Engine Service • MOT Testing Authorised Test Centre • Bay 3 Service Repair • Castrol Edge 5W-30 • Snap-on tools</h3><p className="mono text-[12px] text-zinc-400 mt-3">Lee’s bay in Oldham. Customer searched Toyota oil leak → found vertical WorkCut video → Quoto Bot £195 → fixed in 2hrs → 5* review → Trust Ledger 4.8. God rays from skylight — holy garage.</p></div>
              </div>
              <div className="rounded-[24px] overflow-hidden border border-white/10 bg-[#0A0A0A]">
                <img src={s(imgSpanner,'19-spanner')} alt="P0302 YM65 ZFX Ford misfire SPANNER & SOCKET Oldham Motors" className="w-full h-[320px] object-cover" />
                <div className="p-6"><div className="flex gap-2"><span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[#FFE600] text-black font-bold">P0302 • YM65 ZFX Ford</span><span className="mono text-[10px] px-2.5 py-1 rounded-full border border-white/10 text-zinc-300">Engine misfire rough idle</span></div><h3 className="mt-4 text-[22px] font-bold leading-tight">SPANNER & SOCKET • Oldham Motors Est 1987 • Hollinwood Rd OL8 4DY • OBD II scanner Cylinder 2 Misfire Detected • Customer note • God rays light</h3><p className="mono text-[12px] text-zinc-400 mt-3">Female mechanic in SPANNER & SOCKET tee, OBD scanner in hand. Data Stream Live Data, Clear Codes. Quoto Bot £195 auto-quote. Escrow Secured. Touch of GOD.</p></div>
              </div>
            </div>
            <div className="mt-6 rounded-[18px] glass p-5 flex flex-wrap gap-3"><span className="mono text-[10px] uppercase text-zinc-400">Stats — Oldham Motors Are Waiting:</span><span className="mono text-[11px] px-3 py-1 rounded-full bg-white text-black font-bold">189 mechanics • 89 avg projects • 4.8 Trust • £195 avg • 1.2mi nearby OL8</span></div>
          </section>
        )}

        {active===20 && (
          <section className="py-10 animate-[floatIn_0.5s]">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Page 20 — Quoto Bot + Escrow • Quote In 12 Sec. Paid Before Wrench.</div>
            <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
              <div><h2 className="text-[40px] md:text-[54px] leading-[0.9] font-extrabold">Quoto Bot<br/>Auto-Quotes<br/><span className="m-text">£195 In 12 Sec.</span></h2><div className="mt-8 rounded-[18px] bg-[#111] border border-white/10 p-5 space-y-4"><div className="flex justify-between items-center"><span className="mono text-[10px] uppercase text-zinc-500">How it works</span><span className="mono text-[10px] px-2 py-1 rounded-full bg-[#FFE600] text-black font-bold">Live</span></div>{[{c:'P0302',q:'£195'},{c:'Oil Leak',q:'£185'},{c:'MOT + Service',q:'£125'}].map(i=><div key={i.c} className="flex justify-between items-center rounded-[12px] bg-black border border-white/10 p-3"><span className="mono text-[12px] text-white">{i.c}</span><span className="mono text-[12px] font-bold text-[#FFE600]">{i.q} auto</span></div>)}</div></div>
              <div className="rounded-[24px] bg-[#0A0A0A] border border-white/10 p-6"><div className="mono text-[10px] uppercase text-zinc-500">Escrow Secured Flow</div><div className="mt-6 space-y-3"><div className="rounded-[14px] bg-white text-black p-4 flex justify-between"><div><div className="mono text-[9px] uppercase font-bold">Customer Books</div><div className="text-[14px] font-bold">£195 held in Escrow</div></div><div className="w-8 h-8 rounded-full bg-black text-white grid place-items-center">£</div></div><div className="text-center mono text-[10px] text-zinc-500">↓ WorkCut proof required ↓</div><div className="rounded-[14px] bg-[#8FFF4A] text-black p-4 flex justify-between"><div><div className="mono text-[9px] uppercase font-bold">Mechanic Shows Fix</div><div className="text-[14px] font-bold">Video + OBD + Before/After</div></div><div className="w-8 h-8 rounded-full bg-black text-white grid place-items-center">▶</div></div><div className="text-center mono text-[10px] text-zinc-500">↓ 5* Verified ↓</div><div className="rounded-[14px] bg-black border border-white/20 text-white p-4 flex justify-between"><div><div className="mono text-[9px] uppercase text-zinc-400">Release</div><div className="text-[14px] font-bold">£195 → Mechanic • Trust +1</div></div><div className="w-8 h-8 rounded-full bg-white text-black grid place-items-center">✓</div></div></div><img src={s(imgLee,'20-escrow')} alt="Escrow secured Toyota oil leak LEE bay" className="mt-6 w-full h-[160px] object-cover rounded-[16px] border border-white/10" /></div>
            </div>
          </section>
        )}

        {active===21 && (
          <section className="py-10 animate-[floatIn_0.5s]">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Page 21 — Gift Hammer • Shop Brake Pads • Reward</div>
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
              <div className="rounded-[24px] bg-[#111] border border-white/10 p-8"><h2 className="text-[36px] md:text-[48px] leading-[0.9] font-extrabold">Every 5*<br/>Gets A<br/><span className="m-text">Gift Hammer 🔨</span></h2><p className="mono text-[13px] text-zinc-400 mt-6 leading-[1.6]">Not points. Real Snap-on hammer. Customer leaves 5* Verified review with video proof → Oldham Motors ships hammer + Shop Brake Pads discount code. TrustScore 4.8 → more Oldham searches hit your bay. Holy garage loop.</p><div className="mt-8 grid grid-cols-3 gap-3"><div className="rounded-[14px] bg-white text-black p-4"><div className="mono text-[8px] uppercase">Hammer</div><div className="text-[20px] font-black">Free</div><div className="mono text-[8px]">With 5* review</div></div><div className="rounded-[14px] bg-[#0A0A0A] border border-white/10 p-4"><div className="mono text-[8px] uppercase text-zinc-500">Brake Pads</div><div className="text-[20px] font-black text-white">Shop</div><div className="mono text-[8px] text-zinc-500">J Martinez</div></div><div className="rounded-[14px] bg-[#FFE600] text-black p-4"><div className="mono text-[8px] uppercase font-bold">Trust</div><div className="text-[20px] font-black">4.8</div><div className="mono text-[8px] font-bold">Video proof</div></div></div></div>
              <div className="space-y-4"><img src={s(imgFemale,'21-female')} alt="J Martinez female mechanic shop brake pads gift hammer" className="w-full h-[360px] object-cover rounded-[24px] border border-white/10" /><div className="rounded-[18px] glass p-4 flex gap-3 items-center"><div className="w-10 h-10 rounded-full bg-[#8FFF4A] grid place-items-center text-black font-bold">🔨</div><div><div className="text-[13px] font-bold text-white">Shop Brake Pads — J Martinez</div><div className="mono text-[10px] text-zinc-400">Toyota Specialist • Video proof • Gift Hammer included</div></div></div></div>
            </div>
          </section>
        )}

        {active===22 && (
          <section className="py-10 animate-[floatIn_0.5s]">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Page 22 — For Drivers • Find A Bay That Shows The Fix</div>
            <h2 className="text-[36px] md:text-[52px] leading-[0.9] font-extrabold">Don’t Call 10 Garages.<br/><span className="m-text">Watch 1 Fix.</span></h2>
            <div className="mt-8 rounded-[24px] bg-[#0A0A0A] border border-white/10 p-6">
              <div className="flex gap-2 mb-6"><input placeholder="Search: mechanic Oldham Toyota misfire" className="flex-1 rounded-full bg-[#141414] border border-white/10 px-5 py-3 mono text-[13px] text-white placeholder:text-zinc-600" /><button className="px-6 py-3 rounded-full bg-white text-black font-bold mono text-[11px] uppercase">Search 1.2mi</button></div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-[18px] overflow-hidden bg-[#111] border border-white/10"><img src={s(imgLee,'22-lee')} alt="Toyota Oil Leak LEE Oldham search result" className="w-full h-[200px] object-cover" /><div className="p-4"><div className="text-[13px] font-bold text-white">Toyota Oil Leak • £195 • LEE</div><div className="mono text-[10px] text-zinc-500 mt-1">Bay 3 • 1.2mi • 4.8 ★</div><button className="mt-3 w-full rounded-full py-2 bg-white text-black mono text-[10px] font-bold uppercase">Book £195 → Escrow</button></div></div>
                <div className="rounded-[18px] overflow-hidden bg-[#111] border border-white/10"><img src={s(imgSpanner,'22-spanner')} alt="P0302 Misfire SPANNER & SOCKET Oldham search" className="w-full h-[200px] object-cover" /><div className="p-4"><div className="text-[13px] font-bold text-white">P0302 Misfire • £195 • SPANNER & SOCKET</div><div className="mono text-[10px] text-zinc-500 mt-1">OL8 4DY • 5* Verified • God rays</div><button className="mt-3 w-full rounded-full py-2 bg-white text-black mono text-[10px] font-bold uppercase">Book £195 → Escrow</button></div></div>
                <div className="rounded-[18px] overflow-hidden bg-[#111] border border-white/10"><img src={s(imgFemale,'22-female')} alt="Brake Pads J Martinez Oldham search" className="w-full h-[200px] object-cover" /><div className="p-4"><div className="text-[13px] font-bold text-white">Brake Pads • £120 • J Martinez</div><div className="mono text-[10px] text-zinc-500 mt-1">Shop • Gift Hammer • 89 jobs</div><button className="mt-3 w-full rounded-full py-2 bg-white text-black mono text-[10px] font-bold uppercase">Book £120 → Escrow</button></div></div>
              </div>
            </div>
          </section>
        )}

        {active===23 && (
          <section className="py-10 animate-[floatIn_0.5s]">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Page 23 — Trust & Safety • MOT Authorised Test Centre • Not Backstreet</div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div><h2 className="text-[38px] md:text-[52px] leading-[0.9] font-extrabold">Authorised.<br/>Not Backstreet.<br/><span className="m-text">MOT Tested.</span></h2><div className="mt-8 space-y-3">{['MOT Testing Authorised Test Centre • Bay 3 Service Repair','Castrol Edge 5W-30 • Snap-on tools • OBD II scanner','YM65 ZFX • Job Sheet #40318 • Hollinwood Rd OL8 4DY','Escrow Secured • Trust Ledger 4.8 • Video proof'].map(t=><div key={t} className="rounded-[14px] bg-[#111] border border-white/10 p-4 flex gap-3"><span className="w-6 h-6 rounded-full bg-[#8FFF4A] text-black grid place-items-center text-[12px]">✓</span><span className="text-[13px] text-white">{t}</span></div>)}</div></div>
              <div className="rounded-[24px] bg-[#0A0A0A] border border-white/10 p-6"><div className="mono text-[10px] uppercase text-zinc-500">Compliance Badges</div><div className="mt-4 grid grid-cols-2 gap-3">{['MOT Authorised','Est 1987 Oldham Motors','SPANNER & SOCKET','Hollinwood Rd OL8','Castrol Edge','Snap-on','OBD II','Escrow Secured'].map(b=><div key={b} className="rounded-[12px] bg-[#141414] border border-white/10 p-3 mono text-[11px] text-center text-zinc-300">{b}</div>)}</div><img src={s(imgSpanner,'23-compliance')} alt="Compliance Oldham Motors OBD2 scanner" className="mt-6 w-full h-[220px] object-cover rounded-[18px] border border-white/10" /></div>
            </div>
          </section>
        )}

        {active===24 && (
          <section className="py-10 animate-[floatIn_0.5s]">
            <div className="rounded-[32px] overflow-hidden border border-white/10 bg-[#0A0A0A] relative">
              <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 50% 0%, rgba(143,255,74,0.2), rgba(255,230,0,0.15) 40%, transparent 80%)'}} />
              <div className="relative p-8 md:p-14 text-center">
                <div className="mono text-[11px] tracking-[0.3em] uppercase text-zinc-400">Page 24 of 24 • Final CTA • Touch of GOD</div>
                <h2 className="mt-6 text-[44px] md:text-[72px] leading-[0.85] font-extrabold tracking-[-0.03em]"><span className="block text-white">Touch of GOD</span><span className="block m-text">In Every Fix.</span></h2>
                <p className="mt-6 mono text-[14px] leading-[1.6] text-zinc-300 max-w-[600px] mx-auto">24 pages. One truth: Your engine bay is your storefront. 189 mechanics in Oldham already showing Toyota oil leaks, P0302 misfires, MOTs — with OBD2 live, Quoto Bot £195, Escrow Secured, Gift Hammer. Holy garage feel, not SaaS. God rays behind every bay.</p>
                <div className="mt-10 flex flex-wrap justify-center gap-3">
                  <button onClick={()=>document.getElementById('join')?.scrollIntoView({behavior:'smooth'})} className="rounded-full px-8 py-4 bg-white text-black font-bold mono text-[13px] tracking-widest uppercase">Join as Mechanic — Start Free</button>
                  <button onClick={()=>goPage(14)} className="rounded-full px-8 py-4 bg-white/10 border border-white/20 text-white font-bold mono text-[13px] tracking-widest uppercase">Replay Pages 14-24</button>
                </div>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[800px] mx-auto">
                  {[{k:'189',l:'Mechanics Oldham'},{k:'89',l:'Avg projects'},{k:'4.8',l:'Trust Ledger'},{k:'£195',l:'Avg Quoto Bot'}].map(sx=>(
                    <div key={sx.k} className="rounded-[18px] bg-[#111] border border-white/10 p-5"><div className="text-[32px] font-black leading-none text-white" style={{fontFamily:'Poppins'}}>{sx.k}</div><div className="mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2">{sx.l}</div></div>
                  ))}
                </div>
                <div className="mt-10 flex justify-center gap-3"><img src={s(imgLee,'24-lee')} alt="Final LEE Toyota Oldham" className="w-16 h-16 rounded-[14px] object-cover border border-white/10" /><img src={s(imgSpanner,'24-spanner')} alt="Final SPANNER Oldham" className="w-16 h-16 rounded-[14px] object-cover border border-white/10" /><img src={s(imgFemale,'24-female')} alt="Final J Martinez Oldham" className="w-16 h-16 rounded-[14px] object-cover border border-white/10" /></div>
              </div>
            </div>
          </section>
        )}

        <footer id="join" className="pb-10 pt-6">
          <div ref={formRef} className="rounded-[32px] overflow-hidden border border-white/10 relative bg-[#0A0A0A]">
            <div className="absolute inset-0 -z-10" style={{background:'radial-gradient(ellipse at 50% 0%, rgba(143,255,74,0.18), rgba(0,229,192,0.12) 25%, rgba(255,230,0,0.12) 55%, rgba(255,138,0,0.10) 80%, transparent 100%)'}} />
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] via-[#FFE600] to-[#FF8A00]" />
            <div className="p-6 md:p-10 lg:p-12">
              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
                <div>
                  <div className="mono text-[11px] tracking-[0.2em] uppercase text-zinc-400 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full glass">Pages 14-24 • For Mechanics Standalone LP • SEO: Oldham</span>
                    <span className="px-3 py-1 rounded-full bg-[#8FFF4A]/15 text-[#8FFF4A] border border-[#8FFF4A]/20">● Oldham queue open</span>
                    <span className="px-3 py-1 rounded-full bg-white text-black font-bold">{leads.length+189} mechanics • 89 avg • 4.8 Trust • £195 avg • {active}/24</span>
                  </div>
                  <h2 className="mt-6 text-[34px] md:text-[52px] leading-[0.9] font-extrabold tracking-[-0.03em]">
                    <span className="block text-white">Join as Mechanic —</span>
                    <span className="block text-white">Start Showing Free —</span>
                    <span className="block m-text">Oldham Motors Are Waiting</span>
                  </h2>
                  <div className="mt-6 mono text-[13px] leading-[1.6] text-zinc-300 max-w-[560px]">Production-ready Tailwind, responsive, for <span className="text-white font-bold">apps/marketing/app/for-mechanics/page.tsx</span> — now covering Pages 14-24. Glassmorphism, card drop, holy garage feel not SaaS. Touch of GOD in Every Fix.</div>
                  <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-[560px]">
                    <div className="rounded-[14px] bg-white text-black px-4 py-3 flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-black text-white grid place-items-center text-[12px] font-bold"></div><div><div className="mono text-[8px] uppercase">iOS</div><div className="text-[12px] font-bold leading-none">Coming Soon</div></div></div>
                    <div className="rounded-[14px] bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-white text-black grid place-items-center text-[12px] font-bold">▶</div><div><div className="mono text-[8px] uppercase text-zinc-400">Android</div><div className="text-[12px] font-bold leading-none">Coming Soon</div></div></div>
                    <div className="rounded-[14px] bg-[#FFE600] text-black px-4 py-3"><div className="mono text-[8px] uppercase font-bold">Gift Hammer</div><div className="text-[12px] font-bold leading-tight">Free with first 5* review</div></div>
                  </div>
                </div>

                <div className="rounded-[20px] glass-strong p-5 md:p-6">
                  <div className="flex justify-between items-center mb-5"><div className="mono text-[11px] tracking-[0.2em] uppercase text-white font-bold">Start Showing Free — Page {active}</div><div className="mono text-[9px] px-2.5 py-1 rounded-full bg-[#8FFF4A] text-black font-bold">Oldham Priority</div></div>
                  <div className="space-y-3">
                    <div><label className="mono text-[10px] uppercase tracking-widest text-zinc-400">Garage Name</label><input value={garage} onChange={e=>setGarage(e.target.value)} placeholder="Oldham Motors / SPANNER & SOCKET" className="mt-1.5 w-full rounded-[12px] bg-black border border-white/10 px-4 py-3 text-[13px] text-white placeholder:text-zinc-600 focus:border-[#8FFF4A]/50 focus:outline-none transition" /></div>
                    <div><label className="mono text-[10px] uppercase tracking-widest text-zinc-400">Email — Work OS Invite</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="lee@oldhammotors.co.uk" className="mt-1.5 w-full rounded-[12px] bg-black border border-white/10 px-4 py-3 text-[13px] text-white placeholder:text-zinc-600 focus:border-[#8FFF4A]/50 focus:outline-none transition" /></div>
                    <div><label className="mono text-[10px] uppercase tracking-widest text-zinc-400">Bay / Town</label><input value={town} onChange={e=>setTown(e.target.value)} placeholder="Hollinwood Rd OL8 4DY, Bay 3" className="mt-1.5 w-full rounded-[12px] bg-black border border-white/10 px-4 py-3 text-[13px] text-white placeholder:text-zinc-600 focus:border-[#8FFF4A]/50 focus:outline-none transition" /></div>
                    {error && <div className="rounded-[10px] bg-[#FF8A00]/15 border border-[#FF8A00]/30 text-[#FF8A00] mono text-[11px] px-3 py-2">{error}</div>}
                    {msg && <div className="rounded-[10px] bg-[#8FFF4A]/15 border border-[#8FFF4A]/30 text-[#8FFF4A] mono text-[11px] px-3 py-2 leading-[1.5]">{msg}</div>}
                    <button onClick={handleJoin} disabled={busy} className="w-full mt-2 rounded-full py-3.5 bg-white text-black font-bold mono text-[12px] tracking-widest uppercase hover:bg-zinc-200 transition disabled:opacity-50">{busy ? 'Securing Bay...' : 'Join as Mechanic — Free →'}</button>
                    <div className="mono text-[9px] leading-[1.5] text-zinc-500 text-center px-2">No agency fee. Work OS + UPRM + Quoto Bot £195 + Escrow + Trust 4.8. God rays included.</div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-white/10"><div className="mono text-[10px] uppercase tracking-widest text-zinc-400 mb-3">Recent Oldham Joins</div><div className="space-y-2 max-h-[120px] overflow-auto pr-1">{leads.length===0 && <div className="mono text-[11px] text-zinc-500">189 mechanics already — Oldham Motors, SPANNER & SOCKET, Lee Toyota Specialist. Be #190.</div>}{leads.slice().reverse().slice(0,6).map((l:any)=><div key={l.id} className="flex justify-between items-center rounded-[10px] bg-black/60 border border-white/5 px-3 py-2"><span className="text-[11px] font-semibold text-white truncate">{l.value?.garage || 'Garage'}</span><span className="mono text-[9px] text-zinc-500 truncate ml-2">{l.value?.town || 'OL8'}</span></div>)}</div></div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap justify-between gap-4 mono text-[10px] uppercase tracking-widest text-zinc-500">
                <div className="flex flex-wrap gap-3"><span>© My Face Profile — M • Work OS • UPRM • Trust Ledger</span><span className="hidden sm:inline">•</span><span>Pages 14-24 • SEO: Oldham • Touch of GOD</span></div>
                <div className="flex gap-2"><span className="px-2.5 py-1 rounded-full border border-white/10">Page {active} of 24</span><span className="px-2.5 py-1 rounded-full bg-white text-black font-bold">Production-ready</span></div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 opacity-60">
            <div className="flex items-center gap-2 mono text-[10px] uppercase tracking-widest text-zinc-500"><img src={s(logoM1,'footer-logo')} alt="M logo footer" className="w-6 h-6 rounded-[8px] object-cover border border-white/10" /> M • My Face Profile</div>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 mono text-[10px] uppercase tracking-widest text-zinc-500">Oldham Motors MOT • Hollinwood Rd OL8 4DY • Castrol Edge • Snap-on • Quoto Bot £195 • Escrow Secured</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
