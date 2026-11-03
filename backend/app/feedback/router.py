from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import Complaint, CitizenFeedback, IncidentStatusHistory, User
from app.schemas.schemas import CitizenFeedbackCreate, CitizenFeedbackResponse, ComplaintDetailResponse
from app.auth.deps import get_current_user_optional

router = APIRouter(prefix="/feedback", tags=["Citizen Feedback"])

@router.post("/complaints/{id}", response_model=ComplaintDetailResponse)
def submit_feedback(
    id: int,
    feedback_in: CitizenFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional)
):
    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    existing_fb = db.query(CitizenFeedback).filter(CitizenFeedback.complaint_id == id).first()
    if existing_fb:
        existing_fb.is_improved = feedback_in.is_improved
        existing_fb.satisfaction_rating = feedback_in.satisfaction_rating
        existing_fb.comments = feedback_in.comments
        existing_fb.reopen_requested = feedback_in.reopen_requested or False
    else:
        new_fb = CitizenFeedback(
            complaint_id=id,
            citizen_id=current_user.id if current_user else complaint.citizen_id,
            is_improved=feedback_in.is_improved,
            satisfaction_rating=feedback_in.satisfaction_rating,
            comments=feedback_in.comments,
            reopen_requested=feedback_in.reopen_requested or False
        )
        db.add(new_fb)
        
    # If citizen reports issue has NOT improved and requests reopening
    if not feedback_in.is_improved and feedback_in.reopen_requested:
        old_status = complaint.status
        complaint.status = "Source Identified / Investigation Required"
        history = IncidentStatusHistory(
            complaint_id=id,
            previous_status=old_status,
            new_status="Source Identified / Investigation Required",
            changed_by_user=current_user.full_name if current_user else "Citizen",
            change_notes=f"Reopened by citizen feedback: Issue reported as unresolved (Rating {feedback_in.satisfaction_rating}/5). Comments: {feedback_in.comments or 'None'}"
        )
        db.add(history)
    elif feedback_in.is_improved:
        old_status = complaint.status
        complaint.status = "Resolved"
        history = IncidentStatusHistory(
            complaint_id=id,
            previous_status=old_status,
            new_status="Resolved",
            changed_by_user=current_user.full_name if current_user else "Citizen",
            change_notes=f"Citizen confirmed resolution improvement (Rating {feedback_in.satisfaction_rating}/5)."
        )
        db.add(history)
        
    db.commit()
    db.refresh(complaint)
    return complaint

