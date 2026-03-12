import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar          from './components/Navbar';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import CatalogPage     from './pages/CatalogPage';
import WatchlistPage   from './pages/WatchlistPage';
import AdminDashboard  from './pages/AdminDashboard';
import ManageShows     from './pages/ManageShows';
import ManageUsers     from './pages/ManageUsers';
import ManageReviews   from './pages/ManageReviews';

const Protected = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

const AdminOnly = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'admin') return <Navigate to="/catalog" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {user && <Navbar />}
      <Routes>
        <Route path="/"                element={user ? <Navigate to="/catalog" /> : <LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/catalog"         element={<Protected><CatalogPage /></Protected>} />
        <Route path="/watchlist"       element={<Protected><WatchlistPage /></Protected>} />
        <Route path="/admin"           element={<AdminOnly><AdminDashboard /></AdminOnly>} />
        <Route path="/admin/shows"     element={<AdminOnly><ManageShows /></AdminOnly>} />
        <Route path="/admin/users"     element={<AdminOnly><ManageUsers /></AdminOnly>} />
        <Route path="/admin/reviews"   element={<AdminOnly><ManageReviews /></AdminOnly>} />
        <Route path="*"                element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
