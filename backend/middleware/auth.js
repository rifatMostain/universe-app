const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Middleware to verify JWT token and authenticate users
 * Checks the Authorization header for a Bearer token
 * Verifies JWT and attaches user info to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No token provided. Please include Authorization: Bearer <token> in headers.' 
      });
    }

    // Extract token
    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid token format' 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User not found' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Attach user to request object
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Token has expired. Please login again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid token provided' 
      });
    }

    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authentication failed' 
    });
  }
};

/**
 * Optional middleware to check if token exists but don't require it
 * Useful for routes that work differently for authenticated vs non-authenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user) {
        req.user = user;
        req.userId = user._id;
      }
    }
  } catch (error) {
    // Silently fail - user is not authenticated but that's okay
    console.log('Optional auth failed, continuing as unauthenticated');
  }
  
  next();
};

/**
 * Generate JWT token for user
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

module.exports = { authMiddleware, optionalAuth, generateToken };
