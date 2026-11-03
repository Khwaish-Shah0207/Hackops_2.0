'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/shared/MainNavigation';
import EditorialFooter from '@/components/shared/EditorialFooter';
import { storeAuth, isAuthenticated, type StoredUser } from '@/lib/auth';
import { ArrowRightRefinedIcon } from '@/components/shared/CustomIcons';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function CitizenLoginPage() {
  const router = useRouter();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('citizen@enviro.gov');
  const [password, setPassword] = useState('citizen123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/citizen');
    }
  }, [router]);

  const handleFillDemo = () => {
    setIsRegisterMode(false);
    setEmail('citizen@enviro.gov');
    setPassword('citizen123');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide email address and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endpoint = isRegisterMode ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
      const bodyPayload = isRegisterMode
        ? {
            email: email.trim(),
            password,
            full_name: fullName.trim() || 'Citizen Reporter',
            role: 'citizen',
            organization: organization.trim() || undefined,
          }
        : { email: email.trim(), password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Authentication failed.' }));
        throw new Error(errData.detail || 'Incorrect credentials or account already registered.');
      }

      const data = (await response.json()) as {
        access_token: string;
        user: StoredUser;
      };

      storeAuth(data.access_token, data.user);
      router.replace('/citizen');
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
          <span className="text-accent-orange font-bold">Citizen Authentication</span>
        </nav>

        {/* Login Container */}
        <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
          <div className="space-y-2 pb-4 border-b border-graphite-border/60">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-accent-green uppercase tracking-widest font-bold">
                Citizen Portal Gateway
              </span>
              <span className="font-mono text-[10px] text-sage-muted">Public Access</span>
            </div>
            <h1 className="font-serif text-2xl text-ivory-warm">
              {isRegisterMode ? 'Register Citizen Account' : 'Citizen Sign In'}
            </h1>
            <p className="text-xs font-mono text-sage-muted leading-relaxed">
              Authenticate to log incident complaints, inspect evidence dossiers, and track remediation.
            </p>
          </div>

          {/* Quick Demo Fill Pill */}
          <div className="bg-forest-charcoal border border-graphite-border p-3 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-sage-muted text-[10px] uppercase block">Seeded Demo Account</span>
              <span className="text-ivory-warm font-bold">citizen@enviro.gov</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-mono text-accent-orange hover:underline font-bold px-2 py-1 bg-graphite-deep border border-graphite-border"
            >
              Fill Demo Credentials
            </button>
          </div>

          {error && (
            <div className="bg-accent-red/10 border border-accent-red/40 p-3 text-xs font-mono text-accent-red">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-sage-muted block">
                    Full Legal / Public Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-sage-muted block">
                    Resident Welfare Association / Locality
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Chembur Residents Forum"
                    className="w-full px-3 py-2 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-sage-muted block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@enviro.gov"
                className="w-full px-3 py-2 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-sage-muted block">
                Access Password
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
              <span>{loading ? 'Authenticating...' : isRegisterMode ? 'Complete Registration' : 'Sign In as Citizen'}</span>
              <ArrowRightRefinedIcon className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="pt-2 border-t border-graphite-border/60 flex items-center justify-between text-[11px] font-mono text-sage-muted">
            <span>{isRegisterMode ? 'Already registered?' : 'Need a citizen account?'}</span>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              className="text-accent-orange hover:underline font-bold"
            >
              {isRegisterMode ? 'Sign In Instead' : 'Register New Account'}
            </button>
          </div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
