import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isActive = p => location.pathname === p || location.pathname.startsWith(p + '/');
  const handleLogout = () => { logout(); navigate('/'); };

  const NavLink = ({ to, label }) => (
    <Link to={to} style={{
      padding:'7px 13px', borderRadius:8, fontSize:14, fontWeight:600,
      color: isActive(to) ? 'var(--blue-bright)' : 'var(--text-muted)',
      background: isActive(to) ? 'var(--blue-glow2)' : 'transparent',
      border: `1px solid ${isActive(to) ? 'rgba(77,159,255,0.2)' : 'transparent'}`,
      transition:'all 0.15s',
    }}
    onMouseEnter={e => { if (!isActive(to)) { e.currentTarget.style.color='var(--text)'; e.currentTarget.style.background='var(--surface2)'; }}}
    onMouseLeave={e => { if (!isActive(to)) { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='transparent'; }}}
    >{label}</Link>
  );

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:50,
      background: scrolled ? 'rgba(11,11,20,0.97)' : 'rgba(11,11,20,0.8)',
      backdropFilter:'blur(20px)',
      borderBottom:`1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      transition:'all 0.3s ease',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px', height:62, display:'flex', alignItems:'center' }}>
        {/* Logo */}
        <Link to="/catalog" style={{ display:'flex', alignItems:'center', gap:10, marginRight:32, flexShrink:0 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff', boxShadow:'0 4px 12px rgba(77,159,255,0.3)' }}>C</div>
          <span style={{ fontFamily:'var(--font-display)', fontSize:19, letterSpacing:2 }} className="grad-text">CINETRACK</span>
        </Link>

        {/* Links */}
        <div style={{ display:'flex', alignItems:'center', gap:2, flex:1 }}>
          <NavLink to="/catalog" label="Catalog" />
          {user?.role === 'user' && <>
            <NavLink to="/watchlist" label="My Watchlist" />
            <NavLink to="/profile" label="Profile" />
          </>}
          {user?.role === 'admin' && (
            <div style={{ position:'relative' }}>
              <button onClick={() => setAdminOpen(!adminOpen)} style={{
                padding:'7px 13px', borderRadius:8, fontSize:14, fontWeight:600, border:'none',
                background: isActive('/admin') ? 'var(--blue-glow2)' : 'none',
                color: isActive('/admin') ? 'var(--blue-bright)' : 'var(--text-muted)',
                display:'flex', alignItems:'center', gap:4, transition:'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--surface2)'; e.currentTarget.style.color='var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background=isActive('/admin')?'var(--blue-glow2)':'none'; e.currentTarget.style.color=isActive('/admin')?'var(--blue-bright)':'var(--text-muted)'; }}
              >Admin <span style={{ fontSize:10, opacity:0.6 }}>▾</span></button>
              {adminOpen && <>
                <div style={{ position:'fixed', inset:0, zIndex:40 }} onClick={() => setAdminOpen(false)} />
                <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', minWidth:185, boxShadow:'0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(77,159,255,0.05)', zIndex:50 }}>
                  {[['/admin','📊 Dashboard'],['/admin/shows','🎬 Manage Shows'],['/admin/users','👥 Manage Users'],['/admin/reviews','⭐ Manage Reviews']].map(([to, label]) => (
                    <Link key={to} to={to} onClick={() => setAdminOpen(false)} style={{
                      display:'block', padding:'11px 18px', fontSize:14,
                      color: isActive(to) ? 'var(--blue-bright)' : 'var(--text-muted)',
                      background: isActive(to) ? 'rgba(77,159,255,0.06)' : 'transparent',
                      borderLeft:`3px solid ${isActive(to) ? 'var(--blue)' : 'transparent'}`,
                      transition:'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background='var(--surface2)'; e.currentTarget.style.color='var(--text)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background=isActive(to)?'rgba(77,159,255,0.06)':'transparent'; e.currentTarget.style.color=isActive(to)?'var(--blue-bright)':'var(--text-muted)'; }}
                    >{label}</Link>
                  ))}
                </div>
              </>}
            </div>
          )}
        </div>

        {/* Right side */}
        <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <Link to={user?.role === 'user' ? '/profile' : '#'} style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', boxShadow:'0 2px 10px rgba(77,159,255,0.3)' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{user?.username}</span>
            {user?.role === 'admin' && <span className="badge-admin">Admin</span>}
          </Link>
          <button className="btn-ghost" style={{ padding:'6px 14px', fontSize:13 }} onClick={handleLogout}>Sign out</button>
        </div>
      </div>
    </nav>
  );
}
