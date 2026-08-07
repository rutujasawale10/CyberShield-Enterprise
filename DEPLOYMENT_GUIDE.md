# CyberShield Enterprise - Production Deployment Guide

This guide provides complete instructions for starting, deploying, and demonstrating the **CyberShield Enterprise** platform locally or in containerized environments.

---

## 📋 System Prerequisites
- **Python**: 3.10+ (Tested on Python 3.13)
- **Node.js**: 18+ & npm
- **Database**: SQLite (Default built-in, zero configuration required) or PostgreSQL

---

## 🚀 Local Development Setup

### 1. Backend Service Setup (FastAPI)
```powershell
# Navigate to backend directory
cd backend

# Create virtual environment (optional)
python -m venv venv
venv\Scripts\activate

# Install required dependencies
pip install -r requirements.txt

# Start backend server with live reload on port 8000
python run.py
```
- Backend API Root: `http://localhost:8000`
- Swagger Interactive Documentation: `http://localhost:8000/docs`
- Default Admin Account: `admin@cybershield.com` | Password: `Admin@123`

---

### 2. Frontend Application Setup (React + Vite)
```powershell
# Navigate to frontend directory
cd frontend

# Install node modules
npm install

# Start Vite dev server on port 5173
npm run dev
```
- Web Application UI: `http://localhost:5173`

---

## 🐳 Docker Container Deployment

To launch the complete multi-container setup via Docker Compose:
```powershell
docker-compose up --build -d
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 🧪 Verification Commands

```powershell
# Run backend test suite
cd backend
python -m pytest tests

# Run frontend build check
cd frontend
npm run build
```
