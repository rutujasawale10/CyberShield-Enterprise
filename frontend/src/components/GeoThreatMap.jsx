import React from 'react';
import { Globe, ShieldAlert, Radio } from 'lucide-react';

const GeoThreatMap = ({ nodes = [] }) => {
  const defaultNodes = [
    { country: 'United States', country_code: 'US', threat_count: 54, cx: 160, cy: 110, color: 'var(--status-danger)' },
    { country: 'Germany / EU', country_code: 'DE', threat_count: 38, cx: 370, cy: 95, color: 'var(--status-warning)' },
    { country: 'Russia', country_code: 'RU', threat_count: 62, cx: 470, cy: 75, color: 'var(--status-danger)' },
    { country: 'China', country_code: 'CN', threat_count: 48, cx: 530, cy: 120, color: 'var(--status-danger)' },
    { country: 'Japan', country_code: 'JP', threat_count: 22, cx: 585, cy: 115, color: 'var(--status-safe)' },
    { country: 'India', country_code: 'IN', threat_count: 31, cx: 480, cy: 140, color: 'var(--status-warning)' },
    { country: 'Brazil', country_code: 'BR', threat_count: 29, cx: 230, cy: 180, color: 'var(--status-warning)' },
    { country: 'Australia', country_code: 'AU', threat_count: 14, cx: 580, cy: 200, color: 'var(--status-safe)' }
  ];

  const activeNodes = nodes && nodes.length > 0 ? nodes.map((n, idx) => ({
    ...n,
    cx: defaultNodes[idx % defaultNodes.length].cx,
    cy: defaultNodes[idx % defaultNodes.length].cy,
    color: n.threat_count > 40 ? 'var(--status-danger)' : n.threat_count > 25 ? 'var(--status-warning)' : 'var(--status-safe)'
  })) : defaultNodes;

  return (
    <div className="glass-panel" style={{ padding: '28px', marginTop: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe size={22} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            Global Geographic Threat Distribution Map
          </h3>
        </div>
        <span className="badge badge-admin" style={{ fontFamily: 'var(--font-mono)' }}>
          <Radio size={14} /> LIVE INTERCEPT RADAR
        </span>
      </div>

      <div style={{ background: 'rgba(5, 8, 22, 0.8)', borderRadius: '16px', border: '1px solid var(--border-muted)', padding: '16px', marginBottom: '20px', overflowX: 'auto' }}>
        <svg viewBox="0 0 700 260" width="100%" height="260" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="mapBgGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#050816" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="700" height="260" fill="url(#mapBgGrad)" />

          <line x1="0" y1="65" x2="700" y2="65" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="0" y1="130" x2="700" y2="130" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="0" y1="195" x2="700" y2="195" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />

          <line x1="175" y1="0" x2="175" y2="260" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="350" y1="0" x2="350" y2="260" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="525" y1="0" x2="525" y2="260" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />

          <path d="M 100,70 Q 140,50 200,80 T 170,140 T 110,110 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,217,255,0.2)" strokeWidth="1" />
          <path d="M 210,150 Q 250,170 230,230 T 190,190 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,217,255,0.2)" strokeWidth="1" />
          <path d="M 340,60 Q 450,40 580,70 T 560,150 T 420,130 T 350,90 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,217,255,0.2)" strokeWidth="1" />
          <path d="M 330,110 Q 390,120 370,200 T 320,160 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,217,255,0.2)" strokeWidth="1" />
          <path d="M 540,180 Q 610,170 590,220 T 530,200 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,217,255,0.2)" strokeWidth="1" />

          {activeNodes.map((node, idx) => (
            <g key={idx}>
              <circle cx={node.cx} cy={node.cy} fill="none" stroke={node.color} className="map-pulse-ring" />
              <circle cx={node.cx} cy={node.cy} r="4" fill={node.color} />
              <text x={node.cx + 8} y={node.cy + 4} fill="var(--text-main)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="700">
                {node.country_code} ({node.threat_count})
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {activeNodes.map((node, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(7, 10, 19, 0.6)',
              border: '1px solid var(--border-muted)',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between'
            }}
          >
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '2px' }}>{node.country}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                NODE: #{idx + 1}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge" style={{ fontSize: '0.75rem', background: node.color === 'var(--status-danger)' ? 'rgba(255,61,113,0.15)' : 'rgba(255,193,7,0.15)', color: node.color }}>
                <ShieldAlert size={12} /> {node.threat_count} Targets
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeoThreatMap;
