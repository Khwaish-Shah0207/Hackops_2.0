import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import Complaint, User, IncidentStatusHistory
from app.schemas.schemas import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintDetailResponse
)
from app.auth.deps import get_current_user_optional, get_current_user
from app.source_detection.engine import SourceIdentificationEngine
from app.reports.service import InvestigationReportGenerator

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.post("", response_model=ComplaintDetailResponse)
def submit_complaint(
    complaint_in: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    # Generate unique complaint number
    count = db.query(Complaint).count() + 1
    complaint_number = f"INC-2026-{count:04d}"
    
    observed_time = complaint_in.observed_at or datetime.datetime.utcnow()
    
    complaint = Complaint(
        complaint_number=complaint_number,
        citizen_id=current_user.id if current_user else None,
        title=complaint_in.title,
        description=complaint_in.description,
        pollution_type=complaint_in.pollution_type,
        latitude=complaint_in.latitude,
        longitude=complaint_in.longitude,
        address=complaint_in.address,
        observed_at=observed_time,
        image_url=complaint_in.image_url,
        status="Under Analysis",
        is_demo=False
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    
    # Record initial status in history
    history = IncidentStatusHistory(
        complaint_id=complaint.id,
        previous_status="None",
        new_status="Reported",
        changed_by_user=current_user.full_name if current_user else "Citizen (Guest)",
        change_notes="Incident submitted by citizen."
    )
    db.add(history)
    db.commit()

    # Intelligent Incident Severity Assessment
    try:
        from app.severity.engine import IntelligentSeverityEngine
        sev, sev_score, sev_data = IntelligentSeverityEngine.assess_incident(db, complaint)
        complaint.severity = sev
        complaint.severity_score = sev_score
        complaint.severity_assessment = sev_data
        db.commit()
        db.refresh(complaint)
    except Exception as exc:
        print(f"Error calculating incident severity: {exc}")
    
    # Trigger Source Investigation Workflow
    try:
        SourceIdentificationEngine.investigate_incident(db, complaint)
        InvestigationReportGenerator.generate_or_update_report(db, complaint)
        complaint.status = "Source Identified / Investigation Required"
        db.commit()
        db.refresh(complaint)
        
        # Log analysis complete in status history
        history2 = IncidentStatusHistory(
            complaint_id=complaint.id,
            previous_status="Reported",
            new_status="Source Identified / Investigation Required",
            changed_by_user="Autonomous Source Detection Engine",
            change_notes="Lagrangian backward trajectory, sensor anomaly correlation, and source ranking completed."
        )
        db.add(history2)
        db.commit()
    except Exception as e:
        print(f"Error during automatic source investigation: {e}")
        complaint.status = "Reported"
        db.commit()
        db.refresh(complaint)
        
    return complaint

@router.get("", response_model=List[ComplaintResponse])
def list_complaints(
    status: Optional[str] = None,
    pollution_type: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    if status:
        query = query.filter(Complaint.status == status)
    if pollution_type:
        query = query.filter(Complaint.pollution_type == pollution_type)
    if search:
        query = query.filter(
            (Complaint.title.ilike(f"%{search}%")) |
            (Complaint.description.ilike(f"%{search}%")) |
            (Complaint.complaint_number.ilike(f"%{search}%"))
        )
    return query.order_by(Complaint.created_at.desc()).limit(limit).all()

@router.get("/{id}", response_model=ComplaintDetailResponse)
def get_complaint(id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Incident not found")
    return complaint

@router.post("/{id}/investigate", response_model=ComplaintDetailResponse)
def retrigger_investigation(
    id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    SourceIdentificationEngine.investigate_incident(db, complaint)
    InvestigationReportGenerator.generate_or_update_report(db, complaint)
    
    if complaint.status in ["Reported", "Under Analysis"]:
        complaint.status = "Source Identified / Investigation Required"
        db.commit()
        db.refresh(complaint)
        
    return complaint

