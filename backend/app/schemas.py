from pydantic import BaseModel, Field, ConfigDict, HttpUrl
from typing import List, Dict, Any, Optional
from datetime import datetime

# Auth & User Schemas
class UserRegisterRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = "Security User"

class UserLoginRequest(BaseModel):
    username: str  # OAuth2 password flow uses username field for email
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    full_name: Optional[str] = None
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# URL Scan Schemas
class URLScanRequest(BaseModel):
    url: str = Field(..., description="URL to scan (e.g. http://amaz0n-login.xyz)")

class BatchScanRequest(BaseModel):
    urls: List[str] = Field(..., description="List of URLs to scan")

class ScanResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    url: str
    domain: str
    status: str            # Safe, Phishing, Suspicious
    risk_score: float      # 0 - 100
    confidence: Optional[float] = 95.0
    confidence_score: Optional[float] = 95.0
    threat_level: Optional[str] = "LOW"    # HIGH, MEDIUM, LOW
    reasons: List[str]
    extracted_features: Dict[str, Any]
    threat_intel: Optional[Dict[str, Any]] = None
    xai_attribution: Optional[List[Dict[str, Any]]] = None
    scan_date: Optional[datetime] = None

    # Optional v3.0 Identity & Geolocation Intelligence Fields
    host_type: Optional[str] = "DOMAIN"
    is_ip_host: Optional[bool] = False
    ip_address: Optional[str] = None
    country: Optional[str] = "Unknown"
    country_code: Optional[str] = None
    asn: Optional[str] = "Unknown"
    isp: Optional[str] = "Unknown"
    registered_domain: Optional[str] = None
    subdomain: Optional[str] = None
    geo_anomaly: Optional[bool] = False
    ip_reputation: Optional[str] = "UNKNOWN"
    domain_anomaly_score: Optional[float] = 0.0
    detection_reasons: Optional[List[str]] = None

# Analytics & Dashboard Schemas
class GeoAttackNode(BaseModel):
    country: str
    country_code: str
    lat: float
    lng: float
    threat_count: int

class DashboardStatsResponse(BaseModel):
    total_scans: int
    phishing_count: int
    safe_count: int
    suspicious_count: int
    avg_risk_score: float
    recent_scans: List[ScanResultResponse]
    geo_attack_map: List[GeoAttackNode]
    high_risk_targets: List[ScanResultResponse]

    # Protection Network v4.0 Counters
    active_devices_count: Optional[int] = 0
    blocked_urls_count: Optional[int] = 0
    security_alerts_count: Optional[int] = 0
    number_protection_events_count: Optional[int] = 0

class ThreatFeedItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    domain: str
    threat_type: str
    source: str
    added_on: datetime

class ThreatFeedCreateRequest(BaseModel):
    domain: str
    threat_type: Optional[str] = "Phishing"
    source: Optional[str] = "Analyst Submitted"

# Protection Ecosystem Schemas (v4.0)
class ProtectionCheckRequest(BaseModel):
    url: str = Field(..., description="URL to verify before navigation")
    client_type: Optional[str] = "BROWSER"  # BROWSER, DESKTOP, MOBILE

class ProtectionCheckResponse(BaseModel):
    decision: str  # ALLOW, WARN, BLOCK
    status: str    # Safe, Suspicious, Phishing
    risk_score: float
    threat_level: str
    target_url: str
    domain: str
    reasons: List[str]
    explanation: Dict[str, Any]
    technical_details: Dict[str, Any]

class DeviceRegisterRequest(BaseModel):
    device_name: str
    device_type: str = "BROWSER"  # BROWSER, DESKTOP, MOBILE
    client_version: Optional[str] = "4.0.0"
    os_name: Optional[str] = "Windows"

class DeviceHeartbeatRequest(BaseModel):
    device_id: int
    is_active: bool = True

class ProtectionDeviceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: Optional[int] = None
    device_name: str
    device_type: str
    client_version: str
    os_name: str
    is_active: bool
    last_seen: datetime

class SecurityAlertResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    alert_type: str
    severity: str
    target: str
    risk_score: float
    message: str
    details: Optional[Dict[str, Any]] = None
    is_read: bool
    timestamp: datetime

class ProtectedNumberCreateRequest(BaseModel):
    phone_number: str
    label: Optional[str] = "My Mobile"

class ProtectedNumberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    phone_number: str
    label: str
    is_blocked: bool
    spam_count: int
    registered_at: datetime

class NumberBlockRequest(BaseModel):
    phone_number: str

class SpamReportRequest(BaseModel):
    phone_number: str
    caller_id: Optional[str] = None
    reason: Optional[str] = "Spam / Harassment"

class NumberAbuseEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    phone_number: str
    caller_id: Optional[str] = None
    event_type: str
    frequency: int
    details: Optional[str] = None
    timestamp: datetime

class FalsePositiveReportRequest(BaseModel):
    url: str
    comments: Optional[str] = "False positive reported by user"
