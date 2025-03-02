import { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { currentUser, checkAuth, logActivity } = useContext(AuthContext);
  const location = useLocation();
  
  const isAuthenticated = checkAuth();
  const hasRequiredRole = allowedRoles.length === 0 || 
    (currentUser && allowedRoles.includes(currentUser.role));

  // Log navigation activity
  useEffect(() => {
    if (isAuthenticated && hasRequiredRole) {
      logActivity('navigation', `Accessed ${location.pathname}`);
    }
  }, [location.pathname, isAuthenticated, hasRequiredRole]);

  if (!isAuthenticated) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  if (!hasRequiredRole) {
    // Logged in but doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and has the required role
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;