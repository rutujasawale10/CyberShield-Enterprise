import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const XAIExplanation = ({ attributions = [], confidence = 95.0 }) => {
  if (!attributions || attributions.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Brain size={22} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Explainable AI (XAI) Feature Attribution
          </h3>
        </div>

        <div className="badge" style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan)' }}>
          <Sparkles size={14} /> AI Confidence: {confidence}%
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
        Attribution weights indicating the exact impact of security parameter signals on the AI model's risk score.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {attributions.map((item, idx) => (
          <div key={idx} style={{ background: 'rgba(7, 10, 19, 0.6)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: 600 }}>{item.feature}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                {item.percentage}% Impact
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${item.percentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)',
                  borderRadius: '4px',
                  transition: 'width 1s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default XAIExplanation;
