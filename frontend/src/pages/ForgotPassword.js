import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Fade,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const steps = ['Enter Email', 'Check Email', 'Reset Password'];

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

const StyledTextField = styled(TextField)(({ theme }) => ({
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
  '& .MuiInputHelperText-root': {
    color: '#9fafef',
  },
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepLabel-root .Mui-completed': {
    color: '#00f2fe',
  },
  '& .MuiStepLabel-root .Mui-active': {
    color: '#00f2fe',
  },
  '& .MuiStepLabel-label': {
    color: '#9fafef',
    fontFamily: '"Poppins", sans-serif',
    '&.Mui-active': {
      color: '#fff',
    },
    '&.Mui-completed': {
      color: '#9fafef',
    },
  },
  '& .MuiStepConnector-line': {
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
}));

function ForgotPassword() {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setSuccess('Password reset instructions have been sent to your email');
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await axios.post(`http://localhost:5000/api/auth/reset-password/${resetToken}`, {
        password: newPassword,
      });
      setSuccess('Password has been reset successfully');
      setActiveStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleSubmitEmail} sx={{ mt: 2 }}>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
                textTransform: 'none',
                padding: '12px',
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 242, 254, 0.25)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(0, 242, 254, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'inherit' }} />
                  <span>Sending...</span>
                </Box>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography 
              variant="body1" 
              gutterBottom
              sx={{
                color: '#9fafef',
                fontFamily: '"Poppins", sans-serif',
                mb: 3,
              }}
            >
              We've sent a password reset link to your email address. Please check your
              inbox and spam folder.
            </Typography>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="resetToken"
              label="Reset Token"
              name="resetToken"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              helperText="Enter the token from the email"
            />
            <Button
              fullWidth
              variant="contained"
              disabled={!resetToken}
              onClick={() => setActiveStep(2)}
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
                textTransform: 'none',
                padding: '12px',
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 242, 254, 0.25)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(0, 242, 254, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Continue
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 2 }}>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
                textTransform: 'none',
                padding: '12px',
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 242, 254, 0.25)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(0, 242, 254, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'inherit' }} />
                  <span>Resetting...</span>
                </Box>
              ) : (
                'Reset Password'
              )}
            </Button>
          </Box>
        );
      default:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{
                color: '#00f2fe',
                fontFamily: '"Poppins", sans-serif',
                textShadow: '0 0 8px rgba(0, 242, 254, 0.5)',
              }}
            >
              Password Reset Successful!
            </Typography>
            <Typography 
              variant="body1" 
              gutterBottom
              sx={{
                color: '#9fafef',
                fontFamily: '"Poppins", sans-serif',
                mb: 3,
              }}
            >
              Your password has been reset successfully.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              sx={{
                mt: 2,
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
                textTransform: 'none',
                padding: '12px 24px',
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 242, 254, 0.25)',
                },
              }}
            >
              Back to Login
            </Button>
          </Box>
        );
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)',
      pt: 4,
      pb: 8,
      display: 'flex',
      alignItems: 'center',
    }}>
      <Container component="main" maxWidth="sm">
        <Fade in timeout={800}>
          <StyledPaper sx={{ p: 4 }}>
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{
                textAlign: 'center',
                fontFamily: '"Poppins", sans-serif',
                background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
                mb: 4,
              }}
            >
              Reset Password
            </Typography>

            <StyledStepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </StyledStepper>

            {error && (
              <Alert 
                severity="error" 
                sx={{
                  width: '100%',
                  mb: 3,
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
                  width: '100%',
                  mb: 3,
                  background: 'rgba(46, 125, 50, 0.1)',
                  color: '#69f0ae',
                  border: '1px solid rgba(46, 125, 50, 0.3)',
                  '& .MuiAlert-icon': {
                    color: '#69f0ae',
                  },
                }}
              >
                {success}
              </Alert>
            )}

            {getStepContent(activeStep)}

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography 
                variant="body2"
                sx={{ 
                  color: '#9fafef',
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                Remember your password?{' '}
                <Link 
                  component={RouterLink} 
                  to="/login"
                  sx={{
                    color: '#00f2fe',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      textShadow: '0 0 8px rgba(0, 242, 254, 0.5)',
                    },
                  }}
                >
                  Back to Login
                </Link>
              </Typography>
            </Box>
          </StyledPaper>
        </Fade>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
