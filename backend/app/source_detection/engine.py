import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.all_models import (
    Complaint,
    LandUseLocation,
    SourceCandidate,
    AirQualityReading,
    WeatherObservation
)
from app.environmental_data.service import (
    EnvironmentalDataService,
    haversine_distance_km,
    calculate_bearing_deg
)
from app.weather.trajectory import TrajectoryAnalysisEngine
from app.pollution.anomaly import PollutionAnomalyDetector
from app.complaint_analysis.similarity import ComplaintSemanticAnalyzer
from app.land_use.service import LandUseSpatialEngine
from app.chemical_analysis.service import ChemicalFingerprintEngine

class SourceIdentificationEngine:
    # Configurable evidence component weights (Total = 1.0)
    WEIGHTS = {
        "wind_trajectory": 0.30,   # Upwind alignment is crucial for airborne plume transport
        "complaint_cluster": 0.25, # Recurring historical reports in the source area
        "pollution_anomaly": 0.20, # Elevated sensor anomalies along the path
        "land_use_risk": 0.15,     # Landfill / industrial zone emission propensity
        "chemical_fingerprint": 0.10 # Profile match (illustrative/simulated)
    }

    @classmethod
    def investigate_incident(
        cls,
        db: Session,
        complaint: Complaint
    ) -> List[SourceCandidate]:
        """
        Runs explainable source identification pipeline for a given complaint.
        Shortlists, scores, and ranks potential source candidates.
        """
        lat, lon = complaint.latitude, complaint.longitude
        
        # 1. Fetch active weather & wind vector
        weather = EnvironmentalDataService.get_active_weather(db, lat, lon)
        wind_dir = weather["wind_direction_deg"]
        wind_speed = weather["wind_speed"]
        
        # 2. Fetch nearby monitoring stations
        nearby_readings = EnvironmentalDataService.get_nearby_aqi_readings(db, lat, lon, radius_km=25.0)
        
        # 3. Fetch candidate land-use locations within 25 km
        candidate_locations = db.query(LandUseLocation).all()
        
        # If no land use locations exist, return empty
        if not candidate_locations:
            return []
            
        ranked_candidates = []
        
        for cand in candidate_locations:
            dist_km = haversine_distance_km(lat, lon, cand.latitude, cand.longitude)
            if dist_km > 25.0:
                continue # Outside plausible local transport dispersion radius
                
            # A. Wind trajectory compatibility
            wind_eval = TrajectoryAnalysisEngine.evaluate_source_alignment(
                lat, lon, cand.latitude, cand.longitude, wind_dir, wind_speed
            )
            wind_score = wind_eval["wind_compatibility_score"]
            transport_time = wind_eval["estimated_transport_time_minutes"]
            
            # B. Pollution anomaly along transport corridor
            corridor_eval = PollutionAnomalyDetector.evaluate_corridor_anomalies(
                lat, lon, cand.latitude, cand.longitude, nearby_readings
            )
            anomaly_score = corridor_eval["path_anomaly_score"]
            
            # C. Previous complaints clustered near candidate source
            complaints_eval = ComplaintSemanticAnalyzer.find_similar_complaints(
                db,
                target_description=complaint.description,
                target_lat=lat,
                target_lon=lon,
                source_lat=cand.latitude,
                source_lon=cand.longitude,
                radius_km=4.5,
                exclude_id=complaint.id
            )
            complaint_density_score = complaints_eval["density_score"]
            
            # D. Land-use category risk
            land_use_score = LandUseSpatialEngine.evaluate_location_risk(
                cand.category, dist_km, cand.is_suspected_emission_source
            )
            
            # E. Chemical fingerprint matching
            chem_eval = ChemicalFingerprintEngine.evaluate_chemical_fingerprint(
                db, lat, lon, cand.category
            )
            chemical_score = chem_eval["match_score"]
            
            # Weighted overall evidence score
            overall_evidence = (
                cls.WEIGHTS["wind_trajectory"] * wind_score +
                cls.WEIGHTS["complaint_cluster"] * complaint_density_score +
                cls.WEIGHTS["pollution_anomaly"] * anomaly_score +
                cls.WEIGHTS["land_use_risk"] * land_use_score +
                cls.WEIGHTS["chemical_fingerprint"] * chemical_score
            )
            overall_evidence = round(max(0.0, min(100.0, overall_evidence)), 1)
            
            # Determine evidence quality / confidence label
            if overall_evidence >= 72.0 and wind_score >= 60.0:
                confidence = "High"
            elif overall_evidence >= 50.0 and wind_score >= 35.0:
                confidence = "Moderate"
            elif overall_evidence >= 30.0:
                confidence = "Low"
            else:
                confidence = "Insufficient evidence"
                
            # Generate human-readable explanation & shortlist reasoning
            explanation = (
                f"Candidate '{cand.name}' is situated {round(dist_km, 2)} km away ({cand.category}). "
                f"Wind is currently blowing from {wind_dir}° at {wind_speed} m/s, yielding {wind_eval['compatibility_label'].lower()} "
                f"with an estimated airborne travel duration of {transport_time} minutes. "
                f"{complaints_eval['cluster_count']} similar complaints were located near this site "
                f"({complaints_eval['burning_related_count']} specifically citing open burning/smoke). "
                f"Sensors along the trajectory report a path anomaly score of {anomaly_score}/100. "
                f"Chemical speciation comparison matches {chem_eval['speciate_category']} at {chemical_score}% similarity."
            )
            
            shortlist_reason = (
                f"{wind_eval['compatibility_label']}; {complaints_eval['cluster_count']} supporting citizen reports in sector; "
                f"Land-use: {cand.category.replace('_', ' ').title()}."
            )
            
            evidence_breakdown = {
                "wind_evaluation": wind_eval,
                "corridor_evaluation": corridor_eval,
                "complaints_evaluation": complaints_eval,
                "land_use_score": land_use_score,
                "chemical_evaluation": chem_eval,
                "weights_applied": cls.WEIGHTS,
                "data_integrity_notice": "Evidence scores represent a multi-criteria heuristic ranking for decision support and do not constitute legal guilt or regulatory proof."
            }
            
            candidate_obj = SourceCandidate(
                complaint_id=complaint.id,
                name=cand.name,
                category=cand.category,
                latitude=cand.latitude,
                longitude=cand.longitude,
                distance_km=round(dist_km, 2),
                wind_compatibility_score=round(wind_score, 1),
                transport_time_minutes=transport_time,
                pollution_anomaly_score=round(anomaly_score, 1),
                complaint_density_score=round(complaint_density_score, 1),
                land_use_weight=round(land_use_score, 1),
                chemical_match_score=round(chemical_score, 1),
                overall_evidence_score=overall_evidence,
                confidence_level=confidence,
                explanation=explanation,
                shortlist_reason=shortlist_reason,
                evidence_breakdown=evidence_breakdown
            )
            
            ranked_candidates.append(candidate_obj)
            
        # Sort candidates descending by overall evidence score
        ranked_candidates.sort(key=lambda c: c.overall_evidence_score, reverse=True)
        
        # Save to database
        # Clear existing candidates for this complaint first
        db.query(SourceCandidate).filter(SourceCandidate.complaint_id == complaint.id).delete()
        for c in ranked_candidates:
            db.add(c)
        db.commit()
        
        return ranked_candidates

