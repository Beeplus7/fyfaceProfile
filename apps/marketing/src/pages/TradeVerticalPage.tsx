import { Link } from 'react-router-dom';

export type TradeVerticalConfig = {
  slug: string;
  label: string;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  sub: string;
  heroStats: { k: string; v: string }[];
  proofs: { title: string; meta: string; detail: string }[];
  bullets: string[];
  cta: string;
  image: string;
  imageAlt: string;
};

export default function TradeVerticalPage({ trade }: { trade: TradeVerticalConfig }) {
  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full overflow-x-clip bg-[#FFFDF7] text-[#0A1931]"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <div className="border-b border-[#D4CBB8] bg-[#FFF8E1]">
        <div className="mx-auto flex h-10 max-w-[1280px] items-center justify-between px-5 md:px-8">
          <span className="mono text-[11px] tracking-[0.14em] uppercase text-[#5B6470]">
            {trade.eyebrow}
          </span>
          <Link to="/verticals" className="mono text-[11px] text-[#5B6470] hover:text-[#0A1931]">
            All trades →
          </Link>
        </div>
      </div>

      <section className="relative mx-auto max-w-[1280px] px-5 md:px-8 py-12 md:py-20">
        <div className="pointer-events-none absolute left-[-10%] top-[10%] h-[420px] w-[420px] rounded-full bg-[#8FFF4A]/10 blur-[90px]" />
        <div className="pointer-events-none absolute right-[-8%] top-[30%] h-[380px] w-[380px] rounded-full bg-[#FF8A00]/10 blur-[80px]" />

        <div className="relative grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-1 mono text-[10px] uppercase tracking-[0.18em] text-[#5B6470]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8FFF4A]" />
              For {trade.label} • Oldham → UK
            </div>
            <h1 className="poppins mt-5 text-[36px] font-extrabold leading-[0.95] tracking-[-0.04em] md:text-[56px]">
              {trade.headline}
              <br />
              <span className="gradient-text-m">{trade.headlineAccent}</span>
            </h1>
            <p className="mt-5 max-w-[540px] text-[16px] leading-[1.55] text-[#5B6470] md:text-[18px]">
              {trade.sub}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex h-12 items-center rounded-full px-7 text-[14px] font-bold text-black poppins"
                style={{ background: 'var(--gradient-m, linear-gradient(90deg,#8FFF4A,#00E5C0,#FFE600,#FF8A00))' }}
              >
                {trade.cta}
              </Link>
              <Link
                to="/work-os"
                className="inline-flex h-12 items-center rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-5 text-[13px] font-semibold text-[#0A1931]"
              >
                See Work OS
              </Link>
              <Link
                to="/pricing"
                className="inline-flex h-12 items-center rounded-full border border-[#D4CBB8] bg-white px-5 text-[13px] font-semibold text-[#5B6470]"
              >
                Pricing
              </Link>
            </div>

            <div className="mt-10 grid max-w-[520px] grid-cols-3 gap-3">
              {trade.heroStats.map((s) => (
                <div key={s.k} className="rounded-[14px] border border-[#D4CBB8] bg-[#F0E9DB] px-3 py-3">
                  <div className="mono text-[10px] uppercase tracking-[0.12em] text-[#5B6470]">{s.k}</div>
                  <div className="poppins mt-1 text-[16px] font-bold">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[28px] border border-[#D4CBB8] bg-[#F0E9DB] shadow-[0_20px_50px_rgba(10,25,49,0.10)]">
              <div className="relative aspect-[4/5] md:aspect-[5/6]">
                <img src={trade.image} alt={trade.imageAlt} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1931]/75 via-transparent to-transparent" />
                <div className="absolute left-3 top-3 rounded-full bg-[#0A1931]/85 px-3 py-1.5 mono text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  Live proof • {trade.label}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="rounded-[16px] border border-[#D4CBB8] bg-[#FFFDF7]/95 p-3 backdrop-blur">
                    <div className="poppins text-[14px] font-bold">Your work is the storefront</div>
                    <div className="mono mt-1 text-[11px] text-[#5B6470]">
                      Before / after • escrow • TrustScore — not empty posts.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D4CBB8] bg-[#FFFDF7]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-14 md:py-20">
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[#5B6470]">Proof that books jobs</div>
          <h2 className="poppins mt-3 text-[28px] font-extrabold tracking-[-0.03em] md:text-[40px]">
            Show real work. Get paid with trust.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {trade.proofs.map((p) => (
              <div key={p.title} className="rounded-[20px] border border-[#D4CBB8] bg-[#F0E9DB] p-5">
                <div className="mono text-[10px] uppercase tracking-[0.14em] text-[#5B6470]">{p.meta}</div>
                <div className="poppins mt-2 text-[18px] font-bold">{p.title}</div>
                <p className="mt-2 text-[13px] leading-[1.5] text-[#5B6470]">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#D4CBB8]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
            <div>
              <div className="mono text-[11px] uppercase tracking-[0.2em] text-[#5B6470]">Why My Face Profile</div>
              <h2 className="poppins mt-3 text-[28px] font-extrabold tracking-[-0.03em] md:text-[36px]">
                Built for {trade.label.toLowerCase()} who show craft.
              </h2>
              <ul className="mt-6 space-y-3">
                {trade.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[14px] text-[#5B6470]">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#8FFF4A] text-[11px] font-bold text-black">
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[28px] border border-[#D4CBB8] bg-[#F0E9DB] p-6 md:p-8">
              <div className="mono text-[10px] uppercase tracking-[0.16em] text-[#5B6470]">Start free</div>
              <div className="poppins mt-2 text-[24px] font-extrabold">Join as {trade.label} — free forever core.</div>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#5B6470]">
                Profile, projects, gifts, basic WorkCut and UPRM pipeline. Pay only when you want to grow faster.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="inline-flex h-11 items-center rounded-full bg-[#0A1931] px-6 text-[13px] font-bold text-white"
                >
                  {trade.cta}
                </Link>
                <Link
                  to="/video-to-cash"
                  className="inline-flex h-11 items-center rounded-full border border-[#D4CBB8] bg-white px-5 text-[13px] font-semibold text-[#0A1931]"
                >
                  Video → Cash
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#D4CBB8] bg-[#FFF8E1]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-8 mono text-[10px] text-[#5B6470]">
          <span>My Face Profile • For {trade.label} • cream #FFFDF7</span>
          <div className="flex gap-4">
            <Link to="/verticals">Verticals</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/work-os">Work OS</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
