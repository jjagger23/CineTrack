import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [shows, setShows] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const [showData, userData, reviewData] = await Promise.all([
          apiRequest('/shows'),
          apiRequest('/users'),
          apiRequest('/reviews'),
        ]);

        if (!active) return;
        setShows(Array.isArray(showData) ? showData : []);
        setUsers(Array.isArray(userData) ? userData : []);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch {
        if (!active) return;
        setShows([]);
        setUsers([]);
        setReviews([]);
      }
    };

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => ([
    { icon: 'Catalog', label: 'Total Shows', value: shows.length, link: '/admin/shows', color: 'var(--blue)' },
    { icon: 'Users', label: 'Users', value: users.length, link: '/admin/users', color: 'var(--green)' },
    { icon: 'Reviews', label: 'Reviews', value: reviews.length, link: '/admin/reviews', color: 'var(--yellow)' },
    { icon: 'Series', label: 'TV Shows', value: shows.filter(show => show.type === 'TV Show').length, link: '/admin/shows', color: 'var(--violet-bright)' },
  ]), [reviews.length, shows, users.length]);

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 28px 60px' }}>
      <div style={{ marginBottom: 36 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 4 }}>Good to see you,</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, letterSpacing: -0.5 }}>
          <span className="grad-text">{user?.username}</span> {'->'}
        </h1>
      </div>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 36 }}>
        {stats.map(stat => (
          <Link key={stat.label} to={stat.link} style={{ textDecoration: 'none' }}>
            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{stat.icon}</div>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{'->'}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: stat.color, lineHeight: 1, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {[
          {
            title: 'Recent Shows',
            link: '/admin/shows',
            rows: shows.slice(0, 5).map(show => ({
              left: <><div style={{ width: 36, height: 50, borderRadius: 5, overflow: 'hidden', background: 'var(--surface2)', marginRight: 10, display: 'inline-block', verticalAlign: 'middle' }}>{show.posterUrl && <img src={show.posterUrl} alt={show.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div><span style={{ fontWeight: 600, fontSize: 13, verticalAlign: 'middle' }}>{show.title}</span></>,
              right: <span style={{ fontSize: 10, fontWeight: 800, color: show.type === 'Movie' ? 'var(--blue-bright)' : 'var(--violet-bright)' }}>{show.type === 'Movie' ? 'FILM' : 'SERIES'}</span>,
            })),
          },
          {
            title: 'Recent Reviews',
            link: '/admin/reviews',
            rows: reviews.slice(0, 5).map(review => ({
              left: <><div style={{ fontWeight: 600, fontSize: 13 }}>@{review.userId?.username || 'user'}</div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{review.showId?.title || 'Untitled show'}</div></>,
              right: <span style={{ background: 'rgba(255,216,77,0.1)', border: '1px solid rgba(255,216,77,0.2)', color: 'var(--yellow)', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 4 }}>{review.rating}</span>,
            })),
          },
        ].map(panel => (
          <div key={panel.title} style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700 }}>{panel.title}</h3>
              <Link to={panel.link} style={{ fontSize: 12, fontWeight: 600 }} className="grad-text">Manage {'->'}</Link>
            </div>
            <table className="ct-table">
              <tbody>
                {panel.rows.map((row, index) => (
                  <tr key={index}><td>{row.left}</td><td style={{ textAlign: 'right' }}>{row.right}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
