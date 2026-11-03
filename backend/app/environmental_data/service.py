import datetime
import math
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.all_models import (
    AirQualityReading,
    WeatherObservation,
    HistoricalPollution,
    LandUseLocation,
    ChemicalMeasurement,
    ChemicalSourceProfile,
    Complaint
)

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth's radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def calculate_bearing_deg(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the initial bearing from point 1 to point 2 (0-360 degrees)."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)
    
    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    bearing = math.degrees(math.atan2(y, x))
    return (bearing + 360.0) % 360.0

class EnvironmentalDataService:
    @staticmethod
    def get_nearby_aqi_readings(
        db: Session,
        lat: float,
        lon: float,
        radius_km: float = 20.0,
        target_time: Optional[datetime.datetime] = None
    ) -> List[Dict[str, Any]]:
        query = db.query(AirQualityReading)
        readings = query.all()
        nearby = []
        for r in readings:
            dist = haversine_distance_km(lat, lon, r.latitude, r.longitude)
            if dist <= radius_km:
                nearby.append({
                    "id": r.id,
                    "station_id": r.station_id,
                    "station_name": r.station_name,
                    "latitude": r.latitude,
                    "longitude": r.longitude,
                    "distance_km": round(dist, 2),
                    "timestamp": r.timestamp.isoformat(),
                    "pm25": r.pm25,
                    "pm10": r.pm10,
                    "no2": r.no2,
                    "so2": r.so2,
                    "co": r.co,
                    "o3": r.o3,
                    "aqi": r.aqi,
                    "aqi_bucket": r.aqi_bucket,
                    "is_synthetic": r.is_synthetic,
                    "is_anomaly": r.is_anomaly,
                    "anomaly_score": r.anomaly_score,
                    "data_source": r.data_source
                })
        nearby.sort(key=lambda x: x["distance_km"])
        return nearby

    @staticmethod
    def get_active_weather(
        db: Session,
        lat: float,
        lon: float,
        target_time: Optional[datetime.datetime] = None
    ) -> Dict[str, Any]:
        """Find the most relevant weather observation near the location."""
        obs = db.query(WeatherObservation).all()
        if not obs:
            # Fallback default meteorological reading
            return {
                "station_id": "MET-DEFAULT",
                "latitude": lat,
                "longitude": lon,
                "wind_speed": 4.5, # m/s
                "wind_direction_deg": 65.0, # Wind from ENE (65 deg)
                "temperature": 28.5,
                "humidity": 68.0,
                "pressure": 1012.0,
                "is_synthetic": True,
                "data_source": "NOAA HYSPLIT Synthetic Fallback",
                "timestamp": datetime.datetime.utcnow().isoformat()
            }
        
        # Pick nearest
        obs_sorted = sorted(obs, key=lambda o: haversine_distance_km(lat, lon, o.latitude, o.longitude))
        best = obs_sorted[0]
        return {
            "id": best.id,
            "station_id": best.station_id,
            "latitude": best.latitude,
            "longitude": best.longitude,
            "distance_km": round(haversine_distance_km(lat, lon, best.latitude, best.longitude), 2),
            "wind_speed": best.wind_speed,
            "wind_direction_deg": best.wind_direction_deg,
            "temperature": best.temperature,
            "humidity": best.humidity,
            "pressure": best.pressure,
            "is_synthetic": best.is_synthetic,
            "data_source": best.data_source,
            "timestamp": best.timestamp.isoformat()
        }

    @staticmethod
    def get_land_use_locations(
        db: Session,
        lat: float,
        lon: float,
        radius_km: float = 25.0
    ) -> List[Dict[str, Any]]:
        locations = db.query(LandUseLocation).all()
        results = []
        for loc in locations:
            dist = haversine_distance_km(lat, lon, loc.latitude, loc.longitude)
            if dist <= radius_km:
                results.append({
                    "id": loc.id,
                    "name": loc.name,
                    "category": loc.category,
                    "latitude": loc.latitude,
                    "longitude": loc.longitude,
                    "distance_km": round(dist, 2),
                    "bearing_from_complaint": round(calculate_bearing_deg(lat, lon, loc.latitude, loc.longitude), 1),
                    "bearing_to_complaint": round(calculate_bearing_deg(loc.latitude, loc.longitude, lat, lon), 1),
                    "area_hectares": loc.area_hectares,
                    "description": loc.description,
                    "is_suspected_emission_source": loc.is_suspected_emission_source,
                    "data_source": loc.data_source
                })
        results.sort(key=lambda x: x["distance_km"])
        return results

    @staticmethod
    def get_historical_trends(
        db: Session,
        station_id: Optional[str] = None,
        limit: int = 90
    ) -> List[Dict[str, Any]]:
        query = db.query(HistoricalPollution)
        if station_id:
            query = query.filter(HistoricalPollution.station_id == station_id)
        records = query.order_by(HistoricalPollution.date.asc()).limit(limit).all()
        return [
            {
                "date": r.date.strftime("%Y-%m-%d"),
                "pm25": r.pm25,
                "pm10": r.pm10,
                "no2": r.no2,
                "so2": r.so2,
                "aqi": r.aqi,
                "seasonal_pattern": r.seasonal_pattern,
                "is_synthetic": r.is_synthetic,
                "data_source": r.data_source
            }
            for r in records
        ]

