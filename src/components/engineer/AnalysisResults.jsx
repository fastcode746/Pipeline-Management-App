import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Button,
  IconButton,
  Chip,
  Divider,
  Table, 
  TableBody, 
  TableCell,
  AlertTitle, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CloudDownload as DownloadIcon,
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  DataObject as DataObjectIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import { getAllAnalysisRecords, deleteAnalysisRecord } from '../../services/modelService';
import Chart from '../common/Chart';

const AnalysisResults = () => {
  const [tabValue, setTabValue] = useState(0);
  const [analyses, setAnalyses] = useState([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    recommendation: 'all'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState(null);
  const [designerComment, setDesignerComment] = useState('');
  
  const { currentUser, logActivity } = useContext(AuthContext);
  const { sendNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  
  // Load analyses on component mount
  useEffect(() => {
    loadAnalyses();
    logActivity('navigation', 'accessed Analysis Results');
  }, []);
  
  // Filter analyses when search term or filters change
  useEffect(() => {
    applyFilters();
  }, [analyses, searchTerm, filters]);
  
  // Load analyses from storage
  const loadAnalyses = () => {
    const records = getAllAnalysisRecords();
    setAnalyses(records);
    setFilteredAnalyses(records);
  };
  
  // Apply filters and search
  const applyFilters = () => {
    let filtered = [...analyses];
    
    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(analysis => analysis.status === filters.status);
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(analysis => analysis.type === filters.type);
    }
    
    // Apply recommendation filter
    if (filters.recommendation !== 'all' && filters.recommendation) {
      filtered = filtered.filter(
        analysis => analysis.results?.recommendation === filters.recommendation
      );
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(analysis => 
        (analysis.title && analysis.title.toLowerCase().includes(term)) ||
        (analysis.filename && analysis.filename.toLowerCase().includes(term)) ||
        (analysis.results?.recommendation && analysis.results.recommendation.toLowerCase().includes(term))
      );
    }
    
    setFilteredAnalyses(filtered);
    setPage(0); // Reset to first page when filters change
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedAnalysis(null);
  };
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      status: 'all',
      type: 'all',
      recommendation: 'all'
    });
  };
  
  // Handle table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Select an analysis for detailed view
  const handleViewAnalysis = (analysis) => {
    setSelectedAnalysis(analysis);
    setTabValue(1); // Switch to details tab
  };
  
  // Handle delete dialog
  const handleDeleteClick = (analysis) => {
    setAnalysisToDelete(analysis);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (analysisToDelete) {
      deleteAnalysisRecord(analysisToDelete.id);
      
      // Log activity
      logActivity('delete', `Deleted analysis ${analysisToDelete.title}`);
      
      // Refresh the list
      loadAnalyses();
      
      // Close dialog and clear selection
      setDeleteDialogOpen(false);
      setAnalysisToDelete(null);
      
      // Clear selected analysis if it was deleted
      if (selectedAnalysis && selectedAnalysis.id === analysisToDelete.id) {
        setSelectedAnalysis(null);
      }
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAnalysisToDelete(null);
  };
  
  // Handle share dialog
  const handleShareClick = (analysis) => {
    setSelectedAnalysis(analysis);
    setShareDialogOpen(true);
  };
  
  const handleShareConfirm = () => {
    if (selectedAnalysis) {
      // Send notification to designer
      sendNotification(
        3, // Designer's ID
        `Engineer shared analysis results: ${selectedAnalysis.title}`,
        'info'
      );
      
      // Log activity
      logActivity('share', `Shared analysis ${selectedAnalysis.title} with Designer`);
      
      // Add comment to analysis
      if (designerComment) {
        const updatedAnalyses = analyses.map(a => 
          a.id === selectedAnalysis.id 
            ? { ...a, engineerComment: designerComment }
            : a
        );
        
        setAnalyses(updatedAnalyses);
        localStorage.setItem('analysisRecords', JSON.stringify(updatedAnalyses));
        
        // Update selected analysis
        setSelectedAnalysis({ ...selectedAnalysis, engineerComment: designerComment });
      }
      
      // Close dialog
      setShareDialogOpen(false);
      setDesignerComment('');
    }
  };
  
  const handleShareCancel = () => {
    setShareDialogOpen(false);
    setDesignerComment('');
  };
  
  // Format timestamp for display
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckIcon color="success" />;
      case 'in-progress':
        return <AccessTimeIcon color="info" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };
  
  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'file-upload':
        return <UploadIcon color="primary" />;
      case 'manual-entry':
        return <DataObjectIcon color="secondary" />;
      default:
        return <AssessmentIcon />;
    }
  };
  
  // Render the analyses list tab
  const renderAnalysesList = () => {
    return (
      <Box>
        {/* Filters */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={handleSearchChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  name="status"
                  value={filters.status}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="type-filter-label">Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  id="type-filter"
                  name="type"
                  value={filters.type}
                  label="Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="file-upload">File Upload</MenuItem>
                  <MenuItem value="manual-entry">Manual Entry</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="recommendation-filter-label">Pipe Type</InputLabel>
                <Select
                  labelId="recommendation-filter-label"
                  id="recommendation-filter"
                  name="recommendation"
                  value={filters.recommendation}
                  label="Pipe Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Cast Iron">Cast Iron</MenuItem>
                  <MenuItem value="PVC">PVC</MenuItem>
                  <MenuItem value="Stainless Steel">Stainless Steel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={12} md={2}>
              <Button 
                variant="outlined" 
                startIcon={<FilterIcon />} 
                onClick={handleResetFilters}
                fullWidth
                size="medium"
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Analyses Table */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Recommendation</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAnalyses.length > 0 ? (
                  filteredAnalyses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((analysis) => (
                      <TableRow 
                        key={analysis.id}
                        hover
                        onClick={() => handleViewAnalysis(analysis)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Tooltip title={analysis.status}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getStatusIcon(analysis.status)}
                              <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                                {analysis.status}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {analysis.title}
                          </Typography>
                          {analysis.type === 'file-upload' && analysis.filename && (
                            <Typography variant="caption" color="text.secondary">
                              File: {analysis.filename}
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Chip 
                            icon={getTypeIcon(analysis.type)} 
                            label={analysis.type === 'file-upload' ? 'File Upload' : 'Manual Entry'} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        
                        <TableCell>{formatDate(analysis.timestamp)}</TableCell>
                        
                        <TableCell>
                          {analysis.status === 'completed' && analysis.results?.recommendation ? (
                            <Chip 
                              label={analysis.results.recommendation} 
                              color="primary" 
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {analysis.status === 'failed' ? 'Failed' : 'Pending'}
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewAnalysis(analysis);
                                }}
                              >
                                <AssessmentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            {analysis.status === 'completed' && (
                              <Tooltip title="Share with Designer">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShareClick(analysis);
                                  }}
                                >
                                  <ShareIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(analysis);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No analysis records found
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/engineer/upload')}
                      >
                        Start New Analysis
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredAnalyses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      </Box>
    );
  };
  
  // Render analysis details tab
  const renderAnalysisDetails = () => {
    if (!selectedAnalysis) {
      return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ my: 4 }}>
            Select an analysis from the list to view details
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setTabValue(0)}
          >
            Go to Analyses List
          </Button>
        </Paper>
      );
    }
    
    return (
      <Box>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {selectedAnalysis.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip 
                  icon={getTypeIcon(selectedAnalysis.type)} 
                  label={selectedAnalysis.type === 'file-upload' ? 'File Upload' : 'Manual Entry'} 
                  size="small" 
                  variant="outlined"
                />
                
                <Chip 
                  icon={getStatusIcon(selectedAnalysis.status)} 
                  label={selectedAnalysis.status} 
                  size="small" 
                  color={
                    selectedAnalysis.status === 'completed' ? 'success' : 
                    selectedAnalysis.status === 'failed' ? 'error' : 'info'
                  }
                  variant="outlined"
                />
                
                {selectedAnalysis.status === 'completed' && selectedAnalysis.results?.recommendation && (
                  <Chip 
                    label={`Recommended: ${selectedAnalysis.results.recommendation}`}
                    color="primary" 
                    size="small"
                  />
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Analyzed on {formatDate(selectedAnalysis.timestamp)} by {selectedAnalysis.engineer?.name || 'Unknown'}
              </Typography>
            </Box>
            
            <Box>
              {selectedAnalysis.status === 'completed' && (
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() => handleShareClick(selectedAnalysis)}
                  sx={{ mr: 1 }}
                >
                  Share
                </Button>
              )}
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteClick(selectedAnalysis)}
              >
                Delete
              </Button>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {selectedAnalysis.type === 'file-upload' && selectedAnalysis.filename && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Analyzed file: <strong>{selectedAnalysis.filename}</strong>
            </Typography>
          )}
          
          {selectedAnalysis.engineerComment && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Engineer's Note</AlertTitle>
              {selectedAnalysis.engineerComment}
            </Alert>
          )}
          
          {selectedAnalysis.status === 'completed' && selectedAnalysis.results && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Analysis Results
              </Typography>
              
              <Grid container spacing={3}>
                {/* Metrics Card */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Pipeline Metrics
                      </Typography>
                      
                      {selectedAnalysis.results.metrics ? (
  <List dense>
    {Object.entries(selectedAnalysis.results.metrics).map(([key, value]) => (
      <ListItem key={key} divider>
        <ListItemText
          primary={key}
          secondary={
            <Typography variant="body2" component="span">
              {typeof value === 'object' ? (
                <>
                  {value.Min !== undefined && `Min: ${Number(value.Min).toFixed(3)} | `}
                  {value.Avg !== undefined && `Avg: ${Number(value.Avg).toFixed(3)} | `}
                  {value.Max !== undefined && `Max: ${Number(value.Max).toFixed(3)}`}
                </>
              ) : (
                typeof value === 'number' ? 
                  Number(value).toFixed(3) : 
                  String(value)
              )}
            </Typography>
          }
        />
      </ListItem>
    ))}
  </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No metrics data available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Parameters Card */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Input Parameters
                      </Typography>
                      
                      {selectedAnalysis.parameters ? (
                        <List dense>
                          {Object.entries(selectedAnalysis.parameters).map(([key, value]) => (
                            <ListItem key={key} divider>
                              <ListItemText
                                primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                secondary={value}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No parameter data available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Recommendation Card */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Material Recommendation
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                          Based on analysis:
                        </Typography>
                        <Chip
                          label={selectedAnalysis.results.recommendation || 'No recommendation'}
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        Recommendation is based on calculated erosion metrics and operational conditions.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {selectedAnalysis.status === 'failed' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Analysis Failed</AlertTitle>
              {selectedAnalysis.error || 'The analysis encountered an error. Please try again with different inputs or contact support.'}
            </Alert>
          )}
        </Paper>
      </Box>
    );
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
        <AssessmentIcon fontSize="large" color="primary" />
        Pipeline Analysis Results
      </Typography>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="All Analyses" />
        <Tab label="Analysis Details" disabled={!selectedAnalysis} />
      </Tabs>
      
      {tabValue === 0 && renderAnalysesList()}
      {tabValue === 1 && renderAnalysisDetails()}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this analysis record? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={handleShareCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Share with Designer</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Share this analysis result with the Designer for material selection and pipeline design.
          </Typography>
          
          <TextField
            multiline
            rows={4}
            placeholder="Add any notes or context for the Designer..."
            value={designerComment}
            onChange={(e) => setDesignerComment(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShareCancel}>Cancel</Button>
          <Button onClick={handleShareConfirm} color="primary" variant="contained">
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnalysisResults;