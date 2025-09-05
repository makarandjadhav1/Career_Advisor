const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    res.json({
      user: req.user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid Indian phone number'),
  body('location.state').optional().notEmpty().withMessage('State cannot be empty'),
  body('location.city').optional().notEmpty().withMessage('City cannot be empty'),
  body('location.pincode').optional().matches(/^\d{6}$/).withMessage('Please enter a valid 6-digit pincode'),
  body('education.stream').optional().isIn(['science', 'commerce', 'arts', 'engineering', 'medical', 'other']).withMessage('Please select a valid stream'),
  body('education.specialization').optional().trim(),
  body('education.institution').optional().trim(),
  body('education.yearOfPassing').optional().isInt({ min: 1950, max: new Date().getFullYear() + 5 }).withMessage('Please enter a valid year')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = [
      'name', 'phone', 'location', 'education', 'interests', 
      'skills', 'careerGoals', 'preferences'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add or update skills
router.post('/skills', auth, [
  body('skills').isArray().withMessage('Skills must be an array'),
  body('skills.*.name').notEmpty().withMessage('Skill name is required'),
  body('skills.*.level').isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Please select a valid skill level'),
  body('skills.*.category').isIn(['technical', 'soft', 'language', 'domain-specific']).withMessage('Please select a valid skill category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { skills } = req.body;
    
    // Update user skills
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { skills } },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Skills updated successfully',
      skills: user.skills
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add or update interests
router.post('/interests', auth, [
  body('interests').isArray().withMessage('Interests must be an array'),
  body('interests.*.category').isIn(['technology', 'business', 'arts', 'science', 'healthcare', 'education', 'finance', 'media', 'sports', 'other']).withMessage('Please select a valid interest category'),
  body('interests.*.specificInterests').isArray().withMessage('Specific interests must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { interests } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { interests } },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Interests updated successfully',
      interests: user.interests
    });
  } catch (error) {
    console.error('Update interests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update career goals
router.post('/career-goals', auth, [
  body('shortTerm').optional().trim().isLength({ max: 500 }).withMessage('Short-term goal cannot exceed 500 characters'),
  body('longTerm').optional().trim().isLength({ max: 500 }).withMessage('Long-term goal cannot exceed 500 characters'),
  body('preferredIndustries').optional().isArray().withMessage('Preferred industries must be an array'),
  body('salaryExpectation.min').optional().isInt({ min: 0 }).withMessage('Minimum salary must be a positive number'),
  body('salaryExpectation.max').optional().isInt({ min: 0 }).withMessage('Maximum salary must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { shortTerm, longTerm, preferredIndustries, salaryExpectation } = req.body;
    
    const careerGoals = {};
    if (shortTerm) careerGoals.shortTerm = shortTerm;
    if (longTerm) careerGoals.longTerm = longTerm;
    if (preferredIndustries) careerGoals.preferredIndustries = preferredIndustries;
    if (salaryExpectation) careerGoals.salaryExpectation = salaryExpectation;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { careerGoals } },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Career goals updated successfully',
      careerGoals: user.careerGoals
    });
  } catch (error) {
    console.error('Update career goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update preferences
router.post('/preferences', auth, [
  body('workEnvironment').optional().isIn(['remote', 'office', 'hybrid', 'field-work']).withMessage('Please select a valid work environment'),
  body('workSchedule').optional().isIn(['flexible', 'fixed', 'shift-based']).withMessage('Please select a valid work schedule'),
  body('teamSize').optional().isIn(['small', 'medium', 'large', 'no-preference']).withMessage('Please select a valid team size')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { workEnvironment, workSchedule, teamSize } = req.body;
    
    const preferences = {};
    if (workEnvironment) preferences.workEnvironment = workEnvironment;
    if (workSchedule) preferences.workSchedule = workSchedule;
    if (teamSize) preferences.teamSize = teamSize;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { preferences } },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete account
router.delete('/', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { isActive: false },
      { new: true }
    );

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
