import apiClient from './client';

export const loginUser = async (email, password) => {
  const response = await apiClient.post('/api/auth/login', { email, password });
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await apiClient.post('/api/auth/signup', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await apiClient.put('/api/auth/profile', profileData);
  return response.data;
};
