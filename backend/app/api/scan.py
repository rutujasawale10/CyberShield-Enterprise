from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ScanLog, User
from app.schemas import URLScanRequest, BatchScanRequest, ScanResultResponse
from app.ml_engine import MLEngine
from app.auth import get_current_user

router = APIRouter(prefix="/scan", tags=["URL Scanner"])

@router.post("", response_model=ScanResultResponse)
def scan_single_url(
    payload: URLScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    url = payload.url.strip()
    if not url:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="URL field cannot be empty")

    result = MLEngine.predict_url(url)

    db_log = ScanLog(
        user_id=current_user.id if current_user else None,
        url=result["url"],
        domain=result["domain"],
        status=result["status"],
        risk_score=result["risk_score"],
        confidence_score=result["confidence_score"],
        reasons=result["reasons"],
        extracted_features=result["extracted_features"],
        threat_intel_results=result.get("threat_intel"),
        xai_attribution=result.get("xai_attribution")
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    result["id"] = db_log.id
    result["scan_date"] = db_log.scan_date
    return result

@router.post("/batch", response_model=list[ScanResultResponse])
def scan_batch_urls(
    payload: BatchScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    urls = payload.urls
    if not urls or len(urls) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="URL list cannot be empty")

    if len(urls) > 50:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Maximum 50 URLs allowed per batch request")

    results = []
    for raw_url in urls:
        raw_url = raw_url.strip()
        if not raw_url:
            continue
        res = MLEngine.predict_url(raw_url)
        db_log = ScanLog(
            user_id=current_user.id if current_user else None,
            url=res["url"],
            domain=res["domain"],
            status=res["status"],
            risk_score=res["risk_score"],
            confidence_score=res["confidence_score"],
            reasons=res["reasons"],
            extracted_features=res["extracted_features"],
            threat_intel_results=res.get("threat_intel"),
            xai_attribution=res.get("xai_attribution")
        )
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        res["id"] = db_log.id
        res["scan_date"] = db_log.scan_date
        results.append(res)

    return results
