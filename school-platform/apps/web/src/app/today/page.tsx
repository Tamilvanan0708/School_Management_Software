'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function TodayPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => { if (user) api.dashboard.today().then(setData).catch(console.error); }, [user]);

  if (!user || !user.roles) return <RequireAuth>{null}</RequireAuth>;

  const greeting = user ? `Good day, ${user.firstName}!` : '';
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <RequireAuth>
      <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28 }}>{greeting}</h1>
            <p style={{ color: '#666' }}>{date}</p>
          </div>
          <button onClick={logout} style={{ padding: '6px 16px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}>Logout</button>
        </div>

        {!data ? <p>Loading your day…</p> : (
          <>
            {data.role === 'student' && <StudentToday data={data} />}
            {data.role === 'parent' && <ParentToday data={data} />}
            {data.role === 'teacher' && <TeacherToday data={data} />}
            {data.role === 'admin' && <AdminToday data={data} />}
          </>
        )}
      </div>
    </RequireAuth>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
      <h3 style={{ fontSize: 15, marginBottom: 10, color: '#333' }}>{title}</h3>
      {children}
    </div>
  );
}

function StudentToday({ data }: { data: any }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      <Card title={`Classes Today (${data.todayClasses?.length || 0})`}>
        {(data.todayClasses || []).map((c: any) => (
          <div key={c.period} style={{ padding: '4px 0', fontSize: 14 }}>{c.period}. {c.subject} {c.time && `· ${c.time}`}</div>
        ))}
        {!data.todayClasses?.length && <p style={{ color: '#666', fontSize: 14 }}>No classes scheduled — enjoy!</p>}
      </Card>
      <Card title="⚠️ Pending Homework">
        {(data.pendingHomework || []).map((h: any) => (
          <div key={h.id} style={{ padding: '4px 0', fontSize: 14 }}>{h.subject}: {h.title} <span style={{ color: '#c62828' }}>due {new Date(h.dueDate).toLocaleDateString()}</span></div>
        ))}
        {!data.pendingHomework?.length && <p style={{ color: 'green', fontSize: 14 }}>All caught up ✓</p>}
      </Card>
      <Card title="📋 Pending Assignments">
        {(data.pendingAssignments || []).map((a: any) => (
          <div key={a.id} style={{ padding: '4px 0', fontSize: 14 }}>{a.subject}: {a.title}</div>
        ))}
        {!data.pendingAssignments?.length && <p style={{ fontSize: 14, color: '#666' }}>None right now</p>}
      </Card>
      <Card title="📅 Upcoming Exams">
        {(data.upcomingExams || []).map((e: any, i: number) => (
          <div key={i} style={{ padding: '4px 0', fontSize: 14 }}>{e.subject} ({e.exam}) · {new Date(e.date).toLocaleDateString()}</div>
        ))}
        {!data.upcomingExams?.length && <p style={{ fontSize: 14, color: '#666' }}>None scheduled</p>}
      </Card>
      <Card title="✅ Attendance">
        <span style={{ fontSize: 30, fontWeight: 700, color: (data.attendancePercentage ?? 0) >= 75 ? 'green' : 'orange' }}>
          {data.attendancePercentage ?? '—'}%
        </span>
      </Card>
    </div>
  );
}

function ParentToday({ data }: { data: any }) {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {(data.children || []).map((c: any) => (
        <div key={c.studentId} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginBottom: 10 }}>{c.childName} — {c.className}-{c.section}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, fontSize: 14 }}>
            <div>📚 Classes today: <strong>{c.todayClasses?.length || 0}</strong></div>
            <div>📝 Homework pending: <strong>{c.pendingHomework?.length || 0}</strong></div>
            <div>📊 Attendance: <strong>{c.attendancePercentage ?? '—'}%</strong></div>
            <div>💰 Fees: <strong style={{ color: c.pendingFees > 0 ? '#c62828' : 'green' }}>{c.pendingFees > 0 ? `₹${c.pendingFees} due` : 'Clear'}</strong> <Link href="/fees" style={{ color: '#0070f3' }}>Pay →</Link></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeacherToday({ data }: { data: any }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      <Card title={`My Schedule (${data.todaySchedule?.length || 0} periods)`}>
        {(data.todaySchedule || []).map((s: any) => (
          <div key={s.period} style={{ padding: '4px 0', fontSize: 14 }}>{s.period}. {s.subject} · {s.class}</div>
        ))}
        {!data.todaySchedule?.length && <p style={{ fontSize: 14, color: '#666' }}>No periods today</p>}
      </Card>
      <Card title={`⚠️ Pending for Review (${data.pendingReview?.length || 0})`}>
        {(data.pendingReview || []).map((r: any, i: number) => (
          <div key={i} style={{ padding: '4px 0', fontSize: 14 }}>{r.assignment} — <strong>{r.submissions}</strong> submissions · {r.subject}</div>
        ))}
        {!data.pendingReview?.length && <p style={{ fontSize: 14, color: 'green' }}>Nothing pending ✓</p>}
      </Card>
      <Card title="Recent Homework">
        {(data.recentHomework || []).map((h: any, i: number) => (
          <div key={i} style={{ padding: '4px 0', fontSize: 14 }}>{h.subject}: {h.title}</div>
        ))}
      </Card>
    </div>
  );
}

function AdminToday({ data }: { data: any }) {
  const s = data.stats;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
      <Card title="Students"><div style={{ fontSize: 30, fontWeight: 700 }}>{s.students}</div></Card>
      <Card title="Teachers"><div style={{ fontSize: 30, fontWeight: 700 }}>{s.teachers}</div></Card>
      <Card title="Attendance Today"><div style={{ fontSize: 30, fontWeight: 700, color: s.todayAttendanceRate >= 80 ? 'green' : 'orange' }}>{s.todayAttendanceRate}%</div><div style={{ fontSize: 12, color: '#666' }}>{s.todayAttendanceMarked} marks</div></Card>
      <Card title="Fees Collected"><div style={{ fontSize: 30, fontWeight: 700 }}>{data.fees.percentage}%</div><div style={{ fontSize: 12, color: '#666' }}>of ₹{data.fees.expectedTotal.toLocaleString('en-IN')}</div></Card>
      <Card title="⚠️ Pending Leaves"><Link href="/leaves" style={{ fontSize: 30, fontWeight: 700, color: s.pendingLeaves > 0 ? '#e65100' : 'green' }}>{s.pendingLeaves}</Link></Card>
      <div style={{ gridColumn: '1 / -1' }}>
        <Card title="Announcements">
          {(data.recentAnnouncements || []).map((a: any, i: number) => (
            <div key={i} style={{ padding: '4px 0', fontSize: 14, display: 'flex', justifyContent: 'space-between' }}><span>{a.pinned ? '📌 ' : ''}{a.title}</span><span style={{ color: '#666' }}>{new Date(a.date).toLocaleDateString()}</span></div>
          ))}
        </Card>
      </div>
    </div>
  );
}