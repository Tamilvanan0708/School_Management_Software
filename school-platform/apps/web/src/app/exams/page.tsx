'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import Link from 'next/link';

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.exams.list().then(setExams).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Exams</h1>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gap: 12 }}>
            {exams.map((e: any) => (
              <Link key={e.id} href={`/exams/${e.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, border: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><strong>{e.name}</strong> {e.type && <span style={{ fontSize: 12, color: '#666' }}>({e.type})</span>}</div>
                    <span style={{ fontSize: 12, color: '#666' }}>{e._count?.schedules || 0} subjects</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                    {new Date(e.startDate).toLocaleDateString()} - {new Date(e.endDate).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
            {exams.length === 0 && <p style={{ color: '#666' }}>No exams scheduled.</p>}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}