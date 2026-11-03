'use client';



import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { 

  Shield, 

  AlertCircle, 

  CheckCircle2, 

  Clock, 

  Users, 

  Building2, 

  FileText, 

  ChevronRight, 

  Filter, 

  Plus, 

  Flame, 

  DollarSign, 

  AlertTriangle,

  RefreshCw,

  Search

} from 'lucide-react';

import { useRouter } from 'next/navigation';

import { getStoredUser, isGovernmentUser } from '@/lib/auth';

import { fetchApi } from '@/lib/api';



export default function GovernmentDashboardPage() {

  const [stats, setStats] = useState<any>(null);

  const [incidents, setIncidents] = useState<any[]>([]);

  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  const [loading, setLoading] = useState(true);



  // Assignment Modal State

  const [assigneeName, setAssigneeName] = useState('Officer R. K. Patil');

  const [department, setDepartment] = useState('MPCB Regional Surveillance Wing');

  const [priority, setPriority] = useState('High');

  const [assignNotes, setAssignNotes] = useState('');

  const [submittingAssign, setSubmittingAssign] = useState(false);



  // Corrective Action Modal State

  const [officerName, setOfficerName] = useState('Inspector V. G. Shinde');

  const [actionType, setActionType] = useState('Site Inspection');

  const [actionDescription, setActionDescription] = useState('');

  const [fineAmount, setFineAmount] = useState(0);

  const [noticesIssued, setNoticesIssued] = useState('');

  const [submittingAction, setSubmittingAction] = useState(false);



  // Status Change State

  const [newStatus, setNewStatus] = useState('Action Taken');

  const [statusNotes, setStatusNotes] = useState('');

  const [submittingStatus, setSubmittingStatus] = useState(false);



  const router = useRouter();



  // Auth guard — redirect non-government users to the authority login page.

  useEffect(() => {

    const user = getStoredUser();

    if (!user || !isGovernmentUser()) {

      router.replace('/login/government');

    }

  }, []);



  const loadData = async () => {

    try {

      setLoading(true);

      const [statsData, complaintsList] = await Promise.all([

        fetchApi<any>('/government/dashboard/stats'),

        fetchApi<any[]>('/complaints'),

      ]);

      setStats(statsData);

      setIncidents(complaintsList);

      if (complaintsList.length > 0 && !selectedIncident) {

        // Fetch detailed record of first incident

        const detail = await fetchApi<any>(`/complaints/${complaintsList[0].id}`);

        setSelectedIncident(detail);

      }

    } catch (err) {

      console.error('Error loading government data:', err);

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    loadData();

  }, []);



  const handleSelectIncident = async (id: number) => {

    try {

      const detail = await fetchApi<any>(`/complaints/${id}`);

      setSelectedIncident(detail);

    } catch (err) {

      console.error('Failed to select incident:', err);

    }

  };



  const handleAssignSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!selectedIncident) return;

    try {

      setSubmittingAssign(true);

      const updated = await fetchApi<any>(`/government/complaints/${selectedIncident.id}/assign`, {

        method: 'POST',

        body: JSON.stringify({

          assigned_to_name: assigneeName,

          department,

          priority,

          notes: assignNotes,

        }),

      });

      setSelectedIncident(updated);

      loadData();

      alert('Inspection team successfully assigned!');

    } catch (err: any) {

      alert(`Assignment failed: ${err.message}`);

    } finally {

      setSubmittingAssign(false);

    }

  };



  const handleActionSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!selectedIncident) return;

    try {

      setSubmittingAction(true);

      const updated = await fetchApi<any>(`/government/complaints/${selectedIncident.id}/action`, {

        method: 'POST',

        body: JSON.stringify({

          officer_name: officerName,

          action_type: actionType,

          description: actionDescription,

          fine_amount: fineAmount,

          notices_issued: noticesIssued,

        }),

      });

      setSelectedIncident(updated);

      setActionDescription('');

      loadData();

      alert('Corrective enforcement action logged!');

    } catch (err: any) {

      alert(`Action failed: ${err.message}`);

    } finally {

      setSubmittingAction(false);

    }

  };



  const handleStatusSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!selectedIncident) return;

    try {

      setSubmittingStatus(true);

      const updated = await fetchApi<any>(`/government/complaints/${selectedIncident.id}/status`, {

        method: 'POST',

        body: JSON.stringify({

          new_status: newStatus,

          notes: statusNotes,

        }),

      });

      setSelectedIncident(updated);

      setStatusNotes('');

      loadData();

      alert(`Status transitioned to: ${newStatus}`);

    } catch (err: any) {

      alert(`Status update failed: ${err.message}`);

    } finally {

      setSubmittingStatus(false);

    }

  };



  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">

            <Shield className="w-4 h-4" />

            <span>Pollution Control Board & Municipal Authority Console</span>

          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">

            Compliance Management & Enforcement

          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1">

            Coordinate inspections, track upwind plume evidence, and enforce clean air regulations.

          </p>

        </div>

        <button

          onClick={loadData}

          className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-medium border border-slate-700 transition"

        >

          <RefreshCw className="w-3.5 h-3.5" />

          <span>Refresh Data</span>

        </button>

      </div>



      {/* Metric Counters */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-1">

          <span className="text-xs text-slate-400 font-medium">Total Incidents</span>

          <div className="text-2xl font-bold text-white">{stats?.total_incidents ?? '...'}</div>

          <span className="text-[11px] text-slate-400">All citizen filings</span>

        </div>



        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-1">

          <span className="text-xs text-amber-700 font-medium">Under Investigation</span>

          <div className="text-2xl font-bold text-amber-400">{stats?.investigation_required ?? '...'}</div>

          <span className="text-[11px] text-amber-400">Upwind source identified</span>

        </div>



        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-1">

          <span className="text-xs text-blue-700 font-medium">Action Taken</span>

          <div className="text-2xl font-bold text-blue-400">{stats?.action_taken ?? '...'}</div>

          <span className="text-[11px] text-blue-400">Inspection & notice issued</span>

        </div>



        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-1">

          <span className="text-xs text-emerald-700 font-medium">Resolved Incidents</span>

          <div className="text-2xl font-bold text-emerald-400">{stats?.resolved_incidents ?? '...'}</div>

          <span className="text-[11px] text-emerald-400">Verified by citizens</span>

        </div>

      </div>



      {/* Main Two-Column Layout */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Incidents List */}

        <div className="lg:col-span-5 space-y-4">

          <div className="flex items-center justify-between">

            <h2 className="text-lg font-bold text-white">Incidents Registry</h2>

            <span className="text-xs text-slate-400">{incidents.length} Records</span>

          </div>



          <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1">

            {incidents.map((inc) => {

              const isSelected = selectedIncident?.id === inc.id;

              return (

                <div

                  key={inc.id}

                  onClick={() => handleSelectIncident(inc.id)}

                  className={`p-4 rounded-xl border text-left cursor-pointer transition ${

                    isSelected

                      ? 'border-emerald-600 bg-emerald-950/30 shadow-sm'

                      : 'border-slate-800 bg-slate-900 hover:bg-slate-800/60'

                  }`}

                >

                  <div className="flex items-center justify-between gap-2 mb-1">

                    <span className="font-mono text-xs font-bold text-slate-300">

                      {inc.complaint_number}

                    </span>

                    <div className="flex items-center space-x-1.5">

                      {inc.severity && (

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${

                          inc.severity === 'Critical' ? 'bg-red-100 text-red-800 border-red-300' :

                          inc.severity === 'High' ? 'bg-orange-100 text-orange-800 border-orange-300' :

                          inc.severity === 'Moderate' ? 'bg-amber-100 text-amber-800 border-amber-200' :

                          'bg-emerald-100 text-emerald-800 border-emerald-200'

                        }`}>

                          {inc.severity}

                        </span>

                      )}

                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300">

                        {inc.status}

                      </span>

                    </div>

                  </div>

                  <h4 className="font-bold text-white text-sm line-clamp-1">{inc.title}</h4>

                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{inc.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">

                    <span className="capitalize">{inc.pollution_type.replace('_', ' ')}</span>

                    <span>{new Date(inc.observed_at).toLocaleDateString()}</span>

                  </div>

                </div>

              );

            })}

          </div>

        </div>



        {/* Right Column: Selected Incident Management Workbench */}

        <div className="lg:col-span-7 space-y-6">

          {selectedIncident ? (

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">

              {/* Selected Incident Header */}

              <div className="border-b border-slate-800 pb-4 space-y-2">

                <div className="flex items-center justify-between">

                  <div className="flex items-center space-x-2">

                    <span className="font-mono text-xs font-bold bg-slate-800 px-2.5 py-1 rounded text-slate-200">

                      {selectedIncident.complaint_number}

                    </span>

                    {selectedIncident.severity && (

                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${

                        selectedIncident.severity === 'Critical' ? 'bg-red-100 text-red-800 border-red-300' :

                        selectedIncident.severity === 'High' ? 'bg-orange-100 text-orange-800 border-orange-300' :

                        selectedIncident.severity === 'Moderate' ? 'bg-amber-100 text-amber-800 border-amber-200' :

                        'bg-emerald-100 text-emerald-800 border-emerald-200'

                      }`}>

                        Severity: {selectedIncident.severity} ({Math.round(selectedIncident.severity_score || 0)}/100)

                      </span>

                    )}

                  </div>

                  <Link

                    href={`/incidents/${selectedIncident.id}`}

                    className="text-xs text-emerald-400 font-semibold hover:underline flex items-center space-x-1"

                  >

                    <span>Full Investigation Map</span>

                    <ChevronRight className="w-3.5 h-3.5" />

                  </Link>

                </div>

                <h2 className="text-xl font-bold text-white">{selectedIncident.title}</h2>

                <p className="text-xs text-slate-300">{selectedIncident.description}</p>

              </div>



              {/* Top Source Candidate Evidence Callout */}

              {selectedIncident.source_candidates?.length > 0 && (

                <div className="bg-orange-950/30 border border-orange-800 p-4 rounded-xl space-y-2">

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">

                      Top Suspected Source Origin

                    </span>

                    <span className="text-xs font-bold bg-orange-200 text-orange-300 px-2 py-0.5 rounded">

                      Score: {selectedIncident.source_candidates[0].overall_evidence_score}/100

                    </span>

                  </div>

                  <h3 className="text-base font-bold text-orange-200">

                    {selectedIncident.source_candidates[0].name} ({selectedIncident.source_candidates[0].category})

                  </h3>

                  <p className="text-xs text-orange-300/80 leading-relaxed">

                    {selectedIncident.source_candidates[0].explanation}

                  </p>

                </div>

              )}



              {/* Assignment Form */}

              <div className="space-y-4 pt-2">

                <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center space-x-2">

                  <Users className="w-4 h-4 text-emerald-400" />

                  <span>1. Assign Inspection Team</span>

                </h3>

                {selectedIncident.assignment ? (

                  <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">

                    <div><b>Assigned Officer:</b> {selectedIncident.assignment.assigned_to_name}</div>

                    <div><b>Department:</b> {selectedIncident.assignment.department} (Priority: {selectedIncident.assignment.priority})</div>

                    {selectedIncident.assignment.notes && <div><b>Notes:</b> {selectedIncident.assignment.notes}</div>}

                  </div>

                ) : (

                  <form onSubmit={handleAssignSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">

                    <div>

                      <label className="block text-slate-300 mb-1 font-medium">Assigned Officer / Team</label>

                      <input

                        type="text"

                        value={assigneeName}

                        onChange={(e) => setAssigneeName(e.target.value)}

                        className="w-full px-3 py-2 rounded-lg border border-slate-700 text-xs"

                      />

                    </div>

                    <div>

                      <label className="block text-slate-300 mb-1 font-medium">Department</label>

                      <input

                        type="text"

                        value={department}

                        onChange={(e) => setDepartment(e.target.value)}

                        className="w-full px-3 py-2 rounded-lg border border-slate-700 text-xs"

                      />

                    </div>

                    <div className="sm:col-span-2">

                      <button

                        type="submit"

                        disabled={submittingAssign}

                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-xs"

                      >

                        {submittingAssign ? 'Assigning...' : 'Assign Field Team'}

                      </button>

                    </div>

                  </form>

                )}

              </div>



              {/* Corrective Actions Section */}

              <div className="space-y-4 pt-4 border-t border-slate-800">

                <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center space-x-2">

                  <Shield className="w-4 h-4 text-emerald-400" />

                  <span>2. Record Corrective Enforcement Action</span>

                </h3>



                {selectedIncident.corrective_actions?.length > 0 && (

                  <div className="space-y-2 mb-3">

                    {selectedIncident.corrective_actions.map((act: any) => (

                      <div key={act.id} className="bg-slate-800/60 p-3 rounded-lg border border-slate-800 text-xs space-y-1">

                        <div className="flex items-center justify-between font-bold text-slate-200">

                          <span>{act.action_type} by {act.officer_name}</span>

                          {act.fine_amount > 0 && <span className="text-red-600">₹{act.fine_amount} Fine</span>}

                        </div>

                        <p className="text-slate-300">{act.description}</p>

                      </div>

                    ))}

                  </div>

                )}



                <form onSubmit={handleActionSubmit} className="space-y-3 text-xs bg-slate-800/60 p-4 rounded-xl border border-slate-800">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div>

                      <label className="block text-slate-300 mb-1 font-medium">Action Type</label>

                      <select

                        value={actionType}

                        onChange={(e) => setActionType(e.target.value)}

                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900"

                      >

                        <option value="Site Inspection">Site Physical Audit</option>

                        <option value="Notice Issued">Show-Cause Notice Issued</option>

                        <option value="Fire Doused">Fire Doused & Extinguished</option>

                        <option value="Fine Imposed">Regulatory Penalty / Fine Imposed</option>

                        <option value="Waste Cleared">Illegal Waste Cleared</option>

                        <option value="Warning Issued">Formal Warning Notice</option>

                      </select>

                    </div>

                    <div>

                      <label className="block text-slate-300 mb-1 font-medium">Officer Name</label>

                      <input

                        type="text"

                        value={officerName}

                        onChange={(e) => setOfficerName(e.target.value)}

                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900"

                      />

                    </div>

                    <div>

                      <label className="block text-slate-300 mb-1 font-medium">Fine Amount (₹)</label>

                      <input

                        type="number"

                        value={fineAmount}

                        onChange={(e) => setFineAmount(parseFloat(e.target.value) || 0)}

                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900"

                      />

                    </div>

                    <div>

                      <label className="block text-slate-300 mb-1 font-medium">Notice Reference #</label>

                      <input

                        type="text"

                        value={noticesIssued}

                        onChange={(e) => setNoticesIssued(e.target.value)}

                        placeholder="e.g. MPCB/RO/NOT-2026/41"

                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900"

                      />

                    </div>

                  </div>

                  <div>

                    <label className="block text-slate-300 mb-1 font-medium">Action Description</label>

                    <textarea

                      rows={2}

                      value={actionDescription}

                      onChange={(e) => setActionDescription(e.target.value)}

                      placeholder="Describe inspection findings, materials found burning, measures taken..."

                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900"

                    />

                  </div>

                  <button

                    type="submit"

                    disabled={submittingAction || !actionDescription.trim()}

                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg text-xs"

                  >

                    {submittingAction ? 'Logging Action...' : 'Log Corrective Action'}

                  </button>

                </form>

              </div>



              {/* Status Update Control */}

              <div className="space-y-3 pt-4 border-t border-slate-800">

                <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center space-x-2">

                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />

                  <span>3. Transition Incident Status</span>

                </h3>

                <form onSubmit={handleStatusSubmit} className="flex flex-wrap items-center gap-3">

                  <select

                    value={newStatus}

                    onChange={(e) => setNewStatus(e.target.value)}

                    className="px-3 py-2 rounded-lg border border-slate-700 text-xs bg-slate-900"

                  >

                    <option value="Reported">Reported</option>

                    <option value="Under Analysis">Under Analysis</option>

                    <option value="Source Identified / Investigation Required">Source Identified / Investigation Required</option>

                    <option value="Assigned">Assigned</option>

                    <option value="Action Taken">Action Taken</option>

                    <option value="Resolved">Resolved</option>

                    <option value="Closed">Closed</option>

                  </select>

                  <input

                    type="text"

                    value={statusNotes}

                    onChange={(e) => setStatusNotes(e.target.value)}

                    placeholder="Status update audit note..."

                    className="flex-1 px-3 py-2 rounded-lg border border-slate-700 text-xs"

                  />

                  <button

                    type="submit"

                    disabled={submittingStatus}

                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-xs"

                  >

                    Update Status

                  </button>

                </form>

              </div>



              {/* Audit History Timeline */}

              <div className="space-y-3 pt-4 border-t border-slate-800">

                <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center space-x-1.5">

                  <Clock className="w-3.5 h-3.5 text-slate-400" />

                  <span>Timestamped Audit History</span>

                </h3>

                <div className="space-y-2 max-h-48 overflow-y-auto text-xs">

                  {selectedIncident.status_history?.map((h: any) => (

                    <div key={h.id} className="flex items-start space-x-2 text-slate-300 bg-slate-800/60 p-2 rounded-lg">

                      <span className="font-bold text-slate-200 shrink-0">

                        {h.new_status}:

                      </span>

                      <span className="flex-1">{h.change_notes || `Status changed by ${h.changed_by_user}`}</span>

                      <span className="text-[10px] text-slate-400 shrink-0">

                        {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          ) : (

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center text-slate-400">

              Select an incident from the registry to view workbench.

            </div>

          )}

        </div>

      </div>

    </div>

  );

}



