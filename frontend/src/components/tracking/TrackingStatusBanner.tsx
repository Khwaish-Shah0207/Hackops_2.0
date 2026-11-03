'use client';

import React from 'react';
import Link from 'next/link';
import { TrackingIncident } from '@/lib/trackingDemoData';

interface TrackingStatusBannerProps {
  incident: TrackingIncident;
}

export function TrackingStatusBanner({ incident }: TrackingStatusBannerProps) {
  const getStatusColor = (status: TrackingIncident['status']) => {
    switch (status) {
      case 'Action Initiated':
        return {
          bg: 'bg-[#C77B43]/20',
          border: 'border-[#C77B43]',
          text: 'text-[#C77B43]',
          badge: 'border-[#C77B43]/50 text-[#C77B43]',
        };
      case 'Under Investigation':
        return {
          bg: 'bg-[#C77B43]/15',
          border: 'border-[#C77B43]/60',
          text: 'text-[#C77B43]',
          badge: 'border-[#C77B43]/40 text-[#C77B43]',
        };
      case 'Under Review':
        return {
          bg: 'bg-[#A8B5A5]/10',
          border: 'border-[#A8B5A5]/40',
          text: 'text-[#EAE8DF]',
          badge: 'border-[#A8B5A5]/30 text-[#A8B5A5]',
        };
      case 'Additional Information Required':
        return {
          bg: 'bg-[#B65348]/20',
          border: 'border-[#B65348]',
          text: 'text-[#B65348]',
          badge: 'border-[#B65348]/50 text-[#B65348]',
        };
      case 'Resolved':
        return {
          bg: 'bg-[#667B70]/20',
          border: 'border-[#667B70]',
          text: 'text-[#667B70]',
          badge: 'border-[#667B70]/50 text-[#667B70]',
        };
      default:
        return {
          bg: 'bg-[#252C28]',
          border: 'border-[#A8B5A5]/30',
          text: 'text-[#A8B5A5]',
          badge: 'border-[#A8B5A5]/30 text-[#A8B5A5]',
        };
    }
  };

  const style = getStatusColor(incident.status);

  return (
    <div className="bg-[#14251F] border border-[#A8B5A5]/25 p-6 md:p-8 space-y-6">
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#A8B5A5]/15 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase px-2.5 py-1 bg-[#252C28] border border-[#A8B5A5]/25 text-[#EAE8DF]">
            Ref: {incident.complaint_number}
          </span>
          <span className="font-mono text-xs text-[#A8B5A5] px-2 py-0.5 border border-[#A8B5A5]/20">
            {incident.pollution_type}
          </span>
          <span className="font-mono text-[10px] text-[#A8B5A5]/60 uppercase tracking-widest">
            Demonstration Record
          </span>
        </div>

        <div className="font-mono text-xs text-[#A8B5A5] flex items-center gap-2">
          <span>Last Updated:</span>
          <span className="text-[#EAE8DF] font-medium">{incident.last_updated}</span>
        </div>
      </div>

      {/* Dominant Status Statement Block */}
      <div className={`p-6 border ${style.border} ${style.bg} space-y-3`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A8B5A5]">
            Current Investigation Status
          </span>
          <span
            className={`font-mono text-xs uppercase px-3 py-1 font-bold tracking-wider border ${style.badge}`}
          >
            {incident.status}
          </span>
        </div>

        {/* Large Typography Status Headline */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#EAE8DF] tracking-tight">
          {incident.title}
        </h1>

        <p className="font-mono text-xs sm:text-sm text-[#EAE8DF]/90 leading-relaxed pt-1">
          {incident.status_explanation}
        </p>
      </div>

      {/* Incident Meta & Highest Candidate finding */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/15 space-y-1">
          <span className="text-[10px] uppercase text-[#A8B5A5] block">Location of Incident</span>
          <span className="text-[#EAE8DF] font-bold block">{incident.location_name}</span>
          <span className="text-[11px] text-[#A8B5A5]/70 block">
            {incident.coordinates.lat.toFixed(4)}° N, {incident.coordinates.lng.toFixed(4)}° E
          </span>
        </div>

        <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/15 space-y-1">
          <span className="text-[10px] uppercase text-[#A8B5A5] block">Submission &amp; Observation</span>
          <div className="flex justify-between">
            <span className="text-[#A8B5A5]">Observed:</span>
            <span className="text-[#EAE8DF]">{incident.observed_at}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A8B5A5]">Ingested:</span>
            <span className="text-[#EAE8DF]">{incident.created_at}</span>
          </div>
        </div>

        <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/15 space-y-1">
          <span className="text-[10px] uppercase text-[#A8B5A5] block">Primary Model Candidate</span>
          {incident.highest_candidate ? (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[#EAE8DF] font-bold truncate max-w-[150px]">
                  {incident.highest_candidate.name}
                </span>
                <span className="text-[#C77B43] font-bold">
                  {incident.highest_candidate.evidence_score}/100
                </span>
              </div>
              <span className="text-[10px] text-[#A8B5A5] block">
                Confidence: {incident.highest_candidate.confidence_level}
              </span>
            </div>
          ) : (
            <span className="text-[#A8B5A5] text-[11px]">Correlation pending initial review</span>
          )}
        </div>
      </div>

      {/* "What Happens Next?" Section */}
      <div className="bg-[#1B201D] border border-[#A8B5A5]/20 p-5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C77B43] animate-pulse" />
          <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-[#C77B43]">
            What Happens Next? (Operational Workflow)
          </h2>
        </div>
        <p className="font-mono text-xs text-[#EAE8DF]/90 leading-relaxed pl-4">
          {incident.what_happens_next}
        </p>
      </div>

      {/* Quick Action to Full Investigation Dossier */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#252C28] border border-[#A8B5A5]/20 gap-4">
        <div className="space-y-0.5 text-xs font-mono">
          <div className="font-bold text-[#EAE8DF]">Looking for full scientific evidence?</div>
          <div className="text-[11px] text-[#A8B5A5]">
            Access the backward trajectory map, CPCB sensor anomaly graphs, and EPA chemical speciation fingerprint.
          </div>
        </div>

        <Link
          href={`/incidents/${incident.id}`}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors shrink-0 flex items-center justify-center gap-2"
        >
          <span>Open Investigation Dossier</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

