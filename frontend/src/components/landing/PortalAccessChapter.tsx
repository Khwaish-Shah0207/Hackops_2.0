'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightRefinedIcon } from '@/components/shared/CustomIcons';

export default function PortalAccessChapter() {
  return (
    <section
      id="chapter-access"
      className="relative w-full py-28 bg-forest-charcoal border-t border-graphite-border scroll-mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="font-mono text-xs text-accent-orange font-bold tracking-widest uppercase">
            08 // System Entry
          </span>
          <div className="h-px w-12 bg-graphite-border" />
          <span className="font-mono text-xs text-sage-muted tracking-wider uppercase">
            Operational Portals
          </span>
        </div>

        <div className="max-w-3xl space-y-3 mb-10">
          <h2 className="font-serif text-2xl sm:text-4xl text-ivory-warm leading-tight font-normal">
            Dedicated role-based workspaces for environmental intelligence.
          </h2>
          <p className="text-sm text-ivory-warm/80 font-light leading-relaxed">
            The platform provides three purpose-built gateways tailored to citizen reporters, field compliance officers, and executive regional directors.
          </p>
        </div>

        {/* 3 Role Gateways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gateway 1: Citizen */}
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-graphite-border/60">
                <span className="font-mono text-[10px] text-accent-green font-bold uppercase tracking-wider">
                  Citizen Gateway
                </span>
                <span className="font-mono text-[10px] text-sage-muted">Public Access</span>
              </div>
              <h3 className="font-serif text-2xl text-ivory-warm">
                Citizen Portal
              </h3>
              <p className="text-xs font-mono text-sage-muted leading-relaxed">
                Report visible smoke, foul odors, or open waste burning with voice input and map pinning. Follow real-time plume trajectories and verify remediation.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-graphite-border/60">
              <Link
                href="/submit"
                className="w-full inline-flex items-center justify-between bg-accent-orange hover:bg-accent-orange/90 text-forest-dark font-semibold text-xs tracking-wider uppercase px-4 py-3 transition-colors"
              >
                <span>Report Incident</span>
                <ArrowRightRefinedIcon className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/citizen"
                className="w-full inline-flex items-center justify-between border border-graphite-border hover:border-sage-muted text-ivory-warm text-xs font-mono tracking-wider uppercase px-4 py-2.5 transition-colors"
              >
                <span>Citizen Dashboard</span>
                <ArrowRightRefinedIcon className="w-3.5 h-3.5 text-sage-muted" />
              </Link>
            </div>
          </div>

          {/* Gateway 2: Executive Officer */}
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-graphite-border/60">
                <span className="font-mono text-[10px] text-accent-orange font-bold uppercase tracking-wider">
                  Regulatory Console
                </span>
                <span className="font-mono text-[10px] text-sage-muted">Field Authority</span>
              </div>
              <h3 className="font-serif text-2xl text-ivory-warm">
                Executive Officer Console
              </h3>
              <p className="text-xs font-mono text-sage-muted leading-relaxed">
                Field authority console for monitoring sensor anomalies, evaluating plume trajectories, dispatching inspection squads, and logging statutory notices.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-graphite-border/60">
              <Link
                href="/government"
                className="w-full inline-flex items-center justify-between bg-forest-charcoal hover:bg-graphite-deep border border-sage-muted/60 text-ivory-warm font-semibold text-xs tracking-wider uppercase px-4 py-3 transition-colors"
              >
                <span>Authority Console</span>
                <ArrowRightRefinedIcon className="w-3.5 h-3.5 text-accent-orange" />
              </Link>
              <Link
                href="/login/government"
                className="w-full inline-flex items-center justify-between border border-graphite-border hover:border-sage-muted text-ivory-warm text-xs font-mono tracking-wider uppercase px-4 py-2.5 transition-colors"
              >
                <span>Officer Sign In</span>
                <ArrowRightRefinedIcon className="w-3.5 h-3.5 text-sage-muted" />
              </Link>
            </div>
          </div>

          {/* Gateway 3: Regional Manager */}
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-graphite-border/60">
                <span className="font-mono text-[10px] text-accent-red font-bold uppercase tracking-wider">
                  Executive Directorate
                </span>
                <span className="font-mono text-[10px] text-sage-muted">Directorate Level</span>
              </div>
              <h3 className="font-serif text-2xl text-ivory-warm">
                Regional Manager Directorate
              </h3>
              <p className="text-xs font-mono text-sage-muted leading-relaxed">
                Strategic oversight console: dynamic daily &amp; weekly intelligence briefings, multi-incident consolidated reports, and regional compliance audits.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-graphite-border/60">
              <Link
                href="/regional-manager"
                className="w-full inline-flex items-center justify-between bg-forest-charcoal hover:bg-graphite-deep border border-accent-red/60 text-ivory-warm font-semibold text-xs tracking-wider uppercase px-4 py-3 transition-colors"
              >
                <span>Regional Console</span>
                <ArrowRightRefinedIcon className="w-3.5 h-3.5 text-accent-red" />
              </Link>
              <Link
                href="/login/regional-manager"
                className="w-full inline-flex items-center justify-between border border-graphite-border hover:border-sage-muted text-ivory-warm text-xs font-mono tracking-wider uppercase px-4 py-2.5 transition-colors"
              >
                <span>Directorate Sign In</span>
                <ArrowRightRefinedIcon className="w-3.5 h-3.5 text-sage-muted" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
