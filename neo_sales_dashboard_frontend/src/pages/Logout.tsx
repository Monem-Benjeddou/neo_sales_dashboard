import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/authSlice';
import { LoadingSpinner } from '../components/ui';

/**
 * Logout component that automatically logs out the user and redirects to login page
 */
export const Logout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Dispatch logout action when component mounts
    dispatch(logout());
  }, [dispatch]);

  // Show loading spinner while logout is processing
  return (
    <Box className="min-h-screen flex items-center justify-center bg-[#0D062D]">
      <LoadingSpinner size={60} color="primary.main" text="Logging out..." />
      <Navigate to="/login" replace />
    </Box>
  );
};