# Project Presentation & Live Demo Script
## Subject: CyberShield Enterprise SOC Platform

---

## 🎭 Step-by-Step Live Demonstration Script

### Step 1: Login & Role Authentication
1. Open the React Dashboard at `http://localhost:5173`.
2. Click **SOC Sign In** in top-right navbar.
3. Click **Auto-fill Demo Admin** (`admin@cybershield.com` / `Admin@123`) and click **Sign In**.
4. Highlight the **Admin** role badge in top-right navbar.

---

### Step 2: Single URL Phishing Scan & Explainable AI (XAI)
1. Click on **URL Scanner** tab.
2. Click sample pill **Fake Amazon** (`http://amaz0n-login.xyz`) or type it in.
3. Click **Analyze Target URL**.
4. *Demonstrate Results*:
   - **Status Badge**: `❌ Phishing Website` (Red glow pulse).
   - **Risk Gauge**: **94.0%** Risk Score with **98.5% AI Confidence**.
   - **Detection Reasons Checklist**: Highlight `Fake domain pattern`, `Login keyword`, `Insecure HTTP`, `.xyz TLD`.
   - **Explainable AI (XAI) Attribution**: Explain feature weights chart (`Typosquatting: 32.5%`, `IP Address: 24.0%`).
   - **Threat Intelligence Card**: Show VirusTotal engines count and Google Safe Browsing flag.

---

### Step 3: PDF Security Audit Report Generation
1. Click **Download PDF Audit Report**.
2. Open the downloaded PDF (`CyberShield_Security_Audit_Report.pdf`).
3. Point out the Executive Summary, Target Domain, Classification, XAI Attribution table, Threat Intel hits, and Remediation Steps.

---

### Step 4: Executive SOC Dashboard & Geographic Threat Map
1. Click on **SOC Dashboard** tab.
2. Show **Live Threat Counter** (Total scans, Phishing attacks blocked, Safe domains verified).
3. Point out **High-Risk Intercepted Targets** table.
4. Demonstrate **Geographic Threat Distribution Map** (Russia, US, China, Brazil, India nodes).

---

### Step 5: Multi-Model AI Benchmarks View
1. Click on **AI Benchmarks** tab.
2. Show performance metrics comparison table comparing **Random Forest**, **Gradient Boosting (XGBoost Alt)**, **Extra Trees**, **Decision Tree**, and **Logistic Regression**.
3. Point out F1-Score and ROC-AUC metrics.

---

### Step 6: Admin Console & User Governance
1. Click on **Admin Console** tab.
2. Show registered users list (`User RBAC Governance`).
3. Demonstrate changing a user's role from `User` to `Analyst` or `Admin`.
4. Demonstrate adding a domain to the Threat Intelligence database feed.
