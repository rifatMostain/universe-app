const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with AI assistant (streaming)
 * @access  Public
 */
router.post('/chat', aiController.chat);

/**
 * @route   POST /api/ai/save-message
 * @desc    Save chat message to database
 * @access  Protected
 */
router.post('/save-message', authMiddleware, aiController.saveChatMessage);

/**
 * @route   GET /api/ai/chat-history
 * @desc    Get chat history for logged-in user
 * @access  Protected
 */
router.get('/chat-history', authMiddleware, aiController.getChatHistory);

/**
 * @route   DELETE /api/ai/chat-history
 * @desc    Clear chat history
 * @access  Protected
 */
router.delete('/chat-history', authMiddleware, aiController.clearChatHistory);

/**
 * @route   POST /api/ai/country-recommendations
 * @desc    Get country recommendations based on quiz (streaming)
 * @access  Public
 */
router.post('/country-recommendations', aiController.getCountryRecommendations);

/**
 * @route   POST /api/ai/generate-sop
 * @desc    Generate Statement of Purpose (streaming)
 * @access  Protected
 */
router.post('/generate-sop', authMiddleware, aiController.generateSOP);

/**
 * @route   POST /api/ai/recommendations
 * @desc    Get university recommendations
 * @access  Protected
 */
router.post('/recommendations', authMiddleware, aiController.getUniversityRecommendations);

/**
 * @route   POST /api/ai/query
 * @desc    General query about studying abroad
 * @access  Protected
 */
router.post('/query', authMiddleware, aiController.generalQuery);

module.exports = router;
