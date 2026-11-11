import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid3X3, X } from 'lucide-react';
import { SITE_PAGES, SITE_PAGE_GROUPS } from '../config/sitePages';

export default function GlobalPagesMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed z-[120] right-3 md:right-5 bottom-[72px] md:bottom-5 inline-flex items-center gap-2 rounded-full bg-[#8FFF4A] text-black font-extrabold text-[13px] h-11 px-4 shadow-[0_10px_30px_rgba(143,255,74,0.35)]"
        aria-label="Open all pages menu"
      >
        <Grid3X3 className="w-4 h-4" />
        All pages
      </button>

      {open ? (
        <div className="fixed inset-0 z-[130]">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close pages menu"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[420px] max-h-[88vh] md:max-h-none overflow-y-auto rounded-t-3xl md:rounded-none border border-[#EDE7DA] bg-[#FFFDF7] text-[#0A1931]"
            style={{ paddingBottom: 'var(--safe-area-inset-bottom)' }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-[#EDE7DA] bg-[#FFFDF7]/95 backdrop-blur">
              <div>
                <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#00C896]">
                  MyFace · {SITE_PAGES.length} pages
                </div>
                <div className="font-extrabold text-lg">Browse & open</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 w-10 rounded-full border border-[#EDE7DA] bg-white grid place-items-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {SITE_PAGE_GROUPS.map((group) => {
                const pages = SITE_PAGES.filter((p) => p.group === group.id);
                return (
                  <div key={group.id}>
                    <div className="mb-2 text-[11px] font-bold tracking-[0.16em] uppercase text-[#5B6470]">
                      {group.label}
                    </div>
                    <div className="space-y-1.5">
                      {pages.map((page) => {
                        const active = location.pathname === page.path;
                        return (
                          <Link
                            key={page.path}
                            to={page.path}
                            className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 border transition min-h-[48px] ${
                              active
                                ? 'border-[#00C896]/50 bg-[#EFFAF6] text-[#007A5C]'
                                : 'border-[#EDE7DA] bg-white text-[#0A1931] hover:bg-[#FFF8E1]'
                            }`}
                          >
                            <span className="font-semibold text-sm">{page.label}</span>
                            <span className="font-mono text-[10px] text-[#5B6470]">
                              {page.path}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
