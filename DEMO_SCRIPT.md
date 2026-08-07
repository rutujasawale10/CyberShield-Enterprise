# CyberShield Enterprise - College Mini-Project Demonstration Script

Use this step-by-step presentation walkthrough for live evaluations and project defense demonstrations.

---

## 🕒 Step 1: Introduction & Overview (1 Minute)
- **Presenter Statement**: *"CyberShield Enterprise is a real-time AI-powered phishing threat detection and SOC governance platform. It combines machine learning classifiers (Random Forest ensemble), Explainable AI (XAI) feature attribution, 15+ threat intelligence feeds, and automated PDF audit report generation."*

---

## 🔍 Step 2: Real-Time URL Scanning & XAI Demo (2 Minutes)
1. Open `http://localhost:5173`.
2. Click the sample pill **Fake Amazon** (`http://amaz0n-login.xyz`).
3. Click **Analyze Target URL**.
4. Point out the real-time results:
   - **Risk Score Gauge**: Shows high risk (e.g. `88% Risk Score`).
   - **Explainable AI (XAI) Attribution**: Highlights top security signals (Typosquatting brand pattern, raw IP hosting, high URL string entropy).
   - **Multi-Source Threat Intelligence**: Displays VirusTotal, Google Safe Browsing, PhishTank, and OpenPhish status.
5. Click **Download PDF Audit Report** to demonstrate ReportLab PDF generation.

---

## 📊 Step 3: SOC Analytics & MITRE ATT&CK Matrix (2 Minutes)
1. Click **SOC Dashboard** in the top navigation bar.
2. Highlight:
   - Real-time stat cards (Total scans, phishing caught, safe verified, avg threat index).
   - **High-Risk Target Table** displaying intercepted domain targets.
   - **MITRE ATT&CK Threat Matrix** mapping phishing techniques to Tactic IDs (T1566.002, T1583.001, T1036).
   - **Geographic Threat Distribution Map**.

---

## ⚡ Step 4: Batch Scanner & Audit History (1.5 Minutes)
1. Click **Batch Scanner**. Show input box with multiple URLs and click **Execute Batch Scan**. Point out simultaneous multi-URL evaluation.
2. Click **Audit Logs**. Show status filter tabs (**All**, **Phishing**, **Safe**, **Suspicious**) and click **Export Audit CSV**.

---

## 🔐 Step 5: RBAC Security Governance & Admin Console (1.5 Minutes)
1. Click **Admin Console** while unauthenticated (shows locked restriction banner).
2. Click **SOC Sign In** on the navbar, click **Auto-fill Demo Admin**, and click **Sign In to SOC**.
3. Point out toast notification: `Authenticated as admin@cybershield.com (Admin)`.
4. Demonstrate Admin Controls:
   - Change user role from dropdown -> Toast feedback `Role updated to Analyst`.
   - Add new malicious domain to Threat Intelligence feed -> Toast feedback `Domain added`.
   - Flush audit logs -> Shows clear record feedback.

---

## 🏆 Step 6: Multi-Model AI Benchmarks & Security Tools (1 Minute)
1. Click **AI Benchmarks** -> Show performance comparison table (Random Forest vs XGBoost vs Decision Tree vs Logistic Regression).
2. Click **Security Tools** -> Demonstrate interactive **CVSS v3.1 Severity Score Calculator** and **CVE Lookup**.
