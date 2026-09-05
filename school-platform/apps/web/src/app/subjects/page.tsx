'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function SubjectsPage() {
  const { hasPermission } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', type: 'core' });

  const load = () => { api.subjects.list().then(setSubjects).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name) return;
    await api.subjects.create({ ...form, code: form.code || form.name.slice(0, 3).toUpperCase() });
    setForm({ name: '', code: '', type: 'core' });
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this subject?')) return;
    await api.subjects.delete(id);
    load();
  };

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24 }}>Subjects</h1>
          {hasPermission('class', 'create') && (
            <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>+ Add Subject</button>
          )}
        </div>

        {showForm && (
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ padding: 8, flex: 1 }} />
            <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} style={{ padding: 8, width: 90 }} />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ padding: 8 }}>
              <option value="core">Core</option><option value="elective">Elective</option><option value="extra">Extra-curricular</option>
            </select>
            <button onClick={create} style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>Save</button>
          </div>
        )}

        {loading ? <p>Loading…</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Code</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Type</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Periods</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Homework</th>
              {hasPermission('class', 'delete') && <th style={{ padding: 12 }}>Actions</th>}
            </tr></thead>
            <tbody>{subjects.map((s: any) => (
              <tr key={s.id}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}><Link href={`/subjects/${s.id}`} style={{ color: '#0070f3' }}>{s.name}</Link></td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s.code || '—'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s.type || '—'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s._count?.timetables ?? 0}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s._count?.homework ?? 0}</td>
                {hasPermission('class', 'delete') && (
                  <td style={{ padding: 12 }}><button onClick={() => remove(s.id)} style={{ color: '#c62828', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button></td>
                )}
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </RequireAuth>
  );
}