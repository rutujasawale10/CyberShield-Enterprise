# CyberShield Enterprise v4.0 — Windows Desktop Application

This directory contains the standalone **Windows Desktop Protection Application** (`CyberShield.exe`).

---

## Features
- **Protection Matrix Dashboard**: Real-time status toggles for System Protection, Browser Filter, Threat Intel, URL Monitoring, and Number Abuse Protection.
- **Desktop URL Scanner**: Live real-time URL reputation analysis directly from the desktop console.
- **Windows System Tray Integration**: Minimizes to Windows System Tray with 🛡️ icon menu:
  - Protection Status
  - Open Security Dashboard
  - Scan URL...
  - Pause Protection
  - Exit CyberShield
- **Defensive Number Protection**: Safe user mobile number registration and call/SMS abuse monitoring.
- **Centralized Security Alerts Feed**: Displays real-time security alerts synced with CyberShield backend.

---

## How to Run locally
Ensure backend is running (`uvicorn app.main:app --port 8000`), then run:
```bash
python desktop-app/main.py
```

---

## How to Build `CyberShield.exe`
1. Install requirements:
   ```bash
   pip install -r desktop-app/requirements.txt
   ```
2. Run compilation pipeline:
   ```bash
   python desktop-app/build_exe.py
   ```
3. The compiled binary will be placed in:
   `dist/CyberShield.exe`
