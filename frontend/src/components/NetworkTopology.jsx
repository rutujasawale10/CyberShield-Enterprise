import React from 'react';
import { Network, Server, ShieldCheck, Database, Globe, Laptop, Radio } from 'lucide-react';

const NetworkTopology = () => {
  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Network size={22} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            Enterprise Network Infrastructure & Security Topology
          </h3>
        </div>
        <span className="badge badge-admin" style={{ fontFamily: 'var(--font-mono)' }}>
          <Radio size={14} /> ACTIVE PACKET TRAFFIC RADAR
        </span>
      </div>

      {/* SVG Network Topology Map */}
      <div style={{ background: 'rgba(5, 8, 22, 0.85)', borderRadius: '16px', border: '1px solid var(--border-muted)', padding: '20px', overflowX: 'auto' }}>
        <svg viewBox="0 0 800 240" width="100%" height="240" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="netGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Connection Cables */}
          <line x1="120" y1="120" x2="260" y2="120" stroke="#00D9FF" strokeWidth="2.5" strokeDasharray="6 6" />
          <line x1="260" y1="120" x2="420" y2="120" stroke="#00D9FF" strokeWidth="2.5" />
          <line x1="420" y1="120" x2="580" y2="120" stroke="#00D9FF" strokeWidth="2.5" />
          <line x1="580" y1="120" x2="700" y2="120" stroke="#00D9FF" strokeWidth="2.5" strokeDasharray="6 6" />

          {/* Animated Traffic Packet Dots */}
          <circle cx="190" cy="120" r="4" fill="#00D9FF" className="map-pulse-ring" />
          <circle cx="340" cy="120" r="4" fill="#00E676" className="map-pulse-ring" />
          <circle cx="500" cy="120" r="4" fill="#FFC107" className="map-pulse-ring" />
          <circle cx="640" cy="120" r="4" fill="#FF3D71" className="map-pulse-ring" />

          {/* Node 1: External Internet */}
          <g transform="translate(100, 120)">
            <circle cx="0" cy="0" r="32" fill="rgba(0, 217, 255, 0.1)" stroke="var(--accent-cyan)" strokeWidth="2" />
            <Globe x="-14" y="-14" size={28} color="var(--accent-cyan)" />
            <text x="0" y="48" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">External WAN</text>
          </g>

          {/* Node 2: Perimeter Firewall */}
          <g transform="translate(260, 120)">
            <circle cx="0" cy="0" r="32" fill="rgba(255, 61, 113, 0.12)" stroke="var(--status-danger)" strokeWidth="2" />
            <ShieldCheck x="-14" y="-14" size={28} color="var(--status-danger)" />
            <text x="0" y="48" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">SOC Firewall</text>
          </g>

          {/* Node 3: App Server Cluster */}
          <g transform="translate(420, 120)">
            <circle cx="0" cy="0" r="32" fill="rgba(139, 92, 246, 0.12)" stroke="var(--accent-purple)" strokeWidth="2" />
            <Server x="-14" y="-14" size={28} color="var(--accent-purple)" />
            <text x="0" y="48" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">FastAPI Engine</text>
          </g>

          {/* Node 4: Database Cluster */}
          <g transform="translate(580, 120)">
            <circle cx="0" cy="0" r="32" fill="rgba(0, 230, 118, 0.12)" stroke="var(--status-safe)" strokeWidth="2" />
            <Database x="-14" y="-14" size={28} color="var(--status-safe)" />
            <text x="0" y="48" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">Postgres DB</text>
          </g>

          {/* Node 5: Enterprise Clients */}
          <g transform="translate(700, 120)">
            <circle cx="0" cy="0" r="32" fill="rgba(255, 193, 7, 0.12)" stroke="var(--status-warning)" strokeWidth="2" />
            <Laptop x="-14" y="-14" size={28} color="var(--status-warning)" />
            <text x="0" y="48" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">SOC Console</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default NetworkTopology;
