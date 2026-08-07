from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db_seed
from app.api.router import api_router
from app.ml_engine import MLEngine
from app.middleware import SecurityHeadersMiddleware, PrometheusMetricsMiddleware, metrics_endpoint
from app.config import API_V1_STR, API_V2_STR

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[INIT] Initializing CyberShield Enterprise Platform v2.5...")
    init_db_seed()
    MLEngine.load_model()
    print("[OK] Module 1 Complete: Async Architecture, Database ORM, Cache & Monitoring Ready!")
    yield

app = FastAPI(
    title="CyberShield Enterprise - AI Threat Intelligence & SOC Governance Platform API",
    description="Enterprise REST API v2 for Real-Time Phishing Threat Detection, Explainable AI (XAI), Threat Intelligence Aggregation, and Security Operations Center (SOC) Analytics.",
    version="2.5.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Custom Middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(PrometheusMetricsMiddleware)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "system": "CyberShield Enterprise Platform API",
        "status": "Online",
        "version": "2.5.0",
        "docs": "/docs",
        "metrics": "/metrics",
        "admin_seed": "admin@cybershield.com"
    }

@app.get("/metrics")
def get_metrics():
    return metrics_endpoint()

# Include Routers for both /api (v1) and /api/v2
app.include_router(api_router)
app.include_router(api_router, prefix=API_V2_STR)
