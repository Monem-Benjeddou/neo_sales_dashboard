import React from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, TextField, Badge, Avatar, Box, IconButton, Button } from '@mui/material';
import { Search, Notifications, Logout as LogoutIcon } from '@mui/icons-material';
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
  width: `calc(100% - ${collapsedDrawerWidth}px)`,
  marginLeft: `20px`,
  marginTop:'20px',
  backgroundImage: 'none',
  border: 'none',
  boxShadow: 'none'
}));

export const Navbar: React.FC = () => {
  const themeMode = useAppSelector(state => state.theme.mode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    
    <StyledAppBar position="relative">
      <Toolbar sx={{ minHeight: { xs: '64px', sm: '72px' } }}>
        <TextField
          placeholder="Search Here"
          className="max-w-[400px] bg-[rgba(35,13,85,0.8)] rounded-lg"
          sx={{
            maxWidth: 400,
            backgroundColor: 'rgba(35, 13, 85, 0.8)',
            borderRadius: '10px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
              padding: '12px 10px',
            },
            '& .MuiInputBase-placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
              opacity: 1,
            }
          }}
          InputProps={{
            startAdornment: <Search sx={{ color: 'white', mr: 2 }} />,
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <IconButton onClick={handleToggleTheme} sx={{ color: 'white' }}>
            {themeMode === 'dark' ? (
              <img src='/assets/icons/sun.svg' />
            ) : (
              <DarkModeIcon sx={{ fontSize: 28 }} />
            )}
          </IconButton>
            <img src='/assets/icons/bell.svg' />

          <Avatar src="https://i.pravatar.cc/300" sx={{ width: 40, height: 40 }} />

        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};