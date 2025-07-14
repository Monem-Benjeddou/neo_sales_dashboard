import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  Stack
} from '@mui/material';
import { 
  Dashboard as DashboardOutlined, 
  Folder as FolderOutlined, 
  AccountCircle as UserOutlined, 
  Logout as LogoutOutlined,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 256;

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleDrawerToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenuItemClick = (key: string) => {
    handleCloseUserMenu();
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else if (key === 'profile') {
      // Handle profile navigation if needed
    }
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/collections',
      icon: <FolderOutlined />,
      label: 'Collections',
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? 60 : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: collapsed ? 60 : drawerWidth, 
            boxSizing: 'border-box', 
            transition: 'width 0.3s ease-in-out',
            backgroundColor: 'white',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
          },
        }}
      >
        <Box className="p-4 border-b border-gray-200">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <DashboardOutlined className="text-white text-lg" />
            </Box>
            {!collapsed && (
              <Typography variant="h6" component="div" className="!mb-0 !text-gray-800">
                SalesFlow
              </Typography>
            )}
          </Stack>
        </Box>
        
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.key)}
                selected={location.pathname === item.key}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'initial',
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(24, 144, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(24, 144, 255, 0.15)',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 'auto' : 3,
                    justifyContent: 'center',
                    color: location.pathname === item.key ? 'primary.main' : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ opacity: collapsed ? 0 : 1 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 0, backgroundColor: '#f9fafb' }}>
        <AppBar 
          position="static" 
          sx={{ 
            backgroundColor: 'white', 
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            width: `calc(100% - ${collapsed ? 60 : drawerWidth}px)`,
            ml: collapsed ? '60px' : `${drawerWidth}px`,
            transition: 'width 0.3s ease-in-out, margin-left 0.3s ease-in-out',
          }}
        >
          <Toolbar className="px-4 flex items-center justify-between">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ 
                mr: 2, 
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {collapsed ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ p: 0 }}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Avatar 
                  sx={{ 
                    background: 'linear-gradient(to bottom right, #3f51b5, #9c27b0)', 
                    width: 32, 
                    height: 32 
                  }}
                >
                  <UserOutlined />
                </Avatar>
                <Box className="text-right">
                  <Typography variant="body2" className="font-medium text-gray-900">{user?.name}</Typography>
                  <Typography variant="caption" className="text-gray-500">{user?.role}</Typography>
                </Box>
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => handleUserMenuItemClick('profile')}>
                  <ListItemIcon>
                    <UserOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleUserMenuItemClick('logout')}>
                  <ListItemIcon>
                    <LogoutOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
