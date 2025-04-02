import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Container,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import SubmitReview from '../components/PerformanceReview/SubmitReview';
import ReviewList from '../components/PerformanceReview/ReviewList';
import ReviewFeedback from '../components/PerformanceReview/ReviewFeedback';
import ExpertReview from '../components/PerformanceReview/ExpertReview';

const PerformanceReview = () => {
  const [review, setReview] = useState(null);
  const [isExpert, setIsExpert] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await axios.get('/api/users/me');
        setIsExpert(response.data.role === 'expert');
      } catch (error) {
        console.error('Error checking user role:', error);
        setError('Failed to check user role');
      }
    };

    const fetchReview = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/performance-review/${id}`);
          setReview(response.data);
        } catch (error) {
          setError(error.response?.data?.message || 'Failed to fetch review');
          navigate('/performance-review');
        }
      }
    };

    checkUserRole();
    fetchReview();
  }, [id, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleReviewComplete = () => {
    navigate('/performance-review');
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (id) {
    if (isExpert && review?.status === 'pending') {
      return <ExpertReview review={review} onReviewComplete={handleReviewComplete} />;
    }
    return <ReviewFeedback review={review} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="My Reviews" />
          <Tab label="Submit New Review" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && <ReviewList />}
        {tabValue === 1 && <SubmitReview />}
      </Box>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PerformanceReview; 