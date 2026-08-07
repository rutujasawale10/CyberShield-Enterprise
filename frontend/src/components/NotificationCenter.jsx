import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, AlertTriangle, UserCheck, Lock, X } from 'lucide-react';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'THREAT', title: 'Phishing Threat Intercepted', desc: 'http://amaz0n-login.xyz (Risk: 94.2%)', time: '2 mins ago', unread: true },
    { id: 2, type: 'SCAN', title: 'Batch Scan Completed', desc: '15 target URLs analyzed (0 errors)', time: '14 mins ago', unread: true },
    { id: 3, type: 'SUSPICIOUS', title: 'Suspicious Domain Watched', desc: 'http://paytm-secure.xyz (Risk: 58.0%)', time: '1 hour ago', unread: true },
    { id: 4, type: 'AUTH', title: 'Admin User Sign In', desc: 'Authenticated as admin@cybershield.org', time: '3 hours ago', unread: false }
  ]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setUnreadCount(0);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleToggle}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-muted)',
          color: 'var(--text-main)',
          padding: '8px 12px',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          position: 'relative',
          transition: 'all 180ms ease'
        }}
      >
        <Bell size={18} color="var(--accent-cyan)" />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--status-danger)', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', top: '48px', right: 0, width: '340px', background: 'rgba(13, 19, 34, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid var(--accent-cyan)', borderRadius: '12px', padding: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-muted)', paddingBottom: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} color="var(--accent-cyan)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>SOC Notifications</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {notifications.map(n => (
              <div key={n.id} style={{ background: n.unread ? 'rgba(0, 217, 255, 0.06)' : 'rgba(255,255,255,0.02)', border: '1px solid var(--border-muted)', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                {n.type === 'THREAT' && <ShieldAlert color="var(--status-danger)" size={16} style={{ marginTop: '2px' }} />}
                {n.type === 'SCAN' && <CheckCircle2 color="var(--status-safe)" size={16} style={{ marginTop: '2px' }} />}
                {n.type === 'SUSPICIOUS' && <AlertTriangle color="var(--status-warning)" size={16} style={{ marginTop: '2px' }} />}
                {n.type === 'AUTH' && <UserCheck color="var(--accent-cyan)" size={16} style={{ marginTop: '2px' }} />}

                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '2px' }}>{n.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{n.desc}</p>
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
