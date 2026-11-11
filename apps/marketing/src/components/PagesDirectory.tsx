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
      className={`border-t border-[#EDE7DA] ${compact ? 'py-10' : 'py-14 lg:py-20'}`}
    >
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#00C896]">
              Wired · {SITE_PAGES.length} routes
            </div>
            <h2 className="mt-2 text-[28px] lg:text-[40px] font-extrabold tracking-[-0.04em] text-[#0A1931]">
              {title}
            </h2>
            <p className="mt-2 text-sm text-[#5B6470] max-w-xl">
              Every marketing page is on its own URL. Tap a card to open it.
            </p>
          </div>
          <Link
            to="/sitemap"
            className="h-10 px-4 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] text-sm font-semibold text-[#0A1931] hover:bg-[#FFF8E1] grid place-items-center"
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
                <div className="mb-3 text-[12px] font-bold tracking-[0.16em] uppercase text-[#5B6470]">
                  {group.label}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pages.map((page) => (
                    <Link
                      key={page.path}
                      to={page.path}
                      className="group rounded-2xl border border-[#D4CBB8] bg-[#F0E9DB] hover:border-[#00C896]/40 hover:shadow-[0_10px_28px_rgba(10,25,49,0.06)] transition p-4 min-h-[88px] flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-bold text-[#0A1931] group-hover:text-[#00C896] transition">
                          {page.label}
                        </div>
                        <span className="font-mono text-[10px] text-[#5B6470] shrink-0">
                          {page.path === '/' ? '/' : page.path}
                        </span>
                      </div>
                      <div className="mt-2 text-[13px] text-[#5B6470]">{page.blurb}</div>
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
