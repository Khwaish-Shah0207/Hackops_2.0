'use client';

import React from 'react';
import { TrackingIncident } from '@/lib/trackingDemoData';

interface TrackingReportFilterProps {
  incidents: TrackingIncident[];
  selectedId: number;
  onSelectIncident: (incident: TrackingIncident) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
}

export function TrackingReportFilter({
  incidents,
  selectedId,
  onSelectIncident,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
}: TrackingReportFilterProps) {
  const statuses = [
    'All',
    'Under Investigation',
    'Action Initiated',
    'Under Review',
    'Additional Information Required',
    'Resolved',
  ];

  const categories = [
    'All Categories',
    'Suspected Waste Burning',
    'Smoke Emission',
    'Industrial Air Pollution',
    'Unusual Odour',
  ];

  const getStatusBadgeStyle = (status: TrackingIncident['status']) => {
    switch (status) {
      case 'Action Initiated':
        return 'bg-[#C77B43]/20 border-[#C77B43]/50 text-[#C77B43]';
      case 'Under Investigation':
        return 'bg-[#C77B43]/15 border-[#C77B43]/40 text-[#C77B43]';
      case 'Additional Information Required':
        return 'bg-[#B65348]/20 border-[#B65348]/50 text-[#B65348]';
      case 'Resolved':
        return 'bg-[#667B70]/20 border-[#667B70]/50 text-[#667B70]';
      case 'Under Review':
        return 'bg-[#A8B5A5]/10 border-[#A8B5A5]/30 text-[#A8B5A5]';
      default:
        return 'bg-[#252C28] border-[#A8B5A5]/25 text-[#A8B5A5]';
    }
  };

  return (
    <div className="bg-[#14251F] border border-[#A8B5A5]/25 p-5 md:p-6 space-y-4">
      {/* Search Input */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#A8B5A5] mb-2">
          Search Docket by Reference ID, Keyword, or Location
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="e.g. INC-2026-0004, Chembur, scrap yards..."
            className="w-full bg-[#1B201D] border border-[#A8B5A5]/25 px-3.5 py-2.5 text-xs font-mono text-[#EAE8DF] placeholder-[#A8B5A5]/40 focus:border-[#C77B43] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-xs font-mono text-[#A8B5A5] hover:text-[#EAE8DF]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div>
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#A8B5A5] mb-2">
          <span>Filter by Status</span>
          <span>{incidents.length} Records</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {statuses.map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => onStatusFilterChange(st)}
                className={`px-2.5 py-1 text-[11px] font-mono tracking-tight transition-all border ${
                  isSelected
                    ? 'bg-[#C77B43] text-[#14251F] border-[#EAE8DF] font-bold'
                    : 'bg-[#252C28] text-[#A8B5A5] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Dropdown Filter */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#A8B5A5] mb-1.5">
          Filter by Pollution Category
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="w-full bg-[#1B201D] border border-[#A8B5A5]/25 p-2 text-xs font-mono text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Incident Selection List */}
      <div className="space-y-2 pt-2 border-t border-[#A8B5A5]/15 max-h-[460px] overflow-y-auto pr-1">
        {incidents.length === 0 ? (
          <div className="p-4 text-center text-xs font-mono text-[#A8B5A5] border border-dashed border-[#A8B5A5]/20">
            No complaints match the specified filter criteria.
          </div>
        ) : (
          incidents.map((inc) => {
            const isSelected = inc.id === selectedId;
            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className={`p-3.5 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#252C28] border-[#C77B43] ring-1 ring-[#C77B43]/50'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#EAE8DF]">
                    {inc.complaint_number}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-mono px-2 py-0.5 tracking-wider border ${getStatusBadgeStyle(
                      inc.status
                    )}`}
                  >
                    {inc.status}
                  </span>
                </div>

                <h4 className="text-xs font-serif font-medium text-[#EAE8DF] line-clamp-1">
                  {inc.title}
                </h4>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#A8B5A5] mt-2 pt-1 border-t border-[#A8B5A5]/10">
                  <span className="truncate max-w-[140px]">{inc.location_name}</span>
                  <span>{inc.last_updated.split(' ')[0]}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

