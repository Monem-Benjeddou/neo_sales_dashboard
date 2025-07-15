import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Card } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import FuturisticLoginButton from '../components/ui/button';
import { LoadingSpinner, ErrorDisplay } from '../components/ui';
import { useLogin } from '../hooks';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isLoading, error } = useAppSelector(state => state.auth);
  const {
    email,
    password,
    emailError,
    passwordError,
    formError,
    setemail,
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
    <div className="min-h-screen flex items-center justify-center w-full bg-[#120036] p-4 relative overflow-hidden">
      <div className="absolute left-[10%] top-[25%] w-[4vw] h-[4vw] -rotate-[38.82deg] max-w-[3.955rem] max-h-[3.964rem]">
        <img src="/assets/icons/logo.svg" alt="logo" className="w-full h-full" />
      </div>
      <div className="absolute right-[15%] top-[15%] w-[5vw] h-[5vw] -rotate-[38.82deg] max-w-[4.396rem] max-h-[4.4125rem]">
        <img src="/assets/icons/logo.svg" alt="logo" className="w-full h-full" />
      </div>
      <div className="absolute right-[18%] bottom-[1%] w-[10vw] h-[10vw] -rotate-[38.82deg] max-w-[8.6875rem] max-h-[8.75rem]">
        <img src="/assets/icons/logo.svg" alt="logo" className="w-full h-full" />
      </div>
      <div className="absolute right-[7.36%] left-[59.31%] top-[62.55%] bottom-[-5.95%] bg-[#822BF1] opacity-25 blur-[14.3125rem]"></div>
      <img src="/assets/stars.svg" alt="stars" className="absolute right-0 top-1/2 -translate-y-1/2 w-full" />


      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-screen-lg px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        <Box
          id='appName-logo'
          className="mb-8 w-full max-w-[21.0625rem] h-auto flex justify-center items-center"
        >
          <img src='/assets/logos/appName.svg' alt="App Name" className="w-full h-full object-contain" />
        </Box>

        <Box
          className="w-full max-w-[40.625rem] mx-auto"
          id='login-card-container'
        >
          <Card
            className=" overflow-hidden w-full h-full"
            sx={{
              borderRadius:'2.25rem',
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

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="body1" className="text-white font-poppins text-base sm:text-lg md:text-[1.25rem] leading-[1.875rem] mb-2">
                  Email Address
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
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
