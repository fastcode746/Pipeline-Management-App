import { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardActionArea, 
  Icon,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  DataObject as DataObjectIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationIcon,
  BarChart as BarChartIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  PendingActions as PendingIcon
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import Chart from '../common/Chart';

const EngineerDashboard = () => {
  const { currentUser, logActivity } = useContext(AuthContext);
  const [analysisCount, setAnalysisCount] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    failed: 0
  });
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    loadAnalysisData();
    logActivity('navigation', 'accessed Engineer Dashboard');
  }, []);

  // Load analysis data from localStorage
  const loadAnalysisData = () => {
    try {
      // Get analysis records from localStorage, or create empty array if none exists
      const analyses = JSON.parse(localStorage.getItem('analysisRecords') || '[]');
      
      // Create some sample data if none exists
      if (analyses.length === 0) {
        const sampleAnalyses = createSampleAnalyses();
        localStorage.setItem('analysisRecords', JSON.stringify(sampleAnalyses));
        
        setRecentAnalyses(sampleAnalyses);
        setAnalysisCount({
          total: sampleAnalyses.length,
          completed: sampleAnalyses.filter(a => a.status === 'completed').length,
          inProgress: sampleAnalyses.filter(a => a.status === 'in-progress').length,
          failed: sampleAnalyses.filter(a => a.status === 'failed').length
        });
      } else {
        // Use existing data
        setRecentAnalyses(analyses.slice(0, 5));
        setAnalysisCount({
          total: analyses.length,
          completed: analyses.filter(a => a.status === 'completed').length,
          inProgress: analyses.filter(a => a.status === 'in-progress').length,
          failed: analyses.filter(a => a.status === 'failed').length
        });
      }
    } catch (error) {
      console.error('Error loading analysis data:', error);
      
      // Create sample data in case of error
      const sampleAnalyses = createSampleAnalyses();
      setRecentAnalyses(sampleAnalyses);
      setAnalysisCount({
        total: sampleAnalyses.length,
        completed: sampleAnalyses.filter(a => a.status === 'completed').length,
        inProgress: sampleAnalyses.filter(a => a.status === 'in-progress').length,
        failed: sampleAnalyses.filter(a => a.status === 'failed').length
      });
    }
  };

  // Create sample analyses for demonstration purposes
  const createSampleAnalyses = () => {
    const now = new Date();
    return [
      {
        id: 'analysis-001',
        timestamp: new Date(now - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        title: 'Pipeline Pressure Analysis',
        type: 'file-upload',
        status: 'completed',
        engineer: {
          id: currentUser.id,
          name: currentUser.name
        },
        results: {
          pressure_drop: 12.5,
          flow_rate: 450,
          temperature: 75.2,
          recommendation: 'Cast Iron'
        },
        filename: 'training.xlsx'
      },
      
      
    ];
  };

  // Navigate to different sections
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Format timestamp for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get status icon component
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in-progress':
        return <AccessTimeIcon color="info" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return <PendingIcon color="action" />;
    }
  };

  // Get chart data from analysis counts
  const analysisStatusData = [
    { name: 'Completed', value: analysisCount.completed },
    { name: 'In Progress', value: analysisCount.inProgress },
    { name: 'Failed', value: analysisCount.failed }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon fontSize="large" color="primary" />
          Engineer Dashboard
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={() => handleNavigation('/engineer/upload')}
        >
          New Analysis
        </Button>
      </Box>

      {/* Quick Action Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} className="dashboard-card">
            <CardActionArea onClick={() => handleNavigation('/engineer/upload')}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <UploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" component="div" gutterBottom>
                  Upload File
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyze pipeline data from Excel file
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} className="dashboard-card">
            <CardActionArea onClick={() => handleNavigation('/engineer/manual-entry')}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <DataObjectIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" component="div" gutterBottom>
                  Manual Data Entry
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter pipeline parameters manually
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} className="dashboard-card">
            <CardActionArea onClick={() => handleNavigation('/engineer/results')}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <AssessmentIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" component="div" gutterBottom>
                  View Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access all analysis results
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Analysis Statistics & Recent Analyses */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChartIcon color="primary" />
                  Analysis Statistics
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="bold">
                        {analysisCount.total}
                      </Typography>
                      <Typography variant="body2">
                        Total Analyses
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: 'white', borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="bold">
                        {analysisCount.completed}
                      </Typography>
                      <Typography variant="body2">
                        Completed
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: 'white', borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="bold">
                        {analysisCount.inProgress}
                      </Typography>
                      <Typography variant="body2">
                        In Progress
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'error.main', color: 'white', borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="bold">
                        {analysisCount.failed}
                      </Typography>
                      <Typography variant="body2">
                        Failed
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Chart 
                title="Analysis Status"
                description="Distribution of analysis results by status"
                data={analysisStatusData}
                dataKey="value"
                xAxisKey="name"
                height={250}
              />
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">
                Recent Analyses
              </Typography>
            </Box>
            
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {recentAnalyses.length > 0 ? (
                recentAnalyses.map((analysis, index) => (
                  <Box key={analysis.id}>
                    <ListItem
                      sx={{ 
                        px: 3, 
                        py: 2,
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
                      }}
                      secondaryAction={
                        <Chip 
                          label={analysis.status} 
                          color={
                            analysis.status === 'completed' ? 'success' :
                            analysis.status === 'in-progress' ? 'info' : 'error'
                          }
                          size="small"
                        />
                      }
                    >
                      <ListItemIcon>
                        {getStatusIcon(analysis.status)}
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={analysis.title}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block" color="text.secondary">
                              {formatDate(analysis.timestamp)}
                            </Typography>
                            <Typography variant="body2">
                              {analysis.type === 'file-upload' 
                                ? `File: ${analysis.filename}` 
                                : 'Manual data entry'}
                            </Typography>
                            
                            {analysis.status === 'completed' && analysis.results && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="success.main">
                                  Recommended: {analysis.results.recommendation}
                                </Typography>
                              </Box>
                            )}
                            
                            {analysis.status === 'failed' && analysis.error && (
                              <Typography variant="body2" color="error">
                                Error: {analysis.error}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentAnalyses.length - 1 && <Divider />}
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No analyses found
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => handleNavigation('/engineer/upload')}
                  >
                    Start New Analysis
                  </Button>
                </Box>
              )}
            </List>
            
            <Divider />
            
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="text" 
                color="primary"
                onClick={() => handleNavigation('/engineer/results')}
              >
                View All Analyses
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EngineerDashboard;