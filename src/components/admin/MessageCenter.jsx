import { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  TextField, 
  InputAdornment, 
  IconButton,
  Badge,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Message as MessageIcon,
  Engineering as EngineeringIcon,
  Architecture as ArchitectureIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import MessageBox from '../common/MessageBox';

const MessageCenter = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { currentUser } = useContext(AuthContext);
  const { sendNotification } = useContext(NotificationContext);
  
  // Initialize users on component mount
  useEffect(() => {
    initializeUsers();
  }, []);
  
  // Hard-coded users for demonstration
  const initializeUsers = () => {
    const demoUsers = [
      { id: 2, name: 'Engineer User', role: 'engineer', email: 'engineer@pipeline.com', lastActive: new Date().toISOString() },
      { id: 3, name: 'Designer User', role: 'designer', email: 'designer@pipeline.com', lastActive: new Date(Date.now() - 3600000).toISOString() }
    ];
    
    setUsers(demoUsers);
  };
  
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = (message) => {
    if (selectedUser) {
      // Log the message activity
      const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
      activities.push({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'message',
        timestamp: new Date().toISOString(),
        details: `sent message to ${selectedUser.name}`
      });
      localStorage.setItem('userActivities', JSON.stringify(activities));
      
      // Send notification to the recipient
      sendNotification(
        selectedUser.id,
        `New message from ${currentUser.name}`,
        'info'
      );
    }
  };
  
  // Format timestamp for display
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;

    return seconds < 5 ? 'just now' : `${Math.floor(seconds)} second${Math.floor(seconds) === 1 ? '' : 's'} ago`;
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MessageIcon fontSize="large" color="primary" />
          Message Center
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Users List */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              height: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">
                Users
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Search users..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <List sx={{ overflow: 'auto', flexGrow: 1 }}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Box key={user.id}>
                    <ListItem 
                      button 
                      selected={selectedUser?.id === user.id}
                      onClick={() => handleUserSelect(user)}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          color={new Date(user.lastActive) > new Date(Date.now() - 3600000) ? 'success' : 'default'}
                        >
                          <Avatar
                            sx={{ 
                              bgcolor: user.role === 'admin' ? 'secondary.main' :
                                      user.role === 'engineer' ? 'info.main' : 
                                      'success.main'
                            }}
                          >
                            {user.role === 'admin' && <AdminPanelSettingsIcon />}
                            {user.role === 'engineer' && <EngineeringIcon />}
                            {user.role === 'designer' && <ArchitectureIcon />}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={user.name}
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" component="span" sx={{ textTransform: 'capitalize' }}>
                              {user.role}
                            </Typography>
                            <Typography variant="caption" component="span" color="text.secondary">
                              {formatTimeAgo(user.lastActive)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No users found
                  </Typography>
                </Box>
              )}
            </List>
            
            <Divider />
            
            <Box sx={{ p: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<MessageIcon />}
                fullWidth
                disabled={!selectedUser}
                onClick={() => setSelectedUser(users[0])}
              >
                New Message
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Message Box */}
        <Grid item xs={12} md={8}>
          <MessageBox recipient={selectedUser} onSendMessage={handleSendMessage} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessageCenter;