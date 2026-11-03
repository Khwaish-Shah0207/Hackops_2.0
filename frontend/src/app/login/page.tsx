'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/shared/MainNavigation';
import EditorialFooter from '@/components/shared/EditorialFooter';
import { isAuthenticated, getUserRole } from '@/lib/auth';
import { ArrowRightRefinedIcon } from '@/components/shared/CustomIcons';

export default function LoginPortalPage() {
  const router = useRouter();

  // Redirect authenticated users to their corresponding workspace
  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      if (role === 'regional_manager') {
        router.replace('/regional-manager');
      } else if (role === 'government' || role === 'admin') {
        router.replace('/government');
      } else {
        router.replace('/citizen');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-forest-charcoal text-ivory-warm selection:bg-accent-orange selection:text-ivory-warm flex flex-col justify-between">
      <MainNavigation />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-24 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 border border-graphite-border px-3 py-1 bg-forest-dark text-[11px] font-mono text-sage-muted uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse" />
            <span>Role-Based Authentication Gateway</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ivory-warm">
            Authorized Platform Gateways
          </h1>
          <p className="text-xs sm:text-sm font-mono text-sage-muted leading-relaxed">
            Select your operational role to access the corresponding intelligence workspace and compliance tools.
          </p>
        </div>

        {/* Three Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role 1: Citizen */}
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-accent-orange/70 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-graphite-border/60">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent-green font-bold">
                  Public Sector
                </span>
                <span className="font-mono text-[10px] text-sage-muted">Role: Citizen</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-ivory-warm">
                Citizen Portal
              </h2>
              <p className="text-xs font-mono text-sage-muted leading-relaxed">
                Submit geolocated pollution complaints with voice transcription, monitor live meteorological back-trajectories, and verify site enforcement resolution.
              </p>
              <div className="bg-forest-charcoal border border-graphite-border p-3 text-[11px] font-mono text-sage-muted space-y-1">
                <span className="text-accent-orange uppercase font-bold block text-[10px]">Test Account:</span>
                <div>citizen@enviro.gov / citizen123</div>
              </div>
            </div>

            <Link
              href="/login/citizen"
              className="w-full inline-flex items-center justify-between bg-forest-charcoal hover:bg-graphite-deep border border-graphite-border hover:border-accent-orange text-ivory-warm text-xs font-mono font-bold uppercase tracking-wider px-4 py-3 transition-colors"
            >
              <span>Sign In as Citizen</span>
              <ArrowRightRefinedIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Role 2: Executive Officer */}
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-accent-orange/70 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-graphite-border/60">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent-orange font-bold">
                  Field Enforcement
                </span>
                <span className="font-mono text-[10px] text-sage-muted">Role: Executive Officer</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-ivory-warm">
                Executive Officer Console
              </h2>
              <p className="text-xs font-mono text-sage-muted leading-relaxed">
                Field investigation dashboard for evaluating CPCB sensor anomalies, dispatching inspection squads, logging statutory notices, and issuing penalties.
              </p>
              <div className="bg-forest-charcoal border border-graphite-border p-3 text-[11px] font-mono text-sage-muted space-y-1">
                <span className="text-accent-orange uppercase font-bold block text-[10px]">Test Account:</span>
                <div>officer@mpcb.gov.in / officer123</div>
              </div>
            </div>

            <Link
              href="/login/government"
              className="w-full inline-flex items-center justify-between bg-accent-orange hover:bg-accent-orange/90 text-forest-dark text-xs font-mono font-bold uppercase tracking-wider px-4 py-3 transition-colors"
            >
              <span>Sign In as Officer</span>
              <ArrowRightRefinedIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Role 3: Regional Manager */}
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-accent-orange/70 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-graphite-border/60">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent-red font-bold">
                  Executive Directorate
                </span>
                <span className="font-mono text-[10px] text-sage-muted">Role: Regional Manager</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-ivory-warm">
                Regional Manager Directorate
              </h2>
              <p className="text-xs font-mono text-sage-muted leading-relaxed">
                Strategic oversight console: dynamic daily and weekly intelligence briefings, multi-incident consolidated compliance reports, and regional violation audit.
              </p>
              <div className="bg-forest-charcoal border border-graphite-border p-3 text-[11px] font-mono text-sage-muted space-y-1">
                <span className="text-accent-orange uppercase font-bold block text-[10px]">Test Account:</span>
                <div>manager@mpcb.gov.in / manager123</div>
              </div>
            </div>

            <Link
              href="/login/regional-manager"
              className="w-full inline-flex items-center justify-between bg-forest-charcoal hover:bg-graphite-deep border border-graphite-border hover:border-accent-orange text-ivory-warm text-xs font-mono font-bold uppercase tracking-wider px-4 py-3 transition-colors"
            >
              <span>Sign In as Regional Manager</span>
              <ArrowRightRefinedIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
