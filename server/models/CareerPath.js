const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true,
    enum: [
      'technology', 'healthcare', 'finance', 'education', 'manufacturing',
      'retail', 'media', 'government', 'non-profit', 'consulting',
      'real-estate', 'agriculture', 'tourism', 'logistics', 'energy'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: [
      'engineering', 'management', 'creative', 'analytical', 'service',
      'technical', 'sales', 'marketing', 'operations', 'research'
    ]
  },
  educationRequirements: {
    minimum: {
      type: String,
      enum: ['10th', '12th', 'diploma', 'bachelor', 'master', 'phd'],
      required: true
    },
    preferred: [String],
    specificDegrees: [String]
  },
  skills: {
    technical: [{
      skill: String,
      importance: {
        type: String,
        enum: ['essential', 'important', 'nice-to-have']
      },
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
      }
    }],
    soft: [{
      skill: String,
      importance: {
        type: String,
        enum: ['essential', 'important', 'nice-to-have']
      }
    }],
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['basic', 'intermediate', 'advanced', 'native']
      },
      required: Boolean
    }]
  },
  experience: {
    entryLevel: {
      description: String,
      typicalRoles: [String],
      salaryRange: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: 'INR'
        }
      }
    },
    midLevel: {
      description: String,
      typicalRoles: [String],
      salaryRange: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: 'INR'
        }
      }
    },
    seniorLevel: {
      description: String,
      typicalRoles: [String],
      salaryRange: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: 'INR'
        }
      }
    }
  },
  growthProspects: {
    marketDemand: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true
    },
    growthRate: {
      type: String,
      enum: ['fast', 'moderate', 'slow']
    },
    futureOutlook: String,
    emergingTrends: [String]
  },
  workEnvironment: {
    location: {
      type: String,
      enum: ['office', 'remote', 'field', 'hybrid']
    },
    schedule: {
      type: String,
      enum: ['regular', 'flexible', 'shift', 'project-based']
    },
    teamSize: {
      type: String,
      enum: ['individual', 'small', 'medium', 'large']
    },
    travel: {
      type: String,
      enum: ['none', 'occasional', 'frequent', 'extensive']
    }
  },
  personalityTraits: [{
    trait: String,
    importance: {
      type: String,
      enum: ['essential', 'important', 'nice-to-have']
    }
  }],
  relatedCareers: [{
    career: String,
    similarity: Number
  }],
  certifications: [{
    name: String,
    provider: String,
    importance: {
      type: String,
      enum: ['essential', 'important', 'nice-to-have']
    },
    cost: Number,
    duration: String
  }],
  learningPath: [{
    step: Number,
    title: String,
    description: String,
    duration: String,
    resources: [String],
    prerequisites: [String]
  }],
  indianContext: {
    topCompanies: [String],
    majorCities: [String],
    governmentOpportunities: [String],
    startupEcosystem: Boolean,
    skillGap: String,
    regionalVariations: [{
      region: String,
      opportunities: String,
      salaryAdjustment: Number
    }]
  },
  aiInsights: {
    automationRisk: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    futureSkills: [String],
    marketTrends: [String],
    recommendations: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
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
careerPathSchema.index({ industry: 1, category: 1 });
careerPathSchema.index({ 'skills.technical.skill': 1 });
careerPathSchema.index({ 'growthProspects.marketDemand': 1 });
careerPathSchema.index({ title: 'text', description: 'text' });

// Update timestamp on save
careerPathSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Get career summary
careerPathSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    industry: this.industry,
    category: this.category,
    marketDemand: this.growthProspects.marketDemand,
    entryLevelSalary: this.experience.entryLevel.salaryRange,
    educationRequired: this.educationRequirements.minimum,
    topSkills: this.skills.technical.slice(0, 5).map(s => s.skill)
  };
};

module.exports = mongoose.model('CareerPath', careerPathSchema);
