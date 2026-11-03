import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "Environmental Intelligence & Compliance Management System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "env-compliance-super-secret-jwt-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./enviro_compliance.db")
    
    # Model Configurations
    ISOLATION_FOREST_CONTAMINATION: float = 0.1
    HYSPLIT_EXECUTABLE: str = os.getenv("HYSPLIT_EXECUTABLE", "")
    
    # Demonstration Scenario Location: Mumbai Deonar / Chembur
    DEMO_CENTER_LAT: float = 19.043
    DEMO_CENTER_LON: float = 72.909

settings = Settings()

