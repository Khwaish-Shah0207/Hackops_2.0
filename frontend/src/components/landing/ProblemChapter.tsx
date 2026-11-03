'use client';

import React from 'react';
import { CrosshairIcon } from '@/components/shared/CustomIcons';

export default function ProblemChapter() {
  return (
    <section
      id="chapter-problem"
      className="relative w-full py-28 bg-graphite-deep border-t border-graphite-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="font-mono text-xs text-accent-orange font-bold tracking-widest uppercase">
            01 // The Problem
          </span>
          <div className="h-px w-12 bg-graphite-border" />
          <span className="font-mono text-xs text-sage-muted tracking-wider uppercase">
            Atmospheric Plume Dispersion
          </span>
        </div>

        {/* Editorial Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl text-ivory-warm leading-tight font-normal">
              Transient plumes cross municipal boundaries before conventional monitoring detects them.
            </h2>
            <p className="text-base sm:text-lg text-ivory-warm/80 font-light leading-relaxed">
              In dense industrial-urban corridors, open waste burning and illicit emissions occur episodically. By the time stationary ambient monitoring stations register elevated particulate concentrations, the emission plume has drifted kilometers downwind into residential communities.
            </p>
            <p className="text-sm text-sage-muted leading-relaxed">
              Without synchronized meteorological vectors and receptor chemical fingerprinting, environmental authorities cannot distinguish between regional background haze and acute localized violation sources.
            </p>
          </div>

          {/* Environmental Conditions Console Box */}
          <div className="lg:col-span-5 border border-graphite-border bg-forest-charcoal p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-graphite-border">
              <div className="flex items-center space-x-2">
                <CrosshairIcon className="w-4 h-4 text-accent-orange" />
                <span className="font-mono text-xs uppercase tracking-wider text-ivory-warm">
                  Regional Focus: Mumbai Eastern Sector
                </span>
              </div>
              <span className="font-mono text-[10px] text-accent-orange px-2 py-0.5 border border-accent-orange/40">
                Critical Zone
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-baseline py-2 border-b border-graphite-border/40">
                <span className="font-mono text-xs text-sage-muted uppercase">Meteorological Regime</span>
                <span className="font-sans text-sm font-semibold text-ivory-warm">Coastal Thermal Inversion</span>
              </div>
              <div className="flex justify-between items-baseline py-2 border-b border-graphite-border/40">
                <span className="font-mono text-xs text-sage-muted uppercase">Corridor Sensitivity</span>
                <span className="font-sans text-sm font-semibold text-ivory-warm">High Density Mixed-Use</span>
              </div>
              <div className="flex justify-between items-baseline py-2 border-b border-graphite-border/40">
                <span className="font-mono text-xs text-sage-muted uppercase">Primary Contaminants</span>
                <span className="font-sans text-sm font-semibold text-ivory-warm">PM2.5, Black Carbon, VOCs</span>
              </div>
              <div className="flex justify-between items-baseline py-2 border-b border-graphite-border/40">
                <span className="font-mono text-xs text-sage-muted uppercase">Baseline Dispersion Rate</span>
                <span className="font-sans text-sm font-semibold text-accent-orange">4.2 m/s East-Southeast</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-sage-muted/80 leading-normal border-t border-graphite-border/60">
              * Based on ISRO Bhuvan land-use classification and CPCB ambient monitoring corridors in eastern Mumbai.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

