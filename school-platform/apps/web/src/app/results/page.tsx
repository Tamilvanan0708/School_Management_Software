'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import Link from 'next/link';

export default function ResultsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [examId, setExamId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.exams.list().then((e: any) => setExams(Array.isArray(e) ? e : [])).catch(console.error); }, []);

  useEffect(() => {
    if (!examId) { setResults([]); return; }
    setLoading(true);
    api.results.list({ examId }).then((data: any) => setResults(Array.isArray(data) ? data : []))
      .catch(console.error).finally(() => setLoading(false));
  }, [examId]);

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Results</h1>
        <div style={{ marginBottom: 24 }}>
          <select value={examId} onChange={(e) => setExamId(e.target.value)} style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4, minWidth: 250 }}>
            <option value="">Select Exam</option>
            {exams.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        {loading ? <p>Loading...</p> : results.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Student</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Subject</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Marks</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Grade</th>
            </tr></thead>
            <tbody>{results.map((r: any) => (
              <tr key={r.id}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{r.student?.user?.firstName} {r.student?.user?.lastName}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{r.examSchedule?.subject?.name}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{r.marksObtained ?? '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}><strong>{r.grade || '-'}</strong></td>
              </tr>
            ))}</tbody>
          </table>
        ) : examId ? <p style={{ color: '#666' }}>No marks entered yet for this exam.</p> : <p style={{ color: '#666' }}>Select an exam to view results.</p>}
        <Link href="/exams" style={{ color: '#0070f3', display: 'inline-block', marginTop: 16 }}>← Back to Exams</Link>
      </div>
    </RequireAuth>
  );
}