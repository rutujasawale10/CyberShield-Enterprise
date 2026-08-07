# CyberShield Enterprise - Cloud Deployment Guide

This guide covers step-by-step instructions for deploying CyberShield Enterprise across **Render**, **Railway**, **Vercel**, **AWS EC2**, and **Azure**.

---

## 1. Deploying Backend on Render

1. Connect your GitHub repository to [Render.com](https://render.com).
2. Create a new **Web Service**.
3. Set the environment settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt && python -m backend.ml.train`
   - **Start Command**: `python backend/run.py`
4. Add Environment Variables:
   - `JWT_SECRET_KEY`: `your_custom_production_secret`
   - `VIRUSTOTAL_API_KEY`: `[Optional VT Key]`
   - `GOOGLE_SAFE_BROWSING_API_KEY`: `[Optional GSB Key]`

---

## 2. Deploying Backend on Railway

1. Install Railway CLI or connect via [Railway.app](https://railway.app).
2. Select **Deploy from GitHub repo**.
3. Railway will detect `backend/Dockerfile` automatically.
4. Set port variable `PORT=8000`.

---

## 3. Deploying Frontend on Vercel

1. Log into [Vercel.com](https://vercel.com) and click **Import Project**.
2. Select the `frontend/` directory.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-render-url.onrender.com/api`

---

## 4. Deploying Full Stack via Docker Compose on AWS EC2 / Azure VM

1. Launch an Ubuntu 22.04 LTS instance on AWS EC2 or Azure VM.
2. Open ports `80`, `443`, `8000`, and `5173` in Security Group / Firewall settings.
3. SSH into the server:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose git
   ```
4. Clone the repository and run:
   ```bash
   docker-compose up -d --build
   ```
5. Your application is live at `http://your-ec2-ip:5173`!
