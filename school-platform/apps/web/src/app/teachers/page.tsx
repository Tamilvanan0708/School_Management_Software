'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function TeachersPage() {
  const { hasPermission } = useAuth();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.teachers.list().then(r => setTeachers(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24 }}>Teachers</h1>
          {hasPermission('teacher', 'create') && <Link href="/teachers/add" style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', borderRadius: 4, textDecoration: 'none' }}>+ Add Teacher</Link>}
        </div>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Employee ID</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Qualification</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Specialization</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr></thead>
            <tbody>{teachers.map((t: any) => (
              <tr key={t.id}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{t.employeeId}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{t.user.firstName} {t.user.lastName}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{t.qualification || '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{t.specialization || '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}><Link href={`/teachers/${t.id}`} style={{ color: '#0070f3' }}>View</Link></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </RequireAuth>
  );
}