import datetime
import math
from app.database import engine, Base, SessionLocal
from app.models.all_models import (
    User,
    Complaint,
    AirQualityReading,
    WeatherObservation,
    HistoricalPollution,
    LandUseLocation,
    ChemicalMeasurement,
    ChemicalSourceProfile,
    IncidentStatusHistory,
    RegionalReport
)
from app.auth.security import hash_password
from app.source_detection.engine import SourceIdentificationEngine
from app.reports.service import InvestigationReportGenerator
from app.pollution.anomaly import PollutionAnomalyDetector
from app.severity.engine import IntelligentSeverityEngine

def ensure_schema_migrations():
    """Ensure newly introduced columns exist in SQLite database without recreating tables."""
    try:
        with engine.connect() as conn:
            cols = [r[1] for r in conn.exec_driver_sql("PRAGMA table_info(complaints)").fetchall()]
            if 'severity' not in cols:
                conn.exec_driver_sql("ALTER TABLE complaints ADD COLUMN severity VARCHAR(50) DEFAULT 'Moderate'")
            if 'severity_score' not in cols:
                conn.exec_driver_sql("ALTER TABLE complaints ADD COLUMN severity_score FLOAT DEFAULT 50.0")
            if 'severity_assessment' not in cols:
                conn.exec_driver_sql("ALTER TABLE complaints ADD COLUMN severity_assessment JSON")
            conn.commit()
    except Exception as e:
        print(f"Schema migration notice: {e}")

