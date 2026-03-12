import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signup = (data) => api.post('/signup', data);
export const login = (data) => api.post('/login', data);

// Resume
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const analyzeResume = () => api.post('/analyze-resume');
export const fullAnalysis = (targetRole) =>
  api.post(`/full-analysis?target_role=${encodeURIComponent(targetRole)}`);
export const detectSkillGap = (targetRole) =>
  api.post(`/skill-gap?target_role=${encodeURIComponent(targetRole)}`);

// Interview
export const generateInterview = (data) => api.post('/generate-interview', data);
export const evaluateAnswer = (data) => api.post('/evaluate-answer', data);

// Career
export const getCareerRoadmap = () => api.get('/career-roadmap');

export default api;
