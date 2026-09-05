'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import Link from 'next/link';

export default function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.students.get(id as string)
      .then(setStudent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <RequireAuth><div style={{ padding: '2rem' }}>Loading...</div></RequireAuth>;
  if (!student) return <RequireAuth><div style={{ padding: '2rem' }}>Student not found.</div></RequireAuth>;

  const u = student.user;
  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <Link href="/students" style={{ color: '#0070f3', display: 'block', marginBottom: 16 }}>← Back to Students</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h1 style={{ fontSize: 28 }}>{u.firstName} {u.lastName}</h1>
            <p style={{ color: '#666' }}>{student.admissionNo} · {student.class?.name} - {student.section?.name}</p>
          </div>
          <span style={{ padding: '4px 12px', borderRadius: 12, background: student.status === 'ACTIVE' ? '#e6f7e6' : '#ffe6e6', color: student.status === 'ACTIVE' ? 'green' : 'red' }}>
            {student.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
            <h3 style={{ marginBottom: 12 }}>Personal Info</h3>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Gender:</strong> {student.gender}</p>
            <p><strong>DOB:</strong> {student.dob ? new Date(student.dob).toLocaleDateString() : '-'}</p>
            <p><strong>Blood Group:</strong> {student.bloodGroup || '-'}</p>
            <p><strong>Address:</strong> {student.address || '-'}</p>
          </div>
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
            <h3 style={{ marginBottom: 12 }}>Guardian Info</h3>
            <p><strong>Name:</strong> {student.guardianName || '-'}</p>
            <p><strong>Phone:</strong> {student.guardianPhone || '-'}</p>
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <Link href={`/students/${id}/attendance`} style={{ padding: '8px 16px', background: '#f0f0f0', borderRadius: 4, textDecoration: 'none', color: '#333' }}>
            Attendance
          </Link>
          <Link href={`/students/${id}/academics`} style={{ padding: '8px 16px', background: '#f0f0f0', borderRadius: 4, textDecoration: 'none', color: '#333' }}>
            Academics
          </Link>
          <Link href={`/students/${id}/fees`} style={{ padding: '8px 16px', background: '#f0f0f0', borderRadius: 4, textDecoration: 'none', color: '#333' }}>
            Fees
          </Link>
        </div>
      </div>
    </RequireAuth>
  );
}