import { useAuth } from '../context/AuthContext';
import { MOCK_WATCHLIST, MOCK_ALL_REVIEWS, MOCK_SHOWS } from '../data/mockData';
import { Link } from 'react-router-dom';

const recentStatusClass = status => ({
  Watching: 's-watching',
  Completed: 's-completed',
  Dropped: 's-dropped',
  'Plan to Watch': 's-plan',
}[status] || 's-plan');

export default function ProfilePage() {
  const { user } = useAuth();

  const completed = MOCK_WATCHLIST.filter(e => e.status === 'Completed').length;
  const watching = MOCK_WATCHLIST.filter(e => e.status === 'Watching').length;
  const planned = MOCK_WATCHLIST.filter(e => e.status === 'Plan to Watch').length;
  const myReviews = MOCK_ALL_REVIEWS.filter(r => r.username === user?.username);
  const avgScore = myReviews.length > 0 ? (myReviews.reduce((a, r) => a + r.rating, 0) / myReviews.length).toFixed(1) : '—';

  const genreCounts = {};
  MOCK_WATCHLIST.forEach(e => {
    const show = MOCK_SHOWS.find(s => s._id === e.show._id);
    if (show) show.genre.forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1; });
  });
  const favGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const stats = [
    { icon: '✅', label: 'Completed', value: completed, valueClass: 'profileStatValueGreen' },
    { icon: '▶️', label: 'Watching', value: watching, valueClass: 'profileStatValueBlue' },
    { icon: '📋', label: 'Plan to Watch', value: planned, valueClass: 'profileStatValueMuted' },
    { icon: '⭐', label: 'Reviews', value: myReviews.length, valueClass: 'profileStatValueYellow' },
    { icon: '🎯', label: 'Avg Rating', value: avgScore, valueClass: 'profileStatValueViolet' },
    { icon: '🎬', label: 'Fav Genre', value: favGenre, valueClass: 'profileStatValueBrightBlue' },
  ];

  const recentActivity = MOCK_WATCHLIST.slice(0, 4);

  return (
    <div className="page-enter pageContainerMedium">
      <div className="profileHeaderCard">
        <div className="profileHeaderGlow" />
        <div className="profileAvatar">{user?.username?.[0]?.toUpperCase()}</div>
        <div className="profileHeaderContent">
          <h1 className="profileUsername">@{user?.username}</h1>
          <div className="profileMetaRow">
            <span className="badge-user">Standard User</span>
            <span className="profileMemberSince">Member since 2024</span>
          </div>
        </div>
      </div>

      <h2 className="sectionLabelUpper">Your Stats</h2>
      <div className="stagger profileStatsGrid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="profileStatLabel">{s.icon} {s.label.toUpperCase()}</div>
            <div className={`profileStatValue ${s.valueClass}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="profileColumns">
        <div>
          <h2 className="sectionLabelUpper">Recent Watchlist</h2>
          <div className="contentCard contentCardCompact">
            {recentActivity.map((entry, i) => (
              <div key={entry._id} className={`profileRecentRow ${i < recentActivity.length - 1 ? 'profileRecentRowBordered' : ''}`}>
                <div className="profileRecentPosterWrap">
                  {entry.show.posterUrl && <img src={entry.show.posterUrl} alt="" className="profileRecentPosterImage" />}
                </div>
                <div className="profileRecentContent">
                  <div className="profileRecentTitle">{entry.show.title}</div>
                  <span className={`status-pill ${recentStatusClass(entry.status)}`}>{entry.status}</span>
                </div>
              </div>
            ))}

            <div className="profileRecentFooter">
              <Link to="/watchlist" className="profileInlineLink">View all watchlist →</Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="sectionLabelUpper">My Reviews</h2>
          {myReviews.length === 0 ? (
            <div className="profileEmptyReviewsCard">
              <div className="profileEmptyIcon">⭐</div>
              <p className="profileEmptyText">You haven&apos;t reviewed anything yet.</p>
              <Link to="/catalog" className="profileInlineLink profileInlineLinkLarge">Browse Catalog →</Link>
            </div>
          ) : (
            <div className="contentCard contentCardCompact">
              {myReviews.map((r, i) => (
                <div key={r._id} className={`profileReviewRow ${i < myReviews.length - 1 ? 'profileReviewRowBordered' : ''}`}>
                  <div className="profileReviewHeader">
                    <span className="profileReviewShow">{r.show}</span>
                    <span className="ratingTag ratingTagTiny">★ {r.rating}/10</span>
                  </div>
                  <p className="profileReviewText">{r.reviewText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
