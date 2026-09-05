'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth';
import { ReactNode, useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  perm: string | null;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { href: '/today', label: 'Today Briefing', icon: '⚡', perm: null },
      { href: '/announcements', label: 'Announcements', icon: '📢', perm: null },
      { href: '/calendar', label: 'Calendar & Events', icon: '🗓️', perm: null },
      { href: '/messages', label: 'Messages', icon: '💬', perm: null },
      { href: '/notifications', label: 'Notifications', icon: '🔔', perm: null },
    ],
  },
  {
    title: 'Academics',
    items: [
      { href: '/classes', label: 'Classes & Sections', icon: '🏫', perm: null },
      { href: '/subjects', label: 'Subjects', icon: '📖', perm: null },
      { href: '/timetable', label: 'Timetable', icon: '⏱️', perm: null },
      { href: '/attendance', label: 'Attendance', icon: '✅', perm: null },
      { href: '/homework', label: 'Homework', icon: '📝', perm: null },
      { href: '/assignments', label: 'Assignments', icon: '📋', perm: null },
      { href: '/materials', label: 'Study Materials', icon: '📚', perm: null },
      { href: '/exams', label: 'Exams', icon: '📊', perm: null },
      { href: '/results', label: 'Results & Marks', icon: '🏆', perm: null },
    ],
  },
  {
    title: 'Management',
    items: [
      { href: '/students', label: 'Students Directory', icon: '🎓', perm: 'student:view' },
      { href: '/teachers', label: 'Faculty & Teachers', icon: '🧑‍🏫', perm: 'teacher:view' },
      { href: '/fees', label: 'Fee Management', icon: '💳', perm: 'fee:view' },
      { href: '/leaves', label: 'Leave Requests', icon: '🌴', perm: null },
      { href: '/reports', label: 'Academic Reports', icon: '📈', perm: 'report:view' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { href: '/settings', label: 'School Settings', icon: '⚙️', perm: null },
    ],
  },
];

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  owner: { bg: 'bg-purple-100 text-purple-800', text: 'Owner' },
  principal: { bg: 'bg-indigo-100 text-indigo-800', text: 'Principal' },
  admin: { bg: 'bg-blue-100 text-blue-800', text: 'Admin' },
  coordinator: { bg: 'bg-cyan-100 text-cyan-800', text: 'Coordinator' },
  teacher: { bg: 'bg-emerald-100 text-emerald-800', text: 'Teacher' },
  parent: { bg: 'bg-amber-100 text-amber-800', text: 'Parent' },
  student: { bg: 'bg-sky-100 text-sky-800', text: 'Student' },
};

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Public pages do NOT render internal shell
  if (pathname === '/' || pathname === '/login') {
    return <>{children}</>;
  }

  const primaryRole = user?.roles?.[0] || 'staff';
  const roleBadge = ROLE_COLORS[primaryRole] || { bg: 'bg-slate-100 text-slate-700', text: primaryRole };

  const isAllowed = (item: NavItem) => {
    if (!item.perm) return true;
    if (!user) return false;
    if (user.roles?.includes('owner')) return true;
    return user.permissions?.includes(item.perm);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 shrink-0 flex flex-col bg-slate-950 text-slate-200 border-r border-slate-800/80 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <Link href="/today" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-blue-600/30">
              🎓
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight text-sm block">Demo Int&apos;l School</span>
              <span className="text-[11px] text-slate-400 block -mt-0.5">Management Portal</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* User Card Profile */}
        {user && (
          <div className="p-3 mx-3 my-2 rounded-xl bg-slate-900/80 border border-slate-800/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 text-white font-semibold text-xs flex items-center justify-center shrink-0 uppercase tracking-wider">
              {user.firstName?.charAt(0) || 'U'}{user.lastName?.charAt(0) || ''}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-white truncate">
                {user.firstName} {user.lastName}
              </div>
              <span className={`inline-block px-1.5 py-0.2 text-[10px] font-semibold rounded-md mt-0.5 ${roleBadge.bg}`}>
                {roleBadge.text}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Links (Grouped) */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {NAV_GROUPS.map((group) => {
            const filtered = group.items.filter(isAllowed);
            if (!filtered.length) return null;

            return (
              <div key={group.title}>
                <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {filtered.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/today' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm font-semibold'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <span className="text-sm shrink-0">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex-1 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors text-center"
          >
            🌐 School Site
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/40 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Exit</span>
            <span>➔</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              ☰
            </button>
            <div>
              <div className="text-sm font-bold text-slate-900 capitalize">
                {pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
              </div>
              <div className="text-[11px] text-slate-500 hidden sm:block">
                Academic Year 2025–2026
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-xs font-medium flex items-center gap-1.5">
              <span>📅</span>
              <span>{todayStr}</span>
            </div>
            <Link
              href="/notifications"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 text-sm relative"
              title="Notifications"
            >
              🔔
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </Link>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
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