# Environmental Intelligence & Compliance Platform: Feature Integration Checklist

This document details every backend endpoint, service, schema contract, and corresponding frontend interface.

---

## 1. Authentication & Role-Based Access Control

### 1.1 Citizen / Officer / Manager Login
- **Backend Implementation:** `app/auth/router.py::login`
- **API Endpoint:** `POST /api/v1/auth/login`
- **Request Fields:** `email: str`, `password: str`
- **Response Fields:** `access_token: str`, `token_type: "bearer"`, `user: { id, email, full_name, role, organization }`
- **Frontend Page/Component:**
  - Citizen: `/login/citizen` & `/login`
  - Executive Officer: `/login/government`
  - Regional Manager: `/login/regional-manager`
  - Navigation headers (`MainNavigation`, `CitizenNavbar`, `GovernmentShell`)
- **Frontend Support:** Exists in `frontend/src/app/login/*`, needs unified error handling, token persistence via `localStorage`, and role-based redirect.
- **Testing Method:** POST valid credentials (`citizen@enviro.gov`, `officer@mpcb.gov.in`, `manager@mpcb.gov.in`) and verify JWT issue and dashboard routing.
- **Status:** Integrated

### 1.2 User Registration (Citizen / Stakeholder)
- **Backend Implementation:** `app/auth/router.py::register`
- **API Endpoint:** `POST /api/v1/auth/register`
- **Request Fields:** `email: str`, `password: str`, `full_name: str`, `role: "citizen" | "government"`, `organization?: str`
- **Response Fields:** `access_token: str`, `token_type: "bearer"`, `user: UserResponse`
- **Frontend Page/Component:** `/login/citizen` (Sign-up toggle tab)
- **Frontend Support:** Form fields present.
- **Testing Method:** Register a new citizen account and verify instant token generation and dashboard access.
- **Status:** Integrated

### 1.3 Current User Session (`/auth/me`)
- **Backend Implementation:** `app/auth/router.py::get_me`
- **API Endpoint:** `GET /api/v1/auth/me`
- **Request Headers:** `Authorization: Bearer <token>`
- **Response Fields:** `id, email, full_name, role, organization, is_active, created_at`
- **Frontend Page/Component:** `src/lib/auth.ts`, `GovernmentShell.tsx`, `CitizenNavbar.tsx`
- **Frontend Support:** Validates user session upon loading.
- **Testing Method:** Pass bearer token in headers and verify active user identity.
- **Status:** Integrated

---

## 2. Citizen Complaint Intake & Tracking

### 2.1 Environmental Complaint Submission
- **Backend Implementation:** `app/complaints/router.py::submit_complaint`
- **API Endpoint:** `POST /api/v1/complaints`
- **Request Fields:**
  - `title: str` (min 5 chars)
  - `description: str` (min 10 chars, voice or typed)
  - `pollution_type: "smoke" | "industrial" | "waste_burning" | "dust" | "chemical" | "odor"`
  - `latitude: float` (e.g. 19.043)
  - `longitude: float` (e.g. 72.909)
  - `address?: str`
  - `observed_at?: ISO datetime`
  - `image_url?: str`
- **Response Fields:** `ComplaintDetailResponse` (includes `complaint_number`, `severity`, `severity_score`, `severity_assessment`, `source_candidates`, `reports`)
- **Frontend Page/Component:** `src/app/submit/page.tsx` (`LocationPickerMap`, `EvidenceUploadZone`, Voice Input Microphone)
- **Frontend Support:** Full multi-step form with map location picking and voice transcription.
- **Testing Method:** Submit a complaint with coordinates and spoken transcription, verify database persistence and automated severity assessment.
- **Status:** Integrated

### 2.2 List Citizen Complaints
- **Backend Implementation:** `app/complaints/router.py::list_complaints`
- **API Endpoint:** `GET /api/v1/complaints`
- **Query Params:** `status?: str`, `pollution_type?: str`, `search?: str`, `limit?: int`
- **Response Fields:** `List[ComplaintResponse]`
- **Frontend Page/Component:** `src/app/citizen/page.tsx`, `src/app/track/page.tsx`
- **Frontend Support:** Filtering by status, category, search query.
- **Testing Method:** Query complaints and verify real incident cards render.
- **Status:** Integrated

### 2.3 Single Incident Dossier & Investigation
- **Backend Implementation:** `app/complaints/router.py::get_complaint`
- **API Endpoint:** `GET /api/v1/complaints/{id}`
- **Response Fields:** Full complaint dossier with `source_candidates`, `investigation_report`, `status_history`, `assignment`, `actions`, `severity_assessment`, `feedback`
- **Frontend Page/Component:** `src/app/incidents/[id]/page.tsx`, `src/app/track/[id]/page.tsx`
- **Frontend Support:** Four-quadrant legal dossier, hotspot chemical matrix, source candidate ranking, timeline.
- **Testing Method:** Open `/incidents/4`, verify live backend payload and evidence tabs.
- **Status:** Integrated

