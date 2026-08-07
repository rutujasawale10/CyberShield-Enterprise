import React, { useState } from 'react';
import { Terminal, Search, Download, ShieldAlert, CheckCircle2, AlertTriangle, Filter } from 'lucide-react';

const SIEMLogViewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sevFilter, setSevFilter] = useState('ALL');

  const [logs] = useState([
    { id: 'LOG-9081', timestamp: '2026-08-07 15:10:42', ip: '192.168.1.105', country: 'RU', username: 'admin@cybershield.org', threat: 'Typosquatting Brand Spoofing', severity: 'CRITICAL', action: 'BLOCKED' },
    { id: 'LOG-9080', timestamp: '2026-08-07 15:08:15', ip: '10.0.2.14', country: 'US', username: 'analyst1@cybershield.org', threat: 'Insecure HTTP Protocol', severity: 'MEDIUM', action: 'FLAGGED' },
    { id: 'LOG-9079', timestamp: '2026-08-07 14:55:01', ip: '172.16.0.4', country: 'DE', username: 'user@company.com', threat: 'Legitimate Verified Navigation', severity: 'LOW', action: 'ALLOWED' },
    { id: 'LOG-9078', timestamp: '2026-08-07 14:32:10', ip: '192.168.1.88', country: 'IN', username: 'sec_admin', threat: 'Credential Harvesting Link', severity: 'HIGH', action: 'BLOCKED' },
    { id: 'LOG-9077', timestamp: '2026-08-07 14:15:33', ip: '10.0.2.99', country: 'CN', username: 'guest_user', threat: 'High String Entropy Domain', severity: 'HIGH', action: 'SINKHOLED' }
  ]);

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.ip.includes(searchTerm) || log.username.toLowerCase().includes(searchTerm.toLowerCase()) || log.threat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSev = sevFilter === 'ALL' || log.severity === sevFilter;
    return matchSearch && matchSev;
  });

  const handleExportCSV = () => {
    const csvRows = ['ID,Timestamp,IP,Country,Username,Threat,Severity,Action'];
    filteredLogs.forEach(l => csvRows.push(`${l.id},${l.timestamp},${l.ip},${l.country},${l.username},"${l.threat}",${l.severity},${l.action}`));
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybershield_siem_logs_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '4px' }}>Enterprise SIEM Security Event Log Viewer</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Real-time SIEM event logs, threat severity filtering, IP tracing, and CSV audit exporting.</p>
        </div>
        <button onClick={handleExportCSV} className="btn-cyber" style={{ fontSize: '0.85rem', padding: '10px 18px' }}>
          <Download size={15} /> Export SIEM Logs CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="cyber-input"
          style={{ flex: 1, minWidth: '240px' }}
          placeholder="Filter by IP, username, or threat name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sevFilter} onChange={(e) => setSevFilter(e.target.value)} className="cyber-input" style={{ width: '160px' }}>
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
      </div>

      {/* SIEM Logs Data Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table className="cyber-table">
          <thead>
            <tr>
              <th>Log Event ID</th>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>Country</th>
              <th>User Context</th>
              <th>Threat Vector</th>
              <th>Severity</th>
              <th>SOC Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(l => (
              <tr key={l.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>{l.id}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{l.timestamp}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 600 }}>{l.ip}</td>
                <td><span className="badge">{l.country}</span></td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{l.username}</td>
                <td style={{ fontSize: '0.88rem', fontWeight: 600 }}>{l.threat}</td>
                <td>
                  <span className={`badge ${l.severity === 'CRITICAL' || l.severity === 'HIGH' ? 'badge-phishing' : l.severity === 'MEDIUM' ? 'badge-suspicious' : 'badge-safe'}`}>
                    {l.severity}
                  </span>
                </td>
                <td>
                  <span className={`badge ${l.action === 'BLOCKED' || l.action === 'SINKHOLED' ? 'badge-phishing' : l.action === 'FLAGGED' ? 'badge-suspicious' : 'badge-safe'}`}>
                    {l.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SIEMLogViewer;
