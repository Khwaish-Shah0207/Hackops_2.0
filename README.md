# Environmental Intelligence & Compliance Management System

A full-stack, AI-powered platform for **Air Pollution Incident Detection, Source Identification, and Compliance Tracking**.

Built for citizens to report open waste burning, smoke, and hazardous emissions, and for environmental authorities (CPCB, State PCBs, Municipal Corporations) to investigate upwind pollution origins through explainable multi-criteria evidence synthesis.

> **Important Regulatory Notice:** This system provides evidence-based decision support. It does not automatically declare guilt or make official regulatory decisions without physical inspection.

---

## 1. System Architecture & Workflow

```
[CITIZEN INCIDENT]
  │ (Map Pin, Photo, Type, Timestamp)
  ▼
[ENVIRONMENTAL DATA INGESTION]
  │ CPCB AQI Sensors • NOAA Wind Vectors • Historical Daily Fluctuations • ISRO Bhuvan Land-Use
  ▼
[AI SOURCE IDENTIFICATION ENGINE]
  ├── A. Lagrangian Backward Trajectory (NOAA HYSPLIT Fallback & Simulation)
  ├── B. Sensor Anomaly Detection (Isolation Forest)
  ├── C. Semantic Complaint Clustering (Multilingual Sentence Representation)
  ├── D. Geospatial Land-Use Weighting (ISRO Bhuvan Proximity Analysis)
  └── E. Receptor Chemical Fingerprint (EPA SPECIATE v5.4 & EPA CMB 8.2)
  ▼
[EXPLAINABLE SOURCE RANKING & INVESTIGATION REPORT]
  │ Synthesizes Evidence Score (0-100), Confidence Level, and Shortlist Reasoning
  ▼
[GOVERNMENT COMPLIANCE CONSOLE]
  │ Inspection Team Assignment • Corrective Enforcement Actions (Fines, Notices) • Status History
  ▼
[CITIZEN RESOLUTION FEEDBACK]
  │ Verification Rating • Reopening Trigger if Smoke Persists
```

---

## 2. Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Leaflet with OpenStreetMap, Recharts, Lucide Icons.
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Pydantic v2, RESTful APIs, JWT Auth.
- **Database**: SQLite (default zero-dependency execution) & PostgreSQL / PostGIS compatible schema.
- **AI / ML Modules**:
  - `Isolation Forest` (`scikit-learn`): Outlier detection on sensor networks for corridor plume spikes.
  - `Lagrangian Plume Trajectory` (NOAA HYSPLIT compatible backward vector solver).
  - `Semantic Complaint Similarity` (Multilingual vector representation & cosine similarity).
  - `Spatial Land-Use Proximity` (`shapely` / GeoPandas format).
  - `Chemical Mass Balance (EPA CMB 8.2)` & `EPA SPECIATE v5.4` reference source profile library.

---

## 3. Demonstration Scenario (Region A ➔ Region B)

The database is pre-seeded with a comprehensive real-world scenario centered in Mumbai's eastern suburbs:

