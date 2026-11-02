import { Link } from 'react-router-dom';
import { M_GRAD, UPRM_PILL, UPRM_STICKY } from './uprmChrome';
import { useAuth } from './auth/AuthProvider';

type NavLinkItem = { to: string; label: string; primary?: boolean };

/**
 * Shared product sticky nav — same pattern as VisaGuide wallet/journey header:
 * eyebrow · title · glass pills · balance chip.
 */
export function ProductTopNav({
  eyebrow,
  title,
  subtitle,
  balance,
  links,
  tabs,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  balance?: number;
  links?: NavLinkItem[];
  tabs?: { to: string; label: string; active?: boolean }[];
}) {
  const { signOut, configured } = useAuth();
  const defaultLinks: NavLinkItem[] = [
    { to: '/app/arcade', label: 'Games Center', primary: true },
    { to: '/app/dashboard', label: 'Dashboard' },
    { to: '/app/onboarding', label: 'Re-run onboarding' },
    { to: '/readiness', label: 'Readiness' },
    { to: '/', label: 'Marketing' },
  ];
  const nav = links ?? defaultLinks;

  return (
    <div className={UPRM_STICKY} style={{ top: 'var(--safe-area-inset-top)' }}>
      <div className="mx-auto max-w-[1600px] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#8FFF4A]">{eyebrow}</div>
          <div className="text-sm text-white/85 truncate font-semibold">{title}</div>
          {subtitle ? <div className="mono text-[10px] text-white/40 truncate mt-0.5">{subtitle}</div> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {typeof balance === 'number' ? (
            <div
              className="h-10 px-4 rounded-full mono text-[12px] font-bold text-black grid place-items-center"
              style={{ background: M_GRAD }}
            >
              {balance.toLocaleString()} MFC
            </div>
          ) : null}
          {nav.map((l) =>
            l.primary ? (
              <Link
                key={l.to + l.label}
                to={l.to}
                className="h-10 px-3 rounded-full text-xs font-bold text-black grid place-items-center"
                style={{ background: M_GRAD }}
              >
                {l.label}
              </Link>
            ) : (
              <Link key={l.to + l.label} to={l.to} className={UPRM_PILL}>
                {l.label}
              </Link>
            ),
          )}
          {configured ? (
            <button type="button" onClick={() => void signOut()} className="h-10 px-3 rounded-full bg-white text-black text-xs font-bold">
              Sign out
            </button>
          ) : null}
        </div>
      </div>
      {tabs && tabs.length > 0 ? (
        <div className="mx-auto max-w-[1600px] px-4 pb-3 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={
                t.active
                  ? 'h-9 px-4 rounded-full mono text-[11px] font-bold grid place-items-center bg-white text-black'
                  : 'h-9 px-4 rounded-full mono text-[11px] font-bold grid place-items-center border border-white/15 text-white/60'
              }
            >
              {t.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ProductTopNav;
