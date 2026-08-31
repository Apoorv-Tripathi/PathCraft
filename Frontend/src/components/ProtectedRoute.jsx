import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'var(--bg-canvas)' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
          <div className="caption text-muted">Verifying session...</div>
        </div>
      </div>
    );
  }

  const token = localStorage.getItem('pathcraft_token');
  if (!user.isLoggedIn && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
