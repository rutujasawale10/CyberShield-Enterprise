import pytest
from app.threat_intel import ThreatIntelEngine

def test_threat_intel_mock_engine():
    res_phish = ThreatIntelEngine.check_url("http://amaz0n-login.xyz", "amaz0n-login.xyz")
    assert res_phish["threat_score"] >= 50
    assert len(res_phish["threat_tags"]) > 0

    res_safe = ThreatIntelEngine.check_url("https://www.google.com", "google.com")
    assert res_safe["threat_score"] == 0
