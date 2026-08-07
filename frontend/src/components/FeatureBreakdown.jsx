import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Check, X } from 'lucide-react';

const FeatureBreakdown = ({ features = {} }) => {
  const [expanded, setExpanded] = useState(false);

  if (!features || Object.keys(features).length === 0) return null;

  const featureCards = [
    { label: 'URL Length', value: `${features.url_length} chars`, alert: features.url_length > 75 },
    { label: 'Domain Name', value: features.domain || 'N/A', alert: false },
    { label: 'HTTPS Protocol', value: features.is_https ? 'Secure (HTTPS)' : 'Insecure (HTTP)', alert: !features.is_https },
    { label: 'Raw IP Address', value: features.is_ip_address ? 'Yes (Suspicious)' : 'No (Domain Name)', alert: features.is_ip_address === 1 },
    { label: 'Suspicious TLD', value: features.suspicious_tld ? 'High Risk' : 'Normal', alert: features.suspicious_tld === 1 },
    { label: 'URL Shortener', value: features.is_shortened ? 'Shortened Service' : 'Standard Domain', alert: features.is_shortened === 1 },
    { label: 'Target Keywords', value: features.found_keywords?.length > 0 ? features.found_keywords.join(', ') : 'None', alert: features.has_suspicious_keyword === 1 },
    { label: 'Subdomains Count', value: features.count_subdomains ?? 0, alert: features.count_subdomains >= 3 },
    { label: 'URL Shannon Entropy', value: features.url_entropy ?? 0, alert: features.url_entropy > 4.5 },
    { label: 'Dots / Hyphens Count', value: `Dots: ${features.count_dots} | Hyphens: ${features.count_hyphens}`, alert: features.count_hyphens > 2 },
    { label: 'At Symbol (@)', value: features.count_at > 0 ? 'Present (Redirect Trick)' : 'Absent', alert: features.count_at > 0 },
    { label: 'DNS Resolution', value: features.dns_resolves ? 'Valid A Record' : 'No DNS Record', alert: features.dns_resolves === 0 },
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={20} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Extracted Security Feature Breakdown (20+ Parameters)
          </h3>
        </div>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          {expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>
      </div>

      {expanded && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginTop: '20px'
        }}>
          {featureCards.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(7, 10, 19, 0.6)',
                border: item.alert ? '1px solid rgba(255, 8, 68, 0.4)' : '1px solid var(--border-muted)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {item.label}
                </p>
                <p style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: item.alert ? 'var(--status-danger)' : 'var(--text-main)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {item.value}
                </p>
              </div>
              <div>
                {item.alert ? (
                  <X size={18} color="var(--status-danger)" />
                ) : (
                  <Check size={18} color="var(--status-safe)" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureBreakdown;
