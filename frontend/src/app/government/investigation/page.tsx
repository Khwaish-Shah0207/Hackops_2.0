'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GovernmentShell } from '@/components/government/GovernmentShell';
import { useGovernment } from '@/lib/governmentContext';
import { DEMO_INVESTIGATION_CASE_INC_4 } from '@/lib/investigationDemoData';
import InteractiveInvestigationMap from '@/components/investigation/InteractiveInvestigationMap';
import { SourceCandidatesRanking, SourceCandidate } from '@/components/investigation/SourceCandidatesRanking';
import { InteractiveChemicalFingerprint } from '@/components/investigation/InteractiveChemicalFingerprint';

function InvestigationContent() {
  const searchParams = useSearchParams();
  const queryParamId = searchParams.get('id');
  const { incidents, addIncidentNote } = useGovernment();

  const caseData = DEMO_INVESTIGATION_CASE_INC_4;

  const currentIncident = useMemo(() => {
    if (queryParamId) {
      const match = incidents.find(
        (i) => i.id.toString() === queryParamId || i.complaint_number.toLowerCase() === queryParamId.toLowerCase()
      );
      if (match) return match;
    }
    return incidents[0];
  }, [queryParamId, incidents]);

  const [activeOfficerNote, setActiveOfficerNote] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<SourceCandidate | null>(
    caseData.candidates[0] || null
  );

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOfficerNote.trim()) return;
    addIncidentNote(currentIncident.id, activeOfficerNote);
    setActiveOfficerNote('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#A8B5A5]/15 gap-4">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#A8B5A5] mb-1">
            <Link href="/government" className="hover:text-[#EAE8DF]">
              Command Console
            </Link>
            <span>/</span>
            <Link href="/government/incidents" className="hover:text-[#EAE8DF]">
              Incidents
            </Link>
            <span>/</span>
            <span className="text-[#C77B43] font-bold">{currentIncident.complaint_number}</span>
          </nav>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C77B43] animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C77B43]">
              Forensic Environmental Attribution Workspace
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAE8DF]">
            Investigation Workspace: {currentIncident.complaint_number}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/government/reports?id=${currentIncident.id}`}
            className="px-4 py-2 bg-[#252C28] hover:bg-[#C77B43] hover:text-[#14251F] border border-[#A8B5A5]/30 text-xs font-mono text-[#EAE8DF] transition-colors uppercase tracking-wider"
          >
            Review Report Preview &rarr;
          </Link>
          <Link
            href="/government/actions"
            className="px-4 py-2 bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            Issue Statutory Order &rarr;
          </Link>
        </div>
      </div>

      {/* Section A: Investigation Summary & Dominant Finding */}
      <section aria-labelledby="inv-summary-heading" className="bg-[#252C28] border border-[#A8B5A5]/25 p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#A8B5A5]/15">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-[#C77B43]/20 border border-[#C77B43]/50 text-[#C77B43] font-mono text-xs font-bold uppercase tracking-wider">
                {currentIncident.status}
              </span>
              <span className="px-2.5 py-1 bg-[#14251F] border border-[#B65348]/40 text-[#B65348] font-mono text-xs font-bold uppercase">
                Priority: {currentIncident.priority}
              </span>
              <span className="px-2 py-0.5 bg-[#667B70]/15 text-[#667B70] border border-[#667B70]/30 font-mono text-[10px] uppercase">
                Lead: {currentIncident.assigned_officer || 'Officer R. K. Patil'}
              </span>
            </div>

            <h2 id="inv-summary-heading" className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#EAE8DF]">
              {currentIncident.title}
            </h2>

            <p className="font-mono text-xs sm:text-sm text-[#A8B5A5] leading-relaxed max-w-3xl">
              Lagrangian trajectory backtracking combined with sensor anomaly isolation (CPCB-GOV-01: 218 µg/m³) identifies direct upwind alignment with the Govandi informal scrap recycling cluster along 108° (East-South-East).
            </p>
          </div>

          {/* Dominant Evidence Score Block */}
          <div className="p-5 bg-[#14251F] border border-[#C77B43]/50 shrink-0 lg:w-72 space-y-2 font-mono text-right">
            <span className="text-[10px] uppercase text-[#A8B5A5] block">
              Highest Candidate Evidence Index
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-4xl sm:text-5xl font-bold text-[#C77B43]">
                {caseData.candidates[0].overall_evidence_score}
              </span>
              <span className="text-sm text-[#A8B5A5]/60">/ 100</span>
            </div>
            <div className="text-xs text-[#EAE8DF] font-bold truncate">
              {caseData.candidates[0].name}
            </div>
            <div className="text-[10px] text-[#667B70]">
              Confidence Tier: {caseData.candidates[0].confidence_level}
            </div>
          </div>
        </div>

        {/* Meteorology & Dispersion Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-3 bg-[#14251F] border border-[#A8B5A5]/15">
            <span className="text-[10px] uppercase text-[#A8B5A5] block">Wind Direction</span>
            <span className="text-[#EAE8DF] font-bold">{caseData.weather.wind_direction_deg}° ({caseData.weather.wind_direction_cardinal})</span>
          </div>
          <div className="p-3 bg-[#14251F] border border-[#A8B5A5]/15">
            <span className="text-[10px] uppercase text-[#A8B5A5] block">Wind Velocity</span>
            <span className="text-[#EAE8DF] font-bold">{caseData.weather.wind_speed_ms} m/s</span>
          </div>
          <div className="p-3 bg-[#14251F] border border-[#A8B5A5]/15">
            <span className="text-[10px] uppercase text-[#A8B5A5] block">Dispersion Stability</span>
            <span className="text-[#EAE8DF] font-bold">{caseData.weather.atmospheric_stability}</span>
          </div>
          <div className="p-3 bg-[#14251F] border border-[#A8B5A5]/15">
            <span className="text-[10px] uppercase text-[#A8B5A5] block">Boundary Layer</span>
            <span className="text-[#EAE8DF] font-bold">{caseData.weather.boundary_layer_height_m} meters</span>
          </div>
          <div className="p-3 bg-[#14251F] border border-[#A8B5A5]/15">
            <span className="text-[10px] uppercase text-[#A8B5A5] block">Ambient Temp</span>
            <span className="text-[#EAE8DF] font-bold">{caseData.weather.temperature_c}°C</span>
          </div>
          <div className="p-3 bg-[#14251F] border border-[#A8B5A5]/15">
            <span className="text-[10px] uppercase text-[#A8B5A5] block">Relative Humidity</span>
            <span className="text-[#EAE8DF] font-bold">{caseData.weather.humidity_pct}%</span>
          </div>
        </div>
      </section>

      {/* Section B: Interactive Spatial Investigation Map */}
      <section aria-labelledby="map-section-title">
        <InteractiveInvestigationMap data={caseData} />
      </section>

      {/* Section C: Multi-Tier Environmental Evidence Matrix */}
      <section aria-labelledby="matrix-title" className="bg-[#14251F] border border-[#A8B5A5]/25 p-6 md:p-8 space-y-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#667B70] block">
            Evidence Synthesis Matrix
          </span>
          <h2 id="matrix-title" className="text-xl md:text-2xl font-serif text-[#EAE8DF]">
            Multi-Criteria Environmental Evidence Examination
          </h2>
          <p className="text-xs font-mono text-[#A8B5A5]">
            Strict separation between measured sensor telemetry, mathematical model back-projections, and citizen observations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#A8B5A5]/15">
              <span className="text-[10px] uppercase font-bold text-[#EAE8DF]">Tier 1: Directly Observed</span>
              <span className="w-2 h-2 rounded-full bg-[#667B70]" />
            </div>
            <p className="text-[#A8B5A5] leading-relaxed">
              Geotagged public complaint at 19.0580° N, 72.8980° E with photographic evidence of thick white-grey particulate smolder.
            </p>
            <div className="pt-2 text-[10px] text-[#667B70]">Source: Resident Welfare Association</div>
          </div>

          <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#A8B5A5]/15">
              <span className="text-[10px] uppercase font-bold text-[#EAE8DF]">Tier 2: Model Generated</span>
              <span className="w-2 h-2 rounded-full bg-[#C77B43]" />
            </div>
            <p className="text-[#A8B5A5] leading-relaxed">
              NOAA-HYSPLIT backward trajectory calculated 35 minutes upwind along 108° azimuth directly intersecting Govandi scrap zone.
            </p>
            <div className="pt-2 text-[10px] text-[#C77B43]">Source: Trajectory Engine (4.2 m/s)</div>
          </div>

          <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#A8B5A5]/15">
              <span className="text-[10px] uppercase font-bold text-[#EAE8DF]">Tier 3: Sensor Anomaly</span>
              <span className="w-2 h-2 rounded-full bg-[#B65348]" />
            </div>
            <p className="text-[#A8B5A5] leading-relaxed">
              Station CPCB-GOV-01 logged PM2.5 spike to 218 µg/m³ (AQI 375, Very Poor), confirmed by Isolation Forest detector.
            </p>
            <div className="pt-2 text-[10px] text-[#B65348]">Source: CPCB Ambient Grid</div>
          </div>

          <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#A8B5A5]/15">
              <span className="text-[10px] uppercase font-bold text-[#EAE8DF]">Tier 4: Regulatory Action</span>
              <span className="w-2 h-2 rounded-full bg-[#EAE8DF]" />
            </div>
            <p className="text-[#A8B5A5] leading-relaxed">
              Formal squad dispatch under statutory docket MPCB/SURV/2026/W-104 for physical verification of scrap facilities.
            </p>
            <div className="pt-2 text-[10px] text-[#EAE8DF]">Authority: MPCB Surveillance Wing</div>
          </div>
        </div>
      </section>

      {/* Section D: Chemical Fingerprint & Speciation Analysis */}
      <section aria-labelledby="fingerprint-title">
        <InteractiveChemicalFingerprint chemicalSpeciation={caseData.chemical_speciation} />
      </section>

      {/* Section E: Potential Source Candidate Ranking */}
      <section aria-labelledby="ranking-title">
        <SourceCandidatesRanking
          candidates={caseData.candidates}
          onSelectCandidate={(c) => setSelectedCandidate(c)}
        />
      </section>

      {/* Section F: Officer Investigation Notes & Statutory Field Log */}
      <section aria-labelledby="notes-section-title" className="bg-[#14251F] border border-[#A8B5A5]/25 p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#A8B5A5]/15">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C77B43] block">
              Official Casework Ledger
            </span>
            <h2 id="notes-section-title" className="text-xl font-serif text-[#EAE8DF]">
              Officer Notes &amp; Field Audit Entries
            </h2>
          </div>
          <span className="text-xs font-mono text-[#A8B5A5]">
            {currentIncident.internal_notes.length} Recorded Entries
          </span>
        </div>

        <div className="space-y-3">
          {currentIncident.internal_notes.map((note) => (
            <div key={note.id} className="p-3 bg-[#252C28] border border-[#A8B5A5]/20 font-mono text-xs space-y-1">
              <div className="flex justify-between text-[10px] text-[#A8B5A5]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#EAE8DF]">{note.author}</span>
                  {note.is_confidential && (
                    <span className="px-1.5 py-0.2 bg-[#B65348]/20 text-[#B65348] border border-[#B65348]/40 uppercase text-[9px]">
                      Confidential
                    </span>
                  )}
                </div>
                <span>{note.timestamp}</span>
              </div>
              <p className="text-[#EAE8DF]/90 text-[11px] leading-relaxed">{note.text}</p>
            </div>
          ))}
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleSaveNote} className="pt-2 space-y-2 font-mono text-xs">
          <label className="block text-[10px] uppercase text-[#A8B5A5]">
            Add New Operational Note / Dispatch Directive:
          </label>
          <textarea
            rows={2}
            value={activeOfficerNote}
            onChange={(e) => setActiveOfficerNote(e.target.value)}
            placeholder="Record physical inspection findings, stack sampling status, or inter-agency coordination remarks..."
            className="w-full bg-[#252C28] border border-[#A8B5A5]/25 p-3 text-xs font-mono text-[#EAE8DF] placeholder-[#A8B5A5]/40 focus:border-[#C77B43] focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!activeOfficerNote.trim()}
              className="px-5 py-2 bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40"
            >
              Commit Entry to Docket
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function GovernmentInvestigationPage() {
  return (
    <GovernmentShell>
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs font-mono text-[#A8B5A5]">
            Loading Investigation Workspace...
          </div>
        }
      >
        <InvestigationContent />
      </Suspense>
    </GovernmentShell>
  );
}

