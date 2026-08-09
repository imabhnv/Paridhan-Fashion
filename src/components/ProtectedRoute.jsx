import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show spinner while Firebase auth state resolves
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

  // Not logged in — redirect to login, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Logged in but wrong role — show clear Access Denied
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-luxury-alabaster dark:bg-luxury-charcoal px-4">
        <div className="max-w-md text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
            <ShieldAlert size={36} className="text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="font-playfair text-2xl font-bold dark:text-white">Access Denied</h2>
            <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
              You don't have permission to access this page.<br />
              This area is restricted to authorised accounts only.
            </p>
          </div>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-luxury-gold text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-luxury-bronze transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
