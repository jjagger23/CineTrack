import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['Plan to Watch', 'Watching', 'Completed', 'Dropped'];
const API = process.env.REACT_APP_API_URL;

const statusClass = s => ({
  Watching: 's-watching',
  Completed: 's-completed',
  Dropped: 's-dropped',
}[s] || 's-plan');

const stripClass = s => ({
  Watching: 'watchlistStripWatching',
  Completed: 'watchlistStripCompleted',
  Dropped: 'watchlistStripDropped',
  'Plan to Watch': 'watchlistStripPlan',
}[s] || 'watchlistStripPlan');

const statusStatClass = s => ({
  Watching: 'watchlistStatusValueWatching',
  Completed: 'watchlistStatusValueCompleted',
  Dropped: 'watchlistStatusValueDropped',
  'Plan to Watch': 'watchlistStatusValuePlan',
}[s] || 'watchlistStatusValuePlan');

const normalizeEntry = entry => {
  const show = entry?.showId && typeof entry.showId === 'object' ? entry.showId : entry?.show;
  if (!show) return null;

  return {
    _id: entry._id,
    status: entry.status || 'Plan to Watch',
    progress: entry.progress || 0,
    show: {
      _id: show._id,
      title: show.title,
      type: show.type,
      releaseYear: show.releaseYear,
      totalEpisodes: show.totalEpisodes || 0,
      posterUrl: show.posterUrl,
    },
  };
};

export default function WatchlistPage() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadWatchlist = async () => {
      if (!user?._id) {
        if (active) {
          setList([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API}/watchlist/user/${user._id}`);
        if (!res.ok) throw new Error('Failed to load watchlist');
        const data = await res.json();
        if (!active) return;

        const normalized = (Array.isArray(data) ? data : [])
          .map(normalizeEntry)
          .filter(Boolean);

        setList(normalized);
      } catch (err) {
        if (active) {
          setList([]);
          setError(err.message || 'Failed to load watchlist');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadWatchlist();
    return () => {
      active = false;
    };
  }, [user?._id]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/watchlist/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update watchlist item');
      const updated = normalizeEntry(await res.json());
      if (!updated) throw new Error('Invalid watchlist item');

      setList(prev => prev.map(entry => (entry._id === id ? updated : entry)));
    } catch (err) {
      setError(err.message || 'Failed to update watchlist item');
    }
  };

  const removeEntry = async id => {
    try {
      const res = await fetch(`${API}/watchlist/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove watchlist item');
      setList(prev => prev.filter(entry => entry._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to remove watchlist item');
    }
  };

  const filtered = useMemo(
    () => (filter ? list.filter(entry => entry.status === filter) : list),
    [filter, list],
  );
  const counts = useMemo(
    () => STATUSES.reduce((acc, status) => ({ ...acc, [status]: list.filter(entry => entry.status === status).length }), {}),
    [list],
  );

  return (
    <div className="page-enter pageContainerMedium">
      <div className="pageHeaderGroup">
        <h1 className="pageTitle">My Watchlist</h1>
        <p className="pageSubtitle">{list.length} titles saved</p>
      </div>

      <div className="stagger watchlistStatusGrid">
        {STATUSES.map(s => (
          <div key={s} onClick={() => setFilter(filter === s ? '' : s)} className={`watchlistStatusCard ${filter === s ? 'watchlistStatusCardActive' : ''}`}>
            <div className={`watchlistStatusValue ${statusStatClass(s)}`}>{counts[s]}</div>
            <div className="watchlistStatusLabel">{s}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="catalogStateMessage">Loading watchlist...</div>
      ) : error ? (
        <div className="catalogStateMessage catalogStateError">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="watchlistEmptyState">
          <div className="watchlistEmptyIcon">📋</div>
          <p className="watchlistEmptyText">{filter ? `Nothing with status "${filter}" yet.` : 'Your watchlist is empty.'}</p>
          <Link to="/catalog" className="btn-primary watchlistBrowseButton">Browse Catalog</Link>
        </div>
      ) : (
        <div className="contentCard watchlistListCard">
          {filtered.map((entry, i) => {
            const pct = entry.show.totalEpisodes > 0 ? Math.round((entry.progress / entry.show.totalEpisodes) * 100) : 0;
            return (
              <div key={entry._id} className={`watchlistRow ${i < filtered.length - 1 ? 'watchlistRowBordered' : ''}`}>
                <div className={`watchlistStatusStrip ${stripClass(entry.status)}`} />

                <div className="watchlistPosterWrap">
                  {entry.show.posterUrl && <img src={entry.show.posterUrl} alt="" className="watchlistPosterImage" />}
                </div>

                <div className="watchlistRowMain">
                  <div className="watchlistShowTitle">{entry.show.title}</div>
                  <div className="watchlistShowMeta">{entry.show.type} · {entry.show.releaseYear}</div>
                  <span className={`status-pill ${statusClass(entry.status)}`}>{entry.status}</span>

                  {entry.show.type === 'TV Show' && entry.show.totalEpisodes > 1 && (
                    <div className="watchlistProgressWrap">
                      <div className="watchlistProgressHeader">
                        <span className="watchlistProgressText">Ep {entry.progress} / {entry.show.totalEpisodes}</span>
                        <span className="watchlistProgressPct">{pct}%</span>
                      </div>
                      <progress className="watchlistProgressBar" value={pct} max={100} />
                    </div>
                  )}
                </div>

                <div className="watchlistControls">
                  <select className="ct-input watchlistStatusSelect" value={entry.status} onChange={e => updateStatus(entry._id, e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => removeEntry(entry._id)} className="watchlistDeleteButton">✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
