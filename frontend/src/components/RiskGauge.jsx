import React from 'react';

const RiskGauge = ({ score = 0, status = 'Safe' }) => {
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#00e676'; // Safe
  let glowColor = 'rgba(0, 230, 118, 0.4)';

  if (status === 'Phishing' || score >= 70) {
    strokeColor = '#ff0844'; // Phishing
    glowColor = 'rgba(255, 8, 68, 0.5)';
  } else if (status === 'Suspicious' || score >= 40) {
    strokeColor = '#ffab00'; // Suspicious
    glowColor = 'rgba(255, 171, 0, 0.4)';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '180px', height: '180px' }}>
        <svg height="180" width="180" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            stroke="rgba(255, 255, 255, 0.08)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx="90"
            cy="90"
          />
          {/* Progress circle */}
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="90"
            cy="90"
            filter={`drop-shadow(0 0 8px ${glowColor})`}
          />
        </svg>

        {/* Center score text */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: strokeColor, fontFamily: 'var(--font-mono)' }}>
            {score}%
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Risk Score
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
