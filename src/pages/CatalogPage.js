import { useState, useMemo } from 'react';
import { MOCK_SHOWS, MOCK_REVIEWS, MOCK_WATCHLIST, GENRES } from '../data/mockData';
import ShowCard from '../components/ShowCard';

export default function CatalogPage() {
  const [search,   setSearch]   = useState('');
  const [genre,    setGenre]    = useState('');
  const [type,     setType]     = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => MOCK_SHOWS.filter(s => {
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre  = !genre  || s.genre.includes(genre);
    const matchType   = !type   || s.type === type;
    return matchSearch && matchGenre && matchType;
  }), [search, genre, type]);

  const featured = MOCK_SHOWS[0];

  return (
    <div className="page-enter" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px 60px' }}>

      {/* Hero banner */}
      {!search && !genre && !type && (
        <div style={{
          position: 'relative', height: 420, borderRadius: 18, overflow: 'hidden',
          marginBottom: 48, marginTop: 28,
          background: 'var(--surface)',
        }}>
          {featured.posterUrl && (
            <img src={featured.posterUrl} alt={featured.title} style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 20%', filter: 'brightness(0.45)',
            }} />
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(15,15,15,0.97) 0%, rgba(15,15,15,0.5) 60%, transparent 100%)',
          }} />
          <div style={{ position: 'absolute', inset: 0, padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span style={{ background: 'var(--blue)', color: '#000', fontSize: 10, fontWeight: 800, letterSpacing: 1, padding: '3px 10px', borderRadius: 5 }}>FEATURED</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: '3px 10px', borderRadius: 5 }}>{featured.type.toUpperCase()}</span>
            </div>
            <h1 style={{ fontSize: 52, fontFamily: 'var(--font-display)', marginBottom: 12, lineHeight: 1, letterSpacing: -1 }}>{featured.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, maxWidth: 500, lineHeight: 1.65, marginBottom: 24 }}>{featured.description}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button className="btn-green" style={{ padding: '12px 28px', fontSize: 15 }} onClick={() => setSelected(featured)}>
                ▶ View Details
              </button>
              <span className="rating-pill" style={{ fontSize: 13 }}>★ {featured.rating}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{featured.releaseYear}</span>
            </div>
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220, maxWidth: 340 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: 15 }}>🔍</span>
          <input className="ct-input" style={{ paddingLeft: 36 }} placeholder="Search titles..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="ct-input" style={{ maxWidth: 160 }} value={type} onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Movie">Movies</option>
          <option value="TV Show">TV Shows</option>
        </select>
        {(search || genre || type) && (
          <button className="btn-ghost" style={{ fontSize: 13, padding: '9px 16px' }}
            onClick={() => { setSearch(''); setGenre(''); setType(''); }}>
            ✕ Clear
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
          {filtered.length} titles
        </span>
      </div>

      {/* Genre pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        {GENRES.map(g => (
          <button key={g} className={`tag ${genre === g ? 'active' : ''}`}
            style={{ background: 'none', border: 'none' }}
            onClick={() => setGenre(genre === g ? '' : g)}>
            {g}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: 16 }}>No titles match your search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 16 }}>
          {filtered.map(show => (
            <ShowCard key={show._id} show={show} onClick={() => setSelected(show)} />
          ))}
        </div>
      )}

      {selected && <ShowDetailModal show={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ShowDetailModal({ show, onClose }) {
  const [newRating,   setNewRating]   = useState(7);
  const [newText,     setNewText]     = useState('');
  const [reviews,     setReviews]     = useState(MOCK_REVIEWS[show._id] || []);
  const [onWatchlist, setOnWatchlist] = useState(MOCK_WATCHLIST.some(w => w.show._id === show._id));
  const [toast,       setToast]       = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleAdd = () => {
    if (onWatchlist) return showToast('Already on your watchlist!');
    setOnWatchlist(true); showToast('Added to watchlist ✓');
  };

  const handleReview = (e) => {
    e.preventDefault();
    setReviews(prev => [{ _id: Date.now().toString(), username: 'you', rating: newRating, reviewText: newText }, ...prev]);
    setNewText(''); showToast('Review posted ✓');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Backdrop header */}
        <div style={{ position: 'relative', height: 240, overflow: 'hidden', borderRadius: '18px 18px 0 0' }}>
          {show.posterUrl && (
            <img src={show.posterUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 15%', filter:'brightness(0.35)' }} />
          )}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, var(--surface) 0%, transparent 60%)' }} />
          <button onClick={onClose} style={{
            position:'absolute', top:14, right:14,
            background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)',
            border:'1px solid var(--border)', color:'var(--text)',
            width:34, height:34, borderRadius:10,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:15,
          }}>✕</button>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px 28px' }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
              <span style={{ background: show.type==='Movie'?'var(--blue)':'#a855f7', color:'#000', fontSize:10, fontWeight:800, letterSpacing:1, padding:'3px 9px', borderRadius:5 }}>
                {show.type==='Movie'?'FILM':'SERIES'}
              </span>
              <span className="rating-pill">★ {show.rating}</span>
              <span style={{ color:'var(--text-muted)', fontSize:13 }}>{show.releaseYear}</span>
            </div>
            <h2 style={{ fontSize:26, fontWeight:800, lineHeight:1.2 }}>{show.title}</h2>
          </div>
        </div>

        <div style={{ padding:'20px 28px 28px' }}>
          {/* Genres */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
            {show.genre.map(g => <span key={g} className="tag">{g}</span>)}
          </div>

          <p style={{ color:'var(--text-muted)', fontSize:14, lineHeight:1.7, marginBottom:20 }}>{show.description}</p>

          {toast && <div className="toast">{toast}</div>}

          <button className={onWatchlist ? 'btn-ghost' : 'btn-green'} onClick={handleAdd} style={{ marginBottom:24 }}>
            {onWatchlist ? '✓ On Your Watchlist' : '+ Add to Watchlist'}
          </button>

          {/* Reviews */}
          <div style={{ borderTop:'1px solid var(--border)', paddingTop:20, marginBottom:20 }}>
            <h4 style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>
              Reviews <span style={{ color:'var(--text-muted)', fontWeight:400, fontSize:13 }}>({reviews.length})</span>
            </h4>
            {reviews.length === 0 && <p style={{ color:'var(--text-muted)', fontSize:14 }}>No reviews yet. Be the first!</p>}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {reviews.map(r => (
                <div key={r._id} style={{ background:'var(--surface2)', borderRadius:10, padding:'12px 14px', border:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--surface3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'var(--text-muted)' }}>
                      {r.username[0].toUpperCase()}
                    </div>
                    <span style={{ fontWeight:700, fontSize:13 }}>@{r.username}</span>
                    <span className="rating-pill" style={{ fontSize:11 }}>★ {r.rating}/10</span>
                  </div>
                  <p style={{ color:'var(--text-muted)', fontSize:13, margin:0, lineHeight:1.5 }}>{r.reviewText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Write review */}
          <div style={{ borderTop:'1px solid var(--border)', paddingTop:20 }}>
            <h4 style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Write a Review</h4>
            <form onSubmit={handleReview}>
              <div style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <label style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, letterSpacing:0.5, textTransform:'uppercase' }}>Rating</label>
                  <span className="rating-pill">★ {newRating}/10</span>
                </div>
                <input type="range" min={1} max={10} value={newRating}
                  onChange={e => setNewRating(Number(e.target.value))}
                  style={{ width:'100%', accentColor:'var(--blue)' }} />
              </div>
              <textarea className="ct-input" rows={3} placeholder="What did you think?"
                value={newText} onChange={e => setNewText(e.target.value)}
                style={{ resize:'vertical', marginBottom:12 }} />
              <button type="submit" className="btn-green" style={{ padding:'9px 20px', fontSize:14 }}>
                Post Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
