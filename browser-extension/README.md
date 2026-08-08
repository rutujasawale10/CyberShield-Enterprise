# CyberShield Enterprise v4.0 — Browser Extension

This directory contains the production-ready **Manifest V3 Browser Extension** for Google Chrome, Microsoft Edge, and Chromium-based browsers.

---

## Capabilities & Architecture
- **Pre-Navigation Interception**: Evaluates URLs before destination loading via Manifest V3 `webNavigation` and `declarativeNetRequest` background service worker.
- **Zero-Trust URL Reputations**: Queries `POST /api/protection/check-url` backend scanning engine.
- **Local Decision Caching**: Maintains 5-minute TTL cache in local extension storage to minimize network overhead.
- **Phishing Block Pages**: Redirects high-confidence phishing attempts to `pages/blocked.html`.
- **Suspicious Interstitial Warnings**: Presents user warning interstitials (`pages/warning.html`) with explicit security reasons and `Go Back` / `Proceed` controls.
- **Offline / Failure Handling**: Graceful fallback mode (`pages/error.html`) ensuring zero browser crashes if backend server is unreachable.
- **Privacy-First Guarantee**: Inspects ONLY destination URLs. Never accesses form fields, passwords, credit card inputs, cookies, or session tokens.

---

## How to Install in Google Chrome
1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in upper right corner).
4. Click **Load unpacked**.
5. Select the `browser-extension/` directory from this repository.
6. The CyberShield shield icon (🛡️) will appear in your browser toolbar!

---

## How to Install in Microsoft Edge
1. Open Microsoft Edge.
2. Navigate to `edge://extensions/`.
3. Enable **Developer mode** in the left sidebar.
4. Click **Load unpacked**.
5. Select the `browser-extension/` directory.

---

## Backend Communication
By default, the extension connects to the backend REST API at:
`http://localhost:8000/api`

To point the extension to a deployed production server (e.g. Render/Railway):
1. Open extension popup by clicking the CyberShield icon.
2. Update backend configuration or set `backendUrl` in Chrome Local Storage.
