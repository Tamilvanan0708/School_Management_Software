'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DEMO_ACCOUNTS = [
  {
    role: 'School Owner',
    email: 'owner@demo.com',
    pass: 'owner123',
    icon: '👑',
    desc: 'Full administrative access',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    role: 'Teacher',
    email: 'teacher@demo.com',
    pass: 'password123',
    icon: '🧑‍🏫',
    desc: 'Attendance & Marks',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    role: 'Parent',
    email: 'parent@demo.com',
    pass: 'password123',
    icon: '👨‍👩‍👦',
    desc: 'Multi-child fee & leaves',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    role: 'Student',
    email: 'aarav@demo.com',
    pass: 'password123',
    icon: '🎓',
    desc: 'Class 5-A homework & timetable',
    badge: 'bg-sky-100 text-sky-800 border-sky-200',
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    try {
      await login(targetEmail, targetPass);
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
      {/* Back to website button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>←</span> Back to School Public Site
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Card Container */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/30">
              🎓
            </div>
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              School Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to access your personalized school briefing
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.edu"
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
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span>➔</span>
                </>
              )}
            </button>
          </form>

          {/* One-Click Demo Accounts Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                ⚡ 1-Click Demo Login
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Click to test role</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => quickFillAndLogin(acc.email, acc.pass)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{acc.icon}</span>
                    <span className="font-bold text-slate-800 text-xs group-hover:text-blue-600 truncate">
                      {acc.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {acc.email}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}