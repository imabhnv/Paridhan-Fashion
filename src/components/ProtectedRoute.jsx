import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-alabaster dark:bg-luxury-charcoal">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-luxury-gold/20"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-luxury-gold animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but keep track of prior location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to home if user role is not authorized
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
