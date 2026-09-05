'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function CreateAssignmentPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();
  const now = new Date(); now.setDate(now.getDate() + 7);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', subjectId: '', sectionId: '', dueDate: now.toISOString().slice(0, 10), type: 'assignment', maxMarks: '50' });
  const [error, setError] = useState('');

  useEffect(() => { Promise.all([api.classes.list(), api.subjects.list()]).then(([c, s]) => { setClasses(c); setSubjects(s); }); }, []);
  if (!hasPermission('assignment', 'create')) return <RequireAuth><div style={{ padding: '2rem' }}>No permission.</div></RequireAuth>;

  const submit = async () => {
    setError('');
    if (!form.title || !form.subjectId || !form.sectionId) { setError('Title, class/section and subject are required'); return; }
    try { await api.assignments.create({ ...form, maxMarks: Number(form.maxMarks) }); router.push('/assignments'); }
    catch (e: any) { setError(e.message); }
  };
  const allSections = classes.flatMap((c: any) => c.sections?.map((s: any) => ({ ...s, label: `${c.name} - ${s.name}` })) || []);

  return (
    <RequireAuth>
      <div style={{ maxWidth: 620, margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Create Assignment</h1>
        <div style={{ marginBottom: 12 }}><label style={{ fontWeight: 500 }}>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: 8 }} /></div>
        <div style={{ marginBottom: 12 }}><label style={{ fontWeight: 500 }}>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} style={{ width: '100%', padding: 8 }} /></div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <select value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} style={{ padding: 8, flex: 1 }}><option value="">Class / Section…</option>{allSections.map((s: any) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
          <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} style={{ padding: 8, flex: 1 }}><option value="">Subject…</option>{subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} style={{ padding: 8 }} />
          <input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ padding: 8, width: 120 }} />
          <input placeholder="Max marks" type="number" value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} style={{ padding: 8, width: 110 }} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={submit} style={{ padding: '10px 24px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Publish Assignment</button>
      </div>
    </RequireAuth>
  );
}