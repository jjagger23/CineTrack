import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TypeBadge from './TypeBadge';

export default function ShowDetailModal({ show, onClose, user, apiBase }) {
  const [newRating, setNewRating] = useState(7);
  const [newText, setNewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [onWatchlist, setOnWatchlist] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const reviewRes = await fetch(`${apiBase}/reviews/show/${show._id}`);
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          if (active) {
            setReviews((Array.isArray(reviewData) ? reviewData : []).map(r => ({
              _id: r._id,
              username: r.userId?.username || 'user',
              rating: r.rating,
              reviewText: r.reviewText,
            })));
          }
        }

        if (user?._id) {
          const watchlistRes = await fetch(`${apiBase}/watchlist/user/${user._id}`);
          if (watchlistRes.ok) {
            const watchlistData = await watchlistRes.json();
            const exists = (Array.isArray(watchlistData) ? watchlistData : []).some(w => {
              const id = typeof w.showId === 'object' ? w.showId?._id : w.showId;
              return id === show._id;
            });
            if (active) setOnWatchlist(exists);
          }
        }
      } catch {
        if (active) setReviews([]);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [apiBase, show._id, user?._id]);

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleAdd = async () => {
    if (!user?._id) {
      showToast('Sign in to add to watchlist');
      return;
    }

    if (onWatchlist) {
      showToast('Already on your watchlist!');
      return;
    }

    try {
      const res = await fetch(`${apiBase}/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, showId: show._id, status: 'Plan to Watch', progress: 0 }),
      });

      if (!res.ok) throw new Error('Failed to add to watchlist');
      setOnWatchlist(true);
      showToast('Added to watchlist ✓');
    } catch {
      showToast('Could not update watchlist');
    }
  };

  const handleReview = async e => {
    e.preventDefault();

    if (!user?._id) {
      showToast('Sign in to post a review');
      return;
    }

    if (!newText.trim()) {
      showToast('Write a quick review first');
      return;
    }

    try {
      const res = await fetch(`${apiBase}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, showId: show._id, rating: newRating, reviewText: newText.trim() }),
      });

      if (!res.ok) throw new Error('Failed to post review');
      const created = await res.json();
      setReviews(prev => [{ _id: created._id, username: user.username, rating: created.rating, reviewText: created.reviewText }, ...prev]);
      setNewText('');
      showToast('Review posted ✓');
    } catch {
      showToast('Could not post review');
    }
  };

  const avgValue = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : (show.rating || null);
  const avgRating = avgValue || 'N/A';

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modalHeaderMedia">
          {show.posterUrl && <img src={show.posterUrl} alt="" className="modalHeaderImage" />}
          <div className="modalHeaderGradient" />
          <button onClick={onClose} className="modalCloseButton">✕</button>

          <div className="modalHeaderContent">
            <div className="modalHeaderBadges">
              <TypeBadge type={show.type} />
              <span className="ratingTag ratingTagCompact">★ {avgRating}</span>
              <span className="modalHeaderYear">{show.releaseYear}</span>
            </div>
            <h2 className="modalHeaderTitle">{show.title}</h2>
          </div>
        </div>

        <div className="modalBodyContent">
          <div className="modalGenreRow">
            {show.genre.map(g => <span key={g} className="modalGenreTag">{g}</span>)}
          </div>

          <p className="modalDescription">{show.description}</p>

          <div className="modalStatsBar">
            <div className="modalStatBlock">
              <div className="modalStatPrimary">{avgRating}</div>
              <div className="modalStatLabel">avg rating</div>
            </div>
            <div className="modalStatDivider" />
            <div className="modalStatBlock">
              <div className="modalStatSecondary">{reviews.length}</div>
              <div className="modalStatLabel">reviews</div>
            </div>
            <div className="modalStatsSpacer" />
            {toast && <span className="modalToastText">{toast}</span>}
            <button className={`${onWatchlist ? 'btn-ghost' : 'btn-primary'} modalWatchlistButton`} onClick={handleAdd}>
              {onWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
            </button>
          </div>

          <h4 className="modalSectionTitle">Community Reviews</h4>
          {reviews.length === 0 && <p className="modalEmptyReviews">No reviews yet. Be the first!</p>}

          <div className="modalReviewsList">
            {reviews.map(r => (
              <div key={r._id} className="modalReviewItem">
                <div className="modalReviewAvatar">{r.username[0].toUpperCase()}</div>
                <div className="modalReviewBody">
                  <div className="modalReviewHeader">
                    <span className="modalReviewUser">@{r.username}</span>
                    <span className="ratingTag ratingTagTiny">★ {r.rating}/10</span>
                  </div>
                  <p className="modalReviewText">{r.reviewText}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="modalReviewComposer">
            <h4 className="modalSectionTitle">Write a Review</h4>
            <form onSubmit={handleReview}>
              <div className="modalRatingGroup">
                <div className="modalRatingRow">
                  <label className="modalRatingLabel">Your Rating</label>
                  <span className="ratingTag ratingTagCompact">★ {newRating}/10</span>
                </div>
                <input type="range" min={1} max={10} value={newRating} onChange={e => setNewRating(Number(e.target.value))} className="modalRangeInput" />
              </div>
              <textarea className="ct-input modalReviewTextarea" rows={3} placeholder="Share your thoughts..." value={newText} onChange={e => setNewText(e.target.value)} />
              <button type="submit" className="btn-primary modalPostButton">Post Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
