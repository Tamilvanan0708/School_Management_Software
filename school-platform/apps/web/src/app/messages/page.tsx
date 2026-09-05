'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function MessagesPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  const load = () => { api.communication.threads().then(setThreads).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openThread = (t: any) => {
    setActive(t);
    api.communication.getThread(t.otherUser.id).then((msgs: any) => { setMessages(msgs || []); api.communication.markRead(t.otherUser.id); });
  };

  const send = async () => {
    if (!text.trim() || !active) return;
    await api.communication.send({ receiverId: active.otherUser.id, message: text });
    setText('');
    api.communication.getThread(active.otherUser.id).then(setMessages);
  };

  const isMine = (m: any) => user && m.senderId === user.id;

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ borderRight: '1px solid #eee', paddingRight: 16, minHeight: '70vh' }}>
          <h1 style={{ fontSize: 20, marginBottom: 16 }}>Messages</h1>
          {loading ? <p>Loading...</p> : (
            <div style={{ display: 'grid', gap: 6 }}>
              {threads.map((t) => (
                <div key={t.otherUser.id} onClick={() => openThread(t)}
                  style={{ padding: 10, borderRadius: 6, cursor: 'pointer', background: active?.otherUser.id === t.otherUser.id ? '#e6f0ff' : '#f9f9f9' }}>
                  <strong>{t.otherUser.firstName} {t.otherUser.lastName}</strong>
                  <p style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.messages[t.messages.length - 1]?.message}
                  </p>
                </div>
              ))}
              {threads.length === 0 && <p style={{ color: '#666' }}>No conversations.</p>}
            </div>
          )}
        </div>
        <div>
          {active ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '70vh', border: '1px solid #eee', borderRadius: 8 }}>
              <div style={{ padding: 12, background: '#f9f9f9', borderRadius: '8px 8px 0 0', borderBottom: '1px solid #eee' }}>
                <strong>{active.otherUser.firstName} {active.otherUser.lastName}</strong>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                {messages.map((m) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isMine(m) ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                    <div style={{ background: isMine(m) ? '#0070f3' : '#f0f0f0', color: isMine(m) ? '#fff' : '#333', padding: '8px 12px', borderRadius: 12, maxWidth: '70%' }}>
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
                <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type a message..." style={{ flex: 1, padding: 8 }} />
                <button onClick={send} style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Send</button>
              </div>
            </div>
          ) : <p style={{ textAlign: 'center', marginTop: '30vh', color: '#666' }}>Select a conversation</p>}
        </div>
      </div>
    </RequireAuth>
  );
}