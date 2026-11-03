'use client';

import React from 'react';
import { ScaleBalanceIcon } from '@/components/shared/CustomIcons';

export default function SourceRankingChapter() {
  return (
    <section
      id="chapter-sources"
      className="relative w-full py-28 bg-forest-charcoal border-t border-graphite-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="font-mono text-xs text-accent-orange font-bold tracking-widest uppercase">
            04 // Source Intelligence
          </span>
          <div className="h-px w-12 bg-graphite-border" />
          <span className="font-mono text-xs text-sage-muted tracking-wider uppercase">
            Multi-Criteria Candidate Ranking
          </span>
        </div>

        {/* Editorial Heading */}
        <div className="max-w-3xl space-y-4 mb-14">
          <h2 className="font-serif text-3xl sm:text-5xl text-ivory-warm leading-tight font-normal">
            Shortlisting potential emission sources through explainable evidence synthesis.
          </h2>
          <p className="text-base sm:text-lg text-ivory-warm/80 font-light leading-relaxed">
            The system never declares guilt. It calculates an explainable heuristic score to help environmental inspection squads prioritize physical site inspections.
          </p>
        </div>

        {/* Primary Dominant Result Card */}
        <div className="border border-graphite-border bg-forest-dark p-8 sm:p-12 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Dominant Result: Score and Rank */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-graphite-border pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-mono text-xs text-accent-orange font-bold tracking-widest uppercase">
                  Rank #1 Priority Candidate
                </span>
                <span className="font-mono text-[10px] text-sage-muted border border-sage-muted/40 px-1.5 py-0.5">
                  High Confidence
                </span>
              </div>
              <h3 className="font-sans text-2xl sm:text-3xl font-bold text-ivory-warm leading-tight mt-1">
                Govandi - Mankhurd Scrap Sorting Yards
              </h3>
              <p className="font-mono text-xs text-sage-muted mt-1">
                Category: Industrial / Informal Recycling // 3.42 km Upwind
              </p>

              {/* Dominant Score Display */}
              <div className="mt-6 flex items-baseline space-x-3">
                <span className="font-sans text-6xl sm:text-7xl font-extrabold text-accent-orange leading-none">
                  88.6
                </span>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-sage-muted">/ 100</span>
                  <span className="font-mono text-[10px] text-sage-muted uppercase">Evidence Score</span>
                </div>
              </div>
            </div>

            {/* Compact Supporting Evidence Sub-Scores */}
            <div className="lg:col-span-8 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="border border-graphite-border/60 p-3 bg-forest-charcoal">
                  <span className="font-mono text-[10px] text-sage-muted uppercase block">Wind Alignment</span>
                  <span className="font-mono text-lg font-bold text-ivory-warm mt-0.5 block">92.4%</span>
                  <span className="font-mono text-[10px] text-sage-muted">Direct Upwind Plume</span>
                </div>
                <div className="border border-graphite-border/60 p-3 bg-forest-charcoal">
                  <span className="font-mono text-[10px] text-sage-muted uppercase block">Corridor Anomaly</span>
                  <span className="font-mono text-lg font-bold text-accent-red mt-0.5 block">84.0%</span>
                  <span className="font-mono text-[10px] text-sage-muted">Spike at Govandi Station</span>
                </div>
                <div className="border border-graphite-border/60 p-3 bg-forest-charcoal">
                  <span className="font-mono text-[10px] text-sage-muted uppercase block">Complaint Density</span>
                  <span className="font-mono text-lg font-bold text-ivory-warm mt-0.5 block">86.5%</span>
                  <span className="font-mono text-[10px] text-sage-muted">6 Cluster Reports</span>
                </div>
                <div className="border border-graphite-border/60 p-3 bg-forest-charcoal">
                  <span className="font-mono text-[10px] text-sage-muted uppercase block">Land-Use Risk</span>
                  <span className="font-mono text-lg font-bold text-ivory-warm mt-0.5 block">85.0%</span>
                  <span className="font-mono text-[10px] text-sage-muted">ISRO Bhuvan Industrial</span>
                </div>
                <div className="border border-graphite-border/60 p-3 bg-forest-charcoal">
                  <span className="font-mono text-[10px] text-sage-muted uppercase block">Chemical Match</span>
                  <span className="font-mono text-lg font-bold text-accent-orange mt-0.5 block">86.8%</span>
                  <span className="font-mono text-[10px] text-sage-muted">EPA SPECIATE Profile</span>
                </div>
                <div className="border border-graphite-border/60 p-3 bg-forest-charcoal">
                  <span className="font-mono text-[10px] text-sage-muted uppercase block">Transit Time</span>
                  <span className="font-mono text-lg font-bold text-ivory-warm mt-0.5 block">28 min</span>
                  <span className="font-mono text-[10px] text-sage-muted">Estimated Dispersion</span>
                </div>
              </div>

              <div className="p-3 bg-graphite-deep border-l-2 border-accent-orange text-xs text-sage-muted font-mono leading-relaxed">
                Shortlist Reasoning: Candidate exhibits direct upwind trajectory alignment; multiple citizen filings cite recurring polymer waste burning; ambient corridor stations recorded simultaneous particulate spikes.
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Candidate Comparison (Compact Row) */}
        <div className="border border-graphite-border/80 bg-graphite-deep p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] text-sage-muted uppercase tracking-wider">
                Rank #2 Candidate
              </span>
              <span className="font-mono text-[10px] text-sage-muted">High Confidence</span>
            </div>
            <h4 className="font-sans text-lg font-bold text-ivory-warm">
              Deonar Solid Waste Landfill Ground
            </h4>
            <p className="font-mono text-xs text-sage-muted">
              Municipal Waste Disposal Facility // 4.10 km Upwind // Score: 87.2 / 100
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono">
            <div>
              <span className="text-sage-muted block">Wind Alignment</span>
              <span className="text-ivory-warm font-bold">89.1%</span>
            </div>
            <div>
              <span className="text-sage-muted block">Chemical Match</span>
              <span className="text-ivory-warm font-bold">88.4%</span>
            </div>
            <div className="border-l border-graphite-border pl-4">
              <span className="text-accent-orange font-bold text-xl">87.2</span>
              <span className="text-sage-muted text-[10px] block">Rank #2</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

