import React, { FormEvent } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

interface FuturisticLoginButtonProps {
  disabled: boolean;
  isLoading: boolean;
  type?: "button" | "submit" | "reset";
  onClick: (event: FormEvent<Element>) => Promise<void>;
}

const FuturisticLoginButton: React.FC<FuturisticLoginButtonProps> = ({ disabled, isLoading, type = "button", onClick }) => {
  return (
    <div className="h-full w-full flex items-center justify-center font-oxanium">
      <div className="flex items-center gap-3 w-full relative">
        <div className="w-[6px] h-[16px] sm:h-[24px] md:h-[24px] bg-[#f81dfb]" />
        <Box className="relative w-full">
          <Button
            fullWidth
            variant="contained"
            disabled={disabled}
            type={type}
            onClick={onClick}
            sx={{
              backgroundColor: '#f81dfb',
              color: 'white',
              fontFamily: 'Oxanium, sans-serif',
              fontWeight: 600,
              fontSize: '20px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: 0,
              position: 'relative',
              zIndex: 10,
              '&:hover': {
                backgroundColor: '#e615e4',
              },
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} color="inherit" />
                <Typography
                  variant="button"
                  fontFamily={'oxanium'}
                  className="font-medium text-base sm:text-lg md:text-[1.125rem] leading-[1.375rem] text-white capitalize relative z-10 ml-2"
                >
                  Signing In...
                </Typography>
              </Box>
            ) : (
              'Log In'
            )}
            <div className="absolute w-[10px] h-[10px] bg-[#f81dfb] top-0 -left-[10px]" />
            <div className="absolute w-[10px] h-[10px] bg-[#f81dfb] top-0 -right-[10px]" />
            <div className="absolute w-[10px] h-[10px] bg-[#f81dfb] bottom-0 -left-[10px]" />
            <div className="absolute w-[10px] h-[10px] bg-[#f81dfb] bottom-0 -right-[10px]" />
          </Button>
        </Box>
        <div className="w-[6px] h-[16px] sm:h-[24px] md:h-[24px] bg-[#f81dfb]" />
      </div>
    </div>
  );
};

export default FuturisticLoginButton;