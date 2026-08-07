import React, { useState } from 'react';
import { Wrench, Shield, Code2, Search, Cpu, Terminal, FileCode, CheckCircle2, ShieldAlert, Network, FileText, Activity } from 'lucide-react';
import IOCAnalyzer from './IOCAnalyzer';
import IncidentDashboard from './IncidentDashboard';
import SIEMLogViewer from './SIEMLogViewer';
import NetworkTopology from './NetworkTopology';
import ExecutiveReportGenerator from './ExecutiveReportGenerator';

const SecurityToolsView = () => {
  const [activeTool, setActiveTool] = useState('ioc');
  const [cveSearch, setCveSearch] = useState('CVE-2024-3094');

  // CVSS State
  const [av, setAv] = useState('N'); // Network
  const [ac, setAc] = useState('L'); // Low
  const [pr, setPr] = useState('N'); // None
  const [ui, setUi] = useState('R'); // Required

  // Simple CVSS Score Calculator Logic
  const calcCvss = () => {
    let score = 5.0;
    if (av === 'N') score += 2.5;
    if (ac === 'L') score += 1.0;
    if (pr === 'N') score += 1.0;
    if (ui === 'R') score += 0.3;
    return Math.min(10.0, roundScore(score));
  };

  const roundScore = (num) => Math.round(num * 10) / 10;

  const cvssScore = calcCvss();

  const cveData = {
    'CVE-2024-3094': { title: 'XZ Utils Backdoor Ingestion', severity: 'CRITICAL (10.0)', cwe: 'CWE-506 (Embedded Malicious Code)', desc: 'Malicious code in XZ Utils versions 5.6.0 and 5.6.1 allows unauthorized SSH authentication bypass.' },
    'CVE-2023-38606': { title: 'Apple iOS / macOS Zero-Day Kernel Exploit', severity: 'HIGH (8.8)', cwe: 'CWE-269 (Improper Privilege Management)', desc: 'Kernel memory corruption vulnerability leveraged in Operation Triangulation spyware attacks.' }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Enterprise <span className="text-gradient">Security Suite & IOC Tools</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>IOC Analyzer, Incident Management, SIEM Logs, Network Topology, Executive Reports, and CVSS Calculators.</p>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'ioc', label: 'IOC Threat Analyzer', icon: <Search size={16} /> },
          { id: 'incidents', label: 'Incident Response', icon: <ShieldAlert size={16} /> },
          { id: 'siem', label: 'SIEM Log Viewer', icon: <Activity size={16} /> },
          { id: 'network', label: 'Network Topology', icon: <Network size={16} /> },
          { id: 'reports', label: 'Executive Reports', icon: <FileText size={16} /> },
          { id: 'cvss', label: 'CVSS Calculator', icon: <Cpu size={16} /> },
          { id: 'cve', label: 'CVE Lookup', icon: <Terminal size={16} /> },
          { id: 'yara', label: 'YARA Rules', icon: <FileCode size={16} /> }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            style={{
              background: activeTool === t.id ? 'linear-gradient(135deg, #00D9FF 0%, #3B82F6 100%)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTool === t.id ? '#050816' : 'var(--text-muted)',
              fontWeight: 700,
              padding: '10px 18px',
              borderRadius: '10px',
              border: activeTool === t.id ? 'none' : '1px solid var(--border-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTool === t.id ? '0 0 15px rgba(0, 217, 255, 0.35)' : 'none'
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTool === 'ioc' && <IOCAnalyzer />}
      {activeTool === 'incidents' && <IncidentDashboard />}
      {activeTool === 'siem' && <SIEMLogViewer />}
      {activeTool === 'network' && <NetworkTopology />}
      {activeTool === 'reports' && <ExecutiveReportGenerator />}

      {/* CVSS Calculator View */}
      {activeTool === 'cvss' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>CVSS v3.1 Severity Score Calculator</h3>
            <div style={{ background: cvssScore >= 9.0 ? 'rgba(255, 8, 68, 0.15)' : 'rgba(255, 171, 0, 0.15)', padding: '10px 20px', borderRadius: '12px', border: `1px solid ${cvssScore >= 9.0 ? 'var(--status-danger)' : 'var(--status-warning)'}` }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: cvssScore >= 9.0 ? 'var(--status-danger)' : 'var(--status-warning)', fontFamily: 'var(--font-mono)' }}>
                {cvssScore} / 10.0
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                {cvssScore >= 9.0 ? 'CRITICAL SEVERITY' : 'HIGH SEVERITY'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Attack Vector (AV)</label>
              <select value={av} onChange={(e) => setAv(e.target.value)} className="cyber-input">
                <option value="N">Network (AV:N)</option>
                <option value="A">Adjacent (AV:A)</option>
                <option value="L">Local (AV:L)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Attack Complexity (AC)</label>
              <select value={ac} onChange={(e) => setAc(e.target.value)} className="cyber-input">
                <option value="L">Low (AC:L)</option>
                <option value="H">High (AC:H)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Privileges Required (PR)</label>
              <select value={pr} onChange={(e) => setPr(e.target.value)} className="cyber-input">
                <option value="N">None (PR:N)</option>
                <option value="L">Low (PR:L)</option>
                <option value="H">High (PR:H)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>User Interaction (UI)</label>
              <select value={ui} onChange={(e) => setUi(e.target.value)} className="cyber-input">
                <option value="R">Required (UI:R)</option>
                <option value="N">None (UI:N)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* CVE Lookup View */}
      {activeTool === 'cve' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>CVE / CWE Vulnerability Intelligence Search</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <input
              type="text"
              className="cyber-input"
              value={cveSearch}
              onChange={(e) => setCveSearch(e.target.value)}
              placeholder="e.g. CVE-2024-3094"
            />
          </div>

          {cveData[cveSearch] ? (
            <div style={{ background: 'rgba(7, 10, 19, 0.6)', border: '1px solid var(--border-muted)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                {cveSearch}: {cveData[cveSearch].title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--status-danger)', fontWeight: 700, marginBottom: '8px' }}>
                Severity: {cveData[cveSearch].severity} | {cveData[cveSearch].cwe}
              </p>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {cveData[cveSearch].desc}
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Try searching <code>CVE-2024-3094</code> or <code>CVE-2023-38606</code>.</p>
          )}
        </div>
      )}

      {/* YARA & Sigma Rules View */}
      {activeTool === 'yara' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>YARA Threat Hunting Rule Definition</h3>
          <pre style={{ background: '#070a13', border: '1px solid var(--border-muted)', padding: '20px', borderRadius: '12px', color: '#00f2fe', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', overflowX: 'auto' }}>
{`rule CyberShield_Phishing_BrandSpoof {
    meta:
        description = "Detects Typosquatting Brand Spoofing in Phishing Links"
        author = "CyberShield SOC Team"
        date = "2026-08-01"
        severity = "HIGH"

    strings:
        $brand1 = "amaz0n-login" nocase
        $brand2 = "paytm-secure" nocase
        $brand3 = "statebank-login" nocase
        $eval = "eval(unescape(" nocase

    condition:
        any of ($brand*) or $eval
}`}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SecurityToolsView;
