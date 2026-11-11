import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';

type StubPageProps = {
  title: string;
  description?: string;
};

export default function StubPage({ title, description }: StubPageProps) {
  return (
    <div
      className="min-h-screen w-full bg-[#FFFDF7] text-[#0A0A0A] overflow-x-clip antialiased flex flex-col items-center justify-center px-6"
      style={{ paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#FFFDF7]" />
        <div
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] rounded-full opacity-20 blur-[120px]"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 50%, #8FFF4A 0%, transparent 70%)',
          }}
        />
      </div>
      <Map className="w-10 h-10 text-[#8FFF4A] mb-4" />
      <h1 className="text-2xl font-bold font-[Poppins] mb-2">{title}</h1>
      <p className="text-white/60 text-center max-w-md mb-8">
        {description ??
          'This page is coming soon. Browse the sitemap for available routes.'}
      </p>
      <Link
        to="/sitemap"
        className="rounded-full bg-white text-black px-6 py-3 font-semibold text-sm hover:bg-[#8FFF4A] transition"
      >
        View sitemap
      </Link>
      <Link
        to="/"
        className="mt-4 text-sm text-white/50 hover:text-white transition"
      >
        Back home
      </Link>
    </div>
  );
}
