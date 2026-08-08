from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.database import get_db
from app.models import (
    ProtectionDevice, SecurityAlert, BlockedEvent,
    ProtectedNumber, NumberAbuseEvent, AuditLog, User
)
from app.schemas import (
    ProtectionCheckRequest, ProtectionCheckResponse,
    DeviceRegisterRequest, DeviceHeartbeatRequest, ProtectionDeviceResponse,
    SecurityAlertResponse, ProtectedNumberCreateRequest, ProtectedNumberResponse,
    NumberBlockRequest, SpamReportRequest, NumberAbuseEventResponse,
    FalsePositiveReportRequest
)
from app.ml_engine import MLEngine
from app.auth import get_current_user, require_current_user

router = APIRouter(prefix="/protection", tags=["Real-Time Protection Engine"])

def generate_human_explanation(res: dict) -> dict:
    status = res["status"]
    score = res["risk_score"]
    reasons = res.get("reasons", [])

    issues = []
    for r in reasons:
        if "IP" in r:
            issues.append("Raw IP address used instead of a registered domain name")
        elif "spoofing" in r.lower() or "typosquatting" in r.lower():
            issues.append("Domain structure closely resembles a well-known brand")
        elif "sensitive" in r.lower() or "keyword" in r.lower():
            issues.append("Authentication / credential-harvesting keyword detected in URL path")
        elif "HTTPS" in r.lower() or "HTTP" in r.lower():
            issues.append("Insecure HTTP connection lacking SSL encryption")
        elif "TLD" in r.lower():
            issues.append("Uses a high-risk, low-cost Top-Level Domain (TLD)")
        elif "shortener" in r.lower():
            issues.append("URL shortener service hides true destination")
        elif "@" in r:
            issues.append("Contains '@' redirection symbol obfuscating real destination")
        elif "Punycode" in r or "xn--" in r:
            issues.append("Punycode IDN homograph domain attack detected")
        else:
            issues.append(r)

    if not issues:
        issues.append("No suspicious indicators found. Standard domain structure verified with SSL protection.")

    if status == "Phishing":
        summary = "CRITICAL THREAT: This website exhibits severe phishing indicators and is likely attempting to impersonate a legitimate service to harvest sensitive credentials or financial information."
    elif status == "Suspicious":
        summary = "WARNING: This website exhibits unusual structural or network characteristics. Proceed with caution and verify the true destination before entering passwords or personal details."
    else:
        summary = "VERIFIED SAFE: No threat vectors detected. Domain structure cleared for enterprise user navigation."

    return {
        "summary": summary,
        "issues_list": issues,
        "what_does_this_mean": "CyberShield analyzed domain identity, ML lexical features, raw IP hosting, brand spoofing, and multi-source threat intelligence before permitting navigation."
    }

@router.post("/check-url", response_model=ProtectionCheckResponse)
def check_url_protection(
    payload: ProtectionCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    raw_url = payload.url.strip()
    if not raw_url:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="URL cannot be empty")

    res = MLEngine.predict_url(raw_url)
    status_label = res["status"]
    score = res["risk_score"]

    if status_label == "Phishing" or score >= 70.0:
        decision = "BLOCK"
        severity = "HIGH" if score < 90 else "CRITICAL"
    elif status_label == "Suspicious" or score >= 40.0:
        decision = "WARN"
        severity = "MEDIUM"
    else:
        decision = "ALLOW"
        severity = "INFO"

    explanation = generate_human_explanation(res)
    geo_info = res.get("extracted_features", {}).get("geo_info", {})

    technical_details = {
        "host_type": res.get("host_type", "DOMAIN"),
        "ip_address": res.get("ip_address") or geo_info.get("ip_address") or "N/A",
        "country": res.get("country") or geo_info.get("country") or "Unknown",
        "asn": res.get("asn") or geo_info.get("asn") or "Unknown",
        "isp": res.get("isp") or geo_info.get("isp") or "Unknown",
        "registered_domain": res.get("registered_domain") or res.get("domain"),
        "subdomain": res.get("subdomain"),
        "geo_anomaly": res.get("geo_anomaly", False),
        "ip_reputation": res.get("ip_reputation", "UNKNOWN"),
        "domain_anomaly_score": res.get("domain_anomaly_score", 0.0),
        "threat_intel_score": res.get("threat_intel", {}).get("threat_score", 0)
    }

    user_id = current_user.id if current_user else None

    # Log Blocked Event & Security Alert if WARN or BLOCK
    if decision in ["BLOCK", "WARN"]:
        blocked_log = BlockedEvent(
            user_id=user_id,
            url=raw_url,
            domain=res["domain"],
            client_type=payload.client_type or "BROWSER",
            reason=", ".join(res.get("reasons", [])[:2]),
            risk_score=score
        )
        db.add(blocked_log)

        sec_alert = SecurityAlert(
            user_id=user_id,
            alert_type="Phishing Website Blocked" if decision == "BLOCK" else "Suspicious Website Warning",
            severity=severity,
            target=res["domain"],
            risk_score=score,
            message=f"{'Blocked' if decision == 'BLOCK' else 'Warned on'} {res['domain']} (Risk Score: {score}%)",
            details={
                "url": raw_url,
                "reasons": res.get("reasons", []),
                "decision": decision,
                "client_type": payload.client_type
            }
        )
        db.add(sec_alert)
        db.commit()

    return {
        "decision": decision,
        "status": status_label,
        "risk_score": score,
        "threat_level": res["threat_level"],
        "target_url": raw_url,
        "domain": res["domain"],
        "reasons": res.get("reasons", []),
        "explanation": explanation,
        "technical_details": technical_details
    }

