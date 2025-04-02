import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  InputBase,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../context/AuthContext';
import { Forum as ForumIcon } from '@mui/icons-material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(12px)',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const getSettings = (userRole) => [
  'Dashboard',
  userRole === 'tutor' ? 'Tutor Profile' : 'Profile',
  'Messages',
  'Settings',
  'Logout'
];

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const pages = ['Home', 'Blog', user?.role === 'tutor' ? 'My Bookings' : 'Book Online', 'More'];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (setting) => {
    handleCloseUserMenu();
    if (setting === 'Logout') {
      logout();
      navigate('/');
    } else if (setting === 'Tutor Profile') {
      navigate('/tutor/profile');
    } else {
      navigate(`/${setting.toLowerCase()}`);
    }
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.95), rgba(17, 25, 40, 0.85))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              fontFamily: '"Poppins", sans-serif',
              background: 'linear-gradient(to right, #00f2fe, #4facfe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
            }}
          >
            SmartTutor
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ 
                color: '#00f2fe',
                '&:hover': {
                  background: 'rgba(0, 242, 254, 0.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.95), rgba(17, 25, 40, 0.85))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                },
                '& .MuiMenuItem-root': {
                  color: '#fff',
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page === 'Home' ? '/' : page === 'My Bookings' ? '/book-online' : `/${page.toLowerCase().replace(' ', '-')}`}
                >
                  <Typography 
                    textAlign="center"
                    sx={{
                      color: '#9fafef',
                      '&:hover': {
                        color: '#00f2fe',
                      },
                    }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                component={RouterLink}
                to={page === 'Home' ? '/' : page === 'My Bookings' ? '/book-online' : `/${page.toLowerCase().replace(' ', '-')}`}
                onClick={handleCloseNavMenu}
                sx={{ 
                  my: 2, 
                  mx: 1,
                  color: '#9fafef',
                  display: 'block',
                  fontFamily: '"Poppins", sans-serif',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  position: 'relative',
                  '&:hover': {
                    color: '#00f2fe',
                    background: 'transparent',
                    '&::after': {
                      width: '100%',
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0%',
                    height: '2px',
                    background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                    transition: 'width 0.3s ease',
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: '#9fafef' }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              sx={{
                color: '#fff',
                '& .MuiInputBase-input::placeholder': {
                  color: '#9fafef',
                  opacity: 0.7,
                },
              }}
            />
          </Search>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0,
                      border: '2px solid rgba(0, 242, 254, 0.3)',
                      boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)',
                    }}
                  >
                    <Avatar 
                      alt={user.name} 
                      src={user.profileImage}
                      sx={{
                        bgcolor: 'rgba(0, 242, 254, 0.2)',
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{
                    mt: '45px',
                    '& .MuiPaper-root': {
                      background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.95), rgba(17, 25, 40, 0.85))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      minWidth: '200px',
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {getSettings(user?.role || 'student').map((setting) => (
                    <MenuItem 
                      key={setting} 
                      onClick={() => handleMenuClick(setting)}
                      sx={{
                        color: '#9fafef',
                        fontFamily: '"Poppins", sans-serif',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#00f2fe',
                          background: 'rgba(0, 242, 254, 0.1)',
                        },
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                sx={{
                  background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)',
                  borderRadius: '12px',
                  padding: '8px 24px',
                  color: '#0f1724',
                  textTransform: 'none',
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00f2fe 50%, #4facfe 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 242, 254, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Login
              </Button>
            )}
          </Box>

          {user && (
            <>
              <Button
                component={RouterLink}
                to="/discussions"
                startIcon={<ForumIcon sx={{ color: '#00f2fe' }} />}
                sx={{ 
                  ml: 2,
                  color: '#9fafef',
                  fontFamily: '"Poppins", sans-serif',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  borderRadius: '12px',
                  padding: '8px 16px',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  background: 'rgba(0, 242, 254, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(0, 242, 254, 0.1)',
                    borderColor: 'rgba(0, 242, 254, 0.3)',
                    color: '#00f2fe',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Discussions
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
