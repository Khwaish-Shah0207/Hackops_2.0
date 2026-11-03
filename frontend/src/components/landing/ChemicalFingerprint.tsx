'use client';

import React, { useState } from 'react';
import { SpectraIcon } from '@/components/shared/CustomIcons';

export interface ChemicalConstituent {
  id: string;
  name: string;
  formula: string;
  fractionPct: number;
  epaProfile: string;
  description: string;
  color: string;
  ringRadius: number;
  hotspotX: number;
  hotspotY: number;
  labelAnchor: 'start' | 'end' | 'middle';
  labelDx: number;
  labelDy: number;
}

export const CONSTITUENTS: ChemicalConstituent[] = [
  {
    id: 'sulphates',
    name: 'SULPHATE (SO₄²⁻)',
    formula: 'SO₄²⁻',
    fractionPct: 32,
    epaProfile: 'EPA SPECIATE Profile 8402',
    description: 'Secondary inorganic aerosol indicative of heavy fuel oil combustion, refinery emissions, and sulfur-bearing waste incineration.',
    color: '#C77B43',
    ringRadius: 165,
    hotspotX: 343,
    hotspotY: 118,
    labelAnchor: 'start',
    labelDx: 10,
    labelDy: -2,
  },
  {
    id: 'nitrates',
    name: 'NITRATE (NO₃⁻)',
    formula: 'NO₃⁻',
    fractionPct: 24,
    epaProfile: 'EPA SPECIATE Profile 8402',
    description: 'High-temperature thermal oxidation marker associated with industrial boilers, diesel exhaust, and sustained smoldering combustion.',
    color: '#A8B5A5',
    ringRadius: 135,
    hotspotX: 295,
    hotspotY: 295,
    labelAnchor: 'start',
    labelDx: 8,
    labelDy: 10,
  },
  {
    id: 'organic_carbon',
    name: 'ORGANIC CARBON (OC)',
    formula: 'OC',
    fractionPct: 18,
    epaProfile: 'EPA SPECIATE Profile 8402',
    description: 'Primary particulate phase fraction from incomplete municipal refuse, landfill fires, and open biomass combustion.',
    color: '#667B70',
    ringRadius: 105,
    hotspotX: 126,
    hotspotY: 274,
    labelAnchor: 'end',
    labelDx: -8,
    labelDy: 10,
  },
  {
    id: 'elemental_carbon',
    name: 'ELEMENTAL CARBON (EC)',
    formula: 'EC',
    fractionPct: 14,
    epaProfile: 'EPA SPECIATE Profile 8402',
    description: 'Black carbon particulate matrix resulting from low-temperature oxygen-deficient smoldering of synthetic polymers and tires.',
    color: '#B65348',
    ringRadius: 75,
    hotspotX: 143,
    hotspotY: 152,
    labelAnchor: 'end',
    labelDx: -8,
    labelDy: -4,
  },
  {
    id: 'trace_metals',
    name: 'HEAVY METALS & CHLORIDE',
    formula: 'Pb/Zn/Cl⁻',
    fractionPct: 12,
    epaProfile: 'EPA SPECIATE Profile 8402',
    description: 'Zinc, Lead, and chloride tracers characteristic of informal electronic scrap reclamation, cable insulation burning, and PVC degradation.',
    color: '#EAE8DF',
    ringRadius: 56,
    hotspotX: 215,
    hotspotY: 254,
    labelAnchor: 'start',
    labelDx: 8,
    labelDy: 10,
  },
];

