const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    required: [true, 'Gender is required']
  },
  location: {
    state: {
      type: String,
      required: [true, 'State is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  education: {
    currentLevel: {
      type: String,
      enum: ['10th', '12th', 'undergraduate', 'postgraduate', 'phd', 'working'],
      required: [true, 'Current education level is required']
    },
    stream: {
      type: String,
      enum: ['science', 'commerce', 'arts', 'engineering', 'medical', 'other']
    },
    specialization: String,
    institution: String,
    yearOfPassing: Number
  },
  interests: [{
    category: {
      type: String,
      enum: ['technology', 'business', 'arts', 'science', 'healthcare', 'education', 'finance', 'media', 'sports', 'other']
    },
    specificInterests: [String]
  }],
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    category: {
      type: String,
      enum: ['technical', 'soft', 'language', 'domain-specific']
    }
  }],
  careerGoals: {
    shortTerm: String,
    longTerm: String,
    preferredIndustries: [String],
    salaryExpectation: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    }
  },
  assessmentResults: {
    personalityType: String,
    learningStyle: String,
    workStyle: String,
    strengths: [String],
    areasForImprovement: [String],
    lastAssessmentDate: Date
  },
  preferences: {
    workEnvironment: {
      type: String,
      enum: ['remote', 'office', 'hybrid', 'field-work']
    },
    workSchedule: {
      type: String,
      enum: ['flexible', 'fixed', 'shift-based']
    },
    teamSize: {
      type: String,
      enum: ['small', 'medium', 'large', 'no-preference']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
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

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'location.state': 1, 'location.city': 1 });
userSchema.index({ 'education.currentLevel': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user profile without sensitive data
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
