'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

export interface GovernmentIncident {
  id: number;
  complaint_number: string;
  title: string;
  pollution_type: 'Suspected Waste Burning' | 'Smoke Emission' | 'Industrial Air Pollution' | 'Unusual Odour' | 'Other Environmental Concern';
  location_name: string;
  ward: string;
  coordinates: { lat: number; lng: number };
  observed_at: string;
  reported_at: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Submitted' | 'Under Review' | 'Under Investigation' | 'Action Initiated' | 'Awaiting Information' | 'Resolved';
  assigned_team?: string;
  assigned_officer?: string;
  complainant_name: string;
  complainant_tier: string;
  original_description: string;
  photo_url?: string;
  highest_candidate?: {
    name: string;
    category: string;
    evidence_score: number;
    confidence_level: 'High' | 'Moderate' | 'Low';
  };
  internal_notes: Array<{
    id: string;
    timestamp: string;
    author: string;
    text: string;
    is_confidential: boolean;
  }>;
  status_history: Array<{
    status: string;
    timestamp: string;
    by: string;
    remarks: string;
  }>;
}

export interface CorrectiveActionItem {
  id: string;
  action_ref: string;
  incident_id: number;
  complaint_number: string;
  target_facility: string;
  action_type: 'Site Inspection' | 'Notice Issued' | 'Stop Work Directive' | 'Perimeter Dousing' | 'Air Sampling' | 'Penalty Imposed';
  department: string;
  assigned_officer: string;
  priority: 'Critical' | 'High' | 'Medium';
  due_date: string;
  created_at: string;
  status: 'Proposed' | 'Pending Approval' | 'Assigned' | 'In Progress' | 'Awaiting Verification' | 'Completed';
  statutory_ref: string;
  notes: string;
  fine_amount_inr?: number;
}

export interface InvestigationReportItem {
  id: string;
  report_number: string;
  incident_id: number;
  complaint_number: string;
  title: string;
  author: string;
  created_at: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Published';
  primary_source_name: string;
  evidence_score: number;
  chemical_profile_match: string;
  statutory_recommendation: string;
}

interface GovernmentContextType {
  incidents: GovernmentIncident[];
  actions: CorrectiveActionItem[];
  reports: InvestigationReportItem[];
  activeIncidentId: number;
  setActiveIncidentId: (id: number) => void;
  updateIncidentStatus: (id: number, status: GovernmentIncident['status'], remarks: string) => void;
  assignIncident: (id: number, team: string, officer: string, priority: GovernmentIncident['priority'], notes: string) => void;
  addIncidentNote: (id: number, text: string, is_confidential?: boolean) => void;
  createCorrectiveAction: (action: Omit<CorrectiveActionItem, 'id' | 'created_at'>) => void;
  updateActionStatus: (actionId: string, status: CorrectiveActionItem['status'], progressNotes?: string) => void;
  createReport: (report: Omit<InvestigationReportItem, 'id' | 'created_at'>) => void;
  updateReportStatus: (reportId: string, status: InvestigationReportItem['status']) => void;
}

