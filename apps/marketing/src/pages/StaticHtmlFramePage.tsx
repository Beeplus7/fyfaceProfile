import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlobalPagesMenu from '../components/GlobalPagesMenu';

type StaticHtmlFramePageProps = {
  src: string;
  title: string;
};

/** Full-page iframe for standalone HTML exports served from /public. */
export default function StaticHtmlFramePage({
  src,
  title,
}: StaticHtmlFramePageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div
      className="fixed inset-0 bg-[#FFFDF7] overflow-hidden"
      style={{
        paddingTop: 'var(--safe-area-inset-top)',
        paddingBottom: 'var(--safe-area-inset-bottom)',
      }}
    >
      <iframe
        title={title}
        src={src}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
      <div className="fixed top-[calc(var(--safe-area-inset-top)+12px)] left-4 z-50 flex gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full glass px-4 py-2 text-xs font-semibold text-[#0A1931]"
        >
          ← Back
        </button>
        <Link
          to="/sitemap"
          className="rounded-full glass px-4 py-2 text-xs font-semibold text-[#8FFF4A]"
        >
          All pages
        </Link>
      </div>
      <GlobalPagesMenu />
    </div>
  );
}