### 2.4 Citizen Resolution Feedback
- **Backend Implementation:** `app/feedback/router.py::submit_feedback`
- **API Endpoint:** `POST /api/v1/feedback/complaints/{id}`
- **Request Fields:** `satisfaction_rating: int` (1-5), `odor_resolved: bool`, `smoke_visible: bool`, `comments?: str`
- **Response Fields:** Updated `ComplaintDetailResponse`
- **Frontend Page/Component:** `src/components/investigation/CitizenResolutionFeedback.tsx`, `/track/[id]`
- **Frontend Support:** Star rating, toggle buttons, comment submission.
- **Testing Method:** Submit citizen feedback on resolved incident and verify backend record.
- **Status:** Integrated

---

## 3. Executive Officer (Government Stakeholder) Operations

### 3.1 Government Dashboard Stats
- **Backend Implementation:** `app/government/router.py::get_dashboard_stats`
- **API Endpoint:** `GET /api/v1/government/dashboard/stats`
- **Response Fields:** `total_incidents, open_incidents, investigation_required, action_taken, resolved_incidents, recent_incidents, pollution_hotspots`
- **Frontend Page/Component:** `src/app/government/page.tsx` (`ExecutiveKPIBar`, `GovernmentOverviewMap`, `PriorityQueueTable`)
- **Frontend Support:** KPI counters and geographical map markers.
- **Testing Method:** Fetch dashboard statistics and verify values match database counts.
- **Status:** Integrated

### 3.2 Field Inspection Squad Assignment
- **Backend Implementation:** `app/government/router.py::assign_incident`
- **API Endpoint:** `POST /api/v1/government/complaints/{id}/assign`
- **Request Fields:** `assigned_to_name: str`, `department: str`, `priority: "Low" | "Medium" | "High" | "Critical"`, `inspection_scheduled_date?: ISO datetime`, `notes?: str`
- **Response Fields:** Updated `ComplaintDetailResponse` with assignment
- **Frontend Page/Component:** `src/app/government/incidents/page.tsx`, `src/app/government/investigation/page.tsx`
- **Frontend Support:** Assignment modal and action triggers.
- **Testing Method:** Assign an incident to an officer squad and verify status transitions to `"Assigned"`.
- **Status:** Integrated

### 3.3 Corrective Action & Penalty Logging
- **Backend Implementation:** `app/government/router.py::record_corrective_action`
- **API Endpoint:** `POST /api/v1/government/complaints/{id}/action`
- **Request Fields:** `officer_name: str`, `action_type: "notice" | "fine" | "shutdown" | "dousing" | "inspection"`, `description: str`, `fine_amount?: float`, `notices_issued?: str`, `documents_url?: str`
- **Response Fields:** Updated `ComplaintDetailResponse` with corrective action list
- **Frontend Page/Component:** `src/app/government/actions/page.tsx`
- **Frontend Support:** Action recording modal, penalty input, document link.
- **Testing Method:** Log fine or notice, verify incident status updates to `"Action Taken"`.
- **Status:** Integrated

### 3.4 Statutory Status Transition
- **Backend Implementation:** `app/government/router.py::update_status`
- **API Endpoint:** `POST /api/v1/government/complaints/{id}/status`
- **Request Fields:** `new_status: str`, `notes?: str`
- **Response Fields:** Updated `ComplaintDetailResponse`
- **Frontend Page/Component:** `src/components/government/IncidentDrawer.tsx`, `/government/incidents`
- **Frontend Support:** Dropdown status change with audit notes.
- **Testing Method:** Transition incident from `"Assigned"` to `"Resolved"` and check history timeline.
- **Status:** Integrated

---

## 4. Regional Manager Operations, Briefings & Reporting

### 4.1 Regional Executive Overview
- **Backend Implementation:** `app/regional/router.py::get_regional_overview`
- **API Endpoint:** `GET /api/v1/regional/overview`
- **Response Fields:** `total_incidents, new_incidents, ongoing_incidents, resolved_incidents, critical_incidents, categories, statuses, severities, recent_activity`
- **Frontend Page/Component:** `src/app/regional-manager/page.tsx`
- **Frontend Support:** Executive analytics, distribution charts, activity feed.
- **Testing Method:** Verify live payload aggregates regional statistics across Chembur/Govandi/Mankhurd.
- **Status:** Integrated

### 4.2 Regional Incident Registry
- **Backend Implementation:** `app/regional/router.py::get_regional_incidents`
- **API Endpoint:** `GET /api/v1/regional/incidents`
- **Query Params:** `status?: str`, `severity?: str`, `search?: str`
- **Response Fields:** `List[RegionalIncidentItem]` with source candidates and assigned squad details
- **Frontend Page/Component:** `src/app/regional-manager/page.tsx` (Incidents Tab)
- **Frontend Support:** Filterable multi-incident table with quick audit modal.
- **Testing Method:** Filter by `"Critical"` and inspect incident attributes.
- **Status:** Integrated

