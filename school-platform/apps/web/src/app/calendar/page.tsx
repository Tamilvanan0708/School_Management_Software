'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', startDate: '', endDate: '', location: '', type: 'event', description: '' });

  const canManage = user?.permissions.includes('announcement:create') || user?.roles.includes('owner');
  const load = () => {
    setLoading(true);
    Promise.all([api.calendar.events(), api.calendar.holidays()])
      .then(([ev, ho]) => { setEvents(ev); setHolidays(ho); })
      .catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.type === 'holiday') await api.calendar.createHoliday({ name: form.title, date: form.startDate, description: form.description });
      else await api.calendar.createEvent(form);
      setForm({ title: '', startDate: '', endDate: '', location: '', type: 'event', description: '' });
      setShowForm(false);
      load();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24 }}>School Calendar</h1>
          {canManage && (
            <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              + Add
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={createEvent} style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 24, display: 'grid', gap: 8 }}>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={{ padding: 8 }} />
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required style={{ padding: 8 }} />
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={{ padding: 8 }} />
            <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={{ padding: 8 }} />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ padding: 8 }}>
              <option value="event">Event</option>
              <option value="holiday">Holiday</option>
            </select>
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ padding: 8 }} />
            <button type="submit" style={{ padding: 8, background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Save</button>
          </form>
        )}

        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h3 style={{ marginBottom: 12 }}>Events</h3>
              {events.map((ev: any) => (
                <div key={ev.id} style={{ background: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                  <strong>{ev.title}</strong>
                  <p style={{ fontSize: 14, color: '#666' }}>{new Date(ev.startDate).toLocaleDateString()}{ev.endDate && ev.endDate !== ev.startDate ? ` - ${new Date(ev.endDate).toLocaleDateString()}` : ''}</p>
                  {ev.location && <p style={{ fontSize: 13, color: '#666' }}>📍 {ev.location}</p>}
                </div>
              ))}
              {events.length === 0 && <p style={{ color: '#666' }}>No events.</p>}
            </div>
            <div>
              <h3 style={{ marginBottom: 12 }}>Holidays</h3>
              {holidays.map((h: any) => (
                <div key={h.id} style={{ background: '#fffbe6', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                  <strong>{h.name}</strong>
                  <p style={{ fontSize: 14, color: '#666' }}>{new Date(h.date).toLocaleDateString()}</p>
                </div>
              ))}
              {holidays.length === 0 && <p style={{ color: '#666' }}>No holidays.</p>}
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}