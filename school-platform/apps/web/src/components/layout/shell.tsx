'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth';
import { ReactNode } from 'react';

const NAV = [
  { href: '/today', label: 'Today', icon: '📅', perm: null },
  { href: '/students', label: 'Students', icon: '🎓', perm: 'student:view' },
  { href: '/teachers', label: 'Teachers', icon: '🧑‍🏫', perm: 'teacher:view' },
  { href: '/classes', label: 'Classes', icon: '🏫', perm: null },
  { href: '/subjects', label: 'Subjects', icon: '📖', perm: null },
  { href: '/timetable', label: 'Timetable', icon: '🗓️', perm: null },
  { href: '/attendance', label: 'Attendance', icon: '✅', perm: null },
  { href: '/homework', label: 'Homework', icon: '📝', perm: null },
  { href: '/assignments', label: 'Assignments', icon: '📋', perm: null },
  { href: '/materials', label: 'Materials', icon: '📚', perm: null },
  { href: '/exams', label: 'Exams', icon: '📊', perm: null },
  { href: '/results', label: 'Results', icon: '🏆', perm: null },
  { href: '/fees', label: 'Fees', icon: '💰', perm: 'fee:view' },
  { href: '/leaves', label: 'Leaves', icon: '🌴', perm: null },
  { href: '/announcements', label: 'Announcements', icon: '📢', perm: null },
  { href: '/calendar', label: 'Calendar', icon: '🗓️', perm: null },
  { href: '/messages', label: 'Messages', icon: '💬', perm: null },
  { href: '/notifications', label: 'Notifications', icon: '🔔', perm: null },
  { href: '/reports', label: 'Reports', icon: '📈', perm: 'report:view' },
  { href: '/settings', label: 'Settings', icon: '⚙️', perm: null },
];

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  if (pathname === '/login') return <>{children}</>;

  const items = user ? NAV.filter((n) => !n.perm || user.permissions.includes(n.perm) || user.roles.includes('owner')) : [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: 210, flexShrink: 0, background: '#0d2137', color: '#fff', padding: '16px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '0 16px 16px', borderBottom: '1px solid rgba(255,255,255,.1)', marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>School Portal</div>
          {user && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{user.firstName} · {user.roles[0]}</div>}
        </div>
        {items.map((n) => (
          <Link key={n.href} href={n.href} style={{ display: 'block', padding: '8px 16px', color: '#fff', textDecoration: 'none', fontSize: 14, background: pathname.startsWith(n.href) ? 'rgba(255,255,255,.14)' : 'transparent' }}>
            {n.icon} {n.label}
          </Link>
        ))}
      </nav>
      <main style={{ flex: 1, background: '#fafafa', minWidth: 0 }}>{children}</main>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Shell>{children}</Shell>
    </AuthProvider>
  );
}