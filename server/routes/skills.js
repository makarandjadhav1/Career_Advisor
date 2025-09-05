const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const CareerPath = require('../models/CareerPath');
const { auth } = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// Get skills gap analysis for user
router.get('/gap-analysis', auth, async (req, res) => {
  try {
    const { careerPath } = req.query;
    
    if (!careerPath) {
      return res.status(400).json({ message: 'Career path parameter is required' });
    }

    const user = await User.findById(req.user._id);
    const career = await CareerPath.findById(careerPath);
    
    if (!career) {
      return res.status(404).json({ message: 'Career path not found' });
    }

    // Generate AI-powered skills gap analysis
    const gapAnalysis = await aiService.analyzeSkillsGap(
      user.skills,
      career.skills
    );

    res.json({
      careerPath: career.title,
      gapAnalysis,
      userSkills: user.skills,
      requiredSkills: career.skills
    });
  } catch (error) {
    console.error('Get skills gap analysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get personalized learning path
router.post('/learning-path', auth, [
  body('careerGoal').notEmpty().withMessage('Career goal is required'),
  body('timeCommitment').optional().isIn(['1-2 hours', '3-5 hours', '6-8 hours', 'full-time']).withMessage('Please select a valid time commitment'),
  body('budget').optional().isIn(['free', 'low', 'medium', 'high']).withMessage('Please select a valid budget range')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { careerGoal, timeCommitment = '3-5 hours', budget = 'low' } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Find matching career path
    const career = await CareerPath.findOne({
      title: { $regex: new RegExp(careerGoal, 'i') },
      isActive: true
    });

    if (!career) {
      return res.status(404).json({ message: 'Career path not found' });
    }

    // Generate personalized learning path
    const learningPath = await aiService.generatePersonalizedLearningPath(
      user.getPublicProfile(),
      careerGoal,
      {
        requiredSkills: career.skills.technical.map(s => s.skill),
        currentSkills: user.skills.map(s => s.name),
        timeCommitment,
        budget
      }
    );

    res.json({
      careerGoal,
      learningPath,
      userProfile: {
        currentSkills: user.skills,
        educationLevel: user.education.currentLevel,
        learningStyle: user.assessmentResults?.learningStyle
      }
    });
  } catch (error) {
    console.error('Get learning path error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get skill recommendations based on interests
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.interests || user.interests.length === 0) {
      return res.status(400).json({ 
        message: 'Please add your interests to get skill recommendations' 
      });
    }

    // Find careers matching user interests
    const interestCategories = user.interests.map(i => i.category);
    
    const matchingCareers = await CareerPath.find({
      industry: { $in: interestCategories },
      isActive: true
    }).limit(10);

    // Extract and analyze skills
    const skillRecommendations = analyzeSkillsFromCareers(matchingCareers, user.skills);

    res.json({
      skillRecommendations,
      basedOnInterests: user.interests,
      matchingCareers: matchingCareers.map(c => ({
        title: c.title,
        industry: c.industry,
        topSkills: c.skills.technical.slice(0, 3).map(s => s.skill)
      }))
    });
  } catch (error) {
    console.error('Get skill recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track skill progress
router.post('/progress', auth, [
  body('skillName').notEmpty().withMessage('Skill name is required'),
  body('newLevel').isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Please select a valid skill level'),
  body('evidence').optional().isArray().withMessage('Evidence must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { skillName, newLevel, evidence = [] } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Find existing skill or create new one
    const skillIndex = user.skills.findIndex(s => s.name === skillName);
    
    if (skillIndex >= 0) {
      // Update existing skill
      user.skills[skillIndex].level = newLevel;
      user.skills[skillIndex].updatedAt = new Date();
    } else {
      // Add new skill
      user.skills.push({
        name: skillName,
        level: newLevel,
        category: 'technical', // Default category
        evidence
      });
    }

    await user.save();

    res.json({
      message: 'Skill progress updated successfully',
      skill: {
        name: skillName,
        level: newLevel,
        evidence
      }
    });
  } catch (error) {
    console.error('Update skill progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get skill development roadmap
router.get('/roadmap/:skillName', auth, async (req, res) => {
  try {
    const { skillName } = req.params;
    
    const user = await User.findById(req.user._id);
    const currentSkill = user.skills.find(s => s.name === skillName);
    
    if (!currentSkill) {
      return res.status(404).json({ message: 'Skill not found in your profile' });
    }

    // Generate skill development roadmap
    const roadmap = generateSkillRoadmap(skillName, currentSkill.level);

    res.json({
      skill: skillName,
      currentLevel: currentSkill.level,
      roadmap
    });
  } catch (error) {
    console.error('Get skill roadmap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending skills
router.get('/trending', async (req, res) => {
  try {
    const { industry, timeframe = '6months' } = req.query;
    
    // This would typically come from external APIs or data sources
    // For now, we'll return mock trending skills
    const trendingSkills = getTrendingSkills(industry, timeframe);

    res.json({
      industry: industry || 'all',
      timeframe,
      trendingSkills
    });
  } catch (error) {
    console.error('Get trending skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get skill assessment questions
router.get('/assessment/:skillName', auth, async (req, res) => {
  try {
    const { skillName } = req.params;
    
    const questions = generateSkillAssessmentQuestions(skillName);

    res.json({
      skill: skillName,
      questions
    });
  } catch (error) {
    console.error('Get skill assessment questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit skill assessment
router.post('/assessment/:skillName', auth, [
  body('answers').isArray().withMessage('Answers must be an array'),
  body('answers.*.questionId').notEmpty().withMessage('Question ID is required'),
  body('answers.*.answer').notEmpty().withMessage('Answer is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { skillName } = req.params;
    const { answers } = req.body;
    
    // Calculate skill level based on answers
    const skillLevel = calculateSkillLevel(answers);
    
    // Update user's skill level
    const user = await User.findById(req.user._id);
    const skillIndex = user.skills.findIndex(s => s.name === skillName);
    
    if (skillIndex >= 0) {
      user.skills[skillIndex].level = skillLevel;
    } else {
      user.skills.push({
        name: skillName,
        level: skillLevel,
        category: 'technical'
      });
    }

    await user.save();

    res.json({
      message: 'Skill assessment completed',
      skill: skillName,
      assessedLevel: skillLevel,
      recommendations: getSkillRecommendations(skillName, skillLevel)
    });
  } catch (error) {
    console.error('Submit skill assessment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions
function analyzeSkillsFromCareers(careers, userSkills) {
  const skillFrequency = {};
  const userSkillNames = userSkills.map(s => s.name.toLowerCase());
  
  careers.forEach(career => {
    career.skills.technical.forEach(skill => {
      const skillName = skill.skill.toLowerCase();
      if (!skillFrequency[skillName]) {
        skillFrequency[skillName] = {
          name: skill.skill,
          frequency: 0,
          importance: skill.importance,
          level: skill.level
        };
      }
      skillFrequency[skillName].frequency++;
    });
  });

  return Object.values(skillFrequency)
    .filter(skill => !userSkillNames.includes(skill.name.toLowerCase()))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);
}

function generateSkillRoadmap(skillName, currentLevel) {
  const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const currentIndex = levels.indexOf(currentLevel);
  
  const roadmap = {
    currentLevel,
    nextLevel: currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null,
    steps: []
  };

  if (roadmap.nextLevel) {
    roadmap.steps = [
      {
        step: 1,
        title: `Master ${currentLevel} concepts`,
        description: `Ensure you have a solid foundation in ${currentLevel} level ${skillName}`,
        duration: '2-4 weeks'
      },
      {
        step: 2,
        title: `Learn ${roadmap.nextLevel} fundamentals`,
        description: `Start learning ${roadmap.nextLevel} level concepts`,
        duration: '4-6 weeks'
      },
      {
        step: 3,
        title: `Practice with projects`,
        description: `Apply your knowledge through practical projects`,
        duration: '6-8 weeks'
      }
    ];
  }

  return roadmap;
}

function getTrendingSkills(industry, timeframe) {
  // Mock trending skills - in a real implementation, this would come from external data
  const allTrendingSkills = [
    { name: 'Python', trend: 'up', growth: 25 },
    { name: 'Machine Learning', trend: 'up', growth: 30 },
    { name: 'Cloud Computing', trend: 'up', growth: 20 },
    { name: 'Data Science', trend: 'up', growth: 28 },
    { name: 'React', trend: 'up', growth: 15 },
    { name: 'DevOps', trend: 'up', growth: 22 }
  ];

  return allTrendingSkills.slice(0, 6);
}

function generateSkillAssessmentQuestions(skillName) {
  // Mock questions - in a real implementation, these would be more comprehensive
  return [
    {
      questionId: 'q1',
      question: `How would you rate your experience with ${skillName}?`,
      type: 'multiple-choice',
      options: ['No experience', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      questionId: 'q2',
      question: `Have you completed any projects using ${skillName}?`,
      type: 'multiple-choice',
      options: ['No', '1-2 projects', '3-5 projects', 'More than 5 projects']
    }
  ];
}

function calculateSkillLevel(answers) {
  // Simple scoring algorithm - in a real implementation, this would be more sophisticated
  let score = 0;
  
  answers.forEach(answer => {
    if (answer.questionId === 'q1') {
      const levels = ['No experience', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
      score += levels.indexOf(answer.answer);
    } else if (answer.questionId === 'q2') {
      const projects = ['No', '1-2 projects', '3-5 projects', 'More than 5 projects'];
      score += projects.indexOf(answer.answer);
    }
  });

  if (score <= 2) return 'beginner';
  if (score <= 4) return 'intermediate';
  if (score <= 6) return 'advanced';
  return 'expert';
}

function getSkillRecommendations(skillName, level) {
  const recommendations = {
    beginner: [
      'Take online courses',
      'Practice with tutorials',
      'Join beginner communities'
    ],
    intermediate: [
      'Work on real projects',
      'Contribute to open source',
      'Attend workshops'
    ],
    advanced: [
      'Mentor others',
      'Speak at conferences',
      'Build complex applications'
    ],
    expert: [
      'Lead technical teams',
      'Create educational content',
      'Consult for companies'
    ]
  };

  return recommendations[level] || [];
}

module.exports = router;
