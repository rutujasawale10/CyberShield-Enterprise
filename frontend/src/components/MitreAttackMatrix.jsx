import React, { useState } from 'react';
import { ShieldAlert, Terminal, FileCode, Lock, Key, X, Zap, Eye, ShieldCheck } from 'lucide-react';

const MitreAttackMatrix = () => {
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  const mitreTechniques = [
    {
      tactic: 'Reconnaissance',
      id: 'TA0043',
      technique: 'T1593 - Search Open Websites',
      desc: 'Gathering target domain structures and brand assets for typosquatting.',
      severity: 'MEDIUM',
      mitigation: 'Implement brand monitoring feeds, WHOIS privacy controls, and proactive domain registration.',
      detection: 'Analyze passive DNS telemetry and certificate transparency log feeds for brand keyword typos.',
      examples: 'Threat actors register fake domains matching corporate subdomains (e.g. amaz0n-login.xyz).'
    },
    {
      tactic: 'Initial Access',
      id: 'TA0001',
      technique: 'T1566.002 - Spearphishing Link',
      desc: 'Delivering malicious links via fake login portals and deceptive emails.',
      severity: 'CRITICAL',
      mitigation: 'Deploy email filtering sandboxes, URL rewrite proxies, and FIDO2 MFA hardware keys.',
      detection: 'Flag inbound emails containing newly registered domains or high Shannon entropy URLs.',
      examples: 'Adversaries craft fake Microsoft 365 or Google Workspace login portals to capture OAuth tokens.'
    },
    {
      tactic: 'Defense Evasion',
      id: 'TA0005',
      technique: 'T1027 - Obfuscated Files / Scripts',
      desc: 'Using Base64 encoding, eval(), and IDN Punycode homographs (xn--).',
      severity: 'HIGH',
      mitigation: 'Enforce Content Security Policies (CSP), disable inline JavaScript eval(), and block Punycode domains.',
      detection: 'Calculate string Shannon entropy and inspect URL parameter encoding algorithms in real-time.',
      examples: 'Attackers encode payload URLs inside nested Base64 strings to evade static string signatures.'
    },
    {
      tactic: 'Credential Access',
      id: 'TA0006',
      technique: 'T1556 - Modify Auth Process',
      desc: 'Credential harvesting via counterfeit login forms and OTP interception.',
      severity: 'CRITICAL',
      mitigation: 'Require Certificate-Based Authentication (CBA) or FIDO2/WebAuthn passwordless protocols.',
      detection: 'Monitor for rapid authentication attempts from unverified proxy IP nodes following URL access.',
      examples: 'Man-in-the-middle reverse proxies (e.g. Evilginx2) capture session cookies in real-time.'
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '28px', marginTop: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal size={22} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            MITRE ATT&CK Enterprise Threat Mapping
          </h3>
        </div>
        <span className="badge badge-phishing" style={{ fontFamily: 'var(--font-mono)' }}>
          MITRE ATT&CK v14.1 ALIGNED
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        {mitreTechniques.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedTechnique(item)}
            style={{
              background: 'rgba(7, 10, 19, 0.7)',
              border: '1px solid var(--border-muted)',
              borderRadius: '12px',
              padding: '18px',
              cursor: 'pointer',
              transition: 'all 180ms ease'
            }}
            className="sample-pill-container"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{item.id}</span>
              <span className={`badge ${item.severity === 'CRITICAL' ? 'badge-phishing' : 'badge-suspicious'}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                {item.severity}
              </span>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{item.tactic}</h4>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
              {item.technique}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Technique Modal Dialog */}
      {selectedTechnique && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(5, 8, 22, 0.88)', backdropFilter: 'blur(12px)', zIndex: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '32px', border: '1px solid var(--accent-cyan)', position: 'relative' }}>
            <button onClick={() => setSelectedTechnique(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <span className="badge badge-admin" style={{ marginBottom: '8px', fontSize: '0.75rem' }}>{selectedTechnique.id} | {selectedTechnique.tactic}</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>{selectedTechnique.technique}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>Description</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{selectedTechnique.desc}</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--status-safe)', marginBottom: '4px' }}>SOC Mitigation Protocol</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{selectedTechnique.mitigation}</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--status-warning)', marginBottom: '4px' }}>Detection Strategy</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{selectedTechnique.detection}</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--status-danger)', marginBottom: '4px' }}>Real-World Threat Example</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{selectedTechnique.examples}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MitreAttackMatrix;
