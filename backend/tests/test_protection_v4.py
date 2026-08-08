import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_01_check_url_safe():
    res = client.post("/api/protection/check-url", json={"url": "https://google.com", "client_type": "BROWSER"})
    assert res.status_code == 200
    data = res.json()
    assert data["decision"] == "ALLOW"
    assert data["status"] == "Safe"
    assert "explanation" in data
    assert "technical_details" in data
    assert data["technical_details"]["host_type"] == "DOMAIN"

def test_02_check_url_suspicious():
    res = client.post("/api/protection/check-url", json={"url": "http://185.199.108.153", "client_type": "BROWSER"})
    assert res.status_code == 200
    data = res.json()
    assert data["decision"] == "WARN"
    assert data["status"] == "Suspicious"
    assert len(data["explanation"]["issues_list"]) > 0

def test_03_check_url_phishing_block():
    res = client.post("/api/protection/check-url", json={"url": "http://185.199.108.153/login", "client_type": "BROWSER"})
    assert res.status_code == 200
    data = res.json()
    assert data["decision"] == "BLOCK"
    assert data["status"] == "Phishing"
    assert data["risk_score"] >= 70.0
    assert "CRITICAL THREAT" in data["explanation"]["summary"] or "WARNING" in data["explanation"]["summary"]

def test_04_device_lifecycle():
    # Register device
    reg_res = client.post("/api/protection/device/register", json={
        "device_name": "Chrome Extension - Work Laptop",
        "device_type": "BROWSER",
        "client_version": "4.0.0",
        "os_name": "Windows 11"
    })
    assert reg_res.status_code == 200
    dev_data = reg_res.json()
    dev_id = dev_data["id"]
    assert dev_data["device_name"] == "Chrome Extension - Work Laptop"
    assert dev_data["is_active"] is True

    # Heartbeat
    hb_res = client.post("/api/protection/device/heartbeat", json={"device_id": dev_id, "is_active": True})
    assert hb_res.status_code == 200

    # List Devices
    list_res = client.get("/api/protection/devices")
    assert list_res.status_code == 200
    assert len(list_res.json()) > 0

def test_05_security_alerts():
    res = client.get("/api/protection/alerts")
    assert res.status_code == 200
    alerts = res.json()
    assert isinstance(alerts, list)

    read_res = client.post("/api/protection/alerts/read-all")
    assert read_res.status_code == 200

def test_06_defensive_number_protection():
    # Register user's own number
    reg_num = client.post("/api/protection/number/register", json={
        "phone_number": "+1-555-0199",
        "label": "Personal iPhone"
    })
    assert reg_num.status_code == 200
    assert reg_num.json()["phone_number"] == "+1-555-0199"

    # List protected numbers
    list_num = client.get("/api/protection/number/list")
    assert list_num.status_code == 200

    # Block spam number
    block_num = client.post("/api/protection/number/block", json={"phone_number": "+1-800-SPAMMER"})
    assert block_num.status_code == 200
    assert block_num.json()["status"] == "Blocked"

    # Report spam call/SMS
    spam_rep = client.post("/api/protection/number/report-spam", json={
        "phone_number": "+1-800-SPAMMER",
        "caller_id": "Fake IRS Scam",
        "reason": "Repeated robot call"
    })
    assert spam_rep.status_code == 200

    # Get events
    events_res = client.get("/api/protection/number/events")
    assert events_res.status_code == 200

def test_07_false_positive_report():
    res = client.post("/api/protection/report-false-positive", json={
        "url": "https://legitimate-internal-tool.example",
        "comments": "False positive trigger on internal subnet"
    })
    assert res.status_code == 200
    assert res.json()["status"] == "Submitted"
