import { useState } from "react";
import logoM1 from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoM2 from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import imgTailor from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import imgFounder from "../assets/c580b278bd1bf106-image_20261029_175419.webp";
import imgDress from "../assets/b4766d628a527e91-image_20261029_180641.webp";
import imgElectric from "../assets/8add8b271904e6b3-image_20261029_190128.webp";
import imgPlumber from "../assets/a0e4b743decf2716-image_20261029_190129.webp";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how" },
  { label: "Work OS", href: "#os" },
  { label: "UPRM", href: "#uprm" },
  { label: "Projects", href: "#projects" },
  { label: "Pricing", href: "#pricing" },
  { label: "Trust", href: "#trust" },
  { label: "About", href: "#about", active: true },
];

export default function AboutPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      data-safe-area-inset-root
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }}
      className="min-h-screen w-full bg-[#FFFDF7] text-[#0A1931] overflow-x-clip selection:bg-[#FFC300]/35"
    >
      <header
        data-safe-area-sticky-top
        style={{ top: "var(--safe-area-inset-top)" }}
        className="sticky z-50 w-full border-b border-[#D4CBB8] bg-[#FFFDF7]/90 backdrop-blur-[20px]"
      >
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-[11px] bg-gradient-m p-[1px] drop-card">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-black">
                <img src={logoM1} alt="My Face Profile M" className="h-6 w-6 object-contain" />
              </div>
            </div>
            <span className="font-poppins text-[15px] font-bold tracking-[-0.02em]">My Face Profile</span>
            <span className="ml-2 hidden items-center rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-[#5B6470] md:flex">
              NO.10 OF 24
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`rounded-full px-3.5 py-2 font-mono text-[11px] tracking-[0.08em] transition ${
                  l.active ? "bg-white text-black font-medium" : "text-[#5B6470] hover:bg-[#F0E9DB] hover:text-[#0A1931]"
                }`}
              >
                {l.label.toUpperCase()}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="#cta" className="hidden rounded-full bg-gradient-m px-5 py-2.5 font-poppins text-[13px] font-bold text-black transition hover:brightness-110 lg:inline-flex">
              Join OS — Free
            </a>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#D4CBB8] bg-[#F0E9DB] lg:hidden"
              aria-label="Toggle menu"
            >
              <div className="space-y-1">
                <div className="h-0.5 w-4 bg-white/80" />
                <div className="h-0.5 w-4 bg-white/80" />
                <div className="h-0.5 w-4 bg-white/40" />
              </div>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#D4CBB8] bg-black/95 px-6 py-6 lg:hidden">
            <div className="grid gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-[12px] px-4 py-3 font-mono text-[12px] tracking-[0.08em] ${l.active ? "bg-white text-black" : "bg-[#F0E9DB] text-[#5B6470]"}`}
                >
                  {l.label.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-10 lg:px-8 lg:pt-16">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-[720px] w-[980px] -translate-x-1/2 rounded-full divine-glow opacity-80" />
          <div className="absolute right-[-12%] top-[18%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,230,0,0.16),transparent_70%)] blur-[18px]" />
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3.5 py-1.5 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#8FFF4A]" />
              <span className="font-mono text-[11px] tracking-[0.14em] text-[#5B6470]">NO.10 OF 24 • ABOUT • MISSION • TOUCH OF GOD</span>
            </div>

            <h1 className="font-poppins mt-8 max-w-[20ch] text-[40px] font-extrabold leading-[0.92] tracking-[-0.04em] sm:text-[54px] lg:text-[68px]">
              We Believe Your
              <br />
              Work Is Your Face.
              <br />
              <span className="text-gradient block pt-2 text-[32px] leading-[0.98] sm:text-[44px] lg:text-[52px]">
                Not Your CV.
                <br />
                Not Your Filter.
                <br />
                Your Craft.
              </span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[17px] leading-[1.6] text-[var(--muted)]">
              From VisaguideOS to My Face Profile — building the OS for real work, where tailors, mechanics, builders, barbers, electricians, plumbers{" "}
              <span className="text-[#0A1931]">SHOW their work, CONNECT with need, and GROW with trust.</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#cta" className="inline-flex items-center gap-2 rounded-full bg-gradient-m px-7 py-3.5 font-poppins text-[14px] font-bold tracking-[-0.01em] text-black shadow-[0_8px_32px_rgba(143,255,74,0.28)] transition hover:brightness-[1.08] active:scale-[0.98]">
                Start Showing Free — Join OS
                <span className="grid h-5 w-5 place-items-center rounded-full bg-black text-white">→</span>
              </a>
              <a href="#story" className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-6 py-3.5 font-mono text-[12px] tracking-[0.08em] text-[#5B6470] backdrop-blur transition hover:bg-[#F0E9DB]">
                <span className="h-2 w-2 rounded-full bg-white" />
                WATCH FOUNDER STORY
              </a>
            </div>

            <div className="mt-10 grid max-w-[560px] grid-cols-3 gap-4 border-t border-[#D4CBB8] pt-6">
              {[
                { k: "1,247", v: "Pros in Oldham" },
                { k: "12K", v: "Projects Live" },
                { k: "4.9", v: "Trust Score" },
              ].map((s) => (
                <div key={s.k}>
                  <div className="font-poppins text-[28px] font-extrabold leading-none tracking-[-0.03em]">{s.k}</div>
                  <div className="mt-1 font-mono text-[11px] tracking-[0.08em] text-[#5B6470]">{s.v.toUpperCase()}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3 rounded-[14px] border border-[#D4CBB8] bg-[#F0E9DB] px-4 py-3">
              <div className="h-7 w-7 rounded-[8px] overflow-hidden bg-black border border-[#D4CBB8] grid place-items-center">
                <div className="h-full w-full" style={{ backgroundImage: `url(${logoM2})`, backgroundSize: "cover", backgroundPosition: "center" }} aria-label="M mark" />
              </div>
              <p className="font-mono text-[11px] leading-[1.4] tracking-[0.02em] text-[#5B6470]">
                <span className="text-[#0A1931]">TOUCH OF GOD:</span> Craft as worship. Every stitch, wire, pipe, brick has God in it. From VisaguideOS → My Face Profile OS.
              </p>
            </div>
          </div>

          <div className="relative flex-1 lg:max-w-[560px]">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-[#8FFF4A]/20 via-[#00E5C0]/16 to-[#FFE600]/14 blur-[28px]" />
            <div className="relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-black drop-card">
              <img src={imgFounder} alt="Founder live streaming workshop - touch of GOD moment" className="aspect-[4/5] w-full object-cover lg:aspect-[4/5]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="glass rounded-[16px] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-m text-[11px] font-bold text-black">LIVE</div>
                      <div>
                        <div className="font-mono text-[10px] tracking-[0.12em] text-[#5B6470]">FOUNDER WORKSHOP • OLDHAM</div>
                        <div className="font-poppins text-[13px] font-bold leading-tight">Showing work, not talking about work</div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-mono text-[10px] text-black">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> 247 watching
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute left-4 top-4 flex gap-2">
                <span className="rounded-full bg-black/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-[#5B6470] backdrop-blur border border-[#D4CBB8]">10mi NEARBY • VERIFIED</span>
              </div>
              <div className="absolute right-4 top-4 rounded-full bg-gradient-m px-3 py-1.5 font-poppins text-[11px] font-bold text-black">Touch of GOD</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="glass rounded-[16px] p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-[10px] bg-cover bg-center" style={{ backgroundImage: `url(${imgTailor})` }} aria-label="Craft detail" />
                <div>
                  <div className="font-poppins text-[12px] font-bold leading-none">Holy Craft</div>
                  <div className="font-mono text-[10px] text-[#5B6470] mt-1">STITCH • 173924</div>
                </div>
              </div>
              <div className="glass rounded-[16px] p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-[10px] bg-cover bg-center" style={{ backgroundImage: `url(${imgElectric})` }} aria-label="Real work" />
                <div>
                  <div className="font-poppins text-[12px] font-bold leading-none">Real Work OS</div>
                  <div className="font-mono text-[10px] text-[#5B6470] mt-1">VERIFIED • 190128</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 — STORY */}
      <section id="story" className="relative mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[11px] tracking-[0.18em] text-[#8FFF4A]">SECTION 01 — STORY</div>
            <h2 className="font-poppins mt-3 max-w-[16ch] text-[32px] font-bold leading-[0.95] tracking-[-0.03em] sm:text-[44px]">
              From VisaguideOS to
              <br />
              My Face Profile OS
            </h2>
          </div>
          <p className="max-w-[44ch] text-[15px] leading-[1.6] text-[var(--muted)]">
            We didn&apos;t start as a marketplace. We started as an OS for guides. Then we learned: images speak louder than words. Work is content. Trust is commerce.
          </p>
        </div>

        <div className="relative mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative glass-strong rounded-[24px] p-6 sm:p-8 drop-card overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-[#8FFF4A]/60 via-white/10 to-transparent hidden sm:block ml-12" />
            <div className="grid gap-8">
              {[
                { year: "2023", title: "VisaguideOS — Built for guides", desc: "UPRM PID 1, VCG token, Work Graph idea. We wanted guides to own their work graph, not rent audience from platforms.", tag: "KERNEL v0.1" },
                { year: "2024", title: "Roadagel + Visaguideos — Images > Words", desc: "Infographic banners, card dropping design. Learned that a tailor sewing lace tells more than 1000 CV words.", tag: "DESIGN SYSTEM" },
                { year: "2025", title: "Oldham Test — 1,247 pros, 12K Projects, 4.9 Trust", desc: "Discovered loop: Work is Content, Content is Discovery, Discovery is Trust, Trust is Commerce. No hustle, just craft.", tag: "OL1 • OL2 • OL8" },
                { year: "2026", title: "My Face Profile OS — Revolutionary", desc: "TikTok live + LinkedIn timeline + YouTube portfolio + e-commerce shop. Kernel + UPRM + Apps. The OS for real work.", tag: "OS v1.0 • Touch of GOD" },
              ].map((item) => (
                <div key={item.year} className="relative flex gap-4 sm:gap-6">
                  <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4CBB8] bg-black font-poppins text-[12px] font-bold">
                    {item.year.slice(2)}
                  </div>
                  <div className="flex-1 rounded-[16px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] tracking-[0.14em] text-[#00E5C0]">{item.year}</span>
                          <span className="rounded-full bg-[#F0E9DB] px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] text-[#5B6470]">{item.tag}</span>
                        </div>
                        <h4 className="font-poppins mt-2 text-[16px] font-bold leading-[1.15] tracking-[-0.01em]">{item.title}</h4>
                        <p className="mt-2 text-[13px] leading-[1.5] text-[#5B6470]">{item.desc}</p>
                      </div>
                      <div className="hidden h-12 w-12 shrink-0 rounded-[10px] bg-gradient-m sm:grid place-items-center font-poppins text-[11px] font-bold text-black">
                        M
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-black drop-card">
              <img src={imgTailor} alt="Tailor sewing lace close-up craft evolution" className="h-[380px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="glass rounded-[14px] px-4 py-3">
                  <div className="font-mono text-[10px] tracking-[0.12em] text-[#5B6470]">CRAFT EVOLUTION</div>
                  <div className="font-poppins mt-1 text-[14px] font-bold leading-[1.2]">Every stitch is a ledger entry. Work Graph, not User Graph.</div>
                </div>
              </div>
              <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 font-mono text-[10px] text-black">VISAGUIDE → M FACE</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-[20px] p-5">
                <div className="font-poppins text-[22px] font-extrabold leading-none tracking-[-0.02em] text-gradient">Work = Content</div>
                <p className="mt-2 font-mono text-[11px] leading-[1.4] text-[#5B6470]">CONTENT IS DISCOVERY, DISCOVERY IS TRUST</p>
              </div>
              <div className="rounded-[20px] bg-gradient-m p-5 text-black">
                <div className="font-poppins text-[22px] font-extrabold leading-none tracking-[-0.02em]">Trust = Commerce</div>
                <p className="mt-2 font-mono text-[11px] leading-[1.4] text-black/60">OLDHAM PROOF • 4.9 SCORE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — MISSION */}
      <section className="relative mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-3">
          <div className="font-mono text-[11px] tracking-[0.18em] text-[#FFE600]">SECTION 02 — MISSION</div>
          <h2 className="font-poppins text-[40px] font-extrabold leading-[0.9] tracking-[-0.04em] sm:text-[56px]">
            SHOW. <span className="text-[#5B6470]">CONNECT.</span> GROW.
          </h2>
          <p className="max-w-[56ch] text-[15px] leading-[1.6] text-[#5B6470]">Three verbs. One OS. Built for the person who fixes boilers at 7am, sews lace at midnight, wires a consumer unit in the rain.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[var(--bg-card)] drop-card">
            <div className="relative h-[320px] overflow-hidden">
              <div className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-[1.04]" style={{ backgroundImage: `url(${imgTailor})` }} role="img" aria-label="Tailor sewing - show your work" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur border border-[#D4CBB8]">
                <span className="h-2 w-2 rounded-full bg-[#8FFF4A]" />
                <span className="font-mono text-[10px] tracking-[0.12em] text-[#5B6470]">SHOW • LIVE WORKSHOP</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-poppins text-[20px] font-bold tracking-[-0.02em]">SHOW Your Work</h3>
              <p className="font-poppins mt-1 text-[13px] font-bold text-[#8FFF4A]">“Show your work. Not your CV.”</p>
              <p className="mt-3 text-[13px] leading-[1.6] text-[#5B6470]">Every pro gets timeline + shop + live workshop + project portfolio. Your lace, your wiring, your brickwork — is your profile.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Timeline", "Shop", "Live", "Portfolio"].map((t) => (
                  <span key={t} className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-[#5B6470]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[var(--bg-card)] drop-card">
            <div className="relative h-[320px] overflow-hidden bg-[#F0E9DB]">
              <div className="grid h-full grid-cols-2 gap-[1px] bg-[#F0E9DB]">
                <div className="relative">
                  <img src={imgElectric} alt="Electrician installing consumer unit - connect" className="h-full w-full object-cover" />
                  <div className="absolute bottom-2 left-2 rounded-full bg-white px-2 py-1 font-mono text-[9px] text-black">VERIFIED • NICEIC</div>
                </div>
                <div className="relative">
                  <img src={imgPlumber} alt="Plumber fixing Worcester Bosch boiler - connect" className="h-full w-full object-cover" />
                  <div className="absolute bottom-2 left-2 rounded-full bg-[#FFE600] px-2 py-1 font-mono text-[9px] text-black">GAS SAFE • 10mi</div>
                </div>
              </div>
              <div className="absolute left-4 top-4 rounded-full bg-gradient-m px-3 py-1.5 font-poppins text-[11px] font-bold text-black">Work Graph, not User Graph</div>
            </div>
            <div className="p-6">
              <h3 className="font-poppins text-[20px] font-bold tracking-[-0.02em]">CONNECT With Need</h3>
              <p className="font-poppins mt-1 text-[13px] font-bold text-[#00E5C0]">“Connect with customers who need real work, not likes”</p>
              <p className="mt-3 text-[13px] leading-[1.6] text-[#5B6470]">10mi Nearby, Verified skills, Trust Ledger. Customers find craft, not content farming. Oldham first.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["10mi Nearby", "Verified", "Work Graph"].map((t) => (
                  <span key={t} className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-[#5B6470]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[var(--bg-card)] drop-card">
            <div className="relative h-[320px] overflow-hidden">
              <img src={imgDress} alt="Final wedding dress reveal - grow with trust" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur border border-[#D4CBB8]">
                <span className="h-2 w-2 rounded-full bg-[#FFE600]" />
                <span className="font-mono text-[10px] tracking-[0.12em] text-[#5B6470]">GROW • FINAL RESULT</span>
              </div>
              <div className="absolute bottom-3 right-3 rounded-[12px] bg-white px-3 py-2 text-black">
                <div className="font-mono text-[9px] tracking-[0.1em]">TRUST LEDGER</div>
                <div className="font-poppins text-[12px] font-bold">4.9 • 127 Projects</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-poppins text-[20px] font-bold tracking-[-0.02em]">GROW With Trust</h3>
              <p className="font-poppins mt-1 text-[13px] font-bold text-[#FFE600]">“Grow with gifts, bookings, trust, not hustle”</p>
              <p className="mt-3 text-[13px] leading-[1.6] text-[#5B6470]">MFC Coins, Escrow, Trust Ledger — Touch of GOD. When the final dress reveals, trust converts to commerce.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["MFC Coins", "Escrow", "Trust Ledger"].map((t) => (
                  <span key={t} className="rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-[#5B6470]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — VALUES */}
      <section className="relative mx-auto max-w-[1280px] px-6 py-16 lg:px-8">
        <div className="glass-strong rounded-[28px] p-6 sm:p-10 lg:p-12 drop-card overflow-hidden relative">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,138,0,0.18),transparent_70%)] blur-[24px]" />
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
            <div className="flex-1">
              <div className="font-mono text-[11px] tracking-[0.18em] text-[#FF8A00]">SECTION 03 — VALUES • BAN WORDS + HOLY CRAFT</div>
              <h3 className="font-poppins mt-4 max-w-[14ch] text-[30px] font-bold leading-[0.95] tracking-[-0.03em] sm:text-[38px]">
                We Ban Words.
                <br />
                We Keep Craft.
              </h3>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[16px] border border-red-500/20 bg-red-500/[0.06] p-5">
                  <div className="font-mono text-[11px] tracking-[0.12em] text-red-300/80">BAN — WE DON&apos;T SAY</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["gig", "hustle", "influencer", "content creator", "side-hustle", "viral"].map((w) => (
                      <span key={w} className="rounded-full bg-red-500/15 px-3 py-1 font-mono text-[11px] text-red-200 line-through decoration-red-400/60">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[16px] border border-[#8FFF4A]/20 bg-[#8FFF4A]/[0.07] p-5">
                  <div className="font-mono text-[11px] tracking-[0.12em] text-[#8FFF4A]/80">WE SAY — HOLY WORDS</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Work", "Craft", "Pro", "Project", "Trust", "Worship", "Ledger"].map((w) => (
                      <span key={w} className="rounded-full bg-[#8FFF4A]/15 px-3 py-1 font-poppins text-[12px] font-bold text-[#8FFF4A]">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  { a: "Real Work", b: "Filter" },
                  { a: "Trust Ledger", b: "Likes" },
                  { a: "Project", b: "Post" },
                  { a: "Escrow", b: "Promise" },
                  { a: "Community", b: "Competition" },
                ].map((r) => (
                  <div key={r.a} className="flex items-center justify-between rounded-[12px] border border-[#D4CBB8] bg-[#F0E9DB] px-4 py-3">
                    <span className="font-poppins text-[14px] font-bold">{r.a}</span>
                    <span className="font-mono text-[11px] tracking-[0.08em] text-[#5B6470]">&gt;</span>
                    <span className="font-mono text-[12px] tracking-[0.06em] text-[#5B6470] line-through">{r.b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <div className="relative overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-black">
                <div className="h-[420px] w-full bg-cover bg-center" style={{ backgroundImage: `url(${imgTailor})` }} role="img" aria-label="Tailor sewing lace - touch of GOD craft as worship" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="glass rounded-[16px] p-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-m px-3 py-1 font-poppins text-[11px] font-bold text-black">TOUCH OF GOD</div>
                    <h4 className="font-poppins mt-3 text-[18px] font-bold leading-[1.15] tracking-[-0.01em]">Craft as worship, details matter, every stitch, wire, pipe, brick has God in it.</h4>
                    <p className="mt-2 text-[13px] leading-[1.5] text-[#5B6470]">Tailor sewing lace close-up — 173924 — this is not content. This is prayer. The OS honors the hand that makes.</p>
                    <div className="mt-4 flex gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[10px] text-black">LACE • 0.2mm STITCH</span>
                      <span className="rounded-full bg-[#F0E9DB] px-2.5 py-1 font-mono text-[10px] text-[#5B6470]">HOLY CRAFT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — TEAM + OLDHAM */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="font-mono text-[11px] tracking-[0.18em] text-[#5B6470]">SECTION 04 — WHERE WE BUILD</div>
            <h3 className="font-poppins mt-3 text-[34px] font-bold leading-[0.95] tracking-[-0.03em] sm:text-[42px]">
              Built in Oldham,
              <br />
              for Oldham first.
            </h3>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.6] text-[#5B6470]">1,247 pros in OL1, OL2, OL8 — then Manchester, then UK, then world. We ship from a terraced workshop, not a WeWork.</p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { code: "OL1", count: "412 pros", street: "Oldham Central" },
                { code: "OL2", count: "388 pros", street: "Royton • Shaw" },
                { code: "OL8", count: "447 pros", street: "Bardsley • Hollinwood" },
              ].map((o) => (
                <div key={o.code} className="rounded-[14px] border border-[#D4CBB8] bg-[#F0E9DB] p-3">
                  <div className="font-poppins text-[14px] font-extrabold">{o.code}</div>
                  <div className="font-mono text-[10px] text-[#5B6470]">{o.count}</div>
                  <div className="mt-2 font-mono text-[9px] tracking-[0.06em] text-[#5B6470]">{o.street.toUpperCase()}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[20px] border border-[#D4CBB8] bg-black p-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full overflow-hidden bg-black border border-[#D4CBB8]" style={{ backgroundImage: `url(${logoM2})`, backgroundSize: "cover" }} aria-label="Team logo" />
                <div>
                  <div className="font-poppins text-[13px] font-bold">Team: Founder + Engineers + 1,247 pros who teach us</div>
                  <div className="font-mono text-[11px] text-[#5B6470]">We don&apos;t build for pros. We build with pros.</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-20 w-full rounded-[10px] bg-cover bg-center" style={{ backgroundImage: `url(${imgElectric})` }} aria-label="Builder van Oldham local trades" />
                <div className="h-20 w-full rounded-[10px] bg-cover bg-center" style={{ backgroundImage: `url(${imgPlumber})` }} aria-label="Plumber Gas Safe local" />
                <div className="h-20 w-full rounded-[10px] bg-cover bg-center" style={{ backgroundImage: `url(${imgTailor})` }} aria-label="Tailor local Oldham" />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass-strong rounded-[24px] p-6 drop-card">
              <div className="flex items-center justify-between">
                <h4 className="font-poppins text-[18px] font-bold">Local Trades • Verified • Real Work</h4>
                <span className="rounded-full bg-[#8FFF4A] px-2.5 py-1 font-mono text-[10px] text-black">LIVE IN OL</span>
              </div>

              <div className="mt-6 grid gap-4">
                {[
                  { name: "Mark • Electrician • OL1", cert: "NICEIC • Consumer Unit Specialist", job: "Consumer unit install — 10mi, escrow, trust ledger", trust: "4.9 • 89 Projects", bg: imgElectric },
                  { name: "Ahmed • Plumber • OL8", cert: "Gas Safe • Worcester Bosch Expert", job: "Worcester Bosch fix — live workshop replay 1.2k views", trust: "5.0 • 127 Projects", bg: imgPlumber },
                  { name: "Fatima • Bridal Tailor • OL2", cert: "Final Dress Reveal • Lace Specialist", job: "Wedding dress — from stitch to reveal, project timeline", trust: "4.9 • 203 Projects", bg: imgDress },
                ].map((p) => (
                  <div key={p.name} className="flex gap-4 rounded-[16px] border border-[#D4CBB8] bg-[#F0E9DB] p-4">
                    <div className="h-16 w-16 shrink-0 rounded-[12px] bg-cover bg-center" style={{ backgroundImage: `url(${p.bg})` }} aria-label={p.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-poppins text-[13px] font-bold">{p.name}</span>
                        <span className="rounded-full bg-[#F0E9DB] px-2 py-0.5 font-mono text-[9px] text-[#5B6470]">{p.trust}</span>
                      </div>
                      <div className="mt-1 font-mono text-[10px] tracking-[0.06em] text-[#00E5C0]">{p.cert}</div>
                      <div className="mt-1 text-[12px] leading-[1.4] text-[#5B6470]">{p.job}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[14px] bg-gradient-m p-4 text-black">
                <div className="font-poppins text-[14px] font-bold leading-[1.2]">We don&apos;t scale with ads. We scale with trust.</div>
                <div className="font-mono text-[11px] mt-1 text-black/70">Oldham → Manchester → UK → World. Work Graph travels.</div>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-10 -right-10 h-[260px] w-[260px] rounded-full divine-glow" />
          </div>
        </div>
      </section>

      {/* SECTION 5 — WHY NOW */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8">
        <div className="rounded-[28px] border border-[#D4CBB8] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="font-mono text-[11px] tracking-[0.18em] text-[#00E5C0]">SECTION 05 — WHY NOW • 2026 WINDOW</div>
              <h3 className="font-poppins mt-3 text-[28px] font-bold leading-[0.95] tracking-[-0.03em] sm:text-[36px]">
                AI makes fake cheap.
                <br />
                Real work becomes premium.
              </h3>
            </div>
            <div className="rounded-full border border-[#D4CBB8] bg-black px-4 py-2 font-mono text-[11px] tracking-[0.1em] text-[#5B6470]">WINDOW OPEN • 2026</div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", t: "AI makes fake content cheap, real work becomes premium", d: "When anyone can generate a dress, only a real tailor who sews lace 0.2mm stitch can prove craft. Trust ledger > AI feed.", c: "#8FFF4A" },
              { n: "02", t: "TikTok proves live sells, but no trust", d: "Live workshop converts 3.4x — girl live streaming with tripod in Oldham proves it. But TikTok has no escrow, no verification.", c: "#00E5C0" },
              { n: "03", t: "Stripe Connect + Mux + LiveKit makes OS possible", d: "We can now build Kernel + UPRM + Apps: escrow, live workshop, work graph, project SEO pages — all in one OS.", c: "#FFE600" },
              { n: "04", t: "Google needs real Project SEO pages, not AI spam", d: "A Project page: 12 images, timeline, materials, trust ledger. That's E-E-A-T Google can't fake. Real work ranks.", c: "#FF8A00" },
            ].map((card) => (
              <div key={card.n} className="relative overflow-hidden rounded-[20px] border border-[#D4CBB8] bg-black p-5 drop-card">
                <div className="absolute right-0 top-0 h-[120px] w-[120px] rounded-full opacity-20" style={{ background: `radial-gradient(50%_50%_at_50%_50%,${card.c},transparent)` }} />
                <div className="font-mono text-[11px] tracking-[0.14em]" style={{ color: card.c }}>
                  {card.n} • WHY NOW
                </div>
                <h4 className="font-poppins mt-3 text-[14px] font-bold leading-[1.25]">{card.t}</h4>
                <p className="mt-2 text-[12px] leading-[1.5] text-[#5B6470]">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section id="cta" className="relative mx-auto max-w-[1280px] px-6 pb-12 pt-8 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-[#D4CBB8] bg-black p-8 sm:p-12 lg:p-16 drop-card">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8FFF4A]/[0.14] via-[#00E5C0]/[0.10] via-[#FFE600]/[0.08] to-[#FF8A00]/[0.12]" />
            <div className="absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-[#8FFF4A]/20 blur-[48px]" />
            <div className="absolute -bottom-24 -right-20 h-[420px] w-[420px] rounded-full bg-[#FF8A00]/20 blur-[48px]" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3.5 py-1.5 backdrop-blur">
              <span className="font-mono text-[11px] tracking-[0.12em] text-[#5B6470]">NO.10 OF 24 — ABOUT — TOUCH OF GOD</span>
            </div>

            <h2 className="font-poppins mt-8 max-w-[14ch] text-[36px] font-extrabold leading-[0.9] tracking-[-0.04em] sm:text-[54px] lg:text-[64px]">
              Join the OS for
              <br />
              Real Work —
              <br />
              <span className="text-gradient">Start Showing Free</span>
            </h2>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#" className="rounded-full bg-white px-8 py-4 font-poppins text-[15px] font-bold text-black shadow-[0_12px_32px_rgba(255,255,255,0.18)] transition hover:brightness-[0.96] active:scale-[0.98]">
                Create Your Face Profile — Free
              </a>
              <div className="flex items-center gap-3 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-5 py-3 backdrop-blur">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full border-2 border-black bg-cover bg-center" style={{ backgroundImage: `url(${imgTailor})` }} aria-label="Tailor" />
                  <div className="h-7 w-7 rounded-full border-2 border-black bg-cover bg-center" style={{ backgroundImage: `url(${imgElectric})` }} aria-label="Electrician" />
                  <div className="h-7 w-7 rounded-full border-2 border-black bg-cover bg-center" style={{ backgroundImage: `url(${imgPlumber})` }} aria-label="Plumber" />
                </div>
                <span className="font-mono text-[11px] tracking-[0.08em] text-[#5B6470]">1,247 PROS ALREADY SHOWING</span>
              </div>
            </div>

            <div className="mt-12 grid gap-6 border-t border-[#D4CBB8] pt-8 sm:grid-cols-3">
              <div className="flex gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#F0E9DB] font-mono text-[12px]">iOS</div>
                <div>
                  <div className="font-poppins text-[13px] font-bold">iOS App — Coming Soon</div>
                  <div className="font-mono text-[11px] text-[#5B6470]">Live workshop, project scanner</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#F0E9DB] font-mono text-[12px]">AND</div>
                <div>
                  <div className="font-poppins text-[13px] font-bold">Android — Coming Soon</div>
                  <div className="font-mono text-[11px] text-[#5B6470]">Work OS kernel in pocket</div>
                </div>
              </div>
              <div className="rounded-[14px] bg-gradient-m p-[1px]">
                <div className="rounded-[13px] bg-black px-4 py-3">
                  <div className="font-mono text-[10px] tracking-[0.12em] text-[#5B6470]">FROM VISAGUIDEOS TO MY FACE PROFILE</div>
                  <div className="mt-1 font-poppins text-[13px] font-bold leading-[1.2]">1,247 pros • 12K Projects • 4.9 Trust • Touch of GOD</div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#D4CBB8] pt-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-[10px] bg-gradient-m p-[1px]">
                  <div className="grid h-full w-full place-items-center rounded-[9px] bg-black overflow-hidden">
                    <div className="h-5 w-5 bg-cover bg-center" style={{ backgroundImage: `url(${logoM1})` }} aria-label="M" />
                  </div>
                </div>
                <span className="font-poppins text-[13px] font-bold">My Face Profile OS</span>
                <span className="font-mono text-[11px] text-[#5B6470]">© 2026 Touch of GOD • Oldham • Manchester • UK</span>
              </div>
              <div className="flex gap-2 font-mono text-[10px] tracking-[0.08em] text-[#5B6470]">
                <span>BUILT WITH CRAFT</span>
                <span>•</span>
                <span>NO.10 OF 24</span>
                <span>•</span>
                <span className="text-[#8FFF4A]">HOLY MISSION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
}
