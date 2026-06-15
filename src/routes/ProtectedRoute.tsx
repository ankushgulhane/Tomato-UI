import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '../components/common/Spinner';
import { useAuthContext } from '../context/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuthContext();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
