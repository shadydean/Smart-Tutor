require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const blogRoutes = require('./routes/blogs');
const tutorRoutes = require('./routes/tutors');
const dashboardRoutes = require('./routes/dashboard');
const conversationRoutes = require('./routes/conversations');
const messageRoutes = require('./routes/messages');
const discussionRoutes = require('./routes/discussions');
const assignmentRoutes = require('./routes/assignments');

// Import service model to seed initial data
const Service = require('./models/Service');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join a room based on user ID
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle new messages
  socket.on('sendMessage', async (message) => {
    try {
      console.log('Received message:', message);
      
      // Emit to both sender and receiver
      io.to(message.sender._id).to(message.receiver._id).emit('newMessage', {
        _id: message._id,
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
        conversationId: message.conversationId,
        createdAt: message.createdAt
      });

      console.log('Message broadcasted to users:', message.sender._id, message.receiver._id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle typing status
  socket.on('typing', (data) => {
    socket.to(data.receiverId).emit('userTyping', {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to protect uploaded files
const protectUploads = (req, res, next) => {
  // Check if the request is for an assignment file
  if (req.path.startsWith('/assignments/')) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    next();
  }
};

// Static files
app.use('/uploads', protectUploads, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/assignments', assignmentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });
  res.status(500).json({ message: err.message });
});

// Function to seed initial service data
const seedServices = async () => {
  try {
    // Check if we already have services
    const serviceCount = await Service.countDocuments();
    if (serviceCount > 0) {
      console.log('Services already exist, skipping seed');
      return;
    }

    console.log('Seeding initial services data...');
    
    const initialServices = [
      {
        id: '1',
        title: "Assignment Help",
        description: "Get expert help with your assignments, homework, and projects",
        category: 'Assignment Help',
        price: 30,
        duration: 60
      },
      {
        id: '2',
        title: "Performance Review",
        description: "Get detailed feedback on your work and performance",
        category: 'Performance Review',
        price: 40,
        duration: 60
      },
      {
        id: '3',
        title: "1-on-1 Mentoring",
        description: "Personalized tutoring sessions tailored to your learning needs",
        category: '1-on-1 Mentoring',
        price: 20,
        duration: 60
      },
      {
        id: '4',
        title: "Study Groups",
        description: "Learn collaboratively with peers in small group settings",
        category: 'Study Groups',
        price: 35,
        duration: 120
      },
      {
        id: '5',
        title: "Exam Preparation",
        description: "Comprehensive preparation for tests and examinations",
        category: 'Exam Preparation',
        price: 45,
        duration: 90
      }
    ];

    await Service.insertMany(initialServices);
    console.log('Successfully seeded services data');
  } catch (error) {
    console.error('Error seeding services:', error);
  }
};

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartytuty';
console.log('Connecting to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    return seedServices();
  })
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't exit the process in development
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit the process in development
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});
