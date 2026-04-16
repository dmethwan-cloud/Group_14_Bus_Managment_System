import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const ProtectedRoute = ({ allowedRoles }) => {
  // Check if user is logged in
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has permission to access this route
  const role = getUserRole();
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;
