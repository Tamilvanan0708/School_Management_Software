'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function AdmitStudentPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: 'password123',
    admissionNo: '', rollNo: '', classId: 'cmto2l8qg00018z72bx9t63h0',
    sectionId: '', gender: 'MALE', dob: '', guardianName: '', guardianPhone: '', address: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!hasPermission('student', 'create')) {
    return <RequireAuth><p>You don't have permission to admit students.</p></RequireAuth>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.students.create(form);
      router.push('/students');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <RequireAuth>
      <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Admit New Student</h1>
        <form onSubmit={handleSubmit}>
          {['firstName', 'lastName', 'email', 'admissionNo', 'rollNo', 'guardianName', 'guardianPhone', 'address'].map((field) => (
            <div key={field} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              </label>
              <input
                value={(form as any)[field]}
                onChange={(e) => update(field, e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                required={['firstName', 'lastName', 'email', 'admissionNo'].includes(field)}
              />
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Gender</label>
            <select value={form.gender} onChange={(e) => update('gender', e.target.value)} style={{ width: '100%', padding: 8 }}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Date of Birth</label>
            <input type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} style={{ width: '100%', padding: 8 }} />
          </div>
          {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
          <button type="submit" disabled={submitting} style={{ width: '100%', padding: 10, background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>
            {submitting ? 'Admitting...' : 'Admit Student'}
          </button>
        </form>
      </div>
    </RequireAuth>
  );
}