import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, Cpu, Clock, Terminal, ShieldCheck, Zap } from 'lucide-react';

const IOCAnalyzer = () => {
  const [query, setQuery] = useState('192.168.1.105');
  const [iocType, setIocType] = useState('IP');
  const [result, setResult] = useState(null);

  const iocDatabase = {
    '192.168.1.105': { type: 'IP', risk: 85, reputation: 'POOR (42 reports)', threatLevel: 'HIGH', firstSeen: '2026-07-12', lastSeen: '2026-08-07', country: 'RU', rec: 'Block IP at edge firewall router and inspect outbound C2 connections.' },
    'amaz0n-login.xyz': { type: 'Domain', risk: 94, reputation: 'MALICIOUS (18 engines)', threatLevel: 'CRITICAL', firstSeen: '2026-08-01', lastSeen: '2026-08-07', country: 'US', rec: 'Sinkhole domain via DNS policies and revoke active user credentials.' },
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855': { type: 'SHA256', risk: 98, reputation: 'MALWARE (Trojan.Phish.Win32)', threatLevel: 'CRITICAL', firstSeen: '2026-06-20', lastSeen: '2026-08-06', country: 'GLOBAL', rec: 'Quarantine infected host and initiate EDR host isolation.' }
  };

  const handleAnalyze = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const matched = iocDatabase[query.trim()] || {
      type: iocType,
      risk: query.includes('phish') || query.includes('xyz') ? 88 : 15,
      reputation: query.includes('phish') ? 'SUSPICIOUS' : 'CLEAN / NEUTRAL',
      threatLevel: query.includes('phish') ? 'HIGH' : 'LOW',
      firstSeen: '2026-08-01',
      lastSeen: '2026-08-07',
      country: 'US',
      rec: query.includes('phish') ? 'Monitor network traffic and log domain requests.' : 'No hostile IOC indicators detected. Safe to operate.'
    };

    setResult({ query: query.trim(), ...matched });
  };

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>IOC Threat Indicator Analyzer</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Deep scan IP addresses, domain names, target URLs, SHA256, MD5, and SHA1 file hashes.</p>
      </div>

      <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <select value={iocType} onChange={(e) => setIocType(e.target.value)} className="cyber-input" style={{ width: '130px' }}>
          <option value="IP">IP Address</option>
          <option value="Domain">Domain</option>
          <option value="URL">URL</option>
          <option value="SHA256">SHA256</option>
          <option value="MD5">MD5</option>
          <option value="SHA1">SHA1</option>
        </select>
        <input
          type="text"
          className="cyber-input"
          style={{ flex: 1, minWidth: '260px' }}
          placeholder="Enter IOC target (e.g. 192.168.1.105 or amaz0n-login.xyz)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-cyber" style={{ padding: '10px 24px' }}>
          <Search size={16} /> Analyze IOC
        </button>
      </form>

      {result && (
        <div style={{ background: 'rgba(5, 8, 22, 0.6)', border: '1px solid var(--border-muted)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="badge badge-admin" style={{ fontSize: '0.72rem', marginBottom: '4px' }}>{result.type} INDICATOR</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{result.query}</h4>
            </div>
            <span className={`badge ${result.threatLevel === 'CRITICAL' || result.threatLevel === 'HIGH' ? 'badge-phishing' : 'badge-safe'}`} style={{ fontSize: '0.85rem' }}>
              {result.threatLevel} THREAT ({result.risk}%)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reputation Rating</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{result.reputation}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>First Seen Timestamp</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{result.firstSeen}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Seen Timestamp</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{result.lastSeen}</p>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 217, 255, 0.05)', border: '1px solid rgba(0, 217, 255, 0.2)', padding: '16px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Zap size={16} color="var(--accent-cyan)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>SOC Remediation Protocol</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{result.rec}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IOCAnalyzer;
