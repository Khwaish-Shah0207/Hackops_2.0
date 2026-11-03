import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="citizen", nullable=False) # citizen, government, admin
    organization = Column(String(255), nullable=True) # e.g., CPCB, MPCB, Municipal Corp
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaints = relationship("Complaint", back_populates="citizen", foreign_keys="Complaint.citizen_id")
    feedback = relationship("CitizenFeedback", back_populates="citizen")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. INC-2026-0001
    citizen_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    pollution_type = Column(String(100), nullable=False) # smoke, waste_burning, dust, industrial_emissions, odor, other
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(500), nullable=True)
    observed_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    image_url = Column(String(500), nullable=True)
    
    # Workflow Statuses: Reported -> Under Analysis -> Source Identified / Investigation Required -> Assigned -> Action Taken -> Resolved -> Closed
    status = Column(String(50), default="Reported", nullable=False)
    is_demo = Column(Boolean, default=False)
    severity = Column(String(50), default="Moderate", nullable=True)
    severity_score = Column(Float, default=50.0, nullable=True)
    severity_assessment = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    citizen = relationship("User", back_populates="complaints", foreign_keys=[citizen_id])
    source_candidates = relationship("SourceCandidate", back_populates="complaint", cascade="all, delete-orphan")
    investigation_report = relationship("InvestigationReport", back_populates="complaint", uselist=False, cascade="all, delete-orphan")
    assignment = relationship("GovernmentAssignment", back_populates="complaint", uselist=False, cascade="all, delete-orphan")
    corrective_actions = relationship("CorrectiveAction", back_populates="complaint", cascade="all, delete-orphan")
    status_history = relationship("IncidentStatusHistory", back_populates="complaint", cascade="all, delete-orphan")
    feedback = relationship("CitizenFeedback", back_populates="complaint", uselist=False, cascade="all, delete-orphan")


class AirQualityReading(Base):
    __tablename__ = "air_quality_readings"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(String(50), index=True, nullable=False)
    station_name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, nullable=False, index=True)
    pm25 = Column(Float, nullable=True)
    pm10 = Column(Float, nullable=True)
    no2 = Column(Float, nullable=True)
    so2 = Column(Float, nullable=True)
    co = Column(Float, nullable=True)
    o3 = Column(Float, nullable=True)
    aqi = Column(Float, nullable=True)
    aqi_bucket = Column(String(50), nullable=True) # Good, Satisfactory, Moderate, Poor, Very Poor, Severe
    is_synthetic = Column(Boolean, default=True)
    is_anomaly = Column(Boolean, default=False)
    anomaly_score = Column(Float, default=0.0)
    data_source = Column(String(100), default="CPCB Real-Time AQI")


class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(String(50), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, nullable=False, index=True)
    wind_speed = Column(Float, nullable=False) # m/s or km/h
    wind_direction_deg = Column(Float, nullable=False) # 0-360 degrees (meteorological FROM direction)
    temperature = Column(Float, nullable=True) # Celsius
    humidity = Column(Float, nullable=True) # %
    pressure = Column(Float, nullable=True) # hPa
    is_synthetic = Column(Boolean, default=True)
    data_source = Column(String(100), default="NOAA HYSPLIT-compatible archive")


class HistoricalPollution(Base):
    __tablename__ = "historical_pollution"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(String(50), index=True, nullable=False)
    date = Column(DateTime, nullable=False, index=True)
    pm25 = Column(Float, nullable=False)
    pm10 = Column(Float, nullable=False)
    no2 = Column(Float, nullable=True)
    so2 = Column(Float, nullable=True)
    aqi = Column(Float, nullable=True)
    seasonal_pattern = Column(String(50), nullable=True) # winter_spike, monsoon_clean, post_harvest_burning
    is_synthetic = Column(Boolean, default=True)
    data_source = Column(String(100), default="Historical Daily Ambient Air Quality Data")


class LandUseLocation(Base):
    __tablename__ = "land_use_locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # landfill, industrial_area, residential, road, water_body, construction_site
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    area_hectares = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    is_suspected_emission_source = Column(Boolean, default=False)
    data_source = Column(String(100), default="ISRO Bhuvan")


class ChemicalMeasurement(Base):
    __tablename__ = "chemical_measurements"

    id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    voc_fraction = Column(Float, default=0.0) # Volatile organic compounds
    pah_fraction = Column(Float, default=0.0) # Polycyclic aromatic hydrocarbons
    heavy_metals_fraction = Column(Float, default=0.0) # Pb, Cd, etc.
    particulate_carbon_fraction = Column(Float, default=0.0) # Black / elemental carbon
    sulfate_fraction = Column(Float, default=0.0)
    chloride_levoglucosan_ratio = Column(Float, default=0.0) # Waste burning marker
    is_synthetic = Column(Boolean, default=True)
    data_source = Column(String(150), default="MPCB Mumbai Emission Inventory & Source Apportionment")


