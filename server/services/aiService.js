const { VertexAI } = require('@google-cloud/vertexai');

class AIService {
  constructor() {
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    this.location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    
    // Make Google Cloud optional for basic functionality
    if (!this.projectId) {
      console.warn('GOOGLE_CLOUD_PROJECT_ID not set. AI features will be disabled.');
      this.vertexAI = null;
      this.model = null;
      return;
    }

    try {
      this.vertexAI = new VertexAI({
        project: this.projectId,
        location: this.location,
      });

      this.model = this.vertexAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
      });
    } catch (error) {
      console.warn('Failed to initialize Google Cloud AI:', error.message);
      this.vertexAI = null;
      this.model = null;
    }
  }

  async generateCareerRecommendations(userProfile, assessmentResults) {
    if (!this.model) {
      return this.getDefaultCareerRecommendations(userProfile, assessmentResults);
    }
    
    try {
      const prompt = this.buildCareerRecommendationPrompt(userProfile, assessmentResults);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseCareerRecommendations(text);
    } catch (error) {
      console.error('Error generating career recommendations:', error);
      return this.getDefaultCareerRecommendations(userProfile, assessmentResults);
    }
  }

  async analyzeSkillsGap(userSkills, careerRequirements) {
    if (!this.model) {
      return this.getDefaultSkillsGapAnalysis(userSkills, careerRequirements);
    }
    
    try {
      const prompt = this.buildSkillsGapPrompt(userSkills, careerRequirements);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseSkillsGapAnalysis(text);
    } catch (error) {
      console.error('Error analyzing skills gap:', error);
      return this.getDefaultSkillsGapAnalysis(userSkills, careerRequirements);
    }
  }

  async generatePersonalizedLearningPath(userProfile, careerGoal, skillsGap) {
    if (!this.model) {
      return this.getDefaultLearningPath(userProfile, careerGoal, skillsGap);
    }
    
    try {
      const prompt = this.buildLearningPathPrompt(userProfile, careerGoal, skillsGap);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseLearningPath(text);
    } catch (error) {
      console.error('Error generating learning path:', error);
      return this.getDefaultLearningPath(userProfile, careerGoal, skillsGap);
    }
  }

  async analyzeAssessmentResults(assessmentData) {
    try {
      const prompt = this.buildAssessmentAnalysisPrompt(assessmentData);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAssessmentAnalysis(text);
    } catch (error) {
      console.error('Error analyzing assessment results:', error);
      throw new Error('Failed to analyze assessment results');
    }
  }

  async generateMarketInsights(industry, location) {
    try {
      const prompt = this.buildMarketInsightsPrompt(industry, location);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseMarketInsights(text);
    } catch (error) {
      console.error('Error generating market insights:', error);
      throw new Error('Failed to generate market insights');
    }
  }

  buildCareerRecommendationPrompt(userProfile, assessmentResults) {
    return `
    You are an expert career advisor specializing in the Indian job market. Analyze the following user profile and assessment results to provide personalized career recommendations.

    User Profile:
    - Name: ${userProfile.name}
    - Age: ${this.calculateAge(userProfile.dateOfBirth)}
    - Education: ${userProfile.education.currentLevel} in ${userProfile.education.stream}
    - Location: ${userProfile.location.city}, ${userProfile.location.state}
    - Interests: ${userProfile.interests.map(i => i.category).join(', ')}
    - Current Skills: ${userProfile.skills.map(s => `${s.name} (${s.level})`).join(', ')}

    Assessment Results:
    - Personality Type: ${assessmentResults.personalityType}
    - Learning Style: ${assessmentResults.learningStyle}
    - Work Style: ${assessmentResults.workStyle}
    - Strengths: ${assessmentResults.strengths.join(', ')}
    - Areas for Improvement: ${assessmentResults.areasForImprovement.join(', ')}

    Please provide:
    1. Top 5 career recommendations with match scores (1-100)
    2. Reasoning for each recommendation
    3. Required skills for each career
    4. Growth potential in Indian market
    5. Salary expectations
    6. Next steps for each career path

    Format your response as JSON with the following structure:
    {
      "recommendations": [
        {
          "career": "Career Name",
          "matchScore": 85,
          "reasoning": "Detailed reasoning",
          "requiredSkills": ["skill1", "skill2"],
          "growthPotential": "High/Medium/Low",
          "salaryRange": {"min": 300000, "max": 800000},
          "nextSteps": ["step1", "step2"]
        }
      ],
      "summary": "Overall career guidance summary"
    }
    `;
  }

  buildSkillsGapPrompt(userSkills, careerRequirements) {
    return `
    Analyze the skills gap between the user's current skills and career requirements.

    User Skills:
    ${JSON.stringify(userSkills, null, 2)}

    Career Requirements:
    ${JSON.stringify(careerRequirements, null, 2)}

    Provide:
    1. Skills the user already has (with proficiency levels)
    2. Critical skills missing
    3. Skills that need improvement
    4. Learning priorities
    5. Estimated time to acquire missing skills

    Format as JSON:
    {
      "currentSkills": [{"skill": "name", "level": "proficiency"}],
      "missingSkills": [{"skill": "name", "priority": "high/medium/low", "timeToLearn": "estimate"}],
      "skillsToImprove": [{"skill": "name", "currentLevel": "level", "targetLevel": "level"}],
      "learningPriorities": ["skill1", "skill2"],
      "timeline": "Overall timeline estimate"
    }
    `;
  }

  buildLearningPathPrompt(userProfile, careerGoal, skillsGap) {
    return `
    Create a personalized learning path for an Indian student to achieve their career goal.

    User Profile:
    - Education Level: ${userProfile.education.currentLevel}
    - Learning Style: ${userProfile.learningStyle}
    - Available Time: Assume 2-3 hours daily
    - Budget: Consider free/low-cost options

    Career Goal: ${careerGoal}
    Skills Gap: ${JSON.stringify(skillsGap, null, 2)}

    Create a structured learning path with:
    1. Phase-wise approach (Beginner, Intermediate, Advanced)
    2. Specific courses/resources (preferably Indian platforms)
    3. Practical projects
    4. Certifications
    5. Timeline for each phase
    6. Milestones and assessments

    Format as JSON:
    {
      "phases": [
        {
          "name": "Phase Name",
          "duration": "X months",
          "skills": ["skill1", "skill2"],
          "courses": [{"name": "course", "platform": "platform", "cost": "free/paid"}],
          "projects": ["project1", "project2"],
          "milestones": ["milestone1", "milestone2"]
        }
      ],
      "totalDuration": "X months",
      "estimatedCost": "amount",
      "certifications": [{"name": "cert", "provider": "provider"}]
    }
    `;
  }

  buildAssessmentAnalysisPrompt(assessmentData) {
    return `
    Analyze the comprehensive assessment results and provide detailed insights.

    Assessment Data:
    ${JSON.stringify(assessmentData, null, 2)}

    Provide analysis for:
    1. Personality profile interpretation
    2. Skills assessment results
    3. Interest alignment with careers
    4. Aptitude strengths and weaknesses
    5. Learning style recommendations
    6. Work environment preferences
    7. Career compatibility insights

    Format as JSON:
    {
      "personalityAnalysis": "Detailed analysis",
      "skillsAnalysis": "Skills assessment insights",
      "interestAnalysis": "Interest-based insights",
      "aptitudeAnalysis": "Aptitude insights",
      "learningRecommendations": ["rec1", "rec2"],
      "workStyleInsights": "Work style analysis",
      "careerCompatibility": "Overall compatibility analysis"
    }
    `;
  }

  buildMarketInsightsPrompt(industry, location) {
    return `
    Provide current market insights for the ${industry} industry in ${location}, India.

    Include:
    1. Current job market trends
    2. Salary benchmarks
    3. Skill demands
    4. Growth opportunities
    5. Challenges and risks
    6. Future outlook (next 2-3 years)
    7. Top companies hiring
    8. Emerging roles

    Format as JSON:
    {
      "marketTrends": ["trend1", "trend2"],
      "salaryBenchmarks": {"entry": "range", "mid": "range", "senior": "range"},
      "skillDemands": ["skill1", "skill2"],
      "growthOpportunities": ["opp1", "opp2"],
      "challenges": ["challenge1", "challenge2"],
      "futureOutlook": "outlook description",
      "topCompanies": ["company1", "company2"],
      "emergingRoles": ["role1", "role2"]
    }
    `;
  }

  parseCareerRecommendations(text) {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error parsing career recommendations:', error);
      return {
        recommendations: [],
        summary: 'Unable to parse AI response. Please try again.'
      };
    }
  }

  parseSkillsGapAnalysis(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error parsing skills gap analysis:', error);
      return {
        currentSkills: [],
        missingSkills: [],
        skillsToImprove: [],
        learningPriorities: [],
        timeline: 'Unable to determine timeline'
      };
    }
  }

  parseLearningPath(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error parsing learning path:', error);
      return {
        phases: [],
        totalDuration: 'Unknown',
        estimatedCost: 'Unknown',
        certifications: []
      };
    }
  }

  parseAssessmentAnalysis(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error parsing assessment analysis:', error);
      return {
        personalityAnalysis: 'Unable to analyze personality',
        skillsAnalysis: 'Unable to analyze skills',
        interestAnalysis: 'Unable to analyze interests',
        aptitudeAnalysis: 'Unable to analyze aptitudes',
        learningRecommendations: [],
        workStyleInsights: 'Unable to analyze work style',
        careerCompatibility: 'Unable to analyze compatibility'
      };
    }
  }

  parseMarketInsights(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error parsing market insights:', error);
      return {
        marketTrends: [],
        salaryBenchmarks: {},
        skillDemands: [],
        growthOpportunities: [],
        challenges: [],
        futureOutlook: 'Unable to determine outlook',
        topCompanies: [],
        emergingRoles: []
      };
    }
  }

  calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Default methods when AI is not available
  getDefaultCareerRecommendations(userProfile, assessmentResults) {
    return {
      recommendations: [
        {
          career: 'Software Developer',
          matchScore: 85,
          description: 'Based on your technical interests and problem-solving skills',
          requirements: ['Programming skills', 'Problem solving', 'Team collaboration'],
          salaryRange: '₹4-12 LPA',
          growthProspects: 'High'
        },
        {
          career: 'Data Analyst',
          matchScore: 80,
          description: 'Suitable for analytical and detail-oriented individuals',
          requirements: ['Analytical skills', 'Statistical knowledge', 'Communication'],
          salaryRange: '₹3-8 LPA',
          growthProspects: 'High'
        }
      ],
      reasoning: 'Basic recommendations based on common career paths for students with your profile.'
    };
  }

  getDefaultSkillsGapAnalysis(userSkills, careerRequirements) {
    return {
      gaps: [
        {
          skill: 'Programming',
          currentLevel: 'Beginner',
          requiredLevel: 'Intermediate',
          learningPath: 'Start with Python basics, then move to web development'
        }
      ],
      recommendations: 'Focus on building practical projects and gaining hands-on experience'
    };
  }

  getDefaultLearningPath(userProfile, careerGoal, skillsGap) {
    return {
      path: [
        {
          phase: 'Foundation',
          duration: '3-6 months',
          courses: ['Basic Programming', 'Mathematics for CS'],
          projects: ['Simple calculator', 'Basic web page']
        },
        {
          phase: 'Intermediate',
          duration: '6-12 months',
          courses: ['Data Structures', 'Web Development'],
          projects: ['Personal portfolio', 'Small web application']
        }
      ],
      estimatedTime: '12-18 months',
      difficulty: 'Medium'
    };
  }
}

module.exports = new AIService();
