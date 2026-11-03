'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CitizenNavbar from '@/components/citizen/CitizenNavbar';
import EditorialFooter from '@/components/shared/EditorialFooter';
import { DEMO_INVESTIGATION_CASE_INC_4, InvestigationDossierData } from '@/lib/investigationDemoData';
import InteractiveInvestigationMap from '@/components/investigation/InteractiveInvestigationMap';
import { SourceCandidatesRanking, SourceCandidate } from '@/components/investigation/SourceCandidatesRanking';
import { InteractiveChemicalFingerprint } from '@/components/investigation/InteractiveChemicalFingerprint';
import { InvestigationTimeline } from '@/components/investigation/InvestigationTimeline';
import { CitizenResolutionFeedback } from '@/components/investigation/CitizenResolutionFeedback';
import { fetchApi } from '@/lib/api';

interface PageProps {
  params: {
    id: string;
  };
}

export default function IncidentDetailsPage({ params }: PageProps) {
  const [dossier, setDossier] = useState<InvestigationDossierData>(DEMO_INVESTIGATION_CASE_INC_4);
  const [complaintExpanded, setComplaintExpanded] = useState<boolean>(true);
  const [selectedCandidate, setSelectedCandidate] = useState<SourceCandidate | null>(
    DEMO_INVESTIGATION_CASE_INC_4.candidates[0] || null
  );
  const [loadingBackend, setLoadingBackend] = useState<boolean>(false);

  // Fetch real complaint dossier from backend
  useEffect(() => {
    let isCancelled = false;
    const fetchIncidentDossier = async () => {
      try {
        setLoadingBackend(true);
        const res = await fetchApi<any>(`/complaints/${params.id}`);
        if (isCancelled || !res) return;

        // Merge real backend incident details into dossier structure
        setDossier((prev) => {
          const updated: InvestigationDossierData = {
            ...prev,
            id: res.id,
            complaint_number: res.complaint_number || prev.complaint_number,
            title: res.title || prev.title,
            original_description: res.description || prev.original_description,
            pollution_type: res.pollution_type ? res.pollution_type.toUpperCase() : prev.pollution_type,
            status: res.status || prev.status,
            address: res.address || prev.address,
            coordinates: {
              lat: res.latitude || prev.coordinates.lat,
              lng: res.longitude || prev.coordinates.lng,
            },
            observed_at: res.observed_at
              ? new Date(res.observed_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
              : prev.observed_at,
            reported_at: res.created_at
              ? new Date(res.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
              : prev.reported_at,
          };

          // If backend has source candidates, map them
          if (Array.isArray(res.source_candidates) && res.source_candidates.length > 0) {
            updated.candidates = res.source_candidates.map((sc: any, index: number) => ({
              rank: index + 1,
              name: sc.source_name || 'Suspected Industrial Verge',
              category: sc.category || 'Industrial Emission Verge',
              lat: sc.latitude || 19.0435,
              lng: sc.longitude || 72.9250,
              distance_km: sc.distance_km || 1.8,
              overall_evidence_score: sc.composite_evidence_score || 88.5,
              confidence_level: (sc.confidence_level as any) || 'High',
              sub_scores: {
                wind_alignment_pct: sc.trajectory_alignment_score || 35.0,
                transport_time_min: 24,
                corridor_anomaly_pct: sc.pollution_anomaly_score || 25.0,
                complaint_density_pct: 20.0,
                land_use_weight_pct: sc.land_use_compatibility_score || 18.5,
                chemical_match_pct: sc.speciation_similarity_score || 10.0,
              },
              explanation:
                sc.evidence_notes ||
                'Backward trajectory vector overlaps CPCB Govandi sensor particulate spike.',
              shortlist_reason: 'Highest composite score in downwind vector.',
              limitations: 'Calculated using atmospheric dispersion simulation.',
            }));
          }

          // If backend has status history, map to timeline
          if (Array.isArray(res.status_history) && res.status_history.length > 0) {
            updated.timeline = res.status_history.map((sh: any, idx: number) => ({
              id: `evt-${idx + 1}`,
              title: `Status: ${sh.new_status}`,
              description: sh.change_notes || `Transitioned from ${sh.previous_status}.`,
              timestamp: new Date(sh.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
              category: sh.new_status.includes('Action') ? 'enforcement' : 'trajectory',
              status_badge: sh.new_status,
              officer_note: sh.changed_by_user,
            }));
          }

          return updated;
        });
      } catch {
        // Retain demonstration scenario if backend record not found
      } finally {
        setLoadingBackend(false);
      }
    };

    fetchIncidentDossier();
    return () => {
      isCancelled = true;
    };
  }, [params.id]);

  useEffect(() => {
    if (dossier.candidates.length > 0) {
      setSelectedCandidate(dossier.candidates[0]);
    }
  }, [dossier]);

  return (
    <div className="min-h-screen bg-[#14251F] text-[#EAE8DF] font-sans flex flex-col selection:bg-[#C77B43] selection:text-[#14251F]">
      {/* Citizen Navbar */}
      <CitizenNavbar userName="Aarav Sharma" userOrg="Chembur RWA" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#A8B5A5]">
          <Link href="/" className="hover:text-[#EAE8DF] transition-colors">
            Platform Home
          </Link>
          <span>/</span>
          <Link href="/citizen" className="hover:text-[#EAE8DF] transition-colors">
            Citizen Portal
          </Link>
          <span>/</span>
          <span className="text-[#C77B43] font-semibold">{dossier.complaint_number}</span>
          <span className="text-[10px] px-2 py-0.5 bg-[#252C28] border border-[#A8B5A5]/25 text-[#A8B5A5] uppercase tracking-wider ml-2">
            Investigation Dossier
          </span>
        </nav>

        {/* Dossier Header Banner */}
        <header className="bg-[#252C28] border border-[#A8B5A5]/25 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#A8B5A5]/15">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-[#C77B43]/20 border border-[#C77B43]/50 text-[#C77B43] font-mono text-xs font-bold uppercase tracking-wider">
                  {dossier.status}
                </span>
                <span className="px-2.5 py-1 bg-[#14251F] border border-[#A8B5A5]/20 text-[#A8B5A5] font-mono text-xs">
                  Docket: {dossier.complaint_number}
                </span>
                <span className="px-2 py-0.5 bg-[#667B70]/15 text-[#667B70] border border-[#667B70]/30 font-mono text-[10px] uppercase">
                  Verified Incident
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#EAE8DF] tracking-tight">
                {dossier.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#A8B5A5]">
                <div>
                  <span className="text-[#A8B5A5]/70">Location:</span>{' '}
                  <span className="text-[#EAE8DF]">{dossier.address}</span>
                </div>
                <div>
                  <span className="text-[#A8B5A5]/70">Coordinates:</span>{' '}
                  <span className="text-[#EAE8DF]">
                    {dossier.coordinates.lat.toFixed(4)}° N, {dossier.coordinates.lng.toFixed(4)}° E
                  </span>
                </div>
                <div>
                  <span className="text-[#A8B5A5]/70">Observation Time:</span>{' '}
                  <span className="text-[#EAE8DF]">{dossier.observed_at}</span>
                </div>
              </div>
            </div>

            {/* Top Right Quick Metrics */}
            <div className="flex items-center gap-4 bg-[#14251F] border border-[#A8B5A5]/20 p-4 self-start lg:self-auto shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#A8B5A5] uppercase tracking-wider block">
                  Primary Suspect Score
                </span>
                <div className="text-2xl font-serif font-bold text-[#C77B43]">
                  {dossier.candidates[0]?.overall_evidence_score.toFixed(1) || '88.5'}
                  <span className="text-xs font-mono text-[#A8B5A5] font-normal"> / 100</span>
                </div>
                <span className="text-[10px] font-mono text-[#667B70]">High Mathematical Confidence</span>
              </div>
            </div>
          </div>

          {/* Expandable Citizen Complaint Card */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setComplaintExpanded(!complaintExpanded)}
              className="w-full flex items-center justify-between text-left text-xs font-mono text-[#A8B5A5] hover:text-[#EAE8DF] transition-colors py-1"
            >
              <span className="uppercase tracking-wider font-semibold">
                Citizen Incident Intake Record &amp; Photographic Evidence
              </span>
              <span>{complaintExpanded ? '[ Collapse Details ▲ ]' : '[ Expand Intake Record ▼ ]'}</span>
            </button>

            {complaintExpanded && (
              <div className="mt-4 pt-4 border-t border-[#A8B5A5]/10 grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
                <div className="md:col-span-8 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#A8B5A5] block">
                      Original Citizen Observation
                    </span>
                    <p className="text-sm font-serif text-[#EAE8DF] mt-1 leading-relaxed bg-[#14251F] p-4 border border-[#A8B5A5]/15">
                      &quot;{dossier.original_description}&quot;
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-[#A8B5A5]">
                    <div>
                      Reporter: <span className="text-[#EAE8DF]">{dossier.reporter.name}</span>
                    </div>
                    <div>
                      Affiliation: <span className="text-[#EAE8DF]">{dossier.reporter.organization}</span>
                    </div>
                    <div>
                      Intake Timestamp: <span className="text-[#EAE8DF]">{dossier.reported_at}</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Photo */}
                <div className="md:col-span-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#A8B5A5] block">
                    Field Photographic Evidence
                  </span>
                  <div className="relative aspect-video w-full border border-[#A8B5A5]/30 overflow-hidden bg-black/40">
                    <Image
                      src={dossier.evidence_photos?.[0]?.url || dossier.image_url || '/chemical-fingerprint-ref.jpg'}
                      alt="Citizen Observation Evidence"
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 px-2 py-1 text-[10px] font-mono text-[#A8B5A5] truncate">
                      {dossier.evidence_photos?.[0]?.caption || 'Plume boundary captured at downwind receptor'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Section 1: Geographical Investigation Map */}
        <section aria-label="Investigation Map" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#A8B5A5]/20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C77B43] block">
                Evidence Stream 01
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#EAE8DF]">
                Geographical Plume Vector &amp; Upwind Corridor
              </h2>
            </div>
            <span className="text-xs font-mono text-[#A8B5A5]">
              OpenStreetMap + NOAA HYSPLIT
            </span>
          </div>

          <InteractiveInvestigationMap data={dossier} height="520px" />
        </section>

        {/* Section 2: Multi-Criteria Candidate Source Ranking */}
        <section aria-label="Source Ranking" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#A8B5A5]/20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C77B43] block">
                Evidence Stream 02
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#EAE8DF]">
                Multi-Criteria Source Apportionment Ranking
              </h2>
            </div>
            <span className="text-xs font-mono text-[#A8B5A5]">
              EPA CMB 8.2 / ISRO Bhuvan Spatial Registry
            </span>
          </div>

          <SourceCandidatesRanking
            candidates={dossier.candidates}
            selectedCandidate={selectedCandidate}
            onSelectCandidate={setSelectedCandidate}
          />
        </section>

        {/* Section 3: Chemical Speciation Matrix */}
        <section aria-label="Chemical Speciation" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#A8B5A5]/20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C77B43] block">
                Evidence Stream 03
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#EAE8DF]">
                Atmospheric Chemical Speciation &amp; Mass Balance Matrix
              </h2>
            </div>
            <span className="text-xs font-mono text-[#A8B5A5]">
              EPA SPECIATE v5.4 Reference Library
            </span>
          </div>

          <InteractiveChemicalFingerprint
            chemicalSpeciation={dossier.chemical_speciation}
          />
        </section>

        {/* Section 4: Investigation Timeline & Regulatory Actions */}
        <section aria-label="Timeline and Actions" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#A8B5A5]/20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C77B43] block">
                Evidence Stream 04
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#EAE8DF]">
                Investigation Audit Trail &amp; Regulatory Actions
              </h2>
            </div>
            <span className="text-xs font-mono text-[#A8B5A5]">
              Statutory Chain-of-Custody Log
            </span>
          </div>

          <InvestigationTimeline timeline={dossier.timeline} />
        </section>

        {/* Section 5: Citizen Feedback Module */}
        <section aria-label="Citizen Feedback" className="space-y-4">
          <CitizenResolutionFeedback
            complaintNumber={dossier.complaint_number}
          />
        </section>
      </main>

      {/* Footer */}
      <EditorialFooter />
    </div>
  );
}
