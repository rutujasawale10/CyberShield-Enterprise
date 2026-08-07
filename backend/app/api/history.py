import csv
import io
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ScanLog
from app.schemas import ScanResultResponse

router = APIRouter(prefix="/history", tags=["History & Audit Logs"])

@router.get("", response_model=list[ScanResultResponse])
def get_scan_history(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    status_filter: str = Query(None, description="Filter by status: Safe, Phishing, Suspicious"),
    db: Session = Depends(get_db)
):
    """
    Retrieves historical scan audit records with optional status filtering.
    """
    query = db.query(ScanLog)
    if status_filter:
        query = query.filter(ScanLog.status == status_filter)

    logs = query.order_by(ScanLog.scan_date.desc()).offset(offset).limit(limit).all()

    results = []
    for item in logs:
        threat_lvl = "HIGH" if item.status == "Phishing" else "MEDIUM" if item.status == "Suspicious" else "LOW"
        conf = item.confidence_score if item.confidence_score is not None else 95.0
        results.append(ScanResultResponse(
            id=item.id,
            url=item.url,
            domain=item.domain,
            status=item.status,
            risk_score=item.risk_score,
            confidence=conf,
            confidence_score=conf,
            threat_level=threat_lvl,
            reasons=item.reasons,
            extracted_features=item.extracted_features,
            scan_date=item.scan_date
        ))
    return results

@router.get("/export/csv")
def export_scan_history_csv(db: Session = Depends(get_db)):
    """
    Exports scan history audit records as downloadable CSV file.
    """
    logs = db.query(ScanLog).order_by(ScanLog.scan_date.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "URL", "Domain", "Status", "Risk Score (%)", "Scan Date", "Reasons"])

    for log in logs:
        reasons_str = "; ".join(log.reasons) if isinstance(log.reasons, list) else str(log.reasons)
        writer.writerow([
            log.id,
            log.url,
            log.domain,
            log.status,
            log.risk_score,
            log.scan_date.strftime("%Y-%m-%d %H:%M:%S") if log.scan_date else "",
            reasons_str
        ])

    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=phishing_scan_history.csv"
    return response
