'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CitizenNavbar from '@/components/citizen/CitizenNavbar';
import EditorialFooter from '@/components/shared/EditorialFooter';
import { DEMO_TRACKING_CASES, TrackingIncident } from '@/lib/trackingDemoData';
import { TrackingStatusBanner } from '@/components/tracking/TrackingStatusBanner';
import { TrackingTimelineView } from '@/components/tracking/TrackingTimelineView';
import { CitizenFeedbackForm } from '@/components/tracking/CitizenFeedbackForm';
import { TrackingReportFilter } from '@/components/tracking/TrackingReportFilter';

function TrackingContent() {
  const searchParams = useSearchParams();
  const queryParamId = searchParams.get('id');

  // Determine initial selected incident
  const initialSelected = useMemo(() => {
    if (queryParamId) {
      const match = DEMO_TRACKING_CASES.find(
        (c) =>
          c.id.toString() === queryParamId ||
          c.complaint_number.toLowerCase() === queryParamId.toLowerCase()
      );
      if (match) return match;
    }
    return DEMO_TRACKING_CASES[0];
  }, [queryParamId]);

  const [selectedIncident, setSelectedIncident] = useState<TrackingIncident>(initialSelected);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');

  // Filtered list
  const filteredIncidents = useMemo(() => {
    return DEMO_TRACKING_CASES.filter((inc) => {
      // Search
      const matchesSearch =
        searchQuery === '' ||
        inc.complaint_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.location_name.toLowerCase().includes(searchQuery.toLowerCase());

      // Status
      const matchesStatus =
        statusFilter === 'All' || inc.status === statusFilter;

      // Category
      const matchesCategory =
        categoryFilter === 'All Categories' || inc.pollution_type === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#14251F] text-[#EAE8DF] font-sans flex flex-col selection:bg-[#C77B43] selection:text-[#14251F]">
      {/* Platform Navigation */}
      <CitizenNavbar userName="Aarav Sharma" userOrg="Chembur RWA" />

      {/* Main Tracking Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
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
          <span className="text-[#C77B43] font-semibold">Complaint Tracking &amp; Feedback</span>
        </nav>

        {/* Section Header */}
        <div className="bg-[#252C28] border border-[#A8B5A5]/25 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[#A8B5A5]/15">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#C77B43]" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C77B43]">
                  Public Accountability &amp; Status Register
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#EAE8DF] tracking-tight">
                Environmental Incident Tracking Console
              </h1>
              <p className="text-xs sm:text-sm font-mono text-[#A8B5A5] mt-1 max-w-3xl leading-relaxed">
                Monitor investigation stages, inspect executing authority logs, review next operational steps, and provide verification feedback on recorded abatement actions.
              </p>
            </div>

            <div className="font-mono text-xs text-[#A8B5A5] px-3 py-2 bg-[#14251F] border border-[#A8B5A5]/20 self-start md:self-auto shrink-0 space-y-1">
              <div>
                Active Citizen Docket: <span className="text-[#EAE8DF] font-bold">5 Registered</span>
              </div>
              <div className="text-[10px] text-[#C77B43]">
                Demonstration Registry: Eastern Suburbs
              </div>
            </div>
          </div>

          {/* Quick Guidance Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-between text-xs font-mono text-[#A8B5A5] gap-3">
            <div className="flex items-center gap-4">
              <span>Selected Docket: <strong className="text-[#EAE8DF]">{selectedIncident.complaint_number}</strong></span>
              <span>&bull;</span>
              <span>Status: <strong className="text-[#C77B43]">{selectedIncident.status}</strong></span>
            </div>
            <a
              href="#feedback-section"
              className="text-[#C77B43] hover:underline"
            >
              Jump to Citizen Feedback &darr;
            </a>
          </div>
        </div>

        {/* 2-Column Tracking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Search, Filter, and Incident Selector (4 cols) */}
          <aside className="lg:col-span-4 space-y-4">
            <TrackingReportFilter
              incidents={filteredIncidents}
              selectedId={selectedIncident.id}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
            />

            {/* Quick Helper Box */}
            <div className="p-4 bg-[#1B201D] border border-[#A8B5A5]/20 text-xs font-mono text-[#A8B5A5] space-y-2">
              <span className="text-[10px] uppercase text-[#EAE8DF] font-bold block">
                Understanding Docket Progression:
              </span>
              <p className="leading-relaxed text-[11px]">
                Status changes are recorded chronologically. Investigation dockets automatically link meteorological backtracking, corridor sensor anomalies, and physical inspection squad dispatches under statutory oversight.
              </p>
            </div>
          </aside>

          {/* Right Column: Detailed Tracking View, Timeline & Feedback (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Dominant Status Banner & What Happens Next */}
            <TrackingStatusBanner incident={selectedIncident} />

            {/* Detailed Tracking Timeline */}
            <TrackingTimelineView stages={selectedIncident.stages} />

            {/* Citizen Feedback & Verification Interface */}
            <CitizenFeedbackForm incident={selectedIncident} />
          </div>
        </div>
      </main>

      {/* Editorial Footer */}
      <EditorialFooter />
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#14251F] text-[#EAE8DF] flex items-center justify-center font-mono text-xs">
          Loading Tracking Console...
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}

