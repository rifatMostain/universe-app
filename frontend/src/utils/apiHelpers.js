import api from './api';

// User API calls
export const getUserProfile = () => api.get('/profile');
export const updateUserProfile = (data) => api.put('/profile', data);
export const getCurrentUser = () => api.get('/me');

// Auth API calls
export const signup = (email, password, name) => 
  api.post('/auth/signup', { email, password, name });

export const login = (email, password) => 
  api.post('/auth/login', { email, password });

export const verifyToken = (token) => 
  api.post('/auth/verify', { token });

export default api;