### 4.3 Automated Daily Intelligence Briefing
- **Backend Implementation:** `app/regional/router.py::get_daily_briefing`
- **API Endpoint:** `GET /api/v1/regional/briefing/daily`
- **Response Fields:** `briefing_date, total_active_incidents, critical_count, high_priority_count, dominant_pollution_type, key_observations, recommended_actions, severe_incidents, hotspot_summary`
- **Frontend Page/Component:** `src/app/regional-manager/page.tsx` (Daily Briefing Tab)
- **Frontend Support:** Formatted daily executive briefing view with export capabilities.
- **Testing Method:** Fetch daily briefing and verify dynamic generation from actual database incidents.
- **Status:** Integrated

### 4.4 Automated Weekly Strategic Briefing
- **Backend Implementation:** `app/regional/router.py::get_weekly_briefing`
- **API Endpoint:** `GET /api/v1/regional/briefing/weekly`
- **Response Fields:** `briefing_period, total_incidents_this_week, resolved_this_week, open_unresolved, compliance_rate, trend_direction, top_violators, source_distribution, regional_insights`
- **Frontend Page/Component:** `src/app/regional-manager/page.tsx` (Weekly Briefing Tab)
- **Frontend Support:** Strategic weekly intelligence panel with trend direction and compliance metrics.
- **Testing Method:** Fetch weekly briefing and verify mathematical aggregation of weekly metrics.
- **Status:** Integrated

### 4.5 Multi-Incident Consolidated Report Generation & Persistence
- **Backend Implementation:**
  - Generate: `POST /api/v1/regional/reports/generate`
  - Save: `POST /api/v1/regional/reports/save`
  - List: `GET /api/v1/regional/reports`
  - Get: `GET /api/v1/regional/reports/{id}`
- **Request Fields:** `incident_ids: List[int]`, `title?: str`, `compliance_observations?: str`
- **Response Fields:** `RegionalReportResponse` with generated content and audit trail
- **Frontend Page/Component:** `src/app/regional-manager/page.tsx` (Multi-Incident Audit Reports Tab)
- **Frontend Support:** Report builder modal, selection checkboxes, preview, and save to registry.
- **Testing Method:** Select 3 incidents, generate consolidated report, save, and verify in registry.
- **Status:** Integrated

---

## 5. Environmental Intelligence & Scientific Services

### 5.1 Real-Time Air Quality & Isolation Forest Anomalies
- **Backend Implementation:** `app/environmental_data/router.py::get_air_quality`
- **API Endpoint:** `GET /api/v1/environmental/air-quality`
- **Response Fields:** `List[AirQualityReadingResponse]` (`station_id, pm25, pm10, no2, so2, aqi, aqi_bucket, is_anomaly, anomaly_score`)
- **Frontend Page/Component:** `src/components/government/AnalyticsView.tsx`, `GovernmentOverviewMap.tsx`
- **Frontend Support:** Recharts anomaly bar graphs, geographical sensor pins.
- **Testing Method:** Verify live CPCB simulation feed.
- **Status:** Integrated

### 5.2 Atmospheric Trajectory & Weather
- **Backend Implementation:** `app/environmental_data/router.py::get_weather`
- **API Endpoint:** `GET /api/v1/environmental/weather`
- **Response Fields:** `List[WeatherObservationResponse]` (`wind_speed, wind_direction_deg, temperature, humidity`)
- **Frontend Page/Component:** `TrajectoryChapter.tsx`, `InteractiveInvestigationMap.tsx`
- **Frontend Support:** Wind direction vector overlays and backward trajectory tracing.
- **Testing Method:** Validate wind angles against upwind plume projections.
- **Status:** Integrated

### 5.3 Land-Use & Suspected Emission Zones (ISRO Bhuvan)
- **Backend Implementation:** `app/environmental_data/router.py::get_land_use`
- **API Endpoint:** `GET /api/v1/environmental/land-use`
- **Response Fields:** `List[LandUseLocation]` (`name, category, latitude, longitude, area_hectares, is_suspected_emission_source`)
- **Frontend Page/Component:** `InteractiveInvestigationMap.tsx`, `GovernmentOverviewMap.tsx`
- **Frontend Support:** Real geographical polygon/marker overlay on OpenStreetMap.
- **Testing Method:** Verify landfill, industrial corridor, and residential boundaries.
- **Status:** Integrated

### 5.4 Chemical Fingerprint & EPA SPECIATE Matrix
- **Backend Implementation:** `app/environmental_data/router.py::get_speciate_profiles`
- **API Endpoint:** `GET /api/v1/environmental/speciate-profiles`
- **Response Fields:** `List[ChemicalSourceProfile]` (`source_type, voc_profile, pah_profile, heavy_metals_profile, markers`)
- **Frontend Page/Component:** `ChemicalFingerprint.tsx`, `InteractiveChemicalFingerprint.tsx`
- **Frontend Support:** Interactive circular hotspot visualization with real chemical constituent breakdown.
- **Testing Method:** Click hotspot, verify mass fraction, reference limits, and source association.
- **Status:** Integrated

