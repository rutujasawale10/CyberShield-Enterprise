import React, { useState } from 'react';
import { ShieldAlert, Plus, UserCheck, Clock, FileText, Download, CheckCircle2, AlertTriangle } from 'lucide-react';

const IncidentDashboard = () => {
  const [incidents, setIncidents] = useState([
    { id: 'INC-2026-089', title: 'Credential Harvesting Campaign target amaz0n-login.xyz', analyst: 'Elena Rostova', priority: 'CRITICAL', status: 'In Progress', date: '2026-08-07 14:22', evidence: 'http://amaz0n-login.xyz, SHA256: e3b0c442...', notes: 'Perimeter firewall rule deployed. User sessions terminated.' },
    { id: 'INC-2026-088', title: 'Suspicious Subdomain Registration paytm-secure.xyz', analyst: 'Dr. Alex Vance', priority: 'HIGH', status: 'Open', date: '2026-08-07 12:10', evidence: 'IP: 192.168.1.105, DNS A Record modified', notes: 'DNS sinkhole request sent to provider.' },
    { id: 'INC-2026-087', title: 'HTTP Typosquatting Intercept statebank-login.net', analyst: 'Marcus Chen', priority: 'MEDIUM', status: 'Resolved', date: '2026-08-06 18:45', evidence: 'URL: http://statebank-login.net', notes: 'Verified benign honeypot redirect.' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [analyst, setAnalyst] = useState('Elena Rostova');
  const [priority, setPriority] = useState('HIGH');
  const [evidence, setEvidence] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newInc = {
      id: `INC-2026-09${incidents.length + 1}`,
      title: title.trim(),
      analyst,
      priority,
      status: 'Open',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      evidence: evidence.trim() || 'URL scan intercept',
      notes: 'Initial investigation ticket created.'
    };

    setIncidents([newInc, ...incidents]);
    setTitle('');
    setEvidence('');
    setShowModal(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '4px' }}>Incident Response & Case Management</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Track SOC security incidents, assign analysts, document evidence, and export compliance reports.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-cyber" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
          <Plus size={16} /> Create Incident Ticket
        </button>
      </div>

      {/* Incidents Table Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table className="cyber-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Incident Title</th>
              <th>Assigned Analyst</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(inc => (
              <tr key={inc.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>{inc.id}</td>
                <td style={{ fontWeight: 600 }}>{inc.title}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><UserCheck size={14} /> {inc.analyst}</span>
                </td>
                <td>
                  <span className={`badge ${inc.priority === 'CRITICAL' || inc.priority === 'HIGH' ? 'badge-phishing' : 'badge-suspicious'}`}>
                    {inc.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${inc.status === 'Resolved' ? 'badge-safe' : 'badge-admin'}`}>
                    {inc.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{inc.date}</td>
                <td>
                  <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => alert(`Exporting PDF Audit for Ticket ${inc.id}...`)}>
                    <Download size={12} /> Export PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(5, 8, 22, 0.85)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '32px', border: '1px solid var(--accent-cyan)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Create New SOC Security Incident</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Incident Title</label>
                <input type="text" className="cyber-input" required placeholder="e.g. Phishing Domain Intercept..." value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Assigned Analyst</label>
                  <select value={analyst} onChange={(e) => setAnalyst(e.target.value)} className="cyber-input">
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Dr. Alex Vance">Dr. Alex Vance</option>
                    <option value="Marcus Chen">Marcus Chen</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Severity Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className="cyber-input">
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Evidence / Target URL</label>
                <input type="text" className="cyber-input" placeholder="e.g. http://amaz0n-login.xyz..." value={evidence} onChange={(e) => setEvidence(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-cyber">Save & Create Incident</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDashboard;
