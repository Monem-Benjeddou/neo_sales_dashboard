import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { LoadingSpinner } from '../ui';
import { usePageReload } from '../../hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAppSelector(state => state.auth);
  const location = useLocation();
  const { isReloading } = usePageReload();

  // Show loading spinner while checking authentication or during page reload
  if (isLoading || isReloading) {
    return <LoadingSpinner fullPage text="Verifying authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};
