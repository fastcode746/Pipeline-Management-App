import { Box, Typography, Container, Divider, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} Pipeline Management System
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              All rights reserved
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" color="inherit" underline="hover">
              <Typography variant="body2" color="text.secondary">
                Privacy Policy
              </Typography>
            </Link>
            <Link href="#" color="inherit" underline="hover">
              <Typography variant="body2" color="text.secondary">
                Terms of Service
              </Typography>
            </Link>
            <Link href="#" color="inherit" underline="hover">
              <Typography variant="body2" color="text.secondary">
                Contact
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;