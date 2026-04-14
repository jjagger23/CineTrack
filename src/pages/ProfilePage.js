import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const recentStatusClass = status => ({
  Watching: 's-watching',
  Completed: 's-completed',
  Dropped: 's-dropped',
  'Plan to Watch': 's-plan',
}[status] || 's-plan');

const API = process.env.REACT_APP_API_URL;

const normalizeWatchlistEntry = entry => {
  const show = entry?.showId && typeof entry.showId === 'object' ? entry.showId : entry?.show;
  if (!show) return null;

  return {
    _id: entry._id,
    status: entry.status || 'Plan to Watch',
    addedAt: entry.addedAt,
    show: {
      _id: show._id,
      title: show.title,
      posterUrl: show.posterUrl,
      genre: Array.isArray(show.genre) ? show.genre : [],
    },
  };
};

const normalizeReview = review => ({
  _id: review._id,
  rating: review.rating,
  reviewText: review.reviewText,
  createdAt: review.createdAt,
  show: review.showId?.title || 'Untitled Show',
});

export default function ProfilePage() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProfileData = async () => {
      if (!user?._id) {
        if (active) {
          setWatchlist([]);
          setMyReviews([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [watchlistRes, reviewsRes] = await Promise.all([
          fetch(`${API}/watchlist/user/${user._id}`),
          fetch(`${API}/reviews/user/${user._id}`),
        ]);

        if (!watchlistRes.ok) throw new Error('Failed to load profile');
        if (!reviewsRes.ok) throw new Error('Failed to load profile');

        const [watchlistData, reviewsData] = await Promise.all([
          watchlistRes.json(),
          reviewsRes.json(),
        ]);

        if (!active) return;

        setWatchlist(
          (Array.isArray(watchlistData) ? watchlistData : [])
            .map(normalizeWatchlistEntry)
            .filter(Boolean)
            .sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0)),
        );
        setMyReviews(
          (Array.isArray(reviewsData) ? reviewsData : [])
            .map(normalizeReview)
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
        );
      } catch (err) {
        if (active) {
          setWatchlist([]);
          setMyReviews([]);
          setError(err.message || 'Failed to load profile');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfileData();
    return () => {
      active = false;
    };
  }, [user?._id]);

  const completed = watchlist.filter(entry => entry.status === 'Completed').length;
  const watching = watchlist.filter(entry => entry.status === 'Watching').length;
  const planned = watchlist.filter(entry => entry.status === 'Plan to Watch').length;
  const avgScore = myReviews.length > 0 ? (myReviews.reduce((a, review) => a + review.rating, 0) / myReviews.length).toFixed(1) : '—';

  const favGenre = useMemo(() => {
    const genreCounts = {};
    watchlist.forEach(entry => {
      entry.show.genre.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    return Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  }, [watchlist]);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
    : '—';

  const stats = [
    { icon: '✅', label: 'Completed', value: completed, valueClass: 'profileStatValueGreen' },
    { icon: '▶️', label: 'Watching', value: watching, valueClass: 'profileStatValueBlue' },
    { icon: '📋', label: 'Plan to Watch', value: planned, valueClass: 'profileStatValueMuted' },
    { icon: '⭐', label: 'Reviews', value: myReviews.length, valueClass: 'profileStatValueYellow' },
    { icon: '🎯', label: 'Avg Rating', value: avgScore, valueClass: 'profileStatValueViolet' },
    { icon: '🎬', label: 'Fav Genre', value: favGenre, valueClass: 'profileStatValueBrightBlue' },
  ];

  const recentActivity = watchlist.slice(0, 4);

  return (
    <div className="page-enter pageContainerMedium">
      <div className="profileHeaderCard">
        <div className="profileHeaderGlow" />
        <div className="profileAvatar">{user?.username?.[0]?.toUpperCase()}</div>
        <div className="profileHeaderContent">
          <h1 className="profileUsername">@{user?.username}</h1>
          <div className="profileMetaRow">
            <span className="badge-user">Standard User</span>
            <span className="profileMemberSince">Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="catalogStateMessage">Loading profile...</div>
      ) : error ? (
        <div className="catalogStateMessage catalogStateError">{error}</div>
      ) : (
        <>
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
                {recentActivity.length === 0 ? (
                  <div className="profileEmptyReviewsCard">
                    <div className="profileEmptyIcon">📋</div>
                    <p className="profileEmptyText">Your watchlist is empty.</p>
                    <Link to="/catalog" className="profileInlineLink profileInlineLinkLarge">Browse Catalog →</Link>
                  </div>
                ) : (
                  recentActivity.map((entry, i) => (
                    <div key={entry._id} className={`profileRecentRow ${i < recentActivity.length - 1 ? 'profileRecentRowBordered' : ''}`}>
                      <div className="profileRecentPosterWrap">
                        {entry.show.posterUrl && <img src={entry.show.posterUrl} alt="" className="profileRecentPosterImage" />}
                      </div>
                      <div className="profileRecentContent">
                        <div className="profileRecentTitle">{entry.show.title}</div>
                        <span className={`status-pill ${recentStatusClass(entry.status)}`}>{entry.status}</span>
                      </div>
                    </div>
                  ))
                )}

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
        </>
      )}
    </div>
  );
}
