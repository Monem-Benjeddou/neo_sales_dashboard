import React from 'react';
import { Alert, AlertTitle, Box, Button, Typography, SxProps, Theme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
  fullPage?: boolean;
  sx?: SxProps<Theme>;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  fullPage = false,
  sx,
}) => {
  if (!error) return null;

  const content = (
    <Box sx={{ width: '100%', ...sx }}>
      <Alert 
        severity="error" 
        variant="outlined"
        icon={<ErrorOutlineIcon fontSize="inherit" />}
        sx={{
          bgcolor: 'rgba(211, 47, 47, 0.1)',
          borderColor: 'error.main',
          '& .MuiAlert-icon': {
            color: 'error.main',
          },
        }}
      >
        <AlertTitle>Error</AlertTitle>
        <Typography variant="body2">{error}</Typography>
        
        {onRetry && (
          <Button
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            size="small"
            sx={{ mt: 1, color: 'error.main' }}
          >
            Try Again
          </Button>
        )}
      </Alert>
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          width: '100%',
          p: 2,
        }}
      >
        <Box sx={{ maxWidth: 500, width: '100%' }}>
          {content}
        </Box>
      </Box>
    );
  }

  return content;
};