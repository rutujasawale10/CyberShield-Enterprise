import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-muted)',
      background: 'rgba(7, 10, 19, 0.95)',
      padding: '32px 24px',
      marginTop: '64px',
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck color="var(--accent-cyan)" size={20} />
          <span>Phishing Website Detection System — Final Year Capstone Project</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} color="var(--status-safe)" /> Scikit-Learn ML Model
          </span>
          <span>•</span>
          <span>FastAPI Backend</span>
          <span>•</span>
          <span>React Dashboard</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
