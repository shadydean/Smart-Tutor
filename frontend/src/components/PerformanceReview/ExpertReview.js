import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Rating,
  List,
  ListItem,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';

const ExpertReview = ({ review, onReviewComplete }) => {
  const [formData, setFormData] = useState({
    strengths: [''],
    weaknesses: [''],
    suggestions: [''],
    overallRating: 3,
    detailedFeedback: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Filter out empty strings from arrays
      const submissionData = {
        ...formData,
        strengths: formData.strengths.filter(s => s.trim()),
        weaknesses: formData.weaknesses.filter(w => w.trim()),
        suggestions: formData.suggestions.filter(s => s.trim())
      };

      await axios.post(`/api/performance-reviews/${review._id}/review`, submissionData);
      
      if (onReviewComplete) {
        onReviewComplete();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Provide Expert Review
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Reviewing: {review.title}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Overall Rating
            </Typography>
            <Rating
              value={formData.overallRating}
              onChange={(_, value) => setFormData(prev => ({ ...prev, overallRating: value }))}
              size="large"
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Strengths
            </Typography>
            <List>
              {formData.strengths.map((strength, index) => (
                <ListItem key={index}>
                  <TextField
                    fullWidth
                    value={strength}
                    onChange={(e) => handleItemChange('strengths', index, e.target.value)}
                    placeholder="Enter a strength"
                    size="small"
                  />
                  {formData.strengths.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveItem('strengths', index)}
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddItem('strengths')}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Strength
              </Button>
            </List>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Areas for Improvement
            </Typography>
            <List>
              {formData.weaknesses.map((weakness, index) => (
                <ListItem key={index}>
                  <TextField
                    fullWidth
                    value={weakness}
                    onChange={(e) => handleItemChange('weaknesses', index, e.target.value)}
                    placeholder="Enter an area for improvement"
                    size="small"
                  />
                  {formData.weaknesses.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveItem('weaknesses', index)}
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddItem('weaknesses')}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Area for Improvement
              </Button>
            </List>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Suggestions
            </Typography>
            <List>
              {formData.suggestions.map((suggestion, index) => (
                <ListItem key={index}>
                  <TextField
                    fullWidth
                    value={suggestion}
                    onChange={(e) => handleItemChange('suggestions', index, e.target.value)}
                    placeholder="Enter a suggestion"
                    size="small"
                  />
                  {formData.suggestions.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveItem('suggestions', index)}
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddItem('suggestions')}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Suggestion
              </Button>
            </List>
          </Box>

          <TextField
            label="Detailed Feedback"
            multiline
            rows={4}
            value={formData.detailedFeedback}
            onChange={(e) => setFormData(prev => ({ ...prev, detailedFeedback: e.target.value }))}
            required
            fullWidth
          />

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Submit Review
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ExpertReview; 