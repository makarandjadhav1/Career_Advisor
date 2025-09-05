const mongoose = require('mongoose');
const CareerPath = require('../models/CareerPath');
require('dotenv').config();

const sampleCareerPaths = [
  {
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software applications and systems. Work with programming languages, frameworks, and development tools to create innovative solutions.',
    industry: 'technology',
    category: 'technical',
    educationRequirements: {
      minimum: 'bachelor',
      preferred: ['bachelor', 'master'],
      specificDegrees: ['Computer Science', 'Information Technology', 'Software Engineering']
    },
    skills: {
      technical: [
        { skill: 'Programming Languages', importance: 'essential', level: 'intermediate' },
        { skill: 'Data Structures & Algorithms', importance: 'essential', level: 'intermediate' },
        { skill: 'Database Management', importance: 'important', level: 'beginner' },
        { skill: 'Version Control (Git)', importance: 'important', level: 'beginner' },
        { skill: 'Software Testing', importance: 'important', level: 'beginner' },
        { skill: 'Cloud Computing', importance: 'nice-to-have', level: 'beginner' }
      ],
      soft: [
        { skill: 'Problem Solving', importance: 'essential' },
        { skill: 'Communication', importance: 'important' },
        { skill: 'Teamwork', importance: 'important' },
        { skill: 'Time Management', importance: 'important' }
      ],
      languages: [
        { language: 'English', proficiency: 'intermediate', required: true },
        { language: 'Hindi', proficiency: 'basic', required: false }
      ]
    },
    experience: {
      entryLevel: {
        description: 'Junior developer roles with basic programming tasks',
        typicalRoles: ['Junior Software Developer', 'Software Engineer Trainee', 'Associate Developer'],
        salaryRange: { min: 300000, max: 600000, currency: 'INR' }
      },
      midLevel: {
        description: 'Mid-level developer with 2-5 years experience',
        typicalRoles: ['Software Engineer', 'Senior Developer', 'Tech Lead'],
        salaryRange: { min: 600000, max: 1200000, currency: 'INR' }
      },
      seniorLevel: {
        description: 'Senior developer with 5+ years experience',
        typicalRoles: ['Senior Software Engineer', 'Principal Engineer', 'Engineering Manager'],
        salaryRange: { min: 1200000, max: 2500000, currency: 'INR' }
      }
    },
    growthProspects: {
      marketDemand: 'high',
      growthRate: 'fast',
      futureOutlook: 'Excellent growth prospects with increasing digitalization',
      emergingTrends: ['AI/ML Integration', 'Cloud-Native Development', 'DevOps Practices']
    },
    workEnvironment: {
      location: 'hybrid',
      schedule: 'flexible',
      teamSize: 'medium',
      travel: 'none'
    },
    personalityTraits: [
      { trait: 'Analytical Thinking', importance: 'essential' },
      { trait: 'Attention to Detail', importance: 'essential' },
      { trait: 'Creativity', importance: 'important' },
      { trait: 'Persistence', importance: 'important' }
    ],
    certifications: [
      { name: 'AWS Certified Developer', provider: 'Amazon', importance: 'important', cost: 15000, duration: '3 months' },
      { name: 'Google Cloud Professional Developer', provider: 'Google', importance: 'important', cost: 12000, duration: '2 months' },
      { name: 'Microsoft Azure Developer Associate', provider: 'Microsoft', importance: 'nice-to-have', cost: 10000, duration: '2 months' }
    ],
    learningPath: [
      {
        step: 1,
        title: 'Learn Programming Fundamentals',
        description: 'Master basic programming concepts and syntax',
        duration: '3-4 months',
        resources: ['Online courses', 'Coding bootcamps', 'Practice platforms'],
        prerequisites: ['Basic computer knowledge']
      },
      {
        step: 2,
        title: 'Choose a Specialization',
        description: 'Focus on web development, mobile apps, or backend systems',
        duration: '2-3 months',
        resources: ['Specialized courses', 'Project-based learning'],
        prerequisites: ['Programming fundamentals']
      },
      {
        step: 3,
        title: 'Build Real Projects',
        description: 'Create portfolio projects to showcase skills',
        duration: '2-4 months',
        resources: ['GitHub', 'Portfolio websites', 'Open source contributions'],
        prerequisites: ['Specialization knowledge']
      }
    ],
    indianContext: {
      topCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Accenture', 'Microsoft', 'Google', 'Amazon'],
      majorCities: ['Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Mumbai', 'Delhi'],
      governmentOpportunities: ['Digital India initiatives', 'Government IT projects', 'Public sector undertakings'],
      startupEcosystem: true,
      skillGap: 'High demand for skilled developers',
      regionalVariations: [
        { region: 'Tier 1 Cities', opportunities: 'High-paying roles in MNCs', salaryAdjustment: 1.2 },
        { region: 'Tier 2 Cities', opportunities: 'Growing IT hubs', salaryAdjustment: 0.8 },
        { region: 'Tier 3 Cities', opportunities: 'Remote work options', salaryAdjustment: 0.6 }
      ]
    },
    aiInsights: {
      automationRisk: 'low',
      futureSkills: ['AI/ML Integration', 'Cloud Architecture', 'DevOps', 'Cybersecurity'],
      marketTrends: ['Remote work adoption', 'Digital transformation', 'Startup ecosystem growth'],
      recommendations: ['Focus on cloud technologies', 'Learn AI/ML basics', 'Develop soft skills']
    }
  },
  {
    title: 'Data Scientist',
    description: 'Analyze complex data to extract insights and build predictive models. Use statistical methods, machine learning, and programming to solve business problems.',
    industry: 'technology',
    category: 'analytical',
    educationRequirements: {
      minimum: 'bachelor',
      preferred: ['master', 'phd'],
      specificDegrees: ['Data Science', 'Statistics', 'Mathematics', 'Computer Science']
    },
    skills: {
      technical: [
        { skill: 'Python Programming', importance: 'essential', level: 'intermediate' },
        { skill: 'R Programming', importance: 'important', level: 'intermediate' },
        { skill: 'Machine Learning', importance: 'essential', level: 'intermediate' },
        { skill: 'Statistics', importance: 'essential', level: 'intermediate' },
        { skill: 'SQL', importance: 'essential', level: 'intermediate' },
        { skill: 'Data Visualization', importance: 'important', level: 'beginner' }
      ],
      soft: [
        { skill: 'Critical Thinking', importance: 'essential' },
        { skill: 'Business Acumen', importance: 'important' },
        { skill: 'Communication', importance: 'important' },
        { skill: 'Problem Solving', importance: 'essential' }
      ],
      languages: [
        { language: 'English', proficiency: 'intermediate', required: true },
        { language: 'Hindi', proficiency: 'basic', required: false }
      ]
    },
    experience: {
      entryLevel: {
        description: 'Junior data scientist roles with basic analytics tasks',
        typicalRoles: ['Junior Data Scientist', 'Data Analyst', 'Business Analyst'],
        salaryRange: { min: 400000, max: 800000, currency: 'INR' }
      },
      midLevel: {
        description: 'Mid-level data scientist with 2-5 years experience',
        typicalRoles: ['Data Scientist', 'Senior Data Scientist', 'ML Engineer'],
        salaryRange: { min: 800000, max: 1500000, currency: 'INR' }
      },
      seniorLevel: {
        description: 'Senior data scientist with 5+ years experience',
        typicalRoles: ['Principal Data Scientist', 'Data Science Manager', 'Chief Data Officer'],
        salaryRange: { min: 1500000, max: 3000000, currency: 'INR' }
      }
    },
    growthProspects: {
      marketDemand: 'high',
      growthRate: 'fast',
      futureOutlook: 'Excellent growth with increasing data-driven decision making',
      emergingTrends: ['AI/ML Automation', 'Real-time Analytics', 'Edge Computing']
    },
    workEnvironment: {
      location: 'hybrid',
      schedule: 'flexible',
      teamSize: 'small',
      travel: 'occasional'
    },
    personalityTraits: [
      { trait: 'Analytical Thinking', importance: 'essential' },
      { trait: 'Curiosity', importance: 'essential' },
      { trait: 'Attention to Detail', importance: 'important' },
      { trait: 'Patience', importance: 'important' }
    ],
    certifications: [
      { name: 'Google Data Analytics Certificate', provider: 'Google', importance: 'important', cost: 8000, duration: '2 months' },
      { name: 'IBM Data Science Professional Certificate', provider: 'IBM', importance: 'important', cost: 10000, duration: '3 months' },
      { name: 'Microsoft Azure Data Scientist Associate', provider: 'Microsoft', importance: 'nice-to-have', cost: 12000, duration: '2 months' }
    ],
    learningPath: [
      {
        step: 1,
        title: 'Learn Programming & Statistics',
        description: 'Master Python/R and statistical concepts',
        duration: '4-6 months',
        resources: ['Online courses', 'Statistics textbooks', 'Practice datasets'],
        prerequisites: ['Basic mathematics']
      },
      {
        step: 2,
        title: 'Machine Learning Fundamentals',
        description: 'Learn ML algorithms and techniques',
        duration: '3-4 months',
        resources: ['ML courses', 'Kaggle competitions', 'Research papers'],
        prerequisites: ['Programming and statistics']
      },
      {
        step: 3,
        title: 'Real-world Projects',
        description: 'Work on end-to-end data science projects',
        duration: '3-6 months',
        resources: ['Portfolio projects', 'Open source contributions', 'Industry datasets'],
        prerequisites: ['ML fundamentals']
      }
    ],
    indianContext: {
      topCompanies: ['Flipkart', 'Amazon', 'Microsoft', 'Google', 'TCS', 'Infosys', 'Wipro', 'Accenture'],
      majorCities: ['Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Chennai'],
      governmentOpportunities: ['Digital India analytics', 'Government data initiatives', 'Public policy research'],
      startupEcosystem: true,
      skillGap: 'High demand for skilled data scientists',
      regionalVariations: [
        { region: 'Tier 1 Cities', opportunities: 'High-paying roles in tech companies', salaryAdjustment: 1.3 },
        { region: 'Tier 2 Cities', opportunities: 'Growing analytics hubs', salaryAdjustment: 0.9 },
        { region: 'Tier 3 Cities', opportunities: 'Remote analytics roles', salaryAdjustment: 0.7 }
      ]
    },
    aiInsights: {
      automationRisk: 'medium',
      futureSkills: ['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'MLOps'],
      marketTrends: ['AI adoption', 'Data privacy regulations', 'Real-time analytics'],
      recommendations: ['Focus on domain expertise', 'Learn MLOps', 'Develop business skills']
    }
  },
  {
    title: 'Digital Marketing Specialist',
    description: 'Develop and execute digital marketing strategies to promote products and services online. Use various digital channels to reach target audiences and drive engagement.',
    industry: 'media',
    category: 'creative',
    educationRequirements: {
      minimum: 'bachelor',
      preferred: ['bachelor', 'master'],
      specificDegrees: ['Marketing', 'Business Administration', 'Communications', 'Journalism']
    },
    skills: {
      technical: [
        { skill: 'Social Media Marketing', importance: 'essential', level: 'intermediate' },
        { skill: 'SEO/SEM', importance: 'essential', level: 'intermediate' },
        { skill: 'Content Creation', importance: 'essential', level: 'intermediate' },
        { skill: 'Analytics Tools', importance: 'important', level: 'beginner' },
        { skill: 'Email Marketing', importance: 'important', level: 'beginner' },
        { skill: 'Graphic Design', importance: 'nice-to-have', level: 'beginner' }
      ],
      soft: [
        { skill: 'Creativity', importance: 'essential' },
        { skill: 'Communication', importance: 'essential' },
        { skill: 'Analytical Thinking', importance: 'important' },
        { skill: 'Adaptability', importance: 'important' }
      ],
      languages: [
        { language: 'English', proficiency: 'intermediate', required: true },
        { language: 'Hindi', proficiency: 'intermediate', required: true },
        { language: 'Regional Languages', proficiency: 'basic', required: false }
      ]
    },
    experience: {
      entryLevel: {
        description: 'Junior digital marketing roles with basic campaign management',
        typicalRoles: ['Digital Marketing Executive', 'Social Media Coordinator', 'Content Creator'],
        salaryRange: { min: 250000, max: 500000, currency: 'INR' }
      },
      midLevel: {
        description: 'Mid-level digital marketing specialist with 2-5 years experience',
        typicalRoles: ['Digital Marketing Specialist', 'Marketing Manager', 'Brand Manager'],
        salaryRange: { min: 500000, max: 1000000, currency: 'INR' }
      },
      seniorLevel: {
        description: 'Senior digital marketing professional with 5+ years experience',
        typicalRoles: ['Digital Marketing Manager', 'Marketing Director', 'Chief Marketing Officer'],
        salaryRange: { min: 1000000, max: 2000000, currency: 'INR' }
      }
    },
    growthProspects: {
      marketDemand: 'high',
      growthRate: 'fast',
      futureOutlook: 'Strong growth with increasing digital adoption',
      emergingTrends: ['AI-powered Marketing', 'Video Marketing', 'Influencer Marketing']
    },
    workEnvironment: {
      location: 'hybrid',
      schedule: 'flexible',
      teamSize: 'medium',
      travel: 'occasional'
    },
    personalityTraits: [
      { trait: 'Creativity', importance: 'essential' },
      { trait: 'Communication', importance: 'essential' },
      { trait: 'Adaptability', importance: 'important' },
      { trait: 'Analytical Thinking', importance: 'important' }
    ],
    certifications: [
      { name: 'Google Ads Certification', provider: 'Google', importance: 'important', cost: 0, duration: '1 month' },
      { name: 'Facebook Blueprint Certification', provider: 'Facebook', importance: 'important', cost: 0, duration: '1 month' },
      { name: 'HubSpot Content Marketing Certification', provider: 'HubSpot', importance: 'nice-to-have', cost: 0, duration: '2 weeks' }
    ],
    learningPath: [
      {
        step: 1,
        title: 'Learn Digital Marketing Fundamentals',
        description: 'Understand digital marketing concepts and channels',
        duration: '2-3 months',
        resources: ['Online courses', 'Industry blogs', 'Case studies'],
        prerequisites: ['Basic marketing knowledge']
      },
      {
        step: 2,
        title: 'Master Key Tools and Platforms',
        description: 'Learn to use marketing tools and social media platforms',
        duration: '2-3 months',
        resources: ['Platform tutorials', 'Tool certifications', 'Practice accounts'],
        prerequisites: ['Digital marketing fundamentals']
      },
      {
        step: 3,
        title: 'Build Campaign Experience',
        description: 'Create and manage real marketing campaigns',
        duration: '3-6 months',
        resources: ['Personal projects', 'Freelance work', 'Internships'],
        prerequisites: ['Tool proficiency']
      }
    ],
    indianContext: {
      topCompanies: ['Flipkart', 'Amazon', 'Reliance', 'Tata', 'HDFC', 'ICICI', 'Startups'],
      majorCities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'],
      governmentOpportunities: ['Digital India campaigns', 'Government social media', 'Public awareness campaigns'],
      startupEcosystem: true,
      skillGap: 'High demand for digital marketing skills',
      regionalVariations: [
        { region: 'Tier 1 Cities', opportunities: 'High-paying roles in MNCs', salaryAdjustment: 1.2 },
        { region: 'Tier 2 Cities', opportunities: 'Growing digital agencies', salaryAdjustment: 0.8 },
        { region: 'Tier 3 Cities', opportunities: 'Remote marketing roles', salaryAdjustment: 0.6 }
      ]
    },
    aiInsights: {
      automationRisk: 'medium',
      futureSkills: ['AI Marketing Tools', 'Marketing Automation', 'Data Analytics', 'Personalization'],
      marketTrends: ['Video content growth', 'E-commerce expansion', 'Mobile-first marketing'],
      recommendations: ['Learn video marketing', 'Develop analytics skills', 'Stay updated with trends']
    }
  }
];

async function seedCareerPaths() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/career-advisor');
    console.log('Connected to MongoDB');

    // Clear existing career paths
    await CareerPath.deleteMany({});
    console.log('Cleared existing career paths');

    // Insert sample career paths
    const insertedPaths = await CareerPath.insertMany(sampleCareerPaths);
    console.log(`Inserted ${insertedPaths.length} career paths`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCareerPaths();
