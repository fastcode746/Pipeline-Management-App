import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  DataObject as DataObjectIcon,
  Plumbing as PlumbingIcon,
  Message as MessageIcon,
  Logout as LogoutIcon,
  AssessmentOutlined as AnalysisIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout, isAdmin, isEngineer, isDesigner } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    if (isAdmin) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Activity Monitor', icon: <ChartIcon />, path: '/admin/activity' },
        { text: 'Message Center', icon: <MessageIcon />, path: '/admin/messages' }
      ];
    } else if (isEngineer) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/engineer/dashboard' },
        { text: 'File Upload', icon: <UploadIcon />, path: '/engineer/upload' },
        { text: 'Manual Data Entry', icon: <DataObjectIcon />, path: '/engineer/manual-entry' },
        { text: 'Analysis Results', icon: <AnalysisIcon />, path: '/engineer/results' }
      ];
    } else if (isDesigner) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/designer/dashboard' },
        { text: 'Pipe Recommendations', icon: <PlumbingIcon />, path: '/designer/recommendations' }
      ];
    }
    return [];
  };

  const drawer = (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <Box sx={{ px: 3, mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            {currentUser?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {currentUser?.role}
          </Typography>
        </Box>
        
        <Divider sx={{ mx: 2, mb: 2 }} />
        
        <List>
          {getMenuItems().map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding
              sx={{ 
                display: 'block',
                bgcolor: location.pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) onClose();
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ mx: 2, my: 2 }} />
        
        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={handleLogout}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
        
        <Box sx={{ px: 3, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Current Date and Time (UTC): 2025-02-23 19:32:40
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current User's Login: fastcode746
          </Typography>
        </Box>
      </Box>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          ...(isMobile && !open && { display: 'none' }),
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;