'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function CreateHomeworkPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();
  const now = new Date(); now.setDate(now.getDate() + 3);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', subjectId: '', sectionId: '', dueDate: now.toISOString().slice(0, 10), maxMarks: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.classes.list(), api.subjects.list()]).then(([c, s]) => { setClasses(c); setSubjects(s); });
  }, []);

  if (!hasPermission('homework', 'create')) return <RequireAuth><div style={{ padding: '2rem' }}>No permission.</div></RequireAuth>;

  const submit = async () => {
    setError('');
    if (!form.title || !form.subjectId || !form.sectionId) { setError('Title, class/section and subject are required'); return; }
    try {
      await api.homework.create({ ...form, maxMarks: form.maxMarks ? Number(form.maxMarks) : undefined });
      router.push('/homework');
    } catch (e: any) { setError(e.message); }
  };

  const allSections = classes.flatMap((c: any) => c.sections?.map((s: any) => ({ ...s, label: `${c.name} - ${s.name}` })) || []);
  const input = (key: string, extra?: any) => (
    <div style={{ marginBottom: 12, display: 'grid', gap: 4 }}>
      <label style={{ fontWeight: 500, textTransform: 'capitalize' }}>{key === 'maxMarks' ? 'Max marks' : key}</label>
      {extra || <input value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={{ padding: 8 }} />}
    </div>
  );

  return (
    <RequireAuth>
      <div style={{ maxWidth: 620, margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Create Homework</h1>
        {input('title')}
        {input('description', <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} style={{ padding: 8 }} />)}
        {input('sectionId', <select value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} style={{ padding: 8 }}><option value="">Class / Section…</option>{allSections.map((s: any) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>)}
        {input('subjectId', <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} style={{ padding: 8 }}><option value="">Subject…</option>{subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>)}
        {input('dueDate', <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} style={{ padding: 8 }} />)}
        {input('maxMarks')}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={submit} style={{ padding: '10px 24px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Publish Homework</button>
      </div>
    </RequireAuth>
  );
}