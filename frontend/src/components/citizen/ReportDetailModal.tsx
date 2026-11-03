'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CitizenReportItem } from '@/lib/citizenDemoData';
import { CloseIcon, CrosshairIcon, WindVectorIcon, ScaleBalanceIcon } from '@/components/shared/CustomIcons';

interface ReportDetailModalProps {
  report: CitizenReportItem | null;
  onClose: () => void;
}

export default function ReportDetailModal({ report, onClose }: ReportDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (report) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [report, onClose]);

  if (!report) return null;

  const getStatusBadge = (status: CitizenReportItem['status']) => {
    switch (status) {
      case 'Under Investigation':
        return (
          <span className="font-mono text-xs px-2.5 py-1 bg-accent-orange/15 text-accent-orange border border-accent-orange/40 font-semibold">
            Under Investigation
          </span>
        );
      case 'Action Initiated':
        return (
          <span className="font-mono text-xs px-2.5 py-1 bg-accent-green/15 text-accent-green border border-accent-green/40 font-semibold">
            Action Initiated
          </span>
        );
      case 'Under Review':
        return (
          <span className="font-mono text-xs px-2.5 py-1 bg-sage-muted/15 text-sage-light border border-sage-muted/40 font-semibold">
            Under Review
          </span>
        );
      case 'Resolved':
        return (
          <span className="font-mono text-xs px-2.5 py-1 bg-sage-muted/20 text-ivory-warm border border-sage-muted/60 font-semibold">
            Resolved
          </span>
        );
      default:
        return (
          <span className="font-mono text-xs px-2.5 py-1 bg-graphite-border/40 text-sage-muted border border-graphite-border font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-3xl bg-forest-charcoal border border-graphite-border max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 z-10"
      >
        {/* Modal Top Bar */}
        <div className="flex items-start justify-between pb-4 border-b border-graphite-border">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
                {report.complaint_number}
              </span>
              <span className="font-mono text-[10px] text-sage-muted">
                Demo Record // Public Filing
              </span>
            </div>
            <h2 id="modal-title" className="font-sans text-xl sm:text-2xl font-bold text-ivory-warm">
              {report.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-graphite-border text-sage-muted hover:text-ivory-warm hover:border-sage-muted transition-colors"
            aria-label="Close dialog"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Status & Key Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">
          <div className="border border-graphite-border/60 bg-forest-dark p-3.5">
            <span className="font-mono text-[10px] text-sage-muted uppercase block">Current Status</span>
            <div className="mt-1.5">{getStatusBadge(report.status)}</div>
          </div>
          <div className="border border-graphite-border/60 bg-forest-dark p-3.5">
            <span className="font-mono text-[10px] text-sage-muted uppercase block">Pollution Classification</span>
            <span className="font-sans text-sm font-semibold text-ivory-warm mt-1 block">
              {report.pollution_type}
            </span>
          </div>
          <div className="border border-graphite-border/60 bg-forest-dark p-3.5">
            <span className="font-mono text-[10px] text-sage-muted uppercase block">Observation Timestamp</span>
            <span className="font-mono text-xs font-semibold text-ivory-warm mt-1 block">
              {report.observed_at}
            </span>
          </div>
        </div>

        {/* Location & Coordinates */}
        <div className="border border-graphite-border/60 bg-forest-dark p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-sage-muted">
            <CrosshairIcon className="w-3.5 h-3.5 text-accent-orange" />
            <span className="uppercase tracking-wider">Geographic Observation Point</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-sm">
            <span className="font-sans font-semibold text-ivory-warm">{report.location_name}</span>
            <span className="font-mono text-xs text-sage-muted">
              Lat {report.coordinates.lat.toFixed(4)}° N, Lon {report.coordinates.lng.toFixed(4)}° E
            </span>
          </div>
        </div>

        {/* Dominant Investigation Result Box */}
        {report.highest_candidate ? (
          <div className="border border-accent-orange/40 bg-forest-dark p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-graphite-border/60">
              <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
                Primary Model-Generated Finding
              </span>
              <span className="font-mono text-[10px] text-sage-muted border border-sage-muted/40 px-2 py-0.5">
                Confidence: {report.highest_candidate.confidence_level}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-sage-muted uppercase">Highest-Ranked Potential Origin</span>
                <h3 className="font-sans text-lg font-bold text-ivory-warm">
                  {report.highest_candidate.name}
                </h3>
                <p className="font-mono text-xs text-sage-muted">
                  Classification: {report.highest_candidate.category}
                </p>
              </div>

              {/* Dominant Large Typography Score */}
              <div className="flex items-baseline space-x-2 sm:text-right shrink-0">
                <span className="font-sans text-5xl font-extrabold text-accent-orange leading-none">
                  {report.highest_candidate.evidence_score}
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-xs text-sage-muted">/ 100</span>
                  <span className="font-mono text-[9px] text-sage-muted uppercase">Evidence Score</span>
                </div>
              </div>
            </div>

            {report.wind_trajectory_summary && (
              <div className="pt-3 border-t border-graphite-border/40 text-xs font-mono text-sage-light flex items-start space-x-2">
                <WindVectorIcon className="w-4 h-4 text-accent-orange shrink-0 mt-0.5" />
                <span>{report.wind_trajectory_summary}</span>
              </div>
            )}

            <div className="text-[10px] font-mono text-sage-muted/80 bg-forest-charcoal p-2.5 border-l-2 border-accent-orange">
              Regulatory Note: Heuristic scores support environmental inspection squad dispatch. They represent computational probability and do not constitute legal declarations of guilt without verified physical evidence.
            </div>
          </div>
        ) : (
          <div className="border border-graphite-border bg-forest-dark p-5 text-center text-xs font-mono text-sage-muted">
            Computational source identification in progress. Waiting for atmospheric trajectory correlation.
          </div>
        )}

        {/* Recent Regulatory Action Log */}
        {report.recent_action && (
          <div className="space-y-2 pt-2 border-t border-graphite-border/60">
            <div className="flex items-center space-x-2 font-mono text-xs text-sage-muted">
              <ScaleBalanceIcon className="w-3.5 h-3.5 text-accent-green" />
              <span className="uppercase tracking-wider">Latest Action Log</span>
            </div>
            <p className="text-xs font-mono text-ivory-warm/85 bg-forest-dark p-3 border border-graphite-border/40 leading-relaxed">
              {report.recent_action}
            </p>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-graphite-border">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/incidents/${report.id}`}
              className="px-4 py-2 bg-accent-orange text-forest-charcoal hover:bg-accent-orange/90 font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Investigation Dossier</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href={`/track?id=${report.id}`}
              className="px-3.5 py-2 border border-accent-orange/50 hover:border-accent-orange text-accent-orange hover:bg-accent-orange/10 font-mono text-xs uppercase tracking-wider text-center transition-colors"
            >
              Track &amp; Feedback
            </Link>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-graphite-border hover:border-sage-muted text-ivory-warm font-mono text-xs uppercase tracking-wider transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

