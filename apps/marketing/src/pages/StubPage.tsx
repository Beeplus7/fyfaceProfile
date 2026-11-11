import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';

type StubPageProps = {
  title: string;
  description?: string;
};

export default function StubPage({ title, description }: StubPageProps) {
  return (
    <div
      className="min-h-screen w-full bg-[#FFFDF7] text-[#0A1931] overflow-x-clip antialiased flex flex-col items-center justify-center px-6"
      style={{ paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#FFFDF7]" />
        <div
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] rounded-full opacity-40 blur-[120px]"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 50%, #FFF3C4 0%, transparent 70%)',
          }}
        />
      </div>
      <div className="mkt-card px-8 py-10 max-w-md w-full text-center">
        <Map className="w-10 h-10 text-[#00C896] mb-4 mx-auto" />
        <h1 className="text-2xl font-bold font-[Poppins] mb-2 text-[#0A1931]">{title}</h1>
        <p className="text-[#5B6470] text-center max-w-md mb-8">
          {description ??
            'This page is coming soon. Browse the sitemap for available routes.'}
        </p>
        <Link
          to="/sitemap"
          className="inline-flex rounded-full bg-[#FFC300] text-[#0A1931] px-6 py-3 font-extrabold text-sm hover:brightness-105 transition"
        >
          View sitemap
        </Link>
        <Link
          to="/"
          className="mt-4 block text-sm text-[#5B6470] hover:text-[#0A1931] transition"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
