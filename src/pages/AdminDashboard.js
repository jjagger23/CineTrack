import { Link } from 'react-router-dom';
import { MOCK_SHOWS, MOCK_USERS, MOCK_ALL_REVIEWS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { icon:'🎬', label:'Total Shows',    value: MOCK_SHOWS.length,                               link:'/admin/shows',   color:'var(--blue)' },
    { icon:'👥', label:'Users',          value: MOCK_USERS.length,                               link:'/admin/users',   color:'var(--blue)'  },
    { icon:'⭐', label:'Reviews',         value: MOCK_ALL_REVIEWS.length,                         link:'/admin/reviews', color:'var(--yellow)'},
    { icon:'📺', label:'TV Shows',       value: MOCK_SHOWS.filter(s=>s.type==='TV Show').length, link:'/admin/shows',   color:'#c084fc'      },
  ];

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 28px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>Good to see you back,</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, letterSpacing: -0.5 }}>
          {user?.username} <span style={{ color: 'var(--blue)' }}>↗</span>
        </h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>→</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two panel section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent shows */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Shows</h3>
            <Link to="/admin/shows" style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600 }}>Manage →</Link>
          </div>
          <table className="ct-table">
            <tbody>
              {MOCK_SHOWS.slice(0,5).map(s => (
                <tr key={s._id}>
                  <td style={{ width: 42, padding: '10px 12px' }}>
                    <div style={{ width: 38, height: 52, borderRadius: 6, overflow: 'hidden', background: 'var(--surface2)' }}>
                      {s.posterUrl && <img src={s.posterUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{s.title}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.type==='Movie'?'var(--blue)':'var(--blue)' }}>
                      {s.type==='Movie'?'FILM':'SERIES'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent reviews */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Reviews</h3>
            <Link to="/admin/reviews" style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600 }}>Manage →</Link>
          </div>
          <table className="ct-table">
            <tbody>
              {MOCK_ALL_REVIEWS.slice(0,5).map(r => (
                <tr key={r._id}>
                  <td style={{ fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>@{r.username}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{r.show}</div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="rating-pill">★ {r.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
