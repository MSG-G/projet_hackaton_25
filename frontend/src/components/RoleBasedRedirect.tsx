import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const RoleBasedRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Redirection automatique après connexion
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'admin':
          window.location.href = '/admin';
          break;
        case 'supplier':
          window.location.href = '/supplier';
          break;
        case 'contractor':
          window.location.href = '/dashboard';
          break;
        default:
          window.location.href = '/';
      }
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirection basée sur le rôle
  switch (user?.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'supplier':
      return <Navigate to="/supplier" replace />;
    case 'contractor':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default RoleBasedRedirect;