import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Role } from '../types/dto';

interface RoleRouteProps {
  roles: Role[];
}

export function RoleRoute({ roles }: RoleRouteProps) {
  const { role } = useAuthContext();
  const { showToast } = useToast();
  const allowed = role !== null && roles.includes(role);

  useEffect(() => {
    if (!allowed) {
      showToast("You don't have access to that page.", 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
