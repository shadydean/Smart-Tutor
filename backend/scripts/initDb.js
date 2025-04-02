require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smarttutors';

const services = [
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
    duration: 60
  },
  {
    id: '5',
    title: "Exam Preparation",
    description: "Comprehensive preparation for tests and examinations",
    category: 'Exam Preparation',
    price: 45,
    duration: 60
  }
];

const tutors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    password: 'password123',
    role: 'tutor',
    subjects: ['Mathematics', 'Physics'],
    experience: '8 years',
    rating: 4.9
  },
  {
    name: 'Prof. Michael Chen',
    email: 'michael.chen@example.com',
    password: 'password123',
    role: 'tutor',
    subjects: ['Chemistry', 'Biology'],
    experience: '10 years',
    rating: 4.8
  },
  {
    name: 'Dr. Emily Brown',
    email: 'emily.brown@example.com',
    password: 'password123',
    role: 'tutor',
    subjects: ['Literature', 'History'],
    experience: '6 years',
    rating: 4.7
  }
];

async function initializeDb() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ role: 'tutor' });
    await Service.deleteMany({});
    console.log('Cleared existing tutors and services');

    // Create tutors
    const createdTutors = [];
    for (const tutorData of tutors) {
      const hashedPassword = await bcrypt.hash(tutorData.password, 10);
      const tutor = await User.create({
        ...tutorData,
        password: hashedPassword
      });
      createdTutors.push(tutor);
      console.log(`Created tutor: ${tutor.name}`);
    }

    // Create services and assign tutors
    await Service.insertMany(services);
    console.log('Added default services');

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDb();
