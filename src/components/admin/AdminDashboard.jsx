import { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Engineering as EngineeringIcon,
  Architecture as ArchitectureIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Message as MessageIcon,
  Notifications as NotificationIcon,
  Timeline as TimelineIcon,
  MoreVert as MoreVertIcon,
  Upload as UploadIcon,
  Plumbing as PlumbingIcon
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import Chart from '../common/Chart';
import sendEmail from '../../services/emailService'; // Import the sendEmail function

const AdminDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { notifications, sendNotification } = useContext(NotificationContext);
  const [activities, setActivities] = useState([]);
  const [userStats, setUserStats] = useState({
    engineers: { count: 0, active: 0 },
    designers: { count: 0, active: 0 },
    totalUsers: 0
  });
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadActivities();
    loadUserStats();
    loadRecentAnalyses();
  }, []);

  // Load user activities from localStorage
  const loadActivities = () => {
    try {
      const storedActivities = localStorage.getItem('userActivities');
      if (storedActivities) {
        const parsedActivities = JSON.parse(storedActivities);
        // Sort by timestamp (most recent first)
        const sortedActivities = parsedActivities.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setActivities(sortedActivities.slice(0, 7)); // Get last 7 activities
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  // Mock user stats (in a real app, this would come from an API)
  const loadUserStats = () => {
    // For demo purposes, create some mock data
    setUserStats({
      engineers: { count: 1, active: 1 },
      designers: { count: 1, active: 1 },
      totalUsers: 2// Including admin
    });
  };

  // Mock recent analyses (in a real app, this would come from an API)
  const loadRecentAnalyses = () => {
    // Generate some mock analysis data
    const mockAnalyses = [
     
    ];
    
    setRecentAnalyses(mockAnalyses);
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

  // Activity data for chart
  const activityData = [
    { name: 'Login', value: activities.filter(a => a.action === 'login').length },
    { name: 'Analysis', value: activities.filter(a => a.action === 'analysis').length || 2 },
    { name: 'Upload', value: activities.filter(a => a.action === 'upload').length || 1 },
    { name: 'Messages', value: activities.filter(a => a.action === 'message').length || 3 },
    { name: 'Recommendations', value: activities.filter(a => a.action === 'recommendation').length || 1 },
  ];

  // Function to send email using EmailJS
  // Enter email here
  const handleSendEmail = () => {
    sendEmail('21005@email.muscatcollege.edu.om', 'Admin Notification', 'This is a message to Developer.');
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon fontSize="large" color="primary" />
          Admin Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<NotificationIcon />}
          onClick={() => sendNotification(
            2, // Engineer's ID
            'Please check new pipeline data',
            'info'
          )}
        >
          Send Alert
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<MessageIcon />}
          onClick={handleSendEmail}
        >
          Send Email
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Users
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="primary">
                {userStats.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total registered users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <EngineeringIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Engineers
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="info.main">
                {userStats.engineers.count}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {userStats.engineers.active} active recently
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <ArchitectureIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Designers
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {userStats.designers.count}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {userStats.designers.active} active recently
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Analyses
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="secondary.main">
                {recentAnalyses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Recent pipeline analyses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Activity Chart */}
        <Grid item xs={12} md={8}>
          <Chart 
            title="User Activity Overview"
            description="Breakdown of recent user activities in the system"
            data={activityData}
            dataKey="value"
            xAxisKey="name"
            height={300}
          />
        </Grid>
        
        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              height: '100%',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimelineIcon color="primary" />
              Recent Activities
            </Typography>
            
            <List sx={{ width: '100%', flexGrow: 1, overflow: 'auto' }}>
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <Box key={index}>
                    <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {activity.action === 'login' && <PersonIcon color="primary" />}
                        {activity.action === 'logout' && <PersonIcon color="error" />}
                        {activity.action === 'analysis' && <AssessmentIcon color="info" />}
                        {activity.action === 'upload' && <UploadIcon color="secondary" />}
                        {activity.action === 'navigation' && <TimelineIcon color="action" />}
                        {activity.action === 'message' && <MessageIcon color="info" />}
                        {activity.action === 'recommendation' && <PlumbingIcon color="success" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'medium' }}
                          >
                            {activity.userName} {activity.details || activity.action}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatTimeAgo(activity.timestamp)}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No recent activities found
                </Typography>
              )}
            </List>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="text" color="primary" size="small">
                View All Activities
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Analyses */}
        <Grid item xs={12}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssessmentIcon color="primary" />
              Recent Pipeline Analyses
            </Typography>
            
            <Box sx={{ overflowX: 'auto' }}>
              {recentAnalyses.length > 0 ? (
                <Box sx={{ minWidth: 650 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr 100px', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Date</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>User</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Details</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Result</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Actions</Typography>
                  </Box>
                  
                  {recentAnalyses.map((analysis, index) => (
                    <Box 
                      key={analysis.id} 
                      sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 2fr 1fr 100px', 
                        p: 2,
                        borderBottom: index < recentAnalyses.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        {formatTimeAgo(analysis.timestamp)}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {analysis.user.role === 'engineer' && <EngineeringIcon fontSize="small" color="info" />}
                        {analysis.user.role === 'designer' && <ArchitectureIcon fontSize="small" color="success" />}
                        {analysis.user.name}
                      </Typography>
                      
                      <Typography variant="body2">
                        {analysis.details}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: analysis.result === 'Success' ? 'success.main' : 
                                 analysis.result === 'Failed' ? 'error.main' : 
                                 'warning.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {analysis.result}
                      </Typography>
                      
                      <Box>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No recent analyses found
                </Typography>
              )}
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="primary">
                View All Analyses
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;