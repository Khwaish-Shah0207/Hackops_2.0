# Backend Integration & Architecture Notes
## Environmental Intelligence & Compliance Management Platform

**Document Version:** 1.0.0  
**Phase:** 1 — Inspection, Architecture & Planning  
**Target Location:** `frontend/BACKEND_INTEGRATION_NOTES.md`  
**Backend Mode:** Strictly Read-Only  

---

## 1. Executive Summary & Architecture Overview

The backend is built in **Python 3.11+ using FastAPI**, **SQLAlchemy ORM**, **Pydantic v2 schemas**, and **SQLite/PostGIS-compatible relational models**. It powers an automated multi-criteria environmental decision-support system designed for Mumbai eastern suburbs (e.g. Chembur, Deonar, Govandi, Trombay) as its baseline demonstration scenario.

The backend exposes RESTful endpoints with standard JSON payloads, supports optional JWT Bearer token authentication (roles: `citizen` and `government`), and autonomously triggers a 5-pillar explainable source identification engine whenever an incident is submitted.

---

## 2. Functionality Confirmed by the Backend

The following operational capabilities are fully implemented in the backend codebase (`backend/app/`):

1. **Autonomous Multi-Pillar Source Apportionment (`app/source_detection/engine.py`):**
   - **Lagrangian Backward Plume Trajectory (`app/weather/trajectory.py`):** Back-projects wind vectors from complaint coordinates upwind over 3 hours.
   - **Isolation Forest Sensor Anomaly Detection (`app/pollution/anomaly.py`):** Flags statistical particulate outliers (PM2.5/PM10 spikes) along the plume path.
   - **Semantic Complaint Clustering (`app/complaint_analysis/similarity.py`):** Calculates cosine similarity across previous complaint texts within a radius (fallback keyword scoring active).
   - **Spatial Land-Use Proximity (`app/land_use/service.py`):** Assigns risk decay based on ISRO Bhuvan land-use classifications (landfill, industrial area, road, residential, water body).
   - **Receptor Chemical Fingerprinting (`app/chemical_analysis/service.py`):** Compares chemical fractions against EPA SPECIATE v5.4 reference signatures (waste burning, biomass, vehicular, industrial).

2. **Dossier & Investigation Report Generator (`app/reports/service.py`):**
   - Synthesizes findings into four strictly segregated evidence sections:
     - **Directly Observed Evidence** (citizen observation, physical sensor ground readings)
     - **Model-Generated Scientific Findings** (Lagrangian upwind vectors, anomaly intensity, candidate scores)
     - **Simulated / Demonstration Data Notice** (explicit disclaimers regarding synthetic baselines)
     - **Unverified Citizen Complaints** (initial filings)
   - Generates unique report numbers (`REP-2026-xxxx`).

3. **Government Workflow & Compliance Tracking (`app/government/router.py`):**
   - High-level stats query (`/government/dashboard/stats`).
   - Squad assignment with department, priority level, and inspection schedule.
   - Formal corrective actions (Site Inspection, Notice Issued, Fire Doused, Fine Imposed, Waste Cleared, Warning Issued).
   - Lifecycle status updates with automated chronological audit logging (`IncidentStatusHistory`).

4. **Citizen Feedback Loop & Reopening Trigger (`app/feedback/router.py`):**
   - Citizens can submit 1–5 star satisfaction ratings and state whether the smoke/odor has improved.
   - If `is_improved == False` and `reopen_requested == True`, the complaint status is automatically reset to `"Source Identified / Investigation Required"` with an audit entry.

---

## 3. Confirmed Backend API Endpoints

All endpoints are prefixed with `/api/v1` (as configured in `backend/app/config.py`):

| Method | Endpoint | Description | Auth Required | Request Schema | Response Schema |
|---|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register citizen or government user | None | `UserCreate` | `Token` |
| `POST` | `/api/v1/auth/login` | Authenticate user & receive JWT | None | `UserLogin` | `Token` |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Bearer Token | None | `UserResponse` |
| `POST` | `/api/v1/complaints` | Submit incident & trigger auto investigation | Optional | `ComplaintCreate` | `ComplaintDetailResponse` |
| `GET` | `/api/v1/complaints` | List complaints (filters: status, pollution_type, search, limit) | None | Query params | `List[ComplaintResponse]` |
| `GET` | `/api/v1/complaints/{id}` | Full incident details with candidates, report, actions, audit | None | Path `id` | `ComplaintDetailResponse` |
| `POST` | `/api/v1/complaints/{id}/investigate` | Re-trigger source identification pipeline | Optional | Path `id` | `ComplaintDetailResponse` |
| `GET` | `/api/v1/government/dashboard/stats` | Compliance counts, recent incidents, hotspot sensors | None | None | Dict (Stats + Hotspots) |
| `POST` | `/api/v1/government/complaints/{id}/assign` | Assign field team/department | Optional | `AssignmentCreate` | `ComplaintDetailResponse` |
| `POST` | `/api/v1/government/complaints/{id}/action` | Record corrective enforcement action/fine | Optional | `CorrectiveActionCreate` | `ComplaintDetailResponse` |
| `POST` | `/api/v1/government/complaints/{id}/status` | Transition status with audit notes | Optional | `StatusUpdateCreate` | `ComplaintDetailResponse` |
| `POST` | `/api/v1/feedback/complaints/{id}` | Submit citizen verification / trigger reopen | Optional | `CitizenFeedbackCreate` | `ComplaintDetailResponse` |
| `GET` | `/api/v1/environmental/air-quality` | Ambient CPCB-style monitoring station readings | None | None | `List[AirQualityReadingResponse]` |
| `GET` | `/api/v1/environmental/weather` | NOAA-style meteorological wind & weather vectors | None | None | `List[WeatherObservationResponse]` |
| `GET` | `/api/v1/environmental/historical` | 30-day ambient trends | None | Query `station_id` | Dict (Station & Trends) |
| `GET` | `/api/v1/environmental/land-use` | ISRO Bhuvan land-use candidate boundaries | None | Lat/Lon query | List of Land-Use Records |
| `GET` | `/api/v1/environmental/speciate-profiles` | EPA SPECIATE reference source signatures | None | None | Reference Profiles Library |

