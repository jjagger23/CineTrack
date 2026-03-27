import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(username, password);
      navigate("/catalog");
    } catch (err) {
      setError(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:18, padding:'44px 40px', width:'100%', maxWidth:400, animation:'pageIn 0.3s ease', boxShadow:'0 24px 60px rgba(0,0,0,0.4)' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:'#fff' }}>C</div>
          <span className="grad-text" style={{ fontFamily:'var(--font-display)', fontSize:17, letterSpacing:2 }}>CINETRACK</span>
        </Link>
        <h2 style={{ fontSize:22, fontWeight:800, marginBottom:6 }}>Create account</h2>
        <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:28 }}>Start tracking your shows today</p>

        {error && <div style={{ background:'rgba(255,85,102,0.08)', border:'1px solid rgba(255,85,102,0.25)', borderRadius:8, padding:'10px 14px', marginBottom:18, color:'var(--red)', fontSize:13 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[['USERNAME','text',username,setUsername,'Choose a username'],['PASSWORD','password',password,setPassword,'Create a password']].map(([label,type,val,set,ph]) => (
            <div key={label} style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase' }}>{label}</label>
              <input className="ct-input" type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} required />
            </div>
          ))}
          <div style={{ marginBottom:24 }} />
          <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:15 }}>Create Account →</button>
        </form>

        <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--text-muted)' }}>
          Already have an account? <Link to="/" className="grad-text" style={{ fontWeight:700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
