'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';

export default function SubjectDetailPage() {
  const { id } = useParams();
  const [subject, setSubject] = useState<any>(null);
  useEffect(() => { api.subjects.get(id as string).then(setSubject).catch(console.error); }, [id]);
  if (!subject) return <RequireAuth><div style={{ padding: '2rem' }}>Loading…</div></RequireAuth>;

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <Link href="/subjects" style={{ color: '#0070f3' }}>← Subjects</Link>
        <h1 style={{ fontSize: 26, margin: '16px 0 8px' }}>{subject.name} ({subject.code})</h1>
        <h3 style={{ marginTop: 24 }}>Scheduled periods ({subject.timetables?.length || 0})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: 10 }}>Class</th><th style={{ padding: 10 }}>Day</th><th style={{ padding: 10 }}>Period</th><th style={{ padding: 10 }}>Teacher</th>
          </tr></thead>
          <tbody>{(subject.timetables || []).map((t: any) => (
            <tr key={t.id}>
              <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{t.section?.class?.name}-{t.section?.name}</td>
              <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][t.dayOfWeek] {t.startTime}</td>
              <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{t.periodNumber}</td>
              <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{t.teacher?.user?.firstName} {t.teacher?.user?.lastName}</td>
            </tr>
          ))}</tbody>
        </table>
        <h3 style={{ marginTop: 24 }}>Materials ({subject.materials?.length || 0})</h3>
        {(subject.materials || []).map((m: any) => <div key={m.id} style={{ padding: '4px 0' }}>{m.title} · {m.type}</div>)}
      </div>
    </RequireAuth>
  );
}