document.addEventListener('DOMContentLoaded', async () => {
  const targetUrlEl = document.getElementById('targetUrl');
  const statusTextEl = document.getElementById('statusText');
  const riskScoreEl = document.getElementById('riskScore');
  const scanBtn = document.getElementById('scanBtn');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url) {
    targetUrlEl.innerText = tab.url;
    scanUrl(tab.url);
  }

  scanBtn.addEventListener('click', () => {
    if (tab && tab.url) {
      scanUrl(tab.url);
    }
  });

  async function scanUrl(url) {
    statusTextEl.innerText = "ANALYZING...";
    statusTextEl.className = "";
    riskScoreEl.innerText = "Querying CyberShield AI Engine...";

    try {
      const res = await fetch("http://127.0.0.1:8000/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url })
      });
      const data = await res.json();
      if (data.status === "Phishing") {
        statusTextEl.innerText = "❌ DANGEROUS PHISHING LINK";
        statusTextEl.className = "status-phishing";
        riskScoreEl.innerText = `Risk Score: ${data.risk_score}% | Confidence: ${data.confidence_score}%`;
      } else {
        statusTextEl.innerText = "✅ SAFE WEBSITE";
        statusTextEl.className = "status-safe";
        riskScoreEl.innerText = `Risk Score: ${data.risk_score}% | Verified Safe`;
      }
    } catch (err) {
      statusTextEl.innerText = "⚠️ API OFFLINE";
      riskScoreEl.innerText = "Start backend server at 127.0.0.1:8000";
    }
  }
});
