import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Rating,
  Chip,
  InputAdornment,
  CircularProgress,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Message as MessageIcon,
  BookOnline as BookIcon,
  Star as StarIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const TutorSearch = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchTutors();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutors', {
        params: {
          search: searchQuery,
          subject: selectedSubject,
          sortBy,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating,
        },
      });
      setTutors(response.data);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTutors();
  };

  const handleMessage = async (tutorId) => {
    try {
      const response = await api.post('/conversations', { tutorId });
      navigate('/messages?conversation=' + response.data.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleBooking = (tutorId) => {
    navigate('/book/' + tutorId);
  };

  const renderFilters = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Filters</Typography>
      </Box>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="rating">Rating (High to Low)</MenuItem>
          <MenuItem value="price_asc">Price (Low to High)</MenuItem>
          <MenuItem value="price_desc">Price (High to Low)</MenuItem>
          <MenuItem value="experience">Experience (High to Low)</MenuItem>
        </Select>
      </FormControl>

      <Typography gutterBottom>Price Range ($/hour)</Typography>
      <Slider
        value={priceRange}
        onChange={(e, newValue) => setPriceRange(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={100}
        marks
        sx={{ mb: 2 }}
      />

      <Typography gutterBottom>Minimum Rating</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Rating
          value={minRating}
          onChange={(e, newValue) => setMinRating(newValue)}
          precision={0.5}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Typography variant="body2" sx={{ ml: 1 }}>
          ({minRating} and above)
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={() => {
          fetchTutors();
          setShowFilters(false);
        }}
      >
        Apply Filters
      </Button>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Fade in timeout={800}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Find Your Perfect Tutor
          </Typography>

          <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      },
                    },
                  }}
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{
                    height: '56px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                    },
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Tooltip title="Toggle Filters">
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {showFilters && renderFilters()}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {tutors.map((tutor) => (
                <Grid item xs={12} md={6} lg={4} key={tutor._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(33, 150, 243, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 2 }}>
                        <Avatar
                          src={tutor.profileImage ? `http://localhost:9000${tutor.profileImage}` : undefined}
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: 'primary.main',
                            mr: 2,
                          }}
                        >
                          {tutor.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {tutor.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={tutor.rating} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              ({tutor.reviewCount} reviews)
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                          ${tutor.hourlyRate}/hr
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {tutor.bio}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        {tutor.subjects.map((subject) => (
                          <Chip
                            key={subject}
                            label={subject}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{
                              mr: 1,
                              mb: 1,
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                backgroundColor: 'primary.main',
                                color: 'white',
                              },
                            }}
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <SchoolIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {tutor.experience} years of experience
                        </Typography>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<MessageIcon />}
                        onClick={() => handleMessage(tutor._id)}
                        sx={{
                          flex: 1,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Message
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<BookIcon />}
                        onClick={() => handleBooking(tutor._id)}
                        sx={{
                          flex: 1,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Book Now
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Fade>
    </Container>
  );
};

export default TutorSearch;
