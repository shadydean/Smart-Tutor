const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for assignment files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = './uploads/assignments';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, 'assignment_' + Date.now() + path.extname(file.originalname));
  }
});

// Set up storage for solution files
const solutionStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = './uploads/solutions';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, 'solution_' + Date.now() + path.extname(file.originalname));
  }
});

const uploadAssignment = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

const uploadSolution = multer({ 
  storage: solutionStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

// Get all bookings (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('student', 'name email')
      .populate('tutor', 'name email')
      .populate('service', 'title price');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    console.log('Fetching bookings for user:', req.user._id);
    console.log('User role:', req.user.role);
    
    let query = {};
    
    // Build query based on user role
    if (req.user.role === 'tutor') {
      query = { tutor: req.user._id };
      console.log('Fetching tutor bookings with query:', query);
    } else {
      query = { student: req.user._id };
      console.log('Fetching student bookings with query:', query);
    }
    
    // Find bookings with populated fields
    const bookings = await Booking.find(query)
      .populate('student', 'name email')
      .populate('tutor', 'name email')
      .populate('service', 'title price')
      .sort('-createdAt');
    
    console.log(`Found ${bookings.length} bookings for ${req.user.role}`);
    
    // Log each booking for debugging
    bookings.forEach((booking, index) => {
      console.log(`Booking ${index + 1}:`, {
        id: booking._id,
        student: booking.student?._id,
        tutor: booking.tutor?._id,
        service: booking.service?.title,
        status: booking.status,
        createdAt: booking.createdAt
      });
    });
    
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message 
    });
  }
});

