const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { User } = require('../models');

/**
 * @route   GET /api/profile
 * @desc    Get user profile (protected route)
 * @access  Private
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        personal: user.personal,
        academic: user.academic,
        secondary: user.secondary,
        testScores: user.testScores,
        preferences: user.preferences,
        experience: user.experience,
        research: user.research,
        skills: user.skills,
        financial: user.financial,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Update user profile (protected route)
 * @access  Private
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, profileImage, personal, academic, secondary, testScores, preferences, experience, research, skills, financial } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (profileImage !== undefined) user.profileImage = profileImage;
    
    if (personal) {
      user.personal = user.personal || {};
      Object.assign(user.personal, personal);
      user.markModified('personal');
    }
    if (academic) {
      user.academic = user.academic || {};
      Object.assign(user.academic, academic);
      user.markModified('academic');
    }
    if (secondary) {
      user.secondary = user.secondary || {};
      Object.assign(user.secondary, secondary);
      user.markModified('secondary');
    }
    if (testScores) {
      user.testScores = user.testScores || {};
      if (testScores.ielts) {
        user.testScores.ielts = user.testScores.ielts || {};
        Object.assign(user.testScores.ielts, testScores.ielts);
      }
      if (testScores.toefl) {
        user.testScores.toefl = user.testScores.toefl || {};
        Object.assign(user.testScores.toefl, testScores.toefl);
      }
      if (testScores.gre) {
        user.testScores.gre = user.testScores.gre || {};
        Object.assign(user.testScores.gre, testScores.gre);
      }
      if (testScores.duolingo) {
        user.testScores.duolingo = user.testScores.duolingo || {};
        Object.assign(user.testScores.duolingo, testScores.duolingo);
      }
      if (testScores.gmat) {
        user.testScores.gmat = user.testScores.gmat || {};
        Object.assign(user.testScores.gmat, testScores.gmat);
      }
      user.markModified('testScores');
    }
    if (preferences) {
      user.preferences = user.preferences || {};
      Object.assign(user.preferences, preferences);
      user.markModified('preferences');
    }
    if (experience) user.experience = experience;
    if (research) {
      user.research = user.research || {};
      Object.assign(user.research, research);
      user.markModified('research');
    }
    if (skills) {
      user.skills = user.skills || {};
      Object.assign(user.skills, skills);
      user.markModified('skills');
    }
    if (financial) {
      user.financial = user.financial || {};
      Object.assign(user.financial, financial);
      user.markModified('financial');
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

/**
 * @route   GET /api/me
 * @desc    Get current user info (protected route)
 * @access  Private
 */
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      profile: req.user.profile
    }
  });
});

/**
 * @route   POST /api/profile/save-sop
 * @desc    Save SOP draft to user profile
 * @access  Private
 */
router.post('/profile/save-sop', authMiddleware, async (req, res) => {
  try {
    const { sopContent, targetUniversity, program, degreeLevel } = req.body;
    const user = req.user;

    if (!sopContent) {
      return res.status(400).json({ error: 'SOP content is required' });
    }

    // Initialize sopDrafts array if it doesn't exist
    if (!user.sopDrafts) {
      user.sopDrafts = [];
    }

    // Add new SOP draft
    user.sopDrafts.push({
      sopContent,
      targetUniversity: targetUniversity || '',
      program: program || '',
      degreeLevel: degreeLevel || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'SOP saved successfully',
      sopId: user.sopDrafts[user.sopDrafts.length - 1]._id
    });
  } catch (error) {
    console.error('Save SOP error:', error);
    res.status(500).json({ error: 'Failed to save SOP' });
  }
});

/**
 * @route   GET /api/profile/sop-drafts
 * @desc    Get all saved SOP drafts for user
 * @access  Private
 */
router.get('/profile/sop-drafts', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      sopDrafts: user.sopDrafts || []
    });
  } catch (error) {
    console.error('Get SOP drafts error:', error);
    res.status(500).json({ error: 'Failed to fetch SOP drafts' });
  }
});

/**
 * @route   DELETE /api/profile/sop-drafts/:sopId
 * @desc    Delete a specific SOP draft
 * @access  Private
 */
router.delete('/profile/sop-drafts/:sopId', authMiddleware, async (req, res) => {
  try {
    const { sopId } = req.params;
    const user = req.user;

    if (!user.sopDrafts) {
      return res.status(404).json({ error: 'No SOP drafts found' });
    }

    // Filter out the SOP draft with matching ID
    user.sopDrafts = user.sopDrafts.filter(
      sop => sop._id.toString() !== sopId
    );

    await user.save();

    res.json({
      success: true,
      message: 'SOP draft deleted successfully'
    });
  } catch (error) {
    console.error('Delete SOP error:', error);
    res.status(500).json({ error: 'Failed to delete SOP draft' });
  }
});

module.exports = router;
