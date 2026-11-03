'use client';

import React from 'react';
import Link from 'next/link';
import { GovernmentShell } from '@/components/government/GovernmentShell';
import { useGovernment } from '@/lib/governmentContext';
import { GovernmentOverviewMap } from '@/components/government/GovernmentOverviewMap';

function DashboardContent() {
  const { incidents, actions, reports } = useGovernment();

  const totalIncidents = 28; // Regional aggregate demonstration
  const awaitingReview = incidents.filter((i) => i.status === 'Submitted' || i.status === 'Under Review').length + 2;
  const activeInvestigations = incidents.filter((i) => i.status === 'Under Investigation').length + 5;
  const highPriority = incidents.filter((i) => i.priority === 'Critical' || i.priority === 'High').length;
  const pendingActions = actions.filter((a) => a.status !== 'Completed').length;
  const resolvedCount = 12;

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-[#B65348] border-[#B65348]/40 bg-[#B65348]/10';
      case 'High':
        return 'text-[#C77B43] border-[#C77B43]/40 bg-[#C77B43]/10';
      case 'Medium':
        return 'text-[#EAE8DF] border-[#A8B5A5]/30 bg-[#252C28]';
      default:
        return 'text-[#A8B5A5] border-[#A8B5A5]/20 bg-[#14251F]';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Under Investigation':
        return 'text-[#C77B43] border-[#C77B43]/50';
      case 'Action Initiated':
        return 'text-[#C77B43] border-[#C77B43]/40';
      case 'Awaiting Information':
        return 'text-[#B65348] border-[#B65348]/50';
      case 'Resolved':
        return 'text-[#667B70] border-[#667B70]/50';
      default:
        return 'text-[#A8B5A5] border-[#A8B5A5]/30';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Welcome & Sub-command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#A8B5A5]/15 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C77B43] animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C77B43]">
              Regional Environmental Surveillance Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAE8DF]">
            Executive Environmental Command Overview
          </h1>
          <p className="text-xs font-mono text-[#A8B5A5] mt-1">
            Real-time multi-criteria incident triage, telemetry anomaly detection, and statutory enforcement tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/government/incidents"
            className="px-4 py-2 bg-[#252C28] hover:bg-[#C77B43] hover:text-[#14251F] border border-[#A8B5A5]/30 text-xs font-mono text-[#EAE8DF] transition-colors uppercase tracking-wider"
          >
            Review Incidents ({incidents.length})
          </Link>
          <Link
            href="/government/actions"
            className="px-4 py-2 bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            Dispatch Action &rarr;
          </Link>
        </div>
      </div>

      {/* A. Asymmetric Operational Statistics */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Operational Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Incidents */}
          <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20">
            <span className="text-[10px] font-mono uppercase text-[#A8B5A5] block">
              Total Reported
            </span>
            <div className="text-3xl font-mono font-bold text-[#EAE8DF] mt-1">
              {totalIncidents}
            </div>
            <span className="text-[9px] font-mono text-[#A8B5A5]/60 mt-1 block">
              Eastern Suburbs Ward M
            </span>
          </div>

          {/* Awaiting Review */}
          <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20">
            <span className="text-[10px] font-mono uppercase text-[#A8B5A5] block">
              Awaiting Review
            </span>
            <div className="text-3xl font-mono font-bold text-[#EAE8DF] mt-1">
              {awaitingReview}
            </div>
            <span className="text-[9px] font-mono text-[#C77B43] mt-1 block">
              Triage pending
            </span>
          </div>

          {/* Active Investigations */}
          <div className="p-4 bg-[#252C28] border border-[#C77B43]/50">
            <span className="text-[10px] font-mono uppercase text-[#C77B43] block font-bold">
              Active Investigations
            </span>
            <div className="text-3xl font-mono font-bold text-[#C77B43] mt-1">
              {activeInvestigations}
            </div>
            <span className="text-[9px] font-mono text-[#EAE8DF]/80 mt-1 block">
              Trajectories modeled
            </span>
          </div>

          {/* High Priority */}
          <div className="p-4 bg-[#252C28] border border-[#B65348]/50">
            <span className="text-[10px] font-mono uppercase text-[#B65348] block font-bold">
              Critical &amp; High Priority
            </span>
            <div className="text-3xl font-mono font-bold text-[#B65348] mt-1">
              {highPriority}
            </div>
            <span className="text-[9px] font-mono text-[#B65348]/90 mt-1 block">
              Immediate inspection
            </span>
          </div>

          {/* Actions Pending */}
          <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20">
            <span className="text-[10px] font-mono uppercase text-[#A8B5A5] block">
              Actions Pending
            </span>
            <div className="text-3xl font-mono font-bold text-[#EAE8DF] mt-1">
              {pendingActions}
            </div>
            <span className="text-[9px] font-mono text-[#A8B5A5]/60 mt-1 block">
              Squad dispatched
            </span>
          </div>

          {/* Resolved */}
          <div className="p-4 bg-[#252C28] border border-[#667B70]/50">
            <span className="text-[10px] font-mono uppercase text-[#667B70] block font-bold">
              Verified Resolved
            </span>
            <div className="text-3xl font-mono font-bold text-[#667B70] mt-1">
              {resolvedCount}
            </div>
            <span className="text-[9px] font-mono text-[#667B70]/90 mt-1 block">
              Citizen confirmed
            </span>
          </div>
        </div>
      </section>

      {/* B. Environmental Overview Map */}
      <section aria-labelledby="gis-overview-heading">
        <GovernmentOverviewMap incidents={incidents} />
      </section>

      {/* C. Incident Management Table & Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Incident Overview Table (8 cols) */}
        <section aria-labelledby="recent-incidents-heading" className="lg:col-span-8 bg-[#14251F] border border-[#A8B5A5]/25 p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A8B5A5]/15">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C77B43] block">
                Public Complaints Docket
              </span>
              <h2 id="recent-incidents-heading" className="text-lg font-serif text-[#EAE8DF]">
                Active Regional Incident Roster
              </h2>
            </div>
            <Link
              href="/government/incidents"
              className="text-xs font-mono text-[#C77B43] hover:underline"
            >
              View Full Incident Console &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#A8B5A5]/20 text-[#A8B5A5] text-[10px] uppercase">
                  <th className="py-2.5 px-3">Docket</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Assigned Officer</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A8B5A5]/10">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-[#252C28]/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#EAE8DF]">
                      {inc.complaint_number}
                    </td>
                    <td className="py-3 px-3 text-[#A8B5A5]">
                      {inc.pollution_type}
                    </td>
                    <td className="py-3 px-3 text-[#EAE8DF] truncate max-w-[140px]">
                      {inc.location_name}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] border uppercase font-bold ${getPriorityStyle(inc.priority)}`}>
                        {inc.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] border uppercase ${getStatusStyle(inc.status)}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#A8B5A5] text-[11px]">
                      {inc.assigned_officer || 'Unassigned'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/government/investigation?id=${inc.id}`}
                        className="px-2.5 py-1 bg-[#252C28] hover:bg-[#C77B43] hover:text-[#14251F] border border-[#A8B5A5]/30 text-[10px] uppercase transition-colors"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Real-time Alerts & Activity Feed (4 cols) */}
        <section aria-labelledby="activity-stream-heading" className="lg:col-span-4 bg-[#252C28] border border-[#A8B5A5]/25 p-5 space-y-4 font-mono text-xs">
          <div className="pb-3 border-b border-[#A8B5A5]/15">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#667B70] block">
              Surveillance Stream
            </span>
            <h2 id="activity-stream-heading" className="text-base font-serif text-[#EAE8DF]">
              Recent Activity &amp; Statutory Alerts
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#14251F] border border-[#B65348]/40 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#B65348] font-bold uppercase">Sensor Anomaly Spike</span>
                <span className="text-[#A8B5A5]">18:56 IST</span>
              </div>
              <p className="text-[#EAE8DF] text-[11px] leading-snug">
                CPCB Govandi East recorded PM2.5 spike to 218 µg/m³ along 108° ESE vector.
              </p>
            </div>

            <div className="p-3 bg-[#14251F] border border-[#C77B43]/40 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#C77B43] font-bold uppercase">Squad Dispatch Order</span>
                <span className="text-[#A8B5A5]">19:15 IST</span>
              </div>
              <p className="text-[#EAE8DF] text-[11px] leading-snug">
                Officer R. K. Patil assigned to physical inspection of Mankhurd scrap recycling yards.
              </p>
            </div>

            <div className="p-3 bg-[#14251F] border border-[#667B70]/40 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#667B70] font-bold uppercase">Corrective Dousing</span>
                <span className="text-[#A8B5A5]">11:45 IST</span>
              </div>
              <p className="text-[#EAE8DF] text-[11px] leading-snug">
                Ward M/E team deployed water tanker for smoldering refuse berm at Deonar landfill boundary.
              </p>
            </div>

            <div className="p-3 bg-[#14251F] border border-[#A8B5A5]/20 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#A8B5A5] font-bold uppercase">Citizen Ingestion</span>
                <span className="text-[#A8B5A5]">18:52 IST</span>
              </div>
              <p className="text-[#EAE8DF] text-[11px] leading-snug">
                Geotagged complaint INC-2026-0004 validated from Chembur Resident Welfare Association.
              </p>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-[#A8B5A5]/70 border-t border-[#A8B5A5]/10">
            * All telemetry readings and dispatch logs are illustrative demonstration data.
          </div>
        </section>
      </div>
    </div>
  );
}

export default function GovernmentDashboardPage() {
  return (
    <GovernmentShell>
      <DashboardContent />
    </GovernmentShell>
  );
}
