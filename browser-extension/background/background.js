// CyberShield Enterprise v4.0 - Background Service Worker
const DEFAULT_BACKEND_URL = "http://localhost:8000/api";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

// Maintain in-memory decision cache
const urlCache = new Map();
let isProtectionEnabled = true;

// Initialize Extension Settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    protectionEnabled: true,
    backendUrl: DEFAULT_BACKEND_URL,
    bypassedUrls: [],
    stats: { totalScans: 0, blockedCount: 0, warningCount: 0 }
  });
  console.log("[CyberShield] Extension Service Worker initialized.");
  registerDeviceHeartbeat();
});

// Periodic heartbeat alarm
chrome.alarms.create("deviceHeartbeat", { periodInMinutes: 10 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "deviceHeartbeat") {
    registerDeviceHeartbeat();
  }
});

async function registerDeviceHeartbeat() {
  try {
    const data = await chrome.storage.local.get(["backendUrl", "deviceId"]);
    const backendUrl = data.backendUrl || DEFAULT_BACKEND_URL;
    
    if (data.deviceId) {
      await fetch(`${backendUrl}/protection/device/heartbeat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: data.deviceId, is_active: true })
      });
    } else {
      const res = await fetch(`${backendUrl}/protection/device/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_name: "Browser Extension Client",
          device_type: "BROWSER",
          client_version: "4.0.0",
          os_name: navigator.platform || "Windows"
        })
      });
      if (res.ok) {
        const deviceData = await res.json();
        chrome.storage.local.set({ deviceId: deviceData.id });
      }
    }
  } catch (err) {
    console.warn("[CyberShield] Device heartbeat offline fallback.");
  }
}

// Navigation Interceptor (Pre-open URL Check)
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return; // Main frame only

  const targetUrl = details.url;
  if (!targetUrl || targetUrl.startsWith("chrome://") || targetUrl.startsWith("edge://") || targetUrl.startsWith("about:") || targetUrl.includes(chrome.runtime.id)) {
    return;
  }

  // Check protection toggle state
  const config = await chrome.storage.local.get(["protectionEnabled", "backendUrl", "bypassedUrls", "stats"]);
  if (config.protectionEnabled === false) return;

  const bypassed = config.bypassedUrls || [];
  if (bypassed.includes(targetUrl)) return;

  const backendUrl = config.backendUrl || DEFAULT_BACKEND_URL;

  // 1. Check local TTL Cache
  const now = Date.now();
  if (urlCache.has(targetUrl)) {
    const cached = urlCache.get(targetUrl);
    if (now - cached.timestamp < CACHE_TTL_MS) {
      handleDecision(details.tabId, targetUrl, cached.data);
      return;
    }
  }

  // 2. Query Backend API for Pre-Navigation Decision
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout limit

    const response = await fetch(`${backendUrl}/protection/check-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: targetUrl, client_type: "BROWSER" }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      urlCache.set(targetUrl, { timestamp: now, data });
      
      // Update statistics
      const stats = config.stats || { totalScans: 0, blockedCount: 0, warningCount: 0 };
      stats.totalScans += 1;
      if (data.decision === "BLOCK") stats.blockedCount += 1;
      if (data.decision === "WARN") stats.warningCount += 1;
      chrome.storage.local.set({ stats });

      handleDecision(details.tabId, targetUrl, data);
    } else {
      // Backend error response -> Safe fallback
      handleOfflineFallback(details.tabId, targetUrl);
    }
  } catch (err) {
    // Network failure / timeout -> Offline fallback
    handleOfflineFallback(details.tabId, targetUrl);
  }
});

function handleDecision(tabId, targetUrl, data) {
  const decision = data.decision;
  const encodedUrl = encodeURIComponent(targetUrl);
  const encodedData = encodeURIComponent(JSON.stringify(data));

  if (decision === "BLOCK") {
    const blockPageUrl = chrome.runtime.getURL(`pages/blocked.html?url=${encodedUrl}&data=${encodedData}`);
    chrome.tabs.update(tabId, { url: blockPageUrl });
  } else if (decision === "WARN") {
    const warnPageUrl = chrome.runtime.getURL(`pages/warning.html?url=${encodedUrl}&data=${encodedData}`);
    chrome.tabs.update(tabId, { url: warnPageUrl });
  }
}

function handleOfflineFallback(tabId, targetUrl) {
  console.warn(`[CyberShield] Backend unavailable for ${targetUrl}. Protection running in degraded mode.`);
}

// Handle messages from popup / blocked / warning pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "BYPASS_URL") {
    chrome.storage.local.get(["bypassedUrls"], (data) => {
      const bypassed = data.bypassedUrls || [];
      if (!bypassed.includes(message.url)) {
        bypassed.push(message.url);
        chrome.storage.local.set({ bypassedUrls: bypassed }, () => {
          if (sender.tab && sender.tab.id) {
            chrome.tabs.update(sender.tab.id, { url: message.url });
          }
        });
      }
    });
    sendResponse({ status: "OK" });
  } else if (message.action === "GET_CACHE") {
    sendResponse({ cache: Array.from(urlCache.entries()) });
  }
  return true;
});
