'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STAFF_DEMO_ACCOUNTS = [
  {
    role: 'School Owner',
    email: 'owner@demo.com',
    pass: 'owner123',
    icon: '👑',
    desc: 'Executive & Financial control',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    role: 'Principal',
    email: 'owner@demo.com',
    pass: 'owner123',
    icon: '🎓',
    desc: 'Academic oversight & Approvals',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    role: 'Teacher / Faculty',
    email: 'teacher@demo.com',
    pass: 'password123',
    icon: '🧑‍🏫',
    desc: 'Class marks, homework & periods',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isParentOrStudentNotice, setIsParentOrStudentNotice] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError('');
    setIsParentOrStudentNotice(false);
    setLoading(true);
    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    try {
      const authResult = await login(targetEmail, targetPass);
      const roles: string[] = (authResult as any)?.roles || (authResult as any)?.user?.roles || [];
      
      // Check if user is parent or student
      if (roles.includes('parent') || roles.includes('student') || targetEmail.includes('parent') || targetEmail.includes('aarav') || targetEmail.includes('ananya')) {
        setIsParentOrStudentNotice(true);
        setError('Notice: Web portal access is reserved for School Staff and Teachers. Parents and Students must use the official Mobile App for attendance alerts, fee receipts, and homework.');
        return;
      }

      router.push('/today');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const quickFillAndLogin = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    handleLogin(undefined, accEmail, accPass);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-900 to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      {/* Top Bar: Back link & Mobile App link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>←</span> Back to Public Site
        </Link>
        <Link
          href="/#mobile-app"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>📱</span> Download Parent App
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Card Container */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/30">
              🎓
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
              Staff & Management Portal
            </div>
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              For School Owner, Principal, Teachers & Staff
            </p>
          </div>

          {/* Parent/Student Redirection Notice */}
          {isParentOrStudentNotice ? (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                <span>📱</span>
                <span>Parents & Students: Use Mobile App</span>
              </div>
              <p>
                Web access is dedicated to faculty and administrative management. Please access your child’s attendance, fees, homework, and reports directly through our official Mobile App.
              </p>
              <Link
                href="/#mobile-app"
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>📥 Download Android Mobile App</span>
              </Link>
            </div>
          ) : null}

          {/* Error Banner */}
          {error && !isParentOrStudentNotice && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Staff Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@demo.com or owner@demo.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-sm">↻</span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Staff Portal</span>
                  <span>➔</span>
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Accounts Switcher for Staff */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                ⚡ 1-Click Staff Login
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Test staff role</span>
            </div>

            <div className="space-y-2">
              {STAFF_DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => quickFillAndLogin(acc.email, acc.pass)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{acc.icon}</span>
                    <div>
                      <div className="font-bold text-slate-800 text-xs group-hover:text-blue-600">
                        {acc.role}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {acc.desc}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    Login ➔
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Parent & Student Download Callout Card */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="text-lg mb-1">👨‍👩‍👦 🎓</div>
            <div className="font-bold text-slate-800 text-xs">
              Are you a Parent or Student?
            </div>
            <p className="text-[11px] text-slate-500 mt-1 mb-3">
              Parents & Students use our Mobile App for instant attendance push notifications, fees payment & homework.
            </p>
            <Link
              href="/#mobile-app"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-500 text-slate-700 text-xs font-semibold shadow-2xs transition-all"
            >
              <span>📱</span>
              <span>Download Parent Mobile App</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}