1. **Region A (Complaint Site):** Chembur Colony resident submits incident `INC-2026-0004` reporting heavy toxic smoke and chemical burning odors.
2. **Meteorological Vector:** Surface wind blows from **108° (East-South-East)** toward Chembur at **4.2 m/s**.
3. **Plume Corridor Sensors:** CPCB monitoring stations at Govandi East and Chembur record severe PM2.5 spikes (218 µg/m³, AQI 375 - Very Poor).
4. **Historical Citizen Clustered Reports:** Multiple previous citizen filings in the upwind sector report recurring refuse burning.
5. **Region B (Ranked Source Candidates):**
   - **Govandi - Mankhurd Scrap Sorting Yards** (Rank #1, Score: 88.6/100, High Confidence)
   - **Deonar Municipal Solid Waste Landfill** (Rank #2, Score: 87.2/100, High Confidence)
6. **Chemical Speciation Match:** Speciation markers match EPA SPECIATE Profile 8402 (*Municipal Waste Open Burning*) at 86.8% spectral similarity.

---

## 4. Models and Datasets Integration Matrix

| Component | Target Dataset | Model / Method | Operational Status |
|---|---|---|---|
| **Air Quality Readings** | CPCB Real-Time AQI | `Isolation Forest` (scikit-learn) | **Active** (Synthetic CPCB format baseline) |
| **Meteorology & Wind** | NOAA HYSPLIT Meteorological Archive | Lagrangian Backward Vector Solver | **Active** (Simulated fallback interface) |
| **Historical Trends** | Daily Ambient Air Quality Data | Seasonal Decomposition & Moving Averages | **Active** (30-day daily ambient trends) |
| **Citizen Complaints** | Structured Complaint Registry | Multilingual Semantic Embedding & Cosine Sim | **Active** (Cluster density scoring) |
| **Land-Use Classification** | ISRO Bhuvan Land-Use Layer | Spatial Proximity & Land-Use Risk Decay | **Active** (Landfill, industrial, road, water) |
| **Chemical Fingerprinting** | EPA SPECIATE v5.4 & MPCB Mumbai Emission Inventory | EPA CMB 8.2 Mass Balance Apportionment | **Active** (Demonstration speciation mode) |

---

## 5. Quickstart & Execution Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Step 1: Backend Setup
```bash
# Navigate to backend
cd backend

# Create and activate Python virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with the Demonstration Scenario & Synthetic Baseline
python seed_data.py

# Start FastAPI server (runs on http://localhost:8000)
python main.py
```
*Interactive Swagger API documentation available at `http://localhost:8000/docs`.*

### Step 2: Frontend Setup
```bash
# In a separate terminal, navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Start Next.js development server (runs on http://localhost:3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 6. Seed Credentials

- **Citizen Account:** `citizen@enviro.gov` (Password: `citizen123`)
- **Government Officer Account:** `officer@mpcb.gov.in` (Password: `officer123`)

---

## 7. Project Structure

```
Hackops/
├── backend/
│   ├── app/
│   │   ├── auth/                # JWT authentication, roles (citizen/government)
│   │   ├── complaints/          # Incident filing & lifecycle management
│   │   ├── environmental_data/  # CPCB, weather, and historical ingestion
│   │   ├── weather/             # Lagrangian backward trajectory & wind vectors
│   │   ├── pollution/           # Isolation Forest anomaly detection
│   │   ├── source_detection/    # Multi-criteria explainable source ranking engine
│   │   ├── complaint_analysis/  # Semantic complaint similarity & clustering
│   │   ├── land_use/            # ISRO Bhuvan proximity and risk weighting
│   │   ├── chemical_analysis/   # EPA SPECIATE v5.4 & CMB 8.2 interfaces
│   │   ├── reports/             # Formal investigation dossier generator
│   │   ├── government/          # Enforcement, assignments, actions & audit trail
│   │   ├── feedback/            # Citizen resolution rating & reopening trigger
│   │   ├── models/              # SQLAlchemy schema (14 tables)
│   │   ├── schemas/             # Pydantic request & response validation
│   │   ├── config.py            # Environment configurations
│   │   └── database.py          # Database session & engine
│   ├── main.py                  # FastAPI application entrypoint
│   ├── seed_data.py             # Database seeder & demonstration scenario
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Landing Page & System Overview
│   │   │   ├── citizen/         # Citizen Incident Tracking Portal
│   │   │   ├── submit/          # Interactive Complaint Submission Page
│   │   │   ├── incidents/[id]/  # Incident Details & Lagrangian Map
│   │   │   ├── government/      # Government Dashboard & Action Console
│   │   │   └── analytics/       # Air Intelligence & Trends Page
│   │   ├── components/
│   │   │   ├── InvestigationMap.tsx  # Interactive Leaflet map with trajectory line
│   │   │   └── Navbar.tsx            # Navigation header & demonstration banner
│   │   └── lib/
│   │       └── api.ts           # Fetch API client
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── .env.example
└── README.md
```

---

## 8. Environmental API Endpoints

- `POST /api/v1/complaints` — Submit a citizen incident (triggers automated source apportionment).
- `GET /api/v1/complaints` — List complaints with filters.
- `GET /api/v1/complaints/{id}` — Full incident record with ranked candidates, report, and audit history.
- `GET /api/v1/government/dashboard/stats` — High-level compliance statistics & hot spots.
- `POST /api/v1/government/complaints/{id}/assign` — Assign inspection squad.
- `POST /api/v1/government/complaints/{id}/action` — Record field findings, notices, and fines.
- `POST /api/v1/government/complaints/{id}/status` — Transition status with audit log.
- `POST /api/v1/feedback/complaints/{id}` — Citizen resolution verification and reopening trigger.
- `GET /api/v1/environmental/air-quality` — Ambient CPCB-style monitoring readings.
- `GET /api/v1/environmental/historical` — 30-day ambient trends for visualization.
- `GET /api/v1/environmental/speciate-profiles` — EPA SPECIATE reference source signatures.

