'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightRefinedIcon, ScaleBalanceIcon } from '@/components/shared/CustomIcons';

export default function EnforcementChapter() {
  return (
    <section
      id="chapter-enforcement"
      className="relative w-full py-28 bg-graphite-deep border-t border-graphite-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="font-mono text-xs text-accent-orange font-bold tracking-widest uppercase">
            07 // Regulatory Enforcement
          </span>
          <div className="h-px w-12 bg-graphite-border" />
          <span className="font-mono text-xs text-sage-muted tracking-wider uppercase">
            Corrective Action & Audit Trail
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl text-ivory-warm leading-tight font-normal">
              Closing the loop between scientific detection and municipal action.
            </h2>
            <p className="text-base sm:text-lg text-ivory-warm/80 font-light leading-relaxed">
              Evidence without accountability creates regulatory inertia. When candidates are ranked, authorized officers assign field squads, issue statutory show-cause notices, and document on-site corrective actions.
            </p>
            <p className="text-sm text-sage-muted leading-relaxed">
              Once an incident is marked resolved, the reporting citizen is prompted to confirm if air quality has visibly improved. If smoke persists, the case is automatically reopened with an elevated priority rating.
            </p>

            <div className="pt-4">
              <Link
                href="/government"
                className="inline-flex items-center space-x-2 bg-forest-charcoal hover:bg-forest-dark border border-sage-muted/60 text-ivory-warm text-xs font-semibold tracking-wider uppercase px-5 py-3 transition-colors"
              >
                <span>Explore Authority Console</span>
                <ArrowRightRefinedIcon className="w-3.5 h-3.5 text-accent-green" />
              </Link>
            </div>
          </div>

          {/* Action Log Visualizer */}
          <div className="lg:col-span-6 border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-graphite-border">
              <div className="flex items-center space-x-2">
                <ScaleBalanceIcon className="w-4 h-4 text-accent-green" />
                <span className="font-mono text-xs text-ivory-warm uppercase tracking-wider">
                  Enforcement Lifecycle // Audit Log
                </span>
              </div>
              <span className="font-mono text-[10px] text-accent-green border border-accent-green/40 px-2 py-0.5">
                Audit Verified
              </span>
            </div>

            {/* Chronological Action Timeline */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-3 border-b border-graphite-border/40">
                <div className="w-2 h-2 mt-1.5 bg-accent-orange shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-ivory-warm">Squad Assigned</span>
                    <span className="font-mono text-[10px] text-sage-muted">19:10 UTC+05:30</span>
                  </div>
                  <p className="text-xs text-sage-muted">
                    Assigned to Officer R. K. Patil (MPCB Regional Surveillance Wing) with High Priority.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 pb-3 border-b border-graphite-border/40">
                <div className="w-2 h-2 mt-1.5 bg-accent-red shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-ivory-warm">On-Site Corrective Action</span>
                    <span className="font-mono text-[10px] text-sage-muted">20:30 UTC+05:30</span>
                  </div>
                  <p className="text-xs text-sage-muted">
                    Site Inspection executed at Mankhurd yard; open burning doused; statutory show-cause notice issued under Section 31A.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-1.5 bg-accent-green shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-ivory-warm">Citizen Verification Loop</span>
                    <span className="font-mono text-[10px] text-sage-muted">Next Day</span>
                  </div>
                  <p className="text-xs text-sage-muted">
                    Complainant verification prompts rating and checks if smoke has ceased. Failure to improve triggers automatic case reopening.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-graphite-deep text-[11px] font-mono text-sage-muted border-l-2 border-accent-green">
              Compliance Standard: Complete chain-of-custody tracking from citizen alert through physical enforcement ensures regulatory integrity.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

