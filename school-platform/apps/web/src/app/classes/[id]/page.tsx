'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import Link from 'next/link';

export default function ClassDetailPage() {
  const { id } = useParams();
  const [cls, setCls] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.classes.get(id as string).then(setCls).catch(console.error).finally(() => setLoading(false)); }, [id]);

  if (loading) return <RequireAuth><div style={{ padding: '2rem' }}>Loading...</div></RequireAuth>;
  if (!cls) return <RequireAuth><div style={{ padding: '2rem' }}>Class not found.</div></RequireAuth>;

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <Link href="/classes" style={{ color: '#0070f3', display: 'block', marginBottom: 16 }}>← Back to Classes</Link>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>{cls.name}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
            <h3>Sections</h3>
            {cls.sections?.map((s: any) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>{s.name}</span>
                <span style={{ color: '#666' }}>{s._count?.students || 0} students</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
            <h3>Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <Link href={`/timetable?classId=${id}`} style={{ color: '#0070f3' }}>View Timetable</Link>
              <Link href={`/attendance?classId=${id}`} style={{ color: '#0070f3' }}>View Attendance</Link>
              <Link href={`/students?classId=${id}`} style={{ color: '#0070f3' }}>View Students</Link>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}