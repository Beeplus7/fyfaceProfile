import { useEffect, useState, useRef } from 'react';
import logoOldham from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoMFace from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import imgTailors from "../assets/a57a388e71b1e926-image_20261029_223418.webp";
import imgMechanic from "../assets/862320100e7b980d-image_20261029_173915.webp";
import imgBuilder from "../assets/727cc9fbccc433e9-image_20261029_173918.webp";
import imgPlumber from "../assets/a0e4b743decf2716-image_20261029_190129.webp";

type ContactRecord = {
  id: string;
  value: {
    name: string;
    email: string;
    intent: string;
    message: string;
    createdLabel: string;
  };
  created_at: string;
};

export default function ContactPage() {
  const [activeIntent, setActiveIntent] = useState<'pro'|'customer'|'partner'|'press'>('pro');
  const [form, setForm] = useState({ name: '', email: '', intent: 'pro', message: '' });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{saved: number, remaining: number, error: string|null, reloadError: string|null}|null>(null);
  const [records, setRecords] = useState<ContactRecord[]>([]);
  const [showToast, setShowToast] = useState<string|null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const reloadRecords = async () => {
    try {
      const res = await fetch('actions', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({ action: 'records.list', args: { collection: 'contact_submissions', limit: 50 } })
      });
      const j = await res.json();
      if (!res.ok || j.error) throw new Error(j.error || 'list failed');
      const recs = (j.data?.records || []) as ContactRecord[];
      setRecords(recs.sort((a,b)=> new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(()=>{ reloadRecords(); }, []);

  const createRow = async (row: typeof form) => {
    const idempotency_key = `${row.email}-${row.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const res = await fetch('actions', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        action: 'records.create',
        args: {
          collection: 'contact_submissions',
          value: {
            name: row.name,
            email: row.email,
            intent: row.intent,
            message: row.message,
            createdLabel: new Date().toLocaleString('en-GB', {day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'})
          },
          idempotency_key
        }
      })
    });
    const j = await res.json();
    if (!res.ok || j.error) throw new Error(j.error || 'create failed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setShowToast('Fill name, email and message');
      setTimeout(()=>setShowToast(null), 2500);
      return;
    }
    const rows = [form];
    setBusy(true);
    let saved = 0;
    let error: string | null = null;
    try {
      for (const row of rows) {
        await createRow(row);
        saved += 1;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
    let reloadError: string | null = null;
    try {
      await reloadRecords();
    } catch (err) {
      reloadError = err instanceof Error ? err.message : String(err);
    }
    setResult({ saved, remaining: rows.length - saved, error, reloadError });
    setBusy(false);
    if (!error) {
      setForm({ name: '', email: '', intent: 'pro', message: '' });
      setShowToast('Message secured — Touch of GOD');
      setTimeout(()=>setShowToast(null), 3000);
    } else {
      setShowToast(error);
      setTimeout(()=>setShowToast(null), 3500);
    }
  };

  return (
    <div data-safe-area-inset-root style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)', background: '#FFFDF7', minHeight: '100vh' }} className="w-full overflow-x-clip antialiased selection:bg-[#FFC300]/35 selection:text-[#0A1931]">
      
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[30%] left-[10%] w-[70%] h-[60%] rounded-full blur-[120px] opacity-[0.12]" style={{background: 'var(--m-gradient)'}} />
        <div className="absolute top-[40%] -right-[20%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-[0.08] bg-[#00E5C0]" />
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black to-transparent opacity-60" />
      </div>

      <header data-safe-area-sticky-top style={{ top: 'var(--safe-area-inset-top)' }} className="sticky z-50 w-full border-b border-[#D4CBB8] backdrop-blur-2xl bg-[#FFFDF7]/90">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-[10px]">
              <div className="w-[36px] h-[36px] rounded-[10px] bg-gradient-to-br from-[#8FFF4A] via-[#00E5C0] via-[#FFE600] to-[#FF8A00] flex items-center justify-center font-poppins text-black text-[18px] leading-none">M</div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full border border-[#D4CBB8] overflow-hidden" style={{backgroundImage:`url(${logoOldham})`, backgroundSize:'cover', backgroundPosition:'center'}} aria-label="Oldham logo" />
                <div className="w-7 h-7 rounded-full border border-[#D4CBB8] overflow-hidden" style={{backgroundImage:`url(${logoMFace})`, backgroundSize:'cover', backgroundPosition:'center'}} aria-label="My Face Profile logo" />
              </div>
            </div>
            <div className="h-5 w-px bg-[#F0E9DB] hidden md:block" />
            <div className="flex flex-col">
              <span className="font-poppins text-[13px] tracking-[-0.02em] leading-none text-[#0A1931]">My Face Profile</span>
              <span className="font-mono text-[9px] tracking-[0.18em] text-[#5B6470] uppercase mt-[2px]">Oldham • OL1 • All Trades</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <nav className="hidden md:flex items-center gap-6 font-mono text-[11px] tracking-[0.12em] uppercase">
              <span className="text-[#5B6470] hover:text-[#5B6470] transition">Home</span>
              <span className="text-[#5B6470] hover:text-[#5B6470] transition">Pros</span>
              <span className="text-[#5B6470] hover:text-[#5B6470] transition">Work</span>
              <span className="px-3 py-1.5 rounded-full bg-white text-black font-bold tracking-[0.12em]">Contact</span>
            </nav>
            <div className="hidden md:flex items-center gap-2 glass rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-[#8FFF4A] animate-pulse" />
              <span className="font-mono text-[10px] text-[#5B6470] uppercase tracking-[0.12em]">1247 pros online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="mt-8 md:mt-12 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 border-gradient-m">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#FF8A00] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#5B6470]">Page 20 of 24 • Contact • Oldham • All Trades • Touch of GOD</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] px-3 py-1.5">
            <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">Badge:</span>
            <span className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-gradient-m">Contact Standalone</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 md:gap-10 items-start">
          <div>
            <h1 className="font-poppins text-[40px] md:text-[64px] lg:text-[72px] leading-[0.9] tracking-[-0.05em] text-[#0A1931]">
              Come to Oldham.<br/>
              <span className="text-[#0A1931]">See Real Work.</span>
            </h1>
            <div className="mt-5">
              <h2 className="font-poppins text-[22px] md:text-[28px] leading-[1.1] tracking-[-0.03em] text-gradient-m">
                hello@myfaceprofile.com<br/>— Oldham OL1
              </h2>
            </div>
            <p className="mt-6 max-w-[560px] font-mono text-[13px] md:text-[14px] leading-[1.6] text-[#5B6470]">
              <span className="text-[#0A1931]">247 tailors, 189 mechanics, 124 builders, 98 barbers, 87 electricians, 76 plumbers</span> in Oldham already showing real work — Contact us for jobs, partnership, press. No SaaS fluff. Just faces, hands, and finished work in OL1.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="group relative inline-flex items-center gap-3 rounded-full bg-white text-black px-6 py-3.5 font-poppins text-[14px] tracking-[-0.02em] overflow-hidden">
                <span className="relative z-10">Contact Us Now</span>
                <span className="relative z-10 w-7 h-7 rounded-full bg-[#0A1931] text-white flex items-center justify-center text-[14px] group-hover:rotate-45 transition-transform">↗</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-[#8FFF4A] to-[#FFE600]" />
              </a>
              <div className="inline-flex items-center gap-3 rounded-full glass px-5 py-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-black" style={{backgroundImage:`url(${imgTailors})`, backgroundSize:'cover'}} />
                  <div className="w-8 h-8 rounded-full border-2 border-black" style={{backgroundImage:`url(${imgMechanic})`, backgroundSize:'cover'}} />
                  <div className="w-8 h-8 rounded-full border-2 border-black" style={{backgroundImage:`url(${imgBuilder})`, backgroundSize:'cover'}} />
                </div>
                <span className="font-mono text-[11px] leading-[1.2] text-[#5B6470]">Trusted by<br/><b className="text-[#0A1931]">1247 Oldham pros</b></span>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-[520px]">
              {[
                {k:'Pros', v:'1247'},
                {k:'Projects', v:'12K+'},
                {k:'Trust', v:'4.9/5'},
              ].map(s=>(
                <div key={s.k} className="glass rounded-[16px] p-4">
                  <div className="font-poppins text-[22px] leading-none text-[#0A1931]">{s.v}</div>
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470] mt-1">{s.k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero grid 2x2 - ONLY place using <img> for trades to avoid duplicates */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              {img: imgTailors, label: "AYO'S TAILORS", sub: "Spindlegate OL1 • Aso-Ebi measuring", accent: "Tailors 247", alt: "AYO'S TAILORS Spindlegate Oldham OL1 measuring Aso-Ebi"},
              {img: imgMechanic, label: "J Martinez", sub: "Female mechanic • OBD2 • Oldham", accent: "Mechanics 189", alt: "Female mechanic J Martinez"},
              {img: imgBuilder, label: "Oldham Builders", sub: "Laying bricks • OL1 • Real work", accent: "Builders 124", alt: "Oldham Builders laying bricks"},
              {img: imgPlumber, label: "Gas Safe Plumber", sub: "Worcester Bosch • 76 plumbers", accent: "Plumbers 76", alt: "Plumber Gas Safe Worcester Bosch boiler"},
            ].map((c,i)=>(
              <div key={i} className="group relative aspect-[4/5] md:aspect-[4/5] overflow-hidden rounded-[24px] glass-strong glow-m">
                <img src={c.img} alt={c.alt} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  <div className="glass rounded-full px-2.5 py-1">
                    <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#0A1931]">{c.accent}</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px]">↗</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <div className="font-poppins text-[12px] md:text-[13px] leading-[1.1] text-[#0A1931]">{c.label}</div>
                  <div className="font-mono text-[10px] leading-[1.3] text-[#5B6470] mt-1">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section id="contact" className="mt-20 md:mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-m flex items-center justify-center text-black font-mono text-[12px] font-bold">01</div>
            <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#5B6470]">SECTION 1 — CONTACT • Oldham OL1 • Location Proof</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-5 md:gap-6">
            <div className="space-y-4">
              <div className="glass-strong rounded-[24px] p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5B6470]">Email • Primary</div>
                    <div className="mt-2 font-poppins text-[20px] md:text-[22px] leading-[1.1] text-[#0A1931]">hello@myfaceprofile.com</div>
                    <div className="mt-1 font-mono text-[11px] text-[#5B6470]">Response in 2h • 9-5 GMT • Oldham OL1</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-m flex items-center justify-center text-black">✉</div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {l:'Location', v:'Oldham OL1', d:'Spindlegate • AYO’S TAILORS block'},
                    {l:'Office Hours', v:'9AM — 5PM GMT', d:'Mon—Sat • Touch of GOD time'},
                    {l:'Discord', v:'discord.gg/myface', d:'1247 pros • Live'},
                    {l:'X / LinkedIn', v:'@myfaceprofile', d:'Press & partners'},
                  ].map(x=>(
                    <div key={x.l} className="rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-4">
                      <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#5B6470]">{x.l}</div>
                      <div className="mt-1 font-poppins text-[13px] text-[#0A1931]">{x.v}</div>
                      <div className="font-mono text-[10px] text-[#5B6470] mt-1">{x.d}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 h-px bg-[#F0E9DB]" />

                <div ref={formRef} className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5B6470]">Send Message • Secured • Escrow</span>
                    {result && (
                      <span className="font-mono text-[10px] text-[#5B6470]">
                        {result.saved >0 ? `${result.saved} saved` : ''} {result.error ? `• ${result.error}` : ''}
                      </span>
                    )}
                  </div>
                  <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Your name" className="w-full rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] px-4 py-3 font-mono text-[13px] text-[#0A1931] placeholder:text-[#5B6470] focus:outline-none focus:border-[#8FFF4A]/50" />
                      <input value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="Email — Oldham pro?" className="w-full rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] px-4 py-3 font-mono text-[13px] text-[#0A1931] placeholder:text-[#5B6470] focus:outline-none focus:border-[#8FFF4A]/50" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        {k:'pro', l:'Pro — Join Free'},
                        {k:'customer', l:'Customer'},
                        {k:'partner', l:'Partner'},
                        {k:'press', l:'Press'},
                      ].map(o=>(
                        <button 
                          type="button" 
                          key={o.k} 
                          onClick={()=>{
                            setForm({...form, intent: o.k});
                            setShowToast(`Intent: ${o.l}`);
                            setTimeout(()=>setShowToast(null), 2000);
                          }} 
                          data-intent={o.k}
                          data-active={form.intent===o.k}
                          className={`rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase border transition ${form.intent===o.k ? 'bg-white text-black border-white' : 'bg-[#F0E9DB] text-[#5B6470] border-[#D4CBB8] hover:text-[#0A1931] hover:border-[#D4CBB8]'}`}>{o.l}</button>
                      ))}
                    </div>
                    <textarea value={form.message} onChange={e=>setForm({...form, message: e.target.value})} placeholder="Tell us about your trade, job, or story in Oldham..." rows={4} className="w-full rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] px-4 py-3 font-mono text-[13px] text-[#0A1931] placeholder:text-[#5B6470] focus:outline-none focus:border-[#8FFF4A]/50 resize-none" />
                    <button disabled={busy} className="w-full rounded-full bg-gradient-m text-black font-poppins text-[14px] py-3.5 disabled:opacity-50 hover:opacity-90 transition">
                      {busy ? 'Securing...' : `Send to Oldham — ${form.intent.toUpperCase()}`}
                    </button>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-[10px] text-[#5B6470]">Storage limit 1000 • Secured ledger • No spam • Touch of GOD</span>
                      <span className="font-mono text-[10px] text-[#5B6470]">{records.length} messages in ledger</span>
                    </div>
                  </form>

                  {records.length>0 && (
                    <div className="mt-6 space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {records.slice(0,8).map(r=>(
                        <div key={r.id} className="flex items-center gap-3 rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] px-3 py-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-m flex items-center justify-center text-[10px] text-black font-bold">{r.value.name?.[0] || '?'}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-[11px] text-[#0A1931] truncate">{r.value.name} • {r.value.intent}</div>
                            <div className="font-mono text-[10px] text-[#5B6470] truncate">{r.value.message.slice(0,60)}</div>
                          </div>
                          <div className="font-mono text-[9px] text-[#5B6470]">{r.value.createdLabel}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative rounded-[24px] overflow-hidden glass-strong min-h-[560px] lg:min-h-[700px] group">
              <div className="absolute inset-0" style={{backgroundImage:`url(${imgTailors})`, backgroundSize:'cover', backgroundPosition:'center'}} aria-label="AYO'S TAILORS Spindlegate Oldham OL1 shop as location proof" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#8FFF4A]/10 via-transparent to-[#FF8A00]/10 opacity-60" />

              <div className="absolute top-5 left-5 right-5 flex justify-between items-start gap-3">
                <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#8FFF4A] animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#0A1931]">Live Location • Spindlegate OL1</span>
                </div>
                <div className="glass rounded-[12px] px-3 py-2">
                  <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#5B6470]">GPS Verified</div>
                  <div className="font-mono text-[11px] text-[#0A1931] mt-0.5">53.5409°N 2.1114°W</div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <div className="glass-strong rounded-[20px] p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#8FFF4A] text-black px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.12em] uppercase">Location Proof • Verified Shop</div>
                      <h4 className="mt-3 font-poppins text-[22px] leading-[1.05] text-[#0A1931]">AYO'S TAILORS — Spindlegate, Oldham OL1</h4>
                      <p className="mt-2 font-mono text-[12px] leading-[1.5] text-[#5B6470] max-w-[360px]">Real measuring. Real Aso-Ebi. This is where we built My Face Profile. Come see the tapes, the chalk, the hands that make Oldham dress well.</p>
                    </div>
                    <div className="hidden md:flex w-10 h-10 rounded-full bg-white text-black items-center justify-center">◐</div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      {k:'Tailors nearby', v:'247'},
                      {k:'Walk-ins today', v:'38'},
                      {k:'Aso-Ebi fits', v:'12K+'},
                    ].map(i=>(
                      <div key={i.k} className="rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                        <div className="font-poppins text-[16px] text-[#0A1931] leading-none">{i.v}</div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#5B6470] mt-1">{i.k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 md:mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-mono text-[12px] font-bold">02</div>
            <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#5B6470]">SECTION 2 — HOW TO REACH • Multi-Skill Paths</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id:'pro',
                title:'For Pros — Join Free',
                desc:'Tailor, mechanic, builder, barber, electrician, plumber in OL1 OL2 OL8. Show real work. Get real jobs. No CV.',
                cta:'Join as Pro — Free',
                img: imgMechanic,
                stats: '247 tailors • 189 mechanics',
                color: 'from-[#8FFF4A] to-[#00E5C0]'
              },
              {
                id:'customer',
                title:'For Customers — Search',
                desc:'Need a real person in Oldham? See faces, hands, finished work. Message direct. Escrow secured. Touch of GOD.',
                cta:'Search Oldham Trades',
                img: imgBuilder,
                stats: '124 builders • 98 barbers',
                color: 'from-[#00E5C0] to-[#FFE600]'
              },
              {
                id:'partner',
                title:'For Partners — Partnership',
                desc:'Suppliers, councils, colleges in Oldham. Co-build VisaguideOS → My Face Profile. Real supply chain.',
                cta:'Partner with Us',
                img: imgPlumber,
                stats: '87 electricians • 76 plumbers',
                color: 'from-[#FFE600] to-[#FF8A00]'
              },
              {
                id:'press',
                title:'For Press — Story',
                desc:'From VisaguideOS to My Face Profile. How Oldham OL1 became the lab for real-work profiles. Interview us.',
                cta:'Press Story Access',
                img: imgTailors,
                stats: 'OL1 • OL2 • OL8 • 1247 pros',
                color: 'from-[#8FFF4A] via-[#FFE600] to-[#FF8A00]'
              },
            ].map(card=>(
              <div key={card.id} className={`group relative rounded-[24px] overflow-hidden glass border-[#D4CBB8] hover:border-[#D4CBB8] transition ${activeIntent===card.id ? 'ring-1 ring-[#8FFF4A]/40' : ''}`} onMouseEnter={()=>setActiveIntent(card.id as any)}>
                <div className="relative h-[220px] overflow-hidden">
                  <div className="absolute inset-0" style={{backgroundImage:`url(${card.img})`, backgroundSize:'cover', backgroundPosition:'center'}} aria-label={card.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className={`absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-br ${card.color}`} />
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    <div className="glass rounded-full px-2.5 py-1">
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#0A1931]">{card.stats}</span>
                    </div>
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center text-black text-[12px]`}>↗</div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="font-poppins text-[16px] leading-[1.05] text-[#0A1931]">{card.title}</div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-mono text-[11px] leading-[1.5] text-[#5B6470] min-h-[54px]">{card.desc}</p>
                  <button onClick={()=>{setForm(f=>({...f, intent: card.id})); setActiveIntent(card.id as any); formRef.current?.scrollIntoView({behavior:'smooth', block:'center'}); setShowToast(`${card.title} selected`); setTimeout(()=>setShowToast(null),2000)}} className="mt-4 w-full rounded-full bg-[#F0E9DB] border border-[#D4CBB8] hover:bg-white hover:text-black transition px-4 py-2.5 font-mono text-[11px] tracking-[0.08em] uppercase text-[#5B6470]">{card.cta}</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 md:mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-m flex items-center justify-center text-black font-mono text-[12px] font-bold">03</div>
            <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#5B6470]">SECTION 3 — MAP + TRUST • Oldham Is Where We Build</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
            <div className="rounded-[24px] glass-strong p-5 md:p-6 overflow-hidden relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-poppins text-[22px] leading-[1.05] text-[#0A1931]">Oldham is where we build</div>
                  <div className="mt-1 font-mono text-[11px] text-[#5B6470]">OL1 Spindlegate • OL2 • OL8 • 1247 pros mapped • Touch of GOD coordinates</div>
                </div>
                <div className="hidden md:flex items-center gap-2 rounded-full bg-[#8FFF4A]/15 border border-[#8FFF4A]/20 px-3 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8FFF4A]">Live Map • OL1</span>
                </div>
              </div>

              <div className="mt-6 relative rounded-[20px] overflow-hidden bg-[#F0E9DB] border border-[#D4CBB8] aspect-[16/10] md:aspect-[16/9]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(143,255,74,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(0,229,192,0.12),transparent_50%),radial-gradient(circle_at_60%_40%,rgba(255,230,0,0.08),transparent_60%)]" />
                <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full opacity-60">
                  <path d="M100 120 Q 200 80 350 140 T 600 180 T 700 300 T 500 420 T 200 380 T 100 120" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="8 8" />
                  <g>
                    {[
                      {x:220,y:180,c:'#8FFF4A'},
                      {x:420,y:220,c:'#00E5C0'},
                      {x:520,y:300,c:'#FFE600'},
                      {x:300,y:320,c:'#FF8A00'},
                    ].map((p,i)=>(
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="20" fill={p.c} opacity="0.15" />
                        <circle cx={p.x} cy={p.y} r="8" fill={p.c} />
                        <circle cx={p.x} cy={p.y} r="3" fill="black" />
                      </g>
                    ))}
                  </g>
                </svg>
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                  {[
                    'OL1 Spindlegate • HQ',
                    'OL2 • 189 mechanics',
                    'OL8 • 124 builders',
                    'AYO’S TAILORS verified',
                  ].map(t=>(
                    <div key={t} className="glass rounded-full px-2.5 py-1">
                      <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#5B6470]">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  {k:'Total Pros', v:'1247', d:'OL1 OL2 OL8'},
                  {k:'Avg Response', v:'1.2h', d:'Real Oldham time'},
                  {k:'Verified', v:'100%', d:'Face + Work proof'},
                ].map(i=>(
                  <div key={i.k} className="rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-4">
                    <div className="font-poppins text-[18px] leading-none text-[#0A1931]">{i.v}</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#5B6470] mt-1">{i.k}</div>
                    <div className="font-mono text-[10px] text-[#5B6470] mt-1">{i.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] glass-strong p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5B6470]">Trust Ledger • Secured</span>
                  <span className="w-6 h-6 rounded-full bg-gradient-m flex items-center justify-center text-black text-[12px]">✓</span>
                </div>
                <div className="mt-5">
                  <div className="font-poppins text-[42px] leading-[0.9] text-[#0A1931]">4.9</div>
                  <div className="font-mono text-[11px] text-[#5B6470] mt-1">Trust Ledger • 12K projects • Touch of GOD</div>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    {k:'Escrow Secured', v:'100% protected', icon:'◐'},
                    {k:'Gas Safe', v:'76 plumbers verified', icon:'⚙'},
                    {k:'OBD2 Certified', v:'189 mechanics • J Martinez', icon:'◑'},
                    {k:'Face + Work', v:'No stock • Real hands', icon:'◎'},
                  ].map(t=>(
                    <div key={t.k} className="flex items-center gap-3 rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                      <div className="w-8 h-8 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] flex items-center justify-center text-[#5B6470] text-[14px]">{t.icon}</div>
                      <div className="flex-1">
                        <div className="font-poppins text-[12px] leading-none text-[#0A1931]">{t.k}</div>
                        <div className="font-mono text-[10px] text-[#5B6470] mt-1">{t.v}</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-[#8FFF4A]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[24px] overflow-hidden relative aspect-[4/3] glass">
                  <div className="absolute inset-0" style={{backgroundImage:`url(${imgPlumber})`, backgroundSize:'cover', backgroundPosition:'center'}} aria-label="Plumber Gas Safe Worcester Bosch boiler" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 glass rounded-[12px] px-3 py-2">
                    <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#5B6470]">Gas Safe • Worcester</div>
                    <div className="font-poppins text-[11px] text-[#0A1931] leading-[1.1] mt-0.5">Plumber • OL1</div>
                  </div>
                </div>
                <div className="rounded-[24px] overflow-hidden relative aspect-[4/3] glass">
                  <div className="absolute inset-0" style={{backgroundImage:`url(${imgMechanic})`, backgroundSize:'cover', backgroundPosition:'center'}} aria-label="Female mechanic J Martinez OBD2" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 glass rounded-[12px] px-3 py-2">
                    <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#5B6470]">OBD2 • Certified</div>
                    <div className="font-poppins text-[11px] text-[#0A1931] leading-[1.1] mt-0.5">J Martinez • Mechanic</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] bg-gradient-m p-[1px]">
                <div className="rounded-[19px] bg-[#F0E9DB] p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-poppins">M</div>
                  <div className="flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5B6470]">My Face Profile • VisaguideOS</div>
                    <div className="font-poppins text-[12px] text-[#0A1931] leading-[1.2]">From blueprint to face. Touch of GOD.</div>
                  </div>
                  <div className="font-mono text-[10px] text-black bg-white rounded-full px-2.5 py-1">OL1</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 md:mt-28 mb-8">
          <div className="rounded-[32px] overflow-hidden relative bg-white text-black p-6 md:p-10 lg:p-14">
            <div className="absolute top-0 right-0 w-[60%] h-[100%] opacity-[0.15] pointer-events-none" style={{background: 'var(--m-gradient)'}} />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#0A1931] text-white px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase">Contact Us — Oldham Is Waiting</span>
                </div>
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-black/40">Page 20 of 24 • Touch of GOD • Production</div>
              </div>

              <h2 className="font-poppins text-[36px] md:text-[56px] lg:text-[72px] leading-[0.85] tracking-[-0.06em] max-w-[900px]">
                Contact Us —<br/>
                <span className="text-gradient-m">Oldham Is Waiting</span><br/>
                hello@myfaceprofile.com
              </h2>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-end">
                <div className="flex flex-wrap gap-3">
                  <a href="#contact" className="inline-flex items-center gap-3 rounded-full bg-[#0A1931] text-white px-7 py-4 font-poppins text-[14px] hover:bg-[#0A1931]/90 transition">
                    <span>Email Now</span>
                    <span className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center">↗</span>
                  </a>
                  <div className="flex items-center gap-2">
                    <div className="rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] px-4 py-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-[6px] bg-[#0A1931] text-white flex items-center justify-center text-[10px]"></div>
                      <div className="leading-[1.1]">
                        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/40">Download</div>
                        <div className="font-poppins text-[12px] leading-none">iOS App</div>
                      </div>
                    </div>
                    <div className="rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] px-4 py-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-[6px] bg-[#0A1931] text-white flex items-center justify-center text-[10px]">▶</div>
                      <div className="leading-[1.1]">
                        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/40">Download</div>
                        <div className="font-poppins text-[12px] leading-none">Android</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    {k:'Pros', v:'1247'},
                    {k:'Projects', v:'12K'},
                    {k:'Trust', v:'4.9'},
                  ].map(s=>(
                    <div key={s.k} className="rounded-[16px] bg-[#0A1931] text-white p-4">
                      <div className="font-poppins text-[22px] leading-none">{s.v}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5B6470] mt-1">{s.k}</div>
                    </div>
                  ))}
                  <div className="col-span-3 rounded-[16px] bg-gradient-m p-4 flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-black">Touch of GOD • Oldham OL1 • All Trades</span>
                    <span className="font-poppins text-[12px] text-black">My Face Profile</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-m flex items-center justify-center text-black font-poppins">M</div>
                  <span className="font-poppins text-[13px]">My Face Profile • Oldham • OL1</span>
                  <span className="font-mono text-[10px] text-black/40">© 2026 • Touch of GOD</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-black/10 overflow-hidden" style={{backgroundImage:`url(${logoOldham})`, backgroundSize:'cover'}} />
                  <div className="w-6 h-6 rounded-full border border-black/10 overflow-hidden" style={{backgroundImage:`url(${logoMFace})`, backgroundSize:'cover'}} />
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-black/40">Page 20 of 24 • Contact Standalone</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] pointer-events-none">
            <div className="glass-strong rounded-full px-5 py-3 flex items-center gap-3 shadow-2xl">
              <div className="w-2 h-2 rounded-full bg-[#8FFF4A] animate-pulse" />
              <span className="font-mono text-[12px] text-[#0A1931]">{showToast}</span>
            </div>
          </div>
        )}

        {result && result.error && (
          <div className="fixed top-[80px] right-6 z-50 glass-strong rounded-[12px] px-4 py-2 max-w-[320px]">
            <div className="font-mono text-[11px] text-[#5B6470]">Error: {result.error}</div>
            <div className="font-mono text-[10px] text-[#5B6470] mt-1">Saved {result.saved}, Remaining {result.remaining}</div>
          </div>
        )}
      </main>
    </div>
  );
}
