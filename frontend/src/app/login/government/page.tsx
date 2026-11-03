'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { storeAuth, isAuthenticated, isGovernmentUser, type StoredUser } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function GovernmentLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect already-authenticated government users to the authority console.
  useEffect(() => {
    if (isAuthenticated() && isGovernmentUser()) {
      router.replace('/government');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
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
        throw new Error(errData.detail || 'Incorrect email or password.');
      }

      const data = (await response.json()) as {
        access_token: string;
        user: StoredUser;
      };

      // Role gate: only government / admin accounts may access the authority console.
      if (data.user.role !== 'government' && data.user.role !== 'admin') {
        setError(
          'This portal is restricted to Government Authority accounts. ' +
          'Citizen accounts must use the Citizen Login portal instead.'
        );
        return;
      }

      // Store credentials so fetchApi() picks them up automatically.
      storeAuth(data.access_token, data.user);
      router.replace('/government');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-5">

        {/* Back navigation */}
        <Link
          href="/login"
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to portal selection</span>
        </Link>

        {/* Login card — dark theme matching the government dashboard */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">

          {/* Slate-to-emerald top accent stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-slate-600 via-slate-500 to-emerald-500" />

          <div className="p-8 space-y-6">

            {/* Header */}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">Authority Login</h1>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Restricted to pollution control officers and authorised government stakeholders.
                </p>
              </div>
            </div>

            {/* Demo credentials hint */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-3.5 space-y-1.5">
              <p className="text-xs font-semibold text-slate-300">Demo Credentials</p>
              <div className="text-xs text-slate-400 font-mono space-y-0.5">
                <p>Email: <span className="font-bold text-slate-200">officer@mpcb.gov.in</span></p>
                <p>Password: <span className="font-bold text-slate-200">officer123</span></p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start space-x-2.5 bg-red-900/30 border border-red-700/50 rounded-xl p-3.5 text-sm text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@agency.gov.in"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
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
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 text-sm transition"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating…</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    <span>Access Authority Console</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Switch portal link */}
        <p className="text-center text-xs text-slate-500">
          Are you a citizen?{' '}
          <Link
            href="/login/citizen"
            className="text-emerald-500 hover:text-emerald-400 hover:underline font-medium transition-colors"
          >
            Switch to Citizen Login →
          </Link>
        </p>

      </div>
    </div>
  );
}
