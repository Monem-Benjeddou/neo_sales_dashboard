import React from 'react';
import { styled } from '@mui/material/styles';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, IconButton, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';

const sidebarWidth = 90; 

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: sidebarWidth,
  flexShrink: 0,
  overflow:'hidden',
  whiteSpace: 'nowrap',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '& .MuiDrawer-paper': {
    width: sidebarWidth,
  
    boxSizing: 'border-box',
    backgroundColor: 'rgba(29, 0, 84, 0.6)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: 60,
    },
    [theme.breakpoints.up('sm')]: {
      width: sidebarWidth,
    },
  },
}));

const topNavigationItems = [
  { text: 'Home', iconSrc: '../assets/icons/home.svg', path: '/home', width: 28, height: 28 },
  { text: 'Dashboard', iconSrc: '../assets/icons/dashboard.svg', path: '/dashboard', width: 28, height: 28 },
  { text: 'Store', iconSrc: '../assets/icons/store.svg', path: '/store', width: 28, height: 28 },
  { text: 'Collections', iconSrc: '../assets/icons/collection.svg', path: '/collections', width: 28, height: 28 },
  { text: 'Media', iconSrc: '../assets/icons/media.svg', path: '/media', width: 28, height: 40 },
];

const bottomNavigationItems = [
  { text: 'Settings', iconSrc: '../assets/icons/settings.svg', path: '/settings', width: 31, height: 31 },
  { text: 'Logout', iconSrc: '../assets/icons/exit.svg', action: 'logout', width: 31, height: 31 }, 
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const themeMode = useAppSelector(state => state.theme.mode);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    navigate('/logout');
  };
  return (
    
    <StyledDrawer
      variant="permanent"
      anchor="left"
      open={true}
    >
      <Box className="py-7">
        <img src='../assets/icons/logo.svg' alt="Logo" className="w-[29px] h-[29px]" />
      </Box>

      <List className="h-full flex flex-col w-full overflow-y-hidden  overflow-x-hidden">
        <Box className="flex flex-col w-full">
          {topNavigationItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              className="flex justify-center my-2"
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  color:'rgba(255, 4, 180, 1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                },
              }}
            >
              <ListItemIcon className="min-w-0 justify-center">
                <img
                  src={item.iconSrc}
                  alt={item.text}
                  style={{
                    width: item.width,
                    height: item.height,
                    color:'rgba(194, 173, 235, 1)',

                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: 0,
                  width: 0,
                  transition: 'opacity 0.3s ease-in-out, width 0.3s ease-in-out',
                  color: location.pathname === item.path ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  '& .MuiListItemText-primary': { fontWeight: location.pathname === item.path ? 600 : 400 },
                }}
              />
            </ListItem>
          ))}
        </Box>

        <Box className="flex-grow"></Box>

        <Box className="flex flex-col w-full pb-5">
          {bottomNavigationItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                if (item.action === 'logout') {
                  handleLogout();
                } else if (item.path) { // Check if path exists before navigating
                  navigate(item.path);
                }
              }}
              selected={item.path ? location.pathname === item.path : false} // Conditional selection for items with a path
              className="flex justify-center my-2"
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                },
              }}
            >
              <ListItemIcon className="min-w-0 justify-center">
                <img
                  src={item.iconSrc}
                  alt={item.text}
                  style={{
                    width: item.width,
                    height: item.height,
                    filter: (item.path && location.pathname === item.path) // Conditional filter for selected state
                      ? 'invert(100%) sepia(100%) saturate(0%) hue-rotate(247deg) brightness(100%) contrast(100%)'
                      : (themeMode === 'dark' ? 'invert(80%) sepia(0%) saturate(1%) hue-rotate(247deg) brightness(120%) contrast(80%)' : 'none'),
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: 0,
                  width: 0,
                  transition: 'opacity 0.3s ease-in-out, width 0.3s ease-in-out',
                  color: (item.path && location.pathname === item.path) ? 'white' : 'rgba(255, 255, 255, 0.5)', // Conditional color
                  '& .MuiListItemText-primary': { fontWeight: (item.path && location.pathname === item.path) ? 600 : 400 },
                }}
              />
            </ListItem>
          ))}
        </Box>
      </List>
    </StyledDrawer>
  );
};