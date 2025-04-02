import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  CircularProgress,
  Fade,
  Zoom,
} from '@mui/material';
import { Add as AddIcon, Reply as ReplyIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))',
  backdropFilter: 'blur(16px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  marginBottom: theme.spacing(3),
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 242, 254, 0.15)',
    border: '1px solid rgba(0, 242, 254, 0.2)',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.95), rgba(17, 25, 40, 0.85))',
    backdropFilter: 'blur(16px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 242, 254, 0.1)',
  },
}));

function Discussions() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [openNewDiscussion, setOpenNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const response = await api.get('/discussions');
      setDiscussions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async () => {
    try {
      const response = await api.post('/discussions', newDiscussion);
      setDiscussions([response.data, ...discussions]);
      setOpenNewDiscussion(false);
      setNewDiscussion({ title: '', content: '' });
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleAddReply = async (discussionId) => {
    try {
      const response = await api.post(`/discussions/${discussionId}/replies`, {
        content: replyContent
      });
      
      setDiscussions(discussions.map(disc => 
        disc._id === discussionId ? response.data : disc
      ));
      
      setReplyingTo(null);
      setReplyContent('');
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)',
      pt: 4,
      pb: 8,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 3,
          alignItems: 'center',
        }}>
          <Typography 
            variant="h4"
            sx={{
              color: '#fff',
              fontFamily: '"Poppins", sans-serif',
              background: 'linear-gradient(to right, #00f2fe, #4facfe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
            }}
          >
            Discussions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenNewDiscussion(true)}
            sx={{
              background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
              borderRadius: '12px',
              color: '#fff',
              fontFamily: '"Poppins", sans-serif',
              textTransform: 'none',
              padding: '10px 20px',
              '&:hover': {
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 242, 254, 0.25)',
              },
            }}
          >
            New Discussion
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#00f2fe' }} />
          </Box>
        ) : discussions.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            color: '#9fafef',
            fontFamily: '"Poppins", sans-serif',
          }}>
            <Typography variant="h6">No discussions yet</Typography>
            <Typography variant="body1">Start a new discussion to get the conversation going!</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {discussions.map((discussion) => (
              <Grid item xs={12} key={discussion._id}>
                <Zoom in timeout={500}>
                  <StyledCard>
                    <CardHeader
                      avatar={
                        <Avatar 
                          src={discussion.author?.profileImage}
                          sx={{
                            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                            border: '2px solid rgba(0, 242, 254, 0.2)',
                            boxShadow: '0 0 10px rgba(0, 242, 254, 0.2)',
                          }}
                        >
                          {discussion.author?.name?.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <Typography 
                          variant="h6"
                          sx={{
                            color: '#fff',
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: '1.1rem',
                          }}
                        >
                          {discussion.title}
                        </Typography>
                      }
                      subheader={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            sx={{
                              color: '#9fafef',
                              fontFamily: '"Poppins", sans-serif',
                              fontSize: '0.875rem',
                            }}
                          >
                            {discussion.author?.name}
                          </Typography>
                          <Typography 
                            sx={{
                              color: 'rgba(159, 175, 239, 0.6)',
                              fontFamily: '"Poppins", sans-serif',
                              fontSize: '0.875rem',
                            }}
                          >
                            • {formatDate(discussion.createdAt)}
                          </Typography>
                        </Box>
                      }
                    />
                    <CardContent>
                      <Typography 
                        variant="body1"
                        sx={{
                          color: '#fff',
                          fontFamily: '"Poppins", sans-serif',
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        {discussion.content}
                      </Typography>

                      {/* Replies Section */}
                      {discussion.replies?.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography 
                            variant="h6"
                            sx={{
                              color: '#fff',
                              fontFamily: '"Poppins", sans-serif',
                              fontSize: '1rem',
                              mb: 2,
                            }}
                          >
                            Replies
                          </Typography>
                          {discussion.replies.map((reply, index) => (
                            <Box 
                              key={index}
                              sx={{
                                ml: 2,
                                mb: 2,
                                p: 2,
                                borderLeft: '2px solid rgba(0, 242, 254, 0.2)',
                                background: 'rgba(0, 242, 254, 0.05)',
                                borderRadius: '0 12px 12px 0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: 'rgba(0, 242, 254, 0.1)',
                                  borderLeft: '2px solid rgba(0, 242, 254, 0.4)',
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                                <Avatar 
                                  src={reply.author?.profileImage}
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                                    border: '1px solid rgba(0, 242, 254, 0.2)',
                                  }}
                                >
                                  {reply.author?.name?.charAt(0)}
                                </Avatar>
                                <Typography 
                                  sx={{
                                    color: '#9fafef',
                                    fontFamily: '"Poppins", sans-serif',
                                    fontSize: '0.875rem',
                                  }}
                                >
                                  {reply.author?.name}
                                </Typography>
                                <Typography 
                                  sx={{
                                    color: 'rgba(159, 175, 239, 0.6)',
                                    fontFamily: '"Poppins", sans-serif',
                                    fontSize: '0.875rem',
                                  }}
                                >
                                  • {formatDate(reply.createdAt)}
                                </Typography>
                              </Box>
                              <Typography 
                                sx={{
                                  color: '#fff',
                                  fontFamily: '"Poppins", sans-serif',
                                  ml: 5,
                                  lineHeight: 1.6,
                                }}
                              >
                                {reply.content}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Reply Input */}
                      {replyingTo === discussion._id ? (
                        <Box sx={{ mt: 2 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Write your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            sx={{
                              mb: 2,
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
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                              }}
                              sx={{
                                color: '#9fafef',
                                fontFamily: '"Poppins", sans-serif',
                                textTransform: 'none',
                                '&:hover': {
                                  color: '#fff',
                                  background: 'rgba(0, 242, 254, 0.1)',
                                },
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => handleAddReply(discussion._id)}
                              disabled={!replyContent.trim()}
                              sx={{
                                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                                color: '#fff',
                                fontFamily: '"Poppins", sans-serif',
                                textTransform: 'none',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                },
                                '&:disabled': {
                                  background: 'rgba(255, 255, 255, 0.12)',
                                  color: 'rgba(255, 255, 255, 0.3)',
                                },
                              }}
                            >
                              Post Reply
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Button
                          startIcon={<ReplyIcon />}
                          onClick={() => setReplyingTo(discussion._id)}
                          sx={{
                            color: '#9fafef',
                            fontFamily: '"Poppins", sans-serif',
                            textTransform: 'none',
                            mt: 2,
                            '&:hover': {
                              color: '#00f2fe',
                              background: 'rgba(0, 242, 254, 0.1)',
                            },
                          }}
                        >
                          Reply
                        </Button>
                      )}
                    </CardContent>
                  </StyledCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}

        {/* New Discussion Dialog */}
        <StyledDialog
          open={openNewDiscussion}
          onClose={() => setOpenNewDiscussion(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ 
            color: '#fff',
            fontFamily: '"Poppins", sans-serif',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            Create New Discussion
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={newDiscussion.title}
              onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  fontFamily: '"Poppins", sans-serif',
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
                '& .MuiInputLabel-root': {
                  color: '#9fafef',
                },
              }}
            />
            <TextField
              margin="dense"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={newDiscussion.content}
              onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  fontFamily: '"Poppins", sans-serif',
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
                '& .MuiInputLabel-root': {
                  color: '#9fafef',
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button
              onClick={() => setOpenNewDiscussion(false)}
              sx={{
                color: '#9fafef',
                fontFamily: '"Poppins", sans-serif',
                textTransform: 'none',
                '&:hover': {
                  color: '#fff',
                  background: 'rgba(0, 242, 254, 0.1)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateDiscussion}
              disabled={!newDiscussion.title.trim() || !newDiscussion.content.trim()}
              sx={{
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Create Discussion
            </Button>
          </DialogActions>
        </StyledDialog>
      </Container>
    </Box>
  );
}

export default Discussions; 