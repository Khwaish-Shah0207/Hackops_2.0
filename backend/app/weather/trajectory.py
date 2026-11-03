import math
import os
import shutil
from typing import List, Dict, Any, Tuple

def normalize_angle_diff(angle1: float, angle2: float) -> float:
    """Calculate the smallest absolute difference between two angles in degrees (0 to 180)."""
    diff = abs(angle1 - angle2) % 360.0
    return 360.0 - diff if diff > 180.0 else diff

class TrajectoryAnalysisEngine:
    @staticmethod
    def is_hysplit_available() -> bool:
        """Check if official NOAA HYSPLIT executable is present on host system."""
        custom_path = os.getenv("HYSPLIT_EXECUTABLE")
        if custom_path and os.path.isfile(custom_path):
            return True
        return shutil.which("hyts_std") is not None or shutil.which("hyts_std.exe") is not None

    @staticmethod
    def calculate_upwind_vector(
        origin_lat: float,
        origin_lon: float,
        wind_direction_deg: float, # Where wind comes FROM
        wind_speed_ms: float, # m/s
        hours_back: float = 3.0
    ) -> List[Dict[str, Any]]:
        """
        Calculate backward trajectory points tracing backwards where air came from.
        Meteorological wind_direction_deg is where the wind comes FROM.
        Tracing backwards along the upwind vector means heading along wind_direction_deg!
        """
        # km/h = m/s * 3.6
        speed_kmh = wind_speed_ms * 3.6
        total_distance_km = speed_kmh * hours_back
        
        # Earth curvature approx: 1 deg lat ~ 111 km, 1 deg lon ~ 111 km * cos(lat)
        rad_lat = math.radians(origin_lat)
        deg_lat_km = 111.0
        deg_lon_km = max(111.0 * math.cos(rad_lat), 1.0)
        
        points = []
        step_count = 6
        for step in range(step_count + 1):
            fraction = step / step_count
            time_back_hrs = fraction * hours_back
            dist_km = speed_kmh * time_back_hrs
            
            # Heading backwards along wind_direction_deg (upwind)
            # Add slight atmospheric turbulence / Coriolis curvature (+3 degrees per hour)
            curved_bearing = (wind_direction_deg + (time_back_hrs * 3.5)) % 360.0
            bearing_rad = math.radians(curved_bearing)
            
            d_lat = (dist_km * math.cos(bearing_rad)) / deg_lat_km
            d_lon = (dist_km * math.sin(bearing_rad)) / deg_lon_km
            
            p_lat = origin_lat + d_lat
            p_lon = origin_lon + d_lon
            
            points.append({
                "step": step,
                "hours_back": round(time_back_hrs, 2),
                "latitude": round(p_lat, 5),
                "longitude": round(p_lon, 5),
                "distance_km": round(dist_km, 2),
                "bearing_deg": round(curved_bearing, 1)
            })
            
        return points

    @classmethod
    def evaluate_source_alignment(
        cls,
        complaint_lat: float,
        complaint_lon: float,
        source_lat: float,
        source_lon: float,
        wind_direction_deg: float,
        wind_speed_ms: float
    ) -> Dict[str, Any]:
        """
        Evaluate if source is situated upwind from the complaint location.
        - Bearing from complaint TO source should align with meteorological wind_direction_deg.
        """
        from app.environmental_data.service import calculate_bearing_deg, haversine_distance_km
        
        dist_km = haversine_distance_km(complaint_lat, complaint_lon, source_lat, source_lon)
        bearing_complaint_to_source = calculate_bearing_deg(complaint_lat, complaint_lon, source_lat, source_lon)
        
        # Angular deviation between wind origin (FROM) and direction to source
        angle_diff = normalize_angle_diff(wind_direction_deg, bearing_complaint_to_source)
        
        # Wind compatibility score (100 if angle_diff == 0, 0 if angle_diff >= 90)
        if angle_diff <= 25.0:
            wind_score = 100.0 - (angle_diff * 1.2)
            compatibility_label = "Directly Upwind (High Trajectory Compatibility)"
        elif angle_diff <= 45.0:
            wind_score = 70.0 - ((angle_diff - 25.0) * 1.5)
            compatibility_label = "Moderately Upwind (Possible Plume Dispersion Sector)"
        elif angle_diff <= 75.0:
            wind_score = 40.0 - ((angle_diff - 45.0) * 1.0)
            compatibility_label = "Marginally Upwind (Subject to Plume Meander)"
        else:
            wind_score = 0.0
            compatibility_label = "Crosswind / Downwind (Unlikely Origin)"
            
        wind_score = max(0.0, min(100.0, wind_score))
        
        # Estimated transport time
        speed_kmh = max(wind_speed_ms * 3.6, 1.0)
        transport_time_mins = round((dist_km / speed_kmh) * 60.0, 1)
        
        return {
            "distance_km": round(dist_km, 2),
            "bearing_from_complaint": round(bearing_complaint_to_source, 1),
            "wind_direction_deg": round(wind_direction_deg, 1),
            "angular_deviation_deg": round(angle_diff, 1),
            "wind_compatibility_score": round(wind_score, 1),
            "compatibility_label": compatibility_label,
            "estimated_transport_time_minutes": transport_time_mins,
            "wind_speed_ms": wind_speed_ms
        }

