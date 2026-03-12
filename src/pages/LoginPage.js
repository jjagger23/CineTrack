import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      try {
        login(username, password);
        navigate('/catalog');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg)', overflow: 'hidden', position: 'relative',
    }}>
      {/* Animated background blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(77,159,255,0.08) 0%, transparent 70%)',
          top: '-100px', left: '-100px', borderRadius: '50%',
          animation: 'blob1 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(77,159,255,0.06) 0%, transparent 70%)',
          bottom: '-80px', right: '10%', borderRadius: '50%',
          animation: 'blob2 10s ease-in-out infinite',
        }} />
        <style>{`
          @keyframes blob1 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(40px,30px) scale(1.1); } }
          @keyframes blob2 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(-30px,-20px) scale(1.08); } }
        `}</style>
      </div>

      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 80px',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 64 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 28,
            letterSpacing: 3, color: 'var(--blue)',
          }}>CINETRACK</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 64,
          lineHeight: 1.05, marginBottom: 20, letterSpacing: -1,
        }}>
          Your world<br />
          of <span style={{ color: 'var(--blue)' }}>cinema</span>,<br />
          all in one place.
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 400, lineHeight: 1.7 }}>
          Track what you've watched, build your watchlist, and share reviews with your community.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 10, marginTop: 36, flexWrap: 'wrap' }}>
          {['🎬 Track Shows', '⭐ Rate & Review', '📋 Watchlist', '🔍 Discover'].map(f => (
            <span key={f} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '6px 14px', fontSize: 13, color: 'var(--text-muted)',
            }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: 460, background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 44px',
        animation: 'pageIn 0.5s ease',
      }}>
        <div style={{ width: '100%' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
            Sign in to continue to CineTrack
          </p>

          {error && (
            <div style={{
              background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.3)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              color: 'var(--red)', fontSize: 13, fontWeight: 500,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: 0.8, color: 'var(--text-muted)', marginBottom: 7, textTransform: 'uppercase' }}>
                Username
              </label>
              <input className="ct-input" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username" required />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: 0.8, color: 'var(--text-muted)', marginBottom: 7, textTransform: 'uppercase' }}>
                Password
              </label>
              <input className="ct-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn-green" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', margin: '24px 0', position: 'relative' }}>
            <span style={{ background: 'var(--surface)', padding: '0 12px', fontSize: 12, color: 'var(--text-dim)', position: 'relative', zIndex: 1 }}>or</span>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            New to CineTrack?{' '}
            <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 700 }}>Create account</Link>
          </p>

          {/* Demo hint */}
          <div style={{
            marginTop: 32, padding: '14px 16px',
            background: 'var(--surface2)', borderRadius: 10,
            border: '1px solid var(--border)', fontSize: 13,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Demo accounts</div>
            <div style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Admin: <code style={{ color: 'var(--blue)', background: 'var(--surface3)', padding: '1px 6px', borderRadius: 4 }}>admin / admin123</code><br />
              User: <code style={{ color: 'var(--text)', background: 'var(--surface3)', padding: '1px 6px', borderRadius: 4 }}>any username + any password</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