// Create booking with file upload
router.post('/', protect, uploadAssignment.single('assignmentFile'), async (req, res) => {
  try {
    console.log('Received booking request:', {
      body: req.body,
      user: req.user._id,
      file: req.file
    });

    // Check for required fields
    if (!req.body.service) {
      return res.status(400).json({ message: 'Service ID is required' });
    }
    
    if (!req.body.tutor) {
      return res.status(400).json({ message: 'Tutor ID is required' });
    }
    
    if (!req.body.date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    
    if (!req.body.startTime) {
      return res.status(400).json({ message: 'Start time is required' });
    }

    // Verify service exists
    const service = await Service.findById(req.body.service);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Verify tutor exists and is actually a tutor
    const tutor = await User.findById(req.body.tutor);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    if (tutor.role !== 'tutor') {
      return res.status(400).json({ message: 'Selected user is not a tutor' });
    }

    // Calculate end time
    const startTime = req.body.startTime;
    const duration = parseInt(req.body.duration || '1', 10);
    const [hours, minutes] = startTime.split(':');
    const endHours = parseInt(hours) + Math.floor(duration);
    const endMinutes = parseInt(minutes) + ((duration % 1) * 60);
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

    // Create booking data
    const bookingData = {
      service: req.body.service,
      student: req.user._id,
      tutor: req.body.tutor,
      date: new Date(req.body.date),
      startTime: startTime,
      endTime: endTime,
      status: 'pending',
      paymentStatus: 'pending',
      amount: req.body.amount || service.price || 30,
      notes: req.body.notes || '',
      duration: duration
    };

    // Add assignment file if uploaded
    if (req.file) {
      console.log('Assignment file uploaded:', req.file);
      bookingData.assignmentFile = req.file.path;
      bookingData.hasAssignmentFile = true;
    }

    console.log('Creating booking with data:', bookingData);

    // Create and save booking
    const booking = new Booking(bookingData);
    await booking.save();

    // Populate the saved booking with tutor and student details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('student', 'name email')
      .populate('tutor', 'name email')
      .populate('service', 'title price');

    // Return the populated booking
    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ 
      message: 'Error creating booking',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Update booking status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to update
    if (
      booking.tutor.toString() !== req.user._id.toString() &&
      booking.student.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = req.body.status;
    if (req.body.status === 'completed') {
      booking.paymentStatus = 'completed';
    }

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add feedback to booking
router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.student.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Only students can provide feedback' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only provide feedback for completed sessions' });
    }

    booking.feedback = {
      rating: req.body.rating,
      review: req.body.review,
      createdAt: Date.now()
    };

    await booking.save();

    // Update tutor's average rating
    const tutorBookings = await Booking.find({
      tutor: booking.tutor,
      'feedback.rating': { $exists: true }
    });

    const totalRating = tutorBookings.reduce((sum, b) => sum + b.feedback.rating, 0);
    const averageRating = totalRating / tutorBookings.length;

    await User.findByIdAndUpdate(booking.tutor, {
      averageRating: Math.round(averageRating * 10) / 10
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Download assignment file
router.get('/:id/assignment', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to download
    if (
      booking.tutor.toString() !== req.user._id.toString() &&
      booking.student.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!booking.assignmentFile) {
      return res.status(404).json({ message: 'No assignment file found' });
    }

    // Send the file
    res.download(booking.assignmentFile);
  } catch (err) {
    console.error('Error downloading assignment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload solution file
router.post('/:id/solution', protect, uploadSolution.single('solutionFile'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to update
    if (
      booking.tutor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Only tutors can upload solutions' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No solution file uploaded' });
    }

    // Update booking with solution file
    booking.solutionFile = req.file.path;
    booking.hasSolutionFile = true;
    booking.solutionUploadedAt = Date.now();
    
    await booking.save();
    
    res.json({ 
      message: 'Solution uploaded successfully',
      booking: {
        _id: booking._id,
        hasSolutionFile: booking.hasSolutionFile,
        solutionUploadedAt: booking.solutionUploadedAt
      }
    });
  } catch (err) {
    console.error('Error uploading solution:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download solution file
router.get('/:id/solution', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to download
    if (
      booking.tutor.toString() !== req.user._id.toString() &&
      booking.student.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!booking.solutionFile) {
      return res.status(404).json({ message: 'No solution file found' });
    }

    // Send the file
    res.download(booking.solutionFile);
  } catch (err) {
    console.error('Error downloading solution:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tutor's bookings
router.get('/tutor', protect, async (req, res) => {
  try {
    // Ensure the user is a tutor
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Access denied. Only tutors can access this endpoint.' });
    }

    console.log('Fetching bookings for tutor:', req.user._id);
    
    // Find all bookings for this tutor
    const bookings = await Booking.find({ tutor: req.user._id })
      .populate('student', 'name email profileImage')
      .populate('service', 'title price duration')
      .sort('-createdAt');
    
    console.log(`Found ${bookings.length} bookings for tutor`);
    
    // Transform the data to include file status
    const transformedBookings = bookings.map(booking => {
      return {
        _id: booking._id,
        student: booking.student,
        service: booking.service,
        serviceTitle: booking.serviceTitle || booking.service?.title || 'Service',
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        amount: booking.amount,
        duration: booking.duration,
        notes: booking.notes,
        createdAt: booking.createdAt,
        hasAssignmentFile: booking.hasAssignmentFile || false,
        hasSolutionFile: booking.hasSolutionFile || false,
        solutionUploadedAt: booking.solutionUploadedAt
      };
    });
    
    res.json(transformedBookings);
  } catch (err) {
    console.error('Error fetching tutor bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim payment for a booking
router.post('/:id/claim-payment', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure the user is the tutor for this booking
    if (booking.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only the assigned tutor can claim payment.' });
    }

    // Check if solution has been uploaded
    if (!booking.hasSolutionFile) {
      return res.status(400).json({ 
        message: 'Cannot claim payment until solution is uploaded. Please upload your solution first.' 
      });
    }

    // Check if payment has already been claimed
    if (booking.paymentClaimed) {
      return res.status(400).json({ message: 'Payment has already been claimed for this booking.' });
    }

    // Update booking status
    booking.paymentClaimed = true;
    booking.paymentClaimedAt = new Date();
    booking.paymentStatus = 'claimed';
    
    // If specified, update the payment method
    if (req.body.paymentMethod) {
      booking.paymentMethod = req.body.paymentMethod;
    }
    
    // Save the changes
    await booking.save();
    
    // Return success response
    res.json({ 
      message: 'Payment claimed successfully', 
      booking: {
        _id: booking._id,
        amount: booking.amount,
        paymentClaimed: booking.paymentClaimed,
        paymentClaimedAt: booking.paymentClaimedAt,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus
      }
    });
  } catch (err) {
    console.error('Error claiming payment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark solution as viewed
router.put('/:id/solution-viewed', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to mark solution as viewed
    if (booking.student.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update the booking
    booking.solutionViewed = true;
    await booking.save();

    res.json({
      message: 'Solution marked as viewed',
      booking: {
        _id: booking._id,
        solutionViewed: booking.solutionViewed
      }
    });
  } catch (err) {
    console.error('Error marking solution as viewed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
