from fastapi import APIRouter
from app.api import auth, scan, stats, history, report, threat_intel, admin, protection

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(scan.router)
api_router.include_router(stats.router)
api_router.include_router(history.router)
api_router.include_router(report.router)
api_router.include_router(threat_intel.router)
api_router.include_router(admin.router)
api_router.include_router(protection.router)
