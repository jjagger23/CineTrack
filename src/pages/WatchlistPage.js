import { useState } from 'react';
import { MOCK_WATCHLIST } from '../data/mockData';
import { Link } from 'react-router-dom';

const STATUSES = ['Plan to Watch', 'Watching', 'Completed', 'Dropped'];
const statusClass = s => ({ 'Watching':'s-watching', 'Completed':'s-completed', 'Dropped':'s-dropped' }[s] || 's-plan');

export default function WatchlistPage() {
  const [list,   setList]   = useState(MOCK_WATCHLIST);
  const [filter, setFilter] = useState('');

  const updateStatus = (id, status) => setList(prev => prev.map(e => e._id === id ? {...e, status} : e));
  const removeEntry  = (id)         => setList(prev => prev.filter(e => e._id !== id));

  const filtered = filter ? list.filter(e => e.status === filter) : list;
  const counts   = STATUSES.reduce((acc, s) => ({ ...acc, [s]: list.filter(e => e.status === s).length }), {});

  const statColors = { 'Watching':'var(--blue)', 'Completed':'var(--blue)', 'Dropped':'var(--red)', 'Plan to Watch':'var(--text-muted)' };

  return (
    <div className="page-enter" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 28px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, letterSpacing: -0.5, marginBottom: 6 }}>My Watchlist</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{list.length} titles saved</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {STATUSES.map(s => (
          <div key={s} style={{
            background: filter === s ? 'var(--surface2)' : 'var(--surface)',
            border: `1.5px solid ${filter === s ? statColors[s] : 'var(--border)'}`,
            borderRadius: 12, padding: '16px 18px', cursor: 'pointer',
            transition: 'all 0.2s',
          }} onClick={() => setFilter(filter === s ? '' : s)}>
            <div style={{ fontSize: 24, fontFamily: 'var(--font-display)', color: statColors[s], lineHeight: 1 }}>{counts[s]}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <p style={{ fontSize: 16, marginBottom: 12 }}>
            {filter ? `Nothing with status "${filter}" yet.` : 'Your watchlist is empty.'}
          </p>
          <Link to="/catalog" className="btn-green" style={{ display: 'inline-flex', padding: '10px 22px', fontSize: 14 }}>
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(entry => (
            <div key={entry._id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
              display: 'flex', alignItems: 'center', overflow: 'hidden',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateX(3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateX(0)'; }}
            >
              {/* Left color accent */}
              <div style={{ width: 4, alignSelf: 'stretch', background: statColors[entry.status], flexShrink: 0 }} />

              {/* Poster */}
              <div style={{ width: 64, height: 90, flexShrink: 0, background: 'var(--surface2)', overflow: 'hidden' }}>
                {entry.show.posterUrl && (
                  <img src={entry.show.posterUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: '14px 20px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{entry.show.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                  {entry.show.type} · {entry.show.releaseYear}
                </div>
                <span className={`status-pill ${statusClass(entry.status)}`}>{entry.status}</span>
                {entry.show.type === 'TV Show' && entry.progress > 0 && (
                  <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--text-muted)' }}>Ep. {entry.progress}</span>
                )}
              </div>

              {/* Controls */}
              <div style={{ padding: '0 18px', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                <select className="ct-input" style={{ width: 158, fontSize: 13, padding: '7px 10px' }}
                  value={entry.status} onChange={e => updateStatus(entry._id, e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => removeEntry(entry._id)} style={{
                  background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 18,
                  padding: '4px 6px', lineHeight: 1, transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
