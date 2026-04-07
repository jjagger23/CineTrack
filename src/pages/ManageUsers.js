import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL;
const avatarRoleClass = role => role === 'admin' ? 'manageUserAvatarAdmin' : 'manageUserAvatarUser';

export default function ManageUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const notify = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to load users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadUsers();
  }, [token]);

  const handleDelete = async id => {
    try {
      const res = await fetch(`${API}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to remove user');
      setUsers(prev => prev.filter(u => u._id !== id));
      notify('User and related content removed');
    } catch (err) {
      notify(err.message || 'Could not remove user');
    }
  };

  return (
    <div className="page-enter pageContainerMedium">
      <div className="pageHeaderGroup">
        <h1 className="pageTitle">Manage Users</h1>
        <p className="pageSubtitle">{users.length} registered accounts</p>
      </div>

      {toast && <div className="toast">{toast}</div>}
      {error && <div className="authErrorBox">{error}</div>}

      {loading ? (
        <div className="catalogStateMessage">Loading users...</div>
      ) : (
        <div className="contentCard">
          <table className="ct-table">
            <thead>
              <tr><th>User</th><th>Role</th><th>Joined</th><th /></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="manageUserInfo">
                      <div className={`manageUserAvatar ${avatarRoleClass(u.role)}`}>{u.username[0].toUpperCase()}</div>
                      <span className="manageUserHandle">@{u.username}</span>
                    </div>
                  </td>
                  <td><span className={u.role === 'admin' ? 'badge-admin' : 'badge-user'}>{u.role}</span></td>
                  <td className="tableMutedCell">{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>
                    {u.role !== 'admin' && <button className="btn-danger" onClick={() => handleDelete(u._id)}>Remove</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
