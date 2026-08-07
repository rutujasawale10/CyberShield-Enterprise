# 🛡️ CyberShield Enterprise - AI-Powered Threat Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-2.0.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Docker](https://img.shields.io/badge/Docker-24.0+-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![JWT Auth](https://img.shields.io/badge/JWT-RBAC_Secured-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

Enterprise-grade **AI-Powered Phishing Threat Detection & SOC Governance Platform**. Combines 25+ real-time security feature extractions, Explainable AI (XAI) feature attribution, a multi-model ML benchmark suite (Random Forest, Gradient Boosting, Extra Trees, Decision Tree, Logistic Regression), multi-source threat intelligence integrations (VirusTotal v3, Google Safe Browsing v4, PhishTank, OpenPhish), PDF security report generation, and JWT Role-Based Access Control (RBAC).

---

## 🌟 Key Features

- ⚡ **25+ Parameter Feature Extractor**: Homograph / Punycode (`xn--`), Levenshtein Typosquatting distance, Shannon Entropy, HTTPS, Raw IP hosting, `@` redirection, URL shorteners, hidden forms, JS obfuscation (`eval`, base64), hidden IFrames, and popup triggers.
- 🧠 **Explainable AI (XAI) Engine**: Calculates exact percentage contribution of top security parameters to the risk score.
- 🤖 **Multi-Model Benchmark Suite**: Automatically trains and evaluates Random Forest, Gradient Boosting (XGBoost Alt), Extra Trees, Decision Tree, and Logistic Regression models.
- 📡 **Multi-Source Threat Intelligence**: Queries VirusTotal API v3, Google Safe Browsing API v4, PhishTank, and OpenPhish with an Intelligent Mock Engine fallback.
- 📄 **ReportLab PDF Security Audit Reports**: 1-click formal PDF security audit report generation complete with executive summary, XAI attribution tables, and mitigation recommendations.
- 🔐 **JWT Authentication & RBAC Governance**: User roles (`Admin`, `Analyst`, `User`) with auto-seeded default admin account (`admin@cybershield.com` / `Admin@123`).
- 📊 **Executive SOC Dashboard & Geo Threat Map**: Live threat counter, high-risk targets list, detection timeline, risk pie charts, and interactive Geographic Threat Distribution Map.
- 🧩 **Chrome Extension (Manifest V3)**: Auto background scanning, warning alerts, and dangerous site blocking.
- 🐳 **Docker Containerization**: Includes `Dockerfile` and `docker-compose.yml`.

---

## 🏗️ Enterprise System Architecture

```text
PHISHING WEBSITE DETECTION SYSTEM/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI REST app with CORS, Rate Limiting & Auth
│   │   ├── config.py                   # JWT Secret, API Keys, Thresholds, & Model Paths
│   │   ├── database.py                 # SQLAlchemy session & seed initializer
│   │   ├── models.py                   # ORM Models (User, ScanLog, ThreatFeed, BlockedURL, AuditLog)
│   │   ├── schemas.py                  # Pydantic V2 validation schemas
│   │   ├── feature_extractor.py        # 25+ Security Feature Extractor
│   │   ├── ml_engine.py                # Multi-model inference & XAI Feature Attribution
│   │   ├── threat_intel.py             # VirusTotal, SafeBrowsing, PhishTank aggregator
│   │   ├── auth.py                     # JWT token handling & RBAC middleware
│   │   ├── reports.py                  # PDF, CSV, & JSON Report generator
│   │   └── api/                        # API Routes (auth, scan, stats, history, report, threat-intel, admin)
│   ├── ml/
│   │   ├── dataset_generator.py        # Fast offline dataset generator
│   │   ├── train_multimodel.py         # Multi-Model ML Benchmark Trainer
│   │   └── train.py
│   ├── tests/                          # Pytest suite (auth, feature_extractor, threat_intel, api)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                           # React (Vite) Glassmorphism SOC Dashboard
│   ├── src/
│   │   ├── components/                 # URLScanner, SOCDashboard, XAIExplanation, ThreatIntelCard, GeoThreatMap, ModelBenchmarkView, AdminConsole
│   │   ├── services/api.js             # Axios client with JWT interceptors
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── extension/                          # Chrome Extension (Manifest V3)
├── docs/                               # Academic & Defense Package (SRS, PPT, Report, Viva QA, Demo Script, Deployment)
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quickstart Execution

### 1. Launch Backend API Server

```bash
cd backend
python -m ml.train
python run.py
```
> **FastAPI API Engine**: Running at [http://127.0.0.1:8000](http://127.0.0.1:8000)  
> **Interactive Swagger Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)  
> **Default Admin Credentials**: `admin@cybershield.com` / `Admin@123`

---

### 2. Launch React SOC Dashboard

```bash
cd frontend
npm install
npm run dev
```
> **React Dashboard**: Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 3. Run Pytest Suite

```bash
cd backend
python -m pytest tests/
```

---

### 4. Docker Compose Deployment

```bash
docker-compose up --build
```

---

## 🎓 Academic Defense & Deliverable Documentation

- 📜 [Changelog & Audit Fixes (CHANGELOG.md)](file:///c:/Users/ASUS/OneDrive/Desktop/PHISHING%20WEBSITE%20DETECTION%20SYSTEM/CHANGELOG.md)
- 🧪 [Final Quality Assurance Test Report (FINAL_TEST_REPORT.md)](file:///c:/Users/ASUS/OneDrive/Desktop/PHISHING%20WEBSITE%20DETECTION%20SYSTEM/FINAL_TEST_REPORT.md)
- 🚀 [Production & Local Deployment Guide (DEPLOYMENT_GUIDE.md)](file:///c:/Users/ASUS/OneDrive/Desktop/PHISHING%20WEBSITE%20DETECTION%20SYSTEM/DEPLOYMENT_GUIDE.md)
- 🎬 [College Presentation Demo Script (DEMO_SCRIPT.md)](file:///c:/Users/ASUS/OneDrive/Desktop/PHISHING%20WEBSITE%20DETECTION%20SYSTEM/DEMO_SCRIPT.md)
- 📄 [System Requirements Specification (SRS)](file:///c:/Users/ASUS/OneDrive/Desktop/PHISHING%20WEBSITE%20DETECTION%20SYSTEM/docs/SYSTEM_REQUIREMENTS_SPECIFICATION.md)
- 📊 [15-Slide Presentation Guide](file:///c:/Users/ASUS/OneDrive/Desktop/PHISHING%20WEBSITE%20DETECTION%20SYSTEM/docs/PPT_PRESENTATION_CONTENT.md)
- 📗 [Academic Final Project Report](file:///c:/Users/ASUS/OneDrive/Desktop/PHISHING%20WEBSITE%20DETECTION%20SYSTEM/docs/PROJECT_FINAL_REPORT.md)
- ❓ [50+ Viva Voce Questions & Answers Guide](file:///c:/Users/ASUS/OneDrive/Desktop/PHISHING%20WEBSITE%20DETECTION%20SYSTEM/docs/VIVA_QUESTIONS_AND_ANSWERS.md)
