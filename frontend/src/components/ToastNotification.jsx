import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Info, X } from 'lucide-react';

const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;

  const { type = 'info', message = '' } = toast;

  const config = {
    success: { icon: <CheckCircle2 size={18} color="#00e676" />, border: 'rgba(0, 230, 118, 0.4)', bg: 'rgba(0, 230, 118, 0.1)', text: '#00e676' },
    error: { icon: <ShieldAlert size={18} color="#ff0844" />, border: 'rgba(255, 8, 68, 0.4)', bg: 'rgba(255, 8, 68, 0.1)', text: '#ff0844' },
    warning: { icon: <AlertTriangle size={18} color="#ffab00" />, border: 'rgba(255, 171, 0, 0.4)', bg: 'rgba(255, 171, 0, 0.1)', text: '#ffab00' },
    info: { icon: <Info size={18} color="#00f2fe" />, border: 'rgba(0, 242, 254, 0.4)', bg: 'rgba(0, 242, 254, 0.1)', text: '#00f2fe' }
  };

  const styleConfig = config[type] || config.info;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: 'rgba(7, 10, 19, 0.95)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${styleConfig.border}`,
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        color: 'var(--text-main)',
        fontSize: '0.9rem',
        maxWidth: '420px',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {styleConfig.icon}
      <span style={{ flex: 1, fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ToastNotification;
