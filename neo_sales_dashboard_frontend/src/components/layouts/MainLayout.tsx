import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Toolbar } from '@mui/material';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAppSelector } from '../../redux/hooks';


const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `2px`, 
  paddingTop: '84px',
  [theme.breakpoints.up('sm')]: {
    paddingTop: '50px',
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: '56px',
  },
}));

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const themeMode = useAppSelector(state => state.theme.mode);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', minWidth: '99vw',  maxWidth: '100vw'   ,backgroundColor: 'rgba(21, 1, 69, 0.6)', color: 'rgba(255, 255, 255, 1)' }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'rgba(16, 0, 51, 1)',
          position: 'relative',
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