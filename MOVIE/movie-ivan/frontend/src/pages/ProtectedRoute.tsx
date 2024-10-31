import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../common/hooks/useAuth';

const ProtectedRoute: React.FC<{ type: 'auth' | 'protected' }> = ({ type }) => {
  const { isAuthenticated } = useAuth();

  if (type === 'auth') {
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
