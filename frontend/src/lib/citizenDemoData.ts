export interface CitizenReportItem {
  id: number;
  complaint_number: string;
  title: string;
  pollution_type: 'Suspected Waste Burning' | 'Smoke Emission' | 'Industrial Air Pollution' | 'Unusual Odour' | 'Other Environmental Concern';
  location_name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  observed_at: string;
  created_at: string;
  status: 'Submitted' | 'Under Review' | 'Under Investigation' | 'Action Initiated' | 'Resolved';
  highest_candidate?: {
    name: string;
    category: string;
    evidence_score: number;
    confidence_level: 'High' | 'Moderate' | 'Low' | 'Insufficient evidence';
  };
  wind_trajectory_summary?: string;
  recent_action?: string;
  is_demo: boolean;
}

export interface CitizenUpdateEvent {
  id: string;
  complaint_number: string;
  event_type: 'intake' | 'trajectory' | 'assignment' | 'action' | 'verification';
  title: string;
  description: string;
  timestamp: string;
  is_demo: boolean;
}

export interface CitizenStats {
  total_reports: number;
  under_investigation: number;
  action_initiated: number;
  resolved: number;
  active_corridor_monitoring: number;
  is_demo: boolean;
}

export const DEMO_CITIZEN_PROFILE = {
  name: 'Aarav Sharma',
  email: 'citizen@enviro.gov',
  organization: 'Chembur Resident Welfare Association',
  residence_sector: 'Eastern Suburbs Ward M/W, Mumbai',
  verified_status: 'Resident Reporter (Tier 1)',
  is_demo: true,
};

export const DEMO_CITIZEN_STATS: CitizenStats = {
  total_reports: 5,
  under_investigation: 2,
  action_initiated: 1,
  resolved: 2,
  active_corridor_monitoring: 1,
  is_demo: true,
};

export const DEMO_CITIZEN_REPORTS: CitizenReportItem[] = [
  {
    id: 4,
    complaint_number: 'INC-2026-0004',
    title: 'Dense White-Grey Toxic Smoke & Chemical Odor',
    pollution_type: 'Suspected Waste Burning',
    location_name: 'Chembur Colony, Sector 4',
    coordinates: { lat: 19.0580, lng: 72.8980 },
    observed_at: '2026-11-03 18:45 IST',
    created_at: '2026-11-03 18:52 IST',
    status: 'Under Investigation',
    highest_candidate: {
      name: 'Govandi - Mankhurd Scrap Sorting Yards',
      category: 'Informal Polymer Recycling',
      evidence_score: 88.6,
      confidence_level: 'High',
    },
    wind_trajectory_summary: 'Lagrangian vector tracks origin 3.4 km East-Southeast (108° ESE, 4.2 m/s).',
    recent_action: 'Sensor anomaly of 218 µg/m³ recorded at Govandi East station along plume path.',
    is_demo: true,
  },
  {
    id: 3,
    complaint_number: 'INC-2026-0003',
    title: 'Acrid Plastic Smoldering Along Railway Boundary',
    pollution_type: 'Smoke Emission',
    location_name: 'Govandi East Transit Road',
    coordinates: { lat: 19.0490, lng: 72.9220 },
    observed_at: '2026-11-01 21:15 IST',
    created_at: '2026-11-01 21:28 IST',
    status: 'Action Initiated',
    highest_candidate: {
      name: 'Deonar Solid Waste Landfill Ground',
      category: 'Municipal Landfill Smoldering',
      evidence_score: 84.2,
      confidence_level: 'High',
    },
    wind_trajectory_summary: 'Upwind alignment within 15° tolerance. Transport duration: 18 minutes.',
    recent_action: 'Site inspection dispatched to MPCB Regional Surveillance Wing.',
    is_demo: true,
  },
  {
    id: 5,
    complaint_number: 'INC-2026-0005',
    title: 'Intermittent Industrial Flue Exhaust with Sulfur Odor',
    pollution_type: 'Industrial Air Pollution',
    location_name: 'Trombay Coastal Buffer Zone',
    coordinates: { lat: 19.0180, lng: 72.9050 },
    observed_at: '2026-11-02 07:10 IST',
    created_at: '2026-11-02 07:25 IST',
    status: 'Under Review',
    highest_candidate: {
      name: 'Trombay Chemical & Fertilizer Complex',
      category: 'Industrial Point Source',
      evidence_score: 62.4,
      confidence_level: 'Moderate',
    },
    wind_trajectory_summary: 'Trajectory analysis queued; waiting for diurnal coastal wind reversal verification.',
    recent_action: 'Automated meteorological correlation in progress.',
    is_demo: true,
  },
  {
    id: 2,
    complaint_number: 'INC-2026-0002',
    title: 'Late Evening Refuse Fire Near Open Drainage Canal',
    pollution_type: 'Suspected Waste Burning',
    location_name: 'Tilak Nagar Sector 2',
    coordinates: { lat: 19.0620, lng: 72.8940 },
    observed_at: '2026-10-28 22:30 IST',
    created_at: '2026-10-28 22:41 IST',
    status: 'Resolved',
    highest_candidate: {
      name: 'Informal Municipal Dumpsite Verge',
      category: 'Roadside Municipal Refuse',
      evidence_score: 79.1,
      confidence_level: 'Moderate',
    },
    wind_trajectory_summary: 'Localized ground level drift (1.2 km).',
    recent_action: 'Ward municipal squad cleared debris and extinguished smoldering embers; citizen confirmed resolution.',
    is_demo: true,
  },
  {
    id: 1,
    complaint_number: 'INC-2026-0001',
    title: 'Commercial Cable Insulation Burning Odor',
    pollution_type: 'Unusual Odour',
    location_name: 'Deonar Peripheral Perimeter Road',
    coordinates: { lat: 19.0435, lng: 72.9250 },
    observed_at: '2026-10-24 19:00 IST',
    created_at: '2026-10-24 19:15 IST',
    status: 'Resolved',
    highest_candidate: {
      name: 'Perimeter Scrap Scavenging Cluster',
      category: 'Informal Scrap Extraction',
      evidence_score: 91.0,
      confidence_level: 'High',
    },
    wind_trajectory_summary: 'Receptor speciation matched EPA Profile 8402 (heavy metals & chlorine).',
    recent_action: 'Enforcement notice issued under Air Act Section 31A; commercial penalty recorded.',
    is_demo: true,
  },
];

