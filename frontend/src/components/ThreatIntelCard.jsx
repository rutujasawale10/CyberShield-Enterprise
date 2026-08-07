import React from 'react';
import { ShieldCheck, AlertCircle, Globe, Radio } from 'lucide-react';

const ThreatIntelCard = ({ threatIntel = {} }) => {
  if (!threatIntel || Object.keys(threatIntel).length === 0) return null;

  const vt = threatIntel.virustotal || {};
  const gsb = threatIntel.google_safebrowsing || {};
  const pt = threatIntel.phishtank || {};
  const op = threatIntel.openphish || {};

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Radio size={22} color="var(--status-warning)" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          Multi-Source Threat Intelligence
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* VirusTotal */}
        <div style={{ background: 'rgba(7, 10, 19, 0.6)', border: '1px solid var(--border-muted)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>VirusTotal v3</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vt.status || 'Active'}</span>
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: 800, color: vt.malicious_count > 0 ? 'var(--status-danger)' : 'var(--status-safe)', fontFamily: 'var(--font-mono)' }}>
            {vt.malicious_count ?? 0} / {vt.total_engines ?? 70}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Engines Flagged Malicious</span>
        </div>

        {/* Google Safe Browsing */}
        <div style={{ background: 'rgba(7, 10, 19, 0.6)', border: '1px solid var(--border-muted)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Google Safe Browsing</span>
            <Globe size={16} color="var(--accent-cyan)" />
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: gsb.flagged ? 'var(--status-danger)' : 'var(--status-safe)' }}>
            {gsb.flagged ? '❌ FLAGGED' : '✅ CLEAN'}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {gsb.threat_types?.length > 0 ? gsb.threat_types[0] : 'No Threat Entries'}
          </span>
        </div>

        {/* PhishTank */}
        <div style={{ background: 'rgba(7, 10, 19, 0.6)', border: '1px solid var(--border-muted)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>PhishTank Feed</span>
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: pt.flagged ? 'var(--status-danger)' : 'var(--status-safe)' }}>
            {pt.flagged ? '❌ LISTED' : '✅ NOT LISTED'}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Community Verified</span>
        </div>

        {/* OpenPhish */}
        <div style={{ background: 'rgba(7, 10, 19, 0.6)', border: '1px solid var(--border-muted)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>OpenPhish Feed</span>
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: op.flagged ? 'var(--status-danger)' : 'var(--status-safe)' }}>
            {op.flagged ? '❌ MATCHED' : '✅ UNMATCHED'}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence: {op.confidence || 'NORMAL'}</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelCard;
