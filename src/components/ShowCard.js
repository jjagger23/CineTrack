export default function ShowCard({ show, onClick }) {
  return (
    <div className="show-card" onClick={onClick}>
      {show.posterUrl ? (
        <img className="card-poster" src={show.posterUrl} alt={show.title}
          onError={e => { e.target.style.display='none'; }} />
      ) : (
        <div className="card-poster" style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, background:'var(--surface2)' }}>🎬</div>
      )}

      {/* Always-visible top badges */}
      <div style={{ position:'absolute', top:10, left:10, right:10, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{
          background: show.type === 'Movie' ? 'rgba(77,159,255,0.9)' : 'rgba(77,159,255,0.9)',
          color: '#000', fontSize:10, fontWeight:800, letterSpacing:1,
          padding:'3px 8px', borderRadius:5,
        }}>
          {show.type === 'Movie' ? 'FILM' : 'SERIES'}
        </span>
        {show.rating && (
          <span style={{
            background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)',
            color:'var(--yellow)', fontSize:11, fontWeight:700,
            padding:'3px 8px', borderRadius:5, display:'flex', alignItems:'center', gap:3,
          }}>
            ★ {show.rating}
          </span>
        )}
      </div>

      {/* Hover overlay */}
      <div className="card-overlay">
        <div style={{ fontSize:15, fontWeight:800, marginBottom:4, lineHeight:1.3 }}>{show.title}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginBottom:8 }}>
          {show.releaseYear} · {show.genre.slice(0,2).join(', ')}
        </div>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:1.5, marginBottom:12,
          overflow:'hidden', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical' }}>
          {show.description}
        </p>
        <span style={{
          background:'var(--blue)', color:'#000', fontSize:12, fontWeight:700,
          padding:'6px 14px', borderRadius:7, display:'inline-block',
        }}>
          View Details →
        </span>
      </div>
    </div>
  );
}
