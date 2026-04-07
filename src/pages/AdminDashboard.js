import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL;

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [shows, setShows] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const [showsRes, usersRes, reviewsRes] = await Promise.all([
          fetch(`${API}/shows`),
          fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/reviews`),
        ]);

        if (!showsRes.ok) throw new Error((await showsRes.json()).message || 'Failed to load shows');
        if (!usersRes.ok) throw new Error((await usersRes.json()).message || 'Failed to load users');
        if (!reviewsRes.ok) throw new Error((await reviewsRes.json()).message || 'Failed to load reviews');

        const [showsData, usersData, reviewsData] = await Promise.all([
          showsRes.json(),
          usersRes.json(),
          reviewsRes.json(),
        ]);

        if (!active) return;
        setShows(Array.isArray(showsData) ? showsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load dashboard');
      } finally {
        if (active) setLoading(false);
      }
    };

    if (token) load();
    return () => {
      active = false;
    };
  }, [token]);

  const stats = useMemo(() => [
    { icon: '🎬', label: 'Total Shows', value: shows.length, link: '/admin/shows', colorClass: 'adminStatValueBlue', iconClass: 'adminIconBlue' },
    { icon: '👥', label: 'Users', value: users.length, link: '/admin/users', colorClass: 'adminStatValueGreen', iconClass: 'adminIconGreen' },
    { icon: '⭐', label: 'Reviews', value: reviews.length, link: '/admin/reviews', colorClass: 'adminStatValueYellow', iconClass: 'adminIconYellow' },
    { icon: '📺', label: 'TV Shows', value: shows.filter(s => s.type === 'TV Show').length, link: '/admin/shows', colorClass: 'adminStatValueViolet', iconClass: 'adminIconViolet' },
  ], [shows, users, reviews]);

  const recentShows = shows.slice(0, 5);
  const recentReviews = reviews.slice(0, 5);

  return (
    <div className="page-enter pageContainerWide">
      <div className="adminGreeting">
        <p className="adminGreetingText">Good to see you,</p>
        <h1 className="adminGreetingTitle"><span className="grad-text">{user?.username}</span> ↗</h1>
      </div>

      {error && <div className="authErrorBox">{error}</div>}

      {loading ? (
        <div className="catalogStateMessage">Loading admin dashboard...</div>
      ) : (
        <>
          <div className="stagger adminStatGrid">
            {stats.map(s => (
              <Link key={s.label} to={s.link} className="adminStatLink">
                <div className="stat-card">
                  <div className="adminStatHeader">
                    <div className={`adminStatIcon ${s.iconClass}`}>{s.icon}</div>
                    <span className="adminStatArrow">→</span>
                  </div>
                  <div className={`adminStatValue ${s.colorClass}`}>{s.value}</div>
                  <div className="adminStatLabel">{s.label}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="adminPanelGrid">
            {[{
              title: 'Recent Shows',
              link: '/admin/shows',
              rows: recentShows.map(s => ({
                left: <><div className="adminPosterThumb">{s.posterUrl && <img src={s.posterUrl} alt="" className="adminPosterThumbImage" />}</div><span className="adminRowStrong">{s.title}</span></>,
                right: <span className={s.type === 'Movie' ? 'badge-film' : 'badge-series'}>{s.type === 'Movie' ? 'FILM' : 'SERIES'}</span>,
              })),
            }, {
              title: 'Recent Reviews',
              link: '/admin/reviews',
              rows: recentReviews.map(r => ({
                left: <><div className="adminRowStrong">@{r.userId?.username || 'user'}</div><div className="adminRowSubtext">{r.showId?.title || 'Unknown show'}</div></>,
                right: <span className="ratingTag ratingTagTiny">★ {r.rating}</span>,
              })),
            }].map(panel => (
              <div key={panel.title} className="contentCard adminPanelCard">
                <div className="adminPanelHeader">
                  <h3 className="adminPanelTitle">{panel.title}</h3>
                  <Link to={panel.link} className="grad-text adminPanelManageLink">Manage →</Link>
                </div>
                <table className="ct-table">
                  <tbody>
                    {panel.rows.map((row, i) => (
                      <tr key={i}>
                        <td>{row.left}</td>
                        <td className="adminTableRight">{row.right}</td>
                      </tr>
                    ))}
                    {panel.rows.length === 0 && (
                      <tr>
                        <td colSpan={2} className="tableMutedCell">No data yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
