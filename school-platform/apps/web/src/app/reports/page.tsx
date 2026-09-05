'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';

export default function ReportsPage() {
  const [tab, setTab] = useState<'attendance' | 'fees'>('attendance');
  const [attendance, setAttendance] = useState<any[]>([]);
  const [fees, setFees] = useState<any>(null);

  useEffect(() => {
    if (tab === 'attendance') api.reports.attendance().then((d: any) => setAttendance(Array.isArray(d) ? d : [])).catch(console.error);
    else api.fees.summary().then(setFees).catch(console.error);
  }, [tab]);

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Reports</h1>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['attendance', 'fees'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid #ddd', background: tab === t ? '#0070f3' : '#fff', color: tab === t ? '#fff' : '#333', cursor: 'pointer', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'attendance' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th style={{ padding: 12 }}>Class</th><th style={{ padding: 12 }}>Records</th><th style={{ padding: 12 }}>Present</th><th style={{ padding: 12 }}>Rate</th>
            </tr></thead>
            <tbody>{attendance.map((r: any) => (
              <tr key={r.class}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{r.class}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{r.total}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{r.present}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  <div style={{ background: '#eee', borderRadius: 10, height: 8, width: 120 }}>
                    <div style={{ background: r.percentage >= 75 ? '#4caf50' : '#ff9800', height: 8, borderRadius: 10, width: `${r.percentage}%` }} />
                  </div>
                  <span style={{ fontSize: 12 }}>{r.percentage}%</span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {tab === 'fees' && fees && (
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 12, minWidth: 180 }}><strong>Expected</strong><div style={{ fontSize: 24 }}>₹{fees.expectedTotal.toLocaleString('en-IN')}</div></div>
            <div style={{ background: '#e8f5e9', padding: 20, borderRadius: 12, minWidth: 180 }}><strong>Collected</strong><div style={{ fontSize: 24 }}>₹{fees.collected.toLocaleString('en-IN')}</div></div>
            <div style={{ background: '#e3f2fd', padding: 20, borderRadius: 12, minWidth: 180 }}><strong>Outstanding</strong><div style={{ fontSize: 24 }}>₹{fees.outstanding.toLocaleString('en-IN')}</div></div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}