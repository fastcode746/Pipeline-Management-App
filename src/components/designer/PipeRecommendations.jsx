import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Tabs, 
  Tab, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Card, 
  CardContent, 
  Chip, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormHelperText, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  RadioGroup, 
  Radio, 
  FormControlLabel, 
  Rating, 
  Alert, 
  LinearProgress, 
  InputAdornment,
  Avatar
} from '@mui/material';
import {
  Plumbing as PlumbingIcon,
  Add as AddIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  InsertDriveFile as FileIcon,
  Engineering as EngineeringIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import { getAllAnalysisRecords } from '../../services/modelService';

const PipeRecommendations = () => {
  const [tabValue, setTabValue] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [createMode, setCreateMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sharedAnalyses, setSharedAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [formData, setFormData] = useState({
    recommendationType: '',
    justification: '',
    alternativeOptions: [],
    concerns: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recommendationToDelete, setRecommendationToDelete] = useState(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentUser, logActivity } = useContext(AuthContext);
  const { sendNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Load data when component mounts
  useEffect(() => {
    if (location.state?.createNew) {
      handleCreateNew();
    }
    loadData();
  }, [location]);

  const loadData = async () => {
    logActivity('navigation', 'accessed Pipe Recommendations');
    loadRecommendations();
    loadSharedAnalyses();
  };

  const loadRecommendations = () => {
    try {
      const storedRecommendations = localStorage.getItem('pipeRecommendations');
      if (storedRecommendations) {
        setRecommendations(JSON.parse(storedRecommendations));
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setRecommendations([]);
    }
  };

  const loadSharedAnalyses = () => {
    try {
      const analyses = getAllAnalysisRecords()
        .filter(a => a.status === 'completed' && a.engineerComment);
      setSharedAnalyses(analyses);
    } catch (error) {
      console.error('Error loading shared analyses:', error);
      setSharedAnalyses([]);
    }
  };

  const handleCreateNew = () => {
    setCreateMode(true);
    setEditMode(false);
    setSelectedRecommendation(null);
    setFormData({
      recommendationType: '',
      justification: '',
      alternativeOptions: [],
      concerns: ''
    });
    setErrors({});
    setTabValue(1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDeleteClick = (recommendation) => {
    setRecommendationToDelete(recommendation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (recommendationToDelete) {
      const updatedRecommendations = recommendations.filter(
        rec => rec.id !== recommendationToDelete.id
      );
      setRecommendations(updatedRecommendations);
      localStorage.setItem('pipeRecommendations', JSON.stringify(updatedRecommendations));
      
      setDeleteDialogOpen(false);
      setRecommendationToDelete(null);
      setSelectedRecommendation(null);
      setTabValue(0);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setSubmitDialogOpen(true);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedAnalysis) {
      newErrors.analysis = 'Please select an analysis';
    }
    if (!formData.recommendationType) {
      newErrors.recommendationType = 'Please select a recommendation type';
    }
    if (!formData.justification) {
      newErrors.justification = 'Please provide justification';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderRecommendationsList = () => {
    const filteredRecommendations = recommendations.filter(rec => {
      if (filter !== 'all' && rec.status !== filter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return rec.title.toLowerCase().includes(term) ||
               rec.analysis.title.toLowerCase().includes(term) ||
               rec.recommendationType.toLowerCase().includes(term);
      }
      return true;
    });

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search recommendations..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select
              value={filter}
              onChange={handleFilterChange}
              label="Filter Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="submitted">Submitted</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            New Recommendation
          </Button>
        </Box>

        <Grid container spacing={2}>
          {filteredRecommendations.map((recommendation) => (
            <Grid item xs={12} sm={6} md={4} key={recommendation.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">{recommendation.title}</Typography>
                    <Chip 
                      label={recommendation.status} 
                      color={recommendation.status === 'submitted' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Based on: {recommendation.analysis.title}
                  </Typography>
                  
                  <Typography variant="body1" color="primary" gutterBottom>
                    Recommended: {recommendation.recommendationType}
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton 
                      size="small"
                      onClick={() => setSelectedRecommendation(recommendation)}
                    >
                      <Tooltip title="View Details">
                        <PlumbingIcon fontSize="small" />
                      </Tooltip>
                    </IconButton>
                    
                    {recommendation.status !== 'submitted' && (
                      <IconButton 
                        size="small"
                        onClick={() => {
                          setSelectedRecommendation(recommendation);
                          setEditMode(true);
                          setTabValue(1);
                        }}
                      >
                        <Tooltip title="Edit">
                          <EditIcon fontSize="small" />
                        </Tooltip>
                      </IconButton>
                    )}
                    
                    <IconButton 
                      size="small"
                      onClick={() => handleDeleteClick(recommendation)}
                    >
                      <Tooltip title="Delete">
                        <DeleteIcon fontSize="small" />
                      </Tooltip>
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderRecommendationForm = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          {createMode ? "Create New Recommendation" : "Edit Recommendation"}
        </Typography>
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Select Analysis
            </Typography>
            
            <Grid container spacing={2}>
              {sharedAnalyses.map((analysis) => (
                <Grid item xs={12} sm={6} md={4} key={analysis.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: selectedAnalysis?.id === analysis.id ? 'action.selected' : 'inherit'
                    }}
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <CardContent>
                      <Typography variant="subtitle2">{analysis.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        By: {analysis.engineer.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {errors.analysis && (
              <FormHelperText error>{errors.analysis}</FormHelperText>
            )}
          </CardContent>
        </Card>
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Recommendation Details
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Pipe Type Recommendation</InputLabel>
              <Select
                value={formData.recommendationType}
                onChange={(e) => setFormData({ ...formData, recommendationType: e.target.value })}
                label="Pipe Type Recommendation"
                error={Boolean(errors.recommendationType)}
              >
                <MenuItem value="Cast Iron">Cast Iron</MenuItem>
                <MenuItem value="PVC">PVC</MenuItem>
                <MenuItem value="Stainless Steel">Stainless Steel</MenuItem>
              </Select>
              {errors.recommendationType && (
                <FormHelperText error>{errors.recommendationType}</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Justification"
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              error={Boolean(errors.justification)}
              helperText={errors.justification}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Additional Concerns (Optional)"
              value={formData.concerns}
              onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
            />
          </CardContent>
        </Card>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined"
            onClick={() => {
              setCreateMode(false);
              setEditMode(false);
              setTabValue(0);
            }}
          >
            Cancel
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<SaveIcon />}
          >
            Save Recommendation
          </Button>
        </Box>
      </Box>
    );
  };

  const renderRecommendationDetails = () => {
    if (!selectedRecommendation) return null;

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">{selectedRecommendation.title}</Typography>
          <Chip 
            label={selectedRecommendation.status} 
            color={selectedRecommendation.status === 'submitted' ? 'success' : 'default'} 
          />
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Analysis Information
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Analysis Title"
                      secondary={selectedRecommendation.analysis.title}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Engineer"
                      secondary={selectedRecommendation.analysis.engineer.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Date"
                      secondary={new Date(selectedRecommendation.timestamp).toLocaleString()}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Recommendation
                </Typography>
                
                <Typography variant="h6" color="primary" gutterBottom>
                  {selectedRecommendation.recommendationType}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  Justification:
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedRecommendation.justification}
                </Typography>
                
                {selectedRecommendation.concerns && (
                  <>
                    <Typography variant="body1" gutterBottom>
                      Additional Concerns:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedRecommendation.concerns}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {selectedRecommendation.status !== 'submitted' && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => {
                  setEditMode(true);
                  setTabValue(1);
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => setSubmitDialogOpen(true)}
              >
                Submit Recommendation
              </Button>
            </>
          )}
        </Box>
      </Box>
    );
  };

  const renderDialogs = () => {
    return (
      <>
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Recommendation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this recommendation? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Submit Dialog */}
        <Dialog
          open={submitDialogOpen}
          onClose={() => setSubmitDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Submit Recommendation</DialogTitle>
          <DialogContent>
            <Typography paragraph>
              You are about to submit your recommendation. Once submitted:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="• The recommendation cannot be edited anymore" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Engineers will be notified of your submission" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• The recommendation will be marked as final" />
              </ListItem>
            </List>
            {isSubmitting && (
              <LinearProgress sx={{ mt: 2 }} />
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setSubmitDialogOpen(false)} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={<SendIcon />}
            >
              Submit Recommendation
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  // Main return
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <PlumbingIcon fontSize="large" color="primary" />
        Pipe Recommendations
      </Typography>
      
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Recommendations List" icon={<PlumbingIcon />} iconPosition="start" />
          <Tab 
            label={createMode ? "Create Recommendation" : "Edit Recommendation"} 
            icon={createMode ? <AddIcon /> : <EditIcon />} 
            iconPosition="start" 
            disabled={!createMode && !editMode && !selectedRecommendation}
          />
          <Tab 
            label="Recommendation Details" 
            icon={<PlumbingIcon />} 
            iconPosition="start" 
            disabled={!selectedRecommendation}
          />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && renderRecommendationsList()}
          {tabValue === 1 && renderRecommendationForm()}
          {tabValue === 2 && renderRecommendationDetails()}
        </Box>
      </Paper>
      
      {renderDialogs()}
    </Box>
  );
};

export default PipeRecommendations;