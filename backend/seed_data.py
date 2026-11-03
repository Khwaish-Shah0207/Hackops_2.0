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
    IncidentStatusHistory
)
from app.auth.security import hash_password
from app.source_detection.engine import SourceIdentificationEngine
from app.reports.service import InvestigationReportGenerator
from app.pollution.anomaly import PollutionAnomalyDetector

def seed_database():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            print("Database already contains users. Skipping seed or refreshing demo scenario.")
            return

        print("Seeding initial users...")
        # 1. Users
        citizen_user = User(
            email="citizen@enviro.gov",
            hashed_password=hash_password("citizen123"),
            full_name="Aarav Sharma",
            role="citizen",
            organization="Chembur Resident Welfare Association"
        )
        gov_user = User(
            email="officer@mpcb.gov.in",
            hashed_password=hash_password("officer123"),
            full_name="Dr. Sunita Deshmukh",
            role="government",
            organization="Maharashtra Pollution Control Board (MPCB)"
        )
        db.add_all([citizen_user, gov_user])
        db.commit()
        db.refresh(citizen_user)
        db.refresh(gov_user)

        print("Seeding land use locations (ISRO Bhuvan style)...")
        # 2. Land Use Locations (Around Mumbai Eastern Suburbs)
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

        print("Seeding air quality sensor network (CPCB style)...")
        # 3. Air Quality Sensor Readings (Station measurements showing plume propagation)
        now = datetime.datetime.utcnow()
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

        print("Seeding weather observations (NOAA HYSPLIT style)...")
        # 4. Weather Observations (Wind blowing from ESE ~105 deg towards WNW at 4.2 m/s)
        weather_obs = [
            WeatherObservation(
                station_id="NOAA-MH-AWS-01",
                latitude=19.0500,
                longitude=72.9100,
                timestamp=now - datetime.timedelta(minutes=30),
                wind_speed=4.2, # m/s
                wind_direction_deg=108.0, # Meteorological wind FROM 108 deg (ESE blowing toward WNW Chembur)
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

        print("Seeding historical pollution trends...")
        # 5. Historical Daily Observations (90 days showing seasonal fluctuations)
        historical_records = []
        base_date = now.date() - datetime.timedelta(days=90)
        for i in range(90):
            day_date = base_date + datetime.timedelta(days=i)
            # Seasonal winter peak around 30-60 days ago
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

        print("Seeding chemical measurements & SPECIATE profiles...")
        # 6. Chemical speciation measurements
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
            chloride_levoglucosan_ratio=0.82, # High chlorinated polymer marker
            is_synthetic=True,
            data_source="MPCB Mumbai Emission Inventory & Source Apportionment (Synthetic Speciation Profile)"
        )
        db.add(chem_meas)
        db.commit()

        print("Seeding historical citizen complaints around suspected waste-burning site...")
        # 7. Clustered previous citizen complaints near Deonar / Region B
        prior_complaints = [
            Complaint(
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
            ),
            Complaint(
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
            ),
            Complaint(
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
        ]
        db.add_all(prior_complaints)
        db.commit()

        print("Seeding MASTER DEMONSTRATION SCENARIO (Region A -> Region B)...")
        # 8. Primary Demo Complaint (Region A: Chembur Resident reports smoke)
        demo_incident = Complaint(
            complaint_number="INC-2026-0004",
            citizen_id=citizen_user.id,
            title="Heavy toxic smoke and chemical burning odor in Chembur Colony",
            description="Intense blanket of smoke drifting across Chembur Colony this morning. Eyes stinging and severe burning smell. Suspected waste burning upwind.",
            pollution_type="waste_burning",
            latitude=19.0570,
            longitude=72.8990, # Region A (Chembur Colony)
            address="Near Diamond Garden, Chembur Colony, Mumbai 400071",
            observed_at=now - datetime.timedelta(minutes=45),
            status="Under Analysis",
            is_demo=True
        )
        db.add(demo_incident)
        db.commit()
        db.refresh(demo_incident)

        # Status history
        h1 = IncidentStatusHistory(
            complaint_id=demo_incident.id,
            previous_status="None",
            new_status="Reported",
            changed_by_user=citizen_user.full_name,
            change_notes="Demonstration incident submitted by citizen."
        )
        db.add(h1)
        db.commit()

        # Run Source Identification Engine for the demonstration incident
        print("Running Source Identification Engine on demonstration incident...")
        SourceIdentificationEngine.investigate_incident(db, demo_incident)
        InvestigationReportGenerator.generate_or_update_report(db, demo_incident)
        
        demo_incident.status = "Source Identified / Investigation Required"
        h2 = IncidentStatusHistory(
            complaint_id=demo_incident.id,
            previous_status="Reported",
            new_status="Source Identified / Investigation Required",
            changed_by_user="Autonomous Source Detection Engine",
            change_notes="Multi-criteria evidence synthesis complete: Region B (Deonar Landfill) identified as primary upwind candidate."
        )
        db.add(h2)
        db.commit()
        
        print("SEEDING COMPLETED SUCCESSFULLY!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

