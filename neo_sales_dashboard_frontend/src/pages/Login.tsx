import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Card } from '@mui/material'; // Removed Button import as it's no longer directly used for the main action
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks'; // Assuming useAppDispatch and clearError are not directly used in the current snippet's logic
import FuturisticLoginButton from '../components/ui/button'; // Ensure this path is correct
import { LoadingSpinner, ErrorDisplay } from '../components/ui'; // Assuming ApiDataContainer and useApiRequest are not directly used in the current snippet's logic
import { useLogin } from '../hooks';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isLoading, error } = useAppSelector(state => state.auth);
  const {
    username,
    password,
    usernameError,
    passwordError,
    formError,
    setUserName,
    setPassword,
    handleSubmit,
    clearFormError
  } = useLogin();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  useEffect(() => {
    clearFormError();
  }, []);

  return (
    // Main container with background styles and relative positioning for absolute children
    <div className="min-h-screen flex items-center justify-center w-full bg-[#120036] p-4 relative overflow-hidden">
      {/* Absolute positioned background decorative elements - now using viewport units (vw/vh) for better responsiveness */}
      {/* Top-left logo: positioned using percentages and sized with vw/vh, with max-width to prevent excessive scaling */}
      <div className="absolute left-[5%] top-[10%] w-[2vw] h-[2vw] -rotate-[38.82deg] max-w-[1.955rem] max-h-[1.964rem]">
        <img src="/assets/icons/logo.svg" alt="logo" className="w-full h-full" />
      </div>
      {/* Top-right logo: positioned using percentages and sized with vw/vh, with max-width to prevent excessive scaling */}
      <div className="absolute right-[5%] top-[5%] w-[3vw] h-[3vw] -rotate-[38.82deg] max-w-[3.396rem] max-h-[3.4125rem]">
        <img src="/assets/icons/logo.svg" alt="logo" className="w-full h-full" />
      </div>
      {/* Bottom-left logo (visually positioned towards bottom-right): positioned using percentages and sized with vw/vh, with max-width */}
      <div className="absolute right-[10%] bottom-[10%] w-[5vw] h-[5vw] -rotate-[38.82deg] max-w-[5.6875rem] max-h-[5.75rem]">
        <img src="/assets/icons/logo.svg" alt="logo" className="w-full h-full" />
      </div>
      {/* Blurred element: uses percentages for positioning, blur amount remains fixed */}
      <div className="absolute right-[7.36%] left-[59.31%] top-[62.55%] bottom-[-5.95%] bg-[#822BF1] opacity-25 blur-[14.3125rem]"></div>
      {/* Stars image: positioned absolutely, full width, and vertically centered */}
      <img src="/assets/stars.svg" alt="stars" className="absolute right-0 top-1/2 -translate-y-1/2 w-full" />
      {/* Bottom-right logo: positioned using percentages and sized with vw/vh, with max-width */}


      {/* Main content wrapper: flex column to stack logo and card, with responsive padding */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-screen-lg px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* App Name Logo: responsive width and centered */}
        <Box
          id='appName-logo'
          className="mb-8 w-full max-w-[21.0625rem] h-auto flex justify-center items-center"
        >
          <img src='/assets/logos/appName.svg' alt="App Name" className="w-full h-full object-contain" />
        </Box>

        {/* Login Card Container: responsive width and centered */}
        <Box
          className="w-full max-w-[40.625rem] mx-auto"
          id='login-card-container'
        >
          <Card
            className="rounded-[2.625rem] overflow-hidden w-full h-full"
            sx={{
              background: 'linear-gradient(160.61deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 101.7%)',
              borderTop: '0.15625rem solid rgba(255, 255, 255, 0.4)',
              borderBottom: '0.15625rem solid rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(1.125rem)',
              boxShadow: 'none',
              padding: 0
            }}
          >
            <Box className="p-4 text-center sm:pt-[3.75rem] md:pt-[4.625rem]">
              <Typography
                variant="h3"
                component="h2"
                fontSize={'50px'}
                lineHeight={'100%'}
                className="!text-white !mb-2 text-3xl sm:text-4xl md:text-[3.125rem] leading-[3.875rem]"
                fontFamily={'oxanium'}
              >
                Log In
              </Typography>
            </Box>

            <Box className="p-4 pt-0 w-full max-w-[34.375rem] mx-auto sm:p-6 md:p-8 md:pt-5">
              <ErrorDisplay
                error={error || formError}
                onRetry={clearFormError}
                sx={{ mb: 3 }}
              />

              <Box component="form" onSubmit={handleSubmit} noValidate> {/* The form element should wrap the inputs and the submit button */}
                <Typography variant="body1" className="text-white font-poppins text-base sm:text-lg md:text-[1.25rem] leading-[1.875rem] mb-2">
                  Email Address
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  error={!!usernameError}
                  helperText={usernameError}
                  InputProps={{
                    className: 'text-white',
                    sx: {
                      background: 'rgba(255, 255, 255, 0.09)',
                      borderRadius: '0.625rem',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                      '& .MuiInputBase-input::placeholder': { color: '#9ca3af', opacity: 1 },
                    }
                  }}
                  InputLabelProps={{
                    shrink: true,
                    className: 'hidden'
                  }}
                  className="mb-4"
                />

                <Typography variant="body1" className="text-white font-poppins text-base sm:text-lg md:text-[1.25rem] leading-[1.875rem] mb-2 mt-4">
                  Password
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                  InputProps={{
                    className: 'text-white',
                    sx: {
                      background: 'rgba(255, 255, 255, 0.09)',
                      borderRadius: '0.625rem',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                      '& .MuiInputBase-input::placeholder': { color: '#9ca3af', opacity: 1 },
                    }
                  }}
                  InputLabelProps={{
                    shrink: true,
                    className: 'hidden'
                  }}
                  className="mb-6"
                />

                {/* Flex container for the "Forget Password" and "Don't Have An Account?" links */}
                <Box className="flex justify-between mb-6 font-poppins text-sm sm:text-base md:text-[1rem] leading-[1.5rem]">
                  <Typography component="a" href="#" className="text-[#FFB636] hover:text-yellow-400" style={{ textDecoration: 'none' }}>
                    Forget Password?
                  </Typography>
                  <Typography component="a" href="#" className="text-[#FFB636] hover:text-white text-right" style={{ textDecoration: 'none' }}>
                    Don't Have An Account?
                  </Typography>
                </Box>

                <FuturisticLoginButton
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  isLoading={isLoading}
                />
              </Box>
            </Box>
          </Card>
        </Box>
      </div>
    </div>
  );
};