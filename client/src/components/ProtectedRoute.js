import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="error-container">
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
        <p>Admin privileges required.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
