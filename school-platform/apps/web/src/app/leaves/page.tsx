'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function LeavesPage() {
  const { hasPermission } = useAuth();
  const canApprove = hasPermission('leave', 'approve');
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '', leaveType: 'student' });

  const load = () => { (canApprove ? api.leaves.list() : api.leaves.my()).then(setLeaves).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [canApprove]);

  const applyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.leaves.create(form); setShowForm(false); setForm({ startDate: '', endDate: '', reason: '', leaveType: 'student' }); load(); }
    catch (err: any) { alert(err.message); }
  };

  const approve = async (id: string, status: string) => {
    const remarks = status === 'REJECTED' ? (prompt('Rejection remarks?') || undefined) : undefined;
    await api.leaves.approve(id, { status, remarks });
    load();
  };

  return (
    <RequireAuth>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24 }}>Leave {canApprove ? 'Approvals' : 'Requests'}</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            + Request Leave
          </button>
        </div>

        {showForm && (
          <form onSubmit={applyLeave} style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 24, display: 'grid', gap: 8 }}>
            <select value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })} style={{ padding: 8 }}>
              <option value="student">Student Leave</option>
              <option value="staff">Staff Leave</option>
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required style={{ padding: 8 }} />
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required style={{ padding: 8 }} />
            </div>
            <textarea placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} style={{ padding: 8 }} />
            <button type="submit" style={{ padding: 8, background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Submit</button>
          </form>
        )}

        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Type</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Reason</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Status</th>
              {canApprove && <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Actions</th>}
            </tr></thead>
            <tbody>{leaves.map((l: any) => (
              <tr key={l.id}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{l.user?.firstName} {l.user?.lastName}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{l.leaveType}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{new Date(l.startDate).toLocaleDateString()} → {new Date(l.endDate).toLocaleDateString()}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{l.reason || '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  <span style={{ color: l.status === 'APPROVED' ? 'green' : l.status === 'REJECTED' ? 'red' : 'orange' }}>{l.status}</span>
                </td>
                {canApprove && (
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    {l.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => approve(l.id, 'APPROVED')} style={{ padding: '4px 10px', background: '#e6f7e6', color: '#2e7d32', border: '1px solid #4caf50', borderRadius: 4, cursor: 'pointer' }}>Approve</button>
                        <button onClick={() => approve(l.id, 'REJECTED')} style={{ padding: '4px 10px', background: '#ffe6e6', color: '#c62828', border: '1px solid #f44336', borderRadius: 4, cursor: 'pointer' }}>Reject</button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}</tbody>
          </table>
        )}
        {leaves.length === 0 && !loading && <p style={{ color: '#666', marginTop: 16 }}>No leave requests.</p>}
      </div>
    </RequireAuth>
  );
}