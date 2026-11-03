import math
import numpy as np
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.all_models import Complaint
from app.environmental_data.service import haversine_distance_km

def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    dot = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(dot / (norm1 * norm2))

class ComplaintSemanticAnalyzer:
    # Characteristic keywords representing waste burning / smoke pollution semantics
    VOCABULARY = [
        "smoke", "burning", "waste", "garbage", "trash", "dumping", "ground",
        "plastic", "fire", "smell", "fumes", "landfill", "toxic", "black",
        "stench", "creek", "slum", "open", "debris", "rubber", "factory",
        "chimney", "ash", "choking", "coughing", "night", "morning", "crematorium"
    ]

    @classmethod
    def get_text_embedding(cls, text: str) -> np.ndarray:
        """
        Generate semantic embedding vector.
        Uses multilingual keyword-weighted character/subword n-gram vectorization.
        """
        text_lower = text.lower()
        vec = np.zeros(len(cls.VOCABULARY) + 10, dtype=np.float32)
        
        # Word matches
        for idx, word in enumerate(cls.VOCABULARY):
            if word in text_lower:
                vec[idx] = 1.0 + (0.5 * text_lower.count(word))
                
        # Domain category weights
        if any(w in text_lower for w in ["burn", "fire", "waste", "garbage", "kachra", "jala"]):
            vec[-1] = 2.0
        if any(w in text_lower for w in ["smoke", "dhuan", "fumes", "smell"]):
            vec[-2] = 1.5
        if any(w in text_lower for w in ["dump", "landfill", "ground"]):
            vec[-3] = 1.8
            
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec

    @classmethod
    def find_similar_complaints(
        cls,
        db: Session,
        target_description: str,
        target_lat: float,
        target_lon: float,
        source_lat: float,
        source_lon: float,
        radius_km: float = 6.0,
        exclude_id: int | None = None
    ) -> Dict[str, Any]:
        """
        Find recurring complaints clustered near the candidate source location,
        especially those with semantic alignment to waste burning and smoke.
        """
        target_vec = cls.get_text_embedding(target_description)
        all_complaints = db.query(Complaint).all()
        
        matching_complaints = []
        similarity_scores = []
        
        for c in all_complaints:
            if exclude_id and c.id == exclude_id:
                continue
            
            # Distance from candidate source
            dist_to_source = haversine_distance_km(source_lat, source_lon, c.latitude, c.longitude)
            
            if dist_to_source <= radius_km:
                comp_vec = cls.get_text_embedding(c.title + " " + c.description)
                sem_sim = cosine_similarity(target_vec, comp_vec)
                
                # Check category relevance (waste burning / smoke)
                is_burning_related = (
                    c.pollution_type in ["waste_burning", "smoke", "industrial_emissions"] or
                    any(w in c.description.lower() for w in ["burn", "smoke", "garbage", "waste", "fire"])
                )
                
                # Proximity weight: closer to source gets higher relevance
                prox_factor = max(0.1, 1.0 - (dist_to_source / radius_km))
                composite_relevance = (sem_sim * 0.6 + (1.0 if is_burning_related else 0.2) * 0.4) * prox_factor
                
                matching_complaints.append({
                    "id": c.id,
                    "complaint_number": c.complaint_number,
                    "title": c.title,
                    "description": c.description,
                    "pollution_type": c.pollution_type,
                    "distance_from_source_km": round(dist_to_source, 2),
                    "semantic_similarity": round(sem_sim, 3),
                    "is_burning_related": is_burning_related,
                    "status": c.status,
                    "observed_at": c.observed_at.isoformat()
                })
                similarity_scores.append(composite_relevance)
                
        # Sort by proximity & semantic match
        matching_complaints.sort(key=lambda x: (x["semantic_similarity"], -x["distance_from_source_km"]), reverse=True)
        
        # Calculate cluster density score (0 to 100)
        # More complaints mentioning burning near source -> higher score
        count = len(matching_complaints)
        burning_count = sum(1 for c in matching_complaints if c["is_burning_related"])
        
        if count == 0:
            density_score = 10.0
        else:
            density_score = min(100.0, (burning_count * 28.0) + (count * 10.0))
            
        return {
            "cluster_count": count,
            "burning_related_count": burning_count,
            "density_score": round(density_score, 1),
            "top_matching_complaints": matching_complaints[:5]
        }

