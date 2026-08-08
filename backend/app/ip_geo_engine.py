import re
import ipaddress
import socket
import requests
from urllib.parse import urlparse, unquote
import tldextract
from app.config import (
    IP_GEOLOCATION_API_KEY,
    SUSPICIOUS_KEYWORDS,
    HIGH_RISK_TLDS,
    KNOWN_URL_SHORTENERS
)

# Core Target Brands for Subdomain & Typosquatting Analysis
TARGET_BRANDS = [
    "amazon", "paypal", "paytm", "google", "apple", "microsoft", "netflix",
    "facebook", "statebank", "sbi", "binance", "metamask", "coinbase", "instagram", "bankofamerica"
]

SENSITIVE_AUTH_PATHS = [
    "login", "verify", "account", "banking", "password", "payment",
    "security", "authentication", "wallet", "update", "signin", "auth",
    "confirm", "checkpoint", "passcode", "credential"
]

class IPGeoEngine:
    """
    Advanced URL Identity, Raw IP Hosting & Country Anomaly Detection Engine.
    Evaluates:
    1. IP-hosted URLs (IPv4, IPv6, Localhost, Private IP, Numeric Obfuscation)
    2. Domain & Hostname Manipulation (Subdomains, Brand in Subdomain, Typosquatting, @ Redirects)
    3. Root / Registered Domain Analysis
    4. Geolocation & ASN Network Intelligence with Graceful Fallback
    5. Supporting Country Anomaly Signals
    """

    @staticmethod
    def parse_url_components(raw_url: str) -> dict:
        """Parses URL into scheme, hostname, port, root domain, subdomain, path, query, fragment."""
        url = raw_url.strip()
        if not url.startswith(("http://", "https://")):
            url = "http://" + url

        parsed = urlparse(url)
        extracted = tldextract.extract(url)

        netloc = parsed.netloc
        if "@" in netloc:
            host_part = netloc.split("@")[-1]
        else:
            host_part = netloc

        if host_part.startswith("["):
            closing_bracket = host_part.find("]")
            if closing_bracket != -1:
                hostname = host_part[:closing_bracket+1]
                port_str = host_part[closing_bracket+1:]
                port = int(port_str.lstrip(":")) if port_str.startswith(":") and port_str[1:].isdigit() else parsed.port
            else:
                hostname = host_part
                port = parsed.port
        else:
            hostname = host_part.split(":")[0]
            port = parsed.port

        registered_domain = f"{extracted.domain}.{extracted.suffix}" if (extracted.domain and extracted.suffix) else (extracted.domain or None)
        subdomain = extracted.subdomain if extracted.subdomain else None

        return {
            "scheme": parsed.scheme,
            "hostname": hostname,
            "port": port,
            "registered_domain": registered_domain,
            "subdomain": subdomain,
            "path": parsed.path or "/",
            "query": parsed.query,
            "fragment": parsed.fragment,
            "netloc": parsed.netloc,
            "normalized_url": url
        }

    @staticmethod
    def classify_host(hostname: str) -> dict:
        """
        Classifies hostname into:
        IPv4, IPv6, LOCALHOST, PRIVATE_IP, SUSPICIOUS_NUMERIC, or DOMAIN.
        """
        clean_host = hostname.strip().strip("[]")
        
        # 1. Localhost check
        if clean_host.lower() == "localhost" or clean_host == "127.0.0.1" or clean_host == "::1":
            return {
                "host_type": "LOCALHOST",
                "is_ip_host": True,
                "is_ipv4": clean_host == "127.0.0.1",
                "is_ipv6": clean_host == "::1",
                "is_private_ip": True,
                "is_localhost": True,
                "ip_address": clean_host
            }

        # 2. Check standard IPv4 / IPv6 via ipaddress module
        try:
            ip_obj = ipaddress.ip_address(clean_host)
            is_v4 = isinstance(ip_obj, ipaddress.IPv4Address)
            is_v6 = isinstance(ip_obj, ipaddress.IPv6Address)
            is_priv = ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_reserved or ip_obj.is_link_local

            return {
                "host_type": "PRIVATE_IP" if is_priv else ("IPv4" if is_v4 else "IPv6"),
                "is_ip_host": True,
                "is_ipv4": is_v4,
                "is_ipv6": is_v6,
                "is_private_ip": is_priv,
                "is_localhost": ip_obj.is_loopback,
                "ip_address": str(ip_obj)
            }
        except ValueError:
            pass

        # 3. Numeric Obfuscation / Numeric Hostname check
        # Handles hex (0x7f.0.0.1, 0x7f000001), octal (0300.0250.0154.0231), dword (2886730000)
        is_numeric_host = bool(re.match(r"^(0x[0-9a-fA-F]+|\d+)(\.(0x[0-9a-fA-F]+|\d+)){0,3}$", clean_host, re.IGNORECASE))
        if is_numeric_host:
            return {
                "host_type": "SUSPICIOUS_NUMERIC",
                "is_ip_host": True,
                "is_ipv4": True,
                "is_ipv6": False,
                "is_private_ip": False,
                "is_localhost": False,
                "ip_address": clean_host
            }

        # 4. Normal registered domain
        return {
            "host_type": "DOMAIN",
            "is_ip_host": False,
            "is_ipv4": False,
            "is_ipv6": False,
            "is_private_ip": False,
            "is_localhost": False,
            "ip_address": None
        }

    @classmethod
    def analyze_url_identity(cls, raw_url: str, offline: bool = True) -> dict:
        """
        Main entry point for URL identity, IP hosting analysis, domain manipulation,
        and country anomaly detection.
        """
        parsed_comp = cls.parse_url_components(raw_url)
        host_info = cls.classify_host(parsed_comp["hostname"])

        url_path_query = (parsed_comp["path"] + " " + parsed_comp["query"]).lower()
        has_auth_path = any(kw in url_path_query for kw in SENSITIVE_AUTH_PATHS)

        # Calculate IP-based host score
        ip_based_host_score = 0.0
        if host_info["is_ip_host"]:
            if host_info["is_localhost"] or host_info["is_private_ip"]:
                ip_based_host_score = 20.0 if not has_auth_path else 45.0
            elif host_info["host_type"] == "SUSPICIOUS_NUMERIC":
                ip_based_host_score = 85.0
            else:
                # Public IP host
                ip_based_host_score = 75.0 if has_auth_path else 55.0

        # Domain Manipulation Analysis
        hostname = parsed_comp["hostname"].lower()
        subdomain = (parsed_comp["subdomain"] or "").lower()
        reg_domain = (parsed_comp["registered_domain"] or "").lower()
        path = parsed_comp["path"].lower()
        query = parsed_comp["query"].lower()

        subdomain_list = [s for s in subdomain.split(".") if s]
        subdomain_count = len(subdomain_list)
        excessive_subdomains = subdomain_count >= 3
        hostname_length = len(hostname)
        long_hostname = hostname_length > 45
        hyphen_count = hostname.count("-")
        suspicious_hyphens = hyphen_count >= 2

        digit_count = sum(1 for c in hostname if c.isdigit())
        digit_ratio = round(digit_count / max(1, len(hostname)), 3)
        numeric_heavy_domain = digit_ratio > 0.3 and not host_info["is_ip_host"]

        # Brand in subdomain / domain spoofing check
        brand_in_subdomain = False
        impersonated_brand = None
        for brand in TARGET_BRANDS:
            if brand in hostname:
                root_name = reg_domain.split(".")[0].lower() if reg_domain else ""
                if root_name != brand:
                    brand_in_subdomain = True
                    impersonated_brand = brand
                    break

        # Homoglyph / Punycode
        has_punycode = "xn--" in hostname
        has_encoded_hostname = "%" in parsed_comp["netloc"]
        has_at_symbol = "@" in parsed_comp["netloc"]
        has_unusual_port = parsed_comp["port"] is not None and parsed_comp["port"] not in [80, 443]

        # Path depth & query parameters
        path_depth = len([p for p in path.split("/") if p])
        excessive_path_depth = path_depth > 4
        query_parameter_count = len(query.split("&")) if query else 0
        suspicious_query = any(k in query for k in ["cmd=", "login=", "account=", "token=", "redirect=", "auth="])

        # Calculate Domain Anomaly Score (0 - 100)
        anomaly_points = 0
        if brand_in_subdomain: anomaly_points += 40
        if excessive_subdomains: anomaly_points += 20
        if suspicious_hyphens: anomaly_points += 15
        if has_punycode: anomaly_points += 30
        if has_at_symbol: anomaly_points += 35
        if has_unusual_port: anomaly_points += 20
        if numeric_heavy_domain: anomaly_points += 15
        if has_encoded_hostname: anomaly_points += 20
        domain_anomaly_score = float(min(100, anomaly_points))

        # Geolocation & Network Intelligence
        geo_info = cls.fetch_geolocation(
            host_info=host_info,
            hostname=hostname,
            offline=offline
        )

        # Country Anomaly Detection (Supporting Signal ONLY)
        geo_anomaly = False
        country_code = geo_info.get("country_code")
        
        if host_info["is_ip_host"] and not host_info["is_private_ip"] and has_auth_path:
            geo_anomaly = True
        elif (domain_anomaly_score >= 40 or brand_in_subdomain) and country_code in ["RU", "CN", "RO", "NG", "KP", "IR"]:
            geo_anomaly = True

        # IP Reputation
        if host_info["is_ip_host"] and has_auth_path:
            ip_reputation = "HIGH"
        elif host_info["is_ip_host"]:
            ip_reputation = "MEDIUM"
        elif geo_info.get("ip_address"):
            ip_reputation = "LOW"
        else:
            ip_reputation = "UNKNOWN"

        # Construct specific reasons
        identity_reasons = []
        if host_info["is_ip_host"]:
            if host_info["is_localhost"]:
                identity_reasons.append("URL hosted on Localhost (Loopback Address)")
            elif host_info["is_private_ip"]:
                identity_reasons.append("URL hosted on Private/Internal RFC1918 IP address")
            elif host_info["host_type"] == "SUSPICIOUS_NUMERIC":
                identity_reasons.append("URL uses obfuscated numeric IP hostname structure")
            else:
                identity_reasons.append(f"URL hosted directly on Raw Public IP address ({host_info['ip_address']})")
            
            if has_auth_path:
                identity_reasons.append("IP-hosted URL targets sensitive authentication / login path")

        if brand_in_subdomain and impersonated_brand:
            identity_reasons.append(f"Brand spoofing detected: '{impersonated_brand}' targeted in subdomain of external domain")
        if excessive_subdomains:
            identity_reasons.append(f"Excessive subdomain nesting detected ({subdomain_count} subdomains)")
        if has_at_symbol:
            identity_reasons.append("URL contains '@' userinfo redirection symbol")
        if has_unusual_port:
            identity_reasons.append(f"Non-standard HTTP port requested: {parsed_comp['port']}")
        if has_punycode:
            identity_reasons.append("Punycode (xn--) IDN homograph domain detected")

        return {
            "parsed_components": parsed_comp,
            "host_info": host_info,
            "has_auth_path": has_auth_path,
            "ip_based_host_score": ip_based_host_score,
            "domain_anomaly_score": domain_anomaly_score,
            "brand_in_subdomain": brand_in_subdomain,
            "impersonated_brand": impersonated_brand,
            "excessive_subdomains": excessive_subdomains,
            "subdomain_count": subdomain_count,
            "long_hostname": long_hostname,
            "suspicious_hyphens": suspicious_hyphens,
            "numeric_heavy_domain": numeric_heavy_domain,
            "digit_ratio": digit_ratio,
            "has_punycode": has_punycode,
            "has_encoded_hostname": has_encoded_hostname,
            "has_at_symbol": has_at_symbol,
            "has_unusual_port": has_unusual_port,
            "path_depth": path_depth,
            "excessive_path_depth": excessive_path_depth,
            "query_parameter_count": query_parameter_count,
            "suspicious_query": suspicious_query,
            "geo_info": geo_info,
            "geo_anomaly": geo_anomaly,
            "ip_reputation": ip_reputation,
            "identity_reasons": identity_reasons
        }

    @classmethod
    def fetch_geolocation(cls, host_info: dict, hostname: str, offline: bool = True) -> dict:
        """
        Graceful Geolocation Lookup.
        Supports external API key or public IP resolution with fast timeout.
        If offline, unconfigured, or network error occurs, gracefully returns 'Unknown'.
        """
        default_geo = {
            "country": "Unknown",
            "country_code": None,
            "continent": "Unknown",
            "asn": "Unknown",
            "isp": "Unknown",
            "ip_address": host_info.get("ip_address")
        }

        if host_info["is_localhost"]:
            default_geo["country"] = "Local Host"
            default_geo["country_code"] = "LOCAL"
            default_geo["isp"] = "Loopback Interface"
            return default_geo

        if host_info["is_private_ip"]:
            default_geo["country"] = "Private Network"
            default_geo["country_code"] = "PRIV"
            default_geo["isp"] = "Internal Intranet"
            return default_geo

        if offline:
            return default_geo

        target_ip = host_info.get("ip_address")
        if not target_ip:
            try:
                target_ip = socket.gethostbyname(hostname)
                default_geo["ip_address"] = target_ip
            except Exception:
                return default_geo

        try:
            if IP_GEOLOCATION_API_KEY:
                url = f"https://api.ipgeolocation.io/ipgeo?apiKey={IP_GEOLOCATION_API_KEY}&ip={target_ip}"
                res = requests.get(url, timeout=2.0)
                if res.status_code == 200:
                    data = res.json()
                    return {
                        "country": data.get("country_name", "Unknown"),
                        "country_code": data.get("country_code2", None),
                        "continent": data.get("continent_name", "Unknown"),
                        "asn": data.get("asn", "Unknown"),
                        "isp": data.get("isp", "Unknown"),
                        "ip_address": target_ip
                    }
            else:
                url = f"http://ip-api.com/json/{target_ip}?fields=status,country,countryCode,continent,asn,isp"
                res = requests.get(url, timeout=1.5)
                if res.status_code == 200:
                    data = res.json()
                    if data.get("status") == "success":
                        return {
                            "country": data.get("country", "Unknown"),
                            "country_code": data.get("countryCode", None),
                            "continent": data.get("continent", "Unknown"),
                            "asn": data.get("asn", "Unknown"),
                            "isp": data.get("isp", "Unknown"),
                            "ip_address": target_ip
                        }
        except Exception:
            pass

        return default_geo
