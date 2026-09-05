'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';

export default function AttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sectionId, setSectionId] = useState('');
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => { api.classes.list().then((classes: any) => { const all = classes.flatMap((c: any) => c.sections?.map((s: any) => ({ ...s, className: c.name })) || []); setSections(all); }).catch(console.error); }, []);

  useEffect(() => {
    if (!sectionId) return;
    setLoading(true);
    api.attendance.getBySection(sectionId, date).then(setRecords).catch(console.error).finally(() => setLoading(false));
  }, [sectionId, date]);

  const markAll = async (status: string) => {
    const records_data = records.map((r: any) => ({ userId: r.userId, status }));
    await api.attendance.bulkMark({ records: records_data, date, sectionId });
    const updated = await api.attendance.getBySection(sectionId, date);
    setRecords(updated);
  };

  const markOne = async (userId: string, status: string) => {
    await api.attendance.mark({ userId, status, date, sectionId });
    const updated = await api.attendance.getBySection(sectionId, date);
    setRecords(updated);
  };

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Attendance</h1>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}>
            <option value="">Select Section</option>
            {sections.map((s: any) => <option key={s.id} value={s.id}>{s.className} - {s.name}</option>)}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
          {sectionId && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => markAll('PRESENT')} style={{ padding: '6px 12px', background: '#e6f7e6', border: '1px solid #4caf50', borderRadius: 4, cursor: 'pointer' }}>All Present</button>
              <button onClick={() => markAll('ABSENT')} style={{ padding: '6px 12px', background: '#ffe6e6', border: '1px solid #f44336', borderRadius: 4, cursor: 'pointer' }}>All Absent</button>
            </div>
          )}
        </div>
        {loading ? <p>Loading...</p> : sectionId && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Admission No</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr></thead>
            <tbody>{records.map((r: any) => (
              <tr key={r.userId}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{r.admissionNo}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{r.firstName} {r.lastName}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  <span style={{ color: r.status === 'PRESENT' ? 'green' : r.status === 'ABSENT' ? 'red' : r.status === 'LATE' ? 'orange' : '#999' }}>
                    {r.status || 'Not marked'}
                  </span>
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => markOne(r.userId, 'PRESENT')} style={{ padding: '4px 8px', fontSize: 12, background: r.status === 'PRESENT' ? '#4caf50' : '#e6f7e6', color: r.status === 'PRESENT' ? '#fff' : '#333', border: '1px solid #4caf50', borderRadius: 4, cursor: 'pointer' }}>P</button>
                    <button onClick={() => markOne(r.userId, 'ABSENT')} style={{ padding: '4px 8px', fontSize: 12, background: r.status === 'ABSENT' ? '#f44336' : '#ffe6e6', color: r.status === 'ABSENT' ? '#fff' : '#333', border: '1px solid #f44336', borderRadius: 4, cursor: 'pointer' }}>A</button>
                    <button onClick={() => markOne(r.userId, 'LATE')} style={{ padding: '4px 8px', fontSize: 12, background: r.status === 'LATE' ? '#ff9800' : '#fff3e0', color: r.status === 'LATE' ? '#fff' : '#333', border: '1px solid #ff9800', borderRadius: 4, cursor: 'pointer' }}>L</button>
                    <button onClick={() => markOne(r.userId, 'LEAVE')} style={{ padding: '4px 8px', fontSize: 12, background: r.status === 'LEAVE' ? '#2196f3' : '#e3f2fd', color: r.status === 'LEAVE' ? '#fff' : '#333', border: '1px solid #2196f3', borderRadius: 4, cursor: 'pointer' }}>LV</button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </RequireAuth>
  );
}