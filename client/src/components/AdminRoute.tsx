import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role - handle both 'role' property and case-insensitive check
  const userRole = (user as any).role || user.role;
  if (userRole !== 'admin') {
    console.log('User role:', userRole, 'Expected: admin');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

