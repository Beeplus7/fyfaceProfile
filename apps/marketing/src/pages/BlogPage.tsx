import logoLight from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoDark from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import tailorImg from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import dressFinal from "../assets/b4766d628a527e91-image_20261029_180641.webp";
import mechanicImg from "../assets/862320100e7b980d-image_20261029_173915.webp";
import buildersImg from "../assets/727cc9fbccc433e9-image_20261029_173918.webp";
import reviewImg from "../assets/278ca298819af13d-image_20261029_181559.webp";
import { useState } from "react";

const blogs = [
  {
    id: 1,
    kicker: "WEDDING TAILOR • OLDHAM OL1 • £15K REVENUE",
    title: "How Aisha Made 47 Wedding Dresses in Oldham — £15K Revenue, 4.9 Trust, Live 142 Viewers",
    desc: "47 dresses. 3 months. Each stitch live on My Face Profile. Her Work OS turned lace, silk and 4AM fittings into £15K and a calendar booked till June. Viewers don't watch — they commission.",
    seo: "wedding dress tailor Oldham blog",
    stats: ["47 Projects", "£15K Revenue", "142 Live"],
    img: tailorImg,
    img2: dressFinal,
    tag: "SEO: 2.4k /mo search"
  },
  {
    id: 2,
    kicker: "MECHANIC • J. MARTINEZ • 89 FIXES • 4.9 TRUST",
    title: "Female Mechanic Fixes Toyota Misfire for £195 — OBD2 Scanner, Quoto Bot, 1.2mi Nearby",
    desc: "J. Martinez diagnosed P0304 in 12 minutes, filmed the coil swap, uploaded Project with OBD2 data. Quoto bot priced it, client paid, escrow released. 1.2mi away became 1 lifetime customer.",
    seo: "mechanic Oldham blog",
    stats: ["89 Fixes", "£195 Avg", "4.9★"],
    img: mechanicImg,
    img2: mechanicImg,
    tag: "SEO: 8.1k /mo search"
  },
  {
    id: 3,
    kicker: "BUILDERS • OLDHAM • £8.4K • 14 DAYS • BEFORE/AFTER",
    title: "Oldham Builders: From 1990s Kitchen to 2024 Modern — Before/After £8,400, 14 Days",
    desc: "Oldham Builders laid 840 bricks on camera. Work OS timelapse → Project page → ranked #1 for 'kitchen extension Oldham'. 14 days work, 3 years of inbound leads. Build brick by brick, rank click by click.",
    seo: "builder Oldham blog",
    stats: ["£8.4K Job", "14 Days", "#1 Rank"],
    img: buildersImg,
    img2: buildersImg,
    tag: "SEO: 5.3k /mo search"
  }
];

const roles = [
  { title: "Senior Engineer", stack: "Next.js • NestJS • Work OS", type: "ENGINEERING", desc: "Ship the OS that ships real work. Realtime Live, Project SEO, Bot Army." },
  { title: "Product Designer", stack: "M Gradient • Glassmorphism • Touch of GOD", type: "DESIGN", desc: "Design where craft meets reverence. 24px radius, divine glow, drop slide-in." },
  { title: "Trust & Safety Lead", stack: "Escrow • Verified Review • Dispute", type: "TRUST", desc: "Protect the £. Every Project verified, every Review from purchase, every Pound in escrow." },
  { title: "Community Oldham Lead", stack: "OL1 • On-Ground • Live House", type: "COMMUNITY", desc: "Be in Oldham. In shops, in garages, in kitchens. Teach Pros to Show Work." },
  { title: "Bot Army Trainer", stack: "Milo • Cutty • Quoto • Helpy", type: "AI • BOTS", desc: "Train Milo to cut hair copy, Cutty to stitch dress copy, Quoto to quote fixes. Bot = craft x10." },
];

