import { Link } from 'react-router-dom';
import { SITE_PAGES, SITE_PAGE_GROUPS } from '../config/sitePages';

type Props = {
  title?: string;
  compact?: boolean;
};

export default function PagesDirectory({
  title = 'All MyFace pages',
  compact = false,
}: Props) {
  return (
    <section
      id="all-pages"
      className={`border-t border-white/[0.08] ${compact ? 'py-10' : 'py-14 lg:py-20'}`}
    >
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8FFF4A]">
              Wired · {SITE_PAGES.length} routes
            </div>
            <h2 className="mt-2 text-[28px] lg:text-[40px] font-extrabold tracking-[-0.04em] text-white">
              {title}
            </h2>
            <p className="mt-2 text-sm text-white/55 max-w-xl">
              Every marketing page is on its own URL. Tap a card to open it.
            </p>
          </div>
          <Link
            to="/sitemap"
            className="h-10 px-4 rounded-full border border-white/15 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5 grid place-items-center"
          >
            Open sitemap →
          </Link>
        </div>

        <div className="space-y-10">
          {SITE_PAGE_GROUPS.map((group) => {
            const pages = SITE_PAGES.filter((p) => p.group === group.id);
            if (!pages.length) return null;
            return (
              <div key={group.id}>
                <div className="mb-3 text-[12px] font-bold tracking-[0.16em] uppercase text-white/35">
                  {group.label}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pages.map((page) => (
                    <Link
                      key={page.path}
                      to={page.path}
                      className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#8FFF4A]/35 transition p-4 min-h-[88px] flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-bold text-white group-hover:text-[#8FFF4A] transition">
                          {page.label}
                        </div>
                        <span className="font-mono text-[10px] text-white/35 shrink-0">
                          {page.path === '/' ? '/' : page.path}
                        </span>
                      </div>
                      <div className="mt-2 text-[13px] text-white/50">{page.blurb}</div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
