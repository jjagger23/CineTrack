import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GENRES } from '../data/mockData';
import TypeBadge from '../components/TypeBadge';
import ShowRow from '../components/ShowRow';
import ShowDetailModal from '../components/ShowDetailModal';

const API = process.env.REACT_APP_API_URL;

export default function CatalogPage() {
  const { user } = useAuth();
  const [shows, setShows] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [type, setType] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('category');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadShows = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API}/shows`);
        if (!res.ok) throw new Error('Failed to load shows');
        const data = await res.json();
        if (active) setShows(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load shows');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadShows();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => shows.filter(s => {
    const ms = !search || s.title.toLowerCase().includes(search.toLowerCase());
    const mg = !genre || s.genre.includes(genre);
    const mt = !type || s.type === type;
    return ms && mg && mt;
  }), [shows, search, genre, type]);

  const byGenre = useMemo(() => {
    const groups = {};
    GENRES.forEach(g => {
      const groupedShows = filtered.filter(s => s.genre.includes(g));
      if (groupedShows.length) groups[g] = groupedShows;
    });
    return groups;
  }, [filtered]);

  const isFiltering = search || genre || type;
  const featured = shows[4] || shows[0] || null;

  return (
    <div className="catalogPage page-enter pageContainerWide">
      {!isFiltering && featured && (
        <div className="catalogHeroWrap">
          <img src={featured.posterUrl} alt={featured.title} className="catalogHeroImage" />
          <div className="catalogHeroGradient" />
          <div className="catalogHeroGrain" />

          <div className="catalogHeroContent">
            <div className="catalogHeroBadges">
              <span className="catalogFeaturedBadge">FEATURED</span>
              <TypeBadge type={featured.type} />
            </div>
            <h1 className="catalogHeroTitle">{featured.title}</h1>
            <p className="catalogHeroDescription">{featured.description}</p>
            <div className="catalogHeroActions">
              <button className="btn-primary catalogHeroButton" onClick={() => setSelected(featured)}>▶ View Details</button>
              {featured.rating && <span className="ratingTag">★ {featured.rating}</span>}
              <span className="catalogHeroYear">{featured.releaseYear}</span>
            </div>
          </div>
        </div>
      )}

      <div className="catalogHeaderRow">
        <div>
          <h2 className="catalogHeaderTitle">Browse Catalog</h2>
          <p className="catalogHeaderSubtext">{filtered.length} titles</p>
        </div>

        <div className="catalogViewToggle">
          {[['category', '⊞ By Category'], ['list', '≡ All Titles']].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} className={`catalogViewButton ${v === view ? 'catalogViewButtonActive' : ''}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="catalogFiltersRow">
        <div className="catalogSearchWrap">
          <span className="catalogSearchIcon">🔍</span>
          <input className="ct-input catalogSearchInput" placeholder="Search titles..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <select className="ct-input catalogTypeSelect" value={type} onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Movie">Movies</option>
          <option value="TV Show">TV Shows</option>
        </select>

        {isFiltering && <button className="btn-ghost catalogClearButton" onClick={() => { setSearch(''); setGenre(''); setType(''); }}>✕ Clear</button>}
      </div>

      <div className="catalogGenrePills">
        {GENRES.map(g => (
          <button key={g} onClick={() => setGenre(genre === g ? '' : g)} className={`tag catalogGenrePill ${genre === g ? 'active' : ''}`}>{g}</button>
        ))}
      </div>

      {loading ? (
        <div className="catalogStateMessage">Loading shows...</div>
      ) : error ? (
        <div className="catalogStateMessage catalogStateError">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="catalogEmptyState">
          <div className="catalogEmptyIcon">🔍</div>
          <p>No titles found.</p>
        </div>
      ) : view === 'list' || isFiltering ? (
        <div className="stagger contentCard catalogListCard">
          {filtered.map((show, i) => <ShowRow key={show._id} show={show} index={i} total={filtered.length} onClick={() => setSelected(show)} />)}
        </div>
      ) : (
        <div className="stagger catalogCategoryGroups">
          {Object.entries(byGenre).map(([g, groupedShows]) => (
            <div key={g}>
              <div className="section-divider">
                <h2>{g}</h2>
                <span className="count">{groupedShows.length}</span>
                <div className="line" />
              </div>
              <div className="contentCard contentCardCompact">
                {groupedShows.map((show, i) => <ShowRow key={show._id} show={show} index={i} total={groupedShows.length} onClick={() => setSelected(show)} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <ShowDetailModal show={selected} onClose={() => setSelected(null)} user={user} apiBase={API} />}
    </div>
  );
}
