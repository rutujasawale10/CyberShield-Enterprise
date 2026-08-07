import pytest
from app.ml_engine import MLEngine
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Task 8: 10 Realistic Suspicious URLs
SUSPICIOUS_URLS = [
    "http://login-portal-update.com",
    "http://secure-auth-verify.org",
    "http://account-update-info.net",
    "https://banking-service-portal.online",
    "http://verification-user-security.info",
    "http://webscr-confirm.tech",
    "http://checkpoint-login-service.site",
    "https://confirm-myaccount-alert.co",
    "http://user-security-check.live",
    "https://wallet-connect-auth.club"
]

PHISHING_URLS = [
    "http://amaz0n-login.xyz",
    "http://paytm-secure-login.xyz",
    "http://statebank-login.net",
    "http://192.168.1.1/paypal/login.php",
    "http://user@amaz0n-security-update.xyz/login"
]

SAFE_URLS = [
    "https://www.google.com",
    "https://www.github.com",
    "https://www.wikipedia.org",
    "https://www.microsoft.com",
    "https://www.python.org"
]

def test_safe_classification():
    for url in SAFE_URLS:
        res = MLEngine.predict_url(url)
        assert res["status"] == "Safe", f"Expected Safe for {url}, got {res['status']}"
        assert res["risk_score"] < 40.0, f"Expected risk_score < 40.0 for {url}, got {res['risk_score']}"
        assert res["threat_level"] == "LOW"
        assert "confidence" in res
        assert "confidence_score" in res

def test_suspicious_classification_10_urls():
    """Proves all 10 realistic suspicious URLs produce Suspicious label (40 <= risk_score < 70)."""
    for url in SUSPICIOUS_URLS:
        res = MLEngine.predict_url(url)
        assert res["status"] == "Suspicious", f"Expected Suspicious for {url}, got {res['status']} (Risk score: {res['risk_score']})"
        assert 40.0 <= res["risk_score"] < 70.0, f"Expected risk_score 40-69 for {url}, got {res['risk_score']}"
        assert res["threat_level"] == "MEDIUM"
        assert "confidence" in res
        assert "confidence_score" in res

def test_phishing_classification():
    for url in PHISHING_URLS:
        res = MLEngine.predict_url(url)
        assert res["status"] == "Phishing", f"Expected Phishing for {url}, got {res['status']}"
        assert res["risk_score"] >= 70.0, f"Expected risk_score >= 70.0 for {url}, got {res['risk_score']}"
        assert res["threat_level"] == "HIGH"
        assert "confidence" in res
        assert "confidence_score" in res

def test_api_scan_endpoint_returns_all_three_labels_and_fields():
    # 1. Test Phishing via API
    res_phish = client.post("/api/scan", json={"url": "http://amaz0n-login.xyz"})
    assert res_phish.status_code == 200
    data_phish = res_phish.json()
    assert data_phish["status"] == "Phishing"
    assert data_phish["risk_score"] >= 70.0
    assert data_phish["threat_level"] == "HIGH"
    assert "confidence" in data_phish

    # 2. Test Suspicious via API
    res_susp = client.post("/api/scan", json={"url": "http://login-portal-update.com"})
    assert res_susp.status_code == 200
    data_susp = res_susp.json()
    assert data_susp["status"] == "Suspicious"
    assert 40.0 <= data_susp["risk_score"] < 70.0
    assert data_susp["threat_level"] == "MEDIUM"
    assert "confidence" in data_susp

    # 3. Test Safe via API
    res_safe = client.post("/api/scan", json={"url": "https://www.google.com"})
    assert res_safe.status_code == 200
    data_safe = res_safe.json()
    assert data_safe["status"] == "Safe"
    assert data_safe["risk_score"] < 40.0
    assert data_safe["threat_level"] == "LOW"
    assert "confidence" in data_safe
