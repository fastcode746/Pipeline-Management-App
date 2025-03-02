import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardActionArea, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Button,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Plumbing as PlumbingIcon,
  Notifications as NotificationIcon,
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
  Share as ShareIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import Chart from '../common/Chart';

const DesignerDashboard = () => {
  const { currentUser, logActivity } = useContext(AuthContext);
  const { notifications, markAllAsRead } = useContext(NotificationContext);
  const [pendingRecommendations, setPendingRecommendations] = useState([]);
  const [completedRecommendations, setCompletedRecommendations] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    logActivity('navigation', 'accessed Designer Dashboard');
    loadRecommendations();
    loadRecentAnalyses();
  }, []);

  // Load recommendations data
  const loadRecommendations = () => {
    try {
      // Get existing records
      const recommendations = JSON.parse(localStorage.getItem('pipeRecommendations') || '[]');
      
      // Split into pending and completed
      const pending = recommendations.filter(rec => !rec.isSubmitted);
      const completed = recommendations.filter(rec => rec.isSubmitted);
      
      setPendingRecommendations(pending);
      setCompletedRecommendations(completed);
      
      // If no recommendations exist, create samples
      if (recommendations.length === 0) {
        createSampleRecommendations();
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      createSampleRecommendations();
    }
  };

  // Create sample recommendations for demo
  const createSampleRecommendations = () => {
    // Get all analyses shared with designer
    const analyses = JSON.parse(localStorage.getItem('analysisRecords') || '[]')
      .filter(a => a.status === 'completed' && a.engineerComment);
    
    if (analyses.length === 0) return;
    
    // Create recommendations for analyses
    const sampleRecommendations = analyses.map((analysis, index) => ({
      id: `recommendation-${Date.now()}-${index}`,
      analysisId: analysis.id,
      timestamp: new Date().toISOString(),
      title: `Recommendation for ${analysis.title}`,
      analysis: {
        title: analysis.title,
        timestamp: analysis.timestamp,
        engineer: analysis.engineer,
        results: analysis.results
      },
      designer: {
        id: currentUser.id,
        name: currentUser.name
      },
      recommendation: analysis.results?.recommendation || 'PVC',
      justification: '',
      alternativeOptions: [],
      isSubmitted: index % 2 === 0, // Randomly mark some as submitted
      submittedAt: index % 2 === 0 ? new Date(Date.now() - 1000 * 60 * 60 * (index + 1)).toISOString() : null
    }));
    
    // Save to localStorage
    localStorage.setItem('pipeRecommendations', JSON.stringify(sampleRecommendations));
    
    // Update state
    setPendingRecommendations(sampleRecommendations.filter(rec => !rec.isSubmitted));
    setCompletedRecommendations(sampleRecommendations.filter(rec => rec.isSubmitted));
  };

  // Load recent analyses
  const loadRecentAnalyses = () => {
    try {
      // Get analyses shared with designer (has engineerComment)
      const analyses = JSON.parse(localStorage.getItem('analysisRecords') || '[]')
        .filter(a => a.status === 'completed' && a.engineerComment)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
      
      setRecentAnalyses(analyses);
    } catch (error) {
      console.error('Error loading analyses:', error);
      setRecentAnalyses([]);
    }
  };

  // Navigate to recommendations page
  const handleNavigateToRecommendations = () => {
    navigate('/designer/recommendations');
  };

  // Navigate to new recommendation form
  const handleCreateNewRecommendation = () => {
    navigate('/designer/recommendations', { state: { createNew: true } });
  };

  // Format timestamp for display
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

  // Get recommendation chart data
  const getRecommendationChartData = () => {
    const allRecommendations = [...pendingRecommendations, ...completedRecommendations];
    const counts = {};
    
    allRecommendations.forEach(rec => {
      if (!counts[rec.recommendation]) {
        counts[rec.recommendation] = 0;
      }
      counts[rec.recommendation]++;
    });
    
    return Object.keys(counts).map(type => ({
      name: type,
      value: counts[type]
    }));
  };

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  // Recent designer notifications
  const designerNotifications = notifications
    .filter(n => n.sender?.role === 'engineer')
    .slice(0, 3);

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon fontSize="large" color="primary" />
          Designer Dashboard
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlumbingIcon />}
          onClick={handleCreateNewRecommendation}
        >
          New Recommendation
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PlumbingIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Total
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="primary">
                {pendingRecommendations.length + completedRecommendations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total pipe recommendations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Completed
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {completedRecommendations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Submitted recommendations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AccessTimeIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Pending
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                {pendingRecommendations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Pending recommendations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <ShareIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  New
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="info.main">
                {recentAnalyses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Recent shared analyses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card elevation={2} className="dashboard-card">
            <CardActionArea onClick={handleNavigateToRecommendations}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <PlumbingIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" component="div" gutterBottom>
                  Pipe Recommendations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage all pipe recommendations
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Card elevation={2} className="dashboard-card">
            <CardActionArea onClick={handleCreateNewRecommendation}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <FlagIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" component="div" gutterBottom>
                  Create New Recommendation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a new pipe recommendation
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Content Area */}
      <Grid container spacing={3}>
        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 0, borderRadius: 2, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationIcon />
                Recent Notifications
              </Typography>
              
              <Button 
                size="small" 
                variant="outlined" 
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                onClick={handleMarkAllRead}
              >
                Mark All Read
              </Button>
            </Box>
            
            <Box sx={{ p: 0, flexGrow: 1, overflow: 'auto' }}>
              {designerNotifications.length > 0 ? (
                <List disablePadding>
                  {designerNotifications.map((notification) => (
                    <ListItem 
                      key={notification.id}
                      sx={{ 
                        px: 3, 
                        py: 2, 
                        borderBottom: '1px solid', 
                        borderColor: 'divider',
                        bgcolor: notification.read ? 'transparent' : 'rgba(66, 165, 245, 0.08)'
                      }}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'info.main' }}>
                          {notification.sender?.name.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.message}
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              From: {notification.sender?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(notification.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No new notifications
                  </Typography>
                </Box>
              )}
            </Box>
            
            {designerNotifications.length > 0 && (
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="text" 
                  color="primary"
                  size="small"
                >
                  View All Notifications
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Recent Analyses */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 0, borderRadius: 2, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShareIcon />
                Recent Shared Analyses
              </Typography>
            </Box>
            
            <Box sx={{ p: 0, flexGrow: 1, overflow: 'auto' }}>
              {recentAnalyses.length > 0 ? (
                <List disablePadding>
                  {recentAnalyses.map((analysis) => (
                    <ListItem 
                      key={analysis.id}
                      sx={{ 
                        px: 3, 
                        py: 2, 
                        borderBottom: '1px solid', 
                        borderColor: 'divider'
                      }}
                      button
                      onClick={handleCreateNewRecommendation}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1">{analysis.title}</Typography>
                            <Chip 
                              label={analysis.results?.recommendation || 'Unknown'} 
                              color="primary" 
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              By: {analysis.engineer?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(analysis.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No analyses shared with you yet
                  </Typography>
                </Box>
              )}
            </Box>
            
            {recentAnalyses.length > 0 && (
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  fullWidth
                  onClick={handleCreateNewRecommendation}
                >
                  Create New Recommendation
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Chart */}
        <Grid item xs={12}>
          <Chart 
            title="Pipe Type Distribution"
            description="Distribution of recommended pipe types"
            data={getRecommendationChartData()}
            dataKey="value"
            xAxisKey="name"
            height={300}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DesignerDashboard;