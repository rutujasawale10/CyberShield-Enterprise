import pytest
from unittest.mock import patch, MagicMock
import requests
from app.ml_engine import MLEngine
from app.ip_geo_engine import IPGeoEngine
from app.feature_extractor import FeatureExtractor
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. NORMAL SAFE DOMAINS
def test_normal_safe_domains():
    safe_urls = [
        "https://example.com",
        "https://www.microsoft.com",
        "https://www.wikipedia.org"
    ]
    for url in safe_urls:
        res = MLEngine.predict_url(url)
        assert res["status"] == "Safe"
        assert res["risk_score"] < 40.0
        assert res["host_type"] == "DOMAIN"
        assert res["is_ip_host"] is False

# 2. RAW IPv4 HOSTING
def test_raw_ipv4_hosting():
    ipv4_urls = [
        "http://185.199.108.153",
        "http://8.8.8.8",
        "http://1.1.1.1"
    ]
    for url in ipv4_urls:
        res = MLEngine.predict_url(url)
        assert res["is_ip_host"] is True
        assert res["host_type"] in ["IPv4", "PRIVATE_IP"]
        assert res["ip_address"] is not None
        # Raw IP without sensitive path or threat intel should not be Phishing by default
        assert res["status"] in ["Safe", "Suspicious"]

# 3. RAW IP + SENSITIVE PATH
def test_raw_ip_sensitive_paths():
    sensitive_urls = [
        "http://185.199.108.153/login",
        "http://185.199.108.153/verify",
        "http://185.199.108.153/account",
        "http://185.199.108.153/banking",
        "http://185.199.108.153/wallet"
    ]
    for url in sensitive_urls:
        res = MLEngine.predict_url(url)
        assert res["is_ip_host"] is True
        assert res["risk_score"] >= 40.0
        assert res["status"] in ["Suspicious", "Phishing"]
        assert len(res["reasons"]) > 0

# 4. DOMAIN BRAND SPOOFING
def test_domain_brand_spoofing():
    spoof_urls = [
        "https://paypal.com.attacker.example",
        "https://microsoft-login.com",
        "https://google-security.org",
        "http://amaz0n-login.xyz"
    ]
    for url in spoof_urls:
        res = MLEngine.predict_url(url)
        assert res["risk_score"] >= 40.0
        assert res["status"] in ["Suspicious", "Phishing"]

# 5. OBFUSCATED IP / NUMERIC HOSTS
def test_obfuscated_numeric_hosts():
    numeric_test_cases = [
        ("http://185.199.108.153", ["IPv4", "PRIVATE_IP"]),
        ("http://[2001:db8::1]", ["IPv6", "PRIVATE_IP"]),
        ("http://localhost:8000", ["LOCALHOST"]),
        ("http://127.0.0.1", ["LOCALHOST"]),
        ("http://192.168.1.1", ["PRIVATE_IP"]),
        ("http://0300.0250.0154.0231", ["SUSPICIOUS_NUMERIC"]),
        ("http://0x7f.0.0.1", ["SUSPICIOUS_NUMERIC"]),
        ("http://2886730000", ["SUSPICIOUS_NUMERIC"])
    ]
    for url, expected_types in numeric_test_cases:
        res = MLEngine.predict_url(url)
        assert res["is_ip_host"] is True
        assert res["host_type"] in expected_types

# 6. URL MANIPULATION
def test_url_manipulation_features():
    # @ redirect
    res_at = MLEngine.predict_url("http://google.com@attacker.com")
    assert res_at["extracted_features"]["count_at"] > 0
    assert any("@" in r for r in res_at["reasons"])

    # Unusual port
    res_port = MLEngine.predict_url("http://example.com:8080/login")
    assert res_port["extracted_features"]["has_non_standard_port"] == 1

    # Punycode
    res_puny = MLEngine.predict_url("http://xn--80ak6aa92e.com")
    assert res_puny["extracted_features"]["is_homograph_attack"] == 1 or res_puny["extracted_features"]["identity_analysis"]["has_punycode"] is True

    # Excessive subdomains
    res_sub = MLEngine.predict_url("http://a.b.c.d.example.com")
    assert res_sub["extracted_features"]["count_subdomains"] >= 3

# 7 & 8. GEOLOCATION MOCKED TESTS & API FAILURES
def test_geo_api_timeout_fallback():
    with patch("requests.get", side_effect=requests.exceptions.Timeout("Connection timed out")):
        res = MLEngine.predict_url("https://example.com", offline=False)
        assert res["status"] == "Safe"
        assert res["country"] == "Unknown"
        assert res["country_code"] is None

def test_geo_api_invalid_key_fallback():
    mock_resp = MagicMock()
    mock_resp.status_code = 401
    mock_resp.json.return_value = {"message": "Invalid API key"}
    
    with patch("requests.get", return_value=mock_resp):
        res = MLEngine.predict_url("https://example.com", offline=False)
        assert res["status"] == "Safe"
        assert res["country"] == "Unknown"

def test_geo_api_empty_response_fallback():
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {}
    
    with patch("requests.get", return_value=mock_resp):
        res = MLEngine.predict_url("https://example.com", offline=False)
        assert res["status"] == "Safe"
        assert res["country"] == "Unknown"

def test_geo_api_network_failure_fallback():
    with patch("requests.get", side_effect=requests.exceptions.ConnectionError("DNS lookup failed")):
        res = MLEngine.predict_url("https://example.com", offline=False)
        assert res["status"] == "Safe"
        assert res["country"] == "Unknown"

# 9. API ENDPOINT RESPONSE BACKWARD COMPATIBILITY
def test_api_scan_response_fields():
    response = client.post("/api/scan", json={"url": "http://185.199.108.153/login"})
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "risk_score" in data
    assert "confidence" in data
    assert "host_type" in data
    assert "is_ip_host" in data
    assert "country" in data
    assert "registered_domain" in data
    assert "geo_anomaly" in data
    assert "ip_reputation" in data
    assert "detection_reasons" in data
