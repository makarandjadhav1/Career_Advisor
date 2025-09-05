import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  updateSkills: (skills) => api.post('/profile/skills', { skills }),
  updateInterests: (interests) => api.post('/profile/interests', { interests }),
  updateCareerGoals: (goals) => api.post('/profile/career-goals', goals),
  updatePreferences: (preferences) => api.post('/profile/preferences', preferences),
  deleteAccount: () => api.delete('/profile'),
};

// Assessment API
export const assessmentAPI = {
  getAvailable: () => api.get('/assessment/available'),
  startAssessment: (type) => api.post('/assessment/start', { type }),
  submitResponse: (assessmentId, questionId, answer) => 
    api.post(`/assessment/${assessmentId}/response`, { questionId, answer }),
  completeAssessment: (assessmentId) => 
    api.post(`/assessment/${assessmentId}/complete`),
  getResults: (assessmentId) => 
    api.get(`/assessment/${assessmentId}/results`),
  getHistory: () => api.get('/assessment/history'),
};

// Career API
export const careerAPI = {
  getRecommendations: () => api.get('/career/recommendations'),
  getCareerPaths: (params) => api.get('/career/paths', { params }),
  getCareerPath: (careerId) => api.get(`/career/paths/${careerId}`),
  searchCareerPaths: (query, params) => 
    api.get('/career/search', { params: { q: query, ...params } }),
  getMarketInsights: (industry, location) => 
    api.get('/career/market-insights', { params: { industry, location } }),
  compareCareers: (careerIds) => 
    api.post('/career/compare', { careerIds }),
  getLearningPath: (careerId) => 
    api.get(`/career/paths/${careerId}/learning`),
  getStats: () => api.get('/career/stats'),
};

// Skills API
export const skillsAPI = {
  getGapAnalysis: (careerPath) => 
    api.get('/skills/gap-analysis', { params: { careerPath } }),
  getLearningPath: (data) => api.post('/skills/learning-path', data),
  getRecommendations: () => api.get('/skills/recommendations'),
  updateProgress: (skillName, newLevel, evidence) => 
    api.post('/skills/progress', { skillName, newLevel, evidence }),
  getRoadmap: (skillName) => api.get(`/skills/roadmap/${skillName}`),
  getTrending: (industry, timeframe) => 
    api.get('/skills/trending', { params: { industry, timeframe } }),
  getAssessmentQuestions: (skillName) => 
    api.get(`/skills/assessment/${skillName}`),
  submitAssessment: (skillName, answers) => 
    api.post(`/skills/assessment/${skillName}`, { answers }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