const faqs = [
  { q: "How to Show Work?", a: "Go Live hands-free. Mount phone, tap Live, work. Work OS auto-clips to Projects. Every stitch, every bolt = SEO. No editing. Real > Filter.", img: tailorImg },
  { q: "How to Go Live Hands-Free?", a: "Phone holder + My Face Profile Live. Voice 'Start Live'. Auto-switches to Project mode when you finish. Viewers gift MFC. 142 live viewers avg for top tailors.", img: dressFinal },
  { q: "How MFC Coins Work?", a: "MFC = My Face Coins. Internal token, not crypto. Fans buy packs, gift you Hammer 10, Scissors 25, Heart 50, Crown 100, Trophy 500. You cashout 70% via Stripe Connect.", img: reviewImg },
  { q: "Escrow How?", a: "Jobs 10% escrow, Shop 5%. Client pays → held → you show work → client approves → 70% to you instantly. Dispute? Trust & Safety watches Project video proof.", img: buildersImg },
  { q: "TrustScore How?", a: "Verified reviews ONLY from verified purchase. No fake 5★. J. Martinez has 89 verified jobs = 4.9 Trust. Video proof + receipt = Trust. God sees, OS records.", img: reviewImg },
];

export default function BlogPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div
      data-safe-area-inset-root
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)', background: 'var(--bg)' }}
      className="min-h-screen w-full text-zinc-100 overflow-x-clip selection:bg-[#8FFF4A]/30"
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        style={{ top: 'var(--safe-area-inset-top)' }}
        className="sticky z-50 w-full border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-2xl"
      >
        <div className="mx-auto max-w-[1280px] flex h-[64px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[12px] flex items-center justify-center font-poppins font-[800] text-black text-[18px]" style={{ background: 'var(--gradient-m)' }}>M</div>
            <span className="font-poppins font-bold text-[16px] tracking-tight">My Face Profile</span>
            <span className="hidden md:inline-flex ml-3 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] font-mono text-[10px] tracking-widest">NO.11 / 24 • FINAL BUNDLE</span>
          </div>

          <nav className="hidden lg:flex items-center gap-6 font-mono text-[11px] tracking-widest text-zinc-400">
            {["Home","How It Works","Work OS","UPRM","Projects","Pricing","Trust"].map(l => (
              <a key={l} href="#" className="hover:text-white transition">{l}</a>
            ))}
            <a href="#" className="text-white px-3 py-1.5 rounded-full" style={{ background: 'var(--gradient-m)', color: 'black' }}>Blog</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex h-8 w-8 rounded-full overflow-hidden border border-white/10">
              <img src={logoDark} alt="M logo" className="h-full w-full object-cover" />
            </div>
            <button onClick={()=>setMobileNav(!mobileNav)} className="lg:hidden h-9 w-9 rounded-full glass flex items-center justify-center">≡</button>
          </div>
        </div>
        {mobileNav && (
          <div className="lg:hidden px-5 pb-4 flex flex-wrap gap-3 font-mono text-[11px] text-zinc-400">
            {["Home","How It Works","Work OS","UPRM","Projects","Pricing","Trust","Blog"].map(l=>(
              <span key={l} className={l==="Blog" ? "text-black px-2.5 py-1 rounded-full" : ""} style={l==="Blog"?{background:'var(--gradient-m)'}:{}}>{l}</span>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-[1280px] px-5 md:px-8 pt-10 md:pt-20 pb-10">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.25] blur-[120px] pointer-events-none" style={{ background: 'var(--gradient-m)' }} />

        <div className="relative flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full glass text-[10px] font-mono tracking-[0.18em] text-zinc-300">
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: 'var(--gradient-m)' }} />
            NO.11 OF 24 • FINAL BUNDLE • BLOG + CAREERS + CONTACT + HELP + LEGAL • TOUCH OF GOD
          </div>

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-end">
            <div className="flex flex-col gap-6">
              <h1 className="font-poppins font-[800] leading-[0.92] tracking-[-0.04em] text-[40px] md:text-[64px] lg:text-[72px]">
                Stories of Real Work.<br />
                Careers That Build.<br />
                Help That Cares.
              </h1>
              <h2 className="font-poppins font-bold text-[22px] md:text-[28px] leading-tight gradient-text">
                Blog, Careers, Contact, Help, Legal — All in One OS.
              </h2>
              <p className="max-w-[560px] text-[16px] md:text-[18px] leading-relaxed text-zinc-400 font-medium">
                From Aisha's 47 wedding dresses to J. Martinez's 89 engine fixes — every story is a Project, every Project is SEO, every hire is craft. <span className="text-zinc-200">30K Project pages + 100 blog posts = free traffic forever.</span>
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href="#blog" className="h-[48px] px-7 rounded-full font-poppins font-bold text-[14px] tracking-wide text-black flex items-center justify-center transition hover:scale-[1.02]" style={{ background: 'var(--gradient-m)' }}>
                  Explore Stories →
                </a>
                <span className="font-mono text-[11px] text-zinc-500">SCROLL FOR OS ↓</span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[24px] overflow-hidden glass p-2 divine-glow">
                <div className="rounded-[18px] overflow-hidden bg-[#0a0a0a] relative">
                  <img src={tailorImg} alt="Tailor sewing" className="h-[360px] w-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="flex items-center gap-2">
                      <img src={logoLight} alt="logo" className="h-6 w-6 rounded-full object-cover border border-white/20" />
                      <span className="font-mono text-[10px] tracking-widest text-white/70">LIVE NOW • AISHA • 142 VIEWERS • £15K REVENUE</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur font-mono text-[10px] text-white border border-white/10">REC • 47 DRESSES</div>
                </div>
              </div>
              {/* floating stats */}
              <div className="absolute -left-4 -bottom-6 glass rounded-[16px] p-4 flex gap-4">
                <div><div className="font-poppins font-bold text-[20px]">1,247</div><div className="font-mono text-[10px] text-zinc-500">PROS LIVE</div></div>
                <div className="w-px bg-white/10" />
                <div><div className="font-poppins font-bold text-[20px]">12K</div><div className="font-mono text-[10px] text-zinc-500">PROJECTS</div></div>
                <div className="w-px bg-white/10" />
                <div><div className="font-poppins font-bold text-[20px] gradient-text">4.9</div><div className="font-mono text-[10px] text-zinc-500">TRUST</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section id="blog" className="mx-auto max-w-[1280px] px-5 md:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 mb-3">SECTION 1 — BLOG — STORIES THAT RANK</div>
            <h2 className="font-poppins font-[800] text-[36px] md:text-[52px] leading-[0.95] tracking-[-0.03em]">Stories That Rank.<br /><span className="gradient-text">Projects That Convert.</span></h2>
          </div>
          <div className="max-w-[380px] text-[14px] text-zinc-400 leading-relaxed">
            30K Project pages + 100 blog posts = free traffic. Every real work story is SEO: wedding dress tailor Oldham, mechanic Oldham, builder Oldham — Google loves real.
            <div className="mt-3 inline-flex px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-mono text-[10px]">BLOG = TRUST + SEO + BOOKINGS</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <article key={b.id} className="group rounded-[24px] glass overflow-hidden divine-glow hover:translate-y-[-4px] transition-all duration-500">
              <div className="relative h-[280px] overflow-hidden">
                <img src={b.img} alt={b.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 font-mono text-[9px] tracking-widest text-white">{b.kicker}</span>
                  <span className="px-2 py-1 rounded-full text-black font-mono text-[9px] font-bold" style={{ background: 'var(--gradient-m)' }}>{b.tag}</span>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {b.stats.map(s => (
                    <span key={s} className="px-2 py-1 rounded-full bg-white/90 text-black font-mono text-[9px] font-medium">{s}</span>
                  ))}
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="font-mono text-[10px] tracking-widest text-zinc-500">{b.seo.toUpperCase()}</div>
                <h3 className="font-poppins font-bold text-[18px] leading-[1.2]">{b.title}</h3>
                <p className="text-[13px] leading-relaxed text-zinc-400">{b.desc}</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-[32px] w-[32px] rounded-full overflow-hidden"><img src={b.img2} alt="" className="h-full w-full object-cover" /></div>
                  <div className="flex-1">
                    <div className="font-mono text-[10px] text-zinc-500">PROJECT PAGE • LIVE PROOF</div>
                    <div className="font-medium text-[12px] text-zinc-300">Read More → SEO + Trust + Booking</div>
                  </div>
                  <button className="h-8 px-3 rounded-full bg-white text-black font-poppins font-bold text-[11px]">Read More</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] glass p-[1px]">
          <div className="rounded-[23px] bg-[#0e0e0e] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-[12px] flex items-center justify-center font-poppins font-[800] text-black" style={{ background: 'var(--gradient-m)' }}>SEO</div>
              <div>
                <div className="font-poppins font-bold">100 Blog Posts → 30K Project Pages = Free Traffic Forever</div>
                <div className="font-mono text-[11px] text-zinc-500">Each Project = /projects/{'{'}trade{'-'}city{'-'}id{'}'}  •  Each Blog = /blog/{'{'}story{'}'}  •  Google loves real work</div>
              </div>
            </div>
            <div className="font-mono text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-zinc-400">TOUCH OF GOD IN SEO DETAILS</div>
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section id="careers" className="relative py-16 md:py-24 border-t border-white/[0.06] bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
            <div className="flex flex-col gap-8">
              <div className="font-mono text-[11px] tracking-[0.2em] text-zinc-500">SECTION 2 — CAREERS — BUILD THE OS FOR REAL WORK</div>
              <h2 className="font-poppins font-[800] text-[36px] md:text-[52px] leading-[0.9] tracking-[-0.03em]">Join Us —<br />We Hire<br /><span className="gradient-text">Craftsmen,<br />Not Hustlers.</span></h2>
              <div className="rounded-[24px] overflow-hidden glass p-2">
                <img src={buildersImg} alt="Builders laying bricks" className="h-[320px] w-full object-cover rounded-[18px]" />
                <div className="p-4">
                  <div className="font-mono text-[10px] tracking-widest text-zinc-500">BUILDING OS BRICK BY BRICK • OLDHAM OL1</div>
                  <div className="font-poppins font-bold text-[16px] mt-1">Every brick laid on camera = Trust. Every line of code = same. Real Work &gt; Filter.</div>
                </div>
              </div>
              <div className="rounded-[16px] p-4 border border-white/10 bg-white/[0.02]">
                <div className="font-poppins font-bold text-[14px]">Values</div>
                <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px] text-zinc-400">
                  <div>✓ Real Work &gt; Filter</div><div>✓ Touch of GOD in details</div>
                  <div>✓ Craft &gt; Hustle</div><div>✓ Oldham First, World Next</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {roles.map((r) => (
                <div key={r.title} className="group rounded-[20px] glass-dark p-6 hover:bg-white/[0.04] transition">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest text-black" style={{ background: 'var(--gradient-m)' }}>{r.type}</span>
                        <span className="font-mono text-[10px] text-zinc-500">{r.stack}</span>
                      </div>
                      <h3 className="font-poppins font-bold text-[20px] mt-2">{r.title}</h3>
                      <p className="text-[13px] text-zinc-400 mt-2 max-w-[420px] leading-relaxed">{r.desc}</p>
                    </div>
                    <button className="h-9 px-4 rounded-full bg-white text-black font-poppins font-bold text-[12px] opacity-0 group-hover:opacity-100 transition">Apply →</button>
                  </div>
                </div>
              ))}
              <div className="mt-4 rounded-[20px] p-[1px]" style={{ background: 'var(--gradient-m)' }}>
                <div className="rounded-[19px] bg-[#111] p-6 flex items-center justify-between">
                  <div className="font-mono text-[11px] text-zinc-400">hello@myfaceprofile.com • Send portfolio of real work, not deck • Touch of GOD required</div>
                  <div className="font-poppins font-bold text-[12px] text-black px-3 py-1.5 rounded-full" style={{ background: 'var(--gradient-m)' }}>We hire slow</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT + HELP */}
      <section id="contact" className="mx-auto max-w-[1280px] px-5 md:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10">
          {/* Contact */}
          <div className="flex flex-col gap-6">
            <div className="font-mono text-[11px] tracking-[0.2em] text-zinc-500">SECTION 3 — CONTACT + HELP CENTER</div>
            <h2 className="font-poppins font-[800] text-[36px] leading-[0.9]">Contact +<br />Help That<br /><span className="gradient-text">Actually Cares.</span></h2>

            <div className="rounded-[24px] glass p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden"><img src={logoDark} alt="" className="h-full w-full object-cover" /></div>
                <div><div className="font-poppins font-bold text-[14px]">My Face Profile HQ</div><div className="font-mono text-[10px] text-zinc-500">Oldham OL1 • Real Work OS</div></div>
              </div>
              <div className="grid gap-3 font-mono text-[12px]">
                <div className="flex justify-between p-3 rounded-[12px] bg-white/[0.04]"><span className="text-zinc-500">EMAIL</span><span className="text-white">hello@myfaceprofile.com</span></div>
                <div className="flex justify-between p-3 rounded-[12px] bg-white/[0.04]"><span className="text-zinc-500">LOCATION</span><span className="text-white">Oldham OL1, Greater Manchester</span></div>
                <div className="flex justify-between p-3 rounded-[12px] bg-white/[0.04]"><span className="text-zinc-500">DISCORD</span><span className="text-white">discord.gg/myfaceprofile</span></div>
                <div className="flex justify-between p-3 rounded-[12px] bg-white/[0.04]"><span className="text-zinc-500">X / TWITTER</span><span className="text-white">@myfaceprofile</span></div>
              </div>
              <div className="rounded-[12px] p-3 border border-white/10 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" />
                <span className="font-mono text-[11px] text-zinc-400">Bot Army Helpy Support 24/7 • Avg reply 23s • Human escalates in 4min • Touch of GOD in every reply</span>
              </div>
            </div>

            <div className="rounded-[20px] overflow-hidden glass p-2">
              <img src={reviewImg} alt="Verified review" className="h-[200px] w-full object-cover rounded-[14px]" />
              <div className="p-3 font-mono text-[10px] text-zinc-500">TRUST PREVIEW • Verified Review custom wallet • Only from verified purchase</div>
            </div>
          </div>

          {/* Help */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins font-bold text-[22px]">Help Center — 5 Questions, All Real</h3>
              <span className="px-2.5 py-1 rounded-full bg-[#8FFF4A]/10 border border-[#8FFF4A]/20 font-mono text-[10px] text-[#8FFF4A]">HELPY BOT ONLINE</span>
            </div>

            {faqs.map((f, i) => (
              <div key={f.q} className={`rounded-[20px] border transition ${activeFaq===i ? 'bg-white/[0.04] border-white/15' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                <button onClick={()=>setActiveFaq(activeFaq===i?null:i)} className="w-full flex items-center justify-between p-5 text-left">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-[12px] overflow-hidden shrink-0"><img src={f.img} alt="" className="h-full w-full object-cover" /></div>
                    <div>
                      <div className="font-poppins font-bold text-[15px]">{f.q}</div>
                      <div className="font-mono text-[10px] text-zinc-500 mt-1">BOT ANSWER • VERIFIED • 4.9 TRUST</div>
                    </div>
                  </div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center border transition ${activeFaq===i ? 'bg-white text-black' : 'border-white/10 text-zinc-500'}`}>{activeFaq===i ? '−' : '+'}</span>
                </button>
                {activeFaq===i && (
                  <div className="px-5 pb-5 -mt-1">
                    <p className="ml-[64px] text-[13px] leading-relaxed text-zinc-400">{f.a}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="mt-2 rounded-[16px] p-4 flex items-center gap-3 border border-dashed border-white/15">
              <div className="h-8 w-8 rounded-full flex items-center justify-center font-poppins font-bold text-black text-[12px]" style={{ background: 'var(--gradient-m)' }}>H</div>
              <div className="font-mono text-[11px] text-zinc-400"><span className="text-white">Helpy says:</span> “Show Work, Go Live, Get Gifted, Cashout 70% — I watch your Projects, I answer in 23s, human if you need GOD-level help.”</div>
            </div>
          </div>
        </div>
      </section>

      {/* LEGAL + ECONOMY */}
      <section className="py-16 md:py-24 bg-[#0a0a0a] border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 mb-8">SECTION 4 — LEGAL + ECONOMY — HOLY MONEY, CLEAN RULES</div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Legal */}
            <div className="rounded-[24px] glass-dark p-7 flex flex-col gap-6">
              <div>
                <div className="font-mono text-[10px] tracking-widest text-zinc-500">LEGAL • PRIVACY • TERMS</div>
                <h3 className="font-poppins font-bold text-[20px] mt-2">Clean Rules.<br />Touch of GOD Legal.</h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { t: "Privacy", d: "Your Projects are public, your DMs are private. We never sell. Work OS is GDPR holy." },
                  { t: "Terms", d: "Show real work only. No filter, no fake. 4.9 Trust is earned, not bought. Ban for fake." },
                  { t: "Coins — MFC", d: "MFC not crypto. Internal token, no resale, gift only, cashout 70%. No speculation. Gift = love." },
                ].map(item=>(
                  <div key={item.t} className="p-3 rounded-[12px] bg-white/[0.03] border border-white/[0.06]">
                    <div className="font-poppins font-bold text-[13px]">{item.t}</div>
                    <div className="font-mono text-[11px] text-zinc-400 mt-1 leading-relaxed">{item.d}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <a href="#" className="flex-1 h-9 rounded-full bg-white text-black font-mono text-[11px] font-bold flex items-center justify-center">Privacy →</a>
                <a href="#" className="flex-1 h-9 rounded-full border border-white/10 font-mono text-[11px] flex items-center justify-center">Terms →</a>
              </div>
            </div>

            {/* Economy */}
            <div className="rounded-[24px] p-[1px]" style={{ background: 'var(--gradient-m)' }}>
              <div className="rounded-[23px] bg-[#111] p-7 flex flex-col gap-6 h-full">
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-zinc-500">ECONOMY • MFC COINS • STRIPE CONNECT</div>
                  <h3 className="font-poppins font-bold text-[20px] mt-2">Holy Money Flow.<br /><span className="gradient-text">Buy → Gift → Cashout 70%.</span></h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "🔨", name: "Hammer", price: "10 MFC", use: "Respect" },
                    { icon: "✂️", name: "Scissors", price: "25 MFC", use: "Craft" },
                    { icon: "❤️", name: "Heart", price: "50 MFC", use: "Love" },
                    { icon: "👑", name: "Crown", price: "100 MFC", use: "King" },
                    { icon: "🏆", name: "Trophy", price: "500 MFC", use: "GOAT" },
                  ].map(g=>(
                    <div key={g.name} className="rounded-[12px] bg-white/[0.04] border border-white/10 p-3 flex items-center gap-2">
                      <span className="text-[18px]">{g.icon}</span>
                      <div><div className="font-poppins font-bold text-[11px]">{g.name} • {g.price}</div><div className="font-mono text-[9px] text-zinc-500">{g.use}</div></div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[12px] bg-[#050505] border border-white/10 p-4">
                  <div className="font-mono text-[10px] text-zinc-500 tracking-widest">FLOW</div>
                  <div className="mt-2 flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-1 rounded-full bg-white text-black font-bold">Buy £0.99/100</span>
                    <span>→</span>
                    <span className="px-2 py-1 rounded-full border border-white/15">Gift</span>
                    <span>→</span>
                    <span className="px-2 py-1 rounded-full" style={{ background: 'var(--gradient-m)', color:'black' }}>Cashout 70%</span>
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500 mt-2">Platform 30% via Stripe Connect • No crypto, no resale, gift only • Touch of GOD economics</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-16 rounded-[10px] overflow-hidden"><img src={mechanicImg} alt="Gift rain preview" className="h-full w-full object-cover" /></div>
                  <div className="font-mono text-[10px] text-zinc-500">Gift rain Live: J. Martinez got 12 Hammers during Toyota fix = £8.40 instant</div>
                </div>
              </div>
            </div>

            {/* Escrow */}
            <div className="rounded-[24px] glass-dark p-7 flex flex-col gap-6">
              <div>
                <div className="font-mono text-[10px] tracking-widest text-zinc-500">ESCROW + TRUST • VERIFIED ONLY</div>
                <h3 className="font-poppins font-bold text-[20px] mt-2">Verified Reviews Only<br />From Verified Purchase.</h3>
              </div>

              <div className="rounded-[16px] overflow-hidden border border-white/10">
                <img src={reviewImg} alt="Verified review custom wallet" className="h-[160px] w-full object-cover" />
                <div className="p-4 bg-[#0e0e0e]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#8FFF4A] text-black font-mono text-[9px] font-bold">VERIFIED</span>
                    <span className="font-mono text-[10px] text-zinc-500">Custom wallet • £45 • Verified purchase</span>
                  </div>
                  <div className="font-poppins font-bold text-[13px] mt-2">“Stitched exactly as Live showed — 4.9 is real.”</div>
                  <div className="font-mono text-[10px] text-zinc-500 mt-1">TrustScore 4.9 • 47 projects • Live proof attached</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-[12px] bg-white/[0.03] border border-white/10">
                  <div className="font-poppins font-bold text-[14px]">Jobs 10%</div><div className="font-mono text-[10px] text-zinc-500">Escrow held till Project approved</div>
                </div>
                <div className="p-3 rounded-[12px] bg-white/[0.03] border border-white/10">
                  <div className="font-poppins font-bold text-[14px]">Shop 5%</div><div className="font-mono text-[10px] text-zinc-500">Custom order protection</div>
                </div>
              </div>
              <div className="font-mono text-[10px] text-zinc-500">No fake reviews. God sees, OS records, Trust & Safety watches video proof.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA FOOTER */}
      <footer className="relative overflow-hidden border-t border-white/[0.06] py-16 md:py-24">
        <div className="absolute inset-0 opacity-[0.12]" style={{ background: 'var(--gradient-m)' }} />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[120px] opacity-30 pointer-events-none" style={{ background: 'var(--gradient-m)' }} />

        <div className="relative mx-auto max-w-[1280px] px-5 md:px-8 flex flex-col items-center text-center gap-8">
          <div className="inline-flex px-3 py-1 rounded-full glass font-mono text-[10px] tracking-widest">NO.11 OF 24 — FINAL BUNDLE — TOUCH OF GOD</div>

          <h2 className="font-poppins font-[800] text-[36px] md:text-[64px] leading-[0.9] tracking-[-0.04em] max-w-[900px]">
            This Is 11 of 24 —<br />
            <span className="gradient-text">Full OS Marketing Ready — Start Showing Free</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-3 font-mono text-[11px]">
            {["11 Pages • Built","6 Trades • Live","1,247 Pros • Verified","12K Projects • SEO","4.9 Trust • God-Level","Touch of GOD • Always"].map(s=>(
              <span key={s} className="px-3 py-1.5 rounded-full glass border border-white/10">{s}</span>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <button className="h-[52px] px-8 rounded-full font-poppins font-bold text-[15px] text-black divine-glow hover:scale-[1.02] transition" style={{ background: 'var(--gradient-m)' }}>
              Start Showing Free — Go Live Now →
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[12px] overflow-hidden border border-white/10"><img src={logoLight} alt="logo" className="h-full w-full object-cover" /></div>
              <div className="text-left">
                <div className="font-poppins font-bold text-[12px]">iOS / Android Coming Soon</div>
                <div className="font-mono text-[10px] text-zinc-500">apps/marketing/app/blog/page.tsx • careers • contact • help • legal/* • Ready</div>
              </div>
            </div>
          </div>

          <div className="pt-10 w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/[0.06] mt-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-[10px] flex items-center justify-center font-poppins font-[800] text-black text-[14px]" style={{ background: 'var(--gradient-m)' }}>M</div>
              <span className="font-poppins font-bold text-[14px]">My Face Profile • Oldham OL1 • Real Work OS</span>
            </div>
            <div className="font-mono text-[10px] tracking-widest text-zinc-500">© 2026 MY FACE PROFILE • BLOG + CAREERS + CONTACT + HELP + LEGAL HUB • NO.11 OF 24 • TOUCH OF GOD • Poppins Bold + Inter + JetBrains Mono • Black #050505 • M #8FFF4A→#00E5C0→#FFE600→#FF8A00</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
