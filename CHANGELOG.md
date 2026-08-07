# CyberShield Enterprise - System Change Log

All notable audit fixes, architectural hardening, and UX enhancements applied to the CyberShield Enterprise platform are documented in this file.

---

## [v3.0.0-PROD] - 2026-08-07

### 🔴 Critical Bug Fixes
- **SOC Sign In Modal Repair**: Resolved `isOpen` prop omission in `App.jsx` that prevented `LoginModal` from displaying when clicking **SOC Sign In**. Added `isOpen = true` default prop in `LoginModal.jsx`.
- **Windows Console Print Encoding (`UnicodeEncodeError`)**: Replaced non-ASCII emoji print statements across `backend/app/ml_engine.py`, `database.py`, `cache.py`, and `main.py` with cross-platform ASCII status tags (`[OK]`, `[WARNING]`, `[INFO]`, `[INIT]`). Resolved HTTP 500 errors on Windows standard output encoders (`cp1252`).
- **Unreachable Routes Resolution**: Explicitly wired `BatchScanner.jsx` and `HistoryTable.jsx` to `activeTab === 'batch'` and `activeTab === 'history'` inside `App.jsx`.
- **JWT Startup Verification**: Configured `App.jsx` `useEffect` on application mount to verify saved JWT tokens via `/api/auth/me`, preventing invalid or expired token states.

### 🟡 Architectural & Quality Improvements
- **FastAPI Lifespan Modernization**: Replaced deprecated `@app.on_event("startup")` handler in `backend/app/main.py` with standard FastAPI `@asynccontextmanager` `lifespan` context manager.
- **Dead Code Clean Up**: Removed unreferenced duplicate component `frontend/src/components/StatsOverview.jsx`.
- **Unified Footer Component**: Integrated `Footer.jsx` into `App.jsx` to replace inline duplicate footer markup.

### 🟢 UX & Production Polish
- **Glassmorphic Skeleton Loaders**: Created `SkeletonLoader.jsx` component offering card, table, and chart loading state skeletons across all 7 platform views (`SOCDashboard`, `URLScanner`, `HistoryTable`, `ModelBenchmarkView`, `AdminConsole`).
- **Real-Time Toast Notifications**: Created `ToastNotification.jsx` providing non-intrusive notification banners for URL Scan completed, Threat Detected, PDF Audit Report downloading, Role Updated, and Audit Logs Flushed.
- **Axios 401 Interceptor**: Added response interceptor in `api.js` to automatically clean up expired local credentials whenever an unauthenticated 401 response occurs.
