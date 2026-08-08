document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetUrl = urlParams.get("url") || "Unknown Target";
  const rawData = urlParams.get("data");

  document.getElementById("targetUrl").textContent = targetUrl;

  if (rawData) {
    try {
      const data = JSON.parse(decodeURIComponent(rawData));
      document.getElementById("riskScoreBadge").textContent = `RISK SCORE: ${data.risk_score}%`;
      
      if (data.explanation) {
        document.getElementById("summaryText").textContent = data.explanation.summary;
        const issuesUl = document.getElementById("issuesList");
        issuesUl.innerHTML = "";
        (data.explanation.issues_list || []).forEach(issue => {
          const li = document.createElement("li");
          li.textContent = issue;
          issuesUl.appendChild(li);
        });
      }
    } catch (err) {
      console.warn("Failed to parse security data.");
    }
  }

  document.getElementById("btnGoBack").addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "about:blank";
    }
  });

  document.getElementById("btnProceed").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "BYPASS_URL", url: targetUrl }, () => {
      window.location.href = targetUrl;
    });
  });
});
