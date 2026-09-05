'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function StudentsPage() {
  const { hasPermission } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    api.students.list({ page: String(page), limit: String(limit), ...(search ? { search } : {}) })
      .then((res) => { setStudents(res.data); setTotal(res.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search]);

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24 }}>Students</h1>
          {hasPermission('student', 'create') && (
            <Link href="/students/admit" style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', borderRadius: 4, textDecoration: 'none' }}>
              + Admit Student
            </Link>
          )}
        </div>

        <input
          placeholder="Search by name or admission no..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ width: '100%', padding: 10, marginBottom: 16, border: '1px solid #ddd', borderRadius: 4 }}
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Admission No</th>
                  <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Class</th>
                  <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Section</th>
                  <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s: any) => (
                  <tr key={s.id}>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s.admissionNo}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s.user.firstName} {s.user.lastName}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s.class?.name}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s.section?.name}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                      <span style={{ color: s.status === 'ACTIVE' ? 'green' : 'red' }}>{s.status}</span>
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                      <Link href={`/students/${s.id}`} style={{ color: '#0070f3' }}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ padding: '6px 12px' }}>Previous</button>
              <span style={{ padding: '6px 12px' }}>Page {page} of {Math.ceil(total / limit)}</span>
              <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(page + 1)} style={{ padding: '6px 12px' }}>Next</button>
            </div>
          </>
        )}
      </div>
    </RequireAuth>
  );
}