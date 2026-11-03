'use client';

import React from 'react';
import MainNavigation from '@/components/shared/MainNavigation';
import ProgressNavigation from '@/components/shared/ProgressNavigation';
import HeroScene from '@/components/landing/HeroScene';
import ProblemChapter from '@/components/landing/ProblemChapter';
import ReportingChapter from '@/components/landing/ReportingChapter';
import TrajectoryChapter from '@/components/landing/TrajectoryChapter';
import SourceRankingChapter from '@/components/landing/SourceRankingChapter';
import ChemicalFingerprint from '@/components/landing/ChemicalFingerprint';
import EvidenceDossierChapter from '@/components/landing/EvidenceDossierChapter';
import EnforcementChapter from '@/components/landing/EnforcementChapter';
import PortalAccessChapter from '@/components/landing/PortalAccessChapter';
import EditorialFooter from '@/components/shared/EditorialFooter';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-forest-charcoal text-ivory-warm selection:bg-accent-orange selection:text-ivory-warm">
      {/* Restrained Platform Navigation Header */}
      <MainNavigation />

      {/* Floating Vertical Chapter Progress Navigation */}
      <ProgressNavigation />

      {/* Chapter 01: Hero Scene with User-Provided Photograph */}
      <HeroScene />

      {/* Chapter 02: Atmospheric Dispersion in Industrial Corridors */}
      <ProblemChapter />

      {/* Chapter 03: Citizen Incident Intake */}
      <ReportingChapter />

      {/* Chapter 04: Backward Lagrangian Plume Trajectory */}
      <TrajectoryChapter />

      {/* Chapter 05: Multi-Criteria Source Candidate Ranking */}
      <SourceRankingChapter />

      {/* Chapter 06: Interactive Chemical Fingerprint Matrix */}
      <ChemicalFingerprint />

      {/* Chapter 07: Four-Quadrant Legal Dossier */}
      <EvidenceDossierChapter />

      {/* Chapter 08: Regulatory Enforcement & Citizen Verification */}
      <EnforcementChapter />

      {/* Chapter 09: Platform Gateways & Operational Entry */}
      <PortalAccessChapter />

      {/* Formal Platform Footer with Terms & Privacy */}
      <EditorialFooter />
    </div>
  );
}
