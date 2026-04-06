import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      try {
        const data = await apiRequest('/reviews');
        if (active) setReviews(Array.isArray(data) ? data : []);
      } catch {
        if (active) setReviews([]);
      }
    };

    loadReviews();
    return () => {
      active = false;
    };
  }, []);

  const notify = message => {
    setToast(message);
    window.clearTimeout(notify.timeoutId);
    notify.timeoutId = window.setTimeout(() => setToast(''), 2500);
  };

  const handleDelete = async id => {
    try {
      await apiRequest(`/reviews/admin/${id}`, { method: 'DELETE' });
      setReviews(prev => prev.filter(review => review._id !== id));
      notify('Review removed');
    } catch (err) {
      notify(err.message || 'Could not remove review');
    }
  };

  return (
    <div className="page-enter" style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 28px 60px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, letterSpacing: -0.5, marginBottom: 4 }}>Manage Reviews</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{reviews.length} reviews total</p>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
        {reviews.map((review, index) => (
          <div key={review._id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px', borderBottom: index < reviews.length - 1 ? '1px solid var(--border2)' : 'none', transition: 'background 0.15s' }} onMouseEnter={event => { event.currentTarget.style.background = 'rgba(77,159,255,0.03)'; }} onMouseLeave={event => { event.currentTarget.style.background = 'transparent'; }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', boxShadow: '0 2px 10px rgba(77,159,255,0.2)' }}>
              {review.userId?.username?.[0]?.toUpperCase() || 'U'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>@{review.userId?.username || 'user'}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>reviewed</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{review.showId?.title || 'Untitled show'}</span>
                <span style={{ background: 'rgba(255,216,77,0.1)', border: '1px solid rgba(255,216,77,0.2)', color: 'var(--yellow)', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 4 }}>{review.rating}/10</span>
                <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 'auto' }}>
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.55 }}>{review.reviewText}</p>
            </div>

            <button className="btn-danger" style={{ flexShrink: 0 }} onClick={() => handleDelete(review._id)}>Delete</button>
          </div>
        ))}
        {reviews.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 14 }}>No reviews to moderate.</div>
        )}
      </div>
    </div>
  );
}
