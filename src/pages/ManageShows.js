import { useState } from 'react';
import { MOCK_SHOWS } from '../data/mockData';

const EMPTY = { title: '', type: 'Movie', genre: '', releaseYear: '', description: '' };

export default function ManageShows() {
  const [shows, setShows] = useState(MOCK_SHOWS);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');

  const notify = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleAdd = e => {
    e.preventDefault();
    setShows(prev => [{
      ...form,
      _id: Date.now().toString(),
      posterUrl: '',
      rating: null,
      genre: form.genre.split(',').map(g => g.trim()).filter(Boolean),
      releaseYear: Number(form.releaseYear),
    }, ...prev]);
    setForm(EMPTY);
    setShowForm(false);
    notify('Show added to catalog ✓');
  };

  const handleDelete = id => {
    setShows(prev => prev.filter(s => s._id !== id));
    notify('Show removed');
  };

  return (
    <div className="page-enter pageContainerWide">
      <div className="pageHeaderRow">
        <div>
          <h1 className="pageTitle">Manage Shows</h1>
          <p className="pageSubtitle">{shows.length} titles in catalog</p>
        </div>
        <button className={showForm ? 'btn-ghost' : 'btn-primary'} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Show'}
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {showForm && (
        <div className="manageFormCard">
          <div className="manageFormGlow" />
          <h3 className="manageFormTitle">New Show</h3>

          <form onSubmit={handleAdd} className="manageFormContent">
            <div className="manageFormTopGrid">
              {[['Title', 'title', true], ['Year', 'releaseYear', true]].map(([label, field, required]) => (
                <div key={field}>
                  <label className="fieldLabelUpper">{label}</label>
                  <input className="ct-input" placeholder={label} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required={required} />
                </div>
              ))}

              <div>
                <label className="fieldLabelUpper">Type</label>
                <select className="ct-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="Movie">Movie</option>
                  <option value="TV Show">TV Show</option>
                </select>
              </div>
            </div>

            <div className="manageFieldGroup">
              <label className="fieldLabelUpper">Genres (comma separated)</label>
              <input className="ct-input" placeholder="Action, Drama, Thriller" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
            </div>

            <div className="manageFieldGroup manageFieldGroupBottom">
              <label className="fieldLabelUpper">Description</label>
              <textarea className="ct-input resizeVertical" rows={3} placeholder="Short description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <button type="submit" className="btn-primary">Add to Catalog</button>
          </form>
        </div>
      )}

      <div className="contentCard">
        <table className="ct-table">
          <thead>
            <tr>
              <th className="tableThumbHeader" />
              <th>Title</th>
              <th>Type</th>
              <th>Year</th>
              <th>Genres</th>
              <th>Rating</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {shows.map(s => (
              <tr key={s._id}>
                <td className="tableThumbCell">
                  <div className="tablePosterWrap">
                    {s.posterUrl && <img src={s.posterUrl} alt="" className="tablePosterImage" />}
                  </div>
                </td>
                <td className="tableStrongCell">{s.title}</td>
                <td><span className={s.type === 'Movie' ? 'badge-film' : 'badge-series'}>{s.type === 'Movie' ? 'FILM' : 'SERIES'}</span></td>
                <td className="tableMutedCell">{s.releaseYear}</td>
                <td>
                  <div className="tableTagRow">
                    {s.genre.map(g => <span key={g} className="tag tableTagCompact">{g}</span>)}
                  </div>
                </td>
                <td>
                  {s.rating ? <span className="ratingTag">★ {s.rating}</span> : <span className="tableDash">—</span>}
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
