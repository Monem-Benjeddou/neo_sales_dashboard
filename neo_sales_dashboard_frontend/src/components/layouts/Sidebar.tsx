import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Drawer, List, ListItem, ListItemIcon, Box, useMediaQuery, Theme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import settings from '/assets/icons/settings.svg'
const sidebarWidth = 60; // Smaller sidebar width

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: sidebarWidth,
  flexShrink: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: 60,
    position: 'fixed',
    bottom: 0,
    zIndex: 1300,
  },
  '& .MuiDrawer-paper': {
    width: sidebarWidth,
    boxSizing: 'border-box',
    backgroundColor: 'rgba(29, 0, 84, 0.6)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    overflowX: 'hidden',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 60,
      flexDirection: 'row',
      justifyContent: 'space-around',
      top: 'auto',
      bottom: 0,
      borderRight: 'none',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
}));

const topNavigationItems = [
  { text: 'Home', iconSrc: '/assets/icons/home.svg', path: '/home' },
  { text: 'Dashboard', iconSrc: '/assets/icons/dashboard.svg', path: '/dashboard', },
  { text: 'Store', iconSrc: '/assets/icons/store.svg', path: '/store' },
  { text: 'Collections', iconSrc: '/assets/icons/collection.svg', path: '/collections' },
  { text: 'Media', iconSrc: '/assets/icons/media.svg', path: '/media' },
];

const bottomNavigationItems = [
  { text: 'Settings', iconSrc: '/assets/icons/settings.svg', path: '/settings' },
  { text: 'Logout', iconSrc: '/assets/icons/exit.svg', action: 'logout' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const themeMode = useAppSelector(state => state.theme.mode);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleLogout = () => {
    navigate('/logout');
  };

  // Combine navigation items for mobile view
  const mobileNavigationItems = [...topNavigationItems.slice(0, 4), bottomNavigationItems[1]];

  return (
    <StyledDrawer
      variant="permanent"
      anchor={isMobile ? 'bottom' : 'left'}
      open={true}
    >
      {!isMobile && (
        <Box className="py-7">
          <img src='/assets/icons/logo.svg' alt="Logo" className="w-[37px] h-[37px]" />
        </Box>
      )}

      <List className={isMobile ? "flex flex-row justify-around w-full" : "h-full flex flex-col w-full"}>
        {!isMobile ? (
          <>
            <Box className="flex flex-col w-full items-center" sx={{marginTop:'4.5rem'}}>
              {topNavigationItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  className="flex justify-center my-10"
                  sx={{
                    paddingRight:'0',
                    paddingLeft:'0',
                    width: 'auto',
                    minWidth: 'auto',
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
                        width: 20,
                        height: 20,
                      }}
                    />
                  </ListItemIcon>
                </ListItem>
              ))}
            </Box>

            <Box className="flex flex-col w-full items-center" sx={{marginTop:'7.5rem'}}>
              {bottomNavigationItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => {
                    if (item.action === 'logout') {
                      handleLogout();
                    } else if (item.path) { 
                      navigate(item.path);
                    }
                  }}
                  selected={location.pathname === item.path}
                  className="flex justify-center my-10"
                  sx={{
                    paddingRight:'0',
                    paddingLeft:'0',
                    width: 'auto',
                    minWidth: 'auto',
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
                        width: 20,
                        height: 20,
                      }}
                    />
                  </ListItemIcon>
                </ListItem>
              ))}
            </Box>
          </>
        ) : (
          // Mobile view - horizontal navigation
          mobileNavigationItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                if (item.action === 'logout') {
                  handleLogout();
                } else if (item.path) { 
                  navigate(item.path);
                }
              }}
              selected={location.pathname === item.path}
              sx={{
                flex: 1,
                justifyContent: 'center',
                padding: '8px 0',
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
                    width: 24,
                    height: 24,
                  }}
                />
              </ListItemIcon>
            </ListItem>
          ))
        )}
      </List>
    </StyledDrawer>
  );
};