export const DEMO_CITIZEN_UPDATES: CitizenUpdateEvent[] = [
  {
    id: 'evt-01',
    complaint_number: 'INC-2026-0004',
    event_type: 'trajectory',
    title: 'Lagrangian Plume Vector Calculated',
    description: 'Autonomous back-trajectory completed. 108° ESE wind vector projects origin 3.4 km upwind into Govandi industrial sector.',
    timestamp: 'Today at 18:58 IST',
    is_demo: true,
  },
  {
    id: 'evt-02',
    complaint_number: 'INC-2026-0004',
    event_type: 'intake',
    title: 'Incident Registration Confirmed',
    description: 'Your report was received and assigned reference INC-2026-0004. Corroborating ambient sensors queried.',
    timestamp: 'Today at 18:52 IST',
    is_demo: true,
  },
  {
    id: 'evt-03',
    complaint_number: 'INC-2026-0003',
    event_type: 'assignment',
    title: 'Inspection Squad Dispatched',
    description: 'Officer R. K. Patil (MPCB Regional Surveillance Wing) assigned for physical verification under High priority.',
    timestamp: 'Nov 02 at 09:15 IST',
    is_demo: true,
  },
  {
    id: 'evt-04',
    complaint_number: 'INC-2026-0002',
    event_type: 'action',
    title: 'Enforcement Action Recorded',
    description: 'Ward squad completed site inspection. Solid refuse doused and cleared. Resolution feedback requested.',
    timestamp: 'Oct 29 at 11:20 IST',
    is_demo: true,
  },
  {
    id: 'evt-05',
    complaint_number: 'INC-2026-0001',
    event_type: 'verification',
    title: 'Resolution Verified by Resident',
    description: 'You verified that air conditions improved with satisfaction rating 5/5. Case closed.',
    timestamp: 'Oct 26 at 14:00 IST',
    is_demo: true,
  },
];

