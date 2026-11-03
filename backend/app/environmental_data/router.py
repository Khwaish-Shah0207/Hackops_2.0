from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import (
    AirQualityReading,
    WeatherObservation,
    HistoricalPollution,
    LandUseLocation,
    ChemicalSourceProfile
)
from app.schemas.schemas import (
    AirQualityReadingResponse,
    WeatherObservationResponse
)
from app.environmental_data.service import EnvironmentalDataService
from app.chemical_analysis.service import EPASpeciateReferenceLibrary

router = APIRouter(prefix="/environmental", tags=["Environmental Datasets"])

@router.get("/air-quality", response_model=List[AirQualityReadingResponse])
def get_air_quality(db: Session = Depends(get_db)):
    return db.query(AirQualityReading).all()

@router.get("/weather", response_model=List[WeatherObservationResponse])
def get_weather(db: Session = Depends(get_db)):
    return db.query(WeatherObservation).all()

@router.get("/historical")
def get_historical(station_id: Optional[str] = None, db: Session = Depends(get_db)):
    return EnvironmentalDataService.get_historical_trends(db, station_id=station_id)

@router.get("/land-use")
def get_land_use(db: Session = Depends(get_db)):
    return EnvironmentalDataService.get_land_use_locations(db, lat=19.043, lon=72.909, radius_km=50.0)

@router.get("/speciate-profiles")
def get_speciate_profiles():
    return EPASpeciateReferenceLibrary.SPECIATE_REFERENCE_PROFILES