---

## 4. Confirmed Data Fields & Schemas

### 4.1. Incident Status Lifecycle
Statuses must be strictly one of:
1. `Reported`
2. `Under Analysis`
3. `Source Identified / Investigation Required`
4. `Assigned`
5. `Action Taken`
6. `Resolved`
7. `Closed`

### 4.2. Complaint Submission (`ComplaintCreate`)
- `title` (str, required)
- `description` (str, required)
- `pollution_type` (str, required — e.g. `smoke`, `waste_burning`, `dust`, `industrial_emissions`, `odor`, `other`)
- `latitude` (float, required)
- `longitude` (float, required)
- `address` (str, optional)
- `observed_at` (datetime string, optional)
- `image_url` (str, optional)

### 4.3. Source Candidate (`SourceCandidateResponse`)
- `id`, `complaint_id`, `name`, `category`, `latitude`, `longitude`, `distance_km`
- Sub-scores (0 to 100):
  - `wind_compatibility_score`: Trajectory alignment
  - `transport_time_minutes`: Plume transit duration
  - `pollution_anomaly_score`: Corridor sensor deviation
  - `complaint_density_score`: Clustered citizen reports
  - `land_use_weight`: Spatial propensity
  - `chemical_match_score`: EPA SPECIATE match
- `overall_evidence_score` (0.0 to 100.0)
- `confidence_level` (`Low` | `Moderate` | `High` | `Insufficient evidence`)
- `explanation` (str)
- `shortlist_reason` (str)
- `evidence_breakdown` (Dict containing raw scoring components and legal notice)

### 4.4. Investigation Dossier (`InvestigationReportResponse`)
- `report_number`: `REP-2026-xxxx`
- `executive_summary`: Concise editorial brief
- `observed_evidence`: Ground truth data
- `model_findings`: Trajectory vectors, Isolation Forest anomalies, candidate ranking
- `simulated_evidence`: Disclaimers and synthetic status
- `unverified_citizen_reports`: Original report details
- `meteorological_summary`: Wind speed, direction, atmospheric stability
- `chemical_fingerprint_summary`: EPA SPECIATE ratios
- `data_limitations`: Text disclaimer
- `recommended_actions`: List of enforcement directives

---

## 5. Functionality That Needs Backend Support (Documented for Future Integration)

The following capabilities were requested in frontend concepts or mockups but **are not currently implemented** in the backend:

1. **Direct File / Photo Multipart Upload (`multipart/form-data`):**
   - Backend `ComplaintCreate` currently accepts an `image_url` string.
   - There is no `/api/v1/upload` route or static asset upload directory for multipart image handling.
   - *Current frontend strategy:* Accept citizen photo uploads locally, store as base64 or temporary preview URL for display, and pass image reference.
2. **Export Dossier as PDF (`/complaints/{id}/export-pdf`):**
   - The backend currently synthesizes report JSON in `InvestigationReportGenerator`, but has no PDF generation binary (ReportLab/WeasyPrint).
   - *Current frontend strategy:* Use client-side print stylesheets or structured HTML report view with print dialog.
3. **Real-Time WebSockets or Server-Sent Events:**
   - The backend does not implement WebSocket pub/sub for live incoming incident streams.
   - *Current frontend strategy:* Polling intervals or explicit user-triggered refresh.
4. **Custom Wind / Sensor Simulation Sandbox Injection:**
   - The backend calculates trajectories using static or seeded weather observations; it has no route to inject custom hypothetical wind vectors into the solver dynamically.

---

## 6. Questions & Clarifications

1. **Authentication Mode for Demonstrations:**
   - The backend endpoints for submitting complaints and viewing incidents accept guest requests (`get_current_user_optional`).
   - For government dashboard actions, endpoints verify role when a token is provided or fall back to authorized stakeholder defaults.
   - *Frontend approach:* Provide clean, seamless switching between Citizen and Government roles without locking out operational demonstration exploration.
2. **Geographic Coordinate Precision:**
   - The demonstration scenario focuses on Mumbai Eastern Suburbs (Chembur: `19.0580° N, 72.8980° E`; Deonar: `19.0435° N, 72.9250° E`).
   - Maps must default to this bounding box while permitting user interaction.

---

## 7. Demonstration Data Guidelines

- Demonstration datasets must be strictly isolated inside `frontend/src/lib/demoData.ts` or similar fixtures.
- Every mock or demonstration item must be explicitly tagged as `is_demo: true` or `is_synthetic: true`.
- Under no circumstance will the frontend claim a synthetic heuristic or illustrative score is a calibrated scientific probability or legal declaration of guilt.

