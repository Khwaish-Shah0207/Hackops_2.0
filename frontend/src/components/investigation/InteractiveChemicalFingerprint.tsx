'use client';

import React, { useState } from 'react';

export interface ChemicalConstituent {
  id: string;
  name: string;
  formula: string;
  fraction_pct: number;
  significance: string;
  color: string;
  measured_value?: string;
  reference_value?: string;
}

interface InteractiveChemicalFingerprintProps {
  chemicalSpeciation: {
    primary_profile_match: string;
    similarity_pct: number;
    data_source: string;
    constituents: ChemicalConstituent[];
  };
}

// Geometric orbital positions for concentric rings and interactive hotspots
const RING_GEOMETRY: Record<
  string,
  {
    radius: number;
    dash: string;
    rotation: number;
    hotspotX: number;
    hotspotY: number;
    dx: number;
    dy: number;
    anchor: 'start' | 'end' | 'middle';
  }
> = {
  sulphates: {
    radius: 165,
    dash: '280 40',
    rotation: 0,
    hotspotX: 343,
    hotspotY: 118,
    dx: 10,
    dy: -2,
    anchor: 'start',
  },
  nitrates: {
    radius: 135,
    dash: '210 60',
    rotation: 45,
    hotspotX: 295,
    hotspotY: 295,
    dx: 8,
    dy: 10,
    anchor: 'start',
  },
  organic_carbon: {
    radius: 105,
    dash: '160 50',
    rotation: 90,
    hotspotX: 126,
    hotspotY: 274,
    dx: -8,
    dy: 10,
    anchor: 'end',
  },
  elemental_carbon: {
    radius: 75,
    dash: '120 40',
    rotation: 135,
    hotspotX: 143,
    hotspotY: 152,
    dx: -8,
    dy: -4,
    anchor: 'end',
  },
  trace_metals: {
    radius: 56,
    dash: '90 30',
    rotation: 180,
    hotspotX: 215,
    hotspotY: 254,
    dx: 8,
    dy: 10,
    anchor: 'start',
  },
  // Fallbacks for alternative IDs
  particulate_carbon: {
    radius: 105,
    dash: '160 50',
    rotation: 90,
    hotspotX: 126,
    hotspotY: 274,
    dx: -8,
    dy: 10,
    anchor: 'end',
  },
  voc_fraction: {
    radius: 135,
    dash: '210 60',
    rotation: 45,
    hotspotX: 295,
    hotspotY: 295,
    dx: 8,
    dy: 10,
    anchor: 'start',
  },
  pah_fraction: {
    radius: 165,
    dash: '280 40',
    rotation: 0,
    hotspotX: 343,
    hotspotY: 118,
    dx: 10,
    dy: -2,
    anchor: 'start',
  },
  chloride_ratio: {
    radius: 75,
    dash: '120 40',
    rotation: 135,
    hotspotX: 143,
    hotspotY: 152,
    dx: -8,
    dy: -4,
    anchor: 'end',
  },
  heavy_metals: {
    radius: 56,
    dash: '90 30',
    rotation: 180,
    hotspotX: 215,
    hotspotY: 254,
    dx: 8,
    dy: 10,
    anchor: 'start',
  },
  sulfates: {
    radius: 165,
    dash: '280 40',
    rotation: 0,
    hotspotX: 343,
    hotspotY: 118,
    dx: 10,
    dy: -2,
    anchor: 'start',
  },
};

