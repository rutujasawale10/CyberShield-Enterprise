import React from 'react';
import { ShieldAlert, Activity, Cpu, Layers, Radio, Lock, CheckCircle2, ArrowRight, Zap, Database, Terminal, Users, Sparkles, Award } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  const features = [
    { icon: <Activity size={24} color="var(--accent-cyan)" />, title: 'Real-Time Lexical Analysis', desc: 'Extracts 25+ lexical, structural, DOM, and Shannon entropy indicators in real-time.' },
    { icon: <Cpu size={24} color="var(--accent-cyan)" />, title: 'Explainable AI (XAI) Engine', desc: 'Generates transparent feature attributions explaining exact risk impact weights.' },
    { icon: <Radio size={24} color="var(--status-warning)" />, title: 'Multi-Source Threat Intel', desc: 'Queries VirusTotal v3, Google Safe Browsing, PhishTank, and OpenPhish feeds.' },
    { icon: <Layers size={24} color="var(--accent-purple)" />, title: 'High-Throughput Batch Scanner', desc: 'Concurrently evaluates up to 50 target URLs per batch with detailed audit logs.' },
    { icon: <Terminal size={24} color="var(--status-danger)" />, title: 'MITRE ATT&CK Matrix Alignment', desc: 'Maps detected phishing tactics to T1566.002, T1027, and T1556 threat codes.' },
    { icon: <Lock size={24} color="var(--status-safe)" />, title: 'Enterprise RBAC Governance', desc: 'Role-based access control supporting Admin, Analyst, and User permission levels.' }
  ];

  const techStack = [
    { name: 'FastAPI', category: 'Backend Engine', version: 'v0.110.0' },
    { name: 'React 18 + Vite 5', category: 'Frontend Platform', version: 'v18.2.0' },
    { name: 'Scikit-Learn ML', category: 'Classifier Core', version: 'Random Forest' },
    { name: 'ReportLab PDF', category: 'Audit Exporter', version: 'v4.0' },
    { name: 'SQLAlchemy', category: 'Database ORM', version: 'SQLite / Postgres' },
    { name: 'JWT & OAuth2', category: 'Security Auth', version: 'HS256 Bearer' }
  ];

  const stats = [
    { label: 'Classification Precision', value: '98.5%', desc: 'F1-Score Accuracy' },
    { label: 'Avg Intercept SLA', value: '<1.2s', desc: 'Real-Time Latency' },
    { label: 'Features Extracted', value: '25+', desc: 'Parameters Analyzed' },
    { label: 'Threat Intel Engines', value: '70+', desc: 'Integrated Providers' }
  ];

  const team = [
    { name: 'Dr. Alex Vance', role: 'Principal AI Security Architect', expertise: 'Machine Learning & Threat Attribution' },
    { name: 'Elena Rostova', role: 'Senior SOC Governance Lead', expertise: 'MITRE ATT&CK & Malware Analysis' },
    { name: 'Marcus Chen', role: 'Lead Platform Systems Engineer', expertise: 'FastAPI & Microservices Architecture' }
  ];

  return (
    <div style={{ color: 'var(--text-main)' }}>
      {/* 1. Hero Section */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 60px',
        maxWidth: '1280px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 217, 255, 0.1)', border: '1px solid rgba(0, 217, 255, 0.3)', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px' }}>
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.5px' }}>
            CYBERSHIELD ENTERPRISE v3.0 IS LIVE
          </span>
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-1px' }}>
          Next-Generation AI <span className="text-gradient">Threat Intelligence</span> & SOC Platform
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '780px', margin: '0 auto 36px', lineHeight: '1.6' }}>
          Real-time phishing website detection powered by Scikit-Learn machine learning, 25+ lexical feature parameters, Explainable AI (XAI), and multi-source threat intelligence.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
          <button className="btn-cyber" style={{ fontSize: '1rem', padding: '16px 32px', boxShadow: '0 0 25px rgba(0, 217, 255, 0.4)' }} onClick={() => onNavigate('scanner')}>
            Launch URL Scanner <ArrowRight size={18} />
          </button>
          <button className="btn-cyber" style={{ background: 'linear-gradient(135deg, #FF3D71 0%, #8B5CF6 100%)', border: 'none', color: '#FFF', fontSize: '1rem', padding: '16px 32px', boxShadow: '0 0 25px rgba(255, 61, 113, 0.4)' }} onClick={() => onNavigate('soc')}>
            <Radio size={18} /> START LIVE DEMO
          </button>
          <button className="btn-secondary" style={{ fontSize: '1rem', padding: '16px 32px' }} onClick={() => onNavigate('soc')}>
            Explore SOC Dashboard
          </button>
        </div>

        {/* Hero Interactive Feature Cards Preview */}
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-muted)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert color="var(--accent-cyan)" size={22} />
              <span style={{ fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>LIVE DETECTION DEMO: http://amaz0n-login.xyz</span>
            </div>
            <span className="badge badge-phishing">PHISHING DETECTED (92.5%)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ML Classifier Score</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-danger)', fontFamily: 'var(--font-mono)' }}>92.5% Phishing</p>
            </div>
            <div style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Detection Reason</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Typosquatting Brand Spoofing</p>
            </div>
            <div style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VirusTotal Intelligence</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--status-danger)', fontFamily: 'var(--font-mono)' }}>18 / 70 Flagged</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Section */}
      <section style={{ padding: '40px 24px', background: 'rgba(10, 15, 36, 0.5)', borderTop: '1px solid var(--border-muted)', borderBottom: '1px solid var(--border-muted)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
          {stats.map((item, idx) => (
            <div key={idx}>
              <h3 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{item.value}</h3>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>{item.label}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Project Overview Section */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-admin" style={{ marginBottom: '12px' }}>SYSTEM ARCHITECTURE</span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
            Enterprise <span className="text-gradient">Threat Detection Pipeline</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '12px auto 0' }}>
            Combining machine learning precision with multi-source threat intelligence to defend corporate networks against credential harvesting and malicious domain attacks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ background: 'rgba(0, 217, 255, 0.1)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '16px' }}>
              <Zap size={24} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>1. Lexical Feature Extractor</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Parses URLs to calculate string Shannon entropy, typosquatting Levenshtein distance, IP host matching, subdomains, and suspicious TLD patterns.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '16px' }}>
              <Cpu size={24} color="var(--accent-purple)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>2. ML Classification & XAI</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Evaluates scaled feature vectors through trained Random Forest models while outputting transparent Explainable AI (XAI) feature attributions.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '16px' }}>
              <Radio size={24} color="var(--status-safe)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>3. Multi-Intel Fusion & SOC Report</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Blends threat scores with VirusTotal, Google Safe Browsing, and PhishTank feeds, generating instant downloadable compliance PDF reports.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section style={{ padding: '80px 24px', background: 'rgba(10, 15, 36, 0.4)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge badge-admin" style={{ marginBottom: '12px' }}>KEY CAPABILITIES</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
              Comprehensive <span className="text-gradient">SOC Security Suite</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {features.map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '12px' }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Technology Stack Section */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-admin" style={{ marginBottom: '12px' }}>STACK ARCHITECTURE</span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
            Built with <span className="text-gradient">Production Technologies</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {techStack.map((tech, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{tech.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tech.category}</p>
              </div>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--accent-cyan)', border: '1px solid var(--border-muted)' }}>
                {tech.version}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Team Section */}
      <section style={{ padding: '80px 24px', background: 'rgba(10, 15, 36, 0.4)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge badge-admin" style={{ marginBottom: '12px' }}>ENGINEERING LABS</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
              CyberShield <span className="text-gradient">SOC Research Team</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {team.map((member, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #00D9FF 0%, #3B82F6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}>
                  <Users size={28} color="#050816" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>{member.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '8px' }}>{member.role}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action (CTA) Section */}
      <section style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '48px', border: '1px solid rgba(0, 217, 255, 0.3)', boxShadow: '0 0 30px rgba(0, 217, 255, 0.15)' }}>
          <ShieldAlert size={48} color="var(--accent-cyan)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px' }}>
            Ready to Protect Your Organization?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 28px' }}>
            Start analyzing suspicious web domains in real-time or access the executive SOC dashboard.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-cyber" style={{ fontSize: '1rem', padding: '14px 28px' }} onClick={() => onNavigate('scanner')}>
              Start Target Scan
            </button>
            <button className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 28px' }} onClick={() => onNavigate('soc')}>
              View Live Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
