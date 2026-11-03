'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/shared/MainNavigation';
import EditorialFooter from '@/components/shared/EditorialFooter';
import { storeAuth, isAuthenticated, type StoredUser } from '@/lib/auth';
import { ArrowRightRefinedIcon } from '@/components/shared/CustomIcons';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function RegionalManagerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('manager@mpcb.gov.in');
  const [password, setPassword] = useState('manager123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/regional-manager');
    }
  }, [router]);

  const handleFillDemo = () => {
    setEmail('manager@mpcb.gov.in');
    setPassword('manager123');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide executive credentials.');
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
        throw new Error(errData.detail || 'Incorrect regional manager credentials.');
      }

      const data = (await response.json()) as {
        access_token: string;
        user: StoredUser;
      };

      storeAuth(data.access_token, data.user);
      router.replace('/regional-manager');
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
          <span className="text-accent-red font-bold">Regional Directorate Access</span>
        </nav>

        {/* Login Container */}
        <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
          <div className="space-y-2 pb-4 border-b border-graphite-border/60">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-accent-red uppercase tracking-widest font-bold">
                Executive Directorate
              </span>
              <span className="font-mono text-[10px] text-sage-muted">Role: Regional Manager</span>
            </div>
            <h1 className="font-serif text-2xl text-ivory-warm">
              Regional Directorate Console
            </h1>
            <p className="text-xs font-mono text-sage-muted leading-relaxed">
              Executive access for daily &amp; weekly intelligence briefings, multi-incident consolidated reports, and regional statutory compliance reviews.
            </p>
          </div>

          {/* Quick Demo Fill Pill */}
          <div className="bg-forest-charcoal border border-graphite-border p-3 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-sage-muted text-[10px] uppercase block">Seeded Directorate Account</span>
              <span className="text-ivory-warm font-bold">manager@mpcb.gov.in</span>
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
                Directorate Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@mpcb.gov.in"
                className="w-full px-3 py-2 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-sage-muted block">
                Directorate Security Key
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
              className="w-full mt-2 inline-flex items-center justify-center space-x-2 bg-accent-red hover:bg-accent-red/90 text-ivory-warm py-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating Directorate...' : 'Sign In to Regional Console'}</span>
              <ArrowRightRefinedIcon className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 border-t border-graphite-border/60 text-[11px] font-mono text-sage-muted text-center">
            Authorized regional management sessions are monitored and governed by CPCB statutory oversight directives.
          </div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
