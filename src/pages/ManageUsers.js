import { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';

export default function ManageUsers() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [toast, setToast] = useState('');
  const notify = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const handleDelete = id => { setUsers(prev => prev.filter(u => u._id !== id)); notify('User removed'); };

  return (
    <div className="page-enter" style={{ maxWidth:900, margin:'0 auto', padding:'36px 28px 60px' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:38, letterSpacing:-0.5, marginBottom:4 }}>Manage Users</h1>
        <p style={{ color:'var(--text-muted)', fontSize:13 }}>{users.length} registered accounts</p>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div style={{ background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,0.15)' }}>
        <table className="ct-table">
          <thead><tr><th>User</th><th>Role</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{
                      width:34, height:34, borderRadius:'50%',
                      background: u.role==='admin' ? 'var(--grad)' : 'var(--surface2)',
                      border: `1.5px solid ${u.role==='admin' ? 'rgba(77,159,255,0.3)' : 'var(--border)'}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:13, fontWeight:800,
                      color: u.role==='admin' ? '#fff' : 'var(--text-muted)',
                      boxShadow: u.role==='admin' ? '0 2px 10px rgba(77,159,255,0.25)' : 'none',
                    }}>
                      {u.username[0].toUpperCase()}
                    </div>
                    <span style={{ fontWeight:600 }}>@{u.username}</span>
                  </div>
                </td>
                <td><span className={u.role==='admin' ? 'badge-admin' : 'badge-user'}>{u.role}</span></td>
                <td style={{ color:'var(--text-muted)', fontSize:13 }}>
                  {new Date(u.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </td>
                <td>
                  {u.role !== 'admin' && (
                    <button className="btn-danger" onClick={() => handleDelete(u._id)}>Remove</button>
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