export default function ChemicalFingerprint() {
  const [selectedId, setSelectedId] = useState<string>('sulphates');
  const active = CONSTITUENTS.find((c) => c.id === selectedId) || CONSTITUENTS[0];

  return (
    <section
      id="chapter-fingerprint"
      className="relative w-full py-28 bg-graphite-deep border-t border-graphite-border scroll-mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="font-mono text-xs text-accent-orange font-bold tracking-widest uppercase">
            05 // Receptor Speciation
          </span>
          <div className="h-px w-12 bg-graphite-border" />
          <span className="font-mono text-xs text-sage-muted tracking-wider uppercase">
            Chemical Fingerprint Matrix
          </span>
        </div>

        {/* Narrative Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl text-ivory-warm leading-tight font-normal">
              Particulate chemical composition reveals source signatures.
            </h2>
            <p className="text-base text-ivory-warm/80 font-light leading-relaxed">
              Different combustion processes leave distinct chemical fingerprints. By cross-referencing receptor speciation against the EPA SPECIATE library, the platform evaluates whether downwind air matches municipal waste burning, vehicular exhaust, or industrial synthesis.
            </p>
          </div>
          <div className="lg:col-span-6 border-l border-graphite-border pl-6 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-accent-orange">
              <SpectraIcon className="w-4 h-4" />
              <span>Interactive Speciation Analysis</span>
            </div>
            <p className="text-xs text-sage-muted font-mono leading-relaxed">
              Select any orbital spectral ring or hotspot node to inspect the corresponding chemical constituent, mass ratio, and reference library correlation.
            </p>
          </div>
        </div>

        {/* Interactive Speciation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-graphite-border bg-forest-charcoal p-6 sm:p-10">
          {/* Custom SVG Speciation Fingerprint Visualizer with Central Image & Hotspots */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Circular Mask for the Central Image */}
                  <clipPath id="central-circular-frame">
                    <circle cx="200" cy="200" r="48" />
                  </clipPath>
                </defs>

                {/* Background Reticle and Axes */}
                <circle cx="200" cy="200" r="185" stroke="#252C28" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="200" cy="200" r="145" stroke="#252C28" strokeWidth="1" />
                <circle cx="200" cy="200" r="105" stroke="#252C28" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="200" cy="200" r="65" stroke="#252C28" strokeWidth="1" />
                <line x1="200" y1="10" x2="200" y2="390" stroke="#252C28" strokeWidth="1" />
                <line x1="10" y1="200" x2="390" y2="200" stroke="#252C28" strokeWidth="1" />

                {/* Central Reference Image fitted neatly into the central circular frame */}
                <image
                  href="/chemical-fingerprint-ref.jpg"
                  x="152"
                  y="152"
                  width="96"
                  height="96"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#central-circular-frame)"
                />

                {/* Frame border around the central image */}
                <circle
                  cx="200"
                  cy="200"
                  r="48"
                  fill="none"
                  stroke="#A8B5A5"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                />

                {/* Concentric Circles (Original Arrangement & Styling) */}
                {/* Ring 1: Sulphate (Outer, r=165) */}
                <circle
                  cx="200"
                  cy="200"
                  r="165"
                  stroke={selectedId === 'sulphates' ? '#C77B43' : '#3D4741'}
                  strokeWidth={selectedId === 'sulphates' ? '10' : '5'}
                  strokeDasharray="280 40"
                  className="cursor-pointer transition-all duration-300 hover:stroke-accent-orange"
                  onClick={() => setSelectedId('sulphates')}
                />

                {/* Ring 2: Nitrate (r=135) */}
                <circle
                  cx="200"
                  cy="200"
                  r="135"
                  stroke={selectedId === 'nitrates' ? '#A8B5A5' : '#3D4741'}
                  strokeWidth={selectedId === 'nitrates' ? '10' : '5'}
                  strokeDasharray="210 60"
                  transform="rotate(45 200 200)"
                  className="cursor-pointer transition-all duration-300 hover:stroke-sage-muted"
                  onClick={() => setSelectedId('nitrates')}
                />

                {/* Ring 3: Organic Carbon (r=105) */}
                <circle
                  cx="200"
                  cy="200"
                  r="105"
                  stroke={selectedId === 'organic_carbon' ? '#667B70' : '#3D4741'}
                  strokeWidth={selectedId === 'organic_carbon' ? '10' : '5'}
                  strokeDasharray="160 50"
                  transform="rotate(90 200 200)"
                  className="cursor-pointer transition-all duration-300 hover:stroke-accent-green"
                  onClick={() => setSelectedId('organic_carbon')}
                />

                {/* Ring 4: Elemental Carbon (r=75) */}
                <circle
                  cx="200"
                  cy="200"
                  r="75"
                  stroke={selectedId === 'elemental_carbon' ? '#B65348' : '#3D4741'}
                  strokeWidth={selectedId === 'elemental_carbon' ? '10' : '5'}
                  strokeDasharray="120 40"
                  transform="rotate(135 200 200)"
                  className="cursor-pointer transition-all duration-300 hover:stroke-accent-red"
                  onClick={() => setSelectedId('elemental_carbon')}
                />

                {/* Core / Trace Metals Ring (r=56) */}
                <circle
                  cx="200"
                  cy="200"
                  r="56"
                  stroke={selectedId === 'trace_metals' ? '#EAE8DF' : '#3D4741'}
                  strokeWidth={selectedId === 'trace_metals' ? '8' : '4'}
                  strokeDasharray="90 30"
                  transform="rotate(180 200 200)"
                  className="cursor-pointer transition-all duration-300 hover:stroke-ivory-warm"
                  onClick={() => setSelectedId('trace_metals')}
                />

                {/* Center Reticle Point overlay on image */}
                <circle cx="200" cy="200" r="3" fill="#C77B43" />
                <circle cx="200" cy="200" r="7" fill="none" stroke="#C77B43" strokeWidth="0.75" strokeOpacity="0.7" strokeDasharray="2 2" />

                {/* Interactive Hotspot Nodes on Concentric Rings */}
                {CONSTITUENTS.map((c) => {
                  const isSelected = c.id === selectedId;
                  return (
                    <g
                      key={c.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedId(c.id)}
                      role="button"
                      tabIndex={0}
                    >
                      {/* Oversized transparent hit target for easy tapping */}
                      <circle cx={c.hotspotX} cy={c.hotspotY} r="16" fill="transparent" />

                      {/* Selection Pulse Ring */}
                      {isSelected && (
                        <circle
                          cx={c.hotspotX}
                          cy={c.hotspotY}
                          r="11"
                          fill="none"
                          stroke={c.color}
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                          opacity="0.85"
                        />
                      )}

                      {/* Outer Ring */}
                      <circle
                        cx={c.hotspotX}
                        cy={c.hotspotY}
                        r={isSelected ? 6.5 : 4.5}
                        fill="#14251F"
                        stroke={c.color}
                        strokeWidth={isSelected ? 2 : 1.25}
                        className="transition-all duration-200"
                      />

                      {/* Inner Solid Core Bead */}
                      <circle
                        cx={c.hotspotX}
                        cy={c.hotspotY}
                        r={isSelected ? 3.5 : 2}
                        fill={c.color}
                        className="transition-all duration-200"
                      />

                      {/* Formula & Mass Label */}
                      <text
                        x={c.hotspotX + c.labelDx}
                        y={c.hotspotY + c.labelDy}
                        fill={isSelected ? '#EAE8DF' : '#A8B5A5'}
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        textAnchor={c.labelAnchor}
                        className="pointer-events-none select-none transition-colors"
                      >
                        {c.formula} ({c.fractionPct}%)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="text-[11px] font-mono text-sage-muted mt-3">
              Click ring segments or hotspot nodes to inspect chemical constituents
            </div>
          </div>

          {/* Selected Chemical Constituent Detail Panel */}
          <div className="lg:col-span-5 border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-graphite-border">
              <span className="font-mono text-xs text-sage-muted uppercase tracking-wider">
                Receptor Fraction
              </span>
              <span className="font-mono text-xs text-accent-orange font-bold">
                {active.epaProfile}
              </span>
            </div>

            {/* Dominant Display of Selected Constituent */}
            <div className="space-y-1">
              <h3 className="font-sans text-2xl font-extrabold text-ivory-warm">
                {active.name}
              </h3>
              <div className="flex items-baseline space-x-2">
                <span className="font-sans text-5xl font-extrabold text-accent-orange">
                  {active.fractionPct}%
                </span>
                <span className="font-mono text-xs text-sage-muted">of total PM2.5 mass</span>
              </div>
            </div>

            <p className="text-sm text-ivory-warm/80 font-light leading-relaxed border-t border-graphite-border/60 pt-4">
              {active.description}
            </p>

            {/* Quick Switch Selector Tabs */}
            <div className="space-y-2 border-t border-graphite-border/60 pt-4">
              <span className="font-mono text-[10px] text-sage-muted uppercase tracking-wider block">
                Constituent Selector
              </span>
              <div className="flex flex-wrap gap-2">
                {CONSTITUENTS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`font-mono text-xs px-2.5 py-1 border transition-colors ${
                      selectedId === c.id
                        ? 'border-accent-orange bg-forest-charcoal text-ivory-warm font-bold'
                        : 'border-graphite-border text-sage-muted hover:border-sage-muted'
                    }`}
                  >
                    {c.formula} ({c.fractionPct}%)
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-graphite-deep p-3 text-[10px] font-mono text-sage-muted border-l-2 border-accent-orange">
              * Regulatory Clarification: Illustrative speciation shown for receptor correlation. Chemical speciation informs mass-balance candidate matching; field sampling is required for regulatory enforcement.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
