import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Paper 
} from '@mui/material';
import { 
  ErrorOutline as ErrorIcon, 
  Home as HomeIcon 
} from '@mui/icons-material';

const ErrorPage = () => {
  const navigate = useNavigate();

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
            bgcolor: 'warning.main',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <ErrorIcon sx={{ fontSize: 40, color: 'white' }} />
        </Box>

        <Typography component="h1" variant="h4" gutterBottom fontWeight="bold">
          Page Not Found
        </Typography>

        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 1 }}>
          404
        </Typography>

        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default ErrorPage;