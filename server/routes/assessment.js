const express = require('express');
const { body, validationResult } = require('express-validator');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// Get available assessments
router.get('/available', auth, async (req, res) => {
  try {
    const assessments = [
      {
        type: 'personality',
        title: 'Personality Assessment',
        description: 'Discover your personality traits and work style preferences',
        duration: '10-15 minutes',
        questions: 30
      },
      {
        type: 'skills',
        title: 'Skills Assessment',
        description: 'Evaluate your current skills and identify areas for improvement',
        duration: '15-20 minutes',
        questions: 25
      },
      {
        type: 'interests',
        title: 'Interest Assessment',
        description: 'Explore your interests and find matching career paths',
        duration: '10-12 minutes',
        questions: 20
      },
      {
        type: 'aptitude',
        title: 'Aptitude Assessment',
        description: 'Test your natural abilities and cognitive strengths',
        duration: '20-25 minutes',
        questions: 35
      },
      {
        type: 'comprehensive',
        title: 'Comprehensive Assessment',
        description: 'Complete evaluation combining all assessment types',
        duration: '45-60 minutes',
        questions: 110
      }
    ];

    res.json({ assessments });
  } catch (error) {
    console.error('Get available assessments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start new assessment
router.post('/start', auth, [
  body('type').isIn(['personality', 'skills', 'interests', 'aptitude', 'comprehensive']).withMessage('Please select a valid assessment type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type } = req.body;

    // Check if user already has an incomplete assessment of this type
    const existingAssessment = await Assessment.findOne({
      userId: req.user._id,
      type,
      status: 'in-progress'
    });

    if (existingAssessment) {
      return res.json({
        message: 'Resuming existing assessment',
        assessment: existingAssessment
      });
    }

    // Generate questions based on assessment type
    const questions = generateQuestions(type);

    // Create new assessment
    const assessment = new Assessment({
      userId: req.user._id,
      type,
      questions,
      responses: [],
      status: 'in-progress'
    });

    await assessment.save();

    res.status(201).json({
      message: 'Assessment started successfully',
      assessment: assessment.getSummary()
    });
  } catch (error) {
    console.error('Start assessment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit assessment response
router.post('/:assessmentId/response', auth, [
  body('questionId').notEmpty().withMessage('Question ID is required'),
  body('answer').notEmpty().withMessage('Answer is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { assessmentId } = req.params;
    const { questionId, answer } = req.body;

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      userId: req.user._id,
      status: 'in-progress'
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found or already completed' });
    }

    // Check if question exists
    const question = assessment.questions.find(q => q.questionId === questionId);
    if (!question) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }

    // Check if response already exists
    const existingResponse = assessment.responses.find(r => r.questionId === questionId);
    if (existingResponse) {
      // Update existing response
      existingResponse.answer = answer;
      existingResponse.timestamp = new Date();
    } else {
      // Add new response
      assessment.responses.push({
        questionId,
        answer,
        timestamp: new Date()
      });
    }

    await assessment.save();

    res.json({
      message: 'Response saved successfully',
      progress: assessment.getCompletionPercentage()
    });
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete assessment
router.post('/:assessmentId/complete', auth, async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      userId: req.user._id,
      status: 'in-progress'
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found or already completed' });
    }

    // Check if all questions are answered
    if (assessment.responses.length < assessment.questions.length) {
      return res.status(400).json({ 
        message: 'Please complete all questions before submitting',
        progress: assessment.getCompletionPercentage()
      });
    }

    // Generate AI analysis
    const aiAnalysis = await aiService.analyzeAssessmentResults({
      type: assessment.type,
      responses: assessment.responses,
      questions: assessment.questions
    });

    // Calculate results based on responses
    const results = calculateAssessmentResults(assessment);

    // Update assessment with results
    assessment.results = results;
    assessment.aiAnalysis = aiAnalysis;
    assessment.status = 'completed';
    assessment.completedAt = new Date();

    await assessment.save();

    // Update user profile with assessment results
    await User.findByIdAndUpdate(req.user._id, {
      'assessmentResults.personalityType': results.personalityType,
      'assessmentResults.learningStyle': results.learningStyle,
      'assessmentResults.workStyle': results.workStyle,
      'assessmentResults.strengths': results.strengths,
      'assessmentResults.areasForImprovement': results.areasForImprovement,
      'assessmentResults.lastAssessmentDate': new Date()
    });

    res.json({
      message: 'Assessment completed successfully',
      results: assessment.results,
      aiAnalysis: assessment.aiAnalysis
    });
  } catch (error) {
    console.error('Complete assessment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assessment results
router.get('/:assessmentId/results', auth, async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      userId: req.user._id
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    if (assessment.status !== 'completed') {
      return res.status(400).json({ message: 'Assessment not completed yet' });
    }

    res.json({
      assessment: assessment.getSummary(),
      results: assessment.results,
      aiAnalysis: assessment.aiAnalysis
    });
  } catch (error) {
    console.error('Get assessment results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's assessment history
router.get('/history', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      assessments: assessments.map(assessment => assessment.getSummary())
    });
  } catch (error) {
    console.error('Get assessment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate questions based on type
function generateQuestions(type) {
  const questionTemplates = {
    personality: [
      {
        questionId: 'p1',
        question: 'I prefer working in a team rather than alone',
        category: 'social_preference',
        weight: 1
      },
      {
        questionId: 'p2',
        question: 'I enjoy taking on leadership roles',
        category: 'leadership',
        weight: 1
      },
      {
        questionId: 'p3',
        question: 'I prefer structured environments with clear rules',
        category: 'structure_preference',
        weight: 1
      }
      // Add more questions...
    ],
    skills: [
      {
        questionId: 's1',
        question: 'Rate your proficiency in programming',
        category: 'technical',
        weight: 1
      },
      {
        questionId: 's2',
        question: 'How comfortable are you with data analysis?',
        category: 'analytical',
        weight: 1
      }
      // Add more questions...
    ],
    interests: [
      {
        questionId: 'i1',
        question: 'I enjoy solving complex problems',
        category: 'problem_solving',
        weight: 1
      },
      {
        questionId: 'i2',
        question: 'I like working with technology and digital tools',
        category: 'technology',
        weight: 1
      }
      // Add more questions...
    ],
    aptitude: [
      {
        questionId: 'a1',
        question: 'I can quickly understand new concepts',
        category: 'learning_ability',
        weight: 1
      },
      {
        questionId: 'a2',
        question: 'I have strong mathematical reasoning skills',
        category: 'mathematical',
        weight: 1
      }
      // Add more questions...
    ],
    comprehensive: [
      // Combine all question types
    ]
  };

  return questionTemplates[type] || [];
}

// Helper function to calculate assessment results
function calculateAssessmentResults(assessment) {
  // This is a simplified calculation - in a real implementation,
  // you would have more sophisticated scoring algorithms
  
  const results = {
    personalityType: 'Analytical',
    personalityTraits: [
      { trait: 'Analytical', score: 85, description: 'Strong analytical thinking' },
      { trait: 'Creative', score: 70, description: 'Good creative problem solving' }
    ],
    skillsProfile: [
      { skill: 'Programming', currentLevel: 'Intermediate', potentialLevel: 'Advanced', gap: 'Practice more projects' }
    ],
    interestsProfile: [
      { category: 'Technology', score: 90, relatedCareers: ['Software Engineer', 'Data Scientist'] }
    ],
    aptitudes: [
      { area: 'Logical Reasoning', score: 85, percentile: 90 }
    ],
    learningStyle: {
      primary: 'Visual',
      secondary: 'Kinesthetic',
      characteristics: ['Prefers diagrams and charts', 'Learns by doing']
    },
    workStyle: {
      preferred: 'Collaborative',
      characteristics: ['Works well in teams', 'Enjoys brainstorming'],
      environment: 'Open office'
    },
    careerRecommendations: [
      {
        career: 'Software Engineer',
        matchScore: 88,
        reasoning: 'Strong technical aptitude and problem-solving skills',
        requiredSkills: ['Programming', 'Problem Solving'],
        growthPotential: 'High'
      }
    ],
    strengths: ['Analytical thinking', 'Problem solving', 'Learning ability'],
    areasForImprovement: ['Communication', 'Leadership'],
    nextSteps: ['Take programming courses', 'Join coding communities']
  };

  return results;
}

module.exports = router;
