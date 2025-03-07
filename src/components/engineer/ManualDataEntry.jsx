import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
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
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  DataObject as DataObjectIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { analyzeManualData } from '../../services/modelService';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const ManualDataEntry = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    gasFlowRate: '',
    waterFlowRate: '',
    oilFlowRate: '',
    pipelineLength: '',
    pipelineDiameter: '',
    pressure: '',
    temperature: '',
    viscosity: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  
  const { currentUser, logActivity } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const steps = ['Enter Data', 'Analyze Data', 'View Results'];
  
  // Field definitions with validation rules and helper text
  const fields = [
    {
      name: 'gasFlowRate',
      label: 'Gas Flow Rate (SCF/D)',
      type: 'number',
      required: true,
      min: 0,
      max: 10000,
      helperText: 'Enter gas flow rate in standard cubic feet per day',
      validate: (value) => (value >= 0 && value <= 10000) || 'Must be between 0 and 10,000'
    },
    {
      name: 'waterFlowRate',
      label: 'Water Flow Rate (STB/D)',
      type: 'number',
      required: true,
      min: 0,
      max: 5000,
      helperText: 'Enter water flow rate in stock tank barrels per day',
      validate: (value) => (value >= 0 && value <= 5000) || 'Must be between 0 and 5,000'
    },
    {
      name: 'oilFlowRate',
      label: 'Oil Flow Rate (STB/D)',
      type: 'number',
      required: true,
      min: 0,
      max: 5000,
      helperText: 'Enter oil flow rate in stock tank barrels per day',
      validate: (value) => (value >= 0 && value <= 5000) || 'Must be between 0 and 5,000'
    },
    {
      name: 'pipelineLength',
      label: 'Pipeline Length (ft)',
      type: 'number',
      required: true,
      min: 100,
      max: 50000,
      helperText: 'Enter pipeline length in feet',
      validate: (value) => (value >= 100 && value <= 50000) || 'Must be between 100 and 50,000'
    },
    {
      name: 'pipelineDiameter',
      label: 'Pipeline Diameter (in)',
      type: 'number',
      required: true,
      min: 1,
      max: 60,
      helperText: 'Enter pipeline diameter in inches',
      validate: (value) => (value >= 1 && value <= 60) || 'Must be between 1 and 60'
    },
    {
      name: 'pressure',
      label: 'Pressure (psi)',
      type: 'number',
      required: true,
      min: 0,
      max: 10000,
      helperText: 'Enter pressure in pounds per square inch',
      validate: (value) => (value >= 0 && value <= 10000) || 'Must be between 0 and 10,000'
    },
    {
      name: 'temperature',
      label: 'Temperature (°F)',
      type: 'number',
      required: true,
      min: 0,
      max: 300,
      helperText: 'Enter temperature in Fahrenheit',
      validate: (value) => (value >= 0 && value <= 300) || 'Must be between 0 and 300'
    },
    {
      name: 'viscosity',
      label: 'Viscosity (cP)',
      type: 'number',
      required: true,
      min: 0.1,
      max: 1000,
      helperText: 'Enter viscosity in centipoise',
      validate: (value) => (value >= 0.1 && value <= 1000) || 'Must be between 0.1 and 1,000'
    }
  ];
  
  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    fields.forEach(field => {
      const value = formData[field.name];
      
      // Check required fields
      if (field.required && !value) {
        errors[field.name] = 'This field is required';
        isValid = false;
        return;
      }
      
      // Skip empty optional fields
      if (!value && !field.required) return;
      
      // Validate field value
      if (field.validate) {
        const validationResult = field.validate(Number(value));
        if (validationResult !== true) {
          errors[field.name] = validationResult;
          isValid = false;
        }
      }
    });
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      // Move to analysis step
      setActiveStep(1);
    }
  };
  
  // Start data analysis
  const handleStartAnalysis = async () => {
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
      // Call the model service to analyze data
      // In a real app, this would send the data to the server
      // Here we'll just simulate it with a delay
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Get mock results from our service
      const result = await analyzeManualData(formData);
      
      setAnalysisResult(result);
      
      // Log activity
      logActivity('analysis', 'Completed manual data analysis');
      
      // Save analysis record to localStorage
      saveAnalysisRecord(result);
      
      // Move to next step
      setActiveStep(2);
    } catch (error) {
      console.error('Error analyzing data:', error);
      setAnalysisError('Failed to analyze the data. Please check your inputs and try again.');
      
      // Log activity
      logActivity('analysis', 'Manual data analysis failed');
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  };
  
  // Reset form
  const handleReset = () => {
    setFormData({
      gasFlowRate: '',
      waterFlowRate: '',
      oilFlowRate: '',
      pipelineLength: '',
      pipelineDiameter: '',
      pressure: '',
      temperature: '',
      viscosity: ''
    });
    setFormErrors({});
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
        title: 'Pipeline Manual Data Analysis',
        type: 'manual-entry',
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
        parameters: { ...formData }
      };
      
      // Add to existing records
      existingRecords.unshift(newRecord);
      
      // Save back to localStorage
      localStorage.setItem('analysisRecords', JSON.stringify(existingRecords));
      
    } catch (error) {
      console.error('Error saving analysis record:', error);
    }
  };
  
  // Navigate to view all results
  const handleViewAllResults = () => {
    navigate('/engineer/results');
  };
  
  // Start a new analysis
  const handleNewAnalysis = () => {
    setActiveStep(0);
    handleReset();
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  // Prepare data for the chart
  const chartData = {
    labels: ["EA(Max)", "EA(Min)", "Accuracy"],
    datasets: [
      {
        label: "Analysis Metrics",
        data: [
          analysisResult?.metrics?.EA?.Max || 0,
          analysisResult?.metrics?.EA?.Min || 0,
          analysisResult?.metrics?.accuracy || 0
        ],
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
        <DataObjectIcon fontSize="large" color="primary" />
        Manual Data Entry for Analysis
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
          {/* Step 1: Data Entry Form */}
          {activeStep === 0 && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Enter Pipeline Parameters
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter the pipeline parameters below for analysis. All fields are required for accurate results.
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {fields.map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field.name}>
                      <TextField
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        fullWidth
                        required={field.required}
                        error={Boolean(formErrors[field.name])}
                        helperText={formErrors[field.name] || field.helperText}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title={field.helperText}>
                              <IconButton size="small" edge="end">
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ),
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleReset}
                    startIcon={<RefreshIcon />}
                  >
                    Reset
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    startIcon={<CheckIcon />}
                  >
                    Analyze Data
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}
          
          {/* Step 2: Analyze Data */}
          {activeStep === 1 && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Analyzing Pipeline Data
              </Typography>
              
              <Box sx={{ my: 4, textAlign: 'center' }}>
                {isAnalyzing ? (
                  <>
                    <CircularProgress size={60} thickness={5} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Processing your data...
                    </Typography>
                    <Box sx={{ width: '100%', mt: 3 }}>
                      <LinearProgress variant="determinate" value={analysisProgress} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {analysisProgress}% complete
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Ready to analyze your pipeline data. Click the button below to start the analysis.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleStartAnalysis}
                      disabled={isAnalyzing}
                    >
                      Start Analysis
                    </Button>
                  </>
                )}
              </Box>
              
              {analysisError && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  <AlertTitle>Analysis Failed</AlertTitle>
                  {analysisError}
                </Alert>
              )}
            </Paper>
          )}
          
          {/* Step 3: View Results */}
          {activeStep === 2 && analysisResult && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Analysis Results
              </Typography>
              
              <Alert severity="success" sx={{ mb: 3 }}>
                <AlertTitle>Analysis Complete</AlertTitle>
                The pipeline analysis has been completed successfully.
              </Alert>
              
              <Divider sx={{ my: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Pipeline Metrics
                      </Typography>
                      
                      <List dense>
                        {analysisResult.metrics && Object.entries(analysisResult.metrics).map(([key, value]) => (
                          <ListItem key={key}>
                            <ListItemText
                              primary={key}
                              secondary={
                                value && value.Min !== undefined && value.Avg !== undefined && value.Max !== undefined ? (
                                  <Typography variant="body2" component="span">
                                    Min: {value.Min.toFixed(3)} | 
                                    Avg: {value.Avg.toFixed(3)} | 
                                    Max: {value.Max.toFixed(3)}
                                  </Typography>
                                ) : (
                                  'No data available'
                                )
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Material Recommendation
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                          Based on analysis:
                        </Typography>
                        <Chip
                          label={
                            analysisResult.metrics?.EA?.Min > 0.8 ? 'Cast Iron' : 
                            analysisResult.metrics?.EA?.Min > 0.6 ? 'PVC' : 'Stainless Steel'
                          }
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

              {/* Chart for Analysis Results */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Analysis Metrics Graph
                      </Typography>
                      <Line data={chartData} options={chartOptions} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleNewAnalysis}
                  startIcon={<RefreshIcon />}
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

export default ManualDataEntry;