const INITIAL_INCIDENTS: GovernmentIncident[] = [
  {
    id: 4,
    complaint_number: 'INC-2026-0004',
    title: 'Dense White-Grey Toxic Smoke & Chemical Burning Odor',
    pollution_type: 'Suspected Waste Burning',
    location_name: 'Chembur Colony, Sector 4',
    ward: 'Ward M/W',
    coordinates: { lat: 19.0580, lng: 72.8980 },
    observed_at: '2026-11-03 18:45 IST',
    reported_at: '2026-11-03 18:52 IST',
    priority: 'Critical',
    status: 'Under Investigation',
    assigned_team: 'MPCB Rapid Response Team 2',
    assigned_officer: 'Officer R. K. Patil',
    complainant_name: 'Aarav Sharma',
    complainant_tier: 'Verified Resident (Tier 1)',
    original_description: 'Sustained emission of dense white-grey smoke drifting into residential housing from the east-southeast. Strong acrid odor reminiscent of melting polymer and open refuse smoldering.',
    photo_url: '/images/mumbai-skyline-landing.jpg',
    highest_candidate: {
      name: 'Govandi - Mankhurd Scrap Sorting Yards',
      category: 'Informal Polymer Recycling',
      evidence_score: 88.6,
      confidence_level: 'High',
    },
    internal_notes: [
      {
        id: 'n1',
        timestamp: '2026-11-03 19:00 IST',
        author: 'Officer R. K. Patil',
        text: 'Plume corridor intersects CPCB Govandi East sensor recording PM2.5 of 218 µg/m³. Cross-verifying with ward scrap recycling permits.',
        is_confidential: false,
      },
      {
        id: 'n2',
        timestamp: '2026-11-03 19:15 IST',
        author: 'Dr. Sunita Deshmukh',
        text: 'Pre-inspection alert issued to Ward M/W Solid Waste Executive Engineer under Section 31A.',
        is_confidential: true,
      },
    ],
    status_history: [
      { status: 'Submitted', timestamp: '2026-11-03 18:52 IST', by: 'System Intake', remarks: 'Public filing ingested.' },
      { status: 'Under Review', timestamp: '2026-11-03 18:53 IST', by: 'Surveillance Desk', remarks: 'Geotag and photo validated.' },
      { status: 'Under Investigation', timestamp: '2026-11-03 19:15 IST', by: 'Technical Analyst', remarks: 'Lagrangian trajectory back-projection executed; squad dispatched.' },
    ],
  },
  {
    id: 3,
    complaint_number: 'INC-2026-0003',
    title: 'Acrid Plastic Smoldering Along Railway Boundary',
    pollution_type: 'Smoke Emission',
    location_name: 'Govandi East Transit Road',
    ward: 'Ward M/E',
    coordinates: { lat: 19.0490, lng: 72.9220 },
    observed_at: '2026-11-01 21:15 IST',
    reported_at: '2026-11-01 21:28 IST',
    priority: 'High',
    status: 'Action Initiated',
    assigned_team: 'Ward M/E Sanitary Patrol',
    assigned_officer: 'Inspector V. G. Shinde',
    complainant_name: 'Pooja Iyer',
    complainant_tier: 'Verified Resident (Tier 1)',
    original_description: 'Thick black acrid plastic fumes rising from trackside open ground. Burning waste encroaching railway buffer.',
    highest_candidate: {
      name: 'Deonar Solid Waste Landfill Ground',
      category: 'Municipal Landfill Smoldering',
      evidence_score: 84.2,
      confidence_level: 'High',
    },
    internal_notes: [
      {
        id: 'n3',
        timestamp: '2026-11-02 10:00 IST',
        author: 'Inspector V. G. Shinde',
        text: 'Water tanker deployed for localized berm dousing. Combustible refuse evacuated to processing center.',
        is_confidential: false,
      },
    ],
    status_history: [
      { status: 'Submitted', timestamp: '2026-11-01 21:28 IST', by: 'System Intake', remarks: 'Logged.' },
      { status: 'Under Investigation', timestamp: '2026-11-01 21:40 IST', by: 'Night Surveillance', remarks: 'Field verification scheduled.' },
      { status: 'Action Initiated', timestamp: '2026-11-02 11:45 IST', by: 'Ward Executive', remarks: 'Dousing underway; notice MPCB/31A/2026/091 served.' },
    ],
  },
  {
    id: 5,
    complaint_number: 'INC-2026-0005',
    title: 'Intermittent Industrial Flue Exhaust with Sulfur Odor',
    pollution_type: 'Industrial Air Pollution',
    location_name: 'Trombay Coastal Buffer Zone',
    ward: 'Ward M/E',
    coordinates: { lat: 19.0180, lng: 72.9050 },
    observed_at: '2026-11-02 07:10 IST',
    reported_at: '2026-11-02 07:25 IST',
    priority: 'Medium',
    status: 'Under Review',
    assigned_team: 'Industrial Emission Monitoring Wing',
    assigned_officer: 'Senior Inspector K. Verma',
    complainant_name: 'Sameer Kulkarni',
    complainant_tier: 'Citizen Reporter',
    original_description: 'Yellow-grey plume emitted in bursts from industrial boiler stack during morning shift start. Strong sulfur odor.',
    highest_candidate: {
      name: 'Trombay Chemical & Fertilizer Complex',
      category: 'Industrial Point Source',
      evidence_score: 62.4,
      confidence_level: 'Moderate',
    },
    internal_notes: [],
    status_history: [
      { status: 'Submitted', timestamp: '2026-11-02 07:25 IST', by: 'System Intake', remarks: 'Logged.' },
      { status: 'Under Review', timestamp: '2026-11-02 08:30 IST', by: 'Industrial Cell', remarks: 'Cross-verifying CEMS stack logs.' },
    ],
  },
  {
    id: 6,
    complaint_number: 'INC-2026-0006',
    title: 'Pungent Burning Odor Near School Grounds',
    pollution_type: 'Unusual Odour',
    location_name: 'Chembur Naka Municipal School',
    ward: 'Ward M/W',
    coordinates: { lat: 19.0605, lng: 72.8995 },
    observed_at: '2026-11-03 09:00 IST',
    reported_at: '2026-11-03 09:12 IST',
    priority: 'Medium',
    status: 'Awaiting Information',
    assigned_team: 'Area Surveillance Cell',
    assigned_officer: 'Officer R. K. Patil',
    complainant_name: 'Farhan Shaikh',
    complainant_tier: 'Citizen Reporter',
    original_description: 'Acrid burning smell near classroom perimeter during assembly. Unable to identify plume source.',
    highest_candidate: {
      name: 'Commercial Junction Traffic Intersection',
      category: 'Unverified Local Source',
      evidence_score: 41.5,
      confidence_level: 'Low',
    },
    internal_notes: [
      {
        id: 'n4',
        timestamp: '2026-11-03 10:15 IST',
        author: 'Officer R. K. Patil',
        text: 'Clarification requested from complainant regarding plume color and whether vehicular traffic was congested.',
        is_confidential: false,
      },
    ],
    status_history: [
      { status: 'Submitted', timestamp: '2026-11-03 09:12 IST', by: 'System Intake', remarks: 'Logged.' },
      { status: 'Awaiting Information', timestamp: '2026-11-03 10:15 IST', by: 'Triage Desk', remarks: 'Citizen requested for photo and duration update.' },
    ],
  },
  {
    id: 2,
    complaint_number: 'INC-2026-0002',
    title: 'Late Evening Refuse Fire Near Open Drainage Canal',
    pollution_type: 'Suspected Waste Burning',
    location_name: 'Tilak Nagar Sector 2',
    ward: 'Ward M/W',
    coordinates: { lat: 19.0620, lng: 72.8940 },
    observed_at: '2026-10-28 22:30 IST',
    reported_at: '2026-10-28 22:41 IST',
    priority: 'High',
    status: 'Resolved',
    assigned_team: 'Ward M/W Rapid Sanitation Squad',
    assigned_officer: 'Officer R. K. Patil',
    complainant_name: 'Neha Mehta',
    complainant_tier: 'Verified Resident (Tier 1)',
    original_description: 'Smoldering garbage pile near canal verge. Fumes blowing directly into 4-storey residential block.',
    highest_candidate: {
      name: 'Informal Municipal Dumpsite Verge',
      category: 'Roadside Municipal Refuse',
      evidence_score: 79.1,
      confidence_level: 'Moderate',
    },
    internal_notes: [
      {
        id: 'n5',
        timestamp: '2026-10-29 10:45 IST',
        author: 'Officer R. K. Patil',
        text: 'Sanitation squad completed clearance. Anti-dumping warning board installed under penalty of Rs 5,000.',
        is_confidential: false,
      },
    ],
    status_history: [
      { status: 'Submitted', timestamp: '2026-10-28 22:41 IST', by: 'System Intake', remarks: 'Logged.' },
      { status: 'Action Initiated', timestamp: '2026-10-29 07:30 IST', by: 'Ward Inspector', remarks: 'Squad dispatched.' },
      { status: 'Resolved', timestamp: '2026-10-29 14:00 IST', by: 'Citizen Verification', remarks: 'Resident confirmed smoke cessation.' },
    ],
  },
];

