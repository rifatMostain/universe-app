const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/search', universityController.searchUniversities);
router.get('/autocomplete', universityController.autocomplete);
router.get('/filter-options', universityController.getFilterOptions);
router.get('/:id', universityController.getUniversityDetails);
router.get('/:universityId/programs/:programId', universityController.getProgramDetails);

// Protected routes (require authentication)
router.post('/recommendations', protect, universityController.getRecommendations);
router.put('/:universityId/update', protect, universityController.updateUniversityData);

module.exports = router;
