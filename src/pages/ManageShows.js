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
      ...form, _id: Date.now().toString(), posterUrl:'', rating:null,
      genre: form.genre.split(',').map(g => g.trim()).filter(Boolean),
      releaseYear: Number(form.releaseYear),
    }, ...prev]);
    setForm(EMPTY); setShowForm(false); notify('Show added to catalog ✓');
  };

  const handleDelete = id => {
    setShows(prev => prev.filter(s => s._id !== id));
    notify('Show removed');
  };

  return (
    <div className="page-enter" style={{ maxWidth:1100, margin:'0 auto', padding:'36px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:38, letterSpacing:-0.5, marginBottom:4 }}>Manage Shows</h1>
          <p style={{ color:'var(--text-muted)', fontSize:13 }}>{shows.length} titles in catalog</p>
        </div>
        <button className={showForm ? 'btn-ghost' : 'btn-primary'} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Show'}
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {showForm && (
        <div style={{ background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:14, padding:24, marginBottom:24, animation:'pageIn 0.2s ease', boxShadow:'0 8px 32px rgba(0,0,0,0.2)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(77,159,255,0.04), rgba(124,58,237,0.04))', pointerEvents:'none' }} />
          <h3 style={{ fontWeight:700, fontSize:15, marginBottom:18, position:'relative', zIndex:1 }}>New Show</h3>
          <form onSubmit={handleAdd} style={{ position:'relative', zIndex:1 }}>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:12, marginBottom:12 }}>
              {[['Title','title',true],['Year','releaseYear',true]].map(([label,field,req]) => (
                <div key={field}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:0.8, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:6 }}>{label}</label>
                  <input className="ct-input" placeholder={label} value={form[field]} onChange={e => setForm({...form,[field]:e.target.value})} required={req} />
                </div>
              ))}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:0.8, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:6 }}>Type</label>
                <select className="ct-input" value={form.type} onChange={e => setForm({...form,type:e.target.value})}>
                  <option value="Movie">Movie</option>
                  <option value="TV Show">TV Show</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:0.8, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:6 }}>Genres (comma separated)</label>
              <input className="ct-input" placeholder="Action, Drama, Thriller" value={form.genre} onChange={e => setForm({...form,genre:e.target.value})} />
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:0.8, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:6 }}>Description</label>
              <textarea className="ct-input" rows={3} placeholder="Short description..." value={form.description} onChange={e => setForm({...form,description:e.target.value})} style={{ resize:'vertical' }} />
            </div>
            <button type="submit" className="btn-primary">Add to Catalog</button>
          </form>
        </div>
      )}

      <div style={{ background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,0.15)' }}>
        <table className="ct-table">
          <thead>
            <tr><th style={{ width:48 }}></th><th>Title</th><th>Type</th><th>Year</th><th>Genres</th><th>Rating</th><th></th></tr>
          </thead>
          <tbody>
            {shows.map(s => (
              <tr key={s._id}>
                <td style={{ padding:'10px 12px' }}>
                  <div style={{ width:36, height:50, borderRadius:5, overflow:'hidden', background:'var(--surface2)' }}>
                    {s.posterUrl && <img src={s.posterUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                  </div>
                </td>
                <td style={{ fontWeight:600 }}>{s.title}</td>
                <td><span className={s.type==='Movie'?'badge-film':'badge-series'}>{s.type==='Movie'?'FILM':'SERIES'}</span></td>
                <td style={{ color:'var(--text-muted)' }}>{s.releaseYear}</td>
                <td>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                    {s.genre.map(g => <span key={g} className="tag" style={{ fontSize:10, padding:'1px 7px' }}>{g}</span>)}
                  </div>
                </td>
                <td>
                  {s.rating
                    ? <span style={{ background:'rgba(255,216,77,0.1)', border:'1px solid rgba(255,216,77,0.2)', color:'var(--yellow)', fontSize:12, fontWeight:700, padding:'2px 8px', borderRadius:4 }}>★ {s.rating}</span>
                    : <span style={{ color:'var(--text-dim)' }}>—</span>}
                </td>
                <td><button className="btn-danger" onClick={() => handleDelete(s._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
