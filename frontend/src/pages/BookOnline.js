import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Chip,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Book as BookIcon,
  Science as ScienceIcon,
  Calculate as CalculateIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Chat as ChatIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  AttachMoney as AttachMoneyIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { formatCurrency } from '../utils/formatters';

// Default data for services and tutors
const defaultServices = [
  {
    id: '1',
    title: "Assignment Help",
    description: "Get expert help with your assignments, homework, and projects",
    icon: 'Assignment',
    price: 30,
    category: 'Assignment Help'
  },
  {
    id: '2',
    title: "Performance Review",
    description: "Get detailed feedback on your work and performance",
    icon: 'Science',
    price: 40,
    category: 'Performance Review'
  },
  {
    id: '3',
    title: "1-on-1 Mentoring",
    description: "Personalized tutoring sessions tailored to your learning needs",
    icon: 'Person',
    price: 20,
    category: '1-on-1 Mentoring'
  },
  {
    id: '4',
    title: "Study Groups",
    description: "Learn collaboratively with peers in small group settings",
    icon: 'Group',
    price: 35,
    category: 'Study Groups'
  },
  {
    id: '5',
    title: "Exam Preparation",
    description: "Comprehensive preparation for tests and examinations",
    icon: 'Book',
    price: 45,
    category: 'Exam Preparation'
  }
];

const defaultTutors = [
  {
    _id: '1',
    name: 'Dr. Sarah Johnson',
    experience: 8,
    rating: 4.9,
    specializations: ['Mathematics', 'Physics'],
    completedAssignments: 120,
    availability: true
  },
  {
    _id: '2',
    name: 'Prof. Michael Chen',
    experience: 10,
    rating: 4.8,
    specializations: ['Chemistry', 'Biology'],
    completedAssignments: 95,
    availability: true
  },
  {
    _id: '3',
    name: 'Dr. Emily Brown',
    experience: 6,
    rating: 4.7,
    specializations: ['Literature', 'History'],
    completedAssignments: 75,
    availability: true
  }
];

const steps = ['Select Service', 'Choose Tutor', 'Select Time', 'Submit Work', 'Confirm Booking'];

// Update the services array with proper icon references
const getServiceIcon = (iconName) => {
  switch (iconName) {
    case 'Assignment':
      return <AssignmentIcon />;
    case 'Person':
      return <PersonIcon />;
    case 'Group':
      return <GroupIcon />;
    case 'Book':
      return <BookIcon />;
    case 'Science':
      return <ScienceIcon />;
    case 'Calculate':
      return <CalculateIcon />;
    default:
      return <AssignmentIcon />;
  }
};

// Updated styled components and styles
const containerStyles = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)',
  color: '#fff',
  paddingTop: '2rem',
  paddingBottom: '2rem',
};

const cardStyles = {
  background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: 'linear-gradient(45deg, #00f2fe, #4facfe)',
    zIndex: -1,
    borderRadius: '22px',
    opacity: 0.13,
  }
};

const serviceCardStyles = {
  ...cardStyles,
  background: 'linear-gradient(145deg, rgba(23, 32, 48, 0.95), rgba(23, 32, 48, 0.85))',
  border: '1px solid rgba(0, 242, 254, 0.2)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 242, 254, 0.3)',
    border: '1px solid rgba(0, 242, 254, 0.4)',
  },
  transition: 'all 0.3s ease',
};

const tutorCardStyles = {
  ...cardStyles,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 242, 254, 0.2)',
  },
  transition: 'all 0.3s ease',
};

