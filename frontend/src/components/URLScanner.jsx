import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, FileText, Download, Clipboard, Copy, ShieldCheck, Zap } from 'lucide-react';
import { scanURL, downloadDirectPDFReport } from '../services/api';
import RiskGauge from './RiskGauge';
import DetectionReasons from './DetectionReasons';
import FeatureBreakdown from './FeatureBreakdown';
import XAIExplanation from './XAIExplanation';
import ThreatIntelCard from './ThreatIntelCard';

const URLScanner = ({ showToast }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleURLs = [
    { label: 'Fake Amazon', url: 'http://amaz0n-login.xyz' },
    { label: 'Fake Paytm', url: 'http://paytm-secure-login.xyz' },
    { label: 'Fake SBI Netbanking', url: 'http://statebank-login.net' },
    { label: 'Legitimate Google', url: 'https://www.google.com' },
    { label: 'Legitimate Paytm', url: 'https://www.paytm.com' },
  ];

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch (err) {
      if (showToast) showToast('warning', 'Clipboard access denied or unavailable.');
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const summaryText = `[CYBERSHIELD ENTERPRISE AUDIT REPORT]\nURL: ${result.url}\nStatus: ${result.status}\nRisk Score: ${result.risk_score}%\nConfidence: ${result.confidence || result.confidence_score || '95%'}\nTop Reason: ${result.reasons && result.reasons.length > 0 ? result.reasons[0] : 'None'}`;
    navigator.clipboard.writeText(summaryText);
    if (showToast) showToast('success', 'Summary Audit Report copied to clipboard!');
  };

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await scanURL(url.trim());
      setResult(data);
      if (showToast) {
        if (data.status === 'Phishing') {
          showToast('error', `Phishing Threat Detected! Risk Score: ${data.risk_score}%`);
        } else if (data.status === 'Suspicious') {
          showToast('warning', `Suspicious Target URL! Risk Score: ${data.risk_score}%`);
        } else {
          showToast('success', `Domain Verified Safe! Risk Score: ${data.risk_score}%`);
        }
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || 'Failed to scan URL. Ensure backend FastAPI server is running on port 8000.';
      setError(errMsg);
      if (showToast) showToast('error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!url.trim()) return;
    setPdfDownloading(true);
    if (showToast) showToast('info', 'Generating PDF Audit Report...');
    try {
      await downloadDirectPDFReport(url.trim());
      if (showToast) showToast('success', 'PDF Audit Report downloaded successfully.');
    } catch (err) {
      console.error(err);
      if (showToast) showToast('error', 'Failed to generate PDF Report.');
      else alert('Failed to generate PDF Report.');
    } finally {
      setPdfDownloading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
          Enterprise <span className="text-gradient">AI Threat Detection</span> Engine
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto' }}>
          Analyze domain structures, Explainable AI (XAI) feature attributions, and VirusTotal threat intelligence in real-time.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <form onSubmit={handleScan} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="cyber-input"
              placeholder="Enter target URL (e.g. http://amaz0n-login.xyz)..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="button" onClick={handlePasteClipboard} className="btn-secondary" title="Paste URL from Clipboard">
              <Clipboard size={16} /> Paste
            </button>
          </div>
          <button type="submit" className="btn-cyber" disabled={loading || !url.trim()} style={{ padding: '12px 28px', boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)' }}>
            {loading ? (
              <>
                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...
              </>
            ) : (
              <>
                <Search size={18} /> Analyze Target URL
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Try Benchmark Samples:</span>
          {sampleURLs.map((sample, idx) => (
            <button key={idx} className="sample-pill" onClick={() => setUrl(sample.url)}>
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--status-danger-bg)', border: '1px solid rgba(255, 8, 68, 0.3)', color: 'var(--status-danger)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className={`glass-panel ${result.status === 'Phishing' ? 'pulse-phishing' : ''}`} style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-muted)', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Target Domain Analyzed</p>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{result.url}</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={handleCopyReport} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
                <Copy size={14} /> Copy Summary
              </button>
              <button onClick={handleDownloadPDF} className="btn-cyber" style={{ background: 'rgba(0, 242, 254, 0.15)', color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan)', fontSize: '0.85rem', padding: '8px 16px' }} disabled={pdfDownloading}>
                <Download size={14} /> {pdfDownloading ? 'Generating PDF...' : 'Download PDF Audit Report'}
              </button>

              {result.status === 'Phishing' && <div className="badge badge-phishing"><ShieldAlert size={16} /> ❌ Phishing Website</div>}
              {result.status === 'Safe' && <div className="badge badge-safe"><CheckCircle2 size={16} /> ✅ Safe Website</div>}
              {result.status === 'Suspicious' && <div className="badge badge-suspicious"><AlertTriangle size={16} /> ⚠️ Suspicious Website</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <RiskGauge score={result.risk_score} status={result.status} />
            <DetectionReasons reasons={result.reasons} status={result.status} />
          </div>

          {/* Action Recommendation Card */}
          <div style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-muted)', marginTop: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Zap size={18} color={result.status === 'Phishing' ? 'var(--status-danger)' : result.status === 'Suspicious' ? 'var(--status-warning)' : 'var(--status-safe)'} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>SOC Recommended Action Protocol</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {result.status === 'Phishing' && 'IMMEDIATE ACTION REQUIRED: Block domain at perimeter firewall, add URL to DNS sinkhole, and notify security operations center.'}
              {result.status === 'Suspicious' && 'RECOMMENDED ACTION: Quarantine target URL in sandbox environment, inspect SSL certificate validity, and monitor user access.'}
              {result.status === 'Safe' && 'VERIFIED SAFE: No threat vectors detected. Domain cleared for enterprise user navigation.'}
            </p>
          </div>

          {/* Explainable AI (XAI) Attribution Component */}
          <XAIExplanation attributions={result.xai_attribution} confidence={result.confidence_score} />

          {/* Multi-Source Threat Intelligence Card */}
          <ThreatIntelCard threatIntel={result.threat_intel} />

          {/* Feature Breakdown Accordion */}
          <FeatureBreakdown features={result.extracted_features} />
        </div>
      )}
    </div>
  );
};

export default URLScanner;
