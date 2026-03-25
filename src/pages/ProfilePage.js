import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_WATCHLIST, MOCK_ALL_REVIEWS, MOCK_SHOWS, GENRES } from '../data/mockData';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();

  const completed  = MOCK_WATCHLIST.filter(e => e.status==='Completed').length;
  const watching   = MOCK_WATCHLIST.filter(e => e.status==='Watching').length;
  const planned    = MOCK_WATCHLIST.filter(e => e.status==='Plan to Watch').length;
  const myReviews  = MOCK_ALL_REVIEWS.filter(r => r.username===user?.username);
  const avgScore   = myReviews.length > 0 ? (myReviews.reduce((a,r) => a+r.rating,0)/myReviews.length).toFixed(1) : '—';

  // Favorite genre based on watchlist
  const genreCounts = {};
  MOCK_WATCHLIST.forEach(e => {
    const show = MOCK_SHOWS.find(s => s._id===e.show._id);
    if (show) show.genre.forEach(g => { genreCounts[g] = (genreCounts[g]||0)+1; });
  });
  const favGenre = Object.entries(genreCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—';

  const stats = [
    { icon:'✅', label:'Completed',    value:completed,         color:'var(--green)'  },
    { icon:'▶️',  label:'Watching',     value:watching,          color:'var(--blue)'   },
    { icon:'📋', label:'Plan to Watch', value:planned,           color:'var(--text-muted)' },
    { icon:'⭐', label:'Reviews',       value:myReviews.length,  color:'var(--yellow)' },
    { icon:'🎯', label:'Avg Rating',    value:avgScore,          color:'var(--violet-bright)' },
    { icon:'🎬', label:'Fav Genre',     value:favGenre,          color:'var(--blue-bright)' },
  ];

  const recentActivity = MOCK_WATCHLIST.slice(0,4);

  return (
    <div className="page-enter" style={{ maxWidth:900, margin:'0 auto', padding:'36px 28px 60px' }}>

      {/* Profile header */}
      <div style={{ display:'flex', alignItems:'center', gap:24, marginBottom:40, padding:'28px 32px', background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:18, position:'relative', overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,0.2)' }}>
        {/* BG gradient accent */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(77,159,255,0.06), rgba(124,58,237,0.06))', pointerEvents:'none' }} />
        <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:900, color:'#fff', flexShrink:0, boxShadow:'0 8px 24px rgba(77,159,255,0.3)', position:'relative', zIndex:1 }}>
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:34, letterSpacing:-0.5, marginBottom:4 }}>@{user?.username}</h1>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span className="badge-user">Standard User</span>
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>Member since 2024</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <h2 style={{ fontSize:14, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:14 }}>Your Stats</h2>
      <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:36 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:700, letterSpacing:0.5, marginBottom:8 }}>{s.icon} {s.label.toUpperCase()}</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:32, color:s.color, lineHeight:1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div>
          <h2 style={{ fontSize:14, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:14 }}>Recent Watchlist</h2>
          <div style={{ background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
            {recentActivity.map((entry, i) => (
              <div key={entry._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom: i<recentActivity.length-1 ? '1px solid var(--border2)' : 'none', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(77,159,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <div style={{ width:36, height:50, borderRadius:4, overflow:'hidden', flexShrink:0, background:'var(--surface2)' }}>
                  {entry.show.posterUrl && <img src={entry.show.posterUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:13, marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{entry.show.title}</div>
                  <span className={`status-pill ${{ 'Watching':'s-watching','Completed':'s-completed','Dropped':'s-dropped','Plan to Watch':'s-plan' }[entry.status]}`}>{entry.status}</span>
                </div>
              </div>
            ))}
            <div style={{ padding:'10px 16px', borderTop:'1px solid var(--border2)' }}>
              <Link to="/watchlist" style={{ fontSize:12, color:'var(--blue-bright)', fontWeight:600 }}>View all watchlist →</Link>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize:14, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:14 }}>My Reviews</h2>
          {myReviews.length === 0 ? (
            <div style={{ background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:12, padding:'32px 20px', textAlign:'center', color:'var(--text-muted)' }}>
              <div style={{ fontSize:32, marginBottom:10 }}>⭐</div>
              <p style={{ fontSize:13, marginBottom:14 }}>You haven't reviewed anything yet.</p>
              <Link to="/catalog" style={{ fontSize:13, color:'var(--blue-bright)', fontWeight:600 }}>Browse Catalog →</Link>
            </div>
          ) : (
            <div style={{ background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
              {myReviews.map((r, i) => (
                <div key={r._id} style={{ padding:'12px 16px', borderBottom: i<myReviews.length-1 ? '1px solid var(--border2)' : 'none' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontWeight:600, fontSize:13 }}>{r.show}</span>
                    <span style={{ background:'rgba(255,216,77,0.1)', border:'1px solid rgba(255,216,77,0.2)', color:'var(--yellow)', fontSize:11, fontWeight:700, padding:'1px 7px', borderRadius:4 }}>★ {r.rating}/10</span>
                  </div>
                  <p style={{ fontSize:12, color:'var(--text-muted)', margin:0, lineHeight:1.5 }}>{r.reviewText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
