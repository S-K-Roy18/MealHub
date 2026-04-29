import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requireAdmin = false, requireManager = false }) {
  const { user, isManager, loading } = useAuth();

  if (loading) return (
    <div className="loading-container">
      <div className="spinner" />
    </div>
  );

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but no mess → go to create-mess
  // (except if they're already trying to reach create-mess — handled by App.jsx route order)
  if (!user.messId) return <Navigate to="/create-mess" replace />;

  // Role guards
  if (requireAdmin && !user.isAdmin) return <Navigate to="/dashboard" replace />;
  if (requireManager && !isManager) return <Navigate to="/dashboard" replace />;

  return children;
}

export function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="loading-container">
      <div className="spinner" />
    </div>
  );

  // Already logged in with a mess → go to dashboard
  if (user && user.messId) return <Navigate to="/dashboard" replace />;

  // Logged in but no mess yet → let them access login/signup
  // (they need to go to create-mess, which is not a PublicRoute)
  return children;
}
