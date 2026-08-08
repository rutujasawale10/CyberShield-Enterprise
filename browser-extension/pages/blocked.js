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

      if (data.technical_details) {
        const tech = data.technical_details;
        document.getElementById("techHostType").textContent = tech.host_type || "DOMAIN";
        document.getElementById("techIp").textContent = tech.ip_address || "N/A";
        document.getElementById("techGeo").textContent = `${tech.country || 'Unknown'} / ${tech.isp || 'Unknown'}`;
        document.getElementById("techDomain").textContent = tech.registered_domain || data.domain || "N/A";
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

  document.getElementById("btnViewDetails").addEventListener("click", () => {
    window.open("http://localhost:5173", "_blank");
  });
});
