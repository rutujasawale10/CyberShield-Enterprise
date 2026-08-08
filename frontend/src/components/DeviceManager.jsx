import React, { useState, useEffect } from 'react';
import { Laptop, Globe, Shield, Trash2, RefreshCw } from 'lucide-react';
import { getProtectionDevices, revokeDevice } from '../services/api';

const DeviceManager = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await getProtectionDevices();
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch protection devices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRevoke = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this protection client?")) return;
    setRevokingId(id);
    try {
      await revokeDevice(id);
      setDevices(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert("Failed to revoke device client.");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Connected <span className="text-gradient">Protection Clients & Devices</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage browser extensions, Windows desktop protection instances, and mobile clients synchronized across your enterprise network.
          </p>
        </div>
        <button
          onClick={fetchDevices}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} /> Refresh Devices
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: '24px' }}>Loading registered protection devices...</div>
      ) : devices.length === 0 ? (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <Shield size={36} color="var(--accent-cyan)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Active External Clients Connected</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Install the CyberShield Manifest V3 browser extension or run `CyberShield.exe` to sync client endpoints.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {devices.map(device => (
            <div key={device.id} className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {device.device_type === 'DESKTOP' ? <Laptop color="var(--accent-cyan)" size={22} /> : <Globe color="var(--status-safe)" size={22} />}
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{device.device_name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      v{device.client_version} • {device.os_name}
                    </span>
                  </div>
                </div>
                <span className="badge badge-safe">ACTIVE</span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>
                Last Sync: {new Date(device.last_seen).toLocaleString()}
              </div>

              <button
                onClick={() => handleRevoke(device.id)}
                disabled={revokingId === device.id}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 61, 113, 0.1)',
                  color: 'var(--status-danger)',
                  border: '1px solid rgba(255, 61, 113, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 size={14} /> {revokingId === device.id ? 'Revoking...' : 'Revoke Client Access'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
