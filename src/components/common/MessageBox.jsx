import { useState, useContext, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Avatar, 
  Divider,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  ListItemIcon,
} from '@mui/material';
import { 
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  DeleteOutline as DeleteIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';

const MessageBox = ({ recipient, onSendMessage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  
  // Load messages from localStorage on component mount
  useEffect(() => {
    if (currentUser && recipient) {
      loadMessages();
    }
  }, [currentUser, recipient]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const loadMessages = () => {
    try {
      const key = getMessagesKey();
      const storedMessages = localStorage.getItem(key);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };
  
  const getMessagesKey = () => {
    // Create a unique key for this conversation
    const ids = [currentUser.id, recipient.id].sort().join('_');
    return `messages_${ids}`;
  };
  
  const saveMessages = (updatedMessages) => {
    const key = getMessagesKey();
    localStorage.setItem(key, JSON.stringify(updatedMessages));
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setLoading(true);
    
    // Create new message object
    const message = {
      id: Date.now().toString(),
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role
      },
      recipient: {
        id: recipient.id,
        name: recipient.name,
        role: recipient.role
      },
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    
    // Add to local state
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    // Save to localStorage
    saveMessages(updatedMessages);
    
    // Clear input field
    setNewMessage('');
    
    // Call parent callback
    if (onSendMessage) {
      onSendMessage(message);
    }
    
    setLoading(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleMessageMenuOpen = (event, messageId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMessageId(messageId);
  };
  
  const handleMessageMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMessageId(null);
  };
  
  const handleCopyMessage = () => {
    const message = messages.find(m => m.id === selectedMessageId);
    if (message) {
      navigator.clipboard.writeText(message.content);
    }
    handleMessageMenuClose();
  };
  
  const handleDeleteMessage = () => {
    const updatedMessages = messages.filter(m => m.id !== selectedMessageId);
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    handleMessageMenuClose();
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };
  
  const groupedMessages = groupMessagesByDate();
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '600px',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Messages header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">
          {recipient ? `Conversation with ${recipient.name}` : 'Messages'}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {recipient ? `${recipient.role}` : ''}
        </Typography>
      </Box>
      
      {/* Messages container */}
      <Box 
        sx={{ 
          p: 2, 
          flexGrow: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {recipient ? (
          groupedMessages.length > 0 ? (
            groupedMessages.map((group, groupIndex) => (
              <Box key={groupIndex} sx={{ mb: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 2,
                    position: 'relative'
                  }}
                >
                  <Divider sx={{ width: '100%', position: 'absolute', top: '50%' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      bgcolor: 'background.paper', 
                      px: 2, 
                      py: 0.5, 
                      borderRadius: 10,
                      zIndex: 1, 
                      color: 'text.secondary'
                    }}
                  >
                    {formatDate(new Date(group.date))}
                  </Typography>
                </Box>
                
                {group.messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender.id === currentUser.id ? 'flex-end' : 'flex-start',
                      mb: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', maxWidth: '80%' }}>
                      {message.sender.id !== currentUser.id && (
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1, 
                            mt: 0.5,
                            bgcolor: message.sender.role === 'admin' ? 'secondary.main' :
                                     message.sender.role === 'engineer' ? 'info.main' :
                                     'success.main'
                          }}
                        >
                          {message.sender.name.charAt(0)}
                        </Avatar>
                      )}
                      
                      <Box>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: message.sender.id === currentUser.id ? 'flex-end' : 'flex-start',
                            mb: 0.5
                          }}
                        >
                          {message.sender.id !== currentUser.id && (
                            <Typography variant="caption" sx={{ fontWeight: 'medium', mr: 1 }}>
                              {message.sender.name}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(message.timestamp)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: message.sender.id === currentUser.id ? 'primary.main' : 'grey.100',
                              color: message.sender.id === currentUser.id ? 'white' : 'text.primary',
                              position: 'relative',
                            }}
                          >
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {message.content}
                            </Typography>
                          </Paper>
                          
                          <IconButton
                            size="small"
                            onClick={(e) => handleMessageMenuOpen(e, message.id)}
                            sx={{ 
                              ml: 0.5, 
                              opacity: 0.5, 
                              '&:hover': { opacity: 1 } 
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      {message.sender.id === currentUser.id && (
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            ml: 1, 
                            mt: 0.5,
                            bgcolor: message.sender.role === 'admin' ? 'secondary.main' :
                                     message.sender.role === 'engineer' ? 'info.main' :
                                     'success.main'
                          }}
                        >
                          {message.sender.name.charAt(0)}
                        </Avatar>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            ))
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="body2" color="text.secondary">
                No messages yet. Start the conversation!
              </Typography>
            </Box>
          )
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Select a recipient to start messaging
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Message input */}
      {recipient && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={`Message ${recipient.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              variant="outlined"
              size="small"
              sx={{ bgcolor: 'background.paper' }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!newMessage.trim() || loading}
              onClick={handleSendMessage}
              sx={{ minWidth: '48px', px: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
          </Box>
        </Box>
      )}
      
      {/* Message action menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMessageMenuClose}
      >
        <MenuItem onClick={handleCopyMessage}>
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          Copy message
        </MenuItem>
        <MenuItem onClick={handleDeleteMessage}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete message
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default MessageBox;