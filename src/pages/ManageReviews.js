import { useState } from 'react';
import { MOCK_ALL_REVIEWS } from '../data/mockData';

export default function ManageReviews() {
  const [reviews, setReviews] = useState(MOCK_ALL_REVIEWS);
  const [toast,   setToast]   = useState('');
  const notify = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const handleDelete = id => { setReviews(prev => prev.filter(r => r._id !== id)); notify('Review removed'); };

  return (
    <div className="page-enter" style={{ maxWidth:1000, margin:'0 auto', padding:'36px 28px 60px' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:38, letterSpacing:-0.5, marginBottom:4 }}>Manage Reviews</h1>
        <p style={{ color:'var(--text-muted)', fontSize:13 }}>{reviews.length} reviews total</p>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div style={{ background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,0.15)' }}>
        {reviews.map((r, i) => (
          <div key={r._id} style={{
            display:'flex', gap:14, alignItems:'flex-start',
            padding:'14px 18px',
            borderBottom: i < reviews.length-1 ? '1px solid var(--border2)' : 'none',
            transition:'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(77,159,255,0.03)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            {/* Avatar with gradient */}
            <div style={{
              width:36, height:36, borderRadius:'50%', flexShrink:0,
              background:'var(--grad)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:14, fontWeight:800, color:'#fff',
              boxShadow:'0 2px 10px rgba(77,159,255,0.2)',
            }}>
              {r.username[0].toUpperCase()}
            </div>

            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
                <span style={{ fontWeight:700, fontSize:13 }}>@{r.username}</span>
                <span style={{ color:'var(--text-muted)', fontSize:12 }}>reviewed</span>
                <span style={{ fontWeight:600, fontSize:13 }}>{r.show}</span>
                <span style={{ background:'rgba(255,216,77,0.1)', border:'1px solid rgba(255,216,77,0.2)', color:'var(--yellow)', fontSize:11, fontWeight:700, padding:'1px 7px', borderRadius:4 }}>★ {r.rating}/10</span>
                <span style={{ fontSize:11, color:'var(--text-dim)', marginLeft:'auto' }}>
                  {new Date(r.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </span>
              </div>
              <p style={{ color:'var(--text-muted)', fontSize:13, margin:0, lineHeight:1.55 }}>{r.reviewText}</p>
            </div>

            <button className="btn-danger" style={{ flexShrink:0 }} onClick={() => handleDelete(r._id)}>Delete</button>
          </div>
        ))}
        {reviews.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-muted)', fontSize:14 }}>No reviews to moderate.</div>
        )}
      </div>
    </div>
  );
}
