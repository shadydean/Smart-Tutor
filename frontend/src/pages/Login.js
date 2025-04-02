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
  Fade,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
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

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
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
      <Container component="main" maxWidth="xs">
        <Fade in timeout={800}>
          <StyledPaper sx={{ p: 4 }}>
            <Typography 
              component="h1" 
              variant="h4" 
              gutterBottom
              sx={{
                textAlign: 'center',
                fontFamily: '"Poppins", sans-serif',
                background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{
                textAlign: 'center',
                color: '#9fafef',
                fontFamily: '"Poppins", sans-serif',
                mb: 3,
              }}
            >
              Enter your credentials to continue
            </Typography>

            <Fade in={!!error}>
              <Box sx={{ width: '100%', mb: 2 }}>
                {error && (
                  <Alert 
                    severity="error"
                    sx={{
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
              </Box>
            </Fade>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Fade in timeout={800}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                />
              </Fade>
              
              <Fade in timeout={1000}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
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
              </Fade>

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
                    <span>Signing in...</span>
                  </Box>
                ) : (
                  'Sign In'
                )}
              </Button>

              <Fade in timeout={1200}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Link 
                    component={RouterLink} 
                    to="/forgot-password"
                    sx={{
                      color: '#9fafef',
                      fontFamily: '"Poppins", sans-serif',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: '#00f2fe',
                        textShadow: '0 0 8px rgba(0, 242, 254, 0.5)',
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </Fade>

              <Fade in timeout={1400}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#9fafef',
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    Don't have an account?{' '}
                    <Link 
                      component={RouterLink} 
                      to="/register"
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
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Fade>
            </Box>
          </StyledPaper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
