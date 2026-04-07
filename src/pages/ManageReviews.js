import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL;

export default function ManageReviews() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const notify = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API}/reviews`);
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to load reviews');
      const data = await res.json();
      setReviews((Array.isArray(data) ? data : []).map(r => ({
        _id: r._id,
        username: r.userId?.username || 'user',
        show: r.showId?.title || 'Unknown show',
        rating: r.rating,
        reviewText: r.reviewText,
        createdAt: r.createdAt,
      })));
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async id => {
    try {
      const res = await fetch(`${API}/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to remove review');
      setReviews(prev => prev.filter(r => r._id !== id));
      notify('Review removed');
    } catch (err) {
      notify(err.message || 'Could not remove review');
    }
  };

  return (
    <div className="page-enter pageContainerReviews">
      <div className="pageHeaderGroup">
        <h1 className="pageTitle">Manage Reviews</h1>
        <p className="pageSubtitle">{reviews.length} reviews total</p>
      </div>

      {toast && <div className="toast">{toast}</div>}
      {error && <div className="authErrorBox">{error}</div>}

      {loading ? (
        <div className="catalogStateMessage">Loading reviews...</div>
      ) : (
        <div className="contentCard">
          {reviews.map((r, i) => (
            <div key={r._id} className={`manageReviewRow ${i < reviews.length - 1 ? 'manageReviewRowBordered' : ''}`}>
              <div className="manageReviewAvatar">{r.username[0].toUpperCase()}</div>

              <div className="manageReviewBody">
                <div className="manageReviewHeader">
                  <span className="manageReviewUser">@{r.username}</span>
                  <span className="manageReviewVerb">reviewed</span>
                  <span className="manageReviewShow">{r.show}</span>
                  <span className="ratingTag ratingTagTiny">★ {r.rating}/10</span>
                  <span className="manageReviewDate">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <p className="manageReviewText">{r.reviewText}</p>
              </div>

              <button className="btn-danger manageReviewDelete" onClick={() => handleDelete(r._id)}>Delete</button>
            </div>
          ))}

          {reviews.length === 0 && <div className="emptyStateInline">No reviews to moderate.</div>}
        </div>
      )}
    </div>
  );
}
