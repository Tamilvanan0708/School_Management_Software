'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import Link from 'next/link';

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.classes.list().then(setClasses).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Classes</h1>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {classes.map((c: any) => (
              <Link key={c.id} href={`/classes/${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#f9f9f9', padding: 20, borderRadius: 12, border: '1px solid #eee' }}>
                  <h3 style={{ fontSize: 18, marginBottom: 8 }}>{c.name}</h3>
                  <p style={{ color: '#666' }}>{c.sections?.length || 0} sections · {c._count?.sections || 0} total</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {c.sections?.map((s: any) => (
                      <span key={s.id} style={{ background: '#e6f0ff', padding: '4px 10px', borderRadius: 12, fontSize: 12 }}>
                        {s.name} ({s._count?.students || 0})
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}