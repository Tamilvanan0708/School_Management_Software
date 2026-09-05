'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function AddTeacherPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: 'password123', employeeId: '', qualification: '', specialization: '', address: '', gender: 'MALE' });
  const [error, setError] = useState('');

  if (!hasPermission('teacher', 'create')) return <RequireAuth><div style={{ padding: '2rem' }}>No permission.</div></RequireAuth>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try { await api.teachers.create(form); router.push('/teachers'); }
    catch (err: any) { setError(err.message); }
  };
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });
  const field = (key: string, extra?: any) => (
    <div style={{ marginBottom: 12 }}><label style={{ display: 'block', marginBottom: 4, fontWeight: 500, textTransform: 'capitalize' }}>{key === 'employeeId' ? 'Employee ID' : key.replace(/([A-Z])/g, ' $1')}</label>
      {extra || <input value={(form as any)[key]} onChange={(e) => set(key, e.target.value)} required={key === 'firstName' || key === 'lastName' || key === 'email' || key === 'employeeId'} style={{ width: '100%', padding: 8 }} />}
    </div>
  );

  return (
    <RequireAuth>
      <div style={{ maxWidth: 620, margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Add Teacher</h1>
        <form onSubmit={submit}>
          {field('firstName')}{field('lastName')}{field('email')}{field('employeeId')}
          {field('qualification')}{field('specialization')}{field('address')}
          {field('gender', <select value={form.gender} onChange={(e) => set('gender', e.target.value)} style={{ width: '100%', padding: 8 }}><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></select>)}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: 10, background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Add Teacher</button>
        </form>
      </div>
    </RequireAuth>
  );
}