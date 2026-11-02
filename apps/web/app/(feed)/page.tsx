'use client';

import { useMemo, useState } from 'react';
import { getFeed, boostProject } from '../../lib/feed';
import { findySuggest, searchProjects } from '../../lib/search';

export default function FeedPage() {
  const [q, setQ] = useState('Aso-Ebi lace');
  const [cursor, setCursor] = useState(0);
  const feed = useMemo(() => getFeed({ cursor, limit: 6 }), [cursor]);
  const hits = useMemo(() => (q.trim() ? searchProjects(q, 10) : feed.items), [q, feed.items]);
  const findy = useMemo(() => findySuggest(q || 'Aso-Ebi lace'), [q]);

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: 24, fontFamily: 'Inter, system-ui' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, opacity: 0.55, letterSpacing: '0.16em' }}>
          WORK FEED · WORK GRAPH · NOT USER GRAPH
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>Projects within 10mi Oldham</h1>
        <p style={{ opacity: 0.65, fontSize: 14 }}>Findy · Typesense/pgvector stub · PostGIS radius · work_ref required</p>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Aso-Ebi lace…"
            style={{
              flex: 1,
              height: 44,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: '#fff',
              padding: '0 16px',
            }}
          />
          <button
            type="button"
            onClick={() => setQ('Aso-Ebi lace')}
            style={{
              borderRadius: 999,
              padding: '0 16px',
              fontWeight: 700,
              color: '#0a0a0a',
              background: 'linear-gradient(90deg,#8FFF4A,#00E5C0,#1A7CFF,#FFE600,#FF8A00)',
              border: 0,
            }}
          >
            Findy
          </button>
        </div>

        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            fontFamily: 'monospace',
            fontSize: 11,
          }}
        >
          {findy.bot}: {findy.note} · {findy.results.length} hits in {findy.radiusMi}mi
        </div>

        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          {hits.map((p) => (
            <article
              key={p.id}
              style={{
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                padding: 16,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.5, fontFamily: 'monospace' }}>work_ref · {p.work_ref}</div>
              <h2 style={{ margin: '6px 0', fontSize: 18 }}>{p.title}</h2>
              <div style={{ fontSize: 13, opacity: 0.75 }}>
                {p.shop} · {p.location} · Trust {p.trust}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}>
                  £{p.cost} · gifts {p.gift_count}
                </span>
                {p.tags.map((t) => (
                  <span key={t} style={{ fontFamily: 'monospace', fontSize: 10, opacity: 0.6 }}>
                    #{t}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  style={{ borderRadius: 999, padding: '8px 14px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff' }}
                >
                  Gift
                </button>
                <button
                  type="button"
                  onClick={() => alert(JSON.stringify(boostProject(p.id, 5)))}
                  style={{
                    borderRadius: 999,
                    padding: '8px 14px',
                    border: 0,
                    fontWeight: 700,
                    color: '#0a0a0a',
                    background: '#FFE600',
                  }}
                >
                  Boost £5 / 500 reach
                </button>
              </div>
            </article>
          ))}
        </div>

        {feed.nextCursor != null && !q.trim() ? (
          <button
            type="button"
            onClick={() => setCursor(feed.nextCursor!)}
            style={{ marginTop: 16, width: '100%', height: 44, borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff' }}
          >
            Load more
          </button>
        ) : null}
      </div>
    </main>
  );
}
