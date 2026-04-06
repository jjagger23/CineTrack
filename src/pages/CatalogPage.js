import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';

const TypeBadge = ({ type }) => <span className={type === 'Movie' ? 'badge-film' : 'badge-series'}>{type === 'Movie' ? 'FILM' : 'SERIES'}</span>;

export default function CatalogPage() {
  const { user, isAuthenticated } = useAuth();
  const [shows, setShows] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [type, setType] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('category');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiSearchMessage, setApiSearchMessage] = useState('');
  const [isApiSearching, setIsApiSearching] = useState(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [showsData, watchlistData] = await Promise.all([
          apiRequest('/shows'),
          isAuthenticated ? apiRequest('/watchlist') : Promise.resolve([]),
        ]);

        if (!active) return;
        setShows(Array.isArray(showsData) ? showsData : []);
        setWatchlist(Array.isArray(watchlistData) ? watchlistData : []);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load catalog');
        setShows([]);
        setWatchlist([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const genres = useMemo(() => {
    const unique = new Set();
    shows.forEach(show => (show.genre || []).forEach(item => unique.add(item)));
    return Array.from(unique).sort();
  }, [shows]);

  const watchlistByShowId = useMemo(() => {
    const map = new Map();
    watchlist.forEach(entry => {
      const showId = typeof entry.showId === 'object' ? entry.showId?._id : entry.showId;
      if (showId) map.set(showId, entry);
    });
    return map;
  }, [watchlist]);

  const filtered = useMemo(() => shows.filter(show => {
    const matchesSearch = !search || show.title?.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = !genre || (show.genre || []).includes(genre);
    const matchesType = !type || show.type === type;
    return matchesSearch && matchesGenre && matchesType;
  }), [shows, search, genre, type]);

  const byGenre = useMemo(() => {
    const groups = {};
    genres.forEach(item => {
      const groupedShows = filtered.filter(show => (show.genre || []).includes(item));
      if (groupedShows.length) groups[item] = groupedShows;
    });
    return groups;
  }, [filtered, genres]);

  const isFiltering = search || genre || type;
  const featured = shows[4] || shows[0] || null;

  const handleWatchlistChange = updatedEntry => {
    setWatchlist(prev => {
      const showId = typeof updatedEntry.showId === 'object' ? updatedEntry.showId?._id : updatedEntry.showId;
      const next = prev.filter(entry => {
        const entryShowId = typeof entry.showId === 'object' ? entry.showId?._id : entry.showId;
        return entryShowId !== showId;
      });
      return [updatedEntry, ...next];
    });
  };

  const handleWatchlistRemove = removedShowId => {
    setWatchlist(prev => prev.filter(entry => {
      const entryShowId = typeof entry.showId === 'object' ? entry.showId?._id : entry.showId;
      return entryShowId !== removedShowId;
    }));
  };

  const handleApiSearch = async () => {
    const query = search.trim();
    if (!query) return;

    try {
      setIsApiSearching(true);
      setApiSearchMessage('');
      const results = await apiRequest(`/shows/search-external?q=${encodeURIComponent(query)}`);
      const normalized = Array.isArray(results) ? results : [];

      setShows(prev => {
        const byId = new Map(prev.map(show => [show._id, show]));
        normalized.forEach(show => {
          if (show?._id) byId.set(show._id, show);
        });
        return Array.from(byId.values());
      });

      setApiSearchMessage(normalized.length ? `Fetched ${normalized.length} result${normalized.length === 1 ? '' : 's'} from API` : 'No external matches found');
    } catch (err) {
      setApiSearchMessage(err.message || 'External search failed');
    } finally {
      setIsApiSearching(false);
    }
  };

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 28px 60px' }}>
      {!isFiltering && featured && (
        <div style={{ position: 'relative', height: 380, borderRadius: 18, overflow: 'hidden', marginBottom: 44, background: 'var(--surface2)' }}>
          <img src={featured.posterUrl} alt={featured.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'brightness(0.35)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,11,20,0.98) 0%, rgba(11,11,20,0.6) 55%, transparent 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
              <span style={{ background: 'var(--grad)', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 1, padding: '3px 10px', borderRadius: 5 }}>FEATURED</span>
              <TypeBadge type={featured.type} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, marginBottom: 10, lineHeight: 1, letterSpacing: -1 }}>{featured.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, maxWidth: 500, lineHeight: 1.65, marginBottom: 22 }}>{featured.description}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button className="btn-primary" onClick={() => setSelected(featured)} style={{ padding: '11px 26px', fontSize: 14 }}>View Details</button>
              {featured.rating && <span style={{ background: 'rgba(255,216,77,0.12)', border: '1px solid rgba(255,216,77,0.25)', color: 'var(--yellow)', fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>{featured.rating}</span>}
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>{featured.releaseYear}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, letterSpacing: -0.5, marginBottom: 3 }}>Browse Catalog</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{filtered.length} titles</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 9, overflow: 'hidden' }}>
          {[['category', 'By Category'], ['list', 'All Titles']].map(([value, label]) => (
            <button key={value} onClick={() => setView(value)} style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', background: value === view ? 'var(--grad)' : 'transparent', color: value === view ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s' }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 300 }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: 13 }}>Search</span>
          <input className="ct-input" style={{ paddingLeft: 58 }} placeholder="Search titles..." value={search} onChange={event => setSearch(event.target.value)} />
        </div>
        <button className="btn-primary" style={{ fontSize: 12, padding: '8px 13px' }} onClick={handleApiSearch} disabled={!search.trim() || isApiSearching}>
          {isApiSearching ? 'Searching API...' : 'Search API'}
        </button>
        <select className="ct-input" style={{ maxWidth: 148 }} value={type} onChange={event => setType(event.target.value)}>
          <option value="">All Types</option>
          <option value="Movie">Movies</option>
          <option value="TV Show">TV Shows</option>
        </select>
        {isFiltering && <button className="btn-ghost" style={{ fontSize: 12, padding: '8px 13px' }} onClick={() => { setSearch(''); setGenre(''); setType(''); }}>Clear</button>}
      </div>
      {apiSearchMessage && <div style={{ marginBottom: 16, color: apiSearchMessage.includes('failed') ? 'var(--red)' : 'var(--text-muted)', fontSize: 12 }}>{apiSearchMessage}</div>}

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
        {genres.map(item => (
          <button key={item} onClick={() => setGenre(genre === item ? '' : item)} className={`tag ${genre === item ? 'active' : ''}`} style={{ background: 'none', border: 'none' }}>{item}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading shows...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--red)' }}>{error}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>No matches</div>
          <p>No titles found.</p>
        </div>
      ) : view === 'list' || isFiltering ? (
        <div className="stagger" style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          {filtered.map((show, index) => <ShowRow key={show._id} show={show} index={index} total={filtered.length} onClick={() => setSelected(show)} />)}
        </div>
      ) : (
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
          {Object.entries(byGenre).map(([item, groupedShows]) => (
            <div key={item}>
              <div className="section-divider">
                <h2>{item}</h2>
                <span className="count">{groupedShows.length}</span>
                <div className="line" />
              </div>
              <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                {groupedShows.map((show, index) => <ShowRow key={show._id} show={show} index={index} total={groupedShows.length} onClick={() => setSelected(show)} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <ShowDetailModal
          show={selected}
          user={user}
          watchlistEntry={watchlistByShowId.get(selected._id) || null}
          onClose={() => setSelected(null)}
          onWatchlistChange={handleWatchlistChange}
          onWatchlistRemove={handleWatchlistRemove}
        />
      )}
    </div>
  );
}

function ShowRow({ show, index, total, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="show-row" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick} style={{ borderBottom: index < total - 1 ? '1px solid var(--border2)' : 'none' }}>
      <div style={{ width: 26, flexShrink: 0, textAlign: 'right', fontSize: 11, color: 'var(--text-dim)', fontWeight: 700, paddingTop: 3 }}>{String(index + 1).padStart(2, '0')}</div>
      <div style={{ width: 50, height: 70, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--surface2)' }}>
        {show.posterUrl && <img src={show.posterUrl} alt={show.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
          <span className="show-title" style={{ fontWeight: 700, fontSize: 14, color: hovered ? 'var(--blue-bright)' : 'var(--text)' }}>{show.title}</span>
          <TypeBadge type={show.type} />
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{show.releaseYear}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{show.description}</p>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {(show.genre || []).map(item => <span key={item} style={{ fontSize: 10, color: 'var(--text-dim)', background: 'var(--surface3)', border: '1px solid var(--border)', padding: '1px 7px', borderRadius: 4, fontWeight: 600 }}>{item}</span>)}
        </div>
      </div>
      {show.rating && <div className="rating-box"><div className="val">{show.rating}</div><div className="denom">/ 10</div><div style={{ fontSize: 10, marginTop: 3 }}>*</div></div>}
    </div>
  );
}

function ShowDetailModal({ show, onClose, user, watchlistEntry, onWatchlistChange, onWatchlistRemove }) {
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

  return (
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
}
