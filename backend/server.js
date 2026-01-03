require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS Configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://universe-app-e19b.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to UniVerse API',
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime()
  });
});

// API Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');
const universityRecommendationRoutes = require('./routes/universityRecommendations');
const applicationGuidanceRoutes = require('./routes/applicationGuidance');

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/universities', universityRecommendationRoutes);
app.use('/api/application-guidance', applicationGuidanceRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/universe';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Make sure MONGO_URI is set in .env file');
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Server configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
});

module.exports = app;
