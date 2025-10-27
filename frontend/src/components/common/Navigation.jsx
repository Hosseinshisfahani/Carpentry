import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as ProjectIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { label: 'خانه', path: '/', icon: <HomeIcon /> },
    { label: 'پروژه‌ها', path: '/projects', icon: <ProjectIcon /> },
    { label: 'گزارش‌ها', path: '/analytics', icon: <AnalyticsIcon /> },
    { label: 'تنظیمات', path: '/settings', icon: <SettingsIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ px: 2, pb: 2, borderBottom: '1px solid rgba(107, 66, 38, 0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2E1C13' }}>
          سیستم مدیریت پروژه
        </Typography>
        <Typography variant="body2" sx={{ color: '#4A2F1A', mt: 0.5 }}>
          خوش آمدید، {user?.username}
        </Typography>
      </Box>
      
      <List sx={{ pt: 2 }}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: location.pathname === item.path ? '#6B4226' : '#4A2F1A',
              bgcolor: location.pathname === item.path ? 'rgba(107, 66, 38, 0.08)' : 'transparent',
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              '&:hover': {
                bgcolor: 'rgba(107, 66, 38, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        
        <ListItem
          onClick={handleLogout}
          sx={{
            color: '#B8866B',
            borderRadius: 1,
            mx: 1,
            mt: 2,
            '&:hover': {
              bgcolor: 'rgba(184, 134, 107, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="خروج" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #6B4226 0%, #4A2F1A 100%)',
          borderBottom: '1px solid rgba(255, 248, 240, 0.1)',
          borderRadius: '0 !important',
          minHeight: '64px',
          width: '100%',
          left: 0,
          right: 0,
          '&.MuiAppBar-root': {
            borderRadius: '0 !important',
          },
          '& .MuiToolbar-root': {
            borderRadius: '0 !important',
            background: 'transparent',
            minHeight: '64px',
            paddingLeft: '16px',
            paddingRight: '16px',
            width: '100%',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #6B4226 0%, #4A2F1A 100%)',
            borderRadius: '0 !important',
            zIndex: -1,
          },
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar
              sx={{
                bgcolor: '#FFF8F0',
                color: '#6B4226',
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <DashboardIcon />
            </Avatar>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#FFF8F0',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              سیستم مدیریت پروژه
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: location.pathname === item.path ? '#FFF8F0' : 'rgba(255, 248, 240, 0.8)',
                    bgcolor: location.pathname === item.path ? 'rgba(255, 248, 240, 0.15)' : 'transparent',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    '&:hover': {
                      bgcolor: 'rgba(255, 248, 240, 0.1)',
                      color: '#FFF8F0',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <Chip
              label={user?.username}
              sx={{
                bgcolor: 'rgba(255, 248, 240, 0.2)',
                color: '#FFF8F0',
                fontWeight: 500,
                display: { xs: 'none', sm: 'flex' },
              }}
            />
            <IconButton
              onClick={handleMenuOpen}
              sx={{ color: '#FFF8F0' }}
              aria-label="حساب کاربری"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 248, 240, 0.2)' }}>
                {user?.username?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            bgcolor: '#FFF8F0',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: '#FFF8F0',
            border: '1px solid rgba(107, 66, 38, 0.1)',
            borderRadius: 2,
            mt: 1,
          },
        }}
      >
        <MenuItem onClick={handleLogout} sx={{ color: '#B8866B' }}>
          <LogoutIcon sx={{ mr: 1 }} />
          خروج
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navigation;
