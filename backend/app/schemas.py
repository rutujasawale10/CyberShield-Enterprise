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
