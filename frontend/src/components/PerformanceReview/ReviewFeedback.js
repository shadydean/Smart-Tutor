import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Rating,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import axios from 'axios';

const ReviewFeedback = ({ review }) => {
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFollowUp = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await axios.post(`/api/performance-reviews/${review._id}/follow-up`, {
        followUpNotes: 'Requesting follow-up mentoring'
      });

      setSuccess('Follow-up request submitted successfully');
    } catch (err) {
      setError('Failed to submit follow-up request');
      console.error('Error submitting follow-up:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!review) {
    return (
      <Alert severity="error">
        Review not found
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Review Feedback
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Overall Rating
        </Typography>
        <Rating value={review.review?.overallRating || 0} readOnly />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Strengths
        </Typography>
        <List>
          {review.review?.strengths?.map((strength, index) => (
            <ListItem key={index}>
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <ListItemText primary={strength} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Areas for Improvement
        </Typography>
        <List>
          {review.review?.weaknesses?.map((weakness, index) => (
            <ListItem key={index}>
              <WarningIcon color="warning" sx={{ mr: 1 }} />
              <ListItemText primary={weakness} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Suggestions
        </Typography>
        <List>
          {review.review?.suggestions?.map((suggestion, index) => (
            <ListItem key={index}>
              <LightbulbIcon color="info" sx={{ mr: 1 }} />
              <ListItemText primary={suggestion} />
            </ListItem>
          ))}
        </List>
      </Box>

      {review.review?.detailedFeedback && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Detailed Feedback
          </Typography>
          <Typography variant="body1" paragraph>
            {review.review.detailedFeedback}
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleFollowUp}
        disabled={loading || review.followUpRequested}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {review.followUpRequested
          ? 'Follow-up Requested'
          : 'Request Follow-up Mentoring'}
      </Button>
    </Paper>
  );
};

export default ReviewFeedback; 