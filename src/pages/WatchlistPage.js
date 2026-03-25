import { useState } from 'react';
import { MOCK_WATCHLIST } from '../data/mockData';
import { Link } from 'react-router-dom';

const STATUSES = ['Plan to Watch','Watching','Completed','Dropped'];
const statusClass = s => ({ 'Watching':'s-watching','Completed':'s-completed','Dropped':'s-dropped' }[s]||'s-plan');
const statusColors = { 'Watching':'var(--blue)','Completed':'var(--green)','Dropped':'var(--red)','Plan to Watch':'var(--text-muted)' };

export default function WatchlistPage() {
  const [list, setList] = useState(MOCK_WATCHLIST);
  const [filter, setFilter] = useState('');

  const updateStatus = (id, status) => setList(prev => prev.map(e => e._id===id ? {...e,status} : e));
  const removeEntry  = id => setList(prev => prev.filter(e => e._id!==id));
  const filtered = filter ? list.filter(e => e.status===filter) : list;
  const counts = STATUSES.reduce((acc,s) => ({...acc,[s]:list.filter(e=>e.status===s).length}),{});

  return (
    <div className="page-enter" style={{ maxWidth:900, margin:'0 auto', padding:'36px 28px 60px' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:38, letterSpacing:-0.5, marginBottom:4 }}>My Watchlist</h1>
        <p style={{ color:'var(--text-muted)', fontSize:13 }}>{list.length} titles saved</p>
      </div>

      {/* Status stat cards */}
      <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:28 }}>
        {STATUSES.map(s => (
          <div key={s} onClick={() => setFilter(filter===s?'':s)} style={{
            background: filter===s ? 'linear-gradient(135deg, rgba(77,159,255,0.1), rgba(124,58,237,0.1))' : 'var(--surface-solid)',
            border:`1.5px solid ${filter===s ? 'rgba(77,159,255,0.3)' : 'var(--border)'}`,
            borderRadius:12, padding:'14px 16px', cursor:'pointer',
            transition:'all 0.2s',
            boxShadow: filter===s ? '0 4px 20px rgba(77,159,255,0.1)' : 'none',
          }}>
            <div style={{ fontSize:22, fontFamily:'var(--font-display)', color:statusColors[s], lineHeight:1, marginBottom:4 }}>{counts[s]}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-muted)' }}>
          <div style={{ fontSize:52, marginBottom:16 }}>📋</div>
          <p style={{ fontSize:15, marginBottom:18 }}>{filter ? `Nothing with status "${filter}" yet.` : 'Your watchlist is empty.'}</p>
          <Link to="/catalog" className="btn-primary" style={{ display:'inline-flex', padding:'10px 22px', fontSize:14 }}>Browse Catalog</Link>
        </div>
      ) : (
        <div style={{ background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,0.2)' }}>
          {filtered.map((entry, i) => {
            const pct = entry.show.totalEpisodes > 0 ? Math.round((entry.progress / entry.show.totalEpisodes) * 100) : 0;
            return (
              <div key={entry._id} style={{ display:'flex', alignItems:'center', position:'relative', borderBottom: i<filtered.length-1 ? '1px solid var(--border2)' : 'none', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(77,159,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                {/* Status color strip */}
                <div style={{ width:3, alignSelf:'stretch', background:statusColors[entry.status], flexShrink:0 }} />
                {/* Poster */}
                <div style={{ width:54, height:76, flexShrink:0, background:'var(--surface2)', overflow:'hidden', margin:'10px 14px', borderRadius:5 }}>
                  {entry.show.posterUrl && <img src={entry.show.posterUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                </div>
                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{entry.show.title}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>{entry.show.type} · {entry.show.releaseYear}</div>
                  <span className={`status-pill ${statusClass(entry.status)}`}>{entry.status}</span>
                  {/* Progress bar for TV shows */}
                  {entry.show.type==='TV Show' && entry.show.totalEpisodes > 1 && (
                    <div style={{ marginTop:8, maxWidth:200 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:10, color:'var(--text-dim)', fontWeight:600 }}>Ep {entry.progress} / {entry.show.totalEpisodes}</span>
                        <span style={{ fontSize:10, color:'var(--text-dim)', fontWeight:700 }}>{pct}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width:`${pct}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                {/* Controls */}
                <div style={{ padding:'0 16px', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
                  <select className="ct-input" style={{ width:155, fontSize:13, padding:'7px 10px' }} value={entry.status} onChange={e => updateStatus(entry._id, e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => removeEntry(entry._id)} style={{ background:'none', border:'none', color:'var(--text-dim)', fontSize:17, padding:'4px 6px', lineHeight:1, transition:'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color='var(--red)'}
                    onMouseLeave={e => e.currentTarget.style.color='var(--text-dim)'}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
