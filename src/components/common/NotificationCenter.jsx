import { useContext, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  IconButton, 
  Button,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Engineering as EngineeringIcon,
  Architecture as ArchitectureIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { NotificationContext } from '../../context/NotificationContext';

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filter, setFilter] = useState('all');

  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useContext(NotificationContext);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event, notificationId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedNotificationId(notificationId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNotificationId(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    handleFilterMenuClose();
  };

  const handleRemoveNotification = () => {
    removeNotification(selectedNotificationId);
    handleMenuClose();
  };

  const handleMarkAsRead = () => {
    markAsRead(selectedNotificationId);
    handleMenuClose();
  };

  // Format timestamp for displaying
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

  // Filter notifications based on the selected tab and filter
  const filteredNotifications = notifications.filter(notification => {
    // Filter by read/unread based on tab
    if (activeTab === 1 && notification.read) return true;
    if (activeTab === 2 && !notification.read) return true;
    if (activeTab === 0) {
      // If on "All" tab, then apply sender filter
      if (filter === 'all') return true;
      if (filter === 'admin' && notification.sender?.role === 'admin') return true;
      if (filter === 'engineer' && notification.sender?.role === 'engineer') return true;
      if (filter === 'designer' && notification.sender?.role === 'designer') return true;
      return false;
    }
    return false;
  });

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ px: 3, py: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon />
            Notifications
          </Typography>
          <Box>
            <Tooltip title="Filter notifications">
              <IconButton 
                color="inherit" 
                size="small"
                onClick={handleFilterMenuOpen}
                sx={{ mr: 1 }}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Button 
              variant="outlined" 
              size="small" 
              color="inherit" 
              onClick={clearAllNotifications}
              sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="All" />
        <Tab label="Read" />
        <Tab 
          label={
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <Box sx={{ mr: unreadCount ? 2 : 0 }}>Unread</Box>
            </Badge>
          } 
        />
      </Tabs>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {filteredNotifications.length > 0 ? (
          <List>
            {filteredNotifications.map((notification) => (
              <Box key={notification.id}>
                <ListItem
                  sx={{
                    px: 3,
                    py: 1.5,
                    bgcolor: notification.read ? 'transparent' : 'rgba(66, 165, 245, 0.08)',
                    '&:hover': {
                      bgcolor: notification.read ? 'rgba(0, 0, 0, 0.04)' : 'rgba(66, 165, 245, 0.12)'
                    }
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, notification.id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {notification.sender?.role === 'admin' && <AdminPanelSettingsIcon color="secondary" />}
                    {notification.sender?.role === 'engineer' && <EngineeringIcon color="info" />}
                    {notification.sender?.role === 'designer' && <ArchitectureIcon color="success" />}
                    {!notification.sender && <NotificationsIcon color="primary" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="body2" 
                        fontWeight={notification.read ? 'normal' : 'bold'}
                      >
                        {notification.message}
                      </Typography>
                    }
                    secondary={
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mt: 0.5 
                        }}
                      >
                        {notification.sender && (
                          <Typography variant="caption" color="text.secondary">
                            From: {notification.sender.name}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(notification.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </Box>
            ))}
          </List>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%', 
              p: 4 
            }}
          >
            <Typography color="text.secondary" align="center">
              No notifications found
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Notification action menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMarkAsRead}>
          <ListItemIcon>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          Mark as read
        </MenuItem>
        <MenuItem onClick={handleRemoveNotification}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Remove notification
        </MenuItem>
      </Menu>
      
      {/* Filter menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterMenuClose}
      >
        <MenuItem 
          onClick={() => handleFilterChange('all')}
          selected={filter === 'all'}
        >
          <ListItemIcon>
            {filter === 'all' && <CheckCircleIcon fontSize="small" color="primary" />}
          </ListItemIcon>
          All senders
        </MenuItem>
        <MenuItem 
          onClick={() => handleFilterChange('admin')}
          selected={filter === 'admin'}
        >
          <ListItemIcon>
            {filter === 'admin' ? 
              <CheckCircleIcon fontSize="small" color="primary" /> : 
              <AdminPanelSettingsIcon fontSize="small" color="secondary" />
            }
          </ListItemIcon>
          From Admin
        </MenuItem>
        <MenuItem 
          onClick={() => handleFilterChange('engineer')}
          selected={filter === 'engineer'}
        >
          <ListItemIcon>
            {filter === 'engineer' ? 
              <CheckCircleIcon fontSize="small" color="primary" /> : 
              <EngineeringIcon fontSize="small" color="info" />
            }
          </ListItemIcon>
          From Engineer
        </MenuItem>
        <MenuItem 
          onClick={() => handleFilterChange('designer')}
          selected={filter === 'designer'}
        >
          <ListItemIcon>
            {filter === 'designer' ? 
              <CheckCircleIcon fontSize="small" color="primary" /> : 
              <ArchitectureIcon fontSize="small" color="success" />
            }
          </ListItemIcon>
          From Designer
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default NotificationCenter;