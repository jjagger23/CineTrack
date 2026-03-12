import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const handleSubmit = e => {
    e.preventDefault(); setError('');
    try { register(username, password); navigate('/catalog'); }
    catch (err) { setError(err.message); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:20 }}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:18, padding:'48px 44px', width:'100%', maxWidth:420, animation:'pageIn 0.4s ease' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, marginBottom:36 }}>
          <div style={{ width:30, height:30, borderRadius:7, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:900, color:'#000' }}>C</div>
          <span style={{ fontFamily:'var(--font-display)', fontSize:18, letterSpacing:2 }}>CINETRACK</span>
        </Link>

        <h2 style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>Create account</h2>
        <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:32 }}>Start tracking your shows today</p>

        {error && (
          <div style={{ background:'rgba(255,77,77,0.08)', border:'1px solid rgba(255,77,77,0.3)', borderRadius:8, padding:'10px 14px', marginBottom:20, color:'var(--red)', fontSize:13 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {[['Username', 'text', username, setUsername, 'Choose a username'], ['Password', 'password', password, setPassword, 'Create a password']].map(([label, type, val, set, ph]) => (
            <div key={label} style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, letterSpacing:0.8, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:7 }}>{label}</label>
              <input className="ct-input" type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} required />
            </div>
          ))}
          <div style={{ marginBottom:28 }} />
          <button type="submit" className="btn-green" style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:15 }}>
            Create Account
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/" style={{ color:'var(--blue)', fontWeight:700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
