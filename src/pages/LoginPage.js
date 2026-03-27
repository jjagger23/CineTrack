import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
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
      await login(username, password);
      navigate("/catalog");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ minHeight:'100vh', display:'flex', overflow:'hidden', position:'relative' }}>
      {/* Animated bg glows */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle, rgba(77,159,255,0.09) 0%, transparent 70%)', top:-200, left:-150, animation:'g1 9s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', bottom:-100, right:'5%', animation:'g2 11s ease-in-out infinite' }} />
        <style>{`@keyframes g1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,30px)}} @keyframes g2{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,-20px)}}`}</style>
      </div>

      {/* Left panel */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 80px', position:'relative' }}>
        <div style={{ marginBottom:52 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:'#fff', boxShadow:'0 4px 16px rgba(77,159,255,0.35)' }}>C</div>
            <span className="grad-text" style={{ fontFamily:'var(--font-display)', fontSize:22, letterSpacing:2 }}>CINETRACK</span>
          </div>
        </div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:56, lineHeight:1.05, marginBottom:18, letterSpacing:-1 }}>
          Track every show<br />you've <span className="grad-text">ever watched.</span>
        </h1>
        <p style={{ color:'var(--text-muted)', fontSize:16, maxWidth:380, lineHeight:1.7 }}>
          Build your watchlist, rate what you've seen, and discover what's worth watching next.
        </p>
        <div style={{ display:'flex', gap:10, marginTop:32, flexWrap:'wrap' }}>
          {['🎬 Track Shows','⭐ Rate & Review','📋 Watchlist','🔍 Discover'].map(f => (
            <span key={f} style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:20, padding:'5px 14px', fontSize:13, color:'var(--text-muted)' }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width:440, background:'var(--surface-solid)', borderLeft:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 44px', animation:'pageIn 0.4s ease' }}>
        <div style={{ width:'100%' }}>
          <h2 style={{ fontSize:22, fontWeight:800, marginBottom:6 }}>Welcome back</h2>
          <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:32 }}>Sign in to your CineTrack account</p>

          {error && <div style={{ background:'rgba(255,85,102,0.08)', border:'1px solid rgba(255,85,102,0.25)', borderRadius:8, padding:'10px 14px', marginBottom:20, color:'var(--red)', fontSize:13 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {[['USERNAME','text',username,setUsername,'Enter your username'],['PASSWORD','password',password,setPassword,'Enter your password']].map(([label,type,val,set,ph]) => (
              <div key={label} style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1, color:'var(--text-muted)', marginBottom:7, textTransform:'uppercase' }}>{label}</label>
                <input className="ct-input" type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} required />
              </div>
            ))}
            <div style={{ marginBottom:24 }} />
            <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:15 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ textAlign:'center', margin:'20px 0', position:'relative' }}>
            <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:'var(--border)' }} />
            <span style={{ position:'relative', background:'var(--surface-solid)', padding:'0 12px', fontSize:12, color:'var(--text-dim)' }}>or</span>
          </div>

          <p style={{ textAlign:'center', fontSize:14, color:'var(--text-muted)' }}>
            New to CineTrack? <Link to="/register" style={{ fontWeight:700 }} className="grad-text">Create account</Link>
          </p>

          <div style={{ marginTop:28, padding:'14px 16px', background:'var(--surface2)', borderRadius:10, border:'1px solid var(--border)', fontSize:13 }}>
            <div style={{ fontWeight:700, marginBottom:6, fontSize:11, letterSpacing:0.8, textTransform:'uppercase', color:'var(--text-muted)' }}>Demo accounts</div>
            <div style={{ color:'var(--text-muted)', lineHeight:1.9 }}>
              Admin: <code style={{ color:'var(--blue-bright)', background:'var(--surface3)', padding:'1px 6px', borderRadius:4 }}>admin / admin123</code><br />
              User: <code style={{ color:'var(--text)', background:'var(--surface3)', padding:'1px 6px', borderRadius:4 }}>any username + any password</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
