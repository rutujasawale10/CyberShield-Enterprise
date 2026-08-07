import pytest
from app.feature_extractor import FeatureExtractor

def test_legitimate_url_features_offline():
    url = "https://www.google.com"
    feats = FeatureExtractor.extract_features(url, offline=True)
    assert feats["is_https"] == 1
    assert feats["is_ip_address"] == 0
    assert feats["count_at"] == 0
    assert feats["suspicious_tld"] == 0
    assert feats["dns_resolves"] == 1  # Default offline value without network call

def test_phishing_url_features_offline():
    url = "http://amaz0n-login.xyz"
    feats = FeatureExtractor.extract_features(url, offline=True)
    assert feats["is_https"] == 0
    assert feats["suspicious_tld"] == 1
    assert feats["has_suspicious_keyword"] == 1
    assert feats["fake_domain_pattern"] == 1

def test_ip_address_features():
    url = "http://192.168.1.1/login.php"
    feats = FeatureExtractor.extract_features(url, offline=True)
    assert feats["is_ip_address"] == 1
    assert feats["is_https"] == 0
    assert feats["has_suspicious_keyword"] == 1

def test_shannon_entropy():
    entropy_simple = FeatureExtractor.calculate_entropy("aaaa")
    entropy_complex = FeatureExtractor.calculate_entropy("a1b2c3d4e5!@#$")
    assert entropy_complex > entropy_simple
