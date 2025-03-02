import { Box, Container, Paper, Typography } from '@mui/material';

const AuthLayout = ({ children, title }) => {
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        py: 4
      }}
    >
      <Container component="main" maxWidth="xs">
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
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
          className="fade-in"
        >
          {title && (
            <Typography 
              component="h1" 
              variant="h5" 
              gutterBottom 
              fontWeight="bold" 
              color="primary"
              align="center"
              sx={{ mb: 3 }}
            >
              {title}
            </Typography>
          )}
          
          {children}
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
            &copy; {new Date().getFullYear()} Pipeline Management System
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;