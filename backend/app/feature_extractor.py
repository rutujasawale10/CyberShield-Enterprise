import re
import math
import socket
from urllib.parse import urlparse
import tldextract
from app.config import SUSPICIOUS_KEYWORDS, HIGH_RISK_TLDS, KNOWN_URL_SHORTENERS
from app.advanced_analyzer import AdvancedURLAnalyzer

class FeatureExtractor:
    """
    Enterprise Feature Extraction Engine for Phishing & Cyber Threat Detection.
    Extracts 40+ lexical, structural, host, DOM, obfuscation, homograph, and mail security parameters.
    """

    @staticmethod
    def calculate_entropy(text: str) -> float:
        """Calculates Shannon Entropy of a string to detect randomness/obfuscation."""
        if not text:
            return 0.0
        prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
        entropy = -sum([p * math.log(p) / math.log(2.0) for p in prob])
        return round(entropy, 4)

    @staticmethod
    def levenshtein_distance(s1: str, s2: str) -> int:
        """Calculates Levenshtein distance between two strings for typosquatting detection."""
        if len(s1) < len(s2):
            return FeatureExtractor.levenshtein_distance(s2, s1)
        if len(s2) == 0:
            return len(s1)

        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        return previous_row[-1]

    @staticmethod
    def normalize_url(url: str) -> str:
        """Ensures URL has a proper scheme prefix."""
        url = url.strip()
        if not url.startswith(("http://", "https://")):
            url = "http://" + url
        return url

    @classmethod
    def extract_features(cls, raw_url: str, offline: bool = True) -> dict:
        url = cls.normalize_url(raw_url)
        parsed = urlparse(url)
        extracted = tldextract.extract(url)

        hostname = parsed.netloc.split(":")[0]  # strip port if present
        domain = f"{extracted.domain}.{extracted.suffix}" if extracted.suffix else extracted.domain

        # 1. Lexical Features
        url_length = len(url)
        hostname_length = len(hostname)
        count_dots = url.count(".")
        count_hyphens = url.count("-")
        count_at = url.count("@")
        count_question = url.count("?")
        count_percent = url.count("%")
        count_equal = url.count("=")
        count_slash = url.count("/")

        digits_in_url = len(re.findall(r"\d", url))
        digits_in_hostname = len(re.findall(r"\d", hostname))

        # Subdomain count
        subdomains = extracted.subdomain.split(".") if extracted.subdomain else []
        count_subdomains = len([s for s in subdomains if s])

        # IP Address check
        ip_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
        is_ip_address = 1 if re.match(ip_pattern, hostname) else 0

        # Shannon Entropy
        url_entropy = cls.calculate_entropy(url)
        hostname_entropy = cls.calculate_entropy(hostname)

        # 2. Suspicious Keywords Check
        found_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in url.lower()]
        has_suspicious_keyword = 1 if len(found_keywords) > 0 else 0
        suspicious_keyword_count = len(found_keywords)

        # 3. Protocol & TLD checks
        is_https = 1 if parsed.scheme == "https" else 0
        tld = f".{extracted.suffix.lower()}" if extracted.suffix else ""
        suspicious_tld = 1 if tld in HIGH_RISK_TLDS else 0
        is_shortened = 1 if hostname.lower() in KNOWN_URL_SHORTENERS else 0
        has_non_standard_port = 1 if parsed.port and parsed.port not in [80, 443] else 0

        # 4. Advanced Threat Features: Homograph & Typosquatting
        is_homograph_attack = 1 if "xn--" in hostname.lower() else 0

        target_brands = ["amazon", "paypal", "paytm", "google", "apple", "microsoft", "netflix", "facebook", "statebank", "sbi"]
        typosquatting_detected = 0
        for brand in target_brands:
            dist = cls.levenshtein_distance(extracted.domain.lower(), brand)
            if 1 <= dist <= 2 and extracted.domain.lower() != brand:
                typosquatting_detected = 1
                break

        fake_brand_patterns = [
            r"amaz[0o]n", r"paytm", r"statebank", r"sbi", r"paypal", r"google", r"apple",
            r"microsoft", r"netflix", r"facebook", r"instagram", r"bankofamerica"
        ]
        has_brand = any(re.search(pat, hostname.lower()) for pat in fake_brand_patterns)
        has_hyphen_in_domain = "-" in extracted.domain
        fake_domain_pattern = 1 if (has_brand and (has_hyphen_in_domain or suspicious_tld or is_shortened or "login" in hostname.lower() or "secure" in hostname.lower() or "0" in hostname)) else 0

        # 5. Advanced 40+ Deep Threat Analyzer
        deep_analysis = AdvancedURLAnalyzer.analyze_deep_threats(raw_url, domain, hostname)

        has_js_obfuscation = 1 if any(tok in url.lower() for tok in ["eval(", "unescape(", "%3cscript", "base64"]) else 0
        is_blacklisted = 1 if (fake_domain_pattern or typosquatting_detected or is_homograph_attack or (count_hyphens > 2 and has_suspicious_keyword)) else 0

        # 6. Domain Resolution Check (Fast DNS check - ONLY if offline=False)
        dns_resolves = 1
        if not offline:
            try:
                socket.gethostbyname(hostname)
            except Exception:
                dns_resolves = 0

        # 7. Advanced URL Identity, IP Hosting & Country Anomaly Analysis
        from app.ip_geo_engine import IPGeoEngine
        identity_analysis = IPGeoEngine.analyze_url_identity(raw_url, offline=offline)
        host_info = identity_analysis["host_info"]

        # Ensure is_ip_address flags all IP hosts (IPv4, IPv6, Numeric, etc.)
        if host_info["is_ip_host"]:
            is_ip_address = 1

        features = {
            "raw_url": raw_url,
            "normalized_url": url,
            "domain": domain,
            "hostname": hostname,
            "url_length": url_length,
            "hostname_length": hostname_length,
            "count_dots": count_dots,
            "count_hyphens": count_hyphens,
            "count_at": count_at,
            "count_question": count_question,
            "count_percent": count_percent,
            "count_equal": count_equal,
            "count_slash": count_slash,
            "count_digits": digits_in_url,
            "digits_in_hostname": digits_in_hostname,
            "count_subdomains": count_subdomains,
            "is_ip_address": is_ip_address,
            "url_entropy": url_entropy,
            "hostname_entropy": hostname_entropy,
            "has_suspicious_keyword": has_suspicious_keyword,
            "suspicious_keyword_count": suspicious_keyword_count,
            "found_keywords": found_keywords,
            "is_https": is_https,
            "suspicious_tld": suspicious_tld,
            "is_shortened": is_shortened,
            "has_non_standard_port": has_non_standard_port,
            "fake_domain_pattern": fake_domain_pattern,
            "is_homograph_attack": is_homograph_attack,
            "typosquatting_detected": typosquatting_detected,
            "has_js_obfuscation": has_js_obfuscation,
            "is_blacklisted": is_blacklisted,
            "dns_resolves": dns_resolves,
            "deep_analysis": deep_analysis,

            # Extended v3.0 URL Identity & Geolocation Intelligence Features
            "identity_analysis": identity_analysis,
            "host_type": host_info["host_type"],
            "is_ip_host": host_info["is_ip_host"],
            "is_ipv4": host_info["is_ipv4"],
            "is_ipv6": host_info["is_ipv6"],
            "is_private_ip": host_info["is_private_ip"],
            "is_localhost": host_info["is_localhost"],
            "ip_based_host_score": identity_analysis["ip_based_host_score"],
            "domain_anomaly_score": identity_analysis["domain_anomaly_score"],
            "registered_domain": identity_analysis["parsed_components"]["registered_domain"],
            "subdomain": identity_analysis["parsed_components"]["subdomain"],
            "geo_info": identity_analysis["geo_info"],
            "geo_anomaly": identity_analysis["geo_anomaly"],
            "ip_reputation": identity_analysis["ip_reputation"],
            "identity_reasons": identity_analysis["identity_reasons"]
        }
        return features

    @classmethod
    def get_ml_feature_vector(cls, features: dict) -> list:
        return [
            features["url_length"],
            features["hostname_length"],
            features["count_dots"],
            features["count_hyphens"],
            features["count_at"],
            features["count_question"],
            features["count_percent"],
            features["count_equal"],
            features["count_slash"],
            features["count_digits"],
            features["digits_in_hostname"],
            features["count_subdomains"],
            features["is_ip_address"],
            features["url_entropy"],
            features["hostname_entropy"],
            features["has_suspicious_keyword"],
            features["suspicious_keyword_count"],
            features["is_https"],
            features["suspicious_tld"],
            features["is_shortened"],
            features["has_non_standard_port"],
            features["fake_domain_pattern"],
            features["is_homograph_attack"],
            features["typosquatting_detected"],
            features["has_js_obfuscation"],
            features["is_blacklisted"],
            features["dns_resolves"]
        ]

    @classmethod
    def get_feature_names(cls) -> list:
        return [
            "url_length", "hostname_length", "count_dots", "count_hyphens",
            "count_at", "count_question", "count_percent", "count_equal",
            "count_slash", "count_digits", "digits_in_hostname", "count_subdomains",
            "is_ip_address", "url_entropy", "hostname_entropy", "has_suspicious_keyword",
            "suspicious_keyword_count", "is_https", "suspicious_tld", "is_shortened",
            "has_non_standard_port", "fake_domain_pattern", "is_homograph_attack",
            "typosquatting_detected", "has_js_obfuscation", "is_blacklisted", "dns_resolves"
        ]
