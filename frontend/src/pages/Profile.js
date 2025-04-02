import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Chip,
  Tab,
  Tabs,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Rating,
  Divider,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Book as BookIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))',
  backdropFilter: 'blur(16px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 242, 254, 0.15)',
    border: '1px solid rgba(0, 242, 254, 0.2)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  fontFamily: '"Poppins", sans-serif',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    background: 'rgba(0, 242, 254, 0.05)',
  },
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    education: '',
    interests: [],
  });
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [earnings] = useState({ total: 0, monthly: [] }); // Add earnings state with default value

  // Combined useEffect for user-related updates
  useEffect(() => {
    // Handle role-based redirect
    if (user?.role === 'tutor') {
      setShouldRedirect(true);
      return;
    }

    // Update profile data when user data is available
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        education: user.education || '',
        interests: user.interests || [],
      });

      // Fetch unread messages count
      const fetchUnreadCount = async () => {
        try {
          const response = await api.get('/conversations/unread-count');
          setUnreadMessages(response.data.count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      };
      fetchUnreadCount();
    }
  }, [user]);

  // Handle booking history fetching
  useEffect(() => {
    let timeoutId;
    let controller;

    const fetchBookingHistory = async () => {
      try {
        console.log('Fetching booking history for user:', user?._id);
        setIsLoading(true);
        
        controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await api.get('/bookings/my-bookings', {
          signal: controller.signal
        });
        
        if (response.data && Array.isArray(response.data)) {
          setBookingHistory(response.data);
          console.log('Updated booking history state with', response.data.length, 'bookings');
        } else {
          console.error('Invalid booking history data format:', response.data);
          setBookingHistory([]);
        }
      } catch (error) {
        console.error('Error fetching booking history:', error);
        if (error.name === 'AbortError') {
          console.error('Request timed out');
        } else if (error.response) {
          console.error('Server error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('No response received');
        } else {
          console.error('Error setting up request:', error.message);
        }
        setBookingHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && (!shouldRedirect) && (tabValue === 0 || tabValue === 1)) {
      fetchBookingHistory();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (controller) controller.abort();
    };
  }, [user, tabValue, shouldRedirect]);

  if (shouldRedirect) {
    return <Navigate to="/tutor/profile" />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        await api.put('/students/profile', profileData);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestDelete = (interestToDelete) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToDelete)
    }));
  };

  const handleInterestAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      const newInterest = e.target.value.trim();
      if (!profileData.interests.includes(newInterest)) {
        setProfileData(prev => ({
          ...prev,
          interests: [...prev.interests, newInterest]
        }));
      }
      e.target.value = '';
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
        <Grid container spacing={3}>
          {/* Quick Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {user?.role === 'student' && (
                <Fade in timeout={500}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/tutors')}
                    startIcon={<BookIcon />}
                    sx={{
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                      },
                    }}
                  >
                    Find Tutors
                  </Button>
                </Fade>
              )}
              <Fade in timeout={700}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/messages')}
                  startIcon={
                    <Box component="span" sx={{ position: 'relative' }}>
                      <span role="img" aria-label="message">✉️</span>
                      {unreadMessages > 0 && (
                        <Box
                          component="span"
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            bgcolor: 'error.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 16,
                            height: 16,
                            fontSize: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {unreadMessages}
                        </Box>
                      )}
                    </Box>
                  }
                  sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  Messages
                </Button>
              </Fade>
            </Box>
          </Grid>

          {/* Profile Header */}
          <Grid item xs={12}>
            <Zoom in timeout={500}>
              <StyledPaper sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  alignItems: 'center', 
                  gap: 3 
                }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                      border: '4px solid rgba(0, 242, 254, 0.2)',
                      boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)',
                      fontSize: '3rem',
                      fontFamily: '"Poppins", sans-serif',
                      color: '#fff',
                    }}
                  >
                    {profileData.name?.charAt(0)}
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        variant="standard"
                        sx={{
                          mb: 1,
                          '& .MuiInputBase-input': {
                            color: '#fff',
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: '2rem',
                          },
                          '& .MuiInput-underline:before': {
                            borderBottomColor: 'rgba(255, 255, 255, 0.08)',
                          },
                          '& .MuiInput-underline:hover:before': {
                            borderBottomColor: 'rgba(0, 242, 254, 0.3)',
                          },
                          '& .MuiInput-underline:after': {
                            borderBottomColor: '#00f2fe',
                          },
                        }}
                      />
                    ) : (
                      <Typography 
                        variant="h4" 
                        gutterBottom
                        sx={{
                          color: '#fff',
                          fontFamily: '"Poppins", sans-serif',
                          background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
                        }}
                      >
                        {profileData.name}
                      </Typography>
                    )}
                    
                    <Typography 
                      variant="subtitle1" 
                      sx={{
                        color: '#9fafef',
                        fontFamily: '"Poppins", sans-serif',
                      }}
                    >
                      Student
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditToggle}
                    sx={{
                      background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
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
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </Box>
              </StyledPaper>
            </Zoom>
          </Grid>

          {/* Profile Content */}
          <Grid item xs={12}>
            <StyledPaper>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="student profile tabs"
                centered
                sx={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  '& .MuiTab-root': {
                    color: '#9fafef',
                    fontFamily: '"Poppins", sans-serif',
                    textTransform: 'none',
                    minHeight: 64,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#00f2fe',
                      background: 'rgba(0, 242, 254, 0.05)',
                    },
                  },
                  '& .Mui-selected': {
                    color: '#00f2fe !important',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#00f2fe',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    boxShadow: '0 0 10px rgba(0, 242, 254, 0.5)',
                  },
                }}
              >
                <Tab 
                  icon={<SchoolIcon />} 
                  label="About" 
                  value={1}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: '#00f2fe',
                    },
                  }}
                />
                <Tab 
                  icon={<HistoryIcon />} 
                  label="My Bookings" 
                  value={2}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: '#00f2fe',
                    },
                  }}
                />
                <Tab 
                  icon={<BookIcon />} 
                  label="Learning Interests" 
                  value={3}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: '#00f2fe',
                    },
                  }}
                />
              </Tabs>

              <TabPanel value={tabValue} index={1}>
                <Fade in timeout={500}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '50px',
                        height: '2px',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        transition: 'width 0.3s ease-in-out',
                      },
                      '&:hover::after': {
                        width: '100px',
                      },
                    }}
                  >
                    Bio
                  </Typography>
                </Fade>
                {isEditing ? (
                  <Fade in timeout={700}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                          }
                        }
                      }}
                    />
                  </Fade>
                ) : (
                  <Fade in timeout={700}>
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          color: 'text.primary',
                        },
                        padding: 2,
                        borderRadius: 1,
                        backgroundColor: 'rgba(33, 150, 243, 0.02)',
                      }}
                    >
                      {profileData.bio || 'No bio added yet.'}
                    </Typography>
                  </Fade>
                )}

                <Fade in timeout={900}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      mt: 3,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '50px',
                        height: '2px',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        transition: 'width 0.3s ease-in-out',
                      },
                      '&:hover::after': {
                        width: '100px',
                      },
                    }}
                  >
                    Education
                  </Typography>
                </Fade>
                {isEditing ? (
                  <Fade in timeout={1100}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      name="education"
                      value={profileData.education}
                      onChange={handleInputChange}
                      placeholder="Your educational background..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                          }
                        }
                      }}
                    />
                  </Fade>
                ) : (
                  <Fade in timeout={1100}>
                    <Typography 
                      variant="body1"
                      sx={{
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          color: 'text.primary',
                        },
                        padding: 2,
                        borderRadius: 1,
                        backgroundColor: 'rgba(33, 150, 243, 0.02)',
                      }}
                    >
                      {profileData.education || 'No education details added yet.'}
                    </Typography>
                  </Fade>
                )}
              </TabPanel>

              {user?.role === 'tutor' && (
                <TabPanel value={tabValue} index={4}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      name="experience"
                      value={profileData.experience}
                      onChange={handleInputChange}
                      placeholder="Share your teaching experience..."
                    />
                  ) : (
                    <Typography variant="body1">
                      {profileData.experience || 'No experience details added yet.'}
                    </Typography>
                  )}
                </TabPanel>
              )}

              <TabPanel value={tabValue} index={3}>
                <Fade in={tabValue === 3} timeout={500}>
                  <Box sx={{ mb: 2 }}>
                    {isEditing && (
                      <TextField
                        fullWidth
                        placeholder="Add learning interests (Press Enter)"
                        onKeyPress={handleInterestAdd}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                            }
                          }
                        }}
                      />
                    )}
                  </Box>
                </Fade>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    '& .MuiChip-root': {
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)',
                      },
                    },
                  }}>
                  {profileData.interests.map((interest, index) => (
                    <Chip
                      key={index}
                      label={interest}
                      onDelete={isEditing ? () => handleInterestDelete(interest) : undefined}
                      sx={{
                        background: 'linear-gradient(45deg, #E3F2FD 30%, #BBDEFB 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #BBDEFB 30%, #90CAF9 90%)',
                        },
                        transition: 'all 0.2s ease-in-out',
                        m: 0.5,
                      }}
                    />
                  ))}
                </Box>
              </TabPanel>

              {user?.role === 'tutor' && (
                <TabPanel value={tabValue} index={5}>
                  <List>
                    {/* Sample reviews - replace with actual data */}
                    {[1, 2, 3].map((review, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>S</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography component="span" variant="subtitle1">
                                  Student Name
                                </Typography>
                                <Rating value={5} size="small" readOnly />
                              </Box>
                            }
                            secondary={
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                Great tutor! Very patient and knowledgeable.
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < 2 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </TabPanel>
              )}

              {/* My Bookings Tab */}
              <TabPanel value={tabValue} index={2}>
                <Fade in={tabValue === 2} timeout={500}>
                  <Box sx={{ py: 2 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '50px',
                          height: '2px',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          transition: 'width 0.3s ease-in-out',
                        },
                        '&:hover::after': {
                          width: '100px',
                        },
                      }}
                    >
                      My Bookings
                    </Typography>
                  </Box>
                </Fade>
                  <Box sx={{ mt: 3 }}>
                    {isLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                        <Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>
                          Loading bookings...
                        </Typography>
                      </Box>
                    ) : bookingHistory.length === 0 ? (
                      <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                        No bookings found. Book a session with a tutor to get started!
                      </Typography>
                    ) : (
                      <TableContainer
                        sx={{
                          '& .MuiTableRow-root': {
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(33, 150, 243, 0.04)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            },
                          },
                        }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Tutor</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bookingHistory.map((booking, index) => (
                            <TableRow key={booking._id || index}>
                              <TableCell>
                                {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {booking.tutor?.name || 'Unknown Tutor'}
                              </TableCell>
                              <TableCell>
                                {booking.service?.title || (booking.service && typeof booking.service === 'string' ? booking.service : 'N/A')}
                              </TableCell>
                              <TableCell>
                                {booking.startTime && booking.endTime ? `${booking.startTime} - ${booking.endTime}` : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={booking.status || 'unknown'}
                                  color={
                                    booking.status === 'completed'
                                      ? 'success'
                                      : booking.status === 'upcoming'
                                      ? 'primary'
                                      : booking.status === 'cancelled'
                                      ? 'error'
                                      : 'default'
                                  }
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </TabPanel>

              {/* Earnings Tab (Tutors Only) */}
              {user?.role === 'tutor' && (
                <TabPanel value={tabValue} index={6}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Total Earnings
                    </Typography>
                    <Typography variant="h3" color="primary">
                      ${earnings.total}
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Monthly Earnings
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell>Sessions</TableCell>
                          <TableCell>Hours</TableCell>
                          <TableCell>Earnings</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {earnings.monthly.map((month) => (
                          <TableRow key={month.month}>
                            <TableCell>{month.month}</TableCell>
                            <TableCell>{month.sessions}</TableCell>
                            <TableCell>{month.hours}</TableCell>
                            <TableCell>${month.earnings}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Profile;