const BookOnline = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State variables
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);
  const [openSolutionDialog, setOpenSolutionDialog] = useState(false);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [tutorBookings, setTutorBookings] = useState([]);
  const [studentBookings, setStudentBookings] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadingSolution, setUploadingSolution] = useState(false);
  const [uploadingBookingId, setUploadingBookingId] = useState(null);
  const [bookingData, setBookingData] = useState({
    service: '',
    tutor: '',
    date: null,
    time: null,
    duration: '2',
    notes: '',
    file: null,
    subject: '',
    topics: '',
    goals: '',
    topic: '',
    description: '',
    groupSize: '',
    examType: '',
    examDate: '',
    difficulty: ''
  });
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [workType, setWorkType] = useState('');
  const [workDescription, setWorkDescription] = useState('');

  // Add a helper function to check if user is a tutor
  const isTutor = user?.role === 'tutor';

  // Add fetchServices function before useEffect
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      if (response.data && Array.isArray(response.data)) {
        // Map the services to ensure consistent ID field
        const mappedServices = response.data.map(service => ({
          ...service,
          id: service._id || service.id // Ensure we have an id field
        }));
        setServices(mappedServices);
      } else {
        // Map default services to ensure consistent ID field
        const mappedDefaultServices = defaultServices.map(service => ({
          ...service,
          _id: service.id, // Add _id field for consistency
          id: service.id // Ensure id field exists
        }));
        setServices(mappedDefaultServices);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Map default services as fallback
      const mappedDefaultServices = defaultServices.map(service => ({
        ...service,
        _id: service.id,
        id: service.id
      }));
      setServices(mappedDefaultServices);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Failed to load services',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    // Load services as soon as the component mounts
    fetchServices();
    
    // Fetch tutors only if user is logged in as a student
    if (user && user.role === 'student') {
      fetchTutors();
    }

    // Load appropriate bookings based on user role
    if (user) {
      if (user.role === 'tutor') {
        fetchTutorBookings();
      } else if (user.role === 'student') {
        fetchStudentBookings();
      }
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load conversations',
        severity: 'error'
      });
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const response = await api.get(`/conversations/${convId}/messages`);
      setMessages(response.data);
      setConversationId(convId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load messages',
        severity: 'error'
      });
    }
  };

  const fetchTutors = async () => {
    try {
      setLoading(true);
      console.log('Fetching tutors...');
      const response = await api.get('/users/tutors');
      console.log('Tutors response:', response.data);
      
      if (!response.data || response.data.length === 0) {
        console.log('No tutors found, using demo data');
        setTutors(defaultTutors);
      } else {
        setTutors(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setTutors(defaultTutors);
      setLoading(false);
    }
  };

  const handleTutorSelect = (tutor) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please log in to select a tutor',
        severity: 'error'
      });
      navigate('/login');
      return;
    }

    console.log('Selected tutor:', tutor);
    setSelectedTutor(tutor);
    setBookingData(prev => ({
      ...prev,
      tutor: tutor._id,
      tutorId: tutor._id
    }));
  };

  const handleBooking = (service) => {
    console.log('Selected service:', service);
    
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please log in to book a service',
        severity: 'error'
      });
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      setSnackbar({
        open: true,
        message: 'Only students can book services',
        severity: 'error'
      });
      return;
    }

    // Ensure we have a valid service ID
    const serviceId = service._id || service.id;
    if (!serviceId) {
      console.error('Invalid service object:', service);
      setSnackbar({
        open: true,
        message: 'Invalid service selected',
        severity: 'error'
      });
      return;
    }

    console.log('Setting service ID:', serviceId);
    
    setSelectedService({
      ...service,
      _id: serviceId,
      id: serviceId
    });
    
    setBookingData(prev => ({
      ...prev,
      service: serviceId,
      serviceId: serviceId
    }));
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedService) {
      setSnackbar({
        open: true,
        message: 'Please select a service',
        severity: 'error'
      });
      return;
    }

    if (activeStep === 1 && !selectedTutor) {
      setSnackbar({
        open: true,
        message: 'Please select a tutor',
        severity: 'error'
      });
      return;
    }

    if (activeStep === 2) {
      if (!selectedDate || !selectedTime) {
        setSnackbar({
          open: true,
          message: 'Please select both date and time',
          severity: 'error'
        });
        return;
      }

      // Create a new Date object for validation
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(selectedTime.getHours());
      selectedDateTime.setMinutes(selectedTime.getMinutes());
      
      const now = new Date();
      if (selectedDateTime <= now) {
        setSnackbar({
          open: true,
          message: 'Please select a future date and time',
          severity: 'error'
        });
        return;
      }

      // Validate time slot
      if (!validateTimeSlot(selectedDateTime, bookingData.duration)) {
        return;
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        return !selectedService;
      case 1:
        return !selectedTutor;
      case 2:
        return !selectedDate || !selectedTime || !bookingData.duration;
      default:
        return false;
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    if (name === 'tutor') {
      const selectedTutor = tutors.find(t => t._id === value);
      setSelectedTutor(selectedTutor);
      setBookingData(prev => ({
        ...prev,
        tutor: value
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
        setAssignmentFile(file);
        console.log('File selected:', file.name);
        setSnackbar({
          open: true,
          message: `File "${file.name}" selected`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Please upload a PDF file (max 10MB)',
          severity: 'error'
        });
      }
    }
  };

  const handleWorkTypeChange = (event) => {
    setWorkType(event.target.value);
  };

  const handleWorkDescriptionChange = (event) => {
    setWorkDescription(event.target.value);
  };

  const handleSubmitBooking = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      if (!selectedService || !selectedTutor || !selectedDate || !selectedTime) {
        setError('Please fill in all required fields');
        return;
      }

      // Validate service-specific fields
      switch (selectedService.title) {
        case 'Performance Review':
          if (!workType || !workDescription || !assignmentFile) {
            setError('Please provide all required information for the performance review');
            return;
          }
          break;
        case '1-on-1 Mentoring':
          if (!bookingData.subject || !bookingData.topics || !bookingData.goals) {
            setError('Please provide all required information for the mentoring session');
            return;
          }
          break;
        case 'Study Groups':
          if (!bookingData.topic || !bookingData.description || !bookingData.groupSize) {
            setError('Please provide all required information for the study group');
            return;
          }
          break;
        case 'Exam Preparation':
          if (!bookingData.examType || !bookingData.subject || !bookingData.examDate || !bookingData.difficulty) {
            setError('Please provide all required information for exam preparation');
            return;
          }
          break;
      }

      const formData = new FormData();
      formData.append('service', selectedService._id || selectedService.id);
      formData.append('tutor', selectedTutor._id);
      formData.append('date', selectedDate.toISOString());
      formData.append('startTime', selectedTime.toISOString());
      formData.append('duration', bookingData.duration);
      formData.append('amount', selectedService.price);
        formData.append('notes', bookingData.notes);
      formData.append('serviceTitle', selectedService.title);

      // Add service-specific data
      switch (selectedService.title) {
        case 'Performance Review':
          formData.append('workType', workType);
          formData.append('workDescription', workDescription);
      if (assignmentFile) {
        formData.append('assignmentFile', assignmentFile);
          }
          break;
        case '1-on-1 Mentoring':
          formData.append('subject', bookingData.subject);
          formData.append('topics', bookingData.topics);
          formData.append('goals', bookingData.goals);
          break;
        case 'Study Groups':
          formData.append('topic', bookingData.topic);
          formData.append('description', bookingData.description);
          formData.append('groupSize', bookingData.groupSize);
          break;
        case 'Exam Preparation':
          formData.append('examType', bookingData.examType);
          formData.append('subject', bookingData.subject);
          formData.append('examDate', bookingData.examDate);
          formData.append('difficulty', bookingData.difficulty);
          break;
      }

      const response = await api.post('/bookings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSnackbar({
        open: true,
        message: 'Booking submitted successfully',
        severity: 'success',
      });

      // Reset form
      setSelectedService(null);
      setSelectedTutor(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setWorkType('');
      setWorkDescription('');
      setAssignmentFile(null);
      setActiveStep(0);
      setBookingData({
        service: '',
        tutor: '',
        date: null,
        time: null,
        duration: '2',
        notes: '',
        file: null,
        subject: '',
        topics: '',
        goals: '',
        topic: '',
        description: '',
        groupSize: '',
        examType: '',
        examDate: '',
        difficulty: ''
      });

      // Navigate to dashboard or booking details
      navigate(`/dashboard`);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setError(error.response?.data?.message || 'Error submitting booking');
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error submitting booking',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTutorServiceClaim = async (service) => {
    try {
      // Make API call to register tutor for service
      await api.post('/tutor/services', {
        serviceId: service.id,
        tutorId: user.id
      });
      setSnackbar({
        open: true,
        message: 'Service added to your profile successfully!',
        severity: 'success'
      });
      setOpenDialog(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add service. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleOpenChat = async (contact) => {
    try {
      setSelectedContact(contact);
      console.log('Opening chat with contact:', contact);
      // Create or get existing conversation
      const response = await api.post('/conversations', {
        tutorId: user.role === 'student' ? contact._id : user._id,
        studentId: user.role === 'tutor' ? contact._id : user._id
      });
      console.log('Conversation response:', response.data);
      setConversationId(response.data._id);
      // Fetch messages for this conversation
      const messagesResponse = await api.get(`/conversations/${response.data._id}/messages`);
      console.log('Messages response:', messagesResponse.data);
      setMessages(messagesResponse.data);
      setOpenChatDialog(true);
    } catch (error) {
      console.error('Error opening chat:', error);
      setSnackbar({
        open: true,
        message: 'Failed to open chat. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversationId) return;
    try {
      console.log('Sending message:', {
        conversationId,
        content: messageText,
        sender: user._id,
        token: localStorage.getItem('token') ? 'Present' : 'Missing'
      });

      const response = await api.post(`/conversations/${conversationId}/messages`, {
        content: messageText
      });
      
      console.log('Message sent response:', response.data);
      
      // Add the new message to the messages list
      setMessages(prevMessages => [...prevMessages, response.data]);
      
      // Clear input
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send message. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSolutionUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
        setSolutionFile(file);
        console.log('Solution file selected:', file.name);
        setSnackbar({
          open: true,
          message: `Solution file "${file.name}" selected`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Please upload a PDF file (max 10MB)',
          severity: 'error'
        });
        setSolutionFile(null);
      }
    }
  };

  const handleSubmitSolution = async () => {
    try {
      if (!selectedBooking || !solutionFile) {
        setSnackbar({
          open: true,
          message: 'Please select a solution file',
          severity: 'error'
        });
        return;
      }

      setUploadingSolution(true);
      console.log('Starting solution upload for booking:', selectedBooking._id);
      console.log('File:', solutionFile.name);

      const formData = new FormData();
      formData.append('solutionFile', solutionFile);

      // Upload the solution file
      const response = await api.post(`/bookings/${selectedBooking._id}/solution`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Solution upload response:', response.data);

      // Update booking status to completed
      await api.put(`/bookings/${selectedBooking._id}/status`, {
        status: 'completed'
      });

      // Add notification for the student
      const notificationMessage = `Solution uploaded for booking ${selectedBooking._id}`;
      addNotification(notificationMessage, 'success');

      setSnackbar({
        open: true,
        message: 'Solution uploaded successfully! Student has been notified.',
        severity: 'success'
      });

      // Close dialog and reset state
      setOpenSolutionDialog(false);
      setSolutionFile(null);
      setSelectedBooking(null);

      // Refresh bookings list
      await fetchTutorBookings();

    } catch (error) {
      console.error('Solution upload error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to upload solution',
        severity: 'error'
      });
    } finally {
      setUploadingSolution(false);
    }
  };

  const handleDownloadAssignment = async (booking) => {
    try {
      const response = await api.get(`/bookings/${booking._id}/assignment`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assignment_${booking._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to download assignment',
        severity: 'error'
      });
    }
  };

  const handleDownloadSolution = async (booking) => {
    try {
      const response = await api.get(`/bookings/${booking._id}/solution`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `solution_${booking._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Mark solution as viewed
      await api.put(`/bookings/${booking._id}/solution-viewed`);
      
      // Update local state
      setStudentBookings(prev => 
        prev.map(b => 
          b._id === booking._id 
            ? { ...b, solutionViewed: true }
            : b
        )
      );

      // Remove the "New solution" notification if it exists
      setNotifications(prev => 
        prev.filter(n => !n.message.includes(`Solution for booking ${booking._id}`))
      );
    } catch (error) {
      console.error('Download error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to download solution',
        severity: 'error'
      });
    }
  };

  const renderTutorDashboard = () => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };

    console.log('Rendering tutor dashboard');
    console.log('Current tutor bookings:', tutorBookings);
    console.log('Loading state:', loading);
    console.log('Current user:', user);

    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Tutor Dashboard
        </Typography>
        <Box mb={3}>
          <Typography variant="h5" gutterBottom>
            My Bookings
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchTutorBookings}
            startIcon={<RefreshIcon />}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Refresh Bookings'}
          </Button>

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : tutorBookings.length === 0 ? (
            <Alert severity="info">You don't have any bookings yet</Alert>
          ) : (
            tutorBookings.map((booking) => (
              <Card 
                key={booking._id} 
                sx={{ 
                  ...cardStyles,
                  mb: 2, 
                  p: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">
                      {booking.service?.title || 'Untitled Service'}
                    </Typography>
                    <Typography variant="body1">
                      Student: {booking.student?.name || 'Unknown Student'}
                    </Typography>
                    <Typography variant="body2">
                      Booked: {formatDate(booking.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                      Due Date: {formatDate(booking.dueDate || booking.date || booking.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                      Status: {booking.status || 'pending'}
                    </Typography>
                    <Typography variant="body2">
                      Payment: {booking.paymentStatus || 'pending'}
                      {booking.paymentClaimed && ' (Claimed)'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {booking.hasAssignmentFile && (
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<CloudDownloadIcon />}
                          onClick={() => handleDownloadAssignment(booking)}
                        >
                          Download Assignment
                        </Button>
                      )}
                      {booking.hasSolutionFile ? (
                        <>
                          <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CloudDownloadIcon />}
                            onClick={() => handleDownloadSolution(booking)}
                          >
                            Download Solution
                          </Button>
                          {!booking.paymentClaimed && (
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<AttachMoneyIcon />}
                              onClick={() => claimPayment(booking._id)}
                              disabled={claiming}
                            >
                              {claiming ? <CircularProgress size={24} /> : 'Claim Payment'}
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<CloudUploadIcon />}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setOpenSolutionDialog(true);
                          }}
                        >
                          Upload Solution
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        startIcon={<ChatIcon />}
                        onClick={() => handleOpenChat(booking.student)}
                      >
                        Message Student
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            ))
          )}
        </Box>
      </Container>
    );
  };

  const fetchStudentBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching student bookings...');
      const response = await api.get('/bookings/my-bookings'); // Updated endpoint
      console.log('Student bookings response:', response.data);
      if (!response.data || response.data.length === 0) {
        console.log('No bookings found');
      }
      setStudentBookings(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student bookings:', error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to load bookings',
        severity: 'error'
      });
    }
  };

  const fetchTutorBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching tutor bookings...');
      const response = await api.get('/bookings/my-bookings');
      console.log('Tutor bookings response:', response.data);
      if (!response.data || response.data.length === 0) {
        console.log('No bookings found');
      }
      setTutorBookings(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tutor bookings:', error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to load bookings',
        severity: 'error'
      });
    }
  };

  const renderSolutionUploadDialog = () => {
    return (
      <Dialog
        open={openSolutionDialog}
        onClose={() => {
          setOpenSolutionDialog(false);
          setSolutionFile(null);
          setSelectedBooking(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Solution</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" gutterBottom>
              Please upload the solution file (PDF format, max 10MB)
            </Typography>
            
            <input
              type="file"
              accept=".pdf"
              onChange={handleSolutionUpload}
              style={{ display: 'none' }}
              id="solution-file-upload"
            />
            
            <Box sx={{ mt: 2, mb: 2 }}>
              <label htmlFor="solution-file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploadingSolution}
                >
                  Select PDF File
                </Button>
              </label>
              
              {solutionFile && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Selected file: {solutionFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {(solutionFile.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
              )}
            </Box>

            {uploadingSolution && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Uploading solution...</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenSolutionDialog(false);
              setSolutionFile(null);
              setSelectedBooking(null);
            }}
            disabled={uploadingSolution}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitSolution}
            disabled={!solutionFile || uploadingSolution}
            startIcon={uploadingSolution ? <CircularProgress size={20} /> : null}
          >
            Upload Solution
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderStudentBooking = () => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <Container>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Book a Service" />
            <Tab label="My Bookings" />
          </Tabs>
          {activeTab === 0 ? (
            <>
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
                  mb: 4,
                }}
              >
                Book a Tutorial
              </Typography>
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel 
                sx={{ 
                  mb: 4,
                  '& .MuiStepLabel-label': {
                    color: '#9fafef',
                    '&.Mui-active': {
                      color: '#00f2fe',
                    },
                    '&.Mui-completed': {
                      color: '#4facfe',
                    },
                  },
                  '& .MuiStepIcon-root': {
                    color: 'rgba(159, 175, 239, 0.3)',
                    '&.Mui-active': {
                      color: '#00f2fe',
                    },
                    '&.Mui-completed': {
                      color: '#4facfe',
                    },
                  },
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box>{getStepContent(activeStep)}</Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{
                    color: '#9fafef',
                    borderColor: '#9fafef',
                    '&:hover': {
                      borderColor: '#00f2fe',
                      color: '#00f2fe',
                    },
                    '&:disabled': {
                      color: 'rgba(159, 175, 239, 0.3)',
                      borderColor: 'rgba(159, 175, 239, 0.3)',
                    },
                  }}
                >
                  Back
                </Button>
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={isNextDisabled()}
                    sx={{
                      background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)',
                      color: '#0f1724',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #00f2fe 50%, #4facfe 100%)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(159, 175, 239, 0.1)',
                        color: 'rgba(159, 175, 239, 0.3)',
                      },
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmitBooking}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)',
                      color: '#0f1724',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #00f2fe 50%, #4facfe 100%)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(159, 175, 239, 0.1)',
                        color: 'rgba(159, 175, 239, 0.3)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
                  </Button>
                )}
              </Box>
            </>
          ) : (
            <>
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
                  mb: 4,
                }}
              >
                My Bookings
              </Typography>
              
              {/* Show notifications at the top */}
              {notifications.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  {notifications.map((notification) => (
                    <Alert
                      key={notification.id}
                      severity={notification.type}
                      sx={{ mb: 1 }}
                      onClose={() => {
                        setNotifications(prev => 
                          prev.filter(n => n.id !== notification.id)
                        );
                      }}
                    >
                      {notification.message}
                    </Alert>
                  ))}
                </Box>
              )}

              <Box mb={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={fetchStudentBookings}
                  startIcon={<RefreshIcon />}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Refresh Bookings'}
                </Button>

                {loading ? (
                  <CircularProgress />
                ) : studentBookings.length === 0 ? (
                  <Alert severity="info">You don't have any bookings yet</Alert>
                ) : (
                  studentBookings.map((booking) => (
                    <Card 
                      key={booking._id} 
                      sx={{ 
                        ...cardStyles,
                        mb: 2, 
                        p: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}
                    >
                      <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6">
                            {booking.service?.title || 'Assignment Help'}
                          </Typography>
                          <Typography variant="body1">
                            Tutor: {booking.tutor?.name || 'Not assigned'}
                          </Typography>
                          <Typography variant="body2">
                            Booked: {formatDate(booking.createdAt)}
                          </Typography>
                          <Typography variant="body2">
                            Due Date: {formatDate(booking.dueDate || booking.date || booking.createdAt)}
                          </Typography>
                          <Typography variant="body2">
                            Status: {booking.status || 'pending'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {booking.hasAssignmentFile && (
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<CloudDownloadIcon />}
                                onClick={() => handleDownloadAssignment(booking)}
                              >
                                Download My Assignment
                              </Button>
                            )}
                            {booking.hasSolutionFile && (
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  startIcon={<CloudDownloadIcon />}
                                  onClick={() => handleDownloadSolution(booking)}
                                >
                                  Download Solution
                                </Button>
                                {!booking.solutionViewed && (
                                  <Alert severity="info" sx={{ mt: 1 }}>
                                    New solution available! Click above to download.
                                  </Alert>
                                )}
                              </>
                            )}
                            {booking.tutor && (
                              <Button
                                variant="outlined"
                                startIcon={<ChatIcon />}
                                onClick={() => handleOpenChat(booking.tutor)}
                              >
                                Message Tutor
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  ))
                )}
              </Box>
            </>
          )}
        </Box>
      </Container>
    );
  };

  const handleDateChange = (newDate) => {
    console.log('Selected date:', newDate);
    setSelectedDate(newDate);
    // Reset time when date changes to avoid invalid combinations
    setSelectedTime(null);
    setBookingData(prev => ({
      ...prev,
      date: newDate,
      time: null
    }));
  };

  const handleTimeChange = (newTime) => {
    console.log('Selected time:', newTime);
    if (!newTime) return;

    // Format time as HH:mm
    const hours = newTime.getHours().toString().padStart(2, '0');
    const minutes = newTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    setSelectedTime(newTime);
    setBookingData(prev => ({
      ...prev,
      time: formattedTime
    }));

    // Validate time slot immediately
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(newTime.getHours());
    selectedDateTime.setMinutes(newTime.getMinutes());
    
    const now = new Date();
    if (selectedDateTime <= now) {
      setSnackbar({
        open: true,
        message: 'Please select a future time',
        severity: 'error'
      });
      setSelectedTime(null);
      setBookingData(prev => ({
        ...prev,
        time: null
      }));
      return;
    }

    const startHour = newTime.getHours();
    const endHour = startHour + parseInt(bookingData.duration, 10);
    if (startHour < 9 || endHour > 21) {
      setSnackbar({
        open: true,
        message: 'Selected time slot must be between 9 AM and 9 PM',
        severity: 'error'
      });
      setSelectedTime(null);
      setBookingData(prev => ({
        ...prev,
        time: null
      }));
      return;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card
                  sx={{
                    ...serviceCardStyles,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    border: selectedService?.id === service.id ? '2px solid #00f2fe' : serviceCardStyles.border,
                  }}
                  onClick={() => handleBooking(service)}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      '& .MuiSvgIcon-root': {
                        fontSize: '2rem',
                        color: '#00f2fe',
                        filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
                      }
                    }}>
                      {getServiceIcon(service.icon)}
                      <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                          ml: 2,
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '1.25rem',
                          textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {service.title}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#9fafef',
                        mb: 3,
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        opacity: 0.9,
                      }}
                    >
                      {service.description}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{
                        background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
                      }}
                    >
                      {formatCurrency(service.price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 1:
        return (
              <Grid container spacing={3}>
                {tutors.map((tutor) => (
                  <Grid item xs={12} sm={6} md={4} key={tutor._id}>
                    <Card
                      sx={{
                        ...tutorCardStyles,
                        height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                        cursor: 'pointer',
                    border: selectedTutor?._id === tutor._id ? '2px solid #1976d2' : 'none',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                      }}
                      onClick={() => handleTutorSelect(tutor)}
                    >
                      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>{tutor.name[0]}</Avatar>
                      <Typography variant="h6" component="div">
                        {tutor.name}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Experience: {tutor.experience} years
                        </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Rating: {tutor.rating}/5
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                      Completed: {tutor.completedAssignments} assignments
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
        );
      case 2:
        return (
          <Box sx={{ width: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      '& .MuiInputBase-root': {
                        color: '#000',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#000',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '& .MuiIconButton-root': {
                        color: '#000',
                      },
                    }}
                  />
              </Grid>
              <Grid item xs={12} md={6}>
                  <TimePicker
                    label="Select Time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      '& .MuiInputBase-root': {
                        color: '#000',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#000',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '& .MuiIconButton-root': {
                        color: '#000',
                      },
                    }}
                  />
              </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ width: '100%' }}>
            {selectedService?.title === 'Performance Review' ? (
              <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                    label="Type of Work"
                    value={workType}
                    onChange={handleWorkTypeChange}
                    required
                  >
                    <MenuItem value="assignment">Assignment</MenuItem>
                    <MenuItem value="report">Report</MenuItem>
                    <MenuItem value="project">Project</MenuItem>
                </TextField>
              </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Work Description"
                    value={workDescription}
                    onChange={handleWorkDescriptionChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    Upload Work
                  <input
                    type="file"
                      hidden
                    onChange={handleFileUpload}
                      ref={fileInputRef}
                    />
                    </Button>
                  {assignmentFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {assignmentFile.name}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            ) : selectedService?.title === '1-on-1 Mentoring' ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Subject"
                    value={bookingData.subject || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  >
                    <MenuItem value="mathematics">Mathematics</MenuItem>
                    <MenuItem value="physics">Physics</MenuItem>
                    <MenuItem value="chemistry">Chemistry</MenuItem>
                    <MenuItem value="biology">Biology</MenuItem>
                    <MenuItem value="computer_science">Computer Science</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
                    label="Topics to Cover"
                    value={bookingData.topics || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, topics: e.target.value }))}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Learning Goals"
                    value={bookingData.goals || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, goals: e.target.value }))}
                    required
                  />
                </Grid>
              </Grid>
            ) : selectedService?.title === 'Study Groups' ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Topic"
                    value={bookingData.topic || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, topic: e.target.value }))}
                    required
                  >
                    <MenuItem value="mathematics">Mathematics</MenuItem>
                    <MenuItem value="physics">Physics</MenuItem>
                    <MenuItem value="chemistry">Chemistry</MenuItem>
                    <MenuItem value="biology">Biology</MenuItem>
                    <MenuItem value="computer_science">Computer Science</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Group Description"
                    value={bookingData.description || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Preferred Group Size"
                    value={bookingData.groupSize || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, groupSize: e.target.value }))}
                    required
                    inputProps={{ min: 2, max: 10 }}
                  />
                </Grid>
              </Grid>
            ) : selectedService?.title === 'Exam Preparation' ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Exam Type"
                    value={bookingData.examType || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, examType: e.target.value }))}
                    required
                  >
                    <MenuItem value="midterm">Midterm</MenuItem>
                    <MenuItem value="final">Final</MenuItem>
                    <MenuItem value="entrance">Entrance Exam</MenuItem>
                    <MenuItem value="certification">Certification</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Subject"
                    value={bookingData.subject || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  >
                    <MenuItem value="mathematics">Mathematics</MenuItem>
                    <MenuItem value="physics">Physics</MenuItem>
                    <MenuItem value="chemistry">Chemistry</MenuItem>
                    <MenuItem value="biology">Biology</MenuItem>
                    <MenuItem value="computer_science">Computer Science</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Exam Date"
                    value={bookingData.examDate || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, examDate: e.target.value }))}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Difficulty Level"
                    value={bookingData.difficulty || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, difficulty: e.target.value }))}
                    required
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Assignment Description"
                    value={workDescription}
                    onChange={handleWorkDescriptionChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)',
                      color: '#fff',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)',
                      },
                    }}
                  >
                    Upload Assignment (PDF)
                    <input
                      type="file"
                      hidden
                      accept=".pdf"
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                    />
                  </Button>
                  {assignmentFile && (
                    <Typography variant="body2" sx={{ mt: 1, color: '#fff' }}>
                      Selected file: {assignmentFile.name}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            )}
            </Box>
        );
      case 4:
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Service: {selectedService?.title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Tutor: {selectedTutor?.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Date: {selectedDate ? formatDisplayDate(selectedDate) : 'Not selected'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Time: {selectedTime ? formatDisplayTime(selectedTime) : 'Not selected'}
                </Typography>
              </Grid>
              {selectedService?.title === 'Performance Review' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Work Type: {workType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Work Description: {workDescription}
                    </Typography>
                  </Grid>
                  {assignmentFile && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        File: {assignmentFile.name}
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
              {selectedService?.title === '1-on-1 Mentoring' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Subject: {bookingData.subject}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Topics to Cover: {bookingData.topics}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Learning Goals: {bookingData.goals}
                    </Typography>
                  </Grid>
                </>
              )}
              {selectedService?.title === 'Study Groups' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Topic: {bookingData.topic}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Group Description: {bookingData.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Preferred Group Size: {bookingData.groupSize}
                    </Typography>
                  </Grid>
                </>
              )}
              {selectedService?.title === 'Exam Preparation' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Exam Type: {bookingData.examType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Subject: {bookingData.subject}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Exam Date: {bookingData.examDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Difficulty Level: {bookingData.difficulty}
                    </Typography>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary">
                  Total Amount: {formatCurrency(selectedService?.price || 0)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  // Fix the isUserTutor function to correctly check user role
  const isUserTutor = () => {
    return user?.role === 'tutor';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup function when chat dialog is closed
  const handleCloseChat = () => {
    setOpenChatDialog(false);
    setMessages([]);
    setMessageText('');
    setConversationId(null);
    setSelectedContact(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const claimPayment = async (bookingId) => {
    try {
      setClaiming(true);
      await api.post(`/bookings/${bookingId}/claim-payment`);
      setClaiming(false);
      setSnackbar({
        open: true,
        message: 'Payment claimed successfully',
        severity: 'success'
      });
      fetchTutorBookings();
    } catch (error) {
      setClaiming(false);
      console.error('Error claiming payment:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to claim payment',
        severity: 'error'
      });
    }
  };

  const handleDurationChange = (event) => {
    console.log('Selected duration:', event.target.value);
    setBookingData(prev => ({
      ...prev,
      duration: event.target.value
    }));
  };

  const isTimeDisabled = (time) => {
    if (!selectedDate) return false;

    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(time.getHours());
    selectedDateTime.setMinutes(time.getMinutes());

    // Disable past times for today
    if (selectedDateTime <= new Date()) {
      return true;
    }

    // Only allow bookings between 9 AM and 9 PM
    const hour = time.getHours();
    return hour < 9 || hour >= 21;
  };

  const formatDisplayTime = (time) => {
    if (!time) return '';
    if (typeof time === 'string') return time;
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const validateTimeSlot = (selectedDateTime, duration) => {
    const startHour = selectedDateTime.getHours();
    const endHour = startHour + parseInt(duration, 10);

    // Check if booking starts and ends within allowed hours (9 AM - 9 PM)
    if (startHour < 9 || endHour > 21) {
      setSnackbar({
        open: true,
        message: 'Booking must be between 9 AM and 9 PM',
        severity: 'error'
      });
      return false;
    }

    return true;
  };

  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    console.log('Adding notification:', newNotification);
    setNotifications(prev => [...prev, newNotification]);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading tutors...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={containerStyles}>
      {user?.role === 'tutor' ? (
        renderTutorDashboard()
      ) : (
        <Container>
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  color: '#9fafef',
                  '&.Mui-selected': {
                    color: '#00f2fe',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#00f2fe',
                },
              }}
            >
              <Tab label="BOOK A SERVICE" />
              <Tab label="MY BOOKINGS" />
            </Tabs>

            {activeTab === 0 ? (
              <>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 700,
                    background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
                    mb: 4,
                  }}
                >
                  Book a Tutorial
                </Typography>

                <Stepper 
                  activeStep={activeStep} 
                  sx={{ 
                    mb: 4,
                    '& .MuiStepLabel-root .Mui-completed': {
                      color: '#00f2fe',
                    },
                    '& .MuiStepLabel-root .Mui-active': {
                      color: '#00f2fe',
                    },
                    '& .MuiStepLabel-label': {
                      color: '#9fafef',
                      '&.Mui-active': {
                        color: '#fff',
                      },
                    },
                  }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box sx={{ mt: 4 }}>
                  {getStepContent(activeStep)}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{
                      color: '#9fafef',
                      '&:hover': {
                        color: '#00f2fe',
                        background: 'rgba(0, 242, 254, 0.1)',
                      },
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={activeStep === steps.length - 1 ? handleSubmitBooking : handleNext}
                    disabled={isNextDisabled() || loading}
                    sx={{
                      background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)',
                      color: '#fff',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : activeStep === steps.length - 1 ? (
                      'Confirm Booking'
                    ) : (
                      'Next'
                    )}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 700,
                    background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
                    mb: 4,
                  }}
                >
                  My Bookings
                </Typography>
                {/* Show notifications at the top */}
                {notifications.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    {notifications.map((notification) => (
                      <Alert
                        key={notification.id}
                        severity={notification.type}
                        sx={{ mb: 1 }}
                        onClose={() => {
                          setNotifications(prev => 
                            prev.filter(n => n.id !== notification.id)
                          );
                        }}
                      >
                        {notification.message}
                      </Alert>
                    ))}
                  </Box>
                )}
                {/* Student bookings list */}
                {loading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : studentBookings.length === 0 ? (
                  <Alert severity="info">You don't have any bookings yet</Alert>
                ) : (
                  studentBookings.map((booking) => (
                    <Card 
                      key={booking._id} 
                      sx={{ 
                        ...cardStyles,
                        mb: 2, 
                        p: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}
                    >
                      <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6">
                            {booking.service?.title || 'Assignment Help'}
                          </Typography>
                          <Typography variant="body1">
                            Tutor: {booking.tutor?.name || 'Not assigned'}
                          </Typography>
                          <Typography variant="body2">
                            Booked: {formatDate(booking.createdAt)}
                          </Typography>
                          <Typography variant="body2">
                            Due Date: {formatDate(booking.dueDate || booking.date || booking.createdAt)}
                          </Typography>
                          <Typography variant="body2">
                            Status: {booking.status || 'pending'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {booking.hasAssignmentFile && (
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<CloudDownloadIcon />}
                                onClick={() => handleDownloadAssignment(booking)}
                              >
                                Download My Assignment
                              </Button>
                            )}
                            {booking.hasSolutionFile && (
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  startIcon={<CloudDownloadIcon />}
                                  onClick={() => handleDownloadSolution(booking)}
                                >
                                  Download Solution
                                </Button>
                                {!booking.solutionViewed && (
                                  <Alert severity="info" sx={{ mt: 1 }}>
                                    New solution available! Click above to download.
                                  </Alert>
                                )}
                              </>
                            )}
                            {booking.tutor && (
                              <Button
                                variant="outlined"
                                startIcon={<ChatIcon />}
                                onClick={() => handleOpenChat(booking.tutor)}
                              >
                                Message Tutor
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  ))
                )}
              </>
            )}
          </Box>
        </Container>
      )}
      {/* Chat Dialog */}
      <Dialog
        open={openChatDialog}
        onClose={handleCloseChat}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.95), rgba(17, 25, 40, 0.85))',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#fff',
          },
        }}
      >
        <DialogTitle>
          Chat with {selectedContact?.name}
          {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              height: 400,
              overflowY: 'auto',
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 2
            }}
          >
            {messages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: 'text.secondary'
                }}
              >
                <Typography>No messages yet. Start the conversation!</Typography>
              </Box>
            ) : (
              messages.map((message) => (
                <Box
                  key={message._id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender._id === user._id ? 'flex-end' : 'flex-start',
                    mb: 1,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: message.sender._id === user._id ? 'primary.main' : 'grey.100',
                      color: message.sender._id === user._id ? 'white' : 'text.primary',
                      borderRadius: message.sender._id === user._id ? '20px 20px 5px 20px' : '20px 20px 20px 5px'
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        opacity: 0.8
                      }}
                    >
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              multiline
              maxRows={4}
              size="small"
              disabled={!conversationId}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!messageText.trim() || !conversationId}
              sx={{ alignSelf: 'flex-end' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Solution Upload Dialog */}
      {renderSolutionUploadDialog()}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BookOnline;
