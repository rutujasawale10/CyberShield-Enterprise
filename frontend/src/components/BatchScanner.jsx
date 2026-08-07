import React, { useState } from 'react';
import { Layers, Play, CheckCircle2, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';
import { scanBatchURLs } from '../services/api';

const BatchScanner = ({ showToast }) => {
  const [urlsInput, setUrlsInput] = useState(
    'http://amaz0n-login.xyz\nhttp://paytm-secure-login.xyz\nhttps://www.google.com\nhttp://statebank-login.net\nhttps://www.github.com'
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleBatchScan = async () => {
    const urls = urlsInput
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await scanBatchURLs(urls);
      setResults(data);
      if (showToast) showToast('success', `Batch Scan Complete! ${data.length} URLs analyzed.`);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || 'Failed batch scan.';
      setError(errMsg);
      if (showToast) showToast('error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Batch <span className="text-gradient">URL Scanner</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Scan multiple target URLs simultaneously (Max 50 per batch). Ideal for bulk threat analysis.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
          Enter Target URLs (One URL per line):
        </label>
        <textarea
          rows={6}
          className="cyber-input"
          style={{ resize: 'vertical' }}
          value={urlsInput}
          onChange={(e) => setUrlsInput(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button className="btn-cyber" onClick={handleBatchScan} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing Batch...
              </>
            ) : (
              <>
                <Play size={18} /> Execute Batch Scan
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--status-danger-bg)', padding: '16px', borderRadius: '12px', color: 'var(--status-danger)', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
            Batch Scan Results ({results.length} Scanned)
          </h3>
          <table className="cyber-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Domain</th>
                <th>Status</th>
                <th>Risk Score</th>
                <th>Top Detection Reason</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{res.url}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{res.domain}</td>
                  <td>
                    {res.status === 'Phishing' && (
                      <span className="badge badge-phishing"><ShieldAlert size={14} /> Phishing</span>
                    )}
                    {res.status === 'Safe' && (
                      <span className="badge badge-safe"><CheckCircle2 size={14} /> Safe</span>
                    )}
                    {res.status === 'Suspicious' && (
                      <span className="badge badge-suspicious"><AlertTriangle size={14} /> Suspicious</span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: res.risk_score >= 70 ? 'var(--status-danger)' : res.risk_score >= 40 ? 'var(--status-warning)' : 'var(--status-safe)' }}>
                    {res.risk_score}%
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {res.reasons && res.reasons.length > 0 ? res.reasons[0] : 'None'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BatchScanner;
