const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected', 'upcoming', 'review_submitted', 'review_in_progress', 'review_completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded', 'claimed'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  meetingLink: {
    type: String
  },
  feedback: {
    rating: Number,
    review: String,
    createdAt: Date
  },
  assignmentFile: {
    type: String
  },
  hasAssignmentFile: {
    type: Boolean,
    default: false
  },
  solutionFile: {
    type: String
  },
  hasSolutionFile: {
    type: Boolean,
    default: false
  },
  solutionViewed: {
    type: Boolean,
    default: false
  },
  solutionUploadedAt: {
    type: Date
  },
  serviceTitle: {
    type: String
  },
  duration: {
    type: Number, // in hours
    default: 1
  },
  paymentClaimed: {
    type: Boolean,
    default: false
  },
  paymentClaimedAt: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'wallet'],
    default: 'wallet'
  },
  // Performance Review specific fields
  performanceReview: {
    submittedAt: Date,
    workType: {
      type: String,
      enum: ['assignment', 'report', 'project'],
      required: function() { return this.serviceTitle === 'Performance Review'; }
    },
    strengths: [String],
    weaknesses: [String],
    improvementAreas: [String],
    overallRating: {
      type: Number,
      min: 1,
      max: 5
    },
    detailedFeedback: String,
    followUpQuestions: [{
      question: String,
      answer: String,
      askedAt: Date,
      answeredAt: Date
    }],
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
