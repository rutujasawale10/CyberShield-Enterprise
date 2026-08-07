from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ThreatFeed, User
from app.schemas import ThreatFeedItem, ThreatFeedCreateRequest
from app.auth import require_role

router = APIRouter(prefix="/threat-intel", tags=["Threat Intelligence Feeds"])

@router.get("", response_model=list[ThreatFeedItem])
def get_threat_intel_feed(db: Session = Depends(get_db)):
    items = db.query(ThreatFeed).order_by(ThreatFeed.added_on.desc()).limit(100).all()
    return [ThreatFeedItem.model_validate(i) for i in items]

@router.post("/add", response_model=ThreatFeedItem)
def add_threat_intel_domain(
    payload: ThreatFeedCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Admin", "Analyst"]))
):
    domain = payload.domain.strip().lower()
    existing = db.query(ThreatFeed).filter(ThreatFeed.domain == domain).first()
    if existing:
        raise HTTPException(status_code=400, detail="Domain already exists in Threat Intelligence Feed")

    item = ThreatFeed(
        domain=domain,
        threat_type=payload.threat_type or "Phishing",
        source=f"Submitted by {current_user.email} ({current_user.role})"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return ThreatFeedItem.model_validate(item)
