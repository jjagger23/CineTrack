import { useState } from 'react';
import { MOCK_WATCHLIST } from '../data/mockData';
import { Link } from 'react-router-dom';

const STATUSES = ['Plan to Watch', 'Watching', 'Completed', 'Dropped'];

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

export default function WatchlistPage() {
  const [list, setList] = useState(MOCK_WATCHLIST);
  const [filter, setFilter] = useState('');

  const updateStatus = (id, status) => setList(prev => prev.map(e => (e._id === id ? { ...e, status } : e)));
  const removeEntry = id => setList(prev => prev.filter(e => e._id !== id));
  const filtered = filter ? list.filter(e => e.status === filter) : list;
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: list.filter(e => e.status === s).length }), {});

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

      {filtered.length === 0 ? (
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
