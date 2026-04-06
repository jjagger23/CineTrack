import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        const data = await apiRequest('/users');
        if (active) setUsers(Array.isArray(data) ? data : []);
      } catch {
        if (active) setUsers([]);
      }
    };

    loadUsers();
    return () => {
      active = false;
    };
  }, []);

  const notify = message => {
    setToast(message);
    window.clearTimeout(notify.timeoutId);
    notify.timeoutId = window.setTimeout(() => setToast(''), 2500);
  };

  const handleDelete = async id => {
    try {
      await apiRequest(`/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(user => user._id !== id));
      notify('User removed');
    } catch (err) {
      notify(err.message || 'Could not remove user');
    }
  };

  return (
    <div className="page-enter" style={{ maxWidth: 900, margin: '0 auto', padding: '36px 28px 60px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, letterSpacing: -0.5, marginBottom: 4 }}>Manage Users</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{users.length} registered accounts</p>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
        <table className="ct-table">
          <thead><tr><th>User</th><th>Role</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: user.role === 'admin' ? 'var(--grad)' : 'var(--surface2)',
                      border: `1.5px solid ${user.role === 'admin' ? 'rgba(77,159,255,0.3)' : 'var(--border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 800,
                      color: user.role === 'admin' ? '#fff' : 'var(--text-muted)',
                      boxShadow: user.role === 'admin' ? '0 2px 10px rgba(77,159,255,0.25)' : 'none',
                    }}>
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600 }}>@{user.username}</span>
                  </div>
                </td>
                <td><span className={user.role === 'admin' ? 'badge-admin' : 'badge-user'}>{user.role}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                </td>
                <td>
                  {user.role !== 'admin' && (
                    <button className="btn-danger" onClick={() => handleDelete(user._id)}>Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
