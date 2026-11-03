'use client';

import React, { useState } from 'react';

export interface TimelineEvent {
  step: number;
  stage_name: string;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
  summary: string;
  details: string;
  authority?: string;
}

interface InvestigationTimelineProps {
  timeline: TimelineEvent[];
}

export function InvestigationTimeline({ timeline }: InvestigationTimelineProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(6); // Default active stage expanded

  const toggleStep = (step: number) => {
    setExpandedStep(prev => (prev === step ? null : step));
  };

  return (
    <div className="bg-[#14251F] border border-[#A8B5A5]/20 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#A8B5A5]/15 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#C77B43] animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C77B43]">
              Procedural Trajectory &amp; Chain of Custody
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif text-[#EAE8DF]">
            Investigation Lifecycle &amp; Statutory Timeline
          </h2>
          <p className="text-xs text-[#A8B5A5] mt-1 font-mono">
            Chronological audit log tracking incident ingestion through physical inspection and citizen feedback.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#252C28] border border-[#667B70]/40 text-[#667B70]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#667B70]" />
            <span>Completed (5)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#252C28] border border-[#C77B43]/50 text-[#C77B43]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C77B43] animate-ping" />
            <span>Active (1)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#252C28] border border-[#A8B5A5]/20 text-[#A8B5A5]/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8B5A5]/40" />
            <span>Pending (2)</span>
          </div>
        </div>
      </div>

      <div className="relative pl-6 md:pl-10 space-y-6 before:content-[''] before:absolute before:left-3 md:before:left-5 before:top-3 before:bottom-3 before:w-[1px] before:bg-[#A8B5A5]/20">
        {timeline.map((stage) => {
          const isExpanded = expandedStep === stage.step;
          const isCompleted = stage.status === 'completed';
          const isActive = stage.status === 'active';
          const isPending = stage.status === 'pending';

          return (
            <div
              key={stage.step}
              className={`relative transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#252C28] border border-[#C77B43]/40 p-4'
                  : isExpanded
                  ? 'bg-[#252C28]/60 border border-[#A8B5A5]/30 p-4'
                  : 'bg-[#1B201D] border border-[#A8B5A5]/10 p-3 hover:border-[#A8B5A5]/30'
              }`}
              onClick={() => toggleStep(stage.step)}
            >
              {/* Timeline Marker Pin */}
              <div
                className={`absolute -left-[31px] md:-left-[47px] top-4 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-colors ${
                  isCompleted
                    ? 'bg-[#14251F] border-[#667B70] text-[#667B70]'
                    : isActive
                    ? 'bg-[#C77B43] border-[#EAE8DF] text-[#14251F]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/30 text-[#A8B5A5]/60'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{stage.step}</span>
                )}
              </div>

              {/* Header / Summary Line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[9px] uppercase font-mono px-2 py-0.5 tracking-wider ${
                      isCompleted
                        ? 'bg-[#667B70]/15 text-[#667B70] border border-[#667B70]/30'
                        : isActive
                        ? 'bg-[#C77B43]/20 text-[#C77B43] border border-[#C77B43]/40 font-bold'
                        : 'bg-[#A8B5A5]/10 text-[#A8B5A5]/60 border border-[#A8B5A5]/20'
                    }`}
                  >
                    Stage {stage.step}: {stage.status}
                  </span>
                  <h3
                    className={`text-sm md:text-base font-serif font-medium ${
                      isActive ? 'text-[#EAE8DF]' : isCompleted ? 'text-[#EAE8DF]/90' : 'text-[#A8B5A5]/70'
                    }`}
                  >
                    {stage.stage_name}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  {stage.timestamp && (
                    <span className="text-[#A8B5A5] text-[11px]">{stage.timestamp}</span>
                  )}
                  <button
                    type="button"
                    aria-label={isExpanded ? 'Collapse step' : 'Expand step'}
                    className="text-[#A8B5A5] hover:text-[#EAE8DF] transition-colors p-1"
                  >
                    <svg
                      className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <p
                className={`mt-2 text-xs font-mono leading-relaxed ${
                  isActive ? 'text-[#EAE8DF]/90' : 'text-[#A8B5A5]'
                }`}
              >
                {stage.summary}
              </p>

              {/* Expandable Details */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-[#A8B5A5]/15 space-y-2 text-xs font-mono">
                  <div className="p-3 bg-[#14251F] border border-[#A8B5A5]/20">
                    <span className="text-[10px] uppercase text-[#A8B5A5] block mb-1">
                      Algorithmic / Operational Record:
                    </span>
                    <p className="text-[#EAE8DF] leading-relaxed">{stage.details}</p>
                  </div>

                  {stage.authority && (
                    <div className="flex items-center justify-between text-[11px] text-[#A8B5A5] pt-1">
                      <span>Executing Authority / Module:</span>
                      <span className="text-[#C77B43] font-medium">{stage.authority}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-[#A8B5A5]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-[#A8B5A5]">
        <div>
          <span>Next Scheduled Checkpoint: </span>
          <span className="text-[#EAE8DF] font-semibold">Physical Site Verification by MPCB Team</span>
        </div>
        <div className="text-[11px] text-[#A8B5A5]/80">
          Statutory Timeframe: Max 4 hours under Rapid Response Protocol
        </div>
      </div>
    </div>
  );
}

