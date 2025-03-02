import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Badge, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Avatar, 
  Box, 
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Engineering as EngineeringIcon,
  Architecture as ArchitectureIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

const Navbar = ({ onMenuToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const { currentUser, logout, isAdmin, isEngineer, isDesigner } = useContext(AuthContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext);
  
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
    handleNotificationMenuClose();
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    handleNotificationMenuClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get the role icon
  const getRoleIcon = () => {
    if (isAdmin) return <AdminPanelSettingsIcon />;
    if (isEngineer) return <EngineeringIcon />;
    if (isDesigner) return <ArchitectureIcon />;
    return <PersonIcon />;
  };

  // Format timestamp for displaying in notifications
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;

    return seconds < 5 ? 'just now' : `${Math.floor(seconds)} second${Math.floor(seconds) === 1 ? '' : 's'} ago`;
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Pipeline Management System
        </Typography>
        
     

        {/* Role badge */}
        <Tooltip title={`Logged in as ${currentUser?.role}`} arrow>
          <Box 
            sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              alignItems: 'center', 
              bgcolor: 'rgba(255,255,255,0.1)', 
              borderRadius: 1, 
              px: 1.5, 
              py: 0.5,
              mr: 2
            }}
          >
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              {getRoleIcon()}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium', textTransform: 'capitalize' }}>
              {currentUser?.role}
            </Typography>
          </Box>
        </Tooltip>
        
        {/* Notifications */}
        <IconButton
          color="inherit"
          aria-label="show notifications"
          onClick={handleNotificationMenuOpen}
          sx={{ mr: 1 }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        
        {/* Profile */}
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
            {currentUser?.name.charAt(0)}
          </Avatar>
        </IconButton>

        {/* Profile Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon>{getRoleIcon()}</ListItemIcon>
            <ListItemText 
              primary={currentUser?.name} 
              secondary={currentUser?.role.charAt(0).toUpperCase() + currentUser?.role.slice(1)} 
            />
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
        
        {/* Notifications Menu */}
        <Menu
          id="notification-menu"
          anchorEl={notificationAnchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          PaperProps={{
            sx: {
              width: 320,
              maxHeight: 400,
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Typography 
                variant="caption" 
                color="primary" 
                sx={{ cursor: 'pointer' }}
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </Typography>
            )}
          </Box>
          <Divider />
          
          {notifications.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            <>
              {notifications.map((notification) => (
                <MenuItem 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification.id)}
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    bgcolor: notification.read ? 'transparent' : 'rgba(66, 165, 245, 0.08)',
                    '&:hover': {
                      bgcolor: notification.read ? 'rgba(0, 0, 0, 0.04)' : 'rgba(66, 165, 245, 0.12)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={notification.read ? 'normal' : 'bold'}>
                        {notification.message}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {notification.sender && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {notification.sender.role === 'admin' && <AdminPanelSettingsIcon sx={{ fontSize: 12 }} />}
                          {notification.sender.role === 'engineer' && <EngineeringIcon sx={{ fontSize: 12 }} />}
                          {notification.sender.role === 'designer' && <ArchitectureIcon sx={{ fontSize: 12 }} />}
                          {notification.sender.name}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(notification.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
              <Divider />
              <MenuItem sx={{ justifyContent: 'center' }}>
                <Typography variant="body2" color="primary" align="center">
                  View all notifications
                </Typography>
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;