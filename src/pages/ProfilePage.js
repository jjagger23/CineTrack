import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';

const statusClass = status => ({ Watching: 's-watching', Completed: 's-completed', Dropped: 's-dropped', 'Plan to Watch': 's-plan' }[status] || 's-plan');

export default function ProfilePage() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const [watchlistData, reviewData] = await Promise.all([
          apiRequest('/watchlist'),
          apiRequest(`/reviews/user/${user._id}`),
        ]);

        if (!active) return;
        setWatchlist(Array.isArray(watchlistData) ? watchlistData : []);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [user?._id]);

  const stats = useMemo(() => {
    const completed = watchlist.filter(entry => entry.status === 'Completed').length;
    const watching = watchlist.filter(entry => entry.status === 'Watching').length;
    const planned = watchlist.filter(entry => entry.status === 'Plan to Watch').length;
    const avgScore = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '-';
    const genreCounts = {};

    watchlist.forEach(entry => {
      (entry.showId?.genre || []).forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const favGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    return [
      { icon: 'Done', label: 'Completed', value: completed, color: 'var(--green)' },
      { icon: 'Now', label: 'Watching', value: watching, color: 'var(--blue)' },
      { icon: 'List', label: 'Plan to Watch', value: planned, color: 'var(--text-muted)' },
      { icon: 'Rate', label: 'Reviews', value: reviews.length, color: 'var(--yellow)' },
      { icon: 'Avg', label: 'Avg Rating', value: avgScore, color: 'var(--violet-bright)' },
      { icon: 'Genre', label: 'Fav Genre', value: favGenre, color: 'var(--blue-bright)' },
    ];
  }, [reviews, watchlist]);

  const recentActivity = watchlist.slice(0, 4);

  return (
    <div className="page-enter" style={{ maxWidth: 900, margin: '0 auto', padding: '36px 28px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40, padding: '28px 32px', background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 18, position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(77,159,255,0.06), rgba(124,58,237,0.06))', pointerEvents: 'none' }} />
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff', flexShrink: 0, boxShadow: '0 8px 24px rgba(77,159,255,0.3)', position: 'relative', zIndex: 1 }}>
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, letterSpacing: -0.5, marginBottom: 4 }}>@{user?.username}</h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge-user">{user?.role === 'admin' ? 'Admin User' : 'Standard User'}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {user?.createdAt ? `Member since ${new Date(user.createdAt).getFullYear()}` : 'Member'}
            </span>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Your Stats</h2>
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 36 }}>
        {stats.map(stat => (
          <div key={stat.label} className="stat-card">
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>{stat.icon} {stat.label.toUpperCase()}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: stat.color, lineHeight: 1 }}>{loading ? '...' : stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Recent Watchlist</h2>
          <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {recentActivity.length === 0 ? (
              <div style={{ padding: '24px 16px', color: 'var(--text-muted)', fontSize: 13 }}>Nothing on your watchlist yet.</div>
            ) : recentActivity.map((entry, index) => (
              <div key={entry._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: index < recentActivity.length - 1 ? '1px solid var(--border2)' : 'none', transition: 'background 0.15s' }} onMouseEnter={event => { event.currentTarget.style.background = 'rgba(77,159,255,0.03)'; }} onMouseLeave={event => { event.currentTarget.style.background = 'transparent'; }}>
                <div style={{ width: 36, height: 50, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: 'var(--surface2)' }}>
                  {entry.showId?.posterUrl && <img src={entry.showId.posterUrl} alt={entry.showId.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.showId?.title}</div>
                  <span className={`status-pill ${statusClass(entry.status)}`}>{entry.status}</span>
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border2)' }}>
              <Link to="/watchlist" style={{ fontSize: 12, color: 'var(--blue-bright)', fontWeight: 600 }}>View all watchlist {'->'}</Link>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>My Reviews</h2>
          {reviews.length === 0 ? (
            <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12, padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>Review</div>
              <p style={{ fontSize: 13, marginBottom: 14 }}>You haven't reviewed anything yet.</p>
              <Link to="/catalog" style={{ fontSize: 13, color: 'var(--blue-bright)', fontWeight: 600 }}>Browse Catalog {'->'}</Link>
            </div>
          ) : (
            <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {reviews.map((review, index) => (
                <div key={review._id} style={{ padding: '12px 16px', borderBottom: index < reviews.length - 1 ? '1px solid var(--border2)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{review.showId?.title || 'Untitled show'}</span>
                    <span style={{ background: 'rgba(255,216,77,0.1)', border: '1px solid rgba(255,216,77,0.2)', color: 'var(--yellow)', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 4 }}>{review.rating}/10</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{review.reviewText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
