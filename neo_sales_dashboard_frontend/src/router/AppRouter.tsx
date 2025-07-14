import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, createRoutesFromElements } from 'react-router-dom';
import { UNSAFE_DataRouterContext, UNSAFE_DataRouterStateContext } from 'react-router';
import { Login } from '../pages/Login';
import { Logout } from '../pages/Logout';
import { Dashboard } from '../pages/Dashboard';
import { Collections } from '../pages/Collections';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { MainLayout } from '../components/layouts/MainLayout';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { checkAuth } from '../redux/authSlice';
import { LoadingSpinner } from '../components/ui';
import { TokenManager } from '../utils/tokenManager';
const ProtectedPage: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return (
    <ProtectedRoute>
      <MainLayout>
        {element}
      </MainLayout>
    </ProtectedRoute>
  );
};

export const AppRouter: React.FC = () => {
  const { isLoggedIn, isLoading: authStateLoading } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [initializing, setInitializing] = useState(true);
  const [authCheckFailed, setAuthCheckFailed] = useState(false);

  // Check for authentication on initial load
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Only check auth if we have a refresh token
        if (TokenManager.hasRefreshToken()) {
          const resultAction = await dispatch(checkAuth());
          
          // Check if the authentication check was rejected
          if (checkAuth.rejected.match(resultAction)) {
            console.error('Authentication check rejected:', resultAction.error);
            setAuthCheckFailed(true);
            // Clear any invalid tokens
            TokenManager.clearTokens();
          }
        } else {
          // No refresh token, so we're not logged in
          setInitializing(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setAuthCheckFailed(true);
        // Clear any invalid tokens
        TokenManager.clearTokens();
      } finally {
        // Always set initializing to false, even if auth check fails
        setInitializing(false);
      }
    };

    checkAuthentication();
  }, [dispatch]);

  // Always show loading spinner during initial load to prevent white flash
  if (initializing) {
    return <LoadingSpinner fullPage text="Loading application..." />;
  }
  
  // If authentication check failed, redirect to login
  if (authCheckFailed) {
    // We'll handle this in the router by redirecting to login
    console.log('Authentication check failed, will redirect to login');
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route 
          path="/dashboard" 
          element={<ProtectedPage element={<Dashboard />} />}
        />
        <Route 
          path="/collections" 
          element={<ProtectedPage element={<Collections />} />}
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};