import type { ReactNode } from 'react';

export const metadata = {
  title: 'MyFace UPRM Command Center',
  description: 'PID 1 · Work Is Your Face',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#050505', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
