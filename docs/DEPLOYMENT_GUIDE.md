# CyberShield Enterprise v4.0 — Vercel Full-Stack Deployment Guide

This guide covers full-stack deployment of CyberShield Enterprise on **Vercel** using **GitHub + Vercel**.

---

## Architecture Overview
- **Frontend**: React + Vite SPA built from `frontend/` (`dist/` output).
- **Backend**: FastAPI Python Serverless Function (`api/index.py` wrapping `backend/app/main.py`).
- **Database**: SQLite in-memory / ephemeral `/tmp/cybershield_enterprise.db` (cold start auto-seed) or remote PostgreSQL via `DATABASE_URL`.
- **Browser Extension**: Manifest V3 extension in `browser-extension/` configured to communicate with the deployed Vercel backend URL.

---

## Step-by-Step Vercel Deployment Instructions

### 1. Push Code to GitHub
Ensure all changes are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Configure CyberShield v4.0 for Vercel deployment"
git push origin main
```

### 2. Import Project in Vercel
1. Log into [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your GitHub repository (`CyberShield-Enterprise`).
3. Set **Root Directory** to `./` (Project Root).

### 3. Vercel Project Settings
Vercel automatically reads `vercel.json` and `requirements.txt` from the repository root:
- **Build Command**: `cd frontend && npm run build` (handled automatically via `vercel.json`).
- **Output Directory**: `frontend/dist`
- **Framework Preset**: `Vite`

### 4. Required Environment Variables in Vercel Dashboard
In **Project Settings -> Environment Variables**, add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-project.vercel.app/api` | API Base URL for frontend console |
| `JWT_SECRET_KEY` | `<your-secure-jwt-secret>` | Secret key for signing JWT tokens |
| `JWT_REFRESH_SECRET_KEY` | `<your-secure-refresh-secret>` | Secret key for refresh tokens |
| `ALLOWED_ORIGINS` | `https://your-project.vercel.app` | Allowed CORS origins |
| `DATABASE_URL` | `postgresql://user:pass@ep-host.region.aws.neon.tech/cybershield` | Optional remote PostgreSQL URI |
| `VIRUSTOTAL_API_KEY` | `<optional-vt-key>` | Optional VirusTotal API key |

---

## 5. Connecting the Browser Extension
1. Install the extension in Chrome or Edge (`chrome://extensions/` -> **Load unpacked** -> `browser-extension/`).
2. Click the CyberShield extension icon in your browser toolbar.
3. In the extension popup, update **Backend Protection API** to your live Vercel URL:
   `https://your-project.vercel.app/api`

---

## 6. Offline Failure Behavior
If the Vercel backend is offline or network fails:
- Extension displays `OFFLINE / UNVERIFIED` status and `N/A` risk score.
- **NEVER** falsely reports `SAFE` or `0%` when unverified.
