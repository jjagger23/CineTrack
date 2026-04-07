import { Link } from 'react-router-dom';

export default function NavLinkItem({ to, label, isActive }) {
  return (
    <Link to={to} className={`navLink ${isActive ? 'navLinkActive' : ''}`}>
      {label}
    </Link>
  );
}
