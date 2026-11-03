'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GovernmentShell } from '@/components/government/GovernmentShell';
import { useGovernment, CorrectiveActionItem } from '@/lib/governmentContext';

export default function ActionsPage() {
  const { actions, incidents, createCorrectiveAction, updateActionStatus } = useGovernment();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [progressModalAction, setProgressModalAction] = useState<CorrectiveActionItem | null>(null);

  // New action form state
  const [incidentId, setIncidentId] = useState<number>(4);
  const [targetFacility, setTargetFacility] = useState('Govandi - Mankhurd Scrap Sorting Yards');
  const [actionType, setActionType] = useState<CorrectiveActionItem['action_type']>('Site Inspection');
  const [department, setDepartment] = useState('MPCB Regional Surveillance Wing');
  const [assignedOfficer, setAssignedOfficer] = useState('Officer R. K. Patil');
  const [priority, setPriority] = useState<CorrectiveActionItem['priority']>('High');
  const [dueDate, setDueDate] = useState('2026-11-05 18:00 IST');
  const [statutoryRef, setStatutoryRef] = useState('MPCB/SURV/2026/W-105');
  const [notes, setNotes] = useState('');
  const [fineAmount, setFineAmount] = useState<number>(15000);

  // Progress update state
  const [newActionStatus, setNewActionStatus] = useState<CorrectiveActionItem['status']>('In Progress');
  const [progressRemarks, setProgressRemarks] = useState('');

  const filteredActions = actions.filter((act) => {
    const matchesStatus = filterStatus === 'All' || act.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || act.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inc = incidents.find((i) => i.id === Number(incidentId)) || incidents[0];
    const actionRef = `ACT-2026-0${100 + actions.length + 1}`;

    createCorrectiveAction({
      action_ref: actionRef,
      incident_id: Number(incidentId),
      complaint_number: inc.complaint_number,
      target_facility: targetFacility,
      action_type: actionType,
      department,
      assigned_officer: assignedOfficer,
      priority,
      due_date: dueDate,
      status: 'Assigned',
      statutory_ref: statutoryRef,
      notes: notes || 'Statutory compliance dispatch issued under Section 31A of Air Act 1981.',
      fine_amount_inr: Number(fineAmount) || undefined,
    });

    setCreateModalOpen(false);
    setNotes('');
  };

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressModalAction) return;
    updateActionStatus(progressModalAction.id, newActionStatus, progressRemarks);
    setProgressModalAction(null);
    setProgressRemarks('');
  };

  const getStatusBadge = (status: CorrectiveActionItem['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#667B70]/20 border-[#667B70] text-[#667B70]';
      case 'In Progress':
        return 'bg-[#C77B43]/20 border-[#C77B43] text-[#C77B43]';
      case 'Awaiting Verification':
        return 'bg-[#EAE8DF]/10 border-[#EAE8DF]/50 text-[#EAE8DF]';
      case 'Assigned':
        return 'bg-[#252C28] border-[#A8B5A5]/30 text-[#A8B5A5]';
      default:
        return 'bg-[#14251F] border-[#A8B5A5]/20 text-[#A8B5A5]/60';
    }
  };

  const getPriorityBadge = (priority: CorrectiveActionItem['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'text-[#B65348] border-[#B65348]/40';
      case 'High':
        return 'text-[#C77B43] border-[#C77B43]/40';
      default:
        return 'text-[#A8B5A5] border-[#A8B5A5]/25';
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
              Statutory Enforcement &amp; Abatement Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAE8DF]">
            Corrective Actions &amp; Compliance Directives
          </h1>
          <p className="text-xs font-mono text-[#A8B5A5] mt-0.5">
            Issue inspection warrants, monitor abatement orders, and record ground verification sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Issue Corrective Action</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-[#1B201D] border border-[#A8B5A5]/20 p-3.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase text-[#A8B5A5]">Status:</span>
          {['All', 'Assigned', 'In Progress', 'Awaiting Verification', 'Completed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 border transition-colors ${
                filterStatus === st
                  ? 'bg-[#C77B43] text-[#14251F] font-bold border-[#EAE8DF]'
                  : 'bg-[#252C28] text-[#A8B5A5] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-[#A8B5A5]">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-[#14251F] border border-[#A8B5A5]/25 p-1 text-xs text-[#EAE8DF] focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Actions Table */}
      <div className="bg-[#14251F] border border-[#A8B5A5]/25 p-4 md:p-6 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[#A8B5A5]/20 text-[#A8B5A5] text-[10px] uppercase">
              <th className="py-2.5 px-3">Action Ref</th>
              <th className="py-2.5 px-3">Docket</th>
              <th className="py-2.5 px-3">Target Facility / Cluster</th>
              <th className="py-2.5 px-3">Directive Type</th>
              <th className="py-2.5 px-3">Department &amp; Lead</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Due Date</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#A8B5A5]/10">
            {filteredActions.map((act) => (
              <tr key={act.id} className="hover:bg-[#252C28]/60 transition-colors">
                <td className="py-3 px-3 font-bold text-[#EAE8DF]">
                  {act.action_ref}
                </td>
                <td className="py-3 px-3 text-[#C77B43] font-bold">
                  <Link href={`/government/investigation?id=${act.incident_id}`} className="hover:underline">
                    {act.complaint_number}
                  </Link>
                </td>
                <td className="py-3 px-3 text-[#EAE8DF] max-w-[180px] truncate">
                  {act.target_facility}
                </td>
                <td className="py-3 px-3 text-[#EAE8DF]">
                  {act.action_type}
                </td>
                <td className="py-3 px-3 text-[#A8B5A5] text-[11px]">
                  <span className="block text-[#EAE8DF]">{act.assigned_officer}</span>
                  <span className="text-[10px] text-[#A8B5A5]/70">{act.department}</span>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 border text-[10px] uppercase font-bold ${getPriorityBadge(act.priority)}`}>
                    {act.priority}
                  </span>
                </td>
                <td className="py-3 px-3 text-[#A8B5A5] text-[11px]">
                  {act.due_date}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 border text-[10px] uppercase font-bold ${getStatusBadge(act.status)}`}>
                    {act.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setProgressModalAction(act);
                      setNewActionStatus(act.status);
                    }}
                    className="px-2.5 py-1 bg-[#252C28] hover:bg-[#C77B43] hover:text-[#14251F] border border-[#A8B5A5]/30 text-[10px] uppercase transition-colors"
                  >
                    Log Progress
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Progress Log Modal */}
      {progressModalAction && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#14251F] border border-[#C77B43] max-w-lg w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#A8B5A5]/20">
              <h3 className="text-base font-serif font-bold text-[#EAE8DF]">
                Update Compliance Progress: {progressModalAction.action_ref}
              </h3>
              <button
                type="button"
                onClick={() => setProgressModalAction(null)}
                className="text-[#A8B5A5] hover:text-[#EAE8DF]"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleProgressSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                  Updated Action Status:
                </label>
                <select
                  value={newActionStatus}
                  onChange={(e) => setNewActionStatus(e.target.value as any)}
                  className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                >
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress (Squad on site)</option>
                  <option value="Awaiting Verification">Awaiting Verification (Abatement complete)</option>
                  <option value="Completed">Completed (Countersigned &amp; Resolved)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                  Field Squad Progress Log &amp; Verification Observations:
                </label>
                <textarea
                  rows={3}
                  value={progressRemarks}
                  onChange={(e) => setProgressRemarks(e.target.value)}
                  placeholder="Record cooling temperature, fine receipts, or photograph serial numbers..."
                  className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#A8B5A5]/15">
                <button
                  type="button"
                  onClick={() => setProgressModalAction(null)}
                  className="px-4 py-2 border border-[#A8B5A5]/30 text-[#A8B5A5] hover:text-[#EAE8DF] uppercase text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C77B43] text-[#14251F] font-bold uppercase text-[11px] hover:bg-[#C77B43]/90"
                >
                  Save Progress Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Action Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#14251F] border border-[#C77B43] max-w-lg w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#A8B5A5]/20">
              <h3 className="text-base font-serif font-bold text-[#EAE8DF]">
                Issue Statutory Corrective Action Directive
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-[#A8B5A5] hover:text-[#EAE8DF]"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                    Associated Incident Docket:
                  </label>
                  <select
                    value={incidentId}
                    onChange={(e) => setIncidentId(Number(e.target.value))}
                    className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                  >
                    {incidents.map((inc) => (
                      <option key={inc.id} value={inc.id}>
                        {inc.complaint_number} ({inc.ward})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                    Directive Type:
                  </label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                  >
                    <option value="Site Inspection">Site Inspection</option>
                    <option value="Notice Issued">Notice Issued (Sec 31A)</option>
                    <option value="Stop Work Directive">Stop Work Directive</option>
                    <option value="Perimeter Dousing">Perimeter Dousing</option>
                    <option value="Air Sampling">Air Sampling Audit</option>
                    <option value="Penalty Imposed">Penalty Imposed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                  Target Facility / Cluster:
                </label>
                <input
                  type="text"
                  value={targetFacility}
                  onChange={(e) => setTargetFacility(e.target.value)}
                  className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                    Responsible Department:
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                    Assigned Officer:
                  </label>
                  <input
                    type="text"
                    value={assignedOfficer}
                    onChange={(e) => setAssignedOfficer(e.target.value)}
                    className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                    Priority:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                    Statutory Fine (INR):
                  </label>
                  <input
                    type="number"
                    value={fineAmount}
                    onChange={(e) => setFineAmount(Number(e.target.value))}
                    className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#A8B5A5] mb-1">
                  Statutory Citation &amp; Directive Notes:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify Section 31A grounds and compliance deadlines..."
                  className="w-full bg-[#252C28] border border-[#A8B5A5]/30 p-2 text-xs text-[#EAE8DF] focus:border-[#C77B43] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#A8B5A5]/15">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#A8B5A5]/30 text-[#A8B5A5] hover:text-[#EAE8DF] uppercase text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C77B43] text-[#14251F] font-bold uppercase text-[11px] hover:bg-[#C77B43]/90"
                >
                  Issue Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

