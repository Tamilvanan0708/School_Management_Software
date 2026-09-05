'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';

export default function MarksEntryPage() {
  const { id: examId } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [scheduleId, setScheduleId] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => { api.exams.get(examId as string).then((e: any) => { setExam(e); if (e.schedules?.[0]) setScheduleId(e.schedules[0].id); }).catch(console.error); }, [examId]);

  useEffect(() => {
    if (!scheduleId || !exam) return;
    const sched = exam.schedules?.find((s: any) => s.id === scheduleId);
    if (sched?.sectionId) {
      api.students.list({ sectionId: sched.sectionId, limit: '200' }).then((r: any) => {
        const list = r.data || [];
        setRows(list.map((st: any) => ({
          studentId: st.id, name: `${st.user.firstName} ${st.user.lastName}`,
          value: sched.results?.find((res: any) => res.studentId === st.id)?.marksObtained ?? '',
        })));
      });
    } else {
      setRows([]);
    }
  }, [scheduleId, exam]);

  const submit = async () => {
    setError('');
    try {
      const marks = rows.filter((r) => r.value !== '').map((r) => ({ studentId: r.studentId, marksObtained: Number(r.value) }));
      if (!marks.length) { setError('No marks entered'); return; }
      await api.exams.enterMarks(scheduleId, { marks });
      setDone(true);
      setTimeout(() => router.push('/exams'), 1200);
    } catch (e: any) { setError(e.message); }
  };

  if (!exam) return <RequireAuth><div style={{ padding: '2rem' }}>Loading…</div></RequireAuth>;

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{ fontSize: 22 }}>Marks — {exam.name}</h1>
        <div style={{ margin: '16px 0' }}>
          <select value={scheduleId} onChange={(e) => setScheduleId(e.target.value)} style={{ padding: 8 }}>
            {(exam.schedules || []).map((s: any) => <option key={s.id} value={s.id}>{s.subject?.name} · {new Date(s.date).toLocaleDateString()} · max {s.maxMarks}</option>)}
          </select>
        </div>
        {done && <p style={{ color: 'green' }}>Marks saved ✓</p>}
        {rows.map((r, i) => (
          <div key={r.studentId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', alignItems: 'center' }}>
            <span>{r.name}</span>
            <input type="number" value={r.value} onChange={(e) => { const v = [...rows]; v[i] = { ...v[i], value: e.target.value }; setRows(v); }} style={{ width: 90, padding: 6 }} />
          </div>
        ))}
        {!rows.length && <p style={{ color: '#666', marginTop: 16 }}>This schedule has no section or section has no students.</p>}
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
        <button onClick={submit} disabled={!rows.length || done} style={{ marginTop: 16, padding: '10px 24px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>{done ? 'Saved' : 'Submit marks'}</button>
      </div>
    </RequireAuth>
  );
}