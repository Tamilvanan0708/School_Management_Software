'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { api.notifications.list().then((r: any) => setItems(r.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const markAllRead = async () => { await api.notifications.markAllRead(); load(); };

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24 }}>Notifications</h1>
          <button onClick={markAllRead} style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: 4, background: '#fff', cursor: 'pointer' }}>
            Mark all read
          </button>
        </div>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gap: 8 }}>
            {items.map((n: any) => (
              <div key={n.id} onClick={() => api.notifications.markRead(n.id).then(load)}
                style={{ background: n.isRead ? '#f9f9f9' : '#e6f0ff', padding: 12, borderRadius: 8, cursor: 'pointer', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{!n.isRead && '🔵 '}{n.title}</strong>
                  <span style={{ fontSize: 12, color: '#666' }}>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                {n.body && <p style={{ fontSize: 14, color: '#444', marginTop: 4 }}>{n.body}</p>}
              </div>
            ))}
            {items.length === 0 && <p style={{ color: '#666' }}>No notifications.</p>}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}