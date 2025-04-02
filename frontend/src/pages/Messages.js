import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  Fade,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Join user's room when socket is connected
  useEffect(() => {
    if (socket && user) {
      socket.emit('join', user._id);
    }
  }, [socket, user]);

  // Listen for new messages
  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (selectedConversation && 
            (message.sender._id === selectedConversation._id || 
             message.receiver._id === selectedConversation._id)) {
          setMessages(prev => [...prev, message]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
      }
    };
  }, [socket, selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (location.state?.conversationId) {
      const conversation = conversations.find(c => c._id === location.state.conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [conversations, location.state]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/conversations');
      
      const processedConversations = response.data.map(conv => {
        const otherUser = conv.participants.find(p => p._id !== user._id);
        return {
          ...conv,
          id: conv._id,
          otherUser: otherUser || { name: 'Unknown User' }
        };
      });
      
      setConversations(processedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const response = await api.get('/conversations/' + conversationId + '/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      // First send the message to the backend
      const response = await api.post('/conversations/' + selectedConversation._id + '/messages', {
        content: newMessage,
      });

      // Then emit the message through socket
      if (socket) {
        const messageData = {
          _id: response.data._id,
          sender: {
            _id: user._id,
            name: user.name
          },
          receiver: {
            _id: selectedConversation.otherUser._id,
            name: selectedConversation.otherUser.name
          },
          content: newMessage,
          conversationId: selectedConversation._id,
          createdAt: new Date()
        };

        console.log('Emitting message:', messageData);
        socket.emit('sendMessage', messageData);
      }

      // Update local state with the new message
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error to user
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send message. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)',
      pt: 4,
      pb: 8,
    }}>
      <Container maxWidth="lg">
        <Paper sx={{ 
          display: 'flex', 
          height: 'calc(100vh - 140px)',
          overflow: 'hidden',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {/* Conversations List */}
          <Fade in timeout={800}>
            <Box sx={{ 
              width: 300, 
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(17, 25, 40, 0.5)',
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  p: 2, 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                Conversations
              </Typography>
              <List sx={{ 
                overflow: 'auto',
                flexGrow: 1,
                '& .MuiListItem-root': {
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'rgba(0, 242, 254, 0.1)',
                    transform: 'translateX(5px)',
                  },
                  '&.Mui-selected': {
                    background: 'rgba(0, 242, 254, 0.15)',
                    borderRight: '3px solid #00f2fe',
                    '&:hover': {
                      background: 'rgba(0, 242, 254, 0.2)',
                    },
                  },
                },
              }}>
                {loading && conversations.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress sx={{ color: '#00f2fe' }} />
                  </Box>
                ) : (
                  conversations.map((conversation) => (
                    <React.Fragment key={conversation._id}>
                      <ListItem 
                        button 
                        selected={selectedConversation?._id === conversation._id}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <ListItemAvatar>
                          <Badge
                            color="primary"
                            variant="dot"
                            invisible={!conversation.unreadCount}
                            sx={{
                              '& .MuiBadge-badge': {
                                background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                                boxShadow: '0 0 10px rgba(0, 242, 254, 0.5)',
                              },
                            }}
                          >
                            <Avatar
                              src={conversation.otherUser?.profileImage ? `http://localhost:9000${conversation.otherUser.profileImage}` : undefined}
                              sx={{
                                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                              }}
                            >
                              {conversation.otherUser?.name?.charAt(0) || '?'}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography sx={{ color: '#fff', fontFamily: '"Poppins", sans-serif' }}>
                              {conversation.otherUser?.name || 'Unknown User'}
                            </Typography>
                          }
                          secondary={
                            <Typography 
                              sx={{ 
                                color: '#9fafef', 
                                fontFamily: '"Poppins", sans-serif',
                                fontSize: '0.875rem',
                              }} 
                              noWrap
                            >
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </Typography>
                          }
                          secondaryTypographyProps={{
                            noWrap: true,
                            style: { maxWidth: '180px' }
                          }}
                        />
                      </ListItem>
                      <Divider 
                        variant="inset" 
                        component="li" 
                        sx={{ 
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                        }} 
                      />
                    </React.Fragment>
                  ))
                )}
              </List>
            </Box>
          </Fade>

          {/* Messages Area */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            background: 'rgba(17, 25, 40, 0.3)',
          }}>
            {selectedConversation ? (
              <>
                {/* Messages Header */}
                <Box sx={{ 
                  p: 2, 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(17, 25, 40, 0.5)',
                }}>
                  <Typography 
                    variant="h6"
                    sx={{
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    {selectedConversation?.otherUser?.name || 'Unknown User'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: '#9fafef',
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    {selectedConversation?.otherUser?.role === 'tutor' ? 'Tutor' : 'Student'}
                  </Typography>
                </Box>

                {/* Messages List */}
                <Box sx={{ 
                  flexGrow: 1, 
                  overflow: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress sx={{ color: '#00f2fe' }} />
                    </Box>
                  ) : (
                    messages.map((message) => (
                      <Box
                        key={message._id}
                        sx={{
                          alignSelf: message.sender?._id === user?._id ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          mb: 2,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            background: message.sender?._id === user?._id 
                              ? 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)'
                              : 'rgba(255, 255, 255, 0.05)',
                            color: message.sender?._id === user?._id ? '#fff' : '#fff',
                            borderRadius: message.sender?._id === user?._id
                              ? '20px 20px 5px 20px'
                              : '20px 20px 20px 5px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: message.sender?._id === user?._id
                              ? '0 4px 15px rgba(0, 242, 254, 0.2)'
                              : '0 4px 15px rgba(255, 255, 255, 0.05)',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Typography 
                            variant="body1"
                            sx={{
                              fontFamily: '"Poppins", sans-serif',
                              lineHeight: 1.6,
                            }}
                          >
                            {message.content}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block',
                              mt: 0.5,
                              opacity: 0.8,
                              fontFamily: '"Poppins", sans-serif',
                              fontSize: '0.75rem',
                            }}
                          >
                            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
                          </Typography>
                        </Paper>
                      </Box>
                    ))
                  )}
                </Box>

                {/* Message Input */}
                <Box sx={{ 
                  p: 2, 
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(17, 25, 40, 0.5)',
                }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 242, 254, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00f2fe',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#9fafef',
                        opacity: 0.8,
                      },
                    }}
                  />
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#9fafef',
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#fff',
                    mb: 1,
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  Select a conversation to start messaging
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#9fafef',
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  Connect with your tutors and students
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Messages;
