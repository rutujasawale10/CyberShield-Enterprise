import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  if (type === 'table') {
    return (
      <div style={{ width: '100%', padding: '16px' }} className="glass-panel">
        <div style={{ height: '24px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', marginBottom: '16px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              height: '40px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '6px',
              marginBottom: '10px',
              animation: `skeleton-pulse 1.5s infinite ease-in-out ${i * 0.15}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="glass-panel" style={{ padding: '24px', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '12px' }}>
        <div style={{ height: '20px', width: '40%', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', marginBottom: 'auto' }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '140px' }}>
          {[60, 85, 45, 95, 70].map((h, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: `${h}%`,
                background: 'rgba(0, 242, 254, 0.12)',
                borderRadius: '8px 8px 0 0',
                animation: `skeleton-pulse 1.5s infinite ease-in-out ${idx * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-panel"
          style={{
            padding: '24px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: `skeleton-pulse 1.5s infinite ease-in-out ${i * 0.1}s`
          }}
        >
          <div style={{ width: '60%' }}>
            <div style={{ height: '14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', marginBottom: '12px' }} />
            <div style={{ height: '32px', width: '70%', background: 'rgba(0, 242, 254, 0.15)', borderRadius: '6px' }} />
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)' }} />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
