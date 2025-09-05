const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['personality', 'skills', 'interests', 'aptitude', 'comprehensive'],
    required: true
  },
  questions: [{
    questionId: String,
    question: String,
    category: String,
    weight: Number
  }],
  responses: [{
    questionId: String,
    answer: mongoose.Schema.Types.Mixed,
    score: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  results: {
    personalityType: String,
    personalityTraits: [{
      trait: String,
      score: Number,
      description: String
    }],
    skillsProfile: [{
      skill: String,
      currentLevel: String,
      potentialLevel: String,
      gap: String
    }],
    interestsProfile: [{
      category: String,
      score: Number,
      relatedCareers: [String]
    }],
    aptitudes: [{
      area: String,
      score: Number,
      percentile: Number
    }],
    learningStyle: {
      primary: String,
      secondary: String,
      characteristics: [String]
    },
    workStyle: {
      preferred: String,
      characteristics: [String],
      environment: String
    },
    careerRecommendations: [{
      career: String,
      matchScore: Number,
      reasoning: String,
      requiredSkills: [String],
      growthPotential: String
    }],
    strengths: [String],
    areasForImprovement: [String],
    nextSteps: [String]
  },
  aiAnalysis: {
    summary: String,
    insights: [String],
    personalizedAdvice: String,
    riskFactors: [String],
    opportunities: [String]
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'pending-review'],
    default: 'in-progress'
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
assessmentSchema.index({ userId: 1, type: 1 });
assessmentSchema.index({ userId: 1, createdAt: -1 });
assessmentSchema.index({ status: 1 });

// Update timestamp on save
assessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate completion percentage
assessmentSchema.methods.getCompletionPercentage = function() {
  if (!this.questions || this.questions.length === 0) return 0;
  return Math.round((this.responses.length / this.questions.length) * 100);
};

// Get assessment summary
assessmentSchema.methods.getSummary = function() {
  return {
    id: this._id,
    type: this.type,
    status: this.status,
    completionPercentage: this.getCompletionPercentage(),
    createdAt: this.createdAt,
    completedAt: this.completedAt,
    hasResults: !!this.results
  };
};

module.exports = mongoose.model('Assessment', assessmentSchema);
