'use client';

import React, { useState } from 'react';

export interface SourceCandidate {
  rank: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distance_km: number;
  overall_evidence_score: number;
  confidence_level: 'High' | 'Moderate' | 'Low' | 'Insufficient evidence';
  sub_scores: {
    wind_alignment_pct: number;
    transport_time_min: number;
    corridor_anomaly_pct: number;
    complaint_density_pct: number;
    land_use_weight_pct: number;
    chemical_match_pct: number;
  };
  explanation: string;
  shortlist_reason: string;
  limitations: string;
}

interface SourceCandidatesRankingProps {
  candidates: SourceCandidate[];
  selectedCandidate?: SourceCandidate | null;
  onSelectCandidate?: (candidate: SourceCandidate) => void;
}

export function SourceCandidatesRanking({
  candidates,
  onSelectCandidate,
}: SourceCandidatesRankingProps) {
  const [selectedRank, setSelectedRank] = useState<number>(1);

  const handleSelect = (candidate: SourceCandidate) => {
    setSelectedRank(candidate.rank);
    if (onSelectCandidate) {
      onSelectCandidate(candidate);
    }
  };

  const selectedCandidate =
    candidates.find((c) => c.rank === selectedRank) || candidates[0];

  return (
    <div className="bg-[#14251F] border border-[#A8B5A5]/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between pb-6 mb-6 border-b border-[#A8B5A5]/15 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#C77B43]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C77B43]">
              Upwind Source Attribution Matrix
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif text-[#EAE8DF]">
            Ranked Potential Source Candidates
          </h2>
          <p className="text-xs text-[#A8B5A5] mt-1 font-mono">
            Multi-criteria algorithmic heuristic combining wind trajectory, sensor spikes, complaint density, and chemical speciation.
          </p>
        </div>

        <div className="bg-[#252C28] border border-[#A8B5A5]/25 px-4 py-2 self-start md:self-auto text-xs font-mono">
          <span className="text-[10px] uppercase text-[#A8B5A5] block">Candidates Scored</span>
          <span className="text-base font-bold text-[#EAE8DF]">
            {candidates.length} Registered Facilities / Clusters
          </span>
        </div>
      </div>

      {/* Candidate List Cards */}
      <div className="space-y-4 mb-6">
        {candidates.map((candidate) => {
          const isSelected = candidate.rank === selectedRank;
          const isTop = candidate.rank === 1;

          return (
            <div
              key={candidate.rank}
              onClick={() => handleSelect(candidate)}
              className={`p-4 md:p-5 border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#252C28] border-[#C77B43] ring-1 ring-[#C77B43]/50'
                  : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-none border font-mono font-bold text-sm flex items-center justify-center shrink-0 ${
                      isTop
                        ? 'bg-[#C77B43] text-[#14251F] border-[#EAE8DF]'
                        : candidate.overall_evidence_score >= 70
                        ? 'bg-[#667B70]/20 text-[#667B70] border-[#667B70]'
                        : 'bg-[#252C28] text-[#A8B5A5] border-[#A8B5A5]/30'
                    }`}
                  >
                    #{candidate.rank}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base md:text-lg font-serif font-bold text-[#EAE8DF]">
                        {candidate.name}
                      </h3>
                      <span
                        className={`text-[9px] uppercase font-mono px-2 py-0.5 tracking-wider border ${
                          candidate.confidence_level === 'High'
                            ? 'bg-[#C77B43]/20 border-[#C77B43]/40 text-[#C77B43] font-bold'
                            : candidate.confidence_level === 'Moderate'
                            ? 'bg-[#667B70]/20 border-[#667B70]/40 text-[#667B70]'
                            : 'bg-[#A8B5A5]/10 border-[#A8B5A5]/20 text-[#A8B5A5]'
                        }`}
                      >
                        Confidence: {candidate.confidence_level}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#A8B5A5] flex flex-wrap items-center gap-3">
                      <span>{candidate.category}</span>
                      <span>&bull;</span>
                      <span>Distance: {candidate.distance_km} km</span>
                      <span>&bull;</span>
                      <span>Transport Time: ~{candidate.sub_scores.transport_time_min} mins</span>
                    </div>
                  </div>
                </div>

                {/* Score Dial / Block */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-2 md:pt-0 border-[#A8B5A5]/15">
                  <span className="text-[10px] uppercase font-mono text-[#A8B5A5]">
                    Evidence Index
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-2xl font-mono font-bold ${
                        candidate.overall_evidence_score >= 80
                          ? 'text-[#C77B43]'
                          : candidate.overall_evidence_score >= 60
                          ? 'text-[#667B70]'
                          : 'text-[#A8B5A5]'
                      }`}
                    >
                      {candidate.overall_evidence_score}
                    </span>
                    <span className="text-xs font-mono text-[#A8B5A5]/60">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Sub-scores mini horizontal indicators */}
              <div className="mt-4 pt-3 border-t border-[#A8B5A5]/10 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                <div className="p-2 bg-[#14251F] border border-[#A8B5A5]/10">
                  <span className="text-[9px] uppercase text-[#A8B5A5] block">Wind Align (30%)</span>
                  <span className="text-[#EAE8DF] font-bold">
                    {candidate.sub_scores.wind_alignment_pct}%
                  </span>
                </div>
                <div className="p-2 bg-[#14251F] border border-[#A8B5A5]/10">
                  <span className="text-[9px] uppercase text-[#A8B5A5] block">Corridor Anom (20%)</span>
                  <span className="text-[#EAE8DF] font-bold">
                    {candidate.sub_scores.corridor_anomaly_pct}%
                  </span>
                </div>
                <div className="p-2 bg-[#14251F] border border-[#A8B5A5]/10">
                  <span className="text-[9px] uppercase text-[#A8B5A5] block">Complaint Dens (25%)</span>
                  <span className="text-[#EAE8DF] font-bold">
                    {candidate.sub_scores.complaint_density_pct}%
                  </span>
                </div>
                <div className="p-2 bg-[#14251F] border border-[#A8B5A5]/10">
                  <span className="text-[9px] uppercase text-[#A8B5A5] block">Land Use (15%)</span>
                  <span className="text-[#EAE8DF] font-bold">
                    {candidate.sub_scores.land_use_weight_pct}%
                  </span>
                </div>
                <div className="p-2 bg-[#14251F] border border-[#A8B5A5]/10 col-span-2 sm:col-span-1">
                  <span className="text-[9px] uppercase text-[#A8B5A5] block">Chem Match (10%)</span>
                  <span className="text-[#EAE8DF] font-bold">
                    {candidate.sub_scores.chemical_match_pct}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Candidate Detailed Inspection Drawer */}
      {selectedCandidate && (
        <div className="bg-[#252C28] border border-[#C77B43]/40 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A8B5A5]/15">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C77B43] font-bold">
                Detailed Evaluation for #{selectedCandidate.rank}:
              </span>
              <span className="text-sm font-serif font-bold text-[#EAE8DF]">
                {selectedCandidate.name}
              </span>
            </div>
            <span className="text-xs font-mono text-[#A8B5A5]">
              GPS: {selectedCandidate.lat.toFixed(4)}° N, {selectedCandidate.lng.toFixed(4)}° E
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-2">
              <span className="text-[10px] uppercase text-[#A8B5A5] block">
                Meteorological &amp; Spatial Rationale:
              </span>
              <p className="p-3 bg-[#14251F] border border-[#A8B5A5]/15 text-[#EAE8DF] leading-relaxed">
                {selectedCandidate.explanation}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase text-[#A8B5A5] block">
                Primary Shortlisting Grounds:
              </span>
              <p className="p-3 bg-[#14251F] border border-[#A8B5A5]/15 text-[#EAE8DF] leading-relaxed">
                {selectedCandidate.shortlist_reason}
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#14251F] border border-[#B65348]/30 text-xs font-mono">
            <span className="text-[10px] uppercase text-[#B65348] font-bold block mb-1">
              Field Investigation Limitations:
            </span>
            <p className="text-[#A8B5A5] leading-relaxed">
              {selectedCandidate.limitations}
            </p>
          </div>
        </div>
      )}

      {/* Mandatory Decision Support Disclaimer */}
      <div className="mt-6 p-4 bg-[#1B201D] border border-[#A8B5A5]/20 flex items-start gap-3 text-xs font-mono text-[#A8B5A5]">
        <svg
          className="w-5 h-5 text-[#C77B43] shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <strong className="text-[#EAE8DF] uppercase tracking-wider block mb-1">
            Statutory Decision-Support Framework Disclaimer:
          </strong>
          <p className="leading-relaxed">
            Candidate source scores are produced by deterministic trajectory backtracking, sensor anomaly correlation, and EPA mass speciation heuristics. These rankings serve strictly as priority targets for on-site inspection squads and do not constitute an accusation, evidence of criminal guilt, or formal regulatory adjudication. Statutory penalties require on-site physical verification and lab-certified sample analysis under the Air (Prevention and Control of Pollution) Act, 1981.
          </p>
        </div>
      </div>
    </div>
  );
}

