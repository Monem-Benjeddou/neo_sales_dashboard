import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery, Theme } from '@mui/material';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAppSelector } from '../../redux/hooks';


const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create(['margin', 'padding'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `2px`, 
  paddingTop: '84px',
  [theme.breakpoints.up('md')]: {
    paddingTop: '50px',
    padding: theme.spacing(3),
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: '56px',
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: '56px',
    padding: theme.spacing(1),
  },
}));

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const themeMode = useAppSelector(state => state.theme.mode);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));
  
  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100vw',
      overflow: 'hidden',
      backgroundColor: 'rgba(21, 1, 69, 0.6)',
      color: 'rgba(255, 255, 255, 1)',
      flexDirection: { xs: 'column', sm: 'row' }
    }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: { xs: 'calc(100vh - 60px)', sm: '100vh' },
          width: { xs: '100%', sm: 'calc(100% - 60px)' },
          marginLeft: { xs: 0, sm: '0' },
          backgroundColor: 'rgba(16, 0, 51, 1)',
          position: 'relative',
          overflow: 'auto',
        }}
      >
        <Navbar />
        <Main>
          {children}
        </Main>
      </Box>
    </Box>
  );
};