import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, TextField, Badge, Avatar, Box, IconButton, Button, useMediaQuery, Theme, InputAdornment } from '@mui/material';
import { Search, Notifications, Logout as LogoutIcon, Menu as MenuIcon } from '@mui/icons-material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { toggleTheme } from '../../redux/themeSlice';

const collapsedDrawerWidth = 25;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: 'rgba(16, 0, 51, 0)',
  backdropFilter: 'blur(10px)',
  width: '100%',
  marginLeft: 0,
  marginTop: '10px',
  backgroundImage: 'none',
  border: 'none',
  boxShadow: 'none',

  [theme.breakpoints.up('sm')]: {
    marginTop: '20px',
    width: `calc(100% - ${collapsedDrawerWidth}px)`,
    marginLeft: '20px',
  },
}));

export const Navbar: React.FC = () => {
  const themeMode = useAppSelector(state => state.theme.mode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <StyledAppBar position="relative">
      <Toolbar sx={{ 
        minHeight: { xs: '56px', sm: '64px', md: '72px' },
        padding: { xs: '0 8px', sm: '0 16px', md: '0 24px' },
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-between'
      }}>
        <TextField
          placeholder="Search Here"
          className="bg-[rgba(35,13,85,0.8)] rounded-lg"
          sx={{
            maxWidth: { xs: '100%', sm: 300, md: 480 },
            width: { xs: '100%', sm: 'auto' },
            minWidth: { xs: 'auto', sm: 200, md: 300 },
            flex: { xs: 1, sm: 'none' },
            marginRight: { xs: 1, sm: 0 },
            backgroundColor: 'rgba(35, 13, 85, 0.8)',
            borderRadius: '10px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
            },
            '& .MuiInputBase-input': {
              color: 'white',
              padding: { xs: '8px', sm: '10px', md: '12px 10px' },
            },
            '& .MuiInputBase-placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
              opacity: 1,
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'white', mr: { xs: 1, sm: 2 } }} />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2, md: 3 } }}>
          <IconButton onClick={handleToggleTheme} sx={{ color: 'white' }}>
            {themeMode === 'dark' ? (
              <img src='/assets/icons/sun.svg' alt="Light mode" style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24 }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />
            )}
          </IconButton>
          
          <IconButton sx={{ color: 'white', display: { xs: 'none', sm: 'flex' } }}>
            <img src='/assets/icons/bell.svg' alt="Notifications" style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24 }} />
          </IconButton>

          <Avatar 
            src="https://i.pravatar.cc/300" 
            sx={{ 
              width: { xs: 32, sm: 36, md: 40 }, 
              height: { xs: 32, sm: 36, md: 40 } 
            }} 
          />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};