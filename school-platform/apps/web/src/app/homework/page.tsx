'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function HomeworkPage() {
  const { hasPermission } = useAuth();
  const [homework, setHomework] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.homework.list().then(r => setHomework(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24 }}>Homework</h1>
          {hasPermission('homework', 'create') && <Link href="/homework/create" style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', borderRadius: 4, textDecoration: 'none' }}>+ Create</Link>}
        </div>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gap: 12 }}>
            {homework.map((h: any) => (
              <Link key={h.id} href={`/homework/${h.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, border: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><strong>{h.title}</strong> · {h.subject?.name}</div>
                    <span style={{ fontSize: 12, color: new Date(h.dueDate) < new Date() ? 'red' : '#666' }}>Due: {new Date(h.dueDate).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{h.section?.class?.name} - {h.section?.name} · By {h.teacher?.user?.firstName}</p>
                </div>
              </Link>
            ))}
            {homework.length === 0 && <p style={{ color: '#666' }}>No homework assigned yet.</p>}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}