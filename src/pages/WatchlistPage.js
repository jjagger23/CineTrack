import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';

const STATUSES = ['Plan to Watch', 'Watching', 'Completed', 'Dropped'];
const statusClass = status => ({ Watching: 's-watching', Completed: 's-completed', Dropped: 's-dropped' }[status] || 's-plan');
const statusColors = { Watching: 'var(--blue)', Completed: 'var(--green)', Dropped: 'var(--red)', 'Plan to Watch': 'var(--text-muted)' };

export default function WatchlistPage() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    let active = true;

    const loadWatchlist = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiRequest('/watchlist');
        if (!active) return;
        setList(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load watchlist');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadWatchlist();
    return () => {
      active = false;
    };
  }, []);

  const notify = message => {
    setToast(message);
    window.clearTimeout(notify.timeoutId);
    notify.timeoutId = window.setTimeout(() => setToast(''), 2500);
  };

  const updateStatus = async (id, status) => {
    const existing = list.find(entry => entry._id === id);
    if (!existing) return;

    try {
      const updated = await apiRequest(`/watchlist/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, progress: existing.progress }),
      });
      setList(prev => prev.map(entry => entry._id === id ? updated : entry));
      notify('Watchlist updated');
    } catch (err) {
      notify(err.message || 'Could not update watchlist');
    }
  };

  const removeEntry = async id => {
    try {
      await apiRequest(`/watchlist/${id}`, { method: 'DELETE' });
      setList(prev => prev.filter(entry => entry._id !== id));
      notify('Removed from watchlist');
    } catch (err) {
      notify(err.message || 'Could not remove title');
    }
  };

  const filtered = useMemo(() => filter ? list.filter(entry => entry.status === filter) : list, [filter, list]);
  const counts = useMemo(() => STATUSES.reduce((acc, status) => ({ ...acc, [status]: list.filter(entry => entry.status === status).length }), {}), [list]);

  return (
    <div className="page-enter" style={{ maxWidth: 900, margin: '0 auto', padding: '36px 28px 60px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, letterSpacing: -0.5, marginBottom: 4 }}>My Watchlist</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{list.length} titles saved</p>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 28 }}>
        {STATUSES.map(status => (
          <div key={status} onClick={() => setFilter(filter === status ? '' : status)} style={{
            background: filter === status ? 'linear-gradient(135deg, rgba(77,159,255,0.1), rgba(124,58,237,0.1))' : 'var(--surface-solid)',
            border: `1.5px solid ${filter === status ? 'rgba(77,159,255,0.3)' : 'var(--border)'}`,
            borderRadius: 12,
            padding: '14px 16px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: filter === status ? '0 4px 20px rgba(77,159,255,0.1)' : 'none',
          }}>
            <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: statusColors[status], lineHeight: 1, marginBottom: 4 }}>{counts[status] || 0}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{status}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading your watchlist...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--red)' }}>{error}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>Watchlist</div>
          <p style={{ fontSize: 15, marginBottom: 18 }}>{filter ? `Nothing with status "${filter}" yet.` : 'Your watchlist is empty.'}</p>
          <Link to="/catalog" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 22px', fontSize: 14 }}>Browse Catalog</Link>
        </div>
      ) : (
        <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          {filtered.map((entry, index) => {
            const show = entry.showId || {};
            const totalEpisodes = show.totalEpisodes || 0;
            const pct = totalEpisodes > 0 ? Math.round((entry.progress / totalEpisodes) * 100) : 0;

            return (
              <div key={entry._id} style={{ display: 'flex', alignItems: 'center', position: 'relative', borderBottom: index < filtered.length - 1 ? '1px solid var(--border2)' : 'none', transition: 'background 0.15s' }} onMouseEnter={event => { event.currentTarget.style.background = 'rgba(77,159,255,0.03)'; }} onMouseLeave={event => { event.currentTarget.style.background = 'transparent'; }}>
                <div style={{ width: 3, alignSelf: 'stretch', background: statusColors[entry.status], flexShrink: 0 }} />
                <div style={{ width: 54, height: 76, flexShrink: 0, background: 'var(--surface2)', overflow: 'hidden', margin: '10px 14px', borderRadius: 5 }}>
                  {show.posterUrl && <img src={show.posterUrl} alt={show.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{show.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{show.type} - {show.releaseYear}</div>
                  <span className={`status-pill ${statusClass(entry.status)}`}>{entry.status}</span>
                  {show.type === 'TV Show' && totalEpisodes > 1 && (
                    <div style={{ marginTop: 8, maxWidth: 200 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 600 }}>Ep {entry.progress} / {totalEpisodes}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ padding: '0 16px', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                  <select className="ct-input" style={{ width: 155, fontSize: 13, padding: '7px 10px' }} value={entry.status} onChange={event => updateStatus(entry._id, event.target.value)}>
                    {STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <button onClick={() => removeEntry(entry._id)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 17, padding: '4px 6px', lineHeight: 1, transition: 'color 0.15s' }} onMouseEnter={event => { event.currentTarget.style.color = 'var(--red)'; }} onMouseLeave={event => { event.currentTarget.style.color = 'var(--text-dim)'; }}>X</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
