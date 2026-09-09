import apiClient from './client';

export const predictLeafDisease = async (formData) => {
  const response = await apiClient.post('/api/scans/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getScanHistory = async (params = {}) => {
  const response = await apiClient.get('/api/scans/history', { params });
  return response.data;
};

export const getScanDetail = async (scanId) => {
  const response = await apiClient.get(`/api/scans/${scanId}`);
  return response.data;
};

export const deleteScan = async (scanId) => {
  const response = await apiClient.delete(`/api/scans/${scanId}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await apiClient.get('/api/analytics/stats');
  return response.data;
};
