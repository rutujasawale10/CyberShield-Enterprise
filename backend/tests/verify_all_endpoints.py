import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_verification():
    print("==================================================")
    print("STARTING COMPLETE BACKEND API AUDIT & VERIFICATION")
    print("==================================================\n")

    results = []

    def record(name, endpoint, method, req_body, expected_status, res):
        status_ok = res.status_code == expected_status
        result_str = "PASS" if status_ok else "FAIL"
        results.append({
            "name": name,
            "endpoint": endpoint,
            "method": method,
            "req_body": req_body,
            "status_code": res.status_code,
            "expected_status": expected_status,
            "response_snippet": str(res.json())[:200] if res.headers.get("content-type", "").startswith("application/json") else f"[{res.headers.get('content-type')}] size={len(res.content)}b",
            "result": result_str
        })
        print(f"[{result_str}] {method} {endpoint} -> Status {res.status_code} (Expected {expected_status})")

    # 1. System Endpoints
    record("Health Check", "/", "GET", None, 200, client.get("/"))
    record("Health Check /health", "/health", "GET", None, 200, client.get("/health"))
    record("Prometheus Metrics", "/metrics", "GET", None, 200, client.get("/metrics"))
    record("Swagger Docs", "/docs", "GET", None, 200, client.get("/docs"))
    record("OpenAPI Spec", "/openapi.json", "GET", None, 200, client.get("/openapi.json"))

    # 2. Authentication
    # Login Admin
    login_res = client.post("/api/auth/login", data={"username": "admin@cybershield.com", "password": "Admin@123"})
    record("Auth Admin Login", "/api/auth/login", "POST", "form-data: username=admin@cybershield.com", 200, login_res)
    
    admin_token = ""
    if login_res.status_code == 200:
        admin_token = login_res.json()["access_token"]
    
    admin_headers = {"Authorization": f"Bearer {admin_token}"} if admin_token else {}

    # Register New User
    import time
    test_email = f"analyst_{int(time.time())}@cybershield.com"
    reg_res = client.post("/api/auth/register", json={"email": test_email, "password": "TestPassword123!", "full_name": "Test Analyst"})
    record("Auth Register", "/api/auth/register", "POST", {"email": test_email}, 200, reg_res)

    user_token = ""
    if reg_res.status_code == 200:
        user_token = reg_res.json()["access_token"]
    user_headers = {"Authorization": f"Bearer {user_token}"} if user_token else {}

    # Register Duplicate Email
    dup_res = client.post("/api/auth/register", json={"email": "admin@cybershield.com", "password": "TestPassword123!", "full_name": "Duplicate Admin"})
    record("Auth Register Duplicate Error", "/api/auth/register", "POST", {"email": "admin@cybershield.com"}, 400, dup_res)

    # Auth Me (Current User)
    record("Auth Get Me (Admin)", "/api/auth/me", "GET", None, 200, client.get("/api/auth/me", headers=admin_headers))
    record("Auth Get Me (Unauthenticated)", "/api/auth/me", "GET", None, 401, client.get("/api/auth/me"))

    # 3. URL Scanner
    single_scan_res = client.post("/api/scan", json={"url": "http://amaz0n-login.xyz"})
    record("Scan Single Phishing URL", "/api/scan", "POST", {"url": "http://amaz0n-login.xyz"}, 200, single_scan_res)
    scan_id = single_scan_res.json().get("id", 1) if single_scan_res.status_code == 200 else 1

    record("Scan Single Safe URL", "/api/scan", "POST", {"url": "https://google.com"}, 200, client.post("/api/scan", json={"url": "https://google.com"}))
    record("Scan Empty URL Error", "/api/scan", "POST", {"url": ""}, 400, client.post("/api/scan", json={"url": ""}))

    # 4. Batch Scanner
    batch_res = client.post("/api/scan/batch", json={"urls": ["http://amaz0n-login.xyz", "https://google.com"]})
    record("Scan Batch URLs", "/api/scan/batch", "POST", {"urls": ["amaz0n...", "google..."]}, 200, batch_res)
    record("Scan Batch Empty Error", "/api/scan/batch", "POST", {"urls": []}, 400, client.post("/api/scan/batch", json={"urls": []}))

    # 5. Threat Intelligence
    record("Get Threat Intel Feed", "/api/threat-intel", "GET", None, 200, client.get("/api/threat-intel"))
    
    test_domain = f"malicious-domain-{int(time.time())}.xyz"
    record("Add Threat Intel Domain (Admin)", "/api/threat-intel/add", "POST", {"domain": test_domain}, 200, client.post("/api/threat-intel/add", json={"domain": test_domain}, headers=admin_headers))
    record("Add Threat Intel Domain (Forbidden User)", "/api/threat-intel/add", "POST", {"domain": "bad.xyz"}, 403, client.post("/api/threat-intel/add", json={"domain": "bad.xyz"}, headers=user_headers))

    # 6. Reports
    record("Generate PDF Report by ID", f"/api/report/pdf/{scan_id}", "GET", None, 200, client.get(f"/api/report/pdf/{scan_id}"))
    record("Generate PDF Direct", "/api/report/pdf/direct", "POST", {"url": "http://amaz0n-login.xyz"}, 200, client.post("/api/report/pdf/direct", json={"url": "http://amaz0n-login.xyz"}))
    record("Export Report CSV", "/api/report/csv", "GET", None, 200, client.get("/api/report/csv"))

    # 7. Audit Logs / History
    record("Get Scan History", "/api/history", "GET", None, 200, client.get("/api/history"))
    record("Get Filtered Scan History", "/api/history?status_filter=Phishing", "GET", None, 200, client.get("/api/history?status_filter=Phishing"))
    record("Export Scan History CSV", "/api/history/export/csv", "GET", None, 200, client.get("/api/history/export/csv"))

    # 8. SOC Dashboard & Stats
    record("Get SOC Stats", "/api/stats", "GET", None, 200, client.get("/api/stats"))
    record("Get Model Benchmarks", "/api/stats/models", "GET", None, 200, client.get("/api/stats/models"))

    # 9. Admin APIs
    record("Admin Get All Users", "/api/admin/users", "GET", None, 200, client.get("/api/admin/users", headers=admin_headers))
    record("Admin Get Users (Forbidden)", "/api/admin/users", "GET", None, 403, client.get("/api/admin/users", headers=user_headers))
    record("Admin Update Role", "/api/admin/users/1/role?new_role=Admin", "PUT", None, 200, client.put("/api/admin/users/1/role?new_role=Admin", headers=admin_headers))
    record("Admin Update Role Invalid", "/api/admin/users/1/role?new_role=SuperGod", "PUT", None, 400, client.put("/api/admin/users/1/role?new_role=SuperGod", headers=admin_headers))
    record("Admin Clear Logs", "/api/admin/clear-logs", "DELETE", None, 200, client.delete("/api/admin/clear-logs", headers=admin_headers))

    print("\n==================================================")
    print("VERIFICATION COMPLETE")
    print("==================================================")

    total = len(results)
    passed = sum(1 for r in results if r["result"] == "PASS")
    failed = total - passed
    print(f"Total Tests Run: {total} | PASSED: {passed} | FAILED: {failed}\n")

    with open("backend_verification_summary.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    run_verification()
