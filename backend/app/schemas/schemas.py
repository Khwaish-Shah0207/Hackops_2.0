import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel

# Auth & User
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "citizen" # "citizen" or "government"
    organization: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    organization: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

# Complaint
class ComplaintCreate(BaseModel):
    title: str
    description: str
    pollution_type: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    observed_at: Optional[datetime.datetime] = None
    image_url: Optional[str] = None

class SourceCandidateResponse(BaseModel):
    id: int
    complaint_id: int
    name: str
    category: str
    latitude: float
    longitude: float
    distance_km: float
    wind_compatibility_score: float
    transport_time_minutes: float
    pollution_anomaly_score: float
    complaint_density_score: float
    land_use_weight: float
    chemical_match_score: float
    overall_evidence_score: float
    confidence_level: str
    explanation: str
    shortlist_reason: str
    evidence_breakdown: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class InvestigationReportResponse(BaseModel):
    id: int
    complaint_id: int
    report_number: str
    executive_summary: str
    observed_evidence: Optional[Dict[str, Any]] = None
    model_findings: Optional[Dict[str, Any]] = None
    simulated_evidence: Optional[Dict[str, Any]] = None
    unverified_citizen_reports: Optional[Dict[str, Any]] = None
    meteorological_summary: Optional[Dict[str, Any]] = None
    chemical_fingerprint_summary: Optional[Dict[str, Any]] = None
    data_limitations: str
    recommended_actions: Optional[List[str]] = None
    generated_at: datetime.datetime

    class Config:
        from_attributes = True

class GovernmentAssignmentResponse(BaseModel):
    id: int
    complaint_id: int
    assigned_to_name: str
    department: str
    priority: str
    inspection_scheduled_date: Optional[datetime.datetime] = None
    notes: Optional[str] = None
    assigned_at: datetime.datetime

    class Config:
        from_attributes = True

class CorrectiveActionCreate(BaseModel):
    officer_name: str
    action_type: str
    description: str
    fine_amount: Optional[float] = 0.0
    notices_issued: Optional[str] = None
    documents_url: Optional[str] = None

class CorrectiveActionResponse(BaseModel):
    id: int
    complaint_id: int
    officer_name: str
    action_type: str
    description: str
    fine_amount: float
    notices_issued: Optional[str] = None
    documents_url: Optional[str] = None
    action_timestamp: datetime.datetime

    class Config:
        from_attributes = True

class IncidentStatusHistoryResponse(BaseModel):
    id: int
    complaint_id: int
    previous_status: str
    new_status: str
    changed_by_user: str
    change_notes: Optional[str] = None
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

class CitizenFeedbackCreate(BaseModel):
    is_improved: bool
    satisfaction_rating: int # 1 to 5
    comments: Optional[str] = None
    reopen_requested: Optional[bool] = False

class CitizenFeedbackResponse(BaseModel):
    id: int
    complaint_id: int
    citizen_id: Optional[int] = None
    is_improved: bool
    satisfaction_rating: int
    comments: Optional[str] = None
    reopen_requested: bool
    submitted_at: datetime.datetime

    class Config:
        from_attributes = True

class ComplaintResponse(BaseModel):
    id: int
    complaint_number: str
    citizen_id: Optional[int] = None
    title: str
    description: str
    pollution_type: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    observed_at: datetime.datetime
    status: str
    image_url: Optional[str] = None
    is_demo: bool
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class ComplaintDetailResponse(ComplaintResponse):
    source_candidates: List[SourceCandidateResponse] = []
    investigation_report: Optional[InvestigationReportResponse] = None
    assignment: Optional[GovernmentAssignmentResponse] = None
    corrective_actions: List[CorrectiveActionResponse] = []
    status_history: List[IncidentStatusHistoryResponse] = []
    feedback: Optional[CitizenFeedbackResponse] = None

class AssignmentCreate(BaseModel):
    assigned_to_name: str
    department: str
    priority: str = "Medium"
    inspection_scheduled_date: Optional[datetime.datetime] = None
    notes: Optional[str] = None

class StatusUpdateCreate(BaseModel):
    new_status: str
    notes: Optional[str] = None

# Environmental readings
class AirQualityReadingResponse(BaseModel):
    id: int
    station_id: str
    station_name: str
    latitude: float
    longitude: float
    timestamp: datetime.datetime
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    so2: Optional[float] = None
    co: Optional[float] = None
    o3: Optional[float] = None
    aqi: Optional[float] = None
    aqi_bucket: Optional[str] = None
    is_synthetic: bool
    is_anomaly: bool
    anomaly_score: float
    data_source: str

    class Config:
        from_attributes = True

class WeatherObservationResponse(BaseModel):
    id: int
    station_id: str
    latitude: float
    longitude: float
    timestamp: datetime.datetime
    wind_speed: float
    wind_direction_deg: float
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    is_synthetic: bool
    data_source: str

    class Config:
        from_attributes = True
