# System Requirements Specification (SRS)
## Project Title: CyberShield Enterprise - AI Cyber Threat Intelligence & SOC Governance Platform

---

## 1. Introduction & Executive Summary
CyberShield Enterprise is a full-stack AI security platform that combines 40+ real-time security feature extractions, Explainable AI (XAI) feature attribution, Voting & Stacking Ensemble Machine Learning, 15+ Threat Intelligence integrations, MITRE ATT&CK threat mapping, multi-format PDF security reports, and Role-Based Access Control (RBAC).

---

## 2. System Architecture & 10 Mermaid Diagrams

### Diagram 1: Data Flow Diagram Level 0 (Context Diagram)
```mermaid
graph TD
    User([Security Analyst / User]) -->|Enters URL / Scans Tab| CyberShield[CyberShield Platform]
    CyberShield -->|Outputs Threat Status, XAI, PDF Report| User
    CyberShield <-->|Threat Queries| ThreatFeeds[(15+ Threat Intel APIs)]
```

### Diagram 2: Data Flow Diagram Level 1
```mermaid
graph TD
    User([User]) -->|Submit URL| Gateway[FastAPI Gateway]
    Gateway -->|Extract Features| FE[40+ Parameter Extractor]
    FE -->|Feature Vector| ML[Voting & Stacking Ensemble]
    Gateway -->|Domain Lookup| TI[Threat Intel Aggregator]
    ML -->|Risk Score & XAI| DB[(PostgreSQL / SQLite)]
    TI -->|Community Reputation| DB
    Gateway -->|Return Analysis| User
```

### Diagram 3: Use Case Diagram
```mermaid
graph TD
    User([End User]) --> UC1(Scan URL)
    User --> UC2(Download PDF Audit Report)
    Analyst([SOC Analyst]) --> UC3(Explore MITRE ATT&CK Matrix)
    Analyst --> UC4(Run CVSS & CVE Lookup)
    Admin([Security Admin]) --> UC5(Manage Users & Roles)
    Admin --> UC6(Manage Threat Feeds)
```

### Diagram 4: Class Diagram
```mermaid
classDiagram
    class User {
        +int id
        +string email
        +string hashed_password
        +string role
    }
    class ScanLog {
        +int id
        +string url
        +string domain
        +string status
        +float risk_score
        +float confidence_score
    }
    class ThreatFeed {
        +int id
        +string provider
        +string domain
        +string status
    }
    User "1" -- "*" ScanLog : creates
```

### Diagram 5: Sequence Diagram
```mermaid
sequenceDiagram
    participant U as User / React Dashboard
    participant G as FastAPI Gateway
    participant FE as Feature Extractor
    participant ML as Ensemble ML Engine
    participant TI as Threat Intel Engine

    U->>G: POST /api/scan {url}
    G->>FE: extract_features(url)
    FE-->>G: 40+ Feature Dict
    G->>ML: predict(features)
    ML-->>G: Risk Score % & XAI Weights
    G->>TI: check_url(url, domain)
    TI-->>G: 15+ Threat Intel Hits
    G-->>U: Combined Risk Score, XAI & Threat Card
```

### Diagram 6: Entity-Relationship Diagram (ERD)
```mermaid
erDiagram
    USER ||--o{ SCAN_LOG : performs
    USER ||--o{ AUDIT_LOG : triggers
    THREAT_FEED ||--o{ SCAN_LOG : correlates
```

### Diagram 7: Activity Diagram
```mermaid
graph TD
    Start([User Submits URL]) --> Parse[Normalize URL & Extract Hostname]
    Parse --> Ext[Extract 40+ Security Parameters]
    Ext --> MLPred[Evaluate Voting Ensemble ML]
    MLPred --> TIPoll[Poll 15+ Threat Feeds]
    TIPoll --> XAICalc[Calculate XAI Feature Attribution]
    XAICalc --> Render[Render SOC Dashboard & Gauge]
```

### Diagram 8: Deployment Diagram
```mermaid
graph TD
    Client[Browser / Extension / Electron App] -->|HTTPS| Nginx[NGINX Reverse Proxy]
    Nginx -->|Port 8000| FastAPI[FastAPI Backend Container]
    FastAPI <-->|Session| Redis[(Redis Cache)]
    FastAPI <-->|SQL| Postgres[(PostgreSQL / SQLite DB)]
```

### Diagram 9: MITRE ATT&CK Threat Mapping Diagram
```mermaid
graph TD
    Domain[Target Phishing Domain] --> Recon[Reconnaissance TA0043]
    Domain --> InitAccess[Initial Access TA0001 - T1566 Spearphishing]
    Domain --> DefEvasion[Defense Evasion TA0005 - T1027 Obfuscation / Homograph]
    Domain --> CredAccess[Credential Access TA0006 - T1556 Fake Login]
```

### Diagram 10: Multi-Model Ensemble Machine Learning Architecture
```mermaid
graph TD
    Input[40+ Security Feature Vector] --> Scaler[StandardScaler Normalizer]
    Scaler --> RF[Random Forest Classifier]
    Scaler --> GB[Gradient Boosting Classifier]
    Scaler --> ET[Extra Trees Classifier]
    RF --> SoftVoting[Soft Voting Ensemble Classifier]
    GB --> SoftVoting
    ET --> SoftVoting
    SoftVoting --> Stacking[Stacking Final Meta Estimator]
    Stacking --> Output[Final Calibrated Risk Score % & Confidence %]
```

---

## 3. Functional Requirements
- **FR-1**: Fast 40+ parameter URL extraction without network dependencies during training.
- **FR-2**: Voting and Stacking Ensemble ML classification with SHAP/LIME Explainability.
- **FR-3**: 15+ Threat Intelligence integrations with intelligent fallback.
- **FR-4**: JWT OAuth2 authentication with Admin, Analyst, and User RBAC.
- **FR-5**: 1-click ReportLab PDF security audit report generation.
