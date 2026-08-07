import React, { useState, useEffect } from 'react';
import { History, Download, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { getScanHistory, getCSVExportURL } from '../services/api';
import SkeletonLoader from './SkeletonLoader';

const HistoryTable = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getScanHistory(filter ? filter : null);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Scan <span className="text-gradient">Audit Logs</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Historical logs of scanned domain targets stored in database.</p>
        </div>

        <a href={getCSVExportURL()} download className="btn-cyber" style={{ textDecoration: 'none' }}>
          <Download size={18} /> Export Audit CSV
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['', 'Phishing', 'Safe', 'Suspicious'].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => setFilter(statusOption)}
              style={{
                background: filter === statusOption ? 'rgba(0, 242, 254, 0.2)' : 'transparent',
                color: filter === statusOption ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: filter === statusOption ? '1px solid var(--accent-cyan)' : '1px solid var(--border-muted)',
                padding: '6px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              {statusOption === '' ? 'All Logs' : statusOption}
            </button>
          ))}
        </div>

        <button onClick={fetchLogs} style={{ background: 'transparent', border: '1px solid var(--border-muted)', color: 'var(--text-muted)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Logs Table */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        {loading ? (
          <SkeletonLoader type="table" count={5} />
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No scan records found matching filter.</div>
        ) : (
          <table className="cyber-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>URL Target</th>
                <th>Domain</th>
                <th>Status</th>
                <th>Risk Score</th>
                <th>Scan Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>#{log.id}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.url}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{log.domain}</td>
                  <td>
                    {log.status === 'Phishing' && <span className="badge badge-phishing"><ShieldAlert size={14} /> Phishing</span>}
                    {log.status === 'Safe' && <span className="badge badge-safe"><CheckCircle2 size={14} /> Safe</span>}
                    {log.status === 'Suspicious' && <span className="badge badge-suspicious"><AlertTriangle size={14} /> Suspicious</span>}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: log.risk_score >= 70 ? 'var(--status-danger)' : log.risk_score >= 40 ? 'var(--status-warning)' : 'var(--status-safe)' }}>
                    {log.risk_score}%
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {log.scan_date ? new Date(log.scan_date).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryTable;
