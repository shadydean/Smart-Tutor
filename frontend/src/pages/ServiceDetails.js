import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const services = {
  'assignment-help': {
    title: 'Assignment Help',
    price: '$30',
    description: 'Get expert help with your assignments, homework, and projects',
    features: [
      'One-on-one guidance from subject experts',
      'Detailed explanations and solutions',
      'Help with any subject or topic',
      'Quick turnaround time',
      'Plagiarism-free work'
    ]
  },
  'performance-review': {
    title: 'Performance Review',
    price: '$40',
    description: 'Get detailed feedback on your work and performance',
    features: [
      'Comprehensive evaluation of your work',
      'Detailed feedback and suggestions',
      'Identify areas for improvement',
      'Expert recommendations',
      'Follow-up support available'
    ]
  },
  '1-on-1-mentoring': {
    title: '1-on-1 Mentoring',
    price: '$20',
    description: 'Personalized tutoring sessions tailored to your learning needs',
    features: [
      'Personalized learning plan',
      'Flexible scheduling',
      'Regular progress tracking',
      'Interactive learning sessions',
      'Focus on your specific needs'
    ]
  },
  'study-groups': {
    title: 'Study Groups',
    price: '$35',
    description: 'Learn collaboratively with peers in small group settings',
    features: [
      'Small group sizes (4-6 students)',
      'Peer learning and discussion',
      'Structured study sessions',
      'Regular meeting schedule',
      'Shared resources and materials'
    ]
  },
  'exam-preparation': {
    title: 'Exam Preparation',
    price: '$45',
    description: 'Comprehensive preparation for tests and examinations',
    features: [
      'Exam-specific strategies',
      'Practice tests and materials',
      'Time management techniques',
      'Review of key concepts',
      'Mock exam sessions'
    ]
  }
};

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const service = services[serviceId];

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/book-online', { state: { selectedService: service } });
  };

  if (!service) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Service not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/book-online')}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Back to Services
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/book-online')}
        sx={{ mb: 3 }}
      >
        Back to Services
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {service.title}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            {service.price}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {service.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            What's Included
          </Typography>
          <List>
            {service.features.map((feature, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleBookNow}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s'
              }
            }}
          >
            Book Now
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ServiceDetails; 