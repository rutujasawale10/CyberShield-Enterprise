import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

const DetectionReasons = ({ reasons = [], status = 'Safe' }) => {
  const isPhishing = status === 'Phishing';
  const isSuspicious = status === 'Suspicious';

  return (
    <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        {isPhishing ? (
          <ShieldAlert size={22} color="var(--status-danger)" />
        ) : isSuspicious ? (
          <AlertTriangle size={22} color="var(--status-warning)" />
        ) : (
          <CheckCircle2 size={22} color="var(--status-safe)" />
        )}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          Detection Analysis & Security Reasons
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {reasons.map((reason, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: isPhishing
                ? 'rgba(255, 8, 68, 0.08)'
                : isSuspicious
                ? 'rgba(255, 171, 0, 0.08)'
                : 'rgba(0, 230, 118, 0.08)',
              borderLeft: `4px solid ${
                isPhishing
                  ? 'var(--status-danger)'
                  : isSuspicious
                  ? 'var(--status-warning)'
                  : 'var(--status-safe)'
              }`
            }}
          >
            <span style={{
              fontWeight: 700,
              color: isPhishing
                ? 'var(--status-danger)'
                : isSuspicious
                ? 'var(--status-warning)'
                : 'var(--status-safe)'
            }}>
              ✔
            </span>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
              {reason}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetectionReasons;
