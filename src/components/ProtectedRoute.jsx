import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ role = 'cliente' }) {
  const { loading, isAuthenticated, role: userRole } = useAuth();
  const location = useLocation();

  if (loading) return <p className="page-shell">Cargando sesión...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
