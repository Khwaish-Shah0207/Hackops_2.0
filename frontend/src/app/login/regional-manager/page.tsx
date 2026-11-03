'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { storeAuth, isAuthenticated, isRegionalManager, type StoredUser } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function RegionalManagerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect already-authenticated regional managers to executive dashboard.
  useEffect(() => {
    if (isAuthenticated() && isRegionalManager()) {
      router.replace('/regional-manager');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both official email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Login failed.' }));
        throw new Error(errData.detail || 'Incorrect credentials. Please verify your email and password.');
      }

      const data = (await response.json()) as {
        access_token: string;
        user: StoredUser;
      };

      // Role gate: only regional_manager / admin accounts may access the executive console.
      if (data.user.role !== 'regional_manager' && data.user.role !== 'admin') {
        setError(
          'Access Restricted: This executive portal is strictly reserved for Regional Managers and Board Directors. ' +
          'Officers should use Authority Login and Citizens should use Public Login.'
        );
        return;
      }

      // Store credentials so fetchApi() picks them up automatically.
      storeAuth(data.access_token, data.user);
      router.replace('/regional-manager');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-5">

        {/* Back navigation */}
        <Link
          href="/login"
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to portal selection</span>
        </Link>

        {/* Login card — Executive indigo/slate dark theme */}
        <div className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl border border-indigo-800/50 shadow-2xl overflow-hidden">

          {/* Indigo to emerald top accent stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400" />

          <div className="p-8 space-y-6">

            {/* Header */}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">Regional Manager Login</h1>
                <p className="text-xs text-indigo-200/70 mt-1 leading-relaxed">
                  Executive oversight portal for strategic pollution intelligence, briefings, and regulatory compliance audit.
                </p>
              </div>
            </div>

            {/* Demo credentials hint */}
            <div className="bg-indigo-900/40 border border-indigo-700/40 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-indigo-200">Demonstration Credentials</p>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">Executive</span>
              </div>
              <div className="text-xs text-indigo-200/90 font-mono space-y-0.5">
                <p>Email: <span className="font-bold text-white">manager@mpcb.gov.in</span></p>
                <p>Password: <span className="font-bold text-white">manager123</span></p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start space-x-2.5 bg-red-950/50 border border-red-700/50 rounded-xl p-3.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1.5">
                  Regional Directorate Email
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@mpcb.gov.in"
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-700/50 bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-indigo-700/50 bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials…</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    <span>Access Regional Console</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Cross portal links */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <Link
            href="/login/citizen"
            className="hover:text-slate-300 hover:underline transition-colors"
          >
            ← Citizen Login
          </Link>
          <Link
            href="/login/government"
            className="hover:text-slate-300 hover:underline transition-colors"
          >
            Authority Login →
          </Link>
        </div>

      </div>
    </div>
  );
}
