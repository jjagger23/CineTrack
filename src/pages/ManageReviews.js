import { useState } from 'react';
import { MOCK_ALL_REVIEWS } from '../data/mockData';

export default function ManageReviews() {
  const [reviews, setReviews] = useState(MOCK_ALL_REVIEWS);
  const [toast,   setToast]   = useState('');
  const notify = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const handleDelete = id => { setReviews(prev => prev.filter(r => r._id !== id)); notify('Review removed'); };

  return (
    <div className="page-enter" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 28px 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:44, letterSpacing:-0.5, marginBottom:4 }}>Manage Reviews</h1>
        <p style={{ color:'var(--text-muted)', fontSize:14 }}>{reviews.length} reviews total</p>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {reviews.map(r => (
          <div key={r._id} style={{
            background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12,
            padding:'16px 20px', display:'flex', gap:14, alignItems:'flex-start',
            transition:'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor='var(--surface3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
          >
            <div style={{
              width:40, height:40, borderRadius:'50%', flexShrink:0,
              background:'var(--surface2)', border:'1px solid var(--border)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:15, fontWeight:800, color:'var(--text-muted)',
            }}>
              {r.username[0].toUpperCase()}
            </div>

            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
                <span style={{ fontWeight:700, fontSize:14 }}>@{r.username}</span>
                <span style={{ color:'var(--text-muted)', fontSize:13 }}>reviewed</span>
                <span style={{ fontWeight:600, fontSize:13 }}>{r.show}</span>
                <span className="rating-pill">★ {r.rating}/10</span>
                <span style={{ fontSize:12, color:'var(--text-dim)', marginLeft:'auto' }}>
                  {new Date(r.createdAt).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
                </span>
              </div>
              <p style={{ color:'var(--text-muted)', fontSize:13, margin:0, lineHeight:1.55 }}>{r.reviewText}</p>
            </div>

            <button className="btn-danger" style={{ flexShrink:0 }} onClick={() => handleDelete(r._id)}>Delete</button>
          </div>
        ))}
        {reviews.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-muted)' }}>No reviews to moderate.</div>
        )}
      </div>
    </div>
  );
}
