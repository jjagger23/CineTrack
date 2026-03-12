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

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(15,15,15,0.97)' : 'rgba(15,15,15,0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      transition: 'background 0.3s ease, border-color 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 28px',
        height: 64, display: 'flex', alignItems: 'center', gap: 0,
      }}>
        {/* Logo */}
        <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 40 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 900, color: '#000',
          }}>C</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 2, color: 'var(--text)' }}>
            CINETRACK
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          <NavLink to="/catalog" active={isActive('/catalog')} label="Catalog" />
          {user?.role === 'user' && <NavLink to="/watchlist" active={isActive('/watchlist')} label="My Watchlist" />}

          {user?.role === 'admin' && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                style={{
                  background: isActive('/admin') ? 'var(--surface2)' : 'none',
                  border: 'none', color: isActive('/admin') ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: 600, fontSize: 14, padding: '7px 14px', borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 5,
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { if (!isActive('/admin')) { e.currentTarget.style.color='var(--text)'; e.currentTarget.style.background='var(--surface2)'; }}}
                onMouseLeave={e => { if (!isActive('/admin')) { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='none'; }}}
              >
                Admin
                <span style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
              </button>
              {adminOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setAdminOpen(false)} />
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, overflow: 'hidden', minWidth: 180,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                    zIndex: 50, animation: 'slideDown 0.15s ease',
                  }}>
                    {[
                      ['/admin', '📊 Dashboard'],
                      ['/admin/shows', '🎬 Manage Shows'],
                      ['/admin/users', '👥 Manage Users'],
                      ['/admin/reviews', '⭐ Manage Reviews'],
                    ].map(([to, label]) => (
                      <Link key={to} to={to} onClick={() => setAdminOpen(false)} style={{
                        display: 'block', padding: '11px 18px', fontSize: 14,
                        color: isActive(to) ? 'var(--blue)' : 'var(--text-muted)',
                        background: isActive(to) ? 'var(--surface2)' : 'transparent',
                        borderLeft: isActive(to) ? '3px solid var(--blue)' : '3px solid transparent',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background='var(--surface2)'; e.currentTarget.style.color='var(--text)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background=isActive(to)?'var(--surface2)':'transparent'; e.currentTarget.style.color=isActive(to)?'var(--blue)':'var(--text-muted)'; }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--blue-glow)', border: '1.5px solid var(--blue-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: 'var(--blue)',
            }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{user?.username}</span>
            {user?.role === 'admin' && <span className="badge-admin">Admin</span>}
          </div>
          <button className="btn-ghost" style={{ padding: '7px 16px', fontSize: 13 }} onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, label }) {
  return (
    <Link to={to} style={{
      padding: '7px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
      color: active ? 'var(--text)' : 'var(--text-muted)',
      background: active ? 'var(--surface2)' : 'transparent',
      transition: 'color 0.2s, background 0.2s',
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.color='var(--text)'; e.currentTarget.style.background='var(--surface2)'; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='transparent'; }}}
    >
      {label}
    </Link>
  );
}
