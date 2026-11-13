import { Link } from 'react-router-dom';

type Section = { title: string; body: string[] };

type LegalDoc = {
  kicker: string;
  title: string;
  updated: string;
  summary: string;
  sections: Section[];
};

const DOCS: Record<'privacy' | 'terms', LegalDoc> = {
  privacy: {
    kicker: 'Legal • Privacy • Page 23',
    title: 'Privacy Policy',
    updated: 'Updated 29 Oct 2026 • Oldham',
    summary:
      'Privacy is trust. We collect what we need to run Work OS, UPRM, escrow, and gifts — not to sell your bench as a dataset.',
    sections: [
      {
        title: 'What we collect',
        body: [
          'Account details you provide (name, email, phone, trade, Gas Safe / NICEIC IDs where relevant).',
          'Project media you upload: before/after photos, live clips, materials lists, and job metadata.',
          'Payment and escrow events via Stripe Connect (we do not store full card numbers).',
          'Basic device and usage logs needed for security, fraud prevention, and product reliability.',
        ],
      },
      {
        title: 'How we use data',
        body: [
          'To operate Work OS, Trust Ledger, discovery, bookings, gifts (MFC), and payouts.',
          'To show your verified work in local feeds (e.g. Oldham 10mi) when you choose to publish.',
          'To meet legal, tax, and safety obligations for escrow and regulated trades.',
          'We do not sell personal data to ad networks. Privacy > tracking.',
        ],
      },
      {
        title: 'Data safety',
        body: [
          'Encryption in transit; access limited to systems that need it.',
          'Stripe handles card vaulting and Connect payouts.',
          'Your craft media stays on your profile/projects unless you publish or share it.',
        ],
      },
      {
        title: 'Your rights',
        body: [
          'Access, export, correct, or delete your account data (subject to legal retention for escrow/disputes).',
          'Withdraw marketing consent anytime; transactional escrow messages may still send.',
          'Contact privacy@myfaceprofile.aikova.co.uk or use Contact for Oldham support.',
        ],
      },
    ],
  },
  terms: {
    kicker: 'Legal • Terms • Page 24',
    title: 'Terms of Service',
    updated: 'Updated 29 Oct 2026 • Oldham',
    summary:
      'Escrow > promise. Money moves when work moves — not before. Real craft, verified reviews, and Stripe-secured milestones.',
    sections: [
      {
        title: 'The platform',
        body: [
          'My Face Profile is a Work OS for trades: profiles, projects, live workshop, UPRM pipeline, gifts, and discovery.',
          'You must provide accurate trade credentials where required (Gas Safe, Part P, etc.).',
          'You own your work media; you grant us a licence to host and display it for the services you use.',
        ],
      },
      {
        title: 'Escrow is law',
        body: [
          'Job deposits and milestone payments are held via Stripe Connect until release conditions are met.',
          'Platform fees (jobs/shop/gifts) are disclosed at checkout; pros receive the stated share after fees.',
          'Disputes follow the in-product escrow flow before chargebacks where possible.',
        ],
      },
      {
        title: 'Acceptable use',
        body: [
          'No fake reviews, stolen media, unsafe installs presented as certified, or harassment.',
          'No attempting to bypass escrow for covered bookings.',
          'We may suspend accounts that harm trust or break law.',
        ],
      },
      {
        title: 'Oldham first & liability',
        body: [
          'Early access focuses on local craft markets (Oldham / GM) before wider rollout.',
          'Pros remain responsible for workmanship and regulated compliance; the platform facilitates proof and payment.',
          'Governing law: England and Wales. Contact via /contact for notices.',
        ],
      },
    ],
  },
};

export default function LegalDocumentPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const doc = DOCS[kind];
  const other = kind === 'privacy' ? { to: '/legal/terms', label: 'Terms of Service' } : { to: '/legal/privacy', label: 'Privacy Policy' };

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full overflow-x-clip bg-[#FFFDF7] text-[#0A1931]"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <div className="border-b border-[#D4CBB8] bg-[#FFF8E1]">
        <div className="mx-auto flex h-10 max-w-[880px] items-center justify-between px-5 md:px-8">
          <span className="mono text-[11px] uppercase tracking-[0.14em] text-[#5B6470]">{doc.kicker}</span>
          <Link to={other.to} className="mono text-[11px] text-[#5B6470] hover:text-[#0A1931]">
            {other.label} →
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-[880px] px-5 py-12 md:px-8 md:py-16">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#5B6470]">{doc.updated}</div>
        <h1 className="poppins mt-3 text-[36px] font-extrabold tracking-[-0.04em] md:text-[52px]">{doc.title}</h1>
        <p className="mt-4 text-[16px] leading-[1.6] text-[#5B6470] md:text-[18px]">{doc.summary}</p>

        <div className="mt-10 space-y-6">
          {doc.sections.map((s) => (
            <section key={s.title} className="rounded-[20px] border border-[#D4CBB8] bg-[#F0E9DB] p-5 md:p-6">
              <h2 className="poppins text-[18px] font-bold md:text-[20px]">{s.title}</h2>
              <ul className="mt-3 space-y-2">
                {s.body.map((line) => (
                  <li key={line} className="flex gap-3 text-[14px] leading-[1.55] text-[#5B6470]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8FFF4A]" />
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex h-11 items-center rounded-full bg-[#0A1931] px-6 text-[13px] font-bold text-white"
          >
            Contact support
          </Link>
          <Link
            to="/sitemap"
            className="inline-flex h-11 items-center rounded-full border border-[#D4CBB8] bg-white px-5 text-[13px] font-semibold text-[#0A1931]"
          >
            Sitemap
          </Link>
        </div>
      </main>
    </div>
  );
}
