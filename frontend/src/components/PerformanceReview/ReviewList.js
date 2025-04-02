import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/performance-reviews');
      setReviews(response.data);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/performance-review/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`/api/performance-reviews/${id}`);
        fetchReviews();
      } catch (err) {
        setError('Failed to delete review');
        console.error('Error deleting review:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  if (reviews.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No reviews found. Submit your first review to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3}>
      <List>
        {reviews.map((review) => (
          <ListItem
            key={review._id}
            divider
            sx={{
              '&:last-child': {
                borderBottom: 'none'
              }
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1">{review.title}</Typography>
                  <Chip
                    label={review.status}
                    color={getStatusColor(review.status)}
                    size="small"
                  />
                </Box>
              }
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {review.description}
                  </Typography>
                  <br />
                  <Typography component="span" variant="caption" color="text.secondary">
                    Submitted: {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="view"
                onClick={() => handleView(review._id)}
                sx={{ mr: 1 }}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(review._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ReviewList; 