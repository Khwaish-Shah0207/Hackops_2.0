'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GovernmentShell } from '@/components/government/GovernmentShell';
import { useGovernment, InvestigationReportItem } from '@/lib/governmentContext';
import { DEMO_INVESTIGATION_CASE_INC_4 } from '@/lib/investigationDemoData';

export default function ReportsPage() {
  const { reports, updateReportStatus } = useGovernment();
  const caseData = DEMO_INVESTIGATION_CASE_INC_4;

  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || 'rep-1');
  const [exportNotice, setExportNotice] = useState(false);

  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handlePrint = () => {
    setExportNotice(true);
    setTimeout(() => {
      window.print();
      setExportNotice(false);
    }, 300);
  };

  const getStatusBadge = (status: InvestigationReportItem['status']) => {
    switch (status) {
      case 'Published':
        return 'bg-[#667B70]/20 border-[#667B70] text-[#667B70]';
      case 'Approved':
        return 'bg-[#C77B43]/20 border-[#C77B43] text-[#C77B43]';
      case 'Under Review':
        return 'bg-[#EAE8DF]/10 border-[#EAE8DF]/40 text-[#EAE8DF]';
      default:
        return 'bg-[#14251F] border-[#A8B5A5]/30 text-[#A8B5A5]';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#A8B5A5]/15 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C77B43]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C77B43]">
              Statutory Evidence Dossiers &amp; Forensic Briefs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAE8DF]">
            Official Environmental Investigation Reports
          </h1>
          <p className="text-xs font-mono text-[#A8B5A5] mt-0.5">
            Formal dockets compiled under Section 21 &amp; 31A of the Air (Prevention and Control of Pollution) Act, 1981.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Export Formal PDF</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-[#252C28] border border-[#667B70] text-[#667B70] font-mono text-xs">
          Preparing print / PDF stylesheet for statutory dossier export...
        </div>
      )}

      {/* 2-Column: Reports Roster (4 cols) + Full Formal Report Preview (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Report List Selector (4 cols) */}
        <div className="lg:col-span-4 bg-[#14251F] border border-[#A8B5A5]/25 p-4 space-y-3 font-mono text-xs">
          <div className="text-[10px] uppercase tracking-widest text-[#A8B5A5] pb-2 border-b border-[#A8B5A5]/15">
            Dossier Archives ({reports.length})
          </div>

          <div className="space-y-2">
            {reports.map((rep) => {
              const isSelected = rep.id === selectedReportId;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-3.5 border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-[#252C28] border-[#C77B43] ring-1 ring-[#C77B43]/50'
                      : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#EAE8DF]">{rep.report_number}</span>
                    <span className={`px-2 py-0.5 text-[9px] uppercase border ${getStatusBadge(rep.status)}`}>
                      {rep.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-serif font-bold text-[#EAE8DF] line-clamp-2">
                    {rep.title}
                  </h3>

                  <div className="text-[10px] text-[#A8B5A5] pt-1 border-t border-[#A8B5A5]/10 flex justify-between">
                    <span>Incident: {rep.complaint_number}</span>
                    <span>{rep.created_at.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report Approval Actions */}
          {selectedReport && (
            <div className="p-3 bg-[#252C28] border border-[#A8B5A5]/20 space-y-2 pt-3">
              <span className="text-[10px] uppercase text-[#A8B5A5] block">
                Report Regulatory Status:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateReportStatus(selectedReport.id, 'Under Review')}
                  className="p-1.5 bg-[#14251F] hover:border-[#EAE8DF] border border-[#A8B5A5]/30 text-[10px] uppercase text-[#A8B5A5]"
                >
                  Mark In Review
                </button>
                <button
                  type="button"
                  onClick={() => updateReportStatus(selectedReport.id, 'Approved')}
                  className="p-1.5 bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] font-bold text-[10px] uppercase"
                >
                  Approve Report
                </button>
                <button
                  type="button"
                  onClick={() => updateReportStatus(selectedReport.id, 'Published')}
                  className="p-1.5 bg-[#667B70] hover:bg-[#667B70]/90 text-[#14251F] font-bold text-[10px] uppercase col-span-2"
                >
                  Publish to Citizen Portal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: 9-Section Formal Investigation Report Preview (8 cols) */}
        {selectedReport && (
          <article className="lg:col-span-8 bg-[#252C28] border border-[#A8B5A5]/25 p-6 md:p-8 space-y-6 print:bg-white print:text-black">
            {/* Formal Docket Letterhead */}
            <div className="border-b-2 border-[#A8B5A5]/30 pb-4 space-y-2">
              <div className="flex justify-between items-start text-xs font-mono text-[#A8B5A5]">
                <span>MAHARASHTRA POLLUTION CONTROL BOARD</span>
                <span>CONFIDENTIAL STATUTORY DOSSIER</span>
              </div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#EAE8DF]">
                {selectedReport.title}
              </div>
              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#A8B5A5] pt-1">
                <div>Dossier Reference: <strong className="text-[#EAE8DF]">{selectedReport.report_number}</strong></div>
                <div>Incident Docket: <strong className="text-[#C77B43]">{selectedReport.complaint_number}</strong></div>
                <div>Status: <span className={`px-2 py-0.5 border ${getStatusBadge(selectedReport.status)}`}>{selectedReport.status}</span></div>
              </div>
            </div>

            {/* 1. Incident Overview */}
            <section className="space-y-1 font-mono text-xs">
              <h4 className="text-[11px] uppercase tracking-wider text-[#C77B43] font-bold">
                1. Incident Overview &amp; Reception
              </h4>
              <p className="text-[#EAE8DF]/90 leading-relaxed bg-[#14251F] p-3 border border-[#A8B5A5]/15">
                On 2026-11-03 at 18:52 IST, public complaint {selectedReport.complaint_number} was logged via mobile geotagged portal from Chembur Colony Sector 4 (19.0580° N, 72.8980° E). Complainant documented heavy white-grey particulate smoke drifting into residential housing with sharp chemical and polymer burning odors.
              </p>
            </section>

            {/* 2. Location & Environmental Context */}
            <section className="space-y-1 font-mono text-xs">
              <h4 className="text-[11px] uppercase tracking-wider text-[#C77B43] font-bold">
                2. Location &amp; Atmospheric Context
              </h4>
              <p className="text-[#EAE8DF]/90 leading-relaxed bg-[#14251F] p-3 border border-[#A8B5A5]/15">
                Surveillance occurred under stable evening meteorological conditions. Surface wind vectors averaged 4.2 m/s along 108° azimuth (East-South-East). Atmospheric boundary layer was capped at 420 meters under Class D neutral dispersion stability, constraining ground-level dilution across the Chembur-Govandi arterial corridor.
              </p>
            </section>

            {/* 3. Investigation Methodology */}
            <section className="space-y-1 font-mono text-xs">
              <h4 className="text-[11px] uppercase tracking-wider text-[#C77B43] font-bold">
                3. Technical Investigation Methodology
              </h4>
              <p className="text-[#EAE8DF]/90 leading-relaxed bg-[#14251F] p-3 border border-[#A8B5A5]/15">
                Investigation applied deterministic Lagrangian backward trajectory modeling (0.75-hr lookback), continuous particulate anomaly detection via CPCB CAAQMS sensor grid (Isolation Forest algorithm), and chemical mass speciation apportionment (EPA Chemical Mass Balance CMB 8.2 compatible).
              </p>
            </section>

            {/* 4. Evidence Examined */}
            <section className="space-y-1 font-mono text-xs">
              <h4 className="text-[11px] uppercase tracking-wider text-[#C77B43] font-bold">
                4. Examined Empirical Evidence
              </h4>
              <div className="bg-[#14251F] p-3 border border-[#A8B5A5]/15 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#A8B5A5]">&bull; CPCB Govandi East Sensor:</span>
                  <span className="text-[#C77B43] font-bold">PM2.5: 218.4 µg/m³ (AQI 375, Very Poor)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A8B5A5]">&bull; Upwind Trajectory Distance:</span>
                  <span className="text-[#EAE8DF]">3.42 km along 108° azimuth (28-min transport)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A8B5A5]">&bull; Corroborating Filings:</span>
                  <span className="text-[#EAE8DF]">6 recurring complaints in Govandi-Mankhurd scrap perimeter</span>
                </div>
              </div>
            </section>

            {/* 5. Chemical Composition Findings */}
            <section className="space-y-1 font-mono text-xs">
              <h4 className="text-[11px] uppercase tracking-wider text-[#C77B43] font-bold">
                5. Chemical Speciation &amp; Mass Balance Findings
              </h4>
              <p className="text-[#EAE8DF]/90 leading-relaxed bg-[#14251F] p-3 border border-[#A8B5A5]/15">
                Receptor filter mass balance correlated at <strong>86.8% similarity</strong> with EPA SPECIATE Profile 8402 (<em>Municipal Waste Open Burning</em>). Particulate fractions: Sulphates (32%), Nitrates (24%), Organic Carbon (18%), Elemental Carbon (14%), and Heavy Metals/Chlorides (12%). High OC/EC ratio (1.28) and trace chloride signatures conclusively rule out clean natural gas or heavy boiler operations.
              </p>
            </section>

            {/* 6. Potential Source Analysis */}
            <section className="space-y-1 font-mono text-xs">
              <h4 className="text-[11px] uppercase tracking-wider text-[#C77B43] font-bold">
                6. Potential Source Candidate Analysis
              </h4>
              <div className="bg-[#14251F] p-3 border border-[#A8B5A5]/15 space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-[#EAE8DF]">#1 Govandi - Mankhurd Scrap Sorting Yards</span>
                  <span className="text-[#C77B43]">Score: 88.6 / 100 (High)</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-[#EAE8DF]">#2 Deonar Solid Waste Landfill Ground</span>
                  <span className="text-[#C77B43]">Score: 87.2 / 100 (High)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A8B5A5]">#3 Trombay Industrial Complex</span>
                  <span className="text-[#A8B5A5]">Score: 48.0 / 100 (Crosswind Excluded)</span>
                </div>
              </div>
            </section>

            {/* 7. Main Findings */}
            <section className="space-y-1 font-mono text-xs">
              <h4 className="text-[11px] uppercase tracking-wider text-[#C77B43] font-bold">
                7. Technical Findings
              </h4>
              <p className="text-[#EAE8DF]/90 leading-relaxed bg-[#14251F] p-3 border border-[#C77B43]/40">
                Informal polymer scrap recycling and open refuse smoldering in the Govandi-Mankhurd scrap yards represents the primary plausible origin for the residential smoke event at Chembur Colony.
              </p>
            </section>

            {/* 8. Uncertainty & Limitations */}
            <section className="space-y-1 font-mono text-xs">
              <h4 className="text-[11px] uppercase tracking-wider text-[#B65348] font-bold">
                8. Scientific Limitations &amp; Procedural Uncertainty
              </h4>
              <p className="text-[#A8B5A5] leading-relaxed bg-[#14251F] p-3 border border-[#A8B5A5]/15">
                Algorithmic scores represent priority dispatch heuristics and do not constitute an accusation of individual guilt or formal conviction. Physical squad audit and stack grab samples are mandatory prior to statutory judicial enforcement.
              </p>
            </section>

            {/* 9. Recommended Next Steps */}
            <section className="space-y-1 font-mono text-xs">
              <h4 className="text-[11px] uppercase tracking-wider text-[#667B70] font-bold">
                9. Recommended Regulatory Next Steps
              </h4>
              <p className="text-[#EAE8DF]/90 leading-relaxed bg-[#14251F] p-3 border border-[#667B70]/40">
                {selectedReport.statutory_recommendation}
              </p>
            </section>

            {/* Signatures */}
            <div className="pt-4 border-t border-[#A8B5A5]/20 flex justify-between font-mono text-xs text-[#A8B5A5]">
              <div>
                <span className="block font-bold text-[#EAE8DF]">Officer R. K. Patil</span>
                <span className="text-[10px]">Regional Surveillance Officer</span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-[#EAE8DF]">Dr. Sunita Deshmukh</span>
                <span className="text-[10px]">Senior Scientific Analyst</span>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

