'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function MaterialsPage() {
  const { hasPermission } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', subjectId: '', sectionId: '', type: 'pdf' });
  const [file, setFile] = useState<File | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.materials.list(), api.classes.list(), api.subjects.list()])
      .then(([m, c, s]) => { setItems(m); setClasses(c); setSubjects(s); })
      .catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const allSections = classes.flatMap((c: any) => c.sections?.map((s: any) => ({ ...s, label: `${c.name} - ${s.name}` })) || []);

  const share = async () => {
    if (!form.title || !form.subjectId || !form.sectionId) return;
    const rec = await api.materials.create(form);
    if (file) await api.materials.upload(rec.id, file);
    setOpen(false);
    setForm({ title: '', description: '', subjectId: '', sectionId: '', type: 'pdf' });
    setFile(null);
    load();
  };

  const remove = async (id: string) => { await api.materials.delete(id); load(); };

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24 }}>Study Materials</h1>
          {hasPermission('homework', 'create') && <button onClick={() => setOpen(!open)} style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>+ Share Material</button>}
        </div>
        {open && (
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 20, display: 'grid', gap: 10 }}>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ padding: 8 }} />
            <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ padding: 8 }} rows={2} />
            <div style={{ display: 'flex', gap: 10 }}>
              <select value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} style={{ padding: 8, flex: 1 }}>
                <option value="">Class / Section…</option>
                {allSections.map((s: any) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} style={{ padding: 8, flex: 1 }}>
                <option value="">Subject…</option>
                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={share} style={{ padding: 10, background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Share</button>
          </div>
        )}
        {loading ? <p>Loading…</p> : (
          <div style={{ display: 'grid', gap: 10 }}>
            {items.map((m: any) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: 14, borderRadius: 8 }}>
                <div>
                  <strong>{m.title}</strong>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
                    {m.section?.class?.name}-{m.section?.name} · {m.subject?.name} · {m.type} · by {m.teacher?.user?.firstName} · {new Date(m.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {m.fileUrl && <a href={`http://localhost:4000${m.fileUrl}`} target="_blank" rel="noreferrer" style={{ color: '#0070f3' }}>Open</a>}
                  {hasPermission('homework', 'delete') && <button onClick={() => remove(m.id)} style={{ color: '#c62828', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>}
                </div>
              </div>
            ))}
            {items.length === 0 && <p style={{ color: '#666' }}>No materials shared yet.</p>}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}