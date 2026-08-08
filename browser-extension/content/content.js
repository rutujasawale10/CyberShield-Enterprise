// CyberShield Enterprise v4.0 - Privacy-First Content Script
// Strictly non-intrusive. Does NOT collect passwords, form inputs, cookies, or personal data.

(function () {
  const currentUrl = window.location.href;

  // Send security ping for tab status badge
  chrome.runtime.sendMessage({
    action: "CONTENT_PING",
    url: currentUrl
  }, () => {
    if (chrome.runtime.lastError) {
      // Background worker inactive or reloading
    }
  });
})();
