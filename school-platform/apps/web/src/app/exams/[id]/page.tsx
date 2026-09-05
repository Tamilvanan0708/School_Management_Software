'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import Link from 'next/link';

export default function ExamDetailPage() {
  const { id } = useParams();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.exams.get(id as string).then(setExam).catch(console.error).finally(() => setLoading(false)); }, [id]);

  if (loading) return <RequireAuth><div style={{ padding: '2rem' }}>Loading...</div></RequireAuth>;
  if (!exam) return <RequireAuth><div style={{ padding: '2rem' }}>Exam not found.</div></RequireAuth>;

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <Link href="/exams" style={{ color: '#0070f3', display: 'block', marginBottom: 16 }}>← Back to Exams</Link>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>{exam.name}</h1>
        <p style={{ color: '#666', marginBottom: 24 }}>{new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}</p>

        <h3 style={{ marginBottom: 12 }}>Schedule</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Subject</th>
            <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Date</th>
            <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Time</th>
            <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Max Marks</th>
            <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Results</th>
          </tr></thead>
          <tbody>{exam.schedules?.map((s: any) => (
            <tr key={s.id}>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s.subject?.name}</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{new Date(s.date).toLocaleDateString()}</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s.startTime || '-'} - {s.endTime || '-'}</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{s.maxMarks || '-'}</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                <Link href={`/results?examId=${exam.id}&scheduleId=${s.id}`} style={{ color: '#0070f3' }}>View Marks</Link>
                <Link href={`/exams/${exam.id}/marks`} style={{ color: '#6d28d9', marginLeft: 10 }}>Enter marks</Link>
              </td>
            </tr>
          ))}</tbody>
        </table>
        {(!exam.schedules || exam.schedules.length === 0) && <p style={{ color: '#666' }}>No schedule added yet.</p>}
      </div>
    </RequireAuth>
  );
}