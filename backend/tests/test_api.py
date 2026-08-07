from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "Online"

def test_scan_phishing_url():
    payload = {"url": "http://amaz0n-login.xyz"}
    response = client.post("/api/scan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["Phishing", "Suspicious"]
    assert data["risk_score"] >= 50.0
    assert len(data["reasons"]) > 0

def test_scan_safe_url():
    payload = {"url": "https://google.com"}
    response = client.post("/api/scan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Safe"
    assert data["risk_score"] < 40.0

def test_stats_endpoint():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_scans" in data
    assert "phishing_count" in data
