import { Link } from 'react-router-dom';
import { MOCK_SHOWS, MOCK_USERS, MOCK_ALL_REVIEWS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const stats = [
    { icon: '🎬', label: 'Total Shows', value: MOCK_SHOWS.length, link: '/admin/shows', colorClass: 'adminStatValueBlue', iconClass: 'adminIconBlue' },
    { icon: '👥', label: 'Users', value: MOCK_USERS.length, link: '/admin/users', colorClass: 'adminStatValueGreen', iconClass: 'adminIconGreen' },
    { icon: '⭐', label: 'Reviews', value: MOCK_ALL_REVIEWS.length, link: '/admin/reviews', colorClass: 'adminStatValueYellow', iconClass: 'adminIconYellow' },
    { icon: '📺', label: 'TV Shows', value: MOCK_SHOWS.filter(s => s.type === 'TV Show').length, link: '/admin/shows', colorClass: 'adminStatValueViolet', iconClass: 'adminIconViolet' },
  ];

  return (
    <div className="page-enter pageContainerWide">
      <div className="adminGreeting">
        <p className="adminGreetingText">Good to see you,</p>
        <h1 className="adminGreetingTitle"><span className="grad-text">{user?.username}</span> ↗</h1>
      </div>

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
        {[
          {
            title: 'Recent Shows',
            link: '/admin/shows',
            rows: MOCK_SHOWS.slice(0, 5).map(s => ({
              left: <><div className="adminPosterThumb">{s.posterUrl && <img src={s.posterUrl} alt="" className="adminPosterThumbImage" />}</div><span className="adminRowStrong">{s.title}</span></>,
              right: <span className={s.type === 'Movie' ? 'badge-film' : 'badge-series'}>{s.type === 'Movie' ? 'FILM' : 'SERIES'}</span>,
            })),
          },
          {
            title: 'Recent Reviews',
            link: '/admin/reviews',
            rows: MOCK_ALL_REVIEWS.slice(0, 5).map(r => ({
              left: <><div className="adminRowStrong">@{r.username}</div><div className="adminRowSubtext">{r.show}</div></>,
              right: <span className="ratingTag ratingTagTiny">★ {r.rating}</span>,
            })),
          },
        ].map(panel => (
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
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