class ChemicalSourceProfile(Base):
    __tablename__ = "chemical_source_profiles"

    id = Column(Integer, primary_key=True, index=True)
    profile_name = Column(String(255), nullable=False)
    source_category = Column(String(100), nullable=False) # waste_burning, biomass_burning, vehicular_emissions, industrial_emissions, road_dust
    voc_factor = Column(Float, default=0.0)
    pah_factor = Column(Float, default=0.0)
    heavy_metals_factor = Column(Float, default=0.0)
    black_carbon_factor = Column(Float, default=0.0)
    levoglucosan_factor = Column(Float, default=0.0)
    description = Column(Text, nullable=True)
    is_synthetic = Column(Boolean, default=True)
    data_source = Column(String(100), default="EPA SPECIATE v5.4")


class SourceCandidate(Base):
    __tablename__ = "source_candidates"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=False)
    
    # Sub-scores (0 to 100)
    wind_compatibility_score = Column(Float, default=0.0)
    transport_time_minutes = Column(Float, default=0.0)
    pollution_anomaly_score = Column(Float, default=0.0)
    complaint_density_score = Column(Float, default=0.0)
    land_use_weight = Column(Float, default=0.0)
    chemical_match_score = Column(Float, default=0.0)
    
    # Overall Score & Confidence
    overall_evidence_score = Column(Float, default=0.0) # 0 to 100
    confidence_level = Column(String(50), default="Low") # Low, Moderate, High, Insufficient evidence
    
    # Transparent reasoning
    explanation = Column(Text, nullable=False)
    shortlist_reason = Column(Text, nullable=False)
    evidence_breakdown = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="source_candidates")


class InvestigationReport(Base):
    __tablename__ = "investigation_reports"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), unique=True, nullable=False)
    report_number = Column(String(50), unique=True, nullable=False) # e.g. REP-2026-0001
    
    # Structured report sections
    executive_summary = Column(Text, nullable=False)
    observed_evidence = Column(JSON, nullable=True) # Directly observed
    model_findings = Column(JSON, nullable=True) # Model-generated findings
    simulated_evidence = Column(JSON, nullable=True) # Synthetic / simulated indicators
    unverified_citizen_reports = Column(JSON, nullable=True) # Citizen complaints
    meteorological_summary = Column(JSON, nullable=True)
    chemical_fingerprint_summary = Column(JSON, nullable=True)
    data_limitations = Column(Text, nullable=False)
    recommended_actions = Column(JSON, nullable=True)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="investigation_report")


class GovernmentAssignment(Base):
    __tablename__ = "government_assignments"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), unique=True, nullable=False)
    assigned_to_name = Column(String(255), nullable=False) # Officer / Team Name
    department = Column(String(255), nullable=False) # e.g. Regional Pollution Control Office, Fire Dept, Municipal Ward
    priority = Column(String(50), default="Medium") # Low, Medium, High, Critical
    inspection_scheduled_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="assignment")


class CorrectiveAction(Base):
    __tablename__ = "corrective_actions"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    officer_name = Column(String(255), nullable=False)
    action_type = Column(String(100), nullable=False) # Site Inspection, Notice Issued, Fire Doused, Fine Imposed, Waste Cleared, Warning Issued
    description = Column(Text, nullable=False)
    fine_amount = Column(Float, default=0.0)
    notices_issued = Column(String(255), nullable=True)
    documents_url = Column(String(500), nullable=True)
    action_timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="corrective_actions")


class IncidentStatusHistory(Base):
    __tablename__ = "incident_status_history"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    previous_status = Column(String(50), nullable=False)
    new_status = Column(String(50), nullable=False)
    changed_by_user = Column(String(255), nullable=False)
    change_notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="status_history")


class CitizenFeedback(Base):
    __tablename__ = "citizen_feedback"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), unique=True, nullable=False)
    citizen_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_improved = Column(Boolean, nullable=False) # Has the pollution issue improved?
    satisfaction_rating = Column(Integer, nullable=False) # 1 to 5 stars
    comments = Column(Text, nullable=True)
    reopen_requested = Column(Boolean, default=False)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

    citizen = relationship("User", back_populates="feedback")
    complaint = relationship("Complaint", back_populates="feedback")



class RegionalReport(Base):
    __tablename__ = "regional_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. REG-REP-2026-0001
    title = Column(String(255), nullable=False)
    incident_ids = Column(JSON, nullable=False) # list of incident IDs e.g. [1, 4]
    report_type = Column(String(50), default="consolidated") # "individual" | "consolidated"
    generated_by = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    compliance_observations = Column(Text, nullable=True)
    content = Column(JSON, nullable=False) # structured incident analysis and facts
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
