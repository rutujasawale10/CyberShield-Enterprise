import React, { useState, useEffect } from 'react';
import { Radio, ShieldAlert, AlertTriangle, CheckCircle2, Pause, Play, Filter } from 'lucide-react';

const ThreatFeedTicker = () => {
  const [filter, setFilter] = useState('ALL');
  const [isPaused, setIsPaused] = useState(false);
  const [feedItems, setFeedItems] = useState([
    { id: 1, time: '12:42:15', country: 'US', url: 'http://amaz0n-login.xyz', type: 'Phishing', score: 94.5, source: 'Scikit-Learn ML' },
    { id: 2, time: '12:41:50', country: 'DE', url: 'http://paypal-security-update.info', type: 'Phishing', score: 96.2, source: 'VirusTotal' },
    { id: 3, time: '12:40:10', country: 'JP', url: 'https://www.google.com', type: 'Safe', score: 4.2, source: 'Google Safe Browsing' },
    { id: 4, time: '12:38:05', country: 'IN', url: 'http://statebank-login.net', type: 'Suspicious', score: 58.0, source: 'PhishTank' },
    { id: 5, time: '12:35:40', country: 'BR', url: 'http://account-verification-portal.com', type: 'Phishing', score: 91.8, source: 'Lexical Entropy' }
  ]);

  useEffect(() => {
    if (isPaused) return;

    const samplePool = [
      { country: 'US', url: 'http://appleid-check-security.com', type: 'Phishing', score: 97.4, source: 'VirusTotal v3' },
      { country: 'DE', url: 'http://internal-portal-dev.de', type: 'Safe', score: 8.5, source: 'Whitelist' },
      { country: 'RU', url: 'http://crypto-wallet-verify.xyz', type: 'Phishing', score: 98.9, source: 'Scikit-Learn ML' },
      { country: 'CN', url: 'http://banking-auth-session.top', type: 'Suspicious', score: 62.1, source: 'OpenPhish' }
    ];

    const interval = setInterval(() => {
      const item = samplePool[Math.floor(Math.random() * samplePool.length)];
      const newItem = {
        ...item,
        id: Date.now(),
        time: new Date().toLocaleTimeString()
      };
      setFeedItems(prev => [newItem, ...prev.slice(0, 15)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const filteredItems = feedItems.filter(item => {
    if (filter === 'ALL') return true;
    return item.type.toUpperCase() === filter;
  });

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radio size={18} color="var(--status-danger)" className="map-pulse-ring" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
            Real-Time Enterprise Cyber Threat Stream Ticker
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(5, 8, 22, 0.6)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
            {['ALL', 'PHISHING', 'SUSPICIOUS', 'SAFE'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  background: filter === cat ? 'linear-gradient(135deg, #00D9FF 0%, #3B82F6 100%)' : 'transparent',
                  color: filter === cat ? '#050816' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pause / Play Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            {isPaused ? <><Play size={12} /> Resume Ticker</> : <><Pause size={12} /> Pause Ticker</>}
          </button>
        </div>
      </div>

      {/* Feed Items Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            style={{
              background: 'rgba(5, 8, 22, 0.6)',
              border: '1px solid var(--border-muted)',
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              animation: 'slideInRight 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {item.type === 'Phishing' && <ShieldAlert color="var(--status-danger)" size={16} />}
              {item.type === 'Suspicious' && <AlertTriangle color="var(--status-warning)" size={16} />}
              {item.type === 'Safe' && <CheckCircle2 color="var(--status-safe)" size={16} />}

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>[{item.time}]</span>
              <span className="badge" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>{item.country}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#F8FAFC' }}>{item.url}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={`badge ${item.type === 'Phishing' ? 'badge-phishing' : item.type === 'Suspicious' ? 'badge-suspicious' : 'badge-safe'}`} style={{ fontSize: '0.72rem' }}>
                {item.type} ({item.score}%)
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{item.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatFeedTicker;
