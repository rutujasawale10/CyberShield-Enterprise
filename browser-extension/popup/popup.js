document.addEventListener("DOMContentLoaded", async () => {
  const currentUrlEl = document.getElementById("currentUrl");
  const riskScoreEl = document.getElementById("riskScore");
  const classificationEl = document.getElementById("classification");
  const hostTypeEl = document.getElementById("hostType");
  const geoInfoEl = document.getElementById("geoInfo");
  const statusBadge = document.getElementById("statusBadge");
  const protectionToggle = document.getElementById("protectionToggle");
  const apiEndpointInput = document.getElementById("apiEndpointInput");
  const btnReport = document.getElementById("btnReport");
  const btnDashboard = document.getElementById("btnDashboard");

  // 1. Load Settings
  const storageData = await chrome.storage.local.get(["protectionEnabled", "backendUrl"]);
  const isEnabled = storageData.protectionEnabled !== false;
  const currentBackendUrl = storageData.backendUrl || "http://localhost:8000/api";

  protectionToggle.checked = isEnabled;
  apiEndpointInput.value = currentBackendUrl;

  protectionToggle.addEventListener("change", (e) => {
    const val = e.target.checked;
    chrome.storage.local.set({ protectionEnabled: val });
    if (!val) {
      updateOfflineState("DISABLED");
    }
  });

  apiEndpointInput.addEventListener("change", (e) => {
    let newUrl = e.target.value.strip ? e.target.value.strip() : e.target.value.trim();
    if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
    chrome.storage.local.set({ backendUrl: newUrl });
  });

  // 2. Query Active Tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) {
    currentUrlEl.textContent = "No Active Web Page";
    updateOfflineState("NO_PAGE");
    return;
  }

  const targetUrl = tab.url;
  try {
    const parsed = new URL(targetUrl);
    currentUrlEl.textContent = parsed.hostname || targetUrl;
  } catch (err) {
    currentUrlEl.textContent = targetUrl;
  }

  if (targetUrl.startsWith("chrome://") || targetUrl.startsWith("edge://") || targetUrl.startsWith("about:")) {
    classificationEl.textContent = "SYSTEM";
    riskScoreEl.textContent = "0%";
    riskScoreEl.style.color = "var(--status-safe)";
    hostTypeEl.textContent = "INTERNAL";
    geoInfoEl.textContent = "Browser Core";
    updateStatusBadge("PROTECTED");
    return;
  }

  if (!isEnabled) {
    updateOfflineState("DISABLED");
    return;
  }

  // 3. Scan Active URL via Backend API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${currentBackendUrl}/protection/check-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: targetUrl, client_type: "BROWSER" }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const score = data.risk_score || 0;
      const status = data.status || "Safe";
      const tech = data.technical_details || {};

      riskScoreEl.textContent = `${score}%`;
      classificationEl.textContent = status.toUpperCase();
      hostTypeEl.textContent = tech.host_type || "DOMAIN";
      geoInfoEl.textContent = `${tech.ip_address || 'IP'} (${tech.country || 'Unknown'})`;

      if (status === "Phishing") {
        riskScoreEl.style.color = "var(--status-danger)";
        updateStatusBadge("BLOCKED");
      } else if (status === "Suspicious") {
        riskScoreEl.style.color = "var(--status-warning)";
        updateStatusBadge("WARNING");
      } else {
        riskScoreEl.style.color = "var(--status-safe)";
        updateStatusBadge("PROTECTED");
      }
    } else {
      updateOfflineState("OFFLINE");
    }
  } catch (err) {
    updateOfflineState("OFFLINE");
  }

  function updateOfflineState(reason) {
    riskScoreEl.textContent = "N/A";
    riskScoreEl.style.color = "var(--text-muted)";
    classificationEl.textContent = reason === "DISABLED" ? "PROTECTION OFF" : "UNVERIFIED";
    hostTypeEl.textContent = "UNKNOWN";
    geoInfoEl.textContent = reason === "DISABLED" ? "Protection Disabled" : "Backend Unavailable";
    updateStatusBadge("OFFLINE");
  }

  function updateStatusBadge(state) {
    statusBadge.className = "status-badge";
    if (state === "BLOCKED") {
      statusBadge.classList.add("status-blocked");
      statusBadge.textContent = "● BLOCKED";
    } else if (state === "WARNING") {
      statusBadge.classList.add("status-warning");
      statusBadge.textContent = "● WARNING";
    } else if (state === "OFFLINE") {
      statusBadge.classList.add("status-offline");
      statusBadge.textContent = "● OFFLINE";
    } else {
      statusBadge.classList.add("status-protected");
      statusBadge.textContent = "● PROTECTED";
    }
  }

  // Button Handlers
  btnDashboard.addEventListener("click", () => {
    let dashUrl = currentBackendUrl.replace("/api", "");
    if (!dashUrl.startsWith("http")) dashUrl = "http://localhost:5173";
    chrome.tabs.create({ url: dashUrl });
  });

  btnReport.addEventListener("click", async () => {
    try {
      await fetch(`${currentBackendUrl}/protection/report-false-positive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, comments: "Reported via Extension Popup" })
      });
      alert("False positive report submitted successfully!");
    } catch (err) {
      alert("Failed to submit report. CyberShield backend unavailable.");
    }
  });
});