export function InteractiveChemicalFingerprint({
  chemicalSpeciation,
}: InteractiveChemicalFingerprintProps) {
  const [selectedConstituentId, setSelectedConstituentId] = useState<string>(
    chemicalSpeciation.constituents[0]?.id || 'sulphates'
  );

  const selectedConstituent =
    chemicalSpeciation.constituents.find((c) => c.id === selectedConstituentId) ||
    chemicalSpeciation.constituents[0];

  return (
    <div className="bg-[#14251F] border border-[#A8B5A5]/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between pb-6 mb-6 border-b border-[#A8B5A5]/15 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#667B70]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#667B70]">
              Particulate Speciation &amp; Mass Balance Matrix
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif text-[#EAE8DF]">
            Chemical Fingerprint &amp; Mass Apportionment
          </h2>
          <p className="text-xs text-[#A8B5A5] mt-1 font-mono">
            {chemicalSpeciation.data_source}
          </p>
        </div>

        <div className="bg-[#252C28] border border-[#C77B43]/40 p-3 self-start md:self-auto text-right">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#A8B5A5]">
            Best Statistical Profile Match
          </div>
          <div className="text-sm font-serif font-bold text-[#EAE8DF] mt-0.5">
            {chemicalSpeciation.primary_profile_match}
          </div>
          <div className="flex items-center justify-end gap-2 mt-1">
            <span className="text-xs font-mono text-[#A8B5A5]">Speciation Similarity:</span>
            <span className="text-sm font-mono font-bold text-[#C77B43]">
              {chemicalSpeciation.similarity_pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#A8B5A5]/15 bg-[#1B201D] p-6 sm:p-8 mb-6">
        {/* SVG Concentric Circles Visualizer with Central Image & Clickable Hotspots */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Circular Mask for the Central Image */}
                <clipPath id="investigation-central-frame">
                  <circle cx="200" cy="200" r="48" />
                </clipPath>
              </defs>

              {/* Background Reticle and Axes */}
              <circle cx="200" cy="200" r="185" stroke="#252C28" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="200" cy="200" r="145" stroke="#252C28" strokeWidth="1" />
              <circle cx="200" cy="200" r="105" stroke="#252C28" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="200" cy="200" r="65" stroke="#252C28" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="200" y1="10" x2="200" y2="390" stroke="#252C28" strokeWidth="1" />
              <line x1="10" y1="200" x2="390" y2="200" stroke="#252C28" strokeWidth="1" />

              {/* Central Reference Image fitted neatly into the circular frame */}
              <image
                href="/chemical-fingerprint-ref.jpg"
                x="152"
                y="152"
                width="96"
                height="96"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#investigation-central-frame)"
              />

              {/* Circular frame border around central image */}
              <circle
                cx="200"
                cy="200"
                r="48"
                fill="none"
                stroke="#A8B5A5"
                strokeWidth="1.5"
                strokeOpacity="0.8"
              />

              {/* Center reticle HUD overlay */}
              <circle cx="200" cy="200" r="3" fill="#C77B43" />
              <circle cx="200" cy="200" r="7" fill="none" stroke="#C77B43" strokeWidth="0.75" strokeOpacity="0.7" strokeDasharray="2 2" />

              {/* Concentric Circles for each constituent */}
              {chemicalSpeciation.constituents.map((c, idx) => {
                const geom = RING_GEOMETRY[c.id] || {
                  radius: 60 + idx * 25,
                  dash: '200 50',
                  rotation: idx * 45,
                  hotspotX: 200 + (60 + idx * 25) * 0.7,
                  hotspotY: 200 - (60 + idx * 25) * 0.7,
                  dx: 8,
                  dy: 0,
                  anchor: 'start' as const,
                };
                const isSelected = c.id === selectedConstituentId;

                return (
                  <circle
                    key={`ring-${c.id}`}
                    cx="200"
                    cy="200"
                    r={geom.radius}
                    stroke={isSelected ? c.color : '#3D4741'}
                    strokeWidth={isSelected ? '10' : '5'}
                    strokeDasharray={geom.dash}
                    transform={`rotate(${geom.rotation} 200 200)`}
                    className="cursor-pointer transition-all duration-300 hover:opacity-100"
                    onClick={() => setSelectedConstituentId(c.id)}
                  />
                );
              })}

              {/* Clickable Hotspot Nodes on the Concentric Circles */}
              {chemicalSpeciation.constituents.map((c, idx) => {
                const geom = RING_GEOMETRY[c.id] || {
                  radius: 60 + idx * 25,
                  dash: '200 50',
                  rotation: idx * 45,
                  hotspotX: 200 + (60 + idx * 25) * 0.7,
                  hotspotY: 200 - (60 + idx * 25) * 0.7,
                  dx: 8,
                  dy: 0,
                  anchor: 'start' as const,
                };
                const isSelected = c.id === selectedConstituentId;

                return (
                  <g
                    key={`hotspot-${c.id}`}
                    className="cursor-pointer"
                    onClick={() => setSelectedConstituentId(c.id)}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Transparent tap area */}
                    <circle cx={geom.hotspotX} cy={geom.hotspotY} r="16" fill="transparent" />

                    {/* Selection Ring */}
                    {isSelected && (
                      <circle
                        cx={geom.hotspotX}
                        cy={geom.hotspotY}
                        r="11"
                        fill="none"
                        stroke={c.color}
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        opacity="0.85"
                      />
                    )}

                    {/* Outer Node */}
                    <circle
                      cx={geom.hotspotX}
                      cy={geom.hotspotY}
                      r={isSelected ? 6.5 : 4.5}
                      fill="#14251F"
                      stroke={c.color}
                      strokeWidth={isSelected ? 2 : 1.25}
                      className="transition-all duration-200"
                    />

                    {/* Inner Solid Node */}
                    <circle
                      cx={geom.hotspotX}
                      cy={geom.hotspotY}
                      r={isSelected ? 3.5 : 2}
                      fill={c.color}
                      className="transition-all duration-200"
                    />

                    {/* Tag */}
                    <text
                      x={geom.hotspotX + geom.dx}
                      y={geom.hotspotY + geom.dy}
                      fill={isSelected ? '#EAE8DF' : '#A8B5A5'}
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor={geom.anchor}
                      className="pointer-events-none select-none transition-colors"
                    >
                      {c.formula} ({c.fraction_pct}%)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] font-mono text-[#A8B5A5] mt-3">
            Click concentric rings or hotspot points to inspect element forensics
          </div>
        </div>

        {/* Selected Constituent Details */}
        <div className="lg:col-span-6 bg-[#252C28] border border-[#A8B5A5]/25 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#A8B5A5]/15">
            <div className="flex items-center gap-3">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/40"
                style={{ backgroundColor: selectedConstituent.color }}
              />
              <div>
                <h3 className="text-base font-serif font-bold text-[#EAE8DF]">
                  {selectedConstituent.name}
                </h3>
                <div className="text-[11px] font-mono text-[#A8B5A5]">
                  Formula: <span className="text-[#C77B43] font-bold">{selectedConstituent.formula}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#A8B5A5] uppercase block font-mono">Mass Fraction</span>
              <span className="text-xl font-bold font-mono text-[#C77B43]">
                {selectedConstituent.fraction_pct}%
              </span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-[10px] uppercase text-[#A8B5A5] block mb-1">
                Diagnostic Forensic Significance:
              </span>
              <p className="text-[#EAE8DF] leading-relaxed bg-[#14251F] border border-[#A8B5A5]/15 p-3">
                {selectedConstituent.significance}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-[#14251F] border border-[#A8B5A5]/15">
                <span className="text-[10px] uppercase text-[#A8B5A5] block">
                  Atmospheric Persistence
                </span>
                <span className="text-[#EAE8DF] text-[11px] font-medium">
                  {selectedConstituent.id === 'sulphates' || selectedConstituent.id === 'sulfates'
                    ? '3 to 5 days (regional transport)'
                    : selectedConstituent.id === 'nitrates'
                    ? '1 to 2 days (photochemical)'
                    : selectedConstituent.id === 'organic_carbon' || selectedConstituent.id === 'particulate_carbon'
                    ? '4 to 7 days (submicron carrier)'
                    : selectedConstituent.id === 'elemental_carbon'
                    ? '6 to 10 days (sooty core)'
                    : '48 to 72 hours (settling)'}
                </span>
              </div>

              <div className="p-2.5 bg-[#14251F] border border-[#A8B5A5]/15">
                <span className="text-[10px] uppercase text-[#A8B5A5] block">
                  Fingerprint Weight
                </span>
                <span className="text-[#C77B43] text-[11px] font-medium">
                  {selectedConstituent.id === 'elemental_carbon' ||
                  selectedConstituent.id === 'trace_metals' ||
                  selectedConstituent.id === 'heavy_metals'
                    ? 'High Specificity (Direct refuse/scrap marker)'
                    : 'Corroborative (Combustion indicator)'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Switch Selector Tabs */}
          <div className="space-y-1.5 border-t border-[#A8B5A5]/15 pt-3">
            <span className="font-mono text-[10px] text-[#A8B5A5] uppercase tracking-wider block">
              Quick Select Constituent:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {chemicalSpeciation.constituents.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedConstituentId(c.id)}
                  className={`font-mono text-[11px] px-2 py-0.5 border transition-colors ${
                    selectedConstituentId === c.id
                      ? 'border-[#C77B43] bg-[#14251F] text-[#EAE8DF] font-bold'
                      : 'border-[#A8B5A5]/25 text-[#A8B5A5] hover:border-[#A8B5A5]/50'
                  }`}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 mr-1 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.formula} ({c.fraction_pct}%)
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Limitation & Attribution Notice */}
      <div className="bg-[#1B201D] border border-[#A8B5A5]/15 p-3 text-[11px] font-mono text-[#A8B5A5] flex items-start gap-3">
        <svg
          className="w-4 h-4 text-[#C77B43] shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="leading-relaxed">
          <strong className="text-[#EAE8DF]">Methodological Note: </strong>
          Particulate speciation is an analytical attribution heuristic computed via Chemical Mass
          Balance (EPA CMB 8.2 compatible). Atmospheric mixing, secondary condensation, and ambient
          humidity cause variations. Receptor signatures guide on-site inspection priorities and do
          not constitute single-source definitive legal liability without physical stack audit.
        </p>
      </div>
    </div>
  );
}
