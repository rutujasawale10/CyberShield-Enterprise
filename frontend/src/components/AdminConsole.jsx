import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Trash2, Plus, Lock, AlertTriangle } from 'lucide-react';
import { getAllUsers, updateUserRole, clearAllLogs, addThreatIntelDomain } from '../services/api';

const AdminConsole = ({ currentUser, showToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState('');
  const [msg, setMsg] = useState(null);

  const isAdmin = currentUser?.role === 'Admin';

  const fetchUsers = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center', padding: '40px' }} className="glass-panel">
        <Lock size={48} color="var(--status-danger)" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Restricted Admin Console</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          You must be logged in as an <strong>Admin</strong> (e.g. <code>admin@cybershield.com</code>) to access user role governance and system controls.
        </p>
      </div>
    );
  }

  const handleRoleChange = async (userId, role) => {
    try {
      await updateUserRole(userId, role);
      const succMsg = `Role updated to ${role} successfully.`;
      setMsg(succMsg);
      if (showToast) showToast('success', succMsg);
      fetchUsers();
    } catch (err) {
      if (showToast) showToast('error', 'Failed to update user role.');
      else alert('Failed to update role');
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to flush all scan audit logs?')) return;
    try {
      const res = await clearAllLogs();
      const succMsg = `Audit logs cleared (${res.deleted_count} records removed).`;
      setMsg(succMsg);
      if (showToast) showToast('warning', succMsg);
    } catch (err) {
      if (showToast) showToast('error', 'Failed to clear audit logs.');
      else alert('Failed to clear logs');
    }
  };

  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    try {
      await addThreatIntelDomain(newDomain.trim());
      const succMsg = `Domain ${newDomain} added to Threat Intelligence feed.`;
      setMsg(succMsg);
      if (showToast) showToast('success', succMsg);
      setNewDomain('');
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to add domain';
      if (showToast) showToast('error', errMsg);
      else alert(errMsg);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
          Admin <span className="text-gradient">Security Console</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage platform RBAC users, threat feed databases, and system logs.</p>
      </div>

      {msg && (
        <div style={{ background: 'var(--status-safe-bg)', border: '1px solid var(--status-safe)', color: 'var(--status-safe)', padding: '14px', borderRadius: '10px', marginBottom: '24px' }}>
          {msg}
        </div>
      )}

      {/* User Management Table */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Users size={22} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            User RBAC Governance (Registered Users)
          </h3>
        </div>

        {loading ? (
          <div>Loading users...</div>
        ) : (
          <table className="cyber-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Current Role</th>
                <th>Assign Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>#{u.id}</td>
                  <td>{u.full_name || 'N/A'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'Admin' ? 'badge-phishing' : 'badge-safe'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{ background: 'var(--bg-primary)', color: 'var(--text-main)', border: '1px solid var(--border-muted)', padding: '6px 12px', borderRadius: '6px' }}
                    >
                      <option value="User">User</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Grid: Threat Feed Addition & Flush Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Add Domain to Threat Feed</h3>
          <form onSubmit={handleAddDomain} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="cyber-input"
              placeholder="e.g. malicioius-phish-domain.xyz"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
            />
            <button type="submit" className="btn-cyber">
              <Plus size={16} /> Add
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderColor: 'rgba(255, 8, 68, 0.3)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--status-danger)' }}>
            System Audit Log Governance
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Permanently flush historical scan records from database.
          </p>
          <button onClick={handleClearLogs} className="btn-cyber" style={{ background: 'var(--status-danger-bg)', color: 'var(--status-danger)', border: '1px solid var(--status-danger)' }}>
            <Trash2 size={16} /> Flush Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
