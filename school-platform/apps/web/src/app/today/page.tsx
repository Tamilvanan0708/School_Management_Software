'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/layout/require-auth';
import { useAuth } from '@/lib/auth';

export default function TodayPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      api.dashboard.today()
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user || !user.roles) return <RequireAuth>{null}</RequireAuth>;

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <RequireAuth>
      <div className="space-y-6">
        {/* Top Welcome Banner */}
        <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold backdrop-blur-xs mb-3">
              <span>⚡</span> Daily Briefing
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {user.firstName} {user.lastName}!
            </h1>
            <p className="text-blue-100/80 text-sm mt-1">
              {dateStr} · Here is what&apos;s happening at your school today.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/announcements"
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-all"
            >
              School Circulars
            </Link>
            <Link
              href="/calendar"
              className="px-4 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold transition-all shadow-xs"
            >
              Calendar
            </Link>
          </div>
        </div>

        {/* Dynamic Role Views */}
        {loading || !data ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin text-2xl mb-2">↻</div>
            <p className="text-sm font-medium">Assembling your daily briefing…</p>
          </div>
        ) : (
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

function SectionCard({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs card-hover flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
          </div>
          {action && (
            <Link
              href={action.href}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {action.label} →
            </Link>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   1. STUDENT TODAY VIEW
   ─────────────────────────────────────────────────────────── */
function StudentToday({ data }: { data: any }) {
  const attPct = data.attendancePercentage ?? 0;
  const isHealthyAtt = attPct >= 75;

  return (
    <div className="space-y-6">
      {/* Attendance & Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {data.attendancePercentage ?? '—'}%
            </div>
            <div className={`text-[11px] font-semibold mt-1 ${isHealthyAtt ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isHealthyAtt ? '✓ Meeting 75% minimum' : '⚠️ Below required 75%'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            📊
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Homework</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {data.pendingHomework?.length || 0}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">Assignments to submit</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
            📝
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Exams</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {data.upcomingExams?.length || 0}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">Scheduled papers</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold">
            🏆
          </div>
        </div>
      </div>

      {/* Main Grid: Timetable & Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Today's Timetable" icon="🗓️" action={{ label: 'Full Schedule', href: '/timetable' }}>
          <div className="space-y-2.5">
            {(data.todayClasses || []).map((c: any) => (
              <div
                key={c.period}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    P{c.period}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{c.subject}</div>
                    <div className="text-[11px] text-slate-500">{c.teacher || 'Assigned Faculty'}</div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
                  {c.time || 'Period ' + c.period}
                </div>
              </div>
            ))}
            {!data.todayClasses?.length && (
              <p className="text-xs text-slate-500 py-4 text-center">No classes scheduled for today.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Homework Checklist" icon="✍️" action={{ label: 'View All', href: '/homework' }}>
          <div className="space-y-2.5">
            {(data.pendingHomework || []).map((h: any) => (
              <div
                key={h.id}
                className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{h.title}</div>
                  <div className="text-[11px] text-amber-800 font-medium mt-0.5">{h.subject}</div>
                </div>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                  Due {new Date(h.dueDate).toLocaleDateString()}
                </span>
              </div>
            ))}
            {!data.pendingHomework?.length && (
              <div className="text-center py-6 text-emerald-600 text-xs font-semibold">
                ✓ You are completely caught up with all homework!
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   2. PARENT TODAY VIEW
   ─────────────────────────────────────────────────────────── */
function ParentToday({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Your Enrolled Children</h2>
        <span className="text-xs text-slate-500 font-medium">
          {data.children?.length || 0} Students Linked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(data.children || []).map((c: any) => {
          const hasFeePending = c.pendingFees > 0;
          return (
            <div
              key={c.studentId}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base">
                      {c.childName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{c.childName}</h3>
                      <p className="text-xs text-slate-500">Class {c.className}-{c.section}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                    Attendance: {c.attendancePercentage ?? '—'}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-500">Classes Today</div>
                    <div className="font-bold text-slate-900 text-base mt-0.5">{c.todayClasses?.length || 0}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-500">Pending Homework</div>
                    <div className="font-bold text-slate-900 text-base mt-0.5">{c.pendingHomework?.length || 0}</div>
                  </div>
                </div>

                {/* Fee Status Card */}
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  hasFeePending ? 'bg-rose-50/70 border-rose-200' : 'bg-emerald-50/70 border-emerald-200'
                }`}>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">Fee Status</div>
                    <div className={`text-sm font-bold ${hasFeePending ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {hasFeePending ? `₹${c.pendingFees.toLocaleString('en-IN')} Outstanding` : 'All Fees Paid ✓'}
                    </div>
                  </div>
                  {hasFeePending ? (
                    <Link
                      href="/fees"
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Pay Online →
                    </Link>
                  ) : (
                    <Link href="/fees" className="text-xs font-semibold text-emerald-700 hover:underline">
                      View Ledger →
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-5">
                <Link href="/leaves" className="text-xs font-semibold text-slate-600 hover:text-blue-600">
                  + Apply Leave
                </Link>
                <Link href="/results" className="text-xs font-semibold text-blue-600 hover:underline">
                  View Report Card →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   3. TEACHER TODAY VIEW
   ─────────────────────────────────────────────────────────── */
function TeacherToday({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Periods</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {data.todaySchedule?.length || 0}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">Classes to teach today</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
            🧑‍🏫
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submissions Pending</div>
            <div className="text-3xl font-extrabold text-amber-600 mt-1">
              {data.pendingReview?.reduce((acc: number, r: any) => acc + (r.submissions || 0), 0) || 0}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">Assignments to evaluate</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
            ✍️
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Attendance</div>
            <Link
              href="/attendance"
              className="inline-block mt-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Take Attendance →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            ✅
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Today's Teaching Schedule" icon="⏱️" action={{ label: 'Timetable', href: '/timetable' }}>
          <div className="space-y-2.5">
            {(data.todaySchedule || []).map((s: any) => (
              <div
                key={s.period}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    P{s.period}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{s.subject}</div>
                    <div className="text-[11px] text-slate-500">{s.class}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {s.time || 'Period ' + s.period}
                </div>
              </div>
            ))}
            {!data.todaySchedule?.length && (
              <p className="text-xs text-slate-500 py-4 text-center">No periods allocated for today.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Pending Assignment Grading" icon="📋" action={{ label: 'All Assignments', href: '/assignments' }}>
          <div className="space-y-2.5">
            {(data.pendingReview || []).map((r: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/80"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{r.assignment}</div>
                  <div className="text-[11px] text-amber-800">{r.subject}</div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-amber-200 text-amber-900 text-xs font-bold">
                  {r.submissions} to Grade
                </span>
              </div>
            ))}
            {!data.pendingReview?.length && (
              <div className="text-center py-6 text-emerald-600 text-xs font-semibold">
                ✓ All student submissions are evaluated!
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   4. ADMIN & PRINCIPAL TODAY VIEW
   ─────────────────────────────────────────────────────────── */
function AdminToday({ data }: { data: any }) {
  const s = data.stats;
  const isHealthyAtt = (s.todayAttendanceRate ?? 0) >= 80;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{s.students}</div>
          <div className="text-[11px] text-slate-500 mt-1">Enrolled & active</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Teachers</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{s.teachers}</div>
          <div className="text-[11px] text-slate-500 mt-1">Teaching faculty</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today Attendance</div>
          <div className={`text-3xl font-extrabold mt-1 ${isHealthyAtt ? 'text-emerald-600' : 'text-amber-600'}`}>
            {s.todayAttendanceRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{s.todayAttendanceMarked} marked records</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Collection</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">{data.fees?.percentage}%</div>
          <div className="text-[11px] text-slate-500 mt-1">of ₹{data.fees?.expectedTotal?.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Alerts & Action Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Pending Approvals & Leaves" icon="🌴" action={{ label: 'Review Leaves', href: '/leaves' }}>
          <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div>
              <div className="text-sm font-bold text-amber-950">Staff & Student Leave Requests</div>
              <div className="text-xs text-amber-800 mt-0.5">
                {s.pendingLeaves > 0
                  ? `${s.pendingLeaves} request(s) waiting for principal/admin sign-off.`
                  : 'No pending leave requests.'}
              </div>
            </div>
            <Link
              href="/leaves"
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shrink-0"
            >
              Action ({s.pendingLeaves})
            </Link>
          </div>
        </SectionCard>

        <SectionCard title="Active Announcements" icon="📢" action={{ label: 'Manage Notices', href: '/announcements' }}>
          <div className="space-y-2">
            {(data.recentAnnouncements || []).map((a: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  {a.pinned && <span title="Pinned">📌</span>}
                  <span className="font-semibold text-slate-900 truncate">{a.title}</span>
                </div>
                <span className="text-slate-500 shrink-0">{new Date(a.date).toLocaleDateString()}</span>
              </div>
            ))}
            {!data.recentAnnouncements?.length && (
              <p className="text-xs text-slate-500 py-3 text-center">No active announcements.</p>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}