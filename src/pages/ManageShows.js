import { useState } from 'react';
import { MOCK_SHOWS } from '../data/mockData';

const EMPTY = { title:'', type:'Movie', genre:'', releaseYear:'', description:'' };

export default function ManageShows() {
  const [shows,    setShows]    = useState(MOCK_SHOWS);
  const [form,     setForm]     = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [toast,    setToast]    = useState('');

  const notify = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleAdd = e => {
    e.preventDefault();
    setShows(prev => [{
      ...form, _id: Date.now().toString(), posterUrl: '',
      genre: form.genre.split(',').map(g=>g.trim()).filter(Boolean),
      releaseYear: Number(form.releaseYear), rating: null,
    }, ...prev]);
    setForm(EMPTY); setShowForm(false); notify('Show added ✓');
  };

  const handleDelete = id => { setShows(prev => prev.filter(s => s._id !== id)); notify('Show removed'); };

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:44, letterSpacing:-0.5, marginBottom:4 }}>Manage Shows</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>{shows.length} titles in catalog</p>
        </div>
        <button className={showForm ? 'btn-ghost' : 'btn-green'} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Show'}
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {showForm && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:28, marginBottom:28, animation:'pageIn 0.2s ease' }}>
          <h3 style={{ fontWeight:700, marginBottom:20 }}>New Show</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:14, marginBottom:14 }}>
              {[['title','Title',true],['releaseYear','Year',true]].map(([f,l,r]) => (
                <div key={f}>
                  <label style={{ fontSize:12, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', color:'var(--text-muted)', display:'block', marginBottom:6 }}>{l}</label>
                  <input className="ct-input" placeholder={l} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} required={r} />
                </div>
              ))}
              <div>
                <label style={{ fontSize:12, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', color:'var(--text-muted)', display:'block', marginBottom:6 }}>Type</label>
                <select className="ct-input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  <option value="Movie">Movie</option>
                  <option value="TV Show">TV Show</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', color:'var(--text-muted)', display:'block', marginBottom:6 }}>Genres (comma separated)</label>
              <input className="ct-input" placeholder="Action, Drama, Thriller" value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', color:'var(--text-muted)', display:'block', marginBottom:6 }}>Description</label>
              <textarea className="ct-input" rows={3} placeholder="Short description..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{ resize:'vertical' }} />
            </div>
            <button type="submit" className="btn-green">Add to Catalog</button>
          </form>
        </div>
      )}

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
        <table className="ct-table">
          <thead><tr><th style={{width:50}}></th><th>Title</th><th>Type</th><th>Year</th><th>Genres</th><th>Rating</th><th></th></tr></thead>
          <tbody>
            {shows.map(s => (
              <tr key={s._id}>
                <td style={{ padding:'10px 12px' }}>
                  <div style={{ width:38, height:54, borderRadius:6, overflow:'hidden', background:'var(--surface2)' }}>
                    {s.posterUrl && <img src={s.posterUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                  </div>
                </td>
                <td style={{ fontWeight:600 }}>{s.title}</td>
                <td><span style={{ fontSize:11, fontWeight:800, color:s.type==='Movie'?'var(--blue)':'#a855f7' }}>{s.type==='Movie'?'FILM':'SERIES'}</span></td>
                <td style={{ color:'var(--text-muted)' }}>{s.releaseYear}</td>
                <td><div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>{s.genre.map(g=><span key={g} className="tag" style={{fontSize:11}}>{g}</span>)}</div></td>
                <td>{s.rating ? <span className="rating-pill">★ {s.rating}</span> : <span style={{ color:'var(--text-dim)' }}>—</span>}</td>
                <td><button className="btn-danger" onClick={()=>handleDelete(s._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
