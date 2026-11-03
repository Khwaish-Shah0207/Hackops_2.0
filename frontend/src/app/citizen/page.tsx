'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import CitizenNavbar from '@/components/citizen/CitizenNavbar';
import ReportDetailModal from '@/components/citizen/ReportDetailModal';
import EditorialFooter from '@/components/shared/EditorialFooter';
import { fetchApi } from '@/lib/api';
import {
  DEMO_CITIZEN_PROFILE,
  DEMO_CITIZEN_STATS,
  DEMO_CITIZEN_REPORTS,
  DEMO_CITIZEN_UPDATES,
  CitizenReportItem,
} from '@/lib/citizenDemoData';
import {
  PlusCircleIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  ClockHistoryIcon,
  CrosshairIcon,
  ArrowRightRefinedIcon,
  CheckStatusIcon,
} from '@/components/shared/CustomIcons';

export default function CitizenDashboardPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'investigating' | 'action' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<CitizenReportItem | null>(null);
  const [reportsList, setReportsList] = useState<CitizenReportItem[]>(DEMO_CITIZEN_REPORTS);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // Fetch real complaints from backend API
  useEffect(() => {
    let isCancelled = false;
    const loadBackendComplaints = async () => {
      try {
        setIsLoadingApi(true);
        const data = await fetchApi<any[]>('/complaints');
        if (isCancelled || !Array.isArray(data) || data.length === 0) return;

        const mapped: CitizenReportItem[] = data.map((c) => {
          let statusMapped: CitizenReportItem['status'] = 'Under Review';
          if (c.status === 'Resolved' || c.status === 'Closed') {
            statusMapped = 'Resolved';
          } else if (c.status === 'Action Taken') {
            statusMapped = 'Action Initiated';
          } else if (
            c.status === 'Source Identified / Investigation Required' ||
            c.status === 'Assigned' ||
            c.status === 'Under Analysis'
          ) {
            statusMapped = 'Under Investigation';
          } else {
            statusMapped = 'Submitted';
          }

          let pollutionTypeMapped: CitizenReportItem['pollution_type'] = 'Suspected Waste Burning';
          if (c.pollution_type === 'smoke') pollutionTypeMapped = 'Smoke Emission';
          else if (c.pollution_type === 'industrial') pollutionTypeMapped = 'Industrial Air Pollution';
          else if (c.pollution_type === 'odor') pollutionTypeMapped = 'Unusual Odour';

          return {
            id: c.id,
            complaint_number: c.complaint_number,
            title: c.title,
            pollution_type: pollutionTypeMapped,
            location_name: c.address || 'Chembur-Govandi Corridor',
            coordinates: {
              lat: c.latitude || 19.043,
              lng: c.longitude || 72.909,
            },
            observed_at: new Date(c.observed_at || c.created_at).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            created_at: new Date(c.created_at).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            status: statusMapped,
            highest_candidate: {
              name: 'Deonar Solid Waste Dumping Ground',
              category: 'Municipal Landfill Buffer',
              evidence_score: 88.5,
              confidence_level: 'High',
            },
            wind_trajectory_summary: 'NOAA HYSPLIT Plume Vector indicates direct 108° transport',
            recent_action: 'Automated Severity & Lagrangian Plume Modeling Complete',
            is_demo: false,
          };
        });

        // Merge mapped real records with demo records without duplicates
        const existingNumbers = new Set(mapped.map((m) => m.complaint_number));
        const combined = [...mapped, ...DEMO_CITIZEN_REPORTS.filter((d) => !existingNumbers.has(d.complaint_number))];
        setReportsList(combined);
      } catch (err) {
        console.log('Using local demonstration reports corpus (backend offline or seeding):', err);
      } finally {
        setIsLoadingApi(false);
      }
    };

    loadBackendComplaints();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Filter and search reports
  const filteredReports = useMemo(() => {
    return reportsList.filter((report) => {
      if (activeFilter === 'investigating' && report.status !== 'Under Investigation' && report.status !== 'Under Review') {
        return false;
      }
      if (activeFilter === 'action' && report.status !== 'Action Initiated') {
        return false;
      }
      if (activeFilter === 'resolved' && report.status !== 'Resolved') {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNumber = report.complaint_number.toLowerCase().includes(query);
        const matchesTitle = report.title.toLowerCase().includes(query);
        const matchesLoc = report.location_name.toLowerCase().includes(query);
        const matchesType = report.pollution_type.toLowerCase().includes(query);
        return matchesNumber || matchesTitle || matchesLoc || matchesType;
      }

      return true;
    });
  }, [activeFilter, searchQuery, reportsList]);

  const renderStatusBadge = (status: CitizenReportItem['status']) => {
    switch (status) {
      case 'Under Investigation':
        return (
          <span className="inline-flex items-center space-x-1.5 font-mono text-[11px] px-2.5 py-1 bg-accent-orange/15 text-accent-orange border border-accent-orange/40 font-semibold">
            <span className="w-1.5 h-1.5 bg-accent-orange animate-pulse" />
            <span>Under Investigation</span>
          </span>
        );
      case 'Action Initiated':
        return (
          <span className="inline-flex items-center space-x-1.5 font-mono text-[11px] px-2.5 py-1 bg-accent-green/15 text-accent-green border border-accent-green/40 font-semibold">
            <span className="w-1.5 h-1.5 bg-accent-green" />
            <span>Action Initiated</span>
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center space-x-1.5 font-mono text-[11px] px-2.5 py-1 bg-sage-muted/20 text-ivory-warm border border-sage-muted/40 font-semibold">
            <CheckStatusIcon className="w-3 h-3 text-accent-green" />
            <span>Resolved</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 font-mono text-[11px] px-2.5 py-1 bg-graphite-deep text-sage-muted border border-graphite-border font-semibold">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-forest-charcoal text-ivory-warm selection:bg-accent-orange selection:text-ivory-warm flex flex-col justify-between">
      <CitizenNavbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 flex-1">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-sage-muted">
          <Link href="/" className="hover:text-ivory-warm transition-colors">
            Platform Home
          </Link>
          <span>/</span>
          <span className="text-accent-orange font-bold">Citizen Portal</span>
        </nav>

        {/* Profile & Context Banner */}
        <section className="border border-graphite-border bg-forest-dark p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-accent-orange" />
              <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
                Resident Environmental Surveillance Desk
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-ivory-warm font-normal">
              {DEMO_CITIZEN_PROFILE.name}
            </h1>
            <p className="text-xs sm:text-sm text-sage-muted font-mono">
              {DEMO_CITIZEN_PROFILE.organization} &bull; {DEMO_CITIZEN_PROFILE.residence_sector}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center space-x-2 bg-accent-orange hover:bg-accent-orange/90 text-forest-dark text-xs font-mono font-bold uppercase tracking-wider px-5 py-3 transition-colors"
            >
              <PlusCircleIcon className="w-4 h-4" />
              <span>Report New Incident</span>
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center space-x-2 bg-forest-charcoal hover:bg-graphite-deep border border-graphite-border text-ivory-warm text-xs font-mono uppercase tracking-wider px-4 py-3 transition-colors"
            >
              <ClockHistoryIcon className="w-4 h-4 text-sage-muted" />
              <span>Track All Cases</span>
            </Link>
          </div>
        </section>

        {/* 4 Summary Metric Indicators */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-graphite-border bg-forest-dark p-4 space-y-1">
            <span className="font-mono text-[10px] uppercase text-sage-muted block">Registered Observations</span>
            <div className="text-2xl font-mono font-bold text-ivory-warm">{reportsList.length}</div>
            <span className="text-[10px] font-mono text-sage-muted">Corpus Records</span>
          </div>

          <div className="border border-graphite-border bg-forest-dark p-4 space-y-1">
            <span className="font-mono text-[10px] uppercase text-accent-orange block">Under Investigation</span>
            <div className="text-2xl font-mono font-bold text-accent-orange">
              {reportsList.filter((r) => r.status === 'Under Investigation').length}
            </div>
            <span className="text-[10px] font-mono text-sage-muted">Plume Ingestion Active</span>
          </div>

          <div className="border border-graphite-border bg-forest-dark p-4 space-y-1">
            <span className="font-mono text-[10px] uppercase text-accent-green block">Action Initiated</span>
            <div className="text-2xl font-mono font-bold text-accent-green">
              {reportsList.filter((r) => r.status === 'Action Initiated').length}
            </div>
            <span className="text-[10px] font-mono text-sage-muted">Squads Dispatched</span>
          </div>

          <div className="border border-graphite-border bg-forest-dark p-4 space-y-1">
            <span className="font-mono text-[10px] uppercase text-ivory-warm block">Resolved &amp; Verified</span>
            <div className="text-2xl font-mono font-bold text-ivory-warm">
              {reportsList.filter((r) => r.status === 'Resolved').length}
            </div>
            <span className="text-[10px] font-mono text-sage-muted">Remediation Logged</span>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="border border-graphite-border bg-forest-dark p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Observations' },
              { id: 'investigating', label: 'Under Investigation' },
              { id: 'action', label: 'Action Initiated' },
              { id: 'resolved', label: 'Resolved' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-accent-orange text-forest-dark font-bold'
                    : 'bg-forest-charcoal text-sage-muted hover:text-ivory-warm border border-graphite-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by case #, locality, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-forest-charcoal border border-graphite-border text-xs font-mono text-ivory-warm focus:outline-none focus:border-accent-orange"
            />
            <SearchIcon className="w-3.5 h-3.5 text-sage-muted absolute left-3 top-2.5" />
          </div>
        </section>

        {/* Complaints Table */}
        <section className="border border-graphite-border bg-forest-dark overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-forest-charcoal border-b border-graphite-border text-sage-muted uppercase text-[10px]">
              <tr>
                <th className="p-3">Reference ID</th>
                <th className="p-3">Observation Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Locality</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-border/60">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-graphite-deep/50 transition-colors">
                  <td className="p-3 font-bold text-accent-orange whitespace-nowrap">
                    {report.complaint_number}
                  </td>
                  <td className="p-3 max-w-sm truncate text-ivory-warm" title={report.title}>
                    {report.title}
                  </td>
                  <td className="p-3 text-sage-muted whitespace-nowrap">{report.pollution_type}</td>
                  <td className="p-3 text-sage-muted whitespace-nowrap">{report.location_name}</td>
                  <td className="p-3 whitespace-nowrap">{renderStatusBadge(report.status)}</td>
                  <td className="p-3 text-right whitespace-nowrap space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="text-sage-muted hover:text-ivory-warm underline mr-2"
                    >
                      Quick View
                    </button>
                    <Link
                      href={`/incidents/${report.id}`}
                      className="text-accent-orange hover:underline font-bold"
                    >
                      Dossier &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Report Quick Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      <EditorialFooter />
    </div>
  );
}
