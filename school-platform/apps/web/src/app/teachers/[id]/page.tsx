'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import Link from 'next/link';

export default function TeacherProfilePage() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.teachers.get(id as string).then(setTeacher).catch(console.error).finally(() => setLoading(false)); }, [id]);

  if (loading) return <RequireAuth><div style={{ padding: '2rem' }}>Loading...</div></RequireAuth>;
  if (!teacher) return <RequireAuth><div style={{ padding: '2rem' }}>Teacher not found.</div></RequireAuth>;

  const u = teacher.user;
  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <Link href="/teachers" style={{ color: '#0070f3', display: 'block', marginBottom: 16 }}>← Back to Teachers</Link>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>{u.firstName} {u.lastName}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
            <h3 style={{ marginBottom: 12 }}>Details</h3>
            <p><strong>Employee ID:</strong> {teacher.employeeId}</p>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Qualification:</strong> {teacher.qualification || '-'}</p>
            <p><strong>Specialization:</strong> {teacher.specialization || '-'}</p>
          </div>
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
            <h3 style={{ marginBottom: 12 }}>Timetable ({teacher.timetables?.length || 0} periods)</h3>
            {teacher.timetables?.slice(0, 5).map((tt: any) => (
              <p key={tt.id} style={{ fontSize: 14, marginBottom: 4 }}>Day {tt.dayOfWeek} · Period {tt.periodNumber} · {tt.subject?.name}</p>
            ))}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}