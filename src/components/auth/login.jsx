import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Engineering,
  Architecture,
  AdminPanelSettings
} from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, currentUser } = useContext(AuthContext);
  const { createSampleNotifications } = useContext(NotificationContext);
  const navigate = useNavigate();

  // If user is already logged in, redirect to the appropriate dashboard
  useEffect(() => {
    if (currentUser) {
      redirectToDashboard(currentUser.role);
    }
  }, [currentUser]);

  const redirectToDashboard = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'engineer':
        navigate('/engineer/dashboard');
        break;
      case 'designer':
        navigate('/designer/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        setError('Email and password are required');
        setIsLoading(false);
        return;
      }
      
      const result = await login(email, password);
      
      if (result.success) {
        // Create sample notifications for demo purposes
        createSampleNotifications();
        // Redirect based on role (handled by the useEffect)
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Demo login buttons for quick access
  const handleDemoLogin = (role) => {
    let demoCredentials = {};
    
    switch (role) {
      case 'admin':
        demoCredentials = { email: 'admin@pipeline.com', password: 'admin123' };
        break;
      case 'engineer':
        demoCredentials = { email: 'engineer@pipeline.com', password: 'engineer123' };
        break;
      case 'designer':
        demoCredentials = { email: 'designer@pipeline.com', password: 'designer123' };
        break;
      default:
        return;
    }
    
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
  };

  return (
    <Box 
      className="login-page"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 4
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}
          className="fade-in"
        >
          <Typography 
            component="h1" 
            variant="h4" 
            gutterBottom 
            fontWeight="bold" 
            color="primary"
            align="center"
          >
            Pipeline Management System
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ mb: 3 }}
          >
            Login to access your dashboard
          </Typography>
          
          <Box sx={{ mt: 1, width: '100%' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <Divider sx={{ my: 3 }}>
                <Chip label="Demo Accounts" />
              </Divider>
              
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                Click on a role to prefill login credentials
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AdminPanelSettings />}
                    onClick={() => handleDemoLogin('admin')}
                    color="secondary"
                  >
                    Admin
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Engineering />}
                    onClick={() => handleDemoLogin('engineer')}
                    color="secondary"
                  >
                    Engineer
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined" 
                    startIcon={<Architecture />}
                    onClick={() => handleDemoLogin('designer')}
                    color="secondary"
                  >
                    Designer
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;