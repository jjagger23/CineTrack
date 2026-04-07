import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavLinkItem from './NavLinkItem';

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

  const isActive = p => location.pathname === p || location.pathname.startsWith(`${p}/`);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navRoot ${scrolled ? 'navRootScrolled' : ''}`}>
      <div className="navInner">
        <Link to="/catalog" className="navBrand">
          <div className="navBrandBadge">C</div>
          <span className="grad-text navBrandText">CINETRACK</span>
        </Link>

        <div className="navLinksWrap">
          <NavLinkItem to="/catalog" label="Catalog" isActive={isActive('/catalog')} />
          {user?.role === 'user' && <>
            <NavLinkItem to="/watchlist" label="My Watchlist" isActive={isActive('/watchlist')} />
            <NavLinkItem to="/profile" label="Profile" isActive={isActive('/profile')} />
          </>}
          {user?.role === 'admin' && (
            <div className="navAdminWrap">
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className={`navAdminButton ${isActive('/admin') ? 'navAdminButtonActive' : ''}`}
              >
                Admin <span className="navAdminArrow">▾</span>
              </button>
              {adminOpen && <>
                <div className="navAdminBackdrop" onClick={() => setAdminOpen(false)} />
                <div className="navAdminDropdown">
                  {[['/admin', '📊 Dashboard'], ['/admin/shows', '🎬 Manage Shows'], ['/admin/users', '👥 Manage Users'], ['/admin/reviews', '⭐ Manage Reviews']].map(([to, label]) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setAdminOpen(false)}
                      className={`navAdminItem ${isActive(to) ? 'navAdminItemActive' : ''}`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </>}
            </div>
          )}
        </div>

        <div className="navRight">
          <Link to={user?.role === 'user' ? '/profile' : '#'} className="navProfileLink">
            <div className="navProfileAvatar">{user?.username?.[0]?.toUpperCase()}</div>
            <span className="navProfileName">{user?.username}</span>
            {user?.role === 'admin' && <span className="badge-admin">Admin</span>}
          </Link>
          <button className="btn-ghost navSignOutButton" onClick={handleLogout}>Sign out</button>
        </div>
      </div>
    </nav>
  );
}
