from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(512), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="User", nullable=False)  # Admin, Analyst, User
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ScanLog(Base):
    __tablename__ = "scan_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    url = Column(String(2048), nullable=False, index=True)
    domain = Column(String(512), nullable=False, index=True)
    status = Column(String(50), nullable=False)        # Phishing, Safe, Suspicious
    risk_score = Column(Float, nullable=False)         # 0.0 to 100.0
    confidence_score = Column(Float, default=95.0)     # Model confidence 0.0 to 100.0
    reasons = Column(JSON, nullable=False)             # List of detected reasons
    extracted_features = Column(JSON, nullable=False)   # Extracted 20+ parameters
    threat_intel_results = Column(JSON, nullable=True) # VirusTotal, SafeBrowsing data
    xai_attribution = Column(JSON, nullable=True)      # Explainable AI feature weights
    scan_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ThreatFeed(Base):
    __tablename__ = "threat_feed"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String(512), unique=True, nullable=False, index=True)
    threat_type = Column(String(100), default="Phishing")
    source = Column(String(100), default="Community/System")
    added_on = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class BlockedURL(Base):
    __tablename__ = "blocked_urls"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(2048), nullable=False, index=True)
    reason = Column(String(512), nullable=True)
    blocked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(255), nullable=False)
    details = Column(String(1024), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# CyberShield v4.0 Protection Ecosystem Models
class ProtectionDevice(Base):
    __tablename__ = "protection_devices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    device_name = Column(String(255), nullable=False)
    device_type = Column(String(50), nullable=False, default="BROWSER")  # BROWSER, DESKTOP, MOBILE
    client_version = Column(String(50), default="4.0.0")
    os_name = Column(String(100), default="Windows")
    is_active = Column(Boolean, default=True)
    last_seen = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SecurityAlert(Base):
    __tablename__ = "security_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    alert_type = Column(String(100), nullable=False)  # Phishing Blocked, Suspicious Warning, Number Abuse, Device Security
    severity = Column(String(50), nullable=False, default="HIGH")  # INFO, LOW, MEDIUM, HIGH, CRITICAL
    target = Column(String(2048), nullable=False)
    risk_score = Column(Float, default=0.0)
    message = Column(Text, nullable=False)
    details = Column(JSON, nullable=True)
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class BlockedEvent(Base):
    __tablename__ = "blocked_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    url = Column(String(2048), nullable=False, index=True)
    domain = Column(String(512), nullable=False, index=True)
    client_type = Column(String(50), default="BROWSER")
    reason = Column(String(1024), nullable=True)
    risk_score = Column(Float, default=0.0)
    blocked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ProtectedNumber(Base):
    __tablename__ = "protected_numbers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    phone_number = Column(String(50), nullable=False, index=True)
    label = Column(String(100), default="My Mobile")
    is_blocked = Column(Boolean, default=False)
    spam_count = Column(Integer, default=0)
    registered_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class NumberAbuseEvent(Base):
    __tablename__ = "number_abuse_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    protected_number_id = Column(Integer, ForeignKey("protected_numbers.id"), nullable=True)
    phone_number = Column(String(50), nullable=False)
    caller_id = Column(String(50), nullable=True)
    event_type = Column(String(100), default="SUSPICIOUS_CALL_FREQUENCY")  # SUSPICIOUS_CALL, SPAM_SMS, REPEATED_UNKNOWN
    frequency = Column(Integer, default=1)
    details = Column(String(1024), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
