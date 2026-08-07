import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Key } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

const LoginModal = ({ isOpen = true, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const data = await registerUser(email, password, fullName);
        onLoginSuccess(data.user);
      } else {
        const data = await loginUser(email, password);
        onLoginSuccess(data.user);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdminLogin = () => {
    setEmail('admin@cybershield.com');
    setPassword('Admin@123');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(7, 10, 19, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '420px', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            padding: '12px',
            borderRadius: '14px',
            marginBottom: '12px'
          }}>
            <ShieldCheck size={28} color="#070a13" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {isRegister ? 'Create SOC Account' : 'Enterprise SOC Login'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isRegister ? 'Sign up for RBAC Analyst platform access' : 'Enter credentials for role-based security platform access'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--status-danger-bg)', border: '1px solid rgba(255, 8, 68, 0.3)', color: 'var(--status-danger)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '16px' }} />
                <input
                  type="text"
                  className="cyber-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Security Analyst"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '16px' }} />
              <input
                type="email"
                className="cyber-input"
                style={{ paddingLeft: '40px' }}
                placeholder="admin@cybershield.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '16px' }} />
              <input
                type="password"
                className="cyber-input"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-cyber" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In to SOC'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <button onClick={handleDemoAdminLogin} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Key size={12} /> Auto-fill Demo Admin
          </button>

          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
            {isRegister ? 'Already registered? Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
