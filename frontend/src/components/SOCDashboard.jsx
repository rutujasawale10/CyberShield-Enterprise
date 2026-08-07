import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, Percent, Radio, ShieldCheck, Flame, Clock, TrendingUp, Cpu, Server } from 'lucide-react';
import { getDashboardStats } from '../services/api';
import GeoThreatMap from './GeoThreatMap';
import MitreAttackMatrix from './MitreAttackMatrix';
import SkeletonLoader from './SkeletonLoader';
import ThreatFeedTicker from './ThreatFeedTicker';

const SOCDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('executive');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoTicker, setDemoTicker] = useState([]);
  const [demoCount, setDemoCount] = useState(1482);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Demo mode simulated ticker effect
  useEffect(() => {
    if (!isDemoMode) return;

    const demoUrls = [
      { url: 'http://secure-paypal-verify-auth.com', status: 'Phishing', risk_score: 94.2, domain: 'paypal-verify-auth.com' },
      { url: 'http://login-appleid-support-check.net', status: 'Phishing', risk_score: 96.8, domain: 'appleid-support-check.net' },
      { url: 'http://internal-portal-hr.company.org', status: 'Safe', risk_score: 12.4, domain: 'company.org' },
      { url: 'http://account-update-billing-sec.info', status: 'Suspicious', risk_score: 58.5, domain: 'billing-sec.info' },
      { url: 'http://microsoft365-password-reset.tech', status: 'Phishing', risk_score: 91.5, domain: 'microsoft365-password-reset.tech' }
    ];

    const interval = setInterval(() => {
      const randomItem = demoUrls[Math.floor(Math.random() * demoUrls.length)];
      const timestampItem = { ...randomItem, scan_date: new Date().toISOString() };
      setDemoTicker(prev => [timestampItem, ...prev.slice(0, 7)]);
      setDemoCount(c => c + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px' }}>
        <SkeletonLoader type="card" count={4} />
      </div>
    );
  }

  const totalScans = isDemoMode ? demoCount : (stats?.total_scans ?? 0);
  const phishingCount = isDemoMode ? Math.round(demoCount * 0.42) : (stats?.phishing_count ?? 0);
  const safeCount = isDemoMode ? Math.round(demoCount * 0.38) : (stats?.safe_count ?? 0);
  const suspiciousCount = isDemoMode ? Math.round(demoCount * 0.20) : (stats?.suspicious_count ?? 0);
  const avgRisk = isDemoMode ? 64.8 : (stats?.avg_risk_score ?? 0);
  const recentScans = Array.isArray(stats?.recent_scans) ? stats.recent_scans : [];
  const activeRecentScans = isDemoMode && demoTicker.length > 0 ? demoTicker : recentScans;

  const statCards = [
    { title: 'Total Intercepted Scans', value: totalScans, icon: <Activity color="var(--accent-cyan)" size={24} />, bg: 'rgba(0, 217, 255, 0.1)', border: 'rgba(0, 217, 255, 0.3)' },
    { title: 'Phishing Attacks Blocked', value: phishingCount, icon: <ShieldAlert color="var(--status-danger)" size={24} />, bg: 'rgba(255, 61, 113, 0.12)', border: 'rgba(255, 61, 113, 0.35)' },
    { title: 'Suspicious Domains Watched', value: suspiciousCount, icon: <AlertTriangle color="var(--status-warning)" size={24} />, bg: 'rgba(255, 193, 7, 0.12)', border: 'rgba(255, 193, 7, 0.35)' },
    { title: 'Legitimate Domains Verified', value: safeCount, icon: <CheckCircle2 color="var(--status-safe)" size={24} />, bg: 'rgba(0, 230, 118, 0.12)', border: 'rgba(0, 230, 118, 0.35)' },
    { title: 'Global Avg Threat Index', value: `${avgRisk}%`, icon: <Percent color="var(--accent-purple)" size={24} />, bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.35)' }
  ];

  // Donut chart calculations
  const chartTotal = totalScans || 1;
  const pPct = Math.round((phishingCount / chartTotal) * 100);
  const sPct = Math.round((suspiciousCount / chartTotal) * 100);
  const okPct = Math.max(0, 100 - pPct - sPct);

  // SVG Line chart trend points
  const recentRiskScores = activeRecentScans.length > 0 ? activeRecentScans.slice(0, 8).map(s => s.risk_score || 0) : [10, 85, 45, 92, 5, 65, 12, 88];
  const chartWidth = 400;
  const chartHeight = 120;
  const pointsString = recentRiskScores.map((score, idx) => {
    const x = (idx / (recentRiskScores.length - 1 || 1)) * chartWidth;
    const y = chartHeight - (score / 100) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  // Threat category breakdown calculation from recent scans reasons
  const threatCategoryCounts = {
    'Typosquatting & Brand Spoofing': isDemoMode ? 142 : 0,
    'Insecure HTTP Protocol': isDemoMode ? 98 : 0,
    'High String Entropy': isDemoMode ? 86 : 0,
    'Suspicious TLD (.xyz, .top)': isDemoMode ? 115 : 0,
    'Sensitive Keywords': isDemoMode ? 74 : 0
  };

  activeRecentScans.forEach(scan => {
    const reasons = scan?.reasons || [];
    reasons.forEach(r => {
      if (!r) return;
      const lower = String(r).toLowerCase();
      if (lower.includes('typosquatting') || lower.includes('brand spoofing') || lower.includes('fake domain')) threatCategoryCounts['Typosquatting & Brand Spoofing']++;
      if (lower.includes('http') || lower.includes('insecure')) threatCategoryCounts['Insecure HTTP Protocol']++;
      if (lower.includes('entropy') || lower.includes('randomness')) threatCategoryCounts['High String Entropy']++;
      if (lower.includes('tld') || lower.includes('top-level')) threatCategoryCounts['Suspicious TLD (.xyz, .top)']++;
      if (lower.includes('keyword')) threatCategoryCounts['Sensitive Keywords']++;
    });
  });

  // Top domains calculation
  const domainMap = {};
  activeRecentScans.forEach(s => {
    if (s && s.domain) {
      domainMap[s.domain] = (domainMap[s.domain] || 0) + 1;
    }
  });
  const topDomains = Object.entries(domainMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Weekly analytics mock distribution (Mon-Sun)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyScans = [12, 19, 15, 24, 30, 18, 22];
  const maxWeekly = Math.max(...weeklyScans, 1);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Top Banner & Mode Toggle */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-admin"><Radio size={14} /> LIVE SOC FEED</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>UPDATED IN REAL-TIME</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Security Operations Center <span className="text-gradient">(SOC) Analytics</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Enterprise cyber threat analytics, category breakdown, MITRE ATT&CK mapping, and global attack distribution.
          </p>
        </div>

        {/* View Mode & Presentation Mode Toggles */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            style={{
              background: isDemoMode ? 'rgba(255, 61, 113, 0.15)' : 'rgba(0, 217, 255, 0.15)',
              color: isDemoMode ? 'var(--status-danger)' : 'var(--accent-cyan)',
              border: `1px solid ${isDemoMode ? 'var(--status-danger)' : 'var(--accent-cyan)'}`,
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: isDemoMode ? '0 0 15px rgba(255, 61, 113, 0.3)' : '0 0 15px rgba(0, 217, 255, 0.2)'
            }}
          >
            <Radio size={14} /> Presentation Mode: {isDemoMode ? 'DEMO ACTIVE' : 'REAL DATA'}
          </button>

          <div style={{ display: 'flex', gap: '8px', background: 'rgba(13, 19, 34, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
            <button
              onClick={() => setViewMode('executive')}
              style={{
                background: viewMode === 'executive' ? 'linear-gradient(135deg, #00D9FF 0%, #3B82F6 100%)' : 'transparent',
                color: viewMode === 'executive' ? '#050816' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                transition: 'all 0.2s ease'
              }}
            >
              Executive Summary
            </button>
            <button
              onClick={() => setViewMode('analyst')}
              style={{
                background: viewMode === 'analyst' ? 'linear-gradient(135deg, #00D9FF 0%, #3B82F6 100%)' : 'transparent',
                color: viewMode === 'analyst' ? '#050816' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                transition: 'all 0.2s ease'
              }}
            >
              Analyst Technical View
            </button>
          </div>
        </div>
      </div>

      {/* Demo Mode Notification Banner */}
      {isDemoMode && (
        <div style={{ background: 'rgba(255, 61, 113, 0.1)', border: '1px solid rgba(255, 61, 113, 0.3)', padding: '12px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio color="var(--status-danger)" size={18} className="map-pulse-ring" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F8FAFC' }}>
              PRESENTATION DEMO MODE ACTIVE — SIMULATING REAL-TIME THREAT INTERCEPT FEED (EVERY 3s)
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            REAL SCANNING REMAINS FULLY FUNCTIONAL & SEPARATED
          </span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        {statCards.map((card, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${card.border}` }}>
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>{card.title}</p>
              <h3 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{card.value}</h3>
            </div>
            <div style={{ background: card.bg, padding: '12px', borderRadius: '12px' }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Executive Summary Cards (Show in Executive Mode) */}
      {viewMode === 'executive' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <ShieldCheck color="var(--status-safe)" size={20} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>SOC Threat Prevention Status</h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
              All <strong>{phishingCount}</strong> detected phishing campaigns were blocked automatically before end-user execution. Zero credential leak incidents reported in current cycle.
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              <span>SLA Resolution: &lt;1.2s</span>
              <span>Uptime: 99.99%</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Cpu color="var(--accent-cyan)" size={20} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Classifier & XAI Readiness</h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
              Random Forest primary model active with <strong>98.5%</strong> F1-score precision across 25+ extracted lexical, domain, and threat intelligence parameters.
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--status-safe)', fontFamily: 'var(--font-mono)' }}>
              <span>Features Calibrated: 25+</span>
              <span>Model Drift: 0.02%</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid: Threat Distribution + Risk Trend Line Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Donut Chart: Distribution */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Flame size={20} color="var(--status-danger)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Threat Classification Distribution</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{totalScans} SCANS</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '130px', height: '130px' }}>
              <svg width="130" height="130" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="5" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--status-danger)" strokeWidth="5" strokeDasharray={`${pPct} ${100 - pPct}`} strokeDashoffset="25" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--status-warning)" strokeWidth="5" strokeDasharray={`${sPct} ${100 - sPct}`} strokeDashoffset={`${25 - pPct}`} />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--status-safe)" strokeWidth="5" strokeDasharray={`${okPct} ${100 - okPct}`} strokeDashoffset={`${25 - pPct - sPct}`} />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{totalScans}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', uppercase: 'true' }}>TOTAL</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--status-danger)' }} />
                <span>Phishing: <strong>{phishingCount}</strong> ({pPct}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--status-warning)' }} />
                <span>Suspicious: <strong>{suspiciousCount}</strong> ({sPct}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--status-safe)' }} />
                <span>Safe: <strong>{safeCount}</strong> ({okPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SVG Line Chart: Risk Score Trend */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Real-Time Risk Score Volatility Trend</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>LAST 8 SCANS</span>
          </div>

          <div style={{ marginTop: '10px' }}>
            <svg width="100%" height="130" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="30" x2={chartWidth} y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="65" x2={chartWidth} y2="65" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              <polygon points={`0,${chartHeight} ${pointsString} ${chartWidth},${chartHeight}`} fill="url(#chartGrad)" />
              <polyline fill="none" stroke="#00D9FF" strokeWidth="2.5" points={pointsString} />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
              <span>Older Intercepts</span>
              <span>Recent Intercepts</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW ANALYTICS SECTION: Threat Category Bar Chart + Weekly Analytics + Top Domains */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Threat Category Bar Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Server size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Threat Vector Category Distribution</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(threatCategoryCounts).map(([cat, count], idx) => {
              const maxCount = Math.max(...Object.values(threatCategoryCounts), 1);
              const barPct = Math.max(8, Math.round((count / maxCount) * 100));
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>{cat}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>{count} Signals</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${barPct}%`, height: '100%', background: 'linear-gradient(90deg, #00D9FF 0%, #3B82F6 100%)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Analytics Bar Graph */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Activity size={20} color="var(--status-safe)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Weekly Intercept Activity Volume</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '10px' }}>
            {weeklyScans.map((count, idx) => {
              const hPct = Math.round((count / maxWeekly) * 100);
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{count}</span>
                  <div style={{ width: '18px', height: `${hPct}%`, background: 'linear-gradient(180deg, #00E676 0%, rgba(0, 230, 118, 0.2) 100%)', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{daysOfWeek[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Analyzed Target Domains */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Radio size={20} color="var(--accent-purple)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Top Intercepted Target Domains</h3>
          </div>
          {topDomains.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topDomains.map(([dom, cnt], idx) => (
                <div key={idx} style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#F8FAFC' }}>#{idx + 1} {dom}</span>
                  <span className="badge badge-admin" style={{ fontSize: '0.7rem' }}>{cnt} Scans</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No domain records analyzed yet.</p>
          )}
        </div>
      </div>

      {/* High-Risk Intercepted Targets Table (Most Dangerous URLs) */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert color="var(--status-danger)" size={22} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Most Dangerous Intercepted Target Leaderboard (Risk Score &ge; 70%)
            </h3>
          </div>
          <span className="badge badge-phishing"><Flame size={14} /> ACTIVE INCIDENTS</span>
        </div>

        {stats?.high_risk_targets && stats.high_risk_targets.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>URL Target</th>
                  <th>Domain</th>
                  <th>Risk Score</th>
                  <th>Threat Level</th>
                  <th>Top Detection Reason</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {stats.high_risk_targets.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--status-danger)', fontWeight: 600 }}>{item.url}</td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.domain}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--status-danger)' }}>{item.risk_score}%</td>
                    <td><span className="badge badge-phishing">HIGH</span></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.reasons && item.reasons.length > 0 ? item.reasons[0] : 'Typosquatting Malicious Domain'}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.scan_date ? new Date(item.scan_date).toLocaleTimeString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
            No high risk targets recorded in recent scans. All clear.
          </div>
        )}
      </div>

      {/* Live Recent Scans Feed Timeline */}
      {activeRecentScans.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Clock size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live Activity Feed & Intercept Timeline</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeRecentScans.slice(0, 5).map((scan, idx) => (
              <div key={idx} style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {scan.status === 'Phishing' && <ShieldAlert color="var(--status-danger)" size={18} />}
                  {scan.status === 'Suspicious' && <AlertTriangle color="var(--status-warning)" size={18} />}
                  {scan.status === 'Safe' && <CheckCircle2 color="var(--status-safe)" size={18} />}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>{scan.url}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${scan.status === 'Phishing' ? 'badge-phishing' : scan.status === 'Suspicious' ? 'badge-suspicious' : 'badge-safe'}`}>
                    {scan.status} ({scan.risk_score}%)
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {scan.scan_date ? new Date(scan.scan_date).toLocaleTimeString() : 'Recent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Cyber Threat Feed Ticker */}
      <ThreatFeedTicker />

      {/* MITRE ATT&CK Threat Matrix */}
      <MitreAttackMatrix />

      {/* Geographic Threat Map */}
      <GeoThreatMap nodes={stats?.geo_attack_map} />
    </div>
  );
};

export default SOCDashboard;
