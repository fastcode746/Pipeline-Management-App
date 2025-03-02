import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  Chip,
  Divider,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Assessment as AssessmentIcon,
  PersonOutline as PersonIcon,
  Engineering as EngineeringIcon,
  Architecture as ArchitectureIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Message as MessageIcon,
  Upload as UploadIcon,
  Plumbing as PlumbingIcon,
  Navigation as NavigationIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  DeleteOutline as DeleteIcon,
  AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';
import Chart from '../common/Chart';

const ActivityMonitor = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    action: 'all',
    period: '7days'
  });
  
  // Load activities on component mount
  useEffect(() => {
    loadActivities();
  }, []);
  
  // Apply filters when activities or filter settings change
  useEffect(() => {
    applyFilters();
  }, [activities, filters, searchTerm]);
  
  // Load activities from localStorage
  const loadActivities = () => {
    try {
      const storedActivities = localStorage.getItem('userActivities');
      if (storedActivities) {
        const parsedActivities = JSON.parse(storedActivities);
        // Sort by timestamp (most recent first)
        const sortedActivities = parsedActivities.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setActivities(sortedActivities);
      } else {
        // If no activities exist, create some sample data
        createSampleActivities();
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      createSampleActivities();
    }
  };
  
  // Create sample activity data for demo purposes
  const createSampleActivities = () => {
    const now = new Date();
    const sampleActivities = [
      {
        userId: 1,
        userName: 'Admin User',
        userRole: 'admin',
        action: 'login',
        timestamp: new Date(now - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        details: 'logged in'
      },
      {
        userId: 2,
        userName: 'Engineer User',
        userRole: 'engineer',
        action: 'login',
        timestamp: new Date(now - 1000 * 60 * 60).toISOString(), // 1 hour ago
        details: 'logged in'
      },
      {
        userId: 2,
        userName: 'Engineer User',
        userRole: 'engineer',
        action: 'upload',
        timestamp: new Date(now - 1000 * 60 * 62).toISOString(), // 1 hour 2 minutes ago
        details: 'uploaded pipeline_data.xlsx'
      },
      {
        userId: 2,
        userName: 'Engineer User',
        userRole: 'engineer',
        action: 'analysis',
        timestamp: new Date(now - 1000 * 60 * 65).toISOString(), // 1 hour 5 minutes ago
        details: 'ran pipeline analysis'
      },
      {
        userId: 3,
        userName: 'Designer User',
        userRole: 'designer',
        action: 'login',
        timestamp: new Date(now - 1000 * 60 * 120).toISOString(), // 2 hours ago
        details: 'logged in'
      },
      {
        userId: 3,
        userName: 'Designer User',
        userRole: 'designer',
        action: 'recommendation',
        timestamp: new Date(now - 1000 * 60 * 125).toISOString(), // 2 hours 5 minutes ago
        details: 'recommended Cast Iron pipe'
      },
      {
        userId: 2,
        userName: 'Engineer User',
        userRole: 'engineer',
        action: 'logout',
        timestamp: new Date(now - 1000 * 60 * 180).toISOString(), // 3 hours ago
        details: 'logged out'
      },
      {
        userId: 1,
        userName: 'Admin User',
        userRole: 'admin',
        action: 'message',
        timestamp: new Date(now - 1000 * 60 * 240).toISOString(), // 4 hours ago
        details: 'sent message to Engineer User'
      },
      {
        userId: 3,
        userName: 'Designer User',
        userRole: 'designer',
        action: 'message',
        timestamp: new Date(now - 1000 * 60 * 300).toISOString(), // 5 hours ago
        details: 'sent message to Admin User'
      },
      {
        userId: 3,
        userName: 'Designer User',
        userRole: 'designer',
        action: 'logout',
        timestamp: new Date(now - 1000 * 60 * 360).toISOString(), // 6 hours ago
        details: 'logged out'
      },
      {
        userId: 1,
        userName: 'Admin User',
        userRole: 'admin',
        action: 'navigation',
        timestamp: new Date(now - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        details: 'accessed Activity Monitor'
      },
    ];
    
    setActivities(sampleActivities);
    localStorage.setItem('userActivities', JSON.stringify(sampleActivities));
  };
  
  // Apply filters to the activities
  const applyFilters = () => {
    let filtered = [...activities];
    
    // Filter by role
    if (filters.role !== 'all') {
      filtered = filtered.filter(activity => activity.userRole === filters.role);
    }
    
    // Filter by action
    if (filters.action !== 'all') {
      filtered = filtered.filter(activity => activity.action === filters.action);
    }
    
    // Filter by time period
    const now = new Date();
    let cutoffDate;
    
    switch (filters.period) {
      case 'today':
        cutoffDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case '7days':
        cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case '30days':
        cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        break;
      case 'all':
      default:
        cutoffDate = new Date(0); // Beginning of time
        break;
    }
    
    filtered = filtered.filter(activity => new Date(activity.timestamp) >= cutoffDate);
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.userName.toLowerCase().includes(term) ||
        activity.action.toLowerCase().includes(term) ||
        (activity.details && activity.details.toLowerCase().includes(term))
      );
    }
    
    setFilteredActivities(filtered);
  };
  
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleClearFilters = () => {
    setFilters({
      role: 'all',
      action: 'all',
      period: '7days'
    });
    setSearchTerm('');
  };
  
  const handleRefresh = () => {
    loadActivities();
  };
  
  const handleClearActivities = () => {
    if (window.confirm('Are you sure you want to clear all activity data?')) {
      localStorage.removeItem('userActivities');
      setActivities([]);
    }
  };
  
  // Format timestamp for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get activity icon based on action type
  const getActivityIcon = (action, role) => {
    switch (action) {
      case 'login':
        return <LoginIcon color="success" />;
      case 'logout':
        return <LogoutIcon color="error" />;
      case 'upload':
        return <UploadIcon color="primary" />;
      case 'analysis':
        return <AssessmentIcon color="info" />;
      case 'message':
        return <MessageIcon color="secondary" />;
      case 'recommendation':
        return <PlumbingIcon color="success" />;
      case 'navigation':
        return <NavigationIcon color="action" />;
      default:
        switch (role) {
          case 'admin':
            return <PersonIcon color="secondary" />;
          case 'engineer':
            return <EngineeringIcon color="info" />;
          case 'designer':
            return <ArchitectureIcon color="success" />;
          default:
            return <PersonIcon />;
        }
    }
  };
  
  // For the activity chart
  const getActivityChartData = () => {
    const actionCounts = {};
    
    filteredActivities.forEach(activity => {
      if (!actionCounts[activity.action]) {
        actionCounts[activity.action] = 0;
      }
      actionCounts[activity.action]++;
    });
    
    return Object.keys(actionCounts).map(action => ({
      name: action.charAt(0).toUpperCase() + action.slice(1),
      value: actionCounts[action]
    }));
  };
  
  // For the user activity chart
  const getUserActivityChartData = () => {
    const userCounts = {};
    
    filteredActivities.forEach(activity => {
      if (!userCounts[activity.userName]) {
        userCounts[activity.userName] = 0;
      }
      userCounts[activity.userName]++;
    });
    
    return Object.keys(userCounts).map(user => ({
      name: user,
      value: userCounts[user]
    }));
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssessmentIcon fontSize="large" color="primary" />
          Activity Monitor
        </Typography>
        
        <Box>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to CSV">
            <IconButton sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear all activities">
            <IconButton color="error" onClick={handleClearActivities}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Filters */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Activities"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="role-filter-label">User Role</InputLabel>
              <Select
                labelId="role-filter-label"
                id="role-filter"
                value={filters.role}
                label="User Role"
                name="role"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="engineer">Engineer</MenuItem>
                <MenuItem value="designer">Designer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="action-filter-label">Activity Type</InputLabel>
              <Select
                labelId="action-filter-label"
                id="action-filter"
                value={filters.action}
                label="Activity Type"
                name="action"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Activities</MenuItem>
                <MenuItem value="login">Login</MenuItem>
                <MenuItem value="logout">Logout</MenuItem>
                <MenuItem value="upload">File Upload</MenuItem>
                <MenuItem value="analysis">Analysis</MenuItem>
                <MenuItem value="message">Message</MenuItem>
                <MenuItem value="recommendation">Recommendation</MenuItem>
                <MenuItem value="navigation">Navigation</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="period-filter-label">Time Period</InputLabel>
              <Select
                labelId="period-filter-label"
                id="period-filter"
                value={filters.period}
                label="Time Period"
                name="period"
                onChange={handleFilterChange}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="30days">Last 30 Days</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Button 
              variant="outlined" 
              startIcon={<FilterIcon />} 
              onClick={handleClearFilters}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Activity Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Chart 
            title="Activity by Type"
            description="Distribution of user activities by type"
            data={getActivityChartData()}
            dataKey="value"
            xAxisKey="name"
            height={300}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Chart 
            title="Activity by User"
            description="Distribution of activities by user"
            data={getUserActivityChartData()}
            dataKey="value"
            xAxisKey="name"
            height={300}
          />
        </Grid>
      </Grid>
      
      {/* Activity List */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Activity Log</span>
            <Chip 
              label={`${filteredActivities.length} activities`} 
              size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}
            />
          </Typography>
        </Box>
        
        <Divider />
        
        {filteredActivities.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No activities found matching your filters
            </Typography>
            <Button 
              variant="text" 
              color="primary" 
              onClick={handleClearFilters}
              sx={{ mt: 1 }}
            >
              Clear Filters
            </Button>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
            {filteredActivities.map((activity, index) => (
              <Box 
                key={index}
                sx={{ 
                  p: 2, 
                  borderBottom: index < filteredActivities.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={1}>
                    <Avatar
                      sx={{ 
                        bgcolor: activity.userRole === 'admin' ? 'secondary.main' :
                                 activity.userRole === 'engineer' ? 'info.main' : 
                                 'success.main'
                      }}
                    >
                      {getActivityIcon(activity.action, activity.userRole)}
                    </Avatar>
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(activity.timestamp)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {activity.userRole === 'admin' && <AdminPanelSettingsIcon fontSize="small" color="secondary" />}
                      {activity.userRole === 'engineer' && <EngineeringIcon fontSize="small" color="info" />}
                      {activity.userRole === 'designer' && <ArchitectureIcon fontSize="small" color="success" />}
                      <span>{activity.userName}</span>
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <Chip 
                      label={activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} 
                      size="small" 
                      color={
                        activity.action === 'login' ? 'success' :
                        activity.action === 'logout' ? 'error' :
                        activity.action === 'upload' ? 'primary' :
                        activity.action === 'analysis' ? 'info' :
                        activity.action === 'message' ? 'secondary' :
                        activity.action === 'recommendation' ? 'success' :
                        'default'
                      }
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={5}>
                    <Typography variant="body2">
                      {activity.details || `Performed ${activity.action} action`}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ActivityMonitor;