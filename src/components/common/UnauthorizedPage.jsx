import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Paper,
  Divider
} from '@mui/material';
import { 
  LockOutlined as LockIcon, 
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';

const UnauthorizedPage = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Redirect to appropriate dashboard based on role
    switch (currentUser.role) {
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
        navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'error.main',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <LockIcon sx={{ fontSize: 40, color: 'white' }} />
        </Box>

        <Typography component="h1" variant="h4" gutterBottom fontWeight="bold">
          Access Denied
        </Typography>

        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Sorry, you don't have permission to access the requested page.
        </Typography>

        <Divider sx={{ width: '100%', my: 3 }} />

        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          {currentUser ? (
            <>
              You are currently logged in as <strong>{currentUser.name}</strong> with the role of <strong>{currentUser.role}</strong>. 
              This role doesn't have permission to access the requested resource.
            </>
          ) : (
            'You need to log in to access this resource.'
          )}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToDashboard}
          >
            {currentUser ? 'Back to Dashboard' : 'Go to Login'}
          </Button>
          
          {currentUser && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;