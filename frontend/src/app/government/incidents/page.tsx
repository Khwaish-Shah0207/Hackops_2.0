'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GovernmentShell } from '@/components/government/GovernmentShell';
import { useGovernment, GovernmentIncident } from '@/lib/governmentContext';

function IncidentsContent() {
  const { incidents, updateIncidentStatus, assignIncident, addIncidentNote } = useGovernment();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  const [selectedIncident, setSelectedIncident] = useState<GovernmentIncident>(incidents[0] || null);

  // Modals / Action drawers
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTeam, setAssignTeam] = useState('MPCB Rapid Response Team 2');
  const [assignOfficer, setAssignOfficer] = useState('Officer R. K. Patil');
  const [assignPriority, setAssignPriority] = useState<GovernmentIncident['priority']>('High');
  const [assignNotes, setAssignNotes] = useState('');

  const [noteText, setNoteText] = useState('');
  const [noteConfidential, setNoteConfidential] = useState(false);

  // Filter logic
  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        const matchesSearch =
          !searchQuery ||
          inc.complaint_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.location_name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;
        const matchesCategory = categoryFilter === 'All' || inc.pollution_type === categoryFilter;
        const matchesPriority = priorityFilter === 'All' || inc.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const pOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return pOrder[b.priority] - pOrder[a.priority];
        }
        return new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime();
      });
  }, [incidents, searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;
    assignIncident(selectedIncident.id, assignTeam, assignOfficer, assignPriority, assignNotes);
    setAssignModalOpen(false);
    setAssignNotes('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedIncident) return;
    addIncidentNote(selectedIncident.id, noteText, noteConfidential);
    setNoteText('');
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-[#B65348] border-[#B65348]/50 bg-[#B65348]/10';
      case 'High':
        return 'text-[#C77B43] border-[#C77B43]/50 bg-[#C77B43]/10';
      case 'Medium':
        return 'text-[#EAE8DF] border-[#A8B5A5]/30 bg-[#252C28]';
      default:
        return 'text-[#A8B5A5] border-[#A8B5A5]/20 bg-[#14251F]';
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
              Regulatory Docket Triage &amp; Casework
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAE8DF]">
            Incident Management &amp; Docket Triage
          </h1>
          <p className="text-xs font-mono text-[#A8B5A5] mt-0.5">
            Filter, triage, assign field surveillance teams, and record internal operational notes.
          </p>
        </div>

        <div className="text-xs font-mono text-[#A8B5A5] flex items-center gap-3">
          <span>Active Roster: <strong className="text-[#EAE8DF]">{incidents.length} Dockets</strong></span>
          <span>&bull;</span>
          <span>Matched: <strong className="text-[#C77B43]">{filteredIncidents.length}</strong></span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#1B201D] border border-[#A8B5A5]/20 p-4 space-y-3 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Docket ID, location, or keyword..."
              className="w-full bg-[#14251F] border border-[#A8B5A5]/25 p-2 text-xs font-mono text-[#EAE8DF] placeholder-[#A8B5A5]/40 focus:border-[#C77B43] focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#14251F] border border-[#A8B5A5]/25 p-2 text-xs font-mono text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Action Initiated">Action Initiated</option>
              <option value="Awaiting Information">Awaiting Information</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-[#14251F] border border-[#A8B5A5]/25 p-2 text-xs font-mono text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#14251F] border border-[#A8B5A5]/25 p-2 text-xs font-mono text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
            >
              <option value="date">Sort: Most Recent</option>
              <option value="priority">Sort: By Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column: Incident Table (7 cols) + Selected Incident Details Drawer (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table List (7 cols) */}
        <div className="lg:col-span-7 bg-[#14251F] border border-[#A8B5A5]/25 p-4 space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#A8B5A5] pb-2 border-b border-[#A8B5A5]/15 flex justify-between">
            <span>Docket List ({filteredIncidents.length})</span>
            <span>Click row to view details &amp; triage</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3.5 border transition-all cursor-pointer font-mono text-xs ${
                    isSelected
                      ? 'bg-[#252C28] border-[#C77B43] ring-1 ring-[#C77B43]/50'
                      : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#EAE8DF]">{inc.complaint_number}</span>
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${getPriorityStyle(inc.priority)}`}>
                        {inc.priority}
                      </span>
                    </div>

                    <span className="text-[10px] text-[#A8B5A5] px-2 py-0.5 border border-[#A8B5A5]/20">
                      {inc.status}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-serif font-bold text-[#EAE8DF] line-clamp-1">
                    {inc.title}
                  </h3>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-[#A8B5A5] mt-2 pt-1.5 border-t border-[#A8B5A5]/10">
                    <span>{inc.location_name} ({inc.ward})</span>
                    <span>Officer: <strong className="text-[#EAE8DF]">{inc.assigned_officer || 'Unassigned'}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Incident Triage & Inspection Drawer (5 cols) */}
        {selectedIncident && (
          <div className="lg:col-span-5 bg-[#252C28] border border-[#A8B5A5]/25 p-5 space-y-5 font-mono text-xs">
            {/* Drawer Header */}
            <div className="pb-3 border-b border-[#A8B5A5]/15 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#C77B43]">
                  {selectedIncident.complaint_number}
                </span>
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${getPriorityStyle(selectedIncident.priority)}`}>
                  Priority: {selectedIncident.priority}
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-[#EAE8DF] leading-snug">
                {selectedIncident.title}
              </h2>
              <div className="text-[11px] text-[#A8B5A5]">
                {selectedIncident.pollution_type} &bull; {selectedIncident.ward}
              </div>
            </div>

            {/* Quick Actions Action Bar */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase text-[#A8B5A5] block">
                Statutory Triage Actions:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateIncidentStatus(selectedIncident.id, 'Under Review', 'Accepted for administrative review.')}
                  className="p-2 bg-[#14251F] hover:border-[#EAE8DF] border border-[#A8B5A5]/25 text-[11px] uppercase transition-colors"
                >
                  Accept for Review
                </button>
                <button
                  type="button"
                  onClick={() => updateIncidentStatus(selectedIncident.id, 'Awaiting Information', 'Clarification requested from complainant.')}
                  className="p-2 bg-[#14251F] hover:border-[#B65348] border border-[#B65348]/40 text-[#B65348] text-[11px] uppercase transition-colors"
                >
                  Request Info
                </button>
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(true)}
                  className="p-2 bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] font-bold text-[11px] uppercase transition-colors col-span-2"
                >
                  Assign Investigation Team &rarr;
                </button>
              </div>
            </div>

            {/* Original Citizen Intake & Photo */}
            <div className="space-y-2 bg-[#14251F] border border-[#A8B5A5]/15 p-3.5">
              <span className="text-[10px] uppercase text-[#A8B5A5] block">
                Citizen Complaint Intake ({selectedIncident.complainant_name})
              </span>
              <p className="text-[11px] text-[#EAE8DF] leading-relaxed">
                &ldquo;{selectedIncident.original_description}&rdquo;
              </p>
              {selectedIncident.photo_url && (
                <div className="relative h-28 w-full bg-[#252C28] border border-[#A8B5A5]/20 mt-2 overflow-hidden">
                  <Image
                    src={selectedIncident.photo_url}
                    alt="Citizen evidence photo"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 right-2 bg-black/70 px-1.5 py-0.5 text-[9px] text-white">
                    Photographic Attachment
                  </div>
                </div>
              )}
            </div>

            {/* Deep Workspace Cross-Link */}
            <Link
              href={`/government/investigation?id=${selectedIncident.id}`}
              className="block w-full py-2.5 bg-[#252C28] hover:bg-[#C77B43] hover:text-[#14251F] border border-[#C77B43]/60 text-xs text-center font-bold uppercase tracking-wider text-[#C77B43] transition-colors"
            >
              Open Full Forensic Workspace &rarr;
            </Link>

            {/* Internal Notes Section */}
            <div className="space-y-3 pt-2 border-t border-[#A8B5A5]/15">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[#A8B5A5]">Internal Officer Notes</span>
                <span className="text-[10px] text-[#A8B5A5]">{selectedIncident.internal_notes.length} entries</span>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedIncident.internal_notes.length === 0 ? (
                  <div className="text-[11px] text-[#A8B5A5]/50 italic">No internal notes recorded yet.</div>
                ) : (
                  selectedIncident.internal_notes.map((note) => (
                    <div key={note.id} className="p-2 bg-[#14251F] border border-[#A8B5A5]/15 text-[11px] space-y-1">
                      <div className="flex justify-between text-[9px] text-[#A8B5A5]">
                        <span className="font-bold text-[#EAE8DF]">{note.author}</span>
                        <span>{note.timestamp}</span>
                      </div>
                      <p className="text-[#EAE8DF]/90">{note.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-1">
                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record confidential observation or squad directive..."
                  className="w-full bg-[#14251F] border border-[#A8B5A5]/25 p-2 text-xs font-mono text-[#EAE8DF] placeholder-[#A8B5A5]/40 focus:border-[#C77B43] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!noteText.trim()}
                  className="w-full py-1.5 bg-[#252C28] border border-[#A8B5A5]/30 hover:border-[#EAE8DF] text-[10px] uppercase text-[#EAE8DF] transition-colors disabled:opacity-40"
                >
                  Save Internal Note
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {assignModalOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#14251F] border border-[#C77B43] max-w-lg w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#A8B5A5]/20">
              <h3 className="text-base font-serif font-bold text-[#EAE8DF]">
                Dispatch &amp; Assign Incident: {selectedIncident.complaint_number}
              </h3>
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="text-[#A8B5A5] hover:text-[#EAE8DF]"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                  Surveillance Wing / Squad:
                </label>
                <select
                  value={assignTeam}
                  onChange={(e) => setAssignTeam(e.target.value)}
                  className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                >
                  <option value="MPCB Rapid Response Team 2">MPCB Rapid Response Team 2</option>
                  <option value="Ward M/E Sanitary Patrol">Ward M/E Sanitary Patrol</option>
                  <option value="Industrial Emission Monitoring Wing">Industrial Emission Monitoring Wing</option>
                  <option value="Ward M/W Rapid Sanitation Squad">Ward M/W Rapid Sanitation Squad</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                  Lead Investigating Officer:
                </label>
                <input
                  type="text"
                  value={assignOfficer}
                  onChange={(e) => setAssignOfficer(e.target.value)}
                  className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                  Statutory Priority:
                </label>
                <select
                  value={assignPriority}
                  onChange={(e) => setAssignPriority(e.target.value as any)}
                  className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                >
                  <option value="Critical">Critical (Immediate dispatch &lt; 2 hrs)</option>
                  <option value="High">High (Dispatch &lt; 4 hrs)</option>
                  <option value="Medium">Medium (Routine queue)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                  Dispatch Directive &amp; Operational Notes:
                </label>
                <textarea
                  rows={3}
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="Specific instructions for on-site reconnaissance, stack sampling, or perimeter checks..."
                  className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#A8B5A5]/15">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 border border-[#A8B5A5]/30 text-[#A8B5A5] hover:text-[#EAE8DF] uppercase text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C77B43] text-[#14251F] font-bold uppercase text-[11px] hover:bg-[#C77B43]/90"
                >
                  Confirm Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IncidentsPage() {
  return (
    <GovernmentShell>
      <IncidentsContent />
    </GovernmentShell>
  );
}