const INITIAL_ACTIONS: CorrectiveActionItem[] = [
  {
    id: 'act-1',
    action_ref: 'ACT-2026-0104',
    incident_id: 4,
    complaint_number: 'INC-2026-0004',
    target_facility: 'Govandi - Mankhurd Scrap Sorting Yards',
    action_type: 'Site Inspection',
    department: 'MPCB Regional Surveillance Wing',
    assigned_officer: 'Officer R. K. Patil',
    priority: 'Critical',
    due_date: '2026-11-04 12:00 IST',
    created_at: '2026-11-03 19:15 IST',
    status: 'In Progress',
    statutory_ref: 'MPCB/SURV/2026/W-104',
    notes: 'Physical reconnaissance of informal scrap yards at Mankhurd-Govandi perimeter. Scheduled on-site inspection.',
    fine_amount_inr: 25000,
  },
  {
    id: 'act-2',
    action_ref: 'ACT-2026-0091',
    incident_id: 3,
    complaint_number: 'INC-2026-0003',
    target_facility: 'Deonar Solid Waste Landfill Ground',
    action_type: 'Perimeter Dousing',
    department: 'Ward M/E Solid Waste Management Unit',
    assigned_officer: 'Inspector V. G. Shinde',
    priority: 'High',
    due_date: '2026-11-03 18:00 IST',
    created_at: '2026-11-02 11:45 IST',
    status: 'Awaiting Verification',
    statutory_ref: 'MPCB/31A/2026/091',
    notes: 'Perimeter water dousing and cooling completed. 24-hour thermal imaging verification pending.',
    fine_amount_inr: 50000,
  },
  {
    id: 'act-3',
    action_ref: 'ACT-2026-0084',
    incident_id: 2,
    complaint_number: 'INC-2026-0002',
    target_facility: 'Informal Municipal Dumpsite Verge',
    action_type: 'Notice Issued',
    department: 'Ward M/W Sanitation Squad',
    assigned_officer: 'Officer R. K. Patil',
    priority: 'Medium',
    due_date: '2026-10-30 18:00 IST',
    created_at: '2026-10-29 10:30 IST',
    status: 'Completed',
    statutory_ref: 'MCGM/SAN/2026/884',
    notes: 'Refuse debris cleared and warning signage erected. Site cleared.',
    fine_amount_inr: 5000,
  },
];

