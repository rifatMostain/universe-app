const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getUniversityRecommendations,
  getAvailableCountries,
  getSystemInfo
} = require('../controllers/universityRecommendationController');

// Get university recommendations (protected route)
router.post('/recommendations', authMiddleware, getUniversityRecommendations);

// Get available countries
router.get('/countries', getAvailableCountries);

// Get system information
router.get('/info', getSystemInfo);

module.exports = router;
