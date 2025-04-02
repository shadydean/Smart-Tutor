import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Fade,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/material/styles';

const steps = ['Account Type', 'Personal Information', 'Credentials'];

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
  '& .MuiIconButton-root': {
    color: '#9fafef',
    '&:hover': {
      color: '#00f2fe',
    },
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

const StyledRadio = styled(Radio)(({ theme }) => ({
  color: '#9fafef',
  '&.Mui-checked': {
    color: '#00f2fe',
  },
}));

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    role: 'student',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return !!formData.role;
      case 1:
        return !!formData.name;
      case 2:
        return (
          !!formData.email &&
          !!formData.password &&
          formData.password === formData.confirmPassword &&
          formData.password.length >= 6
        );
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <FormLabel 
              component="legend"
              sx={{ 
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
                mb: 2,
              }}
            >
              I want to join as a
            </FormLabel>
            <RadioGroup
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <FormControlLabel
                value="student"
                control={<StyledRadio />}
                label={
                  <Typography sx={{ color: '#9fafef', fontFamily: '"Poppins", sans-serif' }}>
                    Student - I'm looking for academic help
                  </Typography>
                }
              />
              <FormControlLabel
                value="tutor"
                control={<StyledRadio />}
                label={
                  <Typography sx={{ color: '#9fafef', fontFamily: '"Poppins", sans-serif' }}>
                    Tutor - I want to help students
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>
        );
      case 1:
        return (
          <StyledTextField
            margin="normal"
            required
            fullWidth
            name="name"
            label="Full Name"
            type="text"
            id="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </>
        );
      default:
        return 'Unknown step';
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
              Create Account
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

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              {getStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{
                    color: '#9fafef',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    fontFamily: '"Poppins", sans-serif',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'rgba(0, 242, 254, 0.3)',
                      color: '#00f2fe',
                    },
                  }}
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || !validateStep()}
                      sx={{
                        background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif',
                        textTransform: 'none',
                        padding: '8px 24px',
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
                          <span>Creating Account...</span>
                        </Box>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!validateStep()}
                      sx={{
                        background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif',
                        textTransform: 'none',
                        padding: '8px 24px',
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
                      Next
                    </Button>
                  )}
                </Box>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: '#9fafef',
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  Already have an account?{' '}
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
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </StyledPaper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
