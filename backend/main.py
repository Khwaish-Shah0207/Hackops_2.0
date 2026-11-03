import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.auth.router import router as auth_router
from app.complaints.router import router as complaints_router
from app.government.router import router as government_router
from app.feedback.router import router as feedback_router
from app.environmental_data.router import router as environmental_router

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Air Pollution Incident Detection, Source Identification, and Compliance Tracking API"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Modular Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(complaints_router, prefix=settings.API_V1_STR)
app.include_router(government_router, prefix=settings.API_V1_STR)
app.include_router(feedback_router, prefix=settings.API_V1_STR)
app.include_router(environmental_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "demonstration_scenario": "Active (Region A: Chembur vs Region B: Deonar Dumping Ground)",
        "models_integrated": [
            "CPCB Real-Time AQI & Isolation Forest Anomaly Detection",
            "Lagrangian Backward Plume Trajectory (NOAA HYSPLIT Interface & Fallback)",
            "Multilingual Sentence-Transformer Semantic Complaint Similarity",
            "ISRO Bhuvan Geospatial Land-Use Analysis",
            "EPA SPECIATE v5.4 & EPA CMB 8.2 / PMF 5.0 Receptor Speciation Interface"
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

