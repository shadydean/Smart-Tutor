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
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Fade,
  styled,
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  WorkHistory as WorkIcon,
  Book as BookIcon,
  Star as StarIcon,
  History as HistoryIcon,
  AttachMoney as MoneyIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

// Styled components
const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)',
  color: '#fff',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: 'linear-gradient(45deg, #00f2fe, #4facfe)',
    zIndex: -1,
    borderRadius: '22px',
    opacity: 0.13,
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: '#00f2fe',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4facfe',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#00f2fe',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(0, 242, 254, .3)',
  color: '#0f1724',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #00f2fe 50%, #4facfe 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px 2px rgba(0, 242, 254, .4)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(0, 242, 254, 0.1)',
  color: '#fff',
  border: '1px solid rgba(0, 242, 254, 0.3)',
  '&:hover': {
    background: 'rgba(0, 242, 254, 0.2)',
  },
  '& .MuiChip-deleteIcon': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
      color: '#fff',
    },
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#00f2fe',
  },
  '& .MuiTab-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#00f2fe',
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tutor-profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function TutorProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [tabValue, setTabValue] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    education: '',
    experience: '',
    subjects: [],
    hourlyRate: '',
  });
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [earnings, setEarnings] = useState({
    total: 0,
    monthly: [],
  });

  // All useEffect hooks grouped together at the top
  useEffect(() => {
    // Check user role and redirect if needed
    if (user && user.role !== 'tutor') {
      setShouldRedirect(true);
    }

    // Update profile data when user data is available
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        education: user.education || '',
        experience: user.experience || '',
        subjects: user.subjects || [],
        hourlyRate: user.hourlyRate || '',
      });
    }
  }, [user]);

  // Add new useEffect to fetch tutor data
  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/tutors/${user?._id}`);
        if (response.data) {
          const tutorData = response.data;
          setProfileData({
            name: tutorData.name || '',
            bio: tutorData.bio || '',
            education: tutorData.education || '',
            experience: tutorData.experience || '',
            subjects: tutorData.subjects || [],
            hourlyRate: tutorData.hourlyRate || '',
          });
          // Update the user state with the tutor's data
          setUser(prevUser => ({
            ...prevUser,
            ...tutorData,
            profileImage: tutorData.profileImage ? `http://localhost:9000${tutorData.profileImage}` : null
          }));
        }
      } catch (error) {
        console.error('Error fetching tutor data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchTutorData();
    }
  }, [user?._id]);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/bookings/my-bookings');
        if (response.data && Array.isArray(response.data)) {
          setBookingHistory(response.data);
        }
      } catch (error) {
        console.error('Error fetching booking history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEarnings = async () => {
      try {
        const response = await api.get('/tutors/earnings');
        if (response.data) {
          setEarnings(response.data);
        }
      } catch (error) {
        console.error('Error fetching earnings:', error);
      }
    };

    // Only fetch data if user is a tutor
    if (user?.role === 'tutor') {
      fetchBookingHistory();
      fetchEarnings();
    }
  }, [user]);

  // Early return for redirect
  if (shouldRedirect) {
    return <Navigate to="/profile" />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        await api.put('/tutors/profile', profileData);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectAdd = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      const newSubject = event.target.value.trim();
      if (!profileData.subjects.includes(newSubject)) {
        setProfileData(prev => ({
          ...prev,
          subjects: [...prev.subjects, newSubject]
        }));
      }
      event.target.value = '';
    }
  };

  const handleSubjectDelete = (subjectToDelete) => {
    setProfileData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject !== subjectToDelete)
    }));
  };

  const handleMessageTutor = async () => {
    try {
      const response = await api.post('/conversations', {
        tutorId: user._id
      });
      
      // Navigate to messages page with the new conversation
      navigate('/messages', { state: { conversationId: response.data._id } });
    } catch (error) {
      console.error('Error starting conversation:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <StyledContainer>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <StyledPaper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar 
                src={user?.profileImage ? `http://localhost:9000${user.profileImage}` : undefined}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'rgba(0, 242, 254, 0.2)',
                  fontSize: '3rem',
                  border: '2px solid rgba(0, 242, 254, 0.3)',
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              
              <Box sx={{ flexGrow: 1 }}>
                {isEditing ? (
                  <StyledTextField
                    fullWidth
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    variant="standard"
                    sx={{ mb: 1 }}
                  />
                ) : (
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{
                      background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                    }}
                  >
                    {profileData.name}
                  </Typography>
                )}
                
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 1,
                  }}
                >
                  Tutor
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating 
                    value={4.5} 
                    precision={0.5} 
                    readOnly 
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#00f2fe',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                    (4.5/5 from 24 reviews)
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {user?.role === 'student' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<MessageIcon />}
                    onClick={handleMessageTutor}
                  >
                    Message Tutor
                  </Button>
                )}
                <StyledButton
                  variant={isEditing ? "contained" : "outlined"}
                  startIcon={<EditIcon />}
                  onClick={handleEditToggle}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </StyledButton>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Profile Content */}
          <Grid item xs={12}>
            <StyledPaper sx={{ width: '100%' }}>
              <StyledTabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Tab label="Profile" value={1} />
                <Tab label="Education" value={2} />
                <Tab label="Experience" value={3} />
                <Tab label="Subjects" value={4} />
                <Tab label="Reviews" value={5} />
                <Tab label="Earnings" value={6} />
              </StyledTabs>

              {/* About Tab */}
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom sx={{ color: '#00f2fe' }}>Bio</Typography>
                {isEditing ? (
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    {profileData.bio || 'No bio added yet.'}
                  </Typography>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#00f2fe' }}>Education</Typography>
                {isEditing ? (
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={2}
                    name="education"
                    value={profileData.education}
                    onChange={handleInputChange}
                    placeholder="Your educational background..."
                  />
                ) : (
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    {profileData.education || 'No education details added yet.'}
                  </Typography>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#00f2fe' }}>Hourly Rate</Typography>
                {isEditing ? (
                  <StyledTextField
                    fullWidth
                    name="hourlyRate"
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="Your hourly rate..."
                    InputProps={{
                      startAdornment: <Typography sx={{ color: '#fff' }}>$</Typography>
                    }}
                  />
                ) : (
                  <Typography 
                    variant="h5" 
                    sx={{
                      background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                    }}
                  >
                    ${profileData.hourlyRate || '0'}/hour
                  </Typography>
                )}
              </TabPanel>

              {/* Experience Tab */}
              <TabPanel value={tabValue} index={2}>
                {isEditing ? (
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    name="experience"
                    value={profileData.experience}
                    onChange={handleInputChange}
                    placeholder="Share your teaching experience..."
                  />
                ) : (
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    {profileData.experience || 'No experience details added yet.'}
                  </Typography>
                )}
              </TabPanel>

              {/* Subjects Tab */}
              <TabPanel value={tabValue} index={3}>
                <Box sx={{ mb: 2 }}>
                  {isEditing && (
                    <StyledTextField
                      fullWidth
                      placeholder="Add subjects (Press Enter)"
                      onKeyPress={handleSubjectAdd}
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.subjects.map((subject, index) => (
                    <StyledChip
                      key={index}
                      label={subject}
                      onDelete={isEditing ? () => handleSubjectDelete(subject) : undefined}
                    />
                  ))}
                </Box>
              </TabPanel>

              {/* Reviews Tab */}
              <TabPanel value={tabValue} index={4}>
                <List>
                  {[1, 2, 3].map((review, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'rgba(0, 242, 254, 0.2)' }}>S</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography component="span" variant="subtitle1" sx={{ color: '#fff' }}>
                                Student Name
                              </Typography>
                              <Rating value={5} size="small" readOnly sx={{
                                '& .MuiRating-iconFilled': {
                                  color: '#00f2fe',
                                },
                              }} />
                            </Box>
                          }
                          secondary={
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                              Great tutor! Very patient and knowledgeable.
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < 2 && <Divider variant="inset" component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                    </React.Fragment>
                  ))}
                </List>
              </TabPanel>

              {/* Bookings Tab */}
              <TabPanel value={tabValue} index={5}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mr: 2 }}>
                      Loading bookings...
                    </Typography>
                  </Box>
                ) : bookingHistory.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No bookings found.
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Student</TableCell>
                          <TableCell>Service</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Earnings</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bookingHistory.map((booking, index) => (
                          <TableRow key={booking._id || index}>
                            <TableCell>
                              {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {booking.student?.name || 'Unknown Student'}
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
                            <TableCell>
                              ${booking.amount ? booking.amount.toFixed(2) : '0.00'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>

              {/* Earnings Tab */}
              <TabPanel value={tabValue} index={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#00f2fe' }}>
                    Total Earnings
                  </Typography>
                  <Typography 
                    variant="h3" 
                    sx={{
                      background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                    }}
                  >
                    ${earnings.total}
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ color: '#00f2fe' }}>
                  Monthly Earnings
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Month</StyledTableCell>
                        <StyledTableCell>Sessions</StyledTableCell>
                        <StyledTableCell>Hours</StyledTableCell>
                        <StyledTableCell>Earnings</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {earnings.monthly.map((month, index) => (
                        <TableRow key={index} sx={{ '&:hover': { background: 'rgba(0, 242, 254, 0.1)' } }}>
                          <StyledTableCell>{month.month}</StyledTableCell>
                          <StyledTableCell>{month.sessions}</StyledTableCell>
                          <StyledTableCell>{month.hours}</StyledTableCell>
                          <StyledTableCell sx={{ color: '#00f2fe' }}>${month.earnings}</StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </StyledContainer>
  );
}

export default TutorProfile;
