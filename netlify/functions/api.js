const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock API endpoints for demo
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, role } = req.body;
  
  // Mock registration - in real app, this would connect to Supabase
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Mock successful registration
  res.status(201).json({
    message: 'User created successfully',
    token: 'mock_jwt_token_' + Date.now(),
    user: {
      id: 'user_' + Date.now(),
      email,
      name,
      role
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock login - in real app, this would verify with Supabase
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Mock successful login
  res.json({
    message: 'Login successful',
    token: 'mock_jwt_token_' + Date.now(),
    user: {
      id: 'user_' + Date.now(),
      email,
      name: 'Demo User',
      role: 'student'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  // Mock user data
  res.json({
    user: {
      id: 'user_123',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'student'
    }
  });
});

// Mock other endpoints
app.get('/api/quizzes', (req, res) => {
  res.json({
    quizzes: [
      {
        id: '1',
        title: 'Earthquake Safety Quiz',
        description: 'Test your earthquake safety knowledge',
        category: 'earthquake',
        difficulty: 'easy',
        questions: [
          {
            id: 1,
            question: 'What should you do during an earthquake?',
            options: ['Run outside', 'Drop, Cover, and Hold On', 'Stand in doorway', 'Go to basement'],
            correct_answer: 1
          }
        ]
      }
    ]
  });
});

app.get('/api/videos', (req, res) => {
  res.json({
    videos: [
      {
        id: '1',
        title: 'Earthquake Preparedness Guide',
        description: 'Learn how to prepare for earthquakes',
        type: 'youtube',
        url: 'dQw4w9WgXcQ',
        category: 'earthquake',
        duration: 600
      }
    ]
  });
});

app.get('/api/drills', (req, res) => {
  res.json({
    drills: [
      {
        id: '1',
        title: 'Earthquake Drill - Building A',
        type: 'earthquake',
        scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Building A - Ground Floor',
        status: 'scheduled'
      }
    ]
  });
});

app.get('/api/emergency/contacts', (req, res) => {
  res.json({
    contacts: [
      {
        id: '1',
        name: 'Emergency Services',
        phone: '+1-911',
        email: 'emergency@school.edu',
        department: 'Emergency Response',
        priority: 1
      }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports.handler = serverless(app);
