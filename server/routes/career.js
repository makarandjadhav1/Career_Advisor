const express = require('express');
const { body, validationResult } = require('express-validator');
const CareerPath = require('../models/CareerPath');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// Get career recommendations for user
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.assessmentResults || !user.assessmentResults.personalityType) {
      return res.status(400).json({ 
        message: 'Please complete an assessment first to get personalized recommendations' 
      });
    }

    // Generate AI-powered career recommendations
    const recommendations = await aiService.generateCareerRecommendations(
      user.getPublicProfile(),
      user.assessmentResults
    );

    res.json({
      recommendations: recommendations.recommendations,
      summary: recommendations.summary,
      userProfile: {
        personalityType: user.assessmentResults.personalityType,
        learningStyle: user.assessmentResults.learningStyle,
        strengths: user.assessmentResults.strengths
      }
    });
  } catch (error) {
    console.error('Get career recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all career paths with filters
router.get('/paths', async (req, res) => {
  try {
    const { 
      industry, 
      category, 
      educationLevel, 
      marketDemand,
      page = 1, 
      limit = 10 
    } = req.query;

    const filter = { isActive: true };
    
    if (industry) filter.industry = industry;
    if (category) filter.category = category;
    if (educationLevel) filter['educationRequirements.minimum'] = educationLevel;
    if (marketDemand) filter['growthProspects.marketDemand'] = marketDemand;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const careerPaths = await CareerPath.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'growthProspects.marketDemand': -1, createdAt: -1 });

    const total = await CareerPath.countDocuments(filter);

    res.json({
      careerPaths: careerPaths.map(career => career.getSummary()),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get career paths error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific career path details
router.get('/paths/:careerId', async (req, res) => {
  try {
    const { careerId } = req.params;
    
    const careerPath = await CareerPath.findById(careerId);
    
    if (!careerPath || !careerPath.isActive) {
      return res.status(404).json({ message: 'Career path not found' });
    }

    res.json({ careerPath });
  } catch (error) {
    console.error('Get career path details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search career paths
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const filter = {
      isActive: true,
      $text: { $search: q }
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const careerPaths = await CareerPath.find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CareerPath.countDocuments(filter);

    res.json({
      careerPaths: careerPaths.map(career => career.getSummary()),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      },
      query: q
    });
  } catch (error) {
    console.error('Search career paths error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get market insights for specific industry/location
router.get('/market-insights', auth, async (req, res) => {
  try {
    const { industry, location } = req.query;
    
    if (!industry) {
      return res.status(400).json({ message: 'Industry parameter is required' });
    }

    const userLocation = location || `${req.user.location.city}, ${req.user.location.state}`;
    
    const insights = await aiService.generateMarketInsights(industry, userLocation);

    res.json({
      industry,
      location: userLocation,
      insights
    });
  } catch (error) {
    console.error('Get market insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Compare career paths
router.post('/compare', auth, [
  body('careerIds').isArray({ min: 2, max: 4 }).withMessage('Please select 2-4 careers to compare')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { careerIds } = req.body;
    
    const careerPaths = await CareerPath.find({
      _id: { $in: careerIds },
      isActive: true
    });

    if (careerPaths.length !== careerIds.length) {
      return res.status(400).json({ message: 'One or more career paths not found' });
    }

    // Create comparison data
    const comparison = {
      careers: careerPaths.map(career => ({
        id: career._id,
        title: career.title,
        industry: career.industry,
        category: career.category,
        educationRequired: career.educationRequirements.minimum,
        entryLevelSalary: career.experience.entryLevel.salaryRange,
        marketDemand: career.growthProspects.marketDemand,
        topSkills: career.skills.technical.slice(0, 5).map(s => s.skill),
        workEnvironment: career.workEnvironment,
        growthRate: career.growthProspects.growthRate,
        certifications: career.certifications.slice(0, 3).map(c => c.name)
      })),
      comparison: {
        salaryRange: {
          min: Math.min(...careerPaths.map(c => c.experience.entryLevel.salaryRange.min)),
          max: Math.max(...careerPaths.map(c => c.experience.entryLevel.salaryRange.max))
        },
        commonSkills: getCommonSkills(careerPaths),
        marketDemand: careerPaths.map(c => ({
          career: c.title,
          demand: c.growthProspects.marketDemand
        }))
      }
    };

    res.json({ comparison });
  } catch (error) {
    console.error('Compare career paths error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get career path learning recommendations
router.get('/paths/:careerId/learning', auth, async (req, res) => {
  try {
    const { careerId } = req.params;
    
    const careerPath = await CareerPath.findById(careerId);
    
    if (!careerPath || !careerPath.isActive) {
      return res.status(404).json({ message: 'Career path not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Generate personalized learning path
    const learningPath = await aiService.generatePersonalizedLearningPath(
      user.getPublicProfile(),
      careerPath.title,
      {
        requiredSkills: careerPath.skills.technical.map(s => s.skill),
        currentSkills: user.skills.map(s => s.name)
      }
    );

    res.json({
      careerPath: careerPath.title,
      learningPath,
      careerDetails: {
        requiredSkills: careerPath.skills.technical,
        certifications: careerPath.certifications,
        learningPath: careerPath.learningPath
      }
    });
  } catch (error) {
    console.error('Get learning path error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get career statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await CareerPath.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 },
          avgSalary: { $avg: '$experience.entryLevel.salaryRange.min' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const marketDemandStats = await CareerPath.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$growthProspects.marketDemand',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      industryStats: stats,
      marketDemandStats,
      totalCareers: await CareerPath.countDocuments({ isActive: true })
    });
  } catch (error) {
    console.error('Get career stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to get common skills across career paths
function getCommonSkills(careerPaths) {
  const skillCounts = {};
  
  careerPaths.forEach(career => {
    career.skills.technical.forEach(skill => {
      skillCounts[skill.skill] = (skillCounts[skill.skill] || 0) + 1;
    });
  });

  return Object.entries(skillCounts)
    .filter(([skill, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({ skill, frequency: count }));
}

module.exports = router;
