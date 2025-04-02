import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Grid,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  PhotoCamera,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { styled } from '@mui/material/styles';

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

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#00f2fe',
    '&:hover': {
      backgroundColor: 'rgba(0, 242, 254, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#00f2fe',
  },
}));

function Settings() {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      bio: '',
      profileImage: null,
    },
    notifications: {
      emailNotifications: true,
      bookingReminders: true,
      messageNotifications: true,
      marketingEmails: false,
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          name: user.name || '',
          email: user.email || '',
          bio: user.bio || '',
          profileImage: user.profileImage || null,
        },
      }));
    }
  }, [user]);

  const handleInputChange = (section, field) => (event) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: event.target.value,
      },
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: event.target.checked,
      },
    }));
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      const formData = new FormData();
      formData.append('avatar', file);
      
      try {
        console.log('Sending request to upload avatar...');
        const response = await api.post('/users/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('Upload response:', response.data);
        
        // Prepend the backend URL to the avatar path
        const avatarUrl = `http://localhost:9000${response.data.avatarUrl}`;
        
        // Update local settings
        setSettings(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            profileImage: avatarUrl,
          },
        }));

        // Update user state in AuthContext if user exists
        if (user) {
          updateUser({
            ...user,
            profileImage: avatarUrl
          });
        }

        setSuccess('Profile image updated successfully!');
      } catch (error) {
        console.error('Upload error:', error);
        console.error('Error response:', error.response?.data);
        setError(error.response?.data?.msg || 'Failed to upload avatar. Please try again.');
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await api.put('/users/profile', settings.profile);
      updateUser(response.data);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (settings.security.newPassword !== settings.security.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await api.put('/users/password', {
        currentPassword: settings.security.currentPassword,
        newPassword: settings.security.newPassword,
      });
      
      setSuccess('Password updated successfully!');
      setSettings(prev => ({
        ...prev,
        security: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await api.put('/users/notifications', settings.notifications);
      setSuccess('Notification preferences updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update notification preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        
        await api.delete('/users/account');
        // Handle account deletion success (e.g., logout and redirect)
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete account. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)',
      pt: 4,
      pb: 8,
    }}>
      <Container maxWidth="md">
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
            mb: 3,
          }}
        >
          Settings
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              background: 'rgba(211, 47, 47, 0.1)',
              color: '#ff5252',
              border: '1px solid rgba(211, 47, 47, 0.3)',
              '& .MuiAlert-icon': {
                color: '#ff5252',
              },
            }}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 2,
              background: 'rgba(0, 242, 254, 0.1)',
              color: '#00f2fe',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              '& .MuiAlert-icon': {
                color: '#00f2fe',
              },
            }}
          >
            {success}
          </Alert>
        )}

        {/* Profile Settings */}
        <StyledPaper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonIcon sx={{ mr: 1, color: '#00f2fe' }} />
            <Typography 
              variant="h6"
              sx={{
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Profile Settings
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={settings.profile.profileImage}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mb: 1,
                    background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                    border: '4px solid rgba(0, 242, 254, 0.2)',
                    boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)',
                  }}
                >
                  {settings.profile.name?.charAt(0)}
                </Avatar>
                <IconButton
                  component="label"
                  onClick={() => console.log('Upload button clicked')}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'rgba(17, 25, 40, 0.9)',
                    border: '2px solid rgba(0, 242, 254, 0.3)',
                    color: '#00f2fe',
                    '&:hover': {
                      bgcolor: 'rgba(17, 25, 40, 0.7)',
                      border: '2px solid rgba(0, 242, 254, 0.5)',
                    },
                  }}
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      console.log('File input changed');
                      handleAvatarChange(e);
                    }}
                  />
                  <PhotoCamera />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={settings.profile.name}
                onChange={handleInputChange('profile', 'name')}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={settings.profile.email}
                onChange={handleInputChange('profile', 'email')}
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#9fafef',
                    fontFamily: '"Poppins", sans-serif',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9fafef',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                value={settings.profile.bio}
                onChange={handleInputChange('profile', 'bio')}
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
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                disabled={loading}
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
                Save Profile
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Notification Settings */}
        <StyledPaper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <NotificationsIcon sx={{ mr: 1, color: '#00f2fe' }} />
            <Typography 
              variant="h6"
              sx={{
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Notification Preferences
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={settings.notifications.emailNotifications}
                    onChange={handleSwitchChange('emailNotifications')}
                  />
                }
                label={
                  <Typography 
                    sx={{ 
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    Email Notifications
                  </Typography>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={settings.notifications.bookingReminders}
                    onChange={handleSwitchChange('bookingReminders')}
                  />
                }
                label={
                  <Typography 
                    sx={{ 
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    Booking Reminders
                  </Typography>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={settings.notifications.messageNotifications}
                    onChange={handleSwitchChange('messageNotifications')}
                  />
                }
                label={
                  <Typography 
                    sx={{ 
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    Message Notifications
                  </Typography>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={settings.notifications.marketingEmails}
                    onChange={handleSwitchChange('marketingEmails')}
                  />
                }
                label={
                  <Typography 
                    sx={{ 
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    Marketing Emails
                  </Typography>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveNotifications}
                disabled={loading}
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
                Save Notification Preferences
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Security Settings */}
        <StyledPaper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SecurityIcon sx={{ mr: 1, color: '#00f2fe' }} />
            <Typography 
              variant="h6"
              sx={{
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Security Settings
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={settings.security.currentPassword}
                onChange={handleInputChange('security', 'currentPassword')}
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={settings.security.newPassword}
                onChange={handleInputChange('security', 'newPassword')}
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={settings.security.confirmPassword}
                onChange={handleInputChange('security', 'confirmPassword')}
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
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleChangePassword}
                disabled={loading}
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
                  }
                }}
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Account Management */}
        <StyledPaper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <DeleteIcon sx={{ mr: 1, color: '#ff5252' }} />
            <Typography 
              variant="h6"
              sx={{
                color: '#ff5252',
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Account Management
            </Typography>
          </Box>

          <Typography 
            variant="body1" 
            sx={{ 
              color: '#9fafef',
              fontFamily: '"Poppins", sans-serif',
              mb: 3,
            }}
          >
            Once you delete your account, there is no going back. Please be certain.
          </Typography>

          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAccount}
            disabled={loading}
            sx={{
              color: '#ff5252',
              borderColor: '#ff5252',
              fontFamily: '"Poppins", sans-serif',
              textTransform: 'none',
              '&:hover': {
                background: 'rgba(255, 82, 82, 0.1)',
                borderColor: '#ff5252',
              }
            }}
          >
            Delete Account
          </Button>
        </StyledPaper>
      </Container>
    </Box>
  );
}

export default Settings; 