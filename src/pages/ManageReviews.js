import { useState } from 'react';
import { MOCK_ALL_REVIEWS } from '../data/mockData';

export default function ManageReviews() {
  const [reviews, setReviews] = useState(MOCK_ALL_REVIEWS);
  const [toast, setToast] = useState('');

  const notify = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleDelete = id => {
    setReviews(prev => prev.filter(r => r._id !== id));
    notify('Review removed');
  };

  return (
    <div className="page-enter pageContainerReviews">
      <div className="pageHeaderGroup">
        <h1 className="pageTitle">Manage Reviews</h1>
        <p className="pageSubtitle">{reviews.length} reviews total</p>
      </div>

      {toast && <div className="toast">{toast}</div>}

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
    </div>
  );
}
