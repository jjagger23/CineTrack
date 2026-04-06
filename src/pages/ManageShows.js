import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';

const EMPTY = { title: '', type: 'Movie', genre: '', releaseYear: '', description: '', posterUrl: '', totalEpisodes: '' };

export default function ManageShows() {
  const [shows, setShows] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let active = true;

    const loadShows = async () => {
      try {
        const data = await apiRequest('/shows');
        if (active) setShows(Array.isArray(data) ? data : []);
      } catch {
        if (active) setShows([]);
      }
    };

    loadShows();
    return () => {
      active = false;
    };
  }, []);

  const notify = message => {
    setToast(message);
    window.clearTimeout(notify.timeoutId);
    notify.timeoutId = window.setTimeout(() => setToast(''), 2500);
  };

  const handleAdd = async event => {
    event.preventDefault();

    try {
      const created = await apiRequest('/shows', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          genre: form.genre.split(',').map(value => value.trim()).filter(Boolean),
          releaseYear: Number(form.releaseYear),
          totalEpisodes: form.type === 'TV Show' && form.totalEpisodes ? Number(form.totalEpisodes) : undefined,
        }),
      });
      setShows(prev => [created, ...prev]);
      setForm(EMPTY);
      setShowForm(false);
      notify('Show added to catalog');
    } catch (err) {
      notify(err.message || 'Could not add show');
    }
  };

  const handleDelete = async id => {
    try {
      await apiRequest(`/shows/${id}`, { method: 'DELETE' });
      setShows(prev => prev.filter(show => show._id !== id));
      notify('Show removed');
    } catch (err) {
      notify(err.message || 'Could not remove show');
    }
  };

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 28px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, letterSpacing: -0.5, marginBottom: 4 }}>Manage Shows</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{shows.length} titles in catalog</p>
        </div>
        <button className={showForm ? 'btn-ghost' : 'btn-primary'} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Show'}
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {showForm && (
        <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 24, animation: 'pageIn 0.2s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(77,159,255,0.04), rgba(124,58,237,0.04))', pointerEvents: 'none' }} />
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, position: 'relative', zIndex: 1 }}>New Show</h3>
          <form onSubmit={handleAdd} style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[['Title', 'title', true], ['Year', 'releaseYear', true]].map(([label, field, required]) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</label>
                  <input className="ct-input" placeholder={label} value={form[field]} onChange={event => setForm({ ...form, [field]: event.target.value })} required={required} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Type</label>
                <select className="ct-input" value={form.type} onChange={event => setForm({ ...form, type: event.target.value })}>
                  <option value="Movie">Movie</option>
                  <option value="TV Show">TV Show</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Poster URL</label>
                <input className="ct-input" placeholder="https://..." value={form.posterUrl} onChange={event => setForm({ ...form, posterUrl: event.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Total Episodes</label>
                <input className="ct-input" placeholder="Optional for TV shows" value={form.totalEpisodes} onChange={event => setForm({ ...form, totalEpisodes: event.target.value })} disabled={form.type !== 'TV Show'} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Genres (comma separated)</label>
              <input className="ct-input" placeholder="Action, Drama, Thriller" value={form.genre} onChange={event => setForm({ ...form, genre: event.target.value })} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Description</label>
              <textarea className="ct-input" rows={3} placeholder="Short description..." value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn-primary">Add to Catalog</button>
          </form>
        </div>
      )}

      <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
        <table className="ct-table">
          <thead>
            <tr><th style={{ width: 48 }}></th><th>Title</th><th>Type</th><th>Year</th><th>Genres</th><th>Episodes</th><th></th></tr>
          </thead>
          <tbody>
            {shows.map(show => (
              <tr key={show._id}>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ width: 36, height: 50, borderRadius: 5, overflow: 'hidden', background: 'var(--surface2)' }}>
                    {show.posterUrl && <img src={show.posterUrl} alt={show.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{show.title}</td>
                <td><span className={show.type === 'Movie' ? 'badge-film' : 'badge-series'}>{show.type === 'Movie' ? 'FILM' : 'SERIES'}</span></td>
                <td style={{ color: 'var(--text-muted)' }}>{show.releaseYear}</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(show.genre || []).map(genre => <span key={genre} className="tag" style={{ fontSize: 10, padding: '1px 7px' }}>{genre}</span>)}
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{show.totalEpisodes || '-'}</td>
                <td><button className="btn-danger" onClick={() => handleDelete(show._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
