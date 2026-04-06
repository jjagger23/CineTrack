import { useState } from 'react';
import TypeBadge from './TypeBadge';

export default function ShowRow({ show, index, total, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="show-row" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick} style={{ borderBottom: index < total - 1 ? '1px solid var(--border2)' : 'none' }}>
      <div style={{ width: 26, flexShrink: 0, textAlign: 'right', fontSize: 11, color: 'var(--text-dim)', fontWeight: 700, paddingTop: 3 }}>{String(index + 1).padStart(2, '0')}</div>
      <div style={{ width: 50, height: 70, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--surface2)' }}>
        {show.posterUrl && <img src={show.posterUrl} alt={show.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
          <span className="show-title" style={{ fontWeight: 700, fontSize: 14, color: hovered ? 'var(--blue-bright)' : 'var(--text)' }}>{show.title}</span>
          <TypeBadge type={show.type} />
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{show.releaseYear}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{show.description}</p>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {(show.genre || []).map(item => <span key={item} style={{ fontSize: 10, color: 'var(--text-dim)', background: 'var(--surface3)', border: '1px solid var(--border)', padding: '1px 7px', borderRadius: 4, fontWeight: 600 }}>{item}</span>)}
        </div>
      </div>
      {show.rating && <div className="rating-box"><div className="val">{show.rating}</div><div className="denom">/ 10</div><div style={{ fontSize: 10, marginTop: 3 }}>*</div></div>}
    </div>
  );
}
