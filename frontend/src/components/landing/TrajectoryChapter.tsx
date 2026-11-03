'use client';

import React from 'react';
import { WindVectorIcon, CrosshairIcon } from '@/components/shared/CustomIcons';

export default function TrajectoryChapter() {
  return (
    <section
      id="chapter-trajectory"
      className="relative w-full py-28 bg-graphite-deep border-t border-graphite-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="font-mono text-xs text-accent-orange font-bold tracking-widest uppercase">
            03 // Atmospheric Physics
          </span>
          <div className="h-px w-12 bg-graphite-border" />
          <span className="font-mono text-xs text-sage-muted tracking-wider uppercase">
            Lagrangian Backward Plume Trajectory
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Scientific Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl text-ivory-warm leading-tight font-normal">
              Calculating where the air came from before it reached the complainant.
            </h2>
            <p className="text-base text-ivory-warm/80 font-light leading-relaxed">
              Air pollution does not linger where it is breathed. Using meteorological vector data, the investigation engine projects a Lagrangian backward trajectory upwind over 3 hours.
            </p>
            <p className="text-sm text-sage-muted leading-relaxed">
              Every coordinate along the calculated transport vector is checked against CPCB ambient monitoring stations and ISRO Bhuvan land-use polygons to identify anomalies and high-propensity emission candidates.
            </p>

            <div className="border border-graphite-border bg-forest-charcoal p-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-sage-muted">
                <WindVectorIcon className="w-4 h-4 text-accent-orange" />
                <span className="uppercase tracking-wider">Active Vector Computation</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-graphite-border/60">
                <div>
                  <span className="font-mono text-[10px] text-sage-muted block uppercase">Wind Origin</span>
                  <span className="font-mono text-base font-bold text-ivory-warm mt-0.5 block">108° ESE</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-sage-muted block uppercase">Velocity</span>
                  <span className="font-mono text-base font-bold text-accent-orange mt-0.5 block">4.2 m/s</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-sage-muted block uppercase">Transit Time</span>
                  <span className="font-mono text-base font-bold text-ivory-warm mt-0.5 block">35 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Scientific Trajectory Visualizer */}
          <div className="lg:col-span-7 border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-graphite-border">
              <div className="flex items-center space-x-2">
                <CrosshairIcon className="w-4 h-4 text-accent-orange" />
                <span className="font-mono text-xs text-ivory-warm uppercase tracking-wider">
                  Backward Vector Path // Chembur to Deonar Corridor
                </span>
              </div>
              <span className="font-mono text-[10px] text-sage-light border border-sage-muted/40 px-2 py-0.5">
                NOAA HYSPLIT Format
              </span>
            </div>

            {/* Custom Scientific Vector Diagram (SVG) */}
            <div className="relative w-full h-64 sm:h-80 bg-forest-charcoal/90 border border-graphite-border/80 flex items-center justify-center p-4">
              <svg
                viewBox="0 0 600 280"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Grid Lines */}
                <line x1="50" y1="40" x2="550" y2="40" stroke="#252C28" strokeDasharray="4 4" />
                <line x1="50" y1="100" x2="550" y2="100" stroke="#252C28" strokeDasharray="4 4" />
                <line x1="50" y1="160" x2="550" y2="160" stroke="#252C28" strokeDasharray="4 4" />
                <line x1="50" y1="220" x2="550" y2="220" stroke="#252C28" strokeDasharray="4 4" />

                <line x1="100" y1="20" x2="100" y2="260" stroke="#252C28" strokeDasharray="4 4" />
                <line x1="220" y1="20" x2="220" y2="260" stroke="#252C28" strokeDasharray="4 4" />
                <line x1="360" y1="20" x2="360" y2="260" stroke="#252C28" strokeDasharray="4 4" />
                <line x1="480" y1="20" x2="480" y2="260" stroke="#252C28" strokeDasharray="4 4" />

                {/* Plume Dispersion Cone */}
                <path
                  d="M120 170 L480 80 L480 180 Z"
                  fill="#C77B43"
                  fillOpacity="0.08"
                />

                {/* Trajectory Main Vector */}
                <path
                  d="M120 170 Q280 150 480 120"
                  stroke="#C77B43"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                />

                {/* Point A: Complaint Site */}
                <circle cx="120" cy="170" r="6" fill="#14251F" stroke="#EAE8DF" strokeWidth="2" />
                <circle cx="120" cy="170" r="14" stroke="#EAE8DF" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x="100" y="210" fill="#EAE8DF" fontSize="11" fontFamily="monospace">
                  REGION A: CHEMBUR
                </text>
                <text x="100" y="225" fill="#A8B5A5" fontSize="9" fontFamily="monospace">
                  19.0580° N [Complaint Pin]
                </text>

                {/* Point B: Intermediate Sensor Anomaly Station */}
                <circle cx="280" cy="148" r="5" fill="#B65348" stroke="#EAE8DF" strokeWidth="1.5" />
                <text x="240" y="125" fill="#B65348" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  GOVANDI SENSOR
                </text>
                <text x="240" y="138" fill="#A8B5A5" fontSize="8" fontFamily="monospace">
                  PM2.5: 218 µg/m³ [Anomaly Spike]
                </text>

                {/* Point C: Suspected Candidate Origin */}
                <rect x="470" y="110" width="20" height="20" fill="#14251F" stroke="#C77B43" strokeWidth="2" />
                <text x="440" y="80" fill="#EAE8DF" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  REGION B: DEONAR / MANKHURD
                </text>
                <text x="440" y="95" fill="#C77B43" fontSize="9" fontFamily="monospace">
                  Upwind Origin (35 min transit)
                </text>

                {/* Wind Vector Compass Arrow */}
                <g transform="translate(520, 220)">
                  <circle cx="0" cy="0" r="18" stroke="#3D4741" strokeWidth="1" />
                  <line x1="-12" y1="8" x2="12" y2="-8" stroke="#C77B43" strokeWidth="2" />
                  <polygon points="12,-8 6,-9 9,-4" fill="#C77B43" />
                  <text x="-16" y="28" fill="#A8B5A5" fontSize="8" fontFamily="monospace">
                    108° ESE
                  </text>
                </g>
              </svg>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2 border-t border-graphite-border/60 text-xs font-mono text-sage-muted">
              <span>Backward projection model: Lagrangian Particle Dispersion Fallback</span>
              <span className="text-ivory-warm">Confidence: 94.2% trajectory alignment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

