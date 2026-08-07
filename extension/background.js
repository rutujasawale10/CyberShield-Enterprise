// Background Service Worker for Manifest V3 extension
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId === 0 && details.url.startsWith("http")) {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: details.url })
      });
      const data = await res.json();
      if (data.status === "Phishing" && data.risk_score >= 80) {
        console.warn("[CyberShield Intercepted High-Risk Phishing Domain]:", details.url);
      }
    } catch (e) {
      // Offline fallback
    }
  }
});
