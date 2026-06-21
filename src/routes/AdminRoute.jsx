import ProtectedRoute from './ProtectedRoute.jsx';

export default function AdminRoute() {
  return <ProtectedRoute role="admin" />;
}
