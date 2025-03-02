import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import {
  Upload as UploadIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { analyzeUploadedFile } from '../../services/modelService';

const FileUpload = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  
  const { currentUser, logActivity } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const steps = ['Upload File', 'Analyze Data', 'View Results'];
  
  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading || activeStep > 0,
    onDrop: acceptedFiles => {
      handleFileUpload(acceptedFiles[0]);
    }
  });
  
  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      // Simulate file validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        preview: URL.createObjectURL(file)
      });
      
      // Log activity
      logActivity('upload', `Uploaded ${file.name} for analysis`);
      
      // Move to next step
      setActiveStep(1);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload the file. Please try again.');
    } finally {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(100);
    }
  };
  
  // Handle file removal
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setActiveStep(0);
    setAnalysisResult(null);
    setAnalysisError(null);
  };
  
  // Start file analysis
  const handleStartAnalysis = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisError(null);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 200);
    
    try {
      // Call the model service to analyze file
      // In a real app, this would send the file to the server
      // Here we'll just simulate it with a delay
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Get mock results from our service
      const result = await analyzeUploadedFile(uploadedFile.name);
      
      setAnalysisResult(result);
      
      // Log activity
      logActivity('analysis', `Completed analysis of ${uploadedFile.name}`);
      
      // Save analysis record to localStorage
      saveAnalysisRecord(result);
      
      // Move to next step
      setActiveStep(2);
    } catch (error) {
      console.error('Error analyzing file:', error);
      setAnalysisError('Failed to analyze the file. Please verify the file format and try again.');
      
      // Log activity
      logActivity('analysis', `Analysis failed for ${uploadedFile.name}`);
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  };
  
  // Save analysis record to localStorage
  const saveAnalysisRecord = (result) => {
    try {
      // Get existing records or initialize empty array
      const existingRecords = JSON.parse(localStorage.getItem('analysisRecords') || '[]');
      
      // Create new record
      const newRecord = {
        id: `analysis-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: `Pipeline Analysis of ${uploadedFile.name}`,
        type: 'file-upload',
        status: 'completed',
        engineer: {
          id: currentUser.id,
          name: currentUser.name
        },
        results: {
          ...result,
          recommendation: result.metrics?.EA?.Min > 0.8 ? 'Cast Iron' : 
                          result.metrics?.EA?.Min > 0.6 ? 'PVC' : 'Stainless Steel'
        },
        filename: uploadedFile.name
      };
      
      // Add to existing records
      existingRecords.unshift(newRecord);
      
      // Save back to localStorage
      localStorage.setItem('analysisRecords', JSON.stringify(existingRecords));
      
    } catch (error) {
      console.error('Error saving analysis record:', error);
    }
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Navigate to view all results
  const handleViewAllResults = () => {
    navigate('/engineer/results');
  };
  
  // Start a new analysis
  const handleNewAnalysis = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setActiveStep(0);
    setAnalysisResult(null);
    setAnalysisError(null);
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
        <UploadIcon fontSize="large" color="primary" />
        File Upload for Analysis
      </Typography>
      
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Step 1: File Upload */}
          {activeStep === 0 && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upload Excel File
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload an Excel file containing pipeline data for analysis. The file should include columns for parameters such as flow rate, temperature, pressure, etc.
              </Typography>
              
              <Box 
                {...getRootProps()} 
                className={`file-upload-zone ${isDragActive ? 'active' : ''}`}
                sx={{ 
                  border: '2px dashed', 
                  borderColor: isDragActive ? 'primary.main' : 'grey.400',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  mb: 3,
                  bgcolor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <input {...getInputProps()} />
                
                <UploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                
                {isDragActive ? (
                  <Typography variant="body1" color="primary" fontWeight="medium">
                    Drop the file here...
                  </Typography>
                ) : (
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      Drag and drop an Excel file here, or click to select
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supported formats: .xlsx, .xls
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {isUploading && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Uploading... {uploadProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}
              
              {uploadError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <AlertTitle>Upload Error</AlertTitle>
                  {uploadError}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<UploadIcon />}
                  disabled={isUploading}
                  onClick={() => document.querySelector('input[type="file"]').click()}
                >
                  {isUploading ? 'Uploading...' : 'Select File'}
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Step 2: Analyze Data */}
          {activeStep === 1 && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Analyze File Data
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Review the uploaded file details and start the analysis process.
              </Typography>
              
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileIcon color="primary" />
                    File Details
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: '40px' }}>
                        <DescriptionIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Filename" 
                        secondary={uploadedFile?.name} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: '40px' }}>
                        <DescriptionIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Size" 
                        secondary={formatFileSize(uploadedFile?.size)} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              
              {analysisError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <AlertTitle>Analysis Error</AlertTitle>
                  {analysisError}
                </Alert>
              )}
              
              {isAnalyzing && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Analyzing... {analysisProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={analysisProgress} />
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <AlertTitle>Analysis in Progress</AlertTitle>
                    The system is currently analyzing your uploaded file. This may take a few moments.
                  </Alert>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveFile}
                  disabled={isAnalyzing}
                >
                  Remove File
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing || !uploadedFile}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Step 3: View Results */}
          {activeStep === 2 && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ flex: 1 }}>
                  Analysis Results
                </Typography>
                
                <Chip 
                  label="Completed" 
                  color="success" 
                  icon={<CheckIcon />} 
                  variant="outlined" 
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The file has been successfully analyzed. Review the results below.
              </Typography>
              
              <Alert severity="success" sx={{ mb: 3 }}>
                <AlertTitle>Analysis Complete</AlertTitle>
                The analysis of <strong>{uploadedFile?.name}</strong> has been completed successfully.
              </Alert>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Key Metrics
                      </Typography>
                      
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="EA(Max)" 
                            secondary={analysisResult?.metrics?.EA?.Max.toFixed(4)} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="EA(Min)" 
                            secondary={analysisResult?.metrics?.EA?.Min.toFixed(4)} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Accuracy" 
                            secondary={`${analysisResult?.metrics?.accuracy.toFixed(2)}%`} 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Recommended Pipe Type
                      </Typography>
                      
                      <Box sx={{ textAlign: 'center', my: 2 }}>
                        <Chip 
                          label={
                            analysisResult?.metrics?.EA?.Min > 0.8 ? 'Cast Iron' : 
                            analysisResult?.metrics?.EA?.Min > 0.6 ? 'PVC' : 
                            'Stainless Steel'
                          }
                          color="primary"
                          sx={{ fontSize: '1.2rem', py: 3, px: 2 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        Based on the analysis metrics, the system recommends using
                        <strong>
                          {' '}
                          {analysisResult?.metrics?.EA?.Min > 0.8 ? 'Cast Iron' : 
                           analysisResult?.metrics?.EA?.Min > 0.6 ? 'PVC' : 
                           'Stainless Steel'}
                        </strong> pipes for this project.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleNewAnalysis}
                >
                  New Analysis
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleViewAllResults}
                >
                  View All Results
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FileUpload;