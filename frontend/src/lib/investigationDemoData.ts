export interface InvestigationDossierData {
  id: number;
  complaint_number: string;
  title: string;
  pollution_type: string;
  status: string;
  status_statement: string;
  observed_at: string;
  reported_at: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  reporter: {
    name: string;
    organization: string;
    verification_tier: string;
  };
  original_description: string;
  image_url?: string;
  evidence_photos?: Array<{ url: string; caption: string }>;
  
  // Meteorology
  weather: {
    wind_direction_deg: number;
    wind_direction_cardinal: string;
    wind_speed_ms: number;
    temperature_c: number;
    humidity_pct: number;
    atmospheric_stability: string;
    boundary_layer_height_m: number;
  };

  // Trajectory points
  trajectory: Array<{
    lat: number;
    lng: number;
    hours_back: number;
    elevation_m: number;
    transit_minutes: number;
    description: string;
  }>;

  // Sensor stations along the corridor
  sensors: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    distance_km: number;
    pm25: number;
    pm10: number;
    aqi: number;
    aqi_bucket: string;
    is_anomaly: boolean;
    anomaly_score: number;
  }>;

  // Candidate sources
  candidates: Array<{
    rank: number;
    name: string;
    category: string;
    lat: number;
    lng: number;
    distance_km: number;
    overall_evidence_score: number;
    confidence_level: 'High' | 'Moderate' | 'Low' | 'Insufficient evidence';
    sub_scores: {
      wind_alignment_pct: number;
      transport_time_min: number;
      corridor_anomaly_pct: number;
      complaint_density_pct: number;
      land_use_weight_pct: number;
      chemical_match_pct: number;
    };
    explanation: string;
    shortlist_reason: string;
    limitations: string;
  }>;

  // Chemical Fingerprint
  chemical_speciation: {
    primary_profile_match: string;
    similarity_pct: number;
    data_source: string;
    constituents: Array<{
      id: string;
      name: string;
      formula: string;
      fraction_pct: number;
      significance: string;
      color: string;
    }>;
  };

  // Timeline events
  timeline: Array<{
    step: number;
    stage_name: string;
    status: 'completed' | 'active' | 'pending';
    timestamp?: string;
    summary: string;
    details: string;
    authority?: string;
  }>;

  // Recorded actions
  recorded_actions: Array<{
    action_type: string;
    officer_name: string;
    department: string;
    timestamp: string;
    notes: string;
    statutory_ref: string;
  }>;

  is_demo: boolean;
}

export const DEMO_INVESTIGATION_CASE_INC_4: InvestigationDossierData = {
  id: 4,
  complaint_number: 'INC-2026-0004',
  title: 'Dense White-Grey Toxic Smoke & Chemical Burning Odor',
  pollution_type: 'Suspected Waste Burning',
  status: 'Source Identified / Investigation Required',
  status_statement: 'High Upwind Candidate Shortlisted // Inspection Squad Dispatched',
  observed_at: '2026-11-03 18:45 IST',
  reported_at: '2026-11-03 18:52 IST',
  address: 'Chembur Colony Residential Sector 4, Ward M/W, Mumbai',
  coordinates: {
    lat: 19.0580,
    lng: 72.8980,
  },
  reporter: {
    name: 'Aarav Sharma',
    organization: 'Chembur Resident Welfare Association',
    verification_tier: 'Verified Resident (Tier 1)',
  },
  original_description:
    'Sustained emission of dense white-grey smoke drifting into residential housing from the east-southeast. Strong acrid odor reminiscent of melting polymer and open refuse smoldering. Fumes causing throat irritation and reduced visual visibility along the arterial corridor.',
  
  weather: {
    wind_direction_deg: 108,
    wind_direction_cardinal: 'East-South-East (ESE)',
    wind_speed_ms: 4.2,
    temperature_c: 28.4,
    humidity_pct: 68,
    atmospheric_stability: 'Class D (Neutral Dispersion)',
    boundary_layer_height_m: 420,
  },

  trajectory: [
    {
      lat: 19.0580,
      lng: 72.8980,
      hours_back: 0.0,
      elevation_m: 12,
      transit_minutes: 0,
      description: 'Receptor Origin: Chembur Colony complaint pin',
    },
    {
      lat: 19.0535,
      lng: 72.9100,
      hours_back: 0.25,
      elevation_m: 24,
      transit_minutes: 15,
      description: 'Intermediate Corridor: Eastern Freeway overpass',
    },
    {
      lat: 19.0490,
      lng: 72.9220,
      hours_back: 0.5,
      elevation_m: 35,
      transit_minutes: 28,
      description: 'Candidate Corridor Point: Govandi Scrap Sorting Yard',
    },
    {
      lat: 19.0435,
      lng: 72.9250,
      hours_back: 0.75,
      elevation_m: 48,
      transit_minutes: 35,
      description: 'Upwind Anchor: Deonar Landfill western berm',
    },
  ],

  sensors: [
    {
      id: 'CPCB-GOV-01',
      name: 'Govandi East Ambient Station',
      lat: 19.0490,
      lng: 72.9220,
      distance_km: 2.7,
      pm25: 218.4,
      pm10: 384.0,
      aqi: 375,
      aqi_bucket: 'Very Poor',
      is_anomaly: true,
      anomaly_score: 0.84,
    },
    {
      id: 'CPCB-CHM-02',
      name: 'Chembur Colony Monitoring Point',
      lat: 19.0580,
      lng: 72.8980,
      distance_km: 0.1,
      pm25: 195.2,
      pm10: 320.0,
      aqi: 340,
      aqi_bucket: 'Very Poor',
      is_anomaly: true,
      anomaly_score: 0.76,
    },
    {
      id: 'CPCB-KRL-03',
      name: 'Kurla Central Baseline Station',
      lat: 19.0650,
      lng: 72.8790,
      distance_km: 3.8,
      pm25: 82.0,
      pm10: 145.0,
      aqi: 160,
      aqi_bucket: 'Moderate',
      is_anomaly: false,
      anomaly_score: 0.12,
    },
  ],

  candidates: [
    {
      rank: 1,
      name: 'Govandi - Mankhurd Scrap Sorting Yards',
      category: 'Informal Polymer Recycling & Scrap Processing',
      lat: 19.0490,
      lng: 72.9220,
      distance_km: 3.42,
      overall_evidence_score: 88.6,
      confidence_level: 'High',
      sub_scores: {
        wind_alignment_pct: 92.4,
        transport_time_min: 28,
        corridor_anomaly_pct: 84.0,
        complaint_density_pct: 86.5,
        land_use_weight_pct: 85.0,
        chemical_match_pct: 86.8,
      },
      explanation:
        'Situated 3.42 km directly upwind (108° ESE). Surface wind speed of 4.2 m/s transports plume within 28 minutes. Station CPCB-GOV-01 records severe PM2.5 spike (218 µg/m³). Sector holds 6 recurring complaints citing refuse and wire burning.',
      shortlist_reason:
        'Direct upwind alignment; verified PM2.5 corridor anomaly spike; multiple corroborating citizen filings in sector.',
      limitations:
        'Informal yards lack continuous stack telemetry; physical squad inspection required to confirm active burner location.',
    },
    {
      rank: 2,
      name: 'Deonar Solid Waste Landfill Ground',
      category: 'Municipal Solid Waste Disposal Facility',
      lat: 19.0435,
      lng: 72.9250,
      distance_km: 4.10,
      overall_evidence_score: 87.2,
      confidence_level: 'High',
      sub_scores: {
        wind_alignment_pct: 89.1,
        transport_time_min: 35,
        corridor_anomaly_pct: 82.5,
        complaint_density_pct: 88.0,
        land_use_weight_pct: 90.0,
        chemical_match_pct: 88.4,
      },
      explanation:
        '132-hectare municipal waste landfill located 4.10 km upwind. Historical smoldering methane combustion matches chemical ratios. Transport time approximately 35 minutes.',
      shortlist_reason:
        'Large surface emission propensity; 88.4% spectral match to EPA waste profile 8402; historical recurring smoldering.',
      limitations:
        'Subsurface thermal pockets can produce diffuse ground haze without distinct localized stack points.',
    },
    {
      rank: 3,
      name: 'Trombay Chemical & Fertilizer Complex',
      category: 'Heavy Industrial Point Source',
      lat: 19.0180,
      lng: 72.9050,
      distance_km: 4.60,
      overall_evidence_score: 48.0,
      confidence_level: 'Low',
      sub_scores: {
        wind_alignment_pct: 32.0,
        transport_time_min: 44,
        corridor_anomaly_pct: 55.0,
        complaint_density_pct: 42.0,
        land_use_weight_pct: 80.0,
        chemical_match_pct: 51.0,
      },
      explanation:
        'Heavy industrial facility with boiler stacks. Wind trajectory compatibility is low (32%) because current wind is blowing from 108° (ESE), placing this source largely crosswind relative to the Chembur receptor.',
      shortlist_reason:
        'Crosswind location with poor vector alignment; included to demonstrate multi-criteria heuristic filtering.',
      limitations:
        'Excluded as primary candidate due to trajectory misalignment.',
    },
  ],

  chemical_speciation: {
    primary_profile_match: 'EPA SPECIATE Profile 8402 (Municipal Waste Open Burning)',
    similarity_pct: 86.8,
    data_source: 'Receptor PM2.5 Mass Balance Apportionment (EPA CMB 8.2 compatible)',
    constituents: [
      {
        id: 'sulphates',
        name: 'SULPHATE',
        formula: 'SO₄²⁻',
        fraction_pct: 32,
        significance: 'Secondary inorganic aerosol indicative of heavy fuel oil combustion and sulfur-bearing waste incineration.',
        color: '#C77B43',
      },
      {
        id: 'nitrates',
        name: 'NITRATE',
        formula: 'NO₃⁻',
        fraction_pct: 24,
        significance: 'High-temperature thermal oxidation marker associated with industrial boilers and sustained smoldering.',
        color: '#A8B5A5',
      },
      {
        id: 'organic_carbon',
        name: 'ORGANIC CARBON',
        formula: 'OC',
        fraction_pct: 18,
        significance: 'Primary particulate phase fraction from incomplete municipal refuse and open biomass combustion.',
        color: '#667B70',
      },
      {
        id: 'elemental_carbon',
        name: 'ELEMENTAL CARBON',
        formula: 'EC',
        fraction_pct: 14,
        significance: 'Black carbon matrix resulting from low-temperature open smoldering of synthetic polymers.',
        color: '#B65348',
      },
      {
        id: 'trace_metals',
        name: 'HEAVY METALS & CHLORIDES',
        formula: 'Zn, Pb, Cl⁻',
        fraction_pct: 12,
        significance: 'Zinc, Lead, and chloride tracers characteristic of scrap insulation burning and informal e-waste sorting.',
        color: '#EAE8DF',
      },
    ],
  },

  timeline: [
    {
      step: 1,
      stage_name: 'Incident Reported',
      status: 'completed',
      timestamp: '2026-11-03 18:52 IST',
      summary: 'Public complaint INC-2026-0004 submitted with coordinates and smoke description.',
      details: 'Coordinates 19.0580° N, 72.8980° E captured via mobile web intake. Plume description logged as dense white-grey toxic smoke.',
      authority: 'System Intake Service',
    },
    {
      step: 2,
      stage_name: 'Report Formally Ingested',
      status: 'completed',
      timestamp: '2026-11-03 18:53 IST',
      summary: 'Filing validated and assigned unique docket reference for investigation.',
      details: 'Assigned to Eastern Suburbs Regional Monitoring Sector. Automated workflow triggers executed.',
      authority: 'Regional Surveillance Console',
    },
    {
      step: 3,
      stage_name: 'Meteorological Vectors Analyzed',
      status: 'completed',
      timestamp: '2026-11-03 18:55 IST',
      summary: 'Surface wind from 108° (ESE) at 4.2 m/s ingested from NOAA-compatible meteorological archive.',
      details: 'Atmospheric boundary layer estimated at 420 meters with Class D neutral dispersion stability.',
      authority: 'Trajectory Analysis Engine',
    },
    {
      step: 4,
      stage_name: 'Corridor Sensor Anomalies Evaluated',
      status: 'completed',
      timestamp: '2026-11-03 18:56 IST',
      summary: 'Govandi East station flagged with severe PM2.5 spike (218 µg/m³, AQI 375).',
      details: 'Isolation Forest algorithm detected statistical particulate outlier along the calculated upwind corridor.',
      authority: 'Sensor Anomaly Engine',
    },
    {
      step: 5,
      stage_name: 'Source Candidates Ranked',
      status: 'completed',
      timestamp: '2026-11-03 18:58 IST',
      summary: 'Govandi Scrap Yards (#1, 88.6) and Deonar Landfill (#2, 87.2) shortlisted.',
      details: 'Multi-criteria synthesis applied: trajectory alignment (30%), complaint density (25%), anomaly spike (20%), land-use (15%), chemical match (10%).',
      authority: 'Source Detection Engine',
    },
    {
      step: 6,
      stage_name: 'Inspection Squad Assigned',
      status: 'active',
      timestamp: '2026-11-03 19:15 IST',
      summary: 'Assigned to Officer R. K. Patil (MPCB Surveillance Wing) with High Priority.',
      details: 'Formal dispatch generated for on-site physical inspection of Mankhurd scrap recycling cluster.',
      authority: 'Authorized Stakeholder',
    },
    {
      step: 7,
      stage_name: 'Physical Site Verification',
      status: 'pending',
      summary: 'Inspection squad site visit scheduled to confirm active smoldering origins.',
      details: 'Physical verification is required before statutory fines or show-cause notices are finalized.',
      authority: 'Field Inspection Team',
    },
    {
      step: 8,
      stage_name: 'Citizen Resolution Verification',
      status: 'pending',
      summary: 'Complainant verification prompts rating and checks if smoke has ceased.',
      details: 'Failure to confirm improvement triggers automatic case reopening under elevated priority.',
      authority: 'Citizen Feedback Loop',
    },
  ],

  recorded_actions: [
    {
      action_type: 'Field Squad Assignment',
      officer_name: 'Officer R. K. Patil',
      department: 'MPCB Regional Surveillance Wing',
      timestamp: '2026-11-03 19:15 IST',
      notes: 'Dispatched for physical site reconnaissance of informal scrap sorting yards at Mankhurd-Govandi perimeter. Scheduled on-site inspection.',
      statutory_ref: 'MPCB/SURV/2026/W-104',
    },
    {
      action_type: 'Pre-Inspection Statutory Alert',
      officer_name: 'Dr. Sunita Deshmukh',
      department: 'Regional Pollution Control Office',
      timestamp: '2026-11-03 19:30 IST',
      notes: 'Advisory notice transmitted to Ward M/W Municipal Solid Waste department regarding perimeter burning reports.',
      statutory_ref: 'ENV/ACT/SEC-31A/PRV',
    },
  ],

  is_demo: true,
};

