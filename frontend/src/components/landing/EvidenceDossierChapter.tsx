'use client';

import React from 'react';
import { DossierShieldIcon } from '@/components/shared/CustomIcons';

export default function EvidenceDossierChapter() {
  return (
    <section
      id="chapter-dossier"
      className="relative w-full py-28 bg-forest-charcoal border-t border-graphite-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="font-mono text-xs text-accent-orange font-bold tracking-widest uppercase">
            06 // Evidence Synthesis
          </span>
          <div className="h-px w-12 bg-graphite-border" />
          <span className="font-mono text-xs text-sage-muted tracking-wider uppercase">
            Four-Quadrant Legal Dossier Structure
          </span>
        </div>

        {/* Editorial Heading */}
        <div className="max-w-3xl space-y-4 mb-14">
          <h2 className="font-serif text-3xl sm:text-5xl text-ivory-warm leading-tight font-normal">
            A transparent separation of observed, modeled and simulated facts.
          </h2>
          <p className="text-base sm:text-lg text-ivory-warm/80 font-light leading-relaxed">
            Legal defensibility requires strict data provenance. Every generated investigation report categorizes evidence into four non-overlapping quadrants, preventing model outputs or unverified complaints from masquerading as physical ground truth.
          </p>
        </div>

        {/* Four-Quadrant Dossier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Quadrant 1: Directly Observed Evidence */}
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-graphite-border">
              <span className="font-mono text-xs text-accent-green font-bold uppercase tracking-wider">
                Quadrant 01 // Ground Truth
              </span>
              <span className="font-mono text-[10px] text-sage-muted border border-sage-muted/40 px-1.5 py-0.5">
                Physical Sensor
              </span>
            </div>
            <h3 className="font-sans text-xl font-bold text-ivory-warm">
              Directly Observed Evidence
            </h3>
            <p className="text-xs text-sage-muted leading-relaxed">
              Calibrated ambient measurements captured by physical monitoring hardware and verified timestamped sensor streams.
            </p>
            <div className="space-y-2 pt-2 border-t border-graphite-border/60 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-graphite-border/40">
                <span className="text-sage-muted">Govandi East CPCB:</span>
                <span className="text-ivory-warm font-bold">PM2.5: 218 µg/m³</span>
              </div>
              <div className="flex justify-between py-1 border-b border-graphite-border/40">
                <span className="text-sage-muted">Chembur Colony Sensor:</span>
                <span className="text-ivory-warm font-bold">AQI: 375 (Very Poor)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sage-muted">Physical Verification:</span>
                <span className="text-accent-green font-bold">Active Sensor Network</span>
              </div>
            </div>
          </div>

          {/* Quadrant 2: Model-Generated Scientific Findings */}
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-graphite-border">
              <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
                Quadrant 02 // Analytical
              </span>
              <span className="font-mono text-[10px] text-sage-muted border border-sage-muted/40 px-1.5 py-0.5">
                Algorithmic
              </span>
            </div>
            <h3 className="font-sans text-xl font-bold text-ivory-warm">
              Model-Generated Findings
            </h3>
            <p className="text-xs text-sage-muted leading-relaxed">
              Scientific inferences derived through mathematical dispersion equations, anomaly detection, and semantic clustering.
            </p>
            <div className="space-y-2 pt-2 border-t border-graphite-border/60 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-graphite-border/40">
                <span className="text-sage-muted">Trajectory Solver:</span>
                <span className="text-ivory-warm font-bold">NOAA HYSPLIT Fallback</span>
              </div>
              <div className="flex justify-between py-1 border-b border-graphite-border/40">
                <span className="text-sage-muted">Anomaly Algorithm:</span>
                <span className="text-ivory-warm font-bold">Isolation Forest (0.84 Score)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sage-muted">Top Candidate Shortlist:</span>
                <span className="text-accent-orange font-bold">Mankhurd & Deonar Yards</span>
              </div>
            </div>
          </div>

          {/* Quadrant 3: Simulated & Synthetic Information */}
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-graphite-border">
              <span className="font-mono text-xs text-sage-muted font-bold uppercase tracking-wider">
                Quadrant 03 // Demonstration
              </span>
              <span className="font-mono text-[10px] text-sage-muted border border-sage-muted/40 px-1.5 py-0.5">
                Synthetic Mode
              </span>
            </div>
            <h3 className="font-sans text-xl font-bold text-ivory-warm">
              Simulated Indicators & Disclaimers
            </h3>
            <p className="text-xs text-sage-muted leading-relaxed">
              Proof-of-concept baselines and simulated data layers clearly disclosed to prevent false evidentiary reliance.
            </p>
            <div className="space-y-2 pt-2 border-t border-graphite-border/60 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-graphite-border/40">
                <span className="text-sage-muted">Meteorological Vectors:</span>
                <span className="text-sage-light">Synthetic Baseline Layer</span>
              </div>
              <div className="flex justify-between py-1 border-b border-graphite-border/40">
                <span className="text-sage-muted">Speciation Matching:</span>
                <span className="text-sage-light">Simulated EPA SPECIATE Profile</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sage-muted">Legal Limitation:</span>
                <span className="text-accent-orange">Decision-Support Only</span>
              </div>
            </div>
          </div>

          {/* Quadrant 4: Unverified Citizen Reports */}
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-graphite-border">
              <span className="font-mono text-xs text-accent-red font-bold uppercase tracking-wider">
                Quadrant 04 // Field Intake
              </span>
              <span className="font-mono text-[10px] text-sage-muted border border-sage-muted/40 px-1.5 py-0.5">
                Subjective
              </span>
            </div>
            <h3 className="font-sans text-xl font-bold text-ivory-warm">
              Unverified Citizen Reports
            </h3>
            <p className="text-xs text-sage-muted leading-relaxed">
              Initial field complaints filed by the public that serve as investigative triggers pending physical field corroboration.
            </p>
            <div className="space-y-2 pt-2 border-t border-graphite-border/60 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-graphite-border/40">
                <span className="text-sage-muted">Report Reference:</span>
                <span className="text-ivory-warm font-bold">INC-2026-0004</span>
              </div>
              <div className="flex justify-between py-1 border-b border-graphite-border/40">
                <span className="text-sage-muted">Description:</span>
                <span className="text-ivory-warm">Heavy smoke & chemical odor</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sage-muted">Evidentiary Status:</span>
                <span className="text-accent-red">Uncorroborated Field Intake</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

