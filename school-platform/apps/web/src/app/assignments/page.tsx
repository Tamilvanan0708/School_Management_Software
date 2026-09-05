'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function AssignmentsPage() {
  const { hasPermission } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.assignments.list().then(r => setAssignments(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24 }}>Assignments</h1>
          {hasPermission('assignment', 'create') && <Link href="/assignments/create" style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', borderRadius: 4, textDecoration: 'none' }}>+ Create</Link>}
        </div>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gap: 12 }}>
            {assignments.map((a: any) => (
              <Link key={a.id} href={`/assignments/${a.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, border: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><strong>{a.title}</strong> · {a.subject?.name}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#666' }}>{a._count?.submissions || 0} submissions</span>
                      <span style={{ fontSize: 12, color: new Date(a.dueDate) < new Date() ? 'red' : '#666' }}>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{a.section?.class?.name} - {a.section?.name}</p>
                </div>
              </Link>
            ))}
            {assignments.length === 0 && <p style={{ color: '#666' }}>No assignments yet.</p>}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}