# Device Registration & Sync Endpoints
@router.post("/device/register", response_model=ProtectionDeviceResponse)
def register_device(
    payload: DeviceRegisterRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    device = ProtectionDevice(
        user_id=user_id,
        device_name=payload.device_name,
        device_type=payload.device_type,
        client_version=payload.client_version or "4.0.0",
        os_name=payload.os_name or "Windows",
        is_active=True
    )
    db.add(device)
    db.commit()
    db.refresh(device)
    return device

@router.post("/device/heartbeat")
def device_heartbeat(
    payload: DeviceHeartbeatRequest,
    db: Session = Depends(get_db)
):
    device = db.query(ProtectionDevice).filter(ProtectionDevice.id == payload.device_id).first()
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Device not found")
    
    device.last_seen = datetime.now(timezone.utc)
    device.is_active = payload.is_active
    db.commit()
    return {"status": "OK", "device_id": device.id, "last_seen": device.last_seen}

@router.get("/devices", response_model=list[ProtectionDeviceResponse])
def get_protection_devices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(ProtectionDevice).filter(ProtectionDevice.is_active == True)
    if current_user and current_user.role != "Admin":
        query = query.filter(ProtectionDevice.user_id == current_user.id)
    return query.order_by(ProtectionDevice.last_seen.desc()).all()

@router.delete("/device/{device_id}")
def revoke_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = db.query(ProtectionDevice).filter(ProtectionDevice.id == device_id).first()
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Device not found")
    
    device.is_active = False
    db.commit()
    return {"status": "Revoked", "device_id": device_id}

# Security Alerts Endpoints
@router.get("/alerts", response_model=list[SecurityAlertResponse])
def get_security_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(SecurityAlert)
    if current_user and current_user.role != "Admin":
        query = query.filter((SecurityAlert.user_id == current_user.id) | (SecurityAlert.user_id == None))
    return query.order_by(SecurityAlert.timestamp.desc()).limit(50).all()

@router.post("/alerts/read-all")
def mark_alerts_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(SecurityAlert).update({SecurityAlert.is_read: True})
    db.commit()
    return {"status": "Success", "message": "All security alerts marked as read"}

# Defensive Phone / Number Protection Endpoints
@router.post("/number/register", response_model=ProtectedNumberResponse)
def register_protected_number(
    payload: ProtectedNumberCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    number = payload.phone_number.strip()
    if not number:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone number cannot be empty")

    user_id = current_user.id if current_user else None
    existing = db.query(ProtectedNumber).filter(ProtectedNumber.phone_number == number).first()
    if existing:
        return existing

    prot_num = ProtectedNumber(
        user_id=user_id,
        phone_number=number,
        label=payload.label or "My Mobile",
        is_blocked=False,
        spam_count=0
    )
    db.add(prot_num)
    db.commit()
    db.refresh(prot_num)
    return prot_num

@router.get("/number/list", response_model=list[ProtectedNumberResponse])
def list_protected_numbers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(ProtectedNumber)
    if current_user and current_user.role != "Admin":
        query = query.filter((ProtectedNumber.user_id == current_user.id) | (ProtectedNumber.user_id == None))
    return query.order_by(ProtectedNumber.registered_at.desc()).all()

@router.post("/number/block")
def block_number_locally(
    payload: NumberBlockRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    number = payload.phone_number.strip()
    num_obj = db.query(ProtectedNumber).filter(ProtectedNumber.phone_number == number).first()
    if not num_obj:
        num_obj = ProtectedNumber(
            user_id=current_user.id if current_user else None,
            phone_number=number,
            label="Blocked Contact",
            is_blocked=True,
            spam_count=1
        )
        db.add(num_obj)
    else:
        num_obj.is_blocked = True
        num_obj.spam_count += 1
    
    db.commit()
    return {"status": "Blocked", "phone_number": number}

@router.post("/number/report-spam")
def report_spam_number(
    payload: SpamReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    number = payload.phone_number.strip()
    num_obj = db.query(ProtectedNumber).filter(ProtectedNumber.phone_number == number).first()
    if num_obj:
        num_obj.spam_count += 1

    event = NumberAbuseEvent(
        user_id=current_user.id if current_user else None,
        protected_number_id=num_obj.id if num_obj else None,
        phone_number=number,
        caller_id=payload.caller_id,
        event_type="SPAM_SMS_CALL_REPORT",
        frequency=1,
        details=payload.reason or "Reported by user"
    )
    db.add(event)

    sec_alert = SecurityAlert(
        user_id=current_user.id if current_user else None,
        alert_type="Phone Spam Report",
        severity="LOW",
        target=number,
        risk_score=50.0,
        message=f"Spam/harassment reported for contact {number}",
        details={"caller_id": payload.caller_id, "reason": payload.reason}
    )
    db.add(sec_alert)
    db.commit()
    return {"status": "Logged", "phone_number": number, "event_id": event.id}

@router.get("/number/events", response_model=list[NumberAbuseEventResponse])
def get_number_abuse_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(NumberAbuseEvent)
    if current_user and current_user.role != "Admin":
        query = query.filter((NumberAbuseEvent.user_id == current_user.id) | (NumberAbuseEvent.user_id == None))
    return query.order_by(NumberAbuseEvent.timestamp.desc()).limit(50).all()

# False Positive Feedback Endpoint
@router.post("/report-false-positive")
def report_false_positive(
    payload: FalsePositiveReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_email = current_user.email if current_user else "Anonymous User"
    audit = AuditLog(
        user_email=user_email,
        action="REPORT_FALSE_POSITIVE",
        details=f"URL: {payload.url} | Comments: {payload.comments}"
    )
    db.add(audit)
    db.commit()
    return {"status": "Submitted", "message": "False positive report logged successfully. Our security team will re-audit the domain."}
