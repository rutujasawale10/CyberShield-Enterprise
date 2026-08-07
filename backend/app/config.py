import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# API Versioning
API_V1_STR = "/api"
API_V2_STR = "/api/v2"

# Database configuration (Supports PostgreSQL and SQLite)
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/cybershield_enterprise.db")

# Cache & Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# JWT Security Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "cybershield_enterprise_super_secret_jwt_key_2026_xai_soc")
JWT_REFRESH_SECRET_KEY = os.getenv("JWT_REFRESH_SECRET_KEY", "cybershield_refresh_secret_key_2026_xai_soc")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24        # 24 Hours
JWT_REFRESH_TOKEN_EXPIRE_DAYS = 7               # 7 Days

# Admin Default Seed Credentials
DEFAULT_ADMIN_EMAIL = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@cybershield.com")
DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin@123")

# Threat Intelligence API Keys (Falls back to Intelligent Mock Engine if unconfigured)
VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY", "")
GOOGLE_SAFE_BROWSING_API_KEY = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY", "")
ALIENVULT_OTX_API_KEY = os.getenv("ALIENVULT_OTX_API_KEY", "")
ABUSEIPDB_API_KEY = os.getenv("ABUSEIPDB_API_KEY", "")

# ML Model Paths
MODEL_DIR = BASE_DIR / "ml" / "models"
MODEL_PATH = MODEL_DIR / "phishing_model.joblib"
ALT_MODEL_PATH = MODEL_DIR / "model.joblib"
SCALER_PATH = MODEL_DIR / "feature_scaler.joblib"
ALT_SCALER_PATH = MODEL_DIR / "scaler.joblib"
FEATURE_NAMES_PATH = MODEL_DIR / "feature_names.joblib"
BENCHMARK_RESULTS_PATH = MODEL_DIR / "model_benchmark.json"

# Security Rules
SUSPICIOUS_KEYWORDS = [
    "login", "verify", "account", "security", "update", "banking", "secure",
    "webscr", "cmd", "signin", "paypal", "amazon", "amaz0n", "paytm",
    "statebank", "sbi", "hdbc", "netbanking", "confirm", "wallet", "support",
    "checkpoint", "verification", "service", "billing", "authenticate", "passcode"
]

HIGH_RISK_TLDS = [
    ".xyz", ".top", ".club", ".work", ".kim", ".gq", ".ml", ".cf", ".ga",
    ".tk", ".info", ".online", ".site", ".buzz", ".vip", ".fit", ".rest"
]

KNOWN_URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "is.gd", "buff.ly",
    "adf.ly", "bit.do", "cutt.ly", "rb.gy", "shorturl.at"
]

# Thresholds
RISK_HIGH_THRESHOLD = 70.0   # Risk score >= 70% is Phishing
RISK_MEDIUM_THRESHOLD = 40.0  # Risk score 40%-69% is Suspicious
