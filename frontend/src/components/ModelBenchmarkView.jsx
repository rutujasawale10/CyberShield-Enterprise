import React, { useState, useEffect } from 'react';
import { Cpu, Trophy, Sparkles, RefreshCw } from 'lucide-react';
import { getModelBenchmarks } from '../services/api';
import SkeletonLoader from './SkeletonLoader';

const ModelBenchmarkView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        const res = await getModelBenchmarks();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBenchmarks();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
        <SkeletonLoader type="table" count={4} />
      </div>
    );
  }

  const bestModel = data?.best_model || 'Random Forest';
  const modelsDict = data?.models || {};

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Multi-Model <span className="text-gradient">ML Benchmarking Engine</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Automated model evaluation comparing Random Forest, Gradient Boosting (XGBoost), Extra Trees, Decision Tree, and Logistic Regression.
          </p>
        </div>

        <div className="badge" style={{ background: 'rgba(0, 242, 254, 0.15)', color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan)', padding: '10px 18px', fontSize: '0.9rem' }}>
          <Trophy size={18} /> Best Model Active: {bestModel}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-panel" style={{ padding: '28px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Cpu size={22} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            ML Classification Performance Comparison Table
          </h3>
        </div>

        <table className="cyber-table">
          <thead>
            <tr>
              <th>ML Algorithm Name</th>
              <th>Accuracy (%)</th>
              <th>Precision (%)</th>
              <th>Recall (%)</th>
              <th>F1-Score (%)</th>
              <th>ROC-AUC Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(modelsDict).map(([modelName, metrics], idx) => {
              const isBest = modelName === bestModel;
              return (
                <tr key={idx} style={{ background: isBest ? 'rgba(0, 242, 254, 0.06)' : 'transparent' }}>
                  <td style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isBest && <Sparkles size={16} color="var(--accent-cyan)" />}
                    {modelName}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{metrics.accuracy}%</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{metrics.precision}%</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{metrics.recall}%</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-cyan)' }}>{metrics.f1_score}%</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{metrics.roc_auc}</td>
                  <td>
                    {isBest ? (
                      <span className="badge badge-safe"><Trophy size={12} /> Active Primary</span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-muted)' }}>Evaluated</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelBenchmarkView;
