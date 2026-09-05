'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('general');
  const [isPinned, setIsPinned] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.announcements.create({ title, content, type, isPinned });
      router.push('/announcements');
    } catch (err: any) { setError(err.message); }
  };

  return (
    <RequireAuth>
      <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>New Announcement</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 8 }} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} style={{ width: '100%', padding: 8 }} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: 8 }}>
              <option value="general">General</option>
              <option value="academic">Academic</option>
              <option value="holiday">Holiday</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <label style={{ display: 'block', marginBottom: 16 }}>
            <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} /> Pin to top
          </label>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{ padding: '10px 24px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>
            Publish
          </button>
        </form>
      </div>
    </RequireAuth>
  );
}