def seed_database():
    print("Creating all database tables & verifying migrations...")
    Base.metadata.create_all(bind=engine)
    ensure_schema_migrations()
    
    db = SessionLocal()
    try:
        now = datetime.datetime.utcnow()

        print("Ensuring users are seeded...")
        # 1. Users
        citizen_user = db.query(User).filter(User.email == "citizen@enviro.gov").first()
        if not citizen_user:
            citizen_user = User(
                email="citizen@enviro.gov",
                hashed_password=hash_password("citizen123"),
                full_name="Aarav Sharma",
                role="citizen",
                organization="Chembur Resident Welfare Association"
            )
            db.add(citizen_user)
            db.commit()
            db.refresh(citizen_user)

        gov_user = db.query(User).filter(User.email == "officer@mpcb.gov.in").first()
        if not gov_user:
            gov_user = User(
                email="officer@mpcb.gov.in",
                hashed_password=hash_password("officer123"),
                full_name="Dr. Sunita Deshmukh",
                role="government",
                organization="Maharashtra Pollution Control Board (MPCB)"
            )
            db.add(gov_user)
            db.commit()
            db.refresh(gov_user)

        mgr_user = db.query(User).filter(User.email == "manager@mpcb.gov.in").first()
        if not mgr_user:
            mgr_user = User(
                email="manager@mpcb.gov.in",
                hashed_password=hash_password("manager123"),
                full_name="Shri Rajesh Verma",
                role="regional_manager",
                organization="MPCB Regional Directorate - Mumbai East"
            )
            db.add(mgr_user)
            db.commit()
            db.refresh(mgr_user)

        print("Checking land use locations...")
        # 2. Land Use Locations
        if db.query(LandUseLocation).count() == 0:
            print("Seeding land use locations (ISRO Bhuvan style)...")
            land_use_data = [
                LandUseLocation(
                    name="Deonar Solid Waste Dumping Ground",
                    category="landfill",
                    latitude=19.0435,
                    longitude=72.9250,
                    area_hectares=132.0,
                    description="Large municipal solid waste disposal ground with recurring open refuse smoldering reports.",
                    is_suspected_emission_source=True,
                    data_source="ISRO Bhuvan High-Resolution Land-Use Layer"
                ),
                LandUseLocation(
                    name="Trombay Chemical & Fertilizer Industrial Zone",
                    category="industrial_area",
                    latitude=19.0180,
                    longitude=72.9050,
                    area_hectares=85.0,
                    description="Heavy industrial zone housing fertilizer processing and power generation boilers.",
                    is_suspected_emission_source=True,
                    data_source="ISRO Bhuvan Industrial Boundary Dataset"
                ),
                LandUseLocation(
                    name="Govandi - Mankhurd Scrap Recycling Clusters",
                    category="industrial_area",
                    latitude=19.0490,
                    longitude=72.9220,
                    area_hectares=28.0,
                    description="Informal e-waste and polymer sorting yard with periodic small-scale burning.",
                    is_suspected_emission_source=True,
                    data_source="ISRO Bhuvan Spatial Registry"
                ),
                LandUseLocation(
                    name="Eastern Freeway Transit Corridor",
                    category="road",
                    latitude=19.0510,
                    longitude=72.9020,
                    area_hectares=14.0,
                    description="Major multi-lane arterial highway with sustained heavy diesel truck transport.",
                    is_suspected_emission_source=False,
                    data_source="ISRO Bhuvan Transportation Layer"
                ),
                LandUseLocation(
                    name="Chembur Colony Residential Sector",
                    category="residential",
                    latitude=19.0580,
                    longitude=72.8980,
                    area_hectares=160.0,
                    description="High-density residential housing with schools and health clinics.",
                    is_suspected_emission_source=False,
                    data_source="ISRO Bhuvan Urban Settlement Map"
                ),
                LandUseLocation(
                    name="Thane Creek Mangrove Wetland",
                    category="water_body",
                    latitude=19.0300,
                    longitude=72.9500,
                    area_hectares=450.0,
                    description="Ecologically sensitive coastal wetlands and tidal mudflats.",
                    is_suspected_emission_source=False,
                    data_source="ISRO Bhuvan Wetland Atlas"
                )
            ]
            db.add_all(land_use_data)
            db.commit()

        print("Checking air quality sensor network...")
        # 3. Air Quality Sensor Readings
        if db.query(AirQualityReading).count() == 0:
            print("Seeding air quality sensor network (CPCB style)...")
            aq_readings = [
                AirQualityReading(
                    station_id="CPCB-MH-011",
                    station_name="Govandi East Monitoring Station",
                    latitude=19.0460,
                    longitude=72.9180,
                    timestamp=now - datetime.timedelta(minutes=25),
                    pm25=218.4,
                    pm10=342.1,
                    no2=48.2,
                    so2=28.6,
                    co=2.4,
                    o3=32.1,
                    aqi=375.0,
                    aqi_bucket="Very Poor",
                    is_synthetic=True,
                    is_anomaly=True,
                    anomaly_score=88.5,
                    data_source="CPCB Real-Time AQI Simulation"
                ),
                AirQualityReading(
                    station_id="CPCB-MH-014",
                    station_name="Chembur Collector Colony Station",
                    latitude=19.0565,
                    longitude=72.8995,
                    timestamp=now - datetime.timedelta(minutes=15),
                    pm25=184.2,
                    pm10=295.6,
                    no2=42.0,
                    so2=22.4,
                    co=1.9,
                    o3=36.0,
                    aqi=349.0,
                    aqi_bucket="Very Poor",
                    is_synthetic=True,
                    is_anomaly=True,
                    anomaly_score=78.2,
                    data_source="CPCB Real-Time AQI Simulation"
                ),
                AirQualityReading(
                    station_id="CPCB-MH-022",
                    station_name="Sion Hospital Ambient Station",
                    latitude=19.0380,
                    longitude=72.8650,
                    timestamp=now - datetime.timedelta(minutes=30),
                    pm25=64.0,
                    pm10=118.0,
                    no2=31.0,
                    so2=14.0,
                    co=0.9,
                    o3=28.0,
                    aqi=113.0,
                    aqi_bucket="Moderate",
                    is_synthetic=True,
                    is_anomaly=False,
                    anomaly_score=22.0,
                    data_source="CPCB Real-Time AQI Simulation"
                ),
                AirQualityReading(
                    station_id="CPCB-MH-031",
                    station_name="Kurla West Transport Hub Station",
                    latitude=19.0720,
                    longitude=72.8790,
                    timestamp=now - datetime.timedelta(minutes=20),
                    pm25=88.0,
                    pm10=145.0,
                    no2=38.5,
                    so2=16.2,
                    co=1.2,
                    o3=30.4,
                    aqi=160.0,
                    aqi_bucket="Moderate",
                    is_synthetic=True,
                    is_anomaly=False,
                    anomaly_score=35.0,
                    data_source="CPCB Real-Time AQI Simulation"
                ),
                AirQualityReading(
                    station_id="CPCB-MH-045",
                    station_name="Vashi Creek Perimeter Station",
                    latitude=19.0620,
                    longitude=72.9650,
                    timestamp=now - datetime.timedelta(minutes=40),
                    pm25=46.0,
                    pm10=82.0,
                    no2=22.1,
                    so2=9.8,
                    co=0.6,
                    o3=41.0,
                    aqi=77.0,
                    aqi_bucket="Satisfactory",
                    is_synthetic=True,
                    is_anomaly=False,
                    anomaly_score=15.0,
                    data_source="CPCB Real-Time AQI Simulation"
                )
            ]
            db.add_all(aq_readings)
            db.commit()

        print("Checking weather observations...")
        # 4. Weather Observations
        if db.query(WeatherObservation).count() == 0:
            print("Seeding weather observations (NOAA HYSPLIT style)...")
            weather_obs = [
                WeatherObservation(
                    station_id="NOAA-MH-AWS-01",
                    latitude=19.0500,
                    longitude=72.9100,
                    timestamp=now - datetime.timedelta(minutes=30),
                    wind_speed=4.2,
                    wind_direction_deg=108.0,
                    temperature=29.2,
                    humidity=64.0,
                    pressure=1011.5,
                    is_synthetic=True,
                    data_source="NOAA HYSPLIT Synoptic Archive"
                ),
                WeatherObservation(
                    station_id="NOAA-MH-AWS-02",
                    latitude=19.0400,
                    longitude=72.9300,
                    timestamp=now - datetime.timedelta(hours=2),
                    wind_speed=3.8,
                    wind_direction_deg=115.0,
                    temperature=31.0,
                    humidity=58.0,
                    pressure=1010.8,
                    is_synthetic=True,
                    data_source="NOAA HYSPLIT Synoptic Archive"
                )
            ]
            db.add_all(weather_obs)
            db.commit()

        print("Checking historical pollution trends...")
        # 5. Historical Daily Observations
        if db.query(HistoricalPollution).count() == 0:
            print("Seeding historical pollution trends...")
            historical_records = []
            base_date = now.date() - datetime.timedelta(days=90)
            for i in range(90):
                day_date = base_date + datetime.timedelta(days=i)
                seasonal_bump = 45.0 * math.sin(i / 15.0)
                pm25 = max(25.0, 75.0 + seasonal_bump + (15.0 * (i % 7 == 0)))
                pm10 = pm25 * 1.7
                aqi = min(400.0, pm25 * 1.8)
                historical_records.append(
                    HistoricalPollution(
                        station_id="CPCB-MH-014",
                        date=datetime.datetime.combine(day_date, datetime.time(12, 0)),
                        pm25=round(pm25, 1),
                        pm10=round(pm10, 1),
                        no2=round(25.0 + (pm25 * 0.15), 1),
                        so2=round(12.0 + (pm25 * 0.08), 1),
                        aqi=round(aqi, 0),
                        seasonal_pattern="Winter Temperature Inversion / Stagnation" if i < 45 else "Pre-Monsoon Dispersion",
                        is_synthetic=True,
                        data_source="Historical Ambient Daily Air Quality Dataset"
                    )
                )
            db.add_all(historical_records)
            db.commit()

        print("Checking chemical measurements...")
        # 6. Chemical speciation measurements
        if db.query(ChemicalMeasurement).count() == 0:
            print("Seeding chemical measurements & SPECIATE profiles...")
            chem_meas = ChemicalMeasurement(
                location_name="Govandi Downwind Ambient Air Monitoring Station",
                latitude=19.0470,
                longitude=72.9150,
                timestamp=now - datetime.timedelta(minutes=30),
                voc_fraction=0.31,
                pah_fraction=0.29,
                heavy_metals_fraction=0.14,
                particulate_carbon_fraction=0.41,
                sulfate_fraction=0.18,
                chloride_levoglucosan_ratio=0.82,
                is_synthetic=True,
                data_source="MPCB Mumbai Emission Inventory & Source Apportionment (Synthetic Speciation Profile)"
            )
            db.add(chem_meas)
            db.commit()

        print("Ensuring original sample incidents are present...")
        # 7. Clustered previous citizen complaints near Deonar / Region B
        inc1 = db.query(Complaint).filter(Complaint.complaint_number == "INC-2026-0001").first()
        if not inc1:
            inc1 = Complaint(
                complaint_number="INC-2026-0001",
                citizen_id=citizen_user.id,
                title="Continuous thick smoke from garbage dumping ground",
                description="Dense toxic white-grey smoke pouring across the road from the municipal landfill perimeter. Strong plastic stench.",
                pollution_type="waste_burning",
                latitude=19.0440,
                longitude=72.9240,
                address="Near Deonar Abattoir Gate, Dumping Ground Road",
                observed_at=now - datetime.timedelta(days=2, hours=4),
                status="Action Taken",
                is_demo=True
            )
            db.add(inc1)
            db.commit()

        inc2 = db.query(Complaint).filter(Complaint.complaint_number == "INC-2026-0002").first()
        if not inc2:
            inc2 = Complaint(
                complaint_number="INC-2026-0002",
                citizen_id=citizen_user.id,
                title="Nighttime burning of scrap plastic and trash near creek",
                description="Open fire ignited in waste mounds behind the recycling yards. Heavy particulate and choking smell.",
                pollution_type="waste_burning",
                latitude=19.0485,
                longitude=72.9215,
                address="Mankhurd Scrap Market, Ghatkopar-Mankhurd Link Rd",
                observed_at=now - datetime.timedelta(days=1, hours=10),
                status="Resolved",
                is_demo=True
            )
            db.add(inc2)
            db.commit()

        inc3 = db.query(Complaint).filter(Complaint.complaint_number == "INC-2026-0003").first()
        if not inc3:
            inc3 = Complaint(
                complaint_number="INC-2026-0003",
                citizen_id=citizen_user.id,
                title="Recurring smoke smell in surrounding residential area",
                description="Late evening burning smoke drifting into residential windows. Difficulty breathing for senior citizens.",
                pollution_type="smoke",
                latitude=19.0460,
                longitude=72.9190,
                address="Govandi Shivaji Nagar Sector 4",
                observed_at=now - datetime.timedelta(hours=14),
                status="Action Taken",
                is_demo=True
            )
            db.add(inc3)
            db.commit()

        # 8. Primary Demo Complaint (Region A: Chembur Resident reports smoke)
        inc4 = db.query(Complaint).filter(Complaint.complaint_number == "INC-2026-0004").first()
        if not inc4:
            inc4 = Complaint(
                complaint_number="INC-2026-0004",
                citizen_id=citizen_user.id,
                title="Heavy toxic smoke and chemical burning odor in Chembur Colony",
                description="Intense blanket of smoke drifting across Chembur Colony this morning. Eyes stinging and severe burning smell. Suspected waste burning upwind.",
                pollution_type="waste_burning",
                latitude=19.0570,
                longitude=72.8990,
                address="Near Diamond Garden, Chembur Colony, Mumbai 400071",
                observed_at=now - datetime.timedelta(minutes=45),
                status="Under Analysis",
                is_demo=True
            )
            db.add(inc4)
            db.commit()
            db.refresh(inc4)

            # Initial status history
            h1 = IncidentStatusHistory(
                complaint_id=inc4.id,
                previous_status="None",
                new_status="Reported",
                changed_by_user=citizen_user.full_name,
                change_notes="Demonstration incident submitted by citizen."
            )
            db.add(h1)
            db.commit()

            print("Running Source Identification Engine on demonstration incident...")
            SourceIdentificationEngine.investigate_incident(db, inc4)
            InvestigationReportGenerator.generate_or_update_report(db, inc4)
            
            inc4.status = "Source Identified / Investigation Required"
            h2 = IncidentStatusHistory(
                complaint_id=inc4.id,
                previous_status="Reported",
                new_status="Source Identified / Investigation Required",
                changed_by_user="Autonomous Source Detection Engine",
                change_notes="Multi-criteria evidence synthesis complete: Region B (Deonar Landfill) identified as primary upwind candidate."
            )
            db.add(h2)
            db.commit()

        print("Evaluating Intelligent Severity Assessments for all incidents...")
        # 9. Intelligent Severity Assessment for all complaints
        all_complaints = db.query(Complaint).all()
        for c in all_complaints:
            if not c.severity_assessment or not c.severity:
                sev, sev_score, sev_data = IntelligentSeverityEngine.assess_incident(db, c)
                c.severity = sev
                c.severity_score = sev_score
                c.severity_assessment = sev_data
        db.commit()

        print("Checking Regional Manager initial reports...")
        # 10. Seed initial Regional Report if none exist
        if db.query(RegionalReport).count() == 0:
            reg_report = RegionalReport(
                report_number="REG-REP-2026-0001",
                title="Eastern Suburbs Multi-Incident Air Compliance & Landfill Smolder Audit",
                incident_ids=[1, 2, 3, 4],
                report_type="consolidated",
                generated_by="Shri Rajesh Verma (Regional Manager)",
                summary="Consolidated regional compliance audit reviewing recurrent municipal landfill smoldering and downwind residential plume dispersion across Chembur-Govandi-Mankhurd corridor.",
                compliance_observations="High frequency of waste burning violations detected within 2.5km upwind perimeter of Deonar municipal dumping ground. Recommended continuous perimeter thermal drone surveillance and issuance of Section 31A environmental protection directives.",
                content={
                    "report_number": "REG-REP-2026-0001",
                    "title": "Eastern Suburbs Multi-Incident Air Compliance & Landfill Smolder Audit",
                    "generation_date": now.strftime("%B %d, %Y - %H:%M UTC"),
                    "generated_by": "Shri Rajesh Verma (Regional Manager)",
                    "report_type": "consolidated",
                    "incidents_count": 4,
                    "summary": "Consolidated regional compliance audit reviewing recurrent municipal landfill smoldering and downwind residential plume dispersion across Chembur-Govandi-Mankhurd corridor.",
                    "compliance_observations": "High frequency of waste burning violations detected within 2.5km upwind perimeter of Deonar municipal dumping ground. Recommended continuous perimeter thermal drone surveillance and issuance of Section 31A environmental protection directives.",
                    "incidents": [
                        {
                            "id": 4,
                            "complaint_number": "INC-2026-0004",
                            "title": "Heavy toxic smoke and chemical burning odor in Chembur Colony",
                            "pollution_category": "Waste Burning",
                            "severity": "Critical",
                            "current_status": "Source Identified / Investigation Required",
                            "location": "Near Diamond Garden, Chembur Colony, Mumbai 400071",
                            "suspected_source": "Deonar Solid Waste Dumping Ground (88.5% confidence)",
                            "ai_analysis": "NOAA backward plume trajectory establishes direct transport vector from 108 deg at 4.2 m/s matching CPCB PM2.5 corridor anomaly.",
                            "actions_taken": ["Autonomous Source Detection Engine investigation complete."]
                        },
                        {
                            "id": 1,
                            "complaint_number": "INC-2026-0001",
                            "title": "Continuous thick smoke from garbage dumping ground",
                            "pollution_category": "Waste Burning",
                            "severity": "High",
                            "current_status": "Action Taken",
                            "location": "Near Deonar Abattoir Gate, Dumping Ground Road",
                            "suspected_source": "Deonar Municipal Landfill Perimeter",
                            "ai_analysis": "Persistent open refuse burning cluster verified by high particulate carbon and chlorinated polymer ratio.",
                            "actions_taken": ["Notice issued under Air Act; daily water sprinkler rounds mandated."]
                        },
                        {
                            "id": 3,
                            "complaint_number": "INC-2026-0003",
                            "title": "Recurring smoke smell in surrounding residential area",
                            "pollution_category": "Dense Smoke",
                            "severity": "Medium",
                            "current_status": "Action Taken",
                            "location": "Govandi Shivaji Nagar Sector 4",
                            "suspected_source": "Govandi Scrap & Recycling Yards",
                            "ai_analysis": "Evening temperature inversion trapping localized smoldering emissions.",
                            "actions_taken": ["Night surveillance squad dispatched."]
                        },
                        {
                            "id": 2,
                            "complaint_number": "INC-2026-0002",
                            "title": "Nighttime burning of scrap plastic and trash near creek",
                            "pollution_category": "Waste Burning",
                            "severity": "High",
                            "current_status": "Resolved",
                            "location": "Mankhurd Scrap Market, Ghatkopar-Mankhurd Link Rd",
                            "suspected_source": "Informal scrap sorting and wire burning yard",
                            "ai_analysis": "Rapid enforcement team dispatch extinguished refuse fire; penalty notice served.",
                            "actions_taken": ["Field enforcement team extinguished fire; penalty notice served."]
                        }
                    ]
                }
            )
            db.add(reg_report)
            db.commit()

        print("DATABASE SEEDING & SEVERITY ASSESSMENT COMPLETED SUCCESSFULLY!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
