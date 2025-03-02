import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  DataObject as DataObjectIcon,
  Plumbing as PlumbingIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Engineering as EngineeringIcon,
  Architecture as ArchitectureIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  AssessmentOutlined as AnalysisIcon,
  BarChart as ChartIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContext";

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { currentUser, logout, isAdmin, isEngineer, isDesigner } =
    useContext(AuthContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useContext(NotificationContext);

  const navigate = useNavigate();
  const location = useLocation();

  // Automatically close drawer on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

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
    navigate("/login");
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    if (isAdmin) {
      return [
        {
          text: "Dashboard",
          icon: <DashboardIcon />,
          path: "/admin/dashboard",
        },
        {
          text: "Activity Monitor",
          icon: <ChartIcon />,
          path: "/admin/activity",
        },
        {
          text: "Message Center",
          icon: <MessageIcon />,
          path: "/admin/messages",
        },
      ];
    } else if (isEngineer) {
      return [
        {
          text: "Dashboard",
          icon: <DashboardIcon />,
          path: "/engineer/dashboard",
        },
        { text: "File Upload", icon: <UploadIcon />, path: "/engineer/upload" },
        {
          text: "Manual Data Entry",
          icon: <DataObjectIcon />,
          path: "/engineer/manual-entry",
        },
        {
          text: "Analysis Results",
          icon: <AnalysisIcon />,
          path: "/engineer/results",
        },
      ];
    } else if (isDesigner) {
      return [
        {
          text: "Dashboard",
          icon: <DashboardIcon />,
          path: "/designer/dashboard",
        },
        {
          text: "Pipe Recommendations",
          icon: <PlumbingIcon />,
          path: "/designer/recommendations",
        },
      ];
    }
    return [];
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
    if (interval >= 1)
      return `${interval} year${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return `${interval} month${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return `${interval} hour${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} minute${interval === 1 ? "" : "s"} ago`;

    return seconds < 5
      ? "just now"
      : `${Math.floor(seconds)} second${
          Math.floor(seconds) === 1 ? "" : "s"
        } ago`;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 2 }}>
            Pipeline Management System
          </Typography>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 0.5 }}
          >
            ☎️ 98118708{""}
          </Typography>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            📩 omaralwa78@gmail.com
          </Typography>
          {/* Role badge */}
          <Tooltip
            title={`Logged in as ${currentUser?.role}`}
            arrow
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
          >
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                mr: 2,
              }}
            >
              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                {getRoleIcon()}
              </Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: "medium", textTransform: "capitalize" }}
              >
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
            <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>
              {currentUser?.name.charAt(0)}
            </Avatar>
          </IconButton>

          {/* Profile Menu */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>{getRoleIcon()}</ListItemIcon>
              <ListItemText
                primary={currentUser?.name}
                secondary={
                  currentUser?.role.charAt(0).toUpperCase() +
                  currentUser?.role.slice(1)
                }
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
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              sx: {
                width: 320,
                maxHeight: 400,
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Notifications</Typography>
              {unreadCount > 0 && (
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                  onClick={handleMarkAllRead}
                >
                  Mark all as read
                </Typography>
              )}
            </Box>
            <Divider />

            {notifications.length === 0 ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
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
                      bgcolor: notification.read
                        ? "transparent"
                        : "rgba(66, 165, 245, 0.08)",
                      "&:hover": {
                        bgcolor: notification.read
                          ? "rgba(0, 0, 0, 0.04)"
                          : "rgba(66, 165, 245, 0.12)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={notification.read ? "normal" : "bold"}
                        >
                          {notification.message}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {notification.sender && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {notification.sender.role === "admin" && (
                              <AdminPanelSettingsIcon sx={{ fontSize: 12 }} />
                            )}
                            {notification.sender.role === "engineer" && (
                              <EngineeringIcon sx={{ fontSize: 12 }} />
                            )}
                            {notification.sender.role === "designer" && (
                              <ArchitectureIcon sx={{ fontSize: 12 }} />
                            )}
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
                <MenuItem sx={{ justifyContent: "center" }}>
                  <Typography variant="body2" color="primary" align="center">
                    View all notifications
                  </Typography>
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            ...(isMobile && !open && { display: "none" }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 2 }}>
          <Box sx={{ px: 3, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              {currentUser?.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: "capitalize" }}
            >
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
                  display: "block",
                  bgcolor:
                    location.pathname === item.path
                      ? "rgba(0, 0, 0, 0.04)"
                      : "transparent",
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color:
                        location.pathname === item.path
                          ? "primary.main"
                          : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      color:
                        location.pathname === item.path
                          ? "primary.main"
                          : "inherit",
                      fontWeight:
                        location.pathname === item.path ? "bold" : "normal",
                      "& .MuiTypography-root": {
                        fontWeight:
                          location.pathname === item.path ? "bold" : "normal",
                      },
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
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={handleLogout}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: { xs: 10, sm: 8 } }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
