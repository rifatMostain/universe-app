const express = require('express');
const router = express.Router();
const applicationGuidanceController = require('../controllers/applicationGuidanceController');

/**
 * @route   POST /api/application-guidance
 * @desc    Get step-by-step application guidance (streaming)
 * @access  Public
 */
router.post('/', applicationGuidanceController.getApplicationGuidance);

module.exports = router;
