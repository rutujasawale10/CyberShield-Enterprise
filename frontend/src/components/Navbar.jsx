import React from 'react';
import { ShieldAlert, Activity, Layers, History, BarChart3, Cpu, Lock, LogIn, LogOut, Wrench } from 'lucide-react';
import { logoutUser } from '../services/api';
import NotificationCenter from './NotificationCenter';

const Navbar = ({ activeTab, setActiveTab, apiOnline, currentUser, setCurrentUser, onOpenLogin }) => {
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border-muted)',
      background: 'rgba(5, 8, 22, 0.88)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div style={{
            background: 'linear-gradient(135deg, #00D9FF 0%, #3B82F6 100%)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)'
          }}>
            <ShieldAlert size={24} color="#050816" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#F8FAFC' }}>
              CYBER<span className="text-gradient">SHIELD</span>
            </h1>
            <p style={{ fontSize: '0.7rem', color: '#00D9FF', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
              ENTERPRISE SOC PLATFORM v3.0
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(13, 19, 34, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-muted)', flexWrap: 'wrap' }}>
          {[
            { id: 'home', label: 'Home', icon: ShieldAlert },
            { id: 'scanner', label: 'URL Scanner', icon: Activity },
            { id: 'soc', label: 'SOC Dashboard', icon: BarChart3 },
            { id: 'batch', label: 'Batch Scanner', icon: Layers },
            { id: 'history', label: 'Audit Logs', icon: History },
            { id: 'benchmarks', label: 'AI Benchmarks', icon: Cpu },
            { id: 'tools', label: 'Security Tools', icon: Wrench },
            { id: 'admin', label: 'Admin Console', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, #00D9FF 0%, #3B82F6 100%)' : 'transparent',
                  color: isActive ? '#050816' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  padding: '8px 15px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '0.85rem',
                  boxShadow: isActive ? '0 0 15px rgba(0, 217, 255, 0.35)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User Auth Profile & Notification Center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <NotificationCenter />
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 14px', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC' }}>{currentUser.email}</p>
                <span className={`badge ${currentUser.role === 'Admin' ? 'badge-admin' : 'badge-safe'}`} style={{ fontSize: '0.68rem', padding: '1px 8px' }}>
                  {currentUser.role}
                </span>
              </div>
              <button onClick={handleLogout} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-muted)', color: 'var(--text-muted)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', transition: 'all 0.2s ease' }}>
                <LogOut size={14} /> Exit
              </button>
            </div>
          ) : (
            <button onClick={onOpenLogin} className="btn-cyber" style={{ fontSize: '0.85rem', padding: '8px 18px' }}>
              <LogIn size={15} /> SOC Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
