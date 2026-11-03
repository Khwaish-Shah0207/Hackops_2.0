import numpy as np
from sklearn.ensemble import IsolationForest
from typing import List, Dict, Any, Tuple
from app.config import settings

class PollutionAnomalyDetector:
    _model: IsolationForest | None = None
    _is_fitted: bool = False

    @classmethod
    def fit_baseline_model(cls, baseline_data: np.ndarray):
        """Fit Isolation Forest on historical background air quality readings."""
        if len(baseline_data) < 10:
            # Synthetic default baseline if dataset small
            baseline_data = np.array([
                [35.0, 70.0, 25.0, 15.0],
                [42.0, 85.0, 28.0, 18.0],
                [50.0, 95.0, 32.0, 20.0],
                [30.0, 60.0, 22.0, 12.0],
                [55.0, 110.0, 38.0, 22.0],
                [48.0, 90.0, 30.0, 17.0],
                [62.0, 120.0, 40.0, 24.0],
                [38.0, 75.0, 26.0, 14.0],
                [45.0, 88.0, 29.0, 19.0],
                [52.0, 102.0, 34.0, 21.0],
            ])
        cls._model = IsolationForest(
            contamination=settings.ISOLATION_FOREST_CONTAMINATION,
            random_state=42,
            n_estimators=100
        )
        cls._model.fit(baseline_data)
        cls._is_fitted = True

    @classmethod
    def evaluate_reading(
        cls,
        pm25: float,
        pm10: float,
        no2: float = 25.0,
        so2: float = 15.0
    ) -> Tuple[bool, float]:
        """
        Returns (is_anomaly, anomaly_score_0_to_100).
        IsolationForest decision_function returns negative values for anomalies.
        """
        if not cls._is_fitted or cls._model is None:
            # Initialize with default baseline
            cls.fit_baseline_model(np.empty((0, 4)))
            
        features = np.array([[pm25, pm10, no2, so2]])
        # raw decision score: lower means more anomalous
        raw_score = cls._model.decision_function(features)[0]
        prediction = cls._model.predict(features)[0] # -1 is anomaly, 1 is inlier
        
        is_anomaly = bool(prediction == -1 or pm25 > 120.0 or pm10 > 220.0)
        
        # Normalize into 0-100 anomaly intensity scale
        # Typical raw_score is between -0.3 (extreme anomaly) and +0.3 (very normal)
        normalized_intensity = max(0.0, min(100.0, (0.25 - raw_score) * 160.0))
        if pm25 > 200.0:
            normalized_intensity = max(normalized_intensity, 92.0)
        elif pm25 > 140.0:
            normalized_intensity = max(normalized_intensity, 80.0)
            
        return is_anomaly, round(normalized_intensity, 1)

    @classmethod
    def evaluate_corridor_anomalies(
        cls,
        complaint_lat: float,
        complaint_lon: float,
        source_lat: float,
        source_lon: float,
        nearby_readings: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Check if stations situated along the corridor between source and complaint show elevated particulate matter.
        """
        from app.environmental_data.service import haversine_distance_km
        
        source_dist = haversine_distance_km(complaint_lat, complaint_lon, source_lat, source_lon)
        corridor_stations = []
        corridor_pm_scores = []
        
        for r in nearby_readings:
            # Check if station lies approximately along segment (distance sum test)
            d1 = haversine_distance_km(complaint_lat, complaint_lon, r["latitude"], r["longitude"])
            d2 = haversine_distance_km(source_lat, source_lon, r["latitude"], r["longitude"])
            
            # If d1 + d2 is close to source_dist (within 35% margin)
            if source_dist > 0.1 and (d1 + d2) <= (source_dist * 1.45):
                pm25 = r.get("pm25") or 40.0
                pm10 = r.get("pm10") or 80.0
                is_anom, score = cls.evaluate_reading(pm25, pm10, r.get("no2") or 25.0, r.get("so2") or 15.0)
                corridor_stations.append({
                    "station_name": r.get("station_name"),
                    "distance_from_complaint_km": round(d1, 2),
                    "pm25": pm25,
                    "pm10": pm10,
                    "is_anomaly": is_anom,
                    "anomaly_score": score
                })
                corridor_pm_scores.append(score)
                
        avg_path_anomaly = float(np.mean(corridor_pm_scores)) if corridor_pm_scores else 50.0
        return {
            "corridor_stations_count": len(corridor_stations),
            "corridor_stations": corridor_stations,
            "path_anomaly_score": round(avg_path_anomaly, 1),
            "elevated_plume_detected": any(s["is_anomaly"] for s in corridor_stations)
        }

