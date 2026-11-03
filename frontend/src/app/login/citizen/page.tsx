'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { storeAuth, isAuthenticated, type StoredUser } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function CitizenLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect already-authenticated users straight to the citizen portal.
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/citizen');
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

      // Store credentials so fetchApi() picks them up automatically.
      storeAuth(data.access_token, data.user);
      router.replace('/citizen');
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
          className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to portal selection</span>
        </Link>

        {/* Login card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Emerald top accent stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />

          <div className="p-8 space-y-6">

            {/* Header */}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Citizen Login</h1>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Sign in to submit complaints, track investigations, and submit resolution feedback.
                </p>
              </div>
            </div>

            {/* Demo credentials hint */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
              <p className="text-xs font-semibold text-emerald-900">Demo Credentials</p>
              <div className="text-xs text-emerald-800 font-mono space-y-0.5">
                <p>Email: <span className="font-bold">citizen@enviro.gov</span></p>
                <p>Password: <span className="font-bold">citizen123</span></p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start space-x-2.5 bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm shadow-emerald-500/20 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sign In to Citizen Portal</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Switch portal link */}
        <p className="text-center text-xs text-slate-400">
          Are you a government authority?{' '}
          <Link
            href="/login/government"
            className="text-slate-600 hover:text-slate-900 hover:underline font-medium transition-colors"
          >
            Switch to Authority Login →
          </Link>
        </p>

      </div>
    </div>
  );
}
