import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import (
    Complaint,
    GovernmentAssignment,
    CorrectiveAction,
    IncidentStatusHistory,
    User,
    AirQualityReading
)
from app.schemas.schemas import (
    AssignmentCreate,
    GovernmentAssignmentResponse,
    CorrectiveActionCreate,
    CorrectiveActionResponse,
    StatusUpdateCreate,
    IncidentStatusHistoryResponse,
    ComplaintDetailResponse
)
from app.auth.deps import get_current_government_user, get_current_user_optional

router = APIRouter(prefix="/government", tags=["Government Stakeholder Dashboard"])

@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(Complaint).count()
    open_incidents = db.query(Complaint).filter(Complaint.status.in_(["Reported", "Under Analysis"])).count()
    investigation_required = db.query(Complaint).filter(Complaint.status.in_(["Source Identified / Investigation Required", "Assigned"])).count()
    action_taken = db.query(Complaint).filter(Complaint.status == "Action Taken").count()
    resolved = db.query(Complaint).filter(Complaint.status.in_(["Resolved", "Closed"])).count()
    
    # Recent incidents
    recent = db.query(Complaint).order_by(Complaint.created_at.desc()).limit(8).all()
    
    # Pollution hotspots overview
    readings = db.query(AirQualityReading).all()
    hotspots = [
        {
            "station_name": r.station_name,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "aqi": r.aqi,
            "aqi_bucket": r.aqi_bucket,
            "pm25": r.pm25,
            "is_anomaly": r.is_anomaly
        }
        for r in readings if r.aqi and r.aqi > 150
    ]
    
    return {
        "total_incidents": total,
        "open_incidents": open_incidents,
        "investigation_required": investigation_required,
        "action_taken": action_taken,
        "resolved_incidents": resolved,
        "recent_incidents": [
            {
                "id": c.id,
                "complaint_number": c.complaint_number,
                "title": c.title,
                "pollution_type": c.pollution_type,
                "status": c.status,
                "latitude": c.latitude,
                "longitude": c.longitude,
                "observed_at": c.observed_at.isoformat(),
                "created_at": c.created_at.isoformat()
            }
            for c in recent
        ],
        "pollution_hotspots": hotspots
    }

@router.post("/complaints/{id}/assign", response_model=ComplaintDetailResponse)
def assign_incident(
    id: int,
    assignment_in: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    existing_assign = db.query(GovernmentAssignment).filter(GovernmentAssignment.complaint_id == id).first()
    if existing_assign:
        existing_assign.assigned_to_name = assignment_in.assigned_to_name
        existing_assign.department = assignment_in.department
        existing_assign.priority = assignment_in.priority
        existing_assign.inspection_scheduled_date = assignment_in.inspection_scheduled_date
        existing_assign.notes = assignment_in.notes
    else:
        new_assign = GovernmentAssignment(
            complaint_id=id,
            assigned_to_name=assignment_in.assigned_to_name,
            department=assignment_in.department,
            priority=assignment_in.priority,
            inspection_scheduled_date=assignment_in.inspection_scheduled_date,
            notes=assignment_in.notes
        )
        db.add(new_assign)
        
    old_status = complaint.status
    complaint.status = "Assigned"
    
    # Audit log
    history = IncidentStatusHistory(
        complaint_id=id,
        previous_status=old_status,
        new_status="Assigned",
        changed_by_user=current_user.full_name if current_user else "Authorized Stakeholder",
        change_notes=f"Assigned to {assignment_in.assigned_to_name} ({assignment_in.department}) with {assignment_in.priority} priority."
    )
    db.add(history)
    db.commit()
    db.refresh(complaint)
    return complaint

@router.post("/complaints/{id}/action", response_model=ComplaintDetailResponse)
def record_corrective_action(
    id: int,
    action_in: CorrectiveActionCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    action_record = CorrectiveAction(
        complaint_id=id,
        officer_name=action_in.officer_name,
        action_type=action_in.action_type,
        description=action_in.description,
        fine_amount=action_in.fine_amount or 0.0,
        notices_issued=action_in.notices_issued,
        documents_url=action_in.documents_url,
        action_timestamp=datetime.datetime.utcnow()
    )
    db.add(action_record)
    
    old_status = complaint.status
    complaint.status = "Action Taken"
    
    history = IncidentStatusHistory(
        complaint_id=id,
        previous_status=old_status,
        new_status="Action Taken",
        changed_by_user=current_user.full_name if current_user else action_in.officer_name,
        change_notes=f"Corrective Action [{action_in.action_type}]: {action_in.description}"
    )
    db.add(history)
    db.commit()
    db.refresh(complaint)
    return complaint

@router.post("/complaints/{id}/status", response_model=ComplaintDetailResponse)
def update_status(
    id: int,
    status_in: StatusUpdateCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    valid_statuses = [
        "Reported",
        "Under Analysis",
        "Source Identified / Investigation Required",
        "Assigned",
        "Action Taken",
        "Resolved",
        "Closed"
    ]
    if status_in.new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        
    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    old_status = complaint.status
    complaint.status = status_in.new_status
    
    history = IncidentStatusHistory(
        complaint_id=id,
        previous_status=old_status,
        new_status=status_in.new_status,
        changed_by_user=current_user.full_name if current_user else "Authorized Stakeholder",
        change_notes=status_in.notes or f"Status transitioned from {old_status} to {status_in.new_status}."
    )
    db.add(history)
    db.commit()
    db.refresh(complaint)
    return complaint

