from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ScanLog
from app.reports import ReportGenerator
from app.ml_engine import MLEngine

router = APIRouter(prefix="/report", tags=["Security Reports Generator"])

@router.get("/pdf/{scan_id}")
def generate_pdf_security_report(scan_id: int, db: Session = Depends(get_db)):
    scan_record = db.query(ScanLog).filter(ScanLog.id == scan_id).first()
    if not scan_record:
        raise HTTPException(status_code=404, detail="Scan log record not found")

    scan_data = {
        "url": scan_record.url,
        "domain": scan_record.domain,
        "status": scan_record.status,
        "risk_score": scan_record.risk_score,
        "confidence_score": scan_record.confidence_score,
        "reasons": scan_record.reasons,
        "extracted_features": scan_record.extracted_features,
        "threat_intel": scan_record.threat_intel_results,
        "xai_attribution": scan_record.xai_attribution
    }

    pdf_bytes = ReportGenerator.generate_pdf_report(scan_data)
    response = Response(content=pdf_bytes, media_type="application/pdf")
    response.headers["Content-Disposition"] = f"attachment; filename=CyberShield_Security_Report_{scan_id}.pdf"
    return response

@router.post("/pdf/direct")
def generate_direct_pdf_report(payload: dict):
    raw_url = payload.get("url")
    if not raw_url:
        raise HTTPException(status_code=400, detail="URL field required")

    scan_data = MLEngine.predict_url(raw_url)
    pdf_bytes = ReportGenerator.generate_pdf_report(scan_data)
    response = Response(content=pdf_bytes, media_type="application/pdf")
    response.headers["Content-Disposition"] = "attachment; filename=CyberShield_Security_Audit_Report.pdf"
    return response

@router.get("/csv")
def export_csv_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(ScanLog).order_by(ScanLog.scan_date.desc()).all()
    csv_str = ReportGenerator.generate_csv_report(logs)
    response = Response(content=csv_str, media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=cybershield_audit_history.csv"
    return response
