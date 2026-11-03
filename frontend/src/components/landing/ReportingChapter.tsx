'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightRefinedIcon, CrosshairIcon } from '@/components/shared/CustomIcons';

export default function ReportingChapter() {
  return (
    <section
      id="chapter-reporting"
      className="relative w-full py-28 bg-forest-charcoal border-t border-graphite-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="font-mono text-xs text-accent-orange font-bold tracking-widest uppercase">
            02 // Incident Intake
          </span>
          <div className="h-px w-12 bg-graphite-border" />
          <span className="font-mono text-xs text-sage-muted tracking-wider uppercase">
            Ground-Level Observation Capture
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl text-ivory-warm leading-tight font-normal">
              Every investigation begins with an unverified citizen observation.
            </h2>
            <p className="text-base sm:text-lg text-ivory-warm/80 font-light leading-relaxed">
              When residents report pungent fumes or visible smoke columns, the system captures exact geospatial coordinates, photographic evidence, and the observation timestamp.
            </p>
            <p className="text-sm text-sage-muted leading-relaxed">
              This filing acts as a trigger for automated back-trajectory computation. Rather than relying on human dispatch delays, the platform immediately interrogates meteorological archives and ambient sensor arrays along the calculated upwind corridor.
            </p>

            <div className="pt-4">
              <Link
                href="/submit"
                className="inline-flex items-center space-x-2 border border-accent-orange text-accent-orange hover:bg-accent-orange hover:text-forest-dark text-xs font-semibold tracking-wider uppercase px-5 py-3 transition-colors"
              >
                <span>Report an Observation</span>
                <ArrowRightRefinedIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Incident Record Visualization */}
          <div className="lg:col-span-6 border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-graphite-border">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-accent-orange uppercase tracking-widest">
                  Live Demonstration Filing
                </span>
                <h3 className="font-sans text-lg font-bold text-ivory-warm">
                  INC-2026-0004
                </h3>
              </div>
              <span className="font-mono text-xs text-sage-light px-2.5 py-1 border border-sage-muted/40">
                Status: Under Analysis
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-graphite-border/60 p-3 bg-forest-charcoal">
                <span className="font-mono text-[10px] text-sage-muted uppercase block">Location (Region A)</span>
                <span className="font-sans text-sm font-semibold text-ivory-warm mt-1 block">Chembur Colony</span>
                <span className="font-mono text-[11px] text-sage-muted">19.0580° N, 72.8980° E</span>
              </div>
              <div className="border border-graphite-border/60 p-3 bg-forest-charcoal">
                <span className="font-mono text-[10px] text-sage-muted uppercase block">Observed Contaminant</span>
                <span className="font-sans text-sm font-semibold text-ivory-warm mt-1 block">Toxic Smoke & Odor</span>
                <span className="font-mono text-[11px] text-accent-orange">Dense White-Grey</span>
              </div>
            </div>

            <div className="border-t border-graphite-border/60 pt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-sage-muted">Observation Time:</span>
                <span className="font-mono text-ivory-warm">18:45:00 UTC+05:30</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-mono text-sage-muted">Reporting Channel:</span>
                <span className="font-mono text-ivory-warm">Mobile Resident Intake</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-mono text-sage-muted">Regulatory Classification:</span>
                <span className="font-mono text-accent-orange">Unverified Field Report</span>
              </div>
            </div>

            <div className="bg-graphite-deep/80 p-3 text-[11px] font-mono text-sage-muted border-l-2 border-accent-orange">
              Regulatory Notice: Initial citizen filings provide spatial coordinates for computational inquiry. Guilt is never imputed without multi-criteria synthesis and on-site physical inspection.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

