'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function AnnouncementsPage() {
  const { hasPermission } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.announcements.list().then(setItems).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24 }}>Announcements</h1>
          {hasPermission('announcement', 'create') && (
            <Link href="/announcements/create" style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', borderRadius: 4, textDecoration: 'none' }}>
              + New Announcement
            </Link>
          )}
        </div>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gap: 12 }}>
            {items.map((a: any) => (
              <div key={a.id} style={{ background: a.isPinned ? '#fffbe6' : '#f9f9f9', padding: 16, borderRadius: 8, border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ fontSize: 16 }}>{a.isPinned ? '📌 ' : ''}{a.title}</strong>
                    {a.type && <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>({a.type})</span>}
                  </div>
                  <span style={{ fontSize: 12, color: '#666' }}>{new Date(a.publishDate).toLocaleDateString()}</span>
                </div>
                <p style={{ color: '#444', marginTop: 8, whiteSpace: 'pre-wrap' }}>{a.content}</p>
              </div>
            ))}
            {items.length === 0 && <p style={{ color: '#666' }}>No announcements.</p>}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}