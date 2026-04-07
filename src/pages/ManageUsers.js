import { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';

const avatarRoleClass = role => role === 'admin' ? 'manageUserAvatarAdmin' : 'manageUserAvatarUser';

export default function ManageUsers() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [toast, setToast] = useState('');

  const notify = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleDelete = id => {
    setUsers(prev => prev.filter(u => u._id !== id));
    notify('User removed');
  };

  return (
    <div className="page-enter pageContainerMedium">
      <div className="pageHeaderGroup">
        <h1 className="pageTitle">Manage Users</h1>
        <p className="pageSubtitle">{users.length} registered accounts</p>
      </div>

      {toast && <div className="toast">{toast}</div>}

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
    </div>
  );
}
