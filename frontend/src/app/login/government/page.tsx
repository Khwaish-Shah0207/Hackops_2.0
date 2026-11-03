'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/shared/MainNavigation';
import EditorialFooter from '@/components/shared/EditorialFooter';
import { storeAuth, isAuthenticated, type StoredUser } from '@/lib/auth';
import { ArrowRightRefinedIcon } from '@/components/shared/CustomIcons';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function GovernmentLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('officer@mpcb.gov.in');
  const [password, setPassword] = useState('officer123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/government');
    }
  }, [router]);

  const handleFillDemo = () => {
    setEmail('officer@mpcb.gov.in');
    setPassword('officer123');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide officer credentials.');
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
        const errData = await response.json().catch(() => ({ detail: 'Authentication failed.' }));
        throw new Error(errData.detail || 'Incorrect officer credentials or account locked.');
      }

      const data = (await response.json()) as {
        access_token: string;
        user: StoredUser;
      };

      storeAuth(data.access_token, data.user);
      router.replace('/government');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials or connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-charcoal text-ivory-warm selection:bg-accent-orange selection:text-ivory-warm flex flex-col justify-between">
      <MainNavigation />

      <main className="max-w-md w-full mx-auto px-4 sm:px-6 py-24 space-y-6">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-sage-muted">
          <Link href="/login" className="hover:text-ivory-warm transition-colors">
            Portals
          </Link>
          <span>/</span>
          <span className="text-accent-orange font-bold">Executive Officer Access</span>
        </nav>

        {/* Login Container */}
        <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
          <div className="space-y-2 pb-4 border-b border-graphite-border/60">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-accent-orange uppercase tracking-widest font-bold">
                Regulatory Authority Console
              </span>
              <span className="font-mono text-[10px] text-sage-muted">Role: Field Officer</span>
            </div>
            <h1 className="font-serif text-2xl text-ivory-warm">
              Officer Identification
            </h1>
            <p className="text-xs font-mono text-sage-muted leading-relaxed">
              Restricted portal for Pollution Control Board officers managing sensor anomalies, dispatching squads, and enforcing statutory notices.
            </p>
          </div>

          {/* Quick Demo Fill Pill */}
          <div className="bg-forest-charcoal border border-graphite-border p-3 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-sage-muted text-[10px] uppercase block">Seeded Officer Account</span>
              <span className="text-ivory-warm font-bold">officer@mpcb.gov.in</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-mono text-accent-orange hover:underline font-bold px-2 py-1 bg-graphite-deep border border-graphite-border"
            >
              Fill Credentials
            </button>
          </div>

          {error && (
            <div className="bg-accent-red/10 border border-accent-red/40 p-3 text-xs font-mono text-accent-red">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-sage-muted block">
                Official Government Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@mpcb.gov.in"
                className="w-full px-3 py-2 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-sage-muted block">
                Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center space-x-2 bg-accent-orange hover:bg-accent-orange/90 text-forest-dark py-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating Officer...' : 'Sign In to Authority Console'}</span>
              <ArrowRightRefinedIcon className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 border-t border-graphite-border/60 text-[11px] font-mono text-sage-muted text-center">
            Notice: All access attempts are cryptographically timestamped and logged in accordance with environmental audit standards.
          </div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
