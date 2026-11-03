'use client';

import React, { useState } from 'react';
import { TrackingStage } from '@/lib/trackingDemoData';

interface TrackingTimelineViewProps {
  stages: TrackingStage[];
}

export function TrackingTimelineView({ stages }: TrackingTimelineViewProps) {
  // Default expand the first active or action_required stage, else default to the latest completed
  const initialActive = stages.find((s) => s.status === 'active' || s.status === 'action_required')?.step || 1;
  const [expandedStep, setExpandedStep] = useState<number | null>(initialActive);

  const toggleStep = (step: number) => {
    setExpandedStep((prev) => (prev === step ? null : step));
  };

  const completedCount = stages.filter((s) => s.status === 'completed').length;
  const activeCount = stages.filter((s) => s.status === 'active' || s.status === 'action_required').length;
  const pendingCount = stages.filter((s) => s.status === 'pending').length;

  return (
    <div className="bg-[#14251F] border border-[#A8B5A5]/25 p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#A8B5A5]/15 gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C77B43] block mb-1">
            Investigation Progress &amp; Audit Trail
          </span>
          <h2 className="text-xl md:text-2xl font-serif text-[#EAE8DF]">
            Detailed Case Tracking Timeline
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-[#252C28] border border-[#667B70]/40 text-[#667B70]">
            {completedCount} Completed
          </span>
          <span className="px-2.5 py-1 bg-[#252C28] border border-[#C77B43]/50 text-[#C77B43]">
            {activeCount} Active
          </span>
          <span className="px-2.5 py-1 bg-[#252C28] border border-[#A8B5A5]/25 text-[#A8B5A5]">
            {pendingCount} Pending
          </span>
        </div>
      </div>

      {/* Vertical Interactive Step Timeline */}
      <div className="relative pl-6 sm:pl-10 space-y-4 before:content-[''] before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-[1px] before:bg-[#A8B5A5]/20">
        {stages.map((stage) => {
          const isExpanded = expandedStep === stage.step;
          const isCompleted = stage.status === 'completed';
          const isActive = stage.status === 'active';
          const isActionReq = stage.status === 'action_required';
          const isPending = stage.status === 'pending';

          return (
            <div
              key={stage.step}
              onClick={() => toggleStep(stage.step)}
              className={`relative p-4 border transition-all cursor-pointer ${
                isActionReq
                  ? 'bg-[#252C28] border-[#B65348] ring-1 ring-[#B65348]/40'
                  : isActive
                  ? 'bg-[#252C28] border-[#C77B43] ring-1 ring-[#C77B43]/40'
                  : isExpanded
                  ? 'bg-[#252C28]/80 border-[#A8B5A5]/40'
                  : isCompleted
                  ? 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                  : 'bg-[#14251F] border-[#A8B5A5]/10 text-[#A8B5A5]/50'
              }`}
            >
              {/* Bullet Node */}
              <div
                className={`absolute -left-[31px] sm:-left-[47px] top-4 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-colors ${
                  isCompleted
                    ? 'bg-[#14251F] border-[#667B70] text-[#667B70]'
                    : isActionReq
                    ? 'bg-[#B65348] border-[#EAE8DF] text-[#14251F] animate-bounce'
                    : isActive
                    ? 'bg-[#C77B43] border-[#EAE8DF] text-[#14251F]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/30 text-[#A8B5A5]/50'
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

              {/* Step Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[9px] uppercase font-mono px-2 py-0.5 tracking-wider border ${
                      isCompleted
                        ? 'bg-[#667B70]/15 text-[#667B70] border-[#667B70]/30'
                        : isActionReq
                        ? 'bg-[#B65348]/20 text-[#B65348] border-[#B65348]/50 font-bold'
                        : isActive
                        ? 'bg-[#C77B43]/20 text-[#C77B43] border-[#C77B43]/50 font-bold'
                        : 'bg-[#A8B5A5]/10 text-[#A8B5A5]/50 border-[#A8B5A5]/20'
                    }`}
                  >
                    Stage {stage.step}: {isActionReq ? 'Action Required' : stage.status}
                  </span>

                  <h3
                    className={`text-sm sm:text-base font-serif font-medium ${
                      isActionReq
                        ? 'text-[#B65348] font-bold'
                        : isActive
                        ? 'text-[#EAE8DF] font-bold'
                        : isCompleted
                        ? 'text-[#EAE8DF]'
                        : 'text-[#A8B5A5]/60'
                    }`}
                  >
                    {stage.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-[#A8B5A5]">
                  {stage.timestamp && (
                    <span className="text-[11px]">{stage.timestamp}</span>
                  )}
                  <button
                    type="button"
                    aria-label={isExpanded ? 'Collapse stage details' : 'Expand stage details'}
                    className="p-1 hover:text-[#EAE8DF] transition-colors"
                  >
                    <svg
                      className={`w-3.5 h-3.5 transform transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Short Update Summary */}
              <p
                className={`mt-2 text-xs font-mono leading-relaxed ${
                  isActionReq ? 'text-[#EAE8DF]' : isActive ? 'text-[#EAE8DF]/90' : isCompleted ? 'text-[#A8B5A5]' : 'text-[#A8B5A5]/50'
                }`}
              >
                {stage.summary}
              </p>

              {/* Expandable Technical Log */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#A8B5A5]/15 space-y-2 text-xs font-mono">
                  <div className="p-3 bg-[#14251F] border border-[#A8B5A5]/15">
                    <span className="text-[10px] uppercase text-[#A8B5A5] block mb-1">
                      Operational Record &amp; Evidence Log:
                    </span>
                    <p className="text-[#EAE8DF] leading-relaxed">{stage.details}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-[#A8B5A5] pt-1 gap-2">
                    {stage.authority && (
                      <div>
                        <span>Executing Unit: </span>
                        <span className="text-[#C77B43] font-medium">{stage.authority}</span>
                      </div>
                    )}
                    {stage.statutory_ref && (
                      <div>
                        <span>Statutory Citation: </span>
                        <span className="text-[#EAE8DF] font-bold">{stage.statutory_ref}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

