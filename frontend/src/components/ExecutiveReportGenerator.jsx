import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, Activity, Flame, CheckCircle2 } from 'lucide-react';
import { downloadDirectPDFReport } from '../services/api';

const ExecutiveReportGenerator = () => {
  const [downloading, setDownloading] = useState(false);
  const [timeframe, setTimeframe] = useState('30d');

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadDirectPDFReport('http://amaz0n-login.xyz');
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '4px' }}>Executive Threat & Compliance PDF Report Generator</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Generate C-level executive summaries, threat vector breakdowns, and compliance PDF audits.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="cyber-input" style={{ width: '130px' }}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button onClick={handleDownload} className="btn-cyber" disabled={downloading} style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
            <Download size={16} /> {downloading ? 'Compiling PDF...' : 'Download Executive Report PDF'}
          </button>
        </div>
      </div>

      {/* Report Preview Panel */}
      <div style={{ background: 'rgba(5, 8, 22, 0.7)', border: '1px solid var(--border-muted)', borderRadius: '12px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-muted)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-admin">CYBERSHIELD ENTERPRISE EXECUTIVE BRIEF</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '6px' }}>CISO Monthly Cyber Threat Summary</h4>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PERIOD: AUGUST 2026</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Scans Intercepted</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>1,482</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Phishing Campaigns Blocked</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--status-danger)' }}>624</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mean Time To Intercept (MTTI)</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--status-safe)' }}>&lt;1.2s</p>
          </div>
        </div>

        <div style={{ lineHeight: '1.6', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
          <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>Executive Narrative</h5>
          <p>
            During the evaluated 30-day reporting window, CyberShield Enterprise intercepted <strong>1,482</strong> target URL analysis requests across enterprise network endpoints.
            The Random Forest machine learning classifier, coupled with 25+ extracted lexical parameters and 15 threat intelligence feeds, successfully neutralized <strong>624</strong> high-severity phishing campaigns before end-user credential submission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveReportGenerator;
