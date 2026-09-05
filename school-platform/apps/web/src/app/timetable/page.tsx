'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';

export default function TimetablePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [sectionId, setSectionId] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => { api.classes.list().then((c: any) => { setClasses(c); const s = c.flatMap((cl: any) => cl.sections || []); if (s[0]) setSectionId(s[0].id); }); }, []);
  useEffect(() => { if (sectionId) api.timetable.getBySection(sectionId).then(setEntries).catch(() => setEntries([])); }, [sectionId]);

  const cell = (day: number, period: number) => entries.find((e: any) => (e.dayOfWeek + 6) % 7 === day && e.periodNumber === period);
  const totalSections = classes.flatMap((c) => c.sections || []);

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Timetable</h1>
        <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} style={{ padding: 8, marginBottom: 20 }}>
          <option value="">Select section…</option>
          {classes.map((c: any) => (c.sections || []).map((s: any) => <option key={s.id} value={s.id}>{c.name} - {s.name}</option>))}
        </select>
        {sectionId && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Period</th>
              {days.map((d) => <th key={d} style={{ padding: 8, border: '1px solid #eee' }}>{d}</th>)}
            </tr></thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p}>
                  <td style={{ padding: 8, border: '1px solid #eee', fontWeight: 600, background: '#fafafa' }}>{p}</td>
                  {days.map((d, di) => {
                    const e = cell(di, p);
                    return <td key={d} style={{ padding: 6, border: '1px solid #eee', height: 44 }}>
                      {e && <div style={{ background: '#e6f0ff', borderRadius: 6, padding: '4px 8px' }}><div>{e.subject?.name}</div>{e.teacher?.user && <div style={{ color: '#666', fontSize: 11 }}>{e.teacher.user.firstName} {e.teacher.user.lastName}</div>}</div>}
                    </td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!sectionId && <p style={{ color: '#666' }}>{totalSections.length ? 'Pick a section above.' : 'No sections yet — create classes first.'}</p>}
      </div>
    </RequireAuth>
  );
}