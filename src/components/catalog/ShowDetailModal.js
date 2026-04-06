import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { apiRequest } from '../../api/client';
import TypeBadge from './TypeBadge';

export default function ShowDetailModal({ show, onClose, user, watchlistEntry, onWatchlistChange, onWatchlistRemove }) {
  const [newRating, setNewRating] = useState(7);
  const [newText, setNewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [toast, setToast] = useState('');
  const [isSavingWatchlist, setIsSavingWatchlist] = useState(false);
  const [isPostingReview, setIsPostingReview] = useState(false);

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      try {
        const reviewData = await apiRequest(`/reviews/show/${show._id}`);
        if (!active) return;
        setReviews((Array.isArray(reviewData) ? reviewData : []).map(review => ({
          _id: review._id,
          username: review.userId?.username || 'user',
          rating: review.rating,
          reviewText: review.reviewText,
        })));
      } catch {
        if (active) setReviews([]);
      }
    };

    loadReviews();
    return () => {
      active = false;
    };
  }, [show._id]);

  const showToast = message => {
    setToast(message);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setToast(''), 2500);
  };

  const handleWatchlistToggle = async () => {
    if (!user?._id) {
      showToast('Sign in to manage your watchlist');
      return;
    }

    try {
      setIsSavingWatchlist(true);
      if (watchlistEntry?._id) {
        await apiRequest(`/watchlist/${watchlistEntry._id}`, { method: 'DELETE' });
        onWatchlistRemove(show._id);
        showToast('Removed from watchlist');
      } else {
        const created = await apiRequest('/watchlist', {
          method: 'POST',
          body: JSON.stringify({ showId: show._id, status: 'Plan to Watch', progress: 0 }),
        });
        onWatchlistChange(created);
        showToast('Added to watchlist');
      }
    } catch (error) {
      showToast(error.message || 'Could not update watchlist');
    } finally {
      setIsSavingWatchlist(false);
    }
  };

  const handleReview = async event => {
    event.preventDefault();

    if (!user?._id) {
      showToast('Sign in to post a review');
      return;
    }

    if (!newText.trim()) {
      showToast('Write a quick review first');
      return;
    }

    try {
      setIsPostingReview(true);
      const created = await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify({ showId: show._id, rating: newRating, reviewText: newText.trim() }),
      });

      setReviews(prev => [{
        _id: created._id,
        username: created.userId?.username || user.username,
        rating: created.rating,
        reviewText: created.reviewText,
      }, ...prev]);
      setNewText('');
      showToast('Review posted');
    } catch (error) {
      showToast(error.message || 'Could not post review');
    } finally {
      setIsPostingReview(false);
    }
  };

  const avgValue = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : (show.rating || null);
  const avgRating = avgValue || 'N/A';

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={event => event.stopPropagation()}>
        <div style={{ position: 'relative', height: 220, overflow: 'hidden', borderRadius: '18px 18px 0 0' }}>
          {show.posterUrl && <img src={show.posterUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'brightness(0.3)' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--surface-solid) 0%, rgba(19,19,34,0.4) 60%, transparent 100%)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', border: '1px solid var(--border)', color: 'var(--text-muted)', width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>X</button>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
              <TypeBadge type={show.type} />
              <span style={{ background: 'rgba(255,216,77,0.12)', border: '1px solid rgba(255,216,77,0.2)', color: 'var(--yellow)', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 5 }}>{avgRating}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{show.releaseYear}</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{show.title}</h2>
          </div>
        </div>

        <div style={{ padding: '18px 24px 26px' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {(show.genre || []).map(item => <span key={item} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4 }}>{item}</span>)}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 18 }}>{show.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: 'var(--surface2)', borderRadius: 10, padding: '12px 16px', border: '1px solid var(--border)', marginBottom: 18 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--yellow)', lineHeight: 1 }}>{avgRating}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2, fontWeight: 700 }}>avg rating</div>
            </div>
            <div style={{ width: 1, height: 34, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{reviews.length}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2, fontWeight: 700 }}>reviews</div>
            </div>
            <div style={{ flex: 1 }} />
            {toast && <span style={{ fontSize: 12, color: 'var(--blue-bright)', fontWeight: 600 }}>{toast}</span>}
            <button className={watchlistEntry ? 'btn-ghost' : 'btn-primary'} style={{ fontSize: 13, padding: '8px 16px' }} onClick={handleWatchlistToggle} disabled={isSavingWatchlist}>
              {isSavingWatchlist ? 'Saving...' : watchlistEntry ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          </div>

          <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Community Reviews</h4>
          {reviews.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>No reviews yet. Be the first!</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {reviews.map(review => (
              <div key={review._id} style={{ display: 'flex', gap: 12, padding: '11px 13px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{review.username[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>@{review.username}</span>
                    <span style={{ background: 'rgba(255,216,77,0.1)', border: '1px solid rgba(255,216,77,0.2)', color: 'var(--yellow)', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 4 }}>{review.rating}/10</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{review.reviewText}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Write a Review</h4>
            <form onSubmit={handleReview}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Your Rating</label>
                  <span style={{ background: 'rgba(255,216,77,0.1)', border: '1px solid rgba(255,216,77,0.2)', color: 'var(--yellow)', fontSize: 12, fontWeight: 700, padding: '1px 8px', borderRadius: 4 }}>{newRating}/10</span>
                </div>
                <input type="range" min={1} max={10} value={newRating} onChange={event => setNewRating(Number(event.target.value))} style={{ width: '100%', accentColor: 'var(--blue)' }} />
              </div>
              <textarea className="ct-input" rows={3} placeholder="Share your thoughts..." value={newText} onChange={event => setNewText(event.target.value)} style={{ resize: 'vertical', marginBottom: 10 }} />
              <button type="submit" className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }} disabled={isPostingReview}>{isPostingReview ? 'Posting...' : 'Post Review'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return modalContent;
  return createPortal(modalContent, document.body);
}
