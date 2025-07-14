import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  text?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = 'inherit',
  text,
  fullPage = false,
}) => {
  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress size={size} sx={{ color }} />
      {text && (
        <Typography variant="body2" sx={{ mt: 2, color }}>
          {text}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(25, 1, 80, 1)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};