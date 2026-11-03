from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.all_models import LandUseLocation
from app.environmental_data.service import haversine_distance_km

class LandUseSpatialEngine:
    # Intrinsic emission emission risk weighting based on land-use classification
    CATEGORY_RISK_WEIGHTS = {
        "landfill": 95.0, # High probability of open waste smoldering
        "industrial_area": 85.0, # Process emissions, boilers, solvent burning
        "construction_site": 60.0, # Fugitive dust, diesel machinery
        "road": 50.0, # Vehicular exhaust, resuspension
        "residential": 25.0, # Domestic cooking, localized heating
        "water_body": 5.0 # Low baseline
    }

    @classmethod
    def evaluate_location_risk(
        cls,
        category: str,
        distance_km: float,
        is_suspected: bool = False
    ) -> float:
        """
        Calculate land-use risk score considering both category baseline and distance decay.
        """
        base_weight = cls.CATEGORY_RISK_WEIGHTS.get(category.lower(), 40.0)
        if is_suspected:
            base_weight = min(100.0, base_weight + 10.0)
            
        # Distance decay: exponential falloff beyond 5 km
        # Source close by has much higher emission impact than 20 km away
        decay = 1.0 / (1.0 + (distance_km / 4.0)**1.5)
        score = base_weight * decay
        return round(max(5.0, min(100.0, score)), 1)