const INITIAL_REPORTS: InvestigationReportItem[] = [
  {
    id: 'rep-1',
    report_number: 'REP-2026-004',
    incident_id: 4,
    complaint_number: 'INC-2026-0004',
    title: 'Forensic Atmospheric Dispersion & Attribution Report: Chembur Sector 4 Smolder',
    author: 'Officer R. K. Patil & Dr. Sunita Deshmukh',
    created_at: '2026-11-03 19:30 IST',
    status: 'Approved',
    primary_source_name: 'Govandi - Mankhurd Scrap Sorting Yards',
    evidence_score: 88.6,
    chemical_profile_match: 'EPA SPECIATE Profile 8402 (Municipal Waste Burning, 86.8%)',
    statutory_recommendation: 'Issue Show Cause Notice under Section 31A of Air Act 1981; require immediate shutdown of open incineration pits.',
  },
  {
    id: 'rep-2',
    report_number: 'REP-2026-003',
    incident_id: 3,
    complaint_number: 'INC-2026-0003',
    title: 'Site Investigation & Landfill Boundary Enforcement Dossier',
    author: 'Inspector V. G. Shinde',
    created_at: '2026-11-02 12:00 IST',
    status: 'Approved',
    primary_source_name: 'Deonar Solid Waste Landfill Ground',
    evidence_score: 84.2,
    chemical_profile_match: 'Municipal Waste Smolder Fingerprint',
    statutory_recommendation: 'Establish permanent 50-meter perimeter water cooling moat and 24-hr CCTV surveillance.',
  },
];

const GovernmentContext = createContext<GovernmentContextType | undefined>(undefined);

export function GovernmentProvider({ children }: { children: React.ReactNode }) {
  const [incidents, setIncidents] = useState<GovernmentIncident[]>(INITIAL_INCIDENTS);
  const [actions, setActions] = useState<CorrectiveActionItem[]>(INITIAL_ACTIONS);
  const [reports, setReports] = useState<InvestigationReportItem[]>(INITIAL_REPORTS);
  const [activeIncidentId, setActiveIncidentId] = useState<number>(4);

  // Sync with real backend complaints
  useEffect(() => {
    let isCancelled = false;
    fetchApi<any[]>('/complaints')
      .then((data) => {
        if (isCancelled || !Array.isArray(data) || data.length === 0) return;
        setIncidents((prev) => {
          const existingIds = new Set(data.map((d) => d.id));
          const mappedBackend: GovernmentIncident[] = data.map((d) => {
            const found = prev.find((p) => p.id === d.id);
            if (found) {
              return {
                ...found,
                title: d.title || found.title,
                status: d.status === 'Resolved' || d.status === 'Closed' ? 'Resolved' : found.status,
              };
            }
            return {
              id: d.id,
              complaint_number: d.complaint_number,
              title: d.title,
              pollution_type: 'Suspected Waste Burning',
              location_name: d.address || 'Chembur-Govandi Corridor',
              ward: 'Ward M/W',
              coordinates: { lat: d.latitude || 19.043, lng: d.longitude || 72.909 },
              observed_at: new Date(d.observed_at || d.created_at).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }),
              reported_at: new Date(d.created_at).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }),
              priority: (d.severity === 'Critical' ? 'Critical' : d.severity === 'High' ? 'High' : 'Medium') as any,
              status: (d.status === 'Resolved' || d.status === 'Closed' ? 'Resolved' : 'Under Investigation') as any,
              complainant_name: 'Citizen Reporter',
              complainant_tier: 'Verified Resident (Tier 1)',
              original_description: d.description || '',
              highest_candidate: {
                name: 'Deonar Solid Waste Dumping Ground',
                category: 'Municipal Landfill Buffer',
                evidence_score: 88.5,
                confidence_level: 'High' as const,
              },
              internal_notes: [],
              status_history: [
                {
                  status: 'Submitted',
                  timestamp: new Date(d.created_at).toLocaleString('en-IN'),
                  by: 'Citizen Intake',
                  remarks: 'Initial complaint logged.',
                },
              ],
            };
          });
          const unmappedPrev = prev.filter((p) => !existingIds.has(p.id));
          return [...mappedBackend, ...unmappedPrev];
        });
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, []);

  const updateIncidentStatus = (id: number, status: GovernmentIncident['status'], remarks: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const newHistory = [
            ...inc.status_history,
            {
              status,
              timestamp: '2026-11-03 ' + new Date().toTimeString().slice(0, 5) + ' IST',
              by: 'Officer R. K. Patil',
              remarks,
            },
          ];
          return { ...inc, status, status_history: newHistory };
        }
        return inc;
      })
    );
  };

  const assignIncident = (
    id: number,
    team: string,
    officer: string,
    priority: GovernmentIncident['priority'],
    notes: string
  ) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const newNotes = notes
            ? [
                ...inc.internal_notes,
                {
                  id: 'n-' + Date.now(),
                  timestamp: '2026-11-03 ' + new Date().toTimeString().slice(0, 5) + ' IST',
                  author: officer,
                  text: notes,
                  is_confidential: false,
                },
              ]
            : inc.internal_notes;

          const newHistory = [
            ...inc.status_history,
            {
              status: inc.status === 'Submitted' ? 'Under Investigation' : inc.status,
              timestamp: '2026-11-03 ' + new Date().toTimeString().slice(0, 5) + ' IST',
              by: officer,
              remarks: `Assigned to ${team} (${officer}) with ${priority} Priority.`,
            },
          ];

          return {
            ...inc,
            assigned_team: team,
            assigned_officer: officer,
            priority,
            status: inc.status === 'Submitted' ? 'Under Investigation' : inc.status,
            internal_notes: newNotes,
            status_history: newHistory,
          };
        }
        return inc;
      })
    );
  };

  const addIncidentNote = (id: number, text: string, is_confidential = false) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          return {
            ...inc,
            internal_notes: [
              ...inc.internal_notes,
              {
                id: 'n-' + Date.now(),
                timestamp: '2026-11-03 ' + new Date().toTimeString().slice(0, 5) + ' IST',
                author: 'Officer R. K. Patil',
                text,
                is_confidential,
              },
            ],
          };
        }
        return inc;
      })
    );
  };

  const createCorrectiveAction = (actionData: Omit<CorrectiveActionItem, 'id' | 'created_at'>) => {
    const newAction: CorrectiveActionItem = {
      ...actionData,
      id: 'act-' + (actions.length + 1),
      created_at: '2026-11-03 ' + new Date().toTimeString().slice(0, 5) + ' IST',
    };
    setActions((prev) => [newAction, ...prev]);

    // Also update associated incident status if relevant
    updateIncidentStatus(
      actionData.incident_id,
      'Action Initiated',
      `Corrective action ${actionData.action_ref} issued: ${actionData.action_type} assigned to ${actionData.department}.`
    );
  };

  const updateActionStatus = (actionId: string, status: CorrectiveActionItem['status'], progressNotes?: string) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === actionId) {
          const updatedNotes = progressNotes
            ? act.notes + ` // Progress (${new Date().toTimeString().slice(0, 5)}): ${progressNotes}`
            : act.notes;
          return { ...act, status, notes: updatedNotes };
        }
        return act;
      })
    );
  };

  const createReport = (reportData: Omit<InvestigationReportItem, 'id' | 'created_at'>) => {
    const newReport: InvestigationReportItem = {
      ...reportData,
      id: 'rep-' + (reports.length + 1),
      created_at: '2026-11-03 ' + new Date().toTimeString().slice(0, 5) + ' IST',
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const updateReportStatus = (reportId: string, status: InvestigationReportItem['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
  };

  return (
    <GovernmentContext.Provider
      value={{
        incidents,
        actions,
        reports,
        activeIncidentId,
        setActiveIncidentId,
        updateIncidentStatus,
        assignIncident,
        addIncidentNote,
        createCorrectiveAction,
        updateActionStatus,
        createReport,
        updateReportStatus,
      }}
    >
      {children}
    </GovernmentContext.Provider>
  );
}

export function useGovernment() {
  const context = useContext(GovernmentContext);
  if (!context) {
    throw new Error('useGovernment must be used within a GovernmentProvider');
  }
  return context;
}

