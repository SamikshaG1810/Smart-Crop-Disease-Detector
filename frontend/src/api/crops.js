import apiClient from './client';

export const getSupportedCrops = async () => {
  const response = await apiClient.get('/api/crops');
  return response.data;
};

export const getCropDiseases = async (cropName) => {
  const response = await apiClient.get(`/api/crops/${encodeURIComponent(cropName)}`);
  return response.data;
};

export const getDiseaseDetail = async (classId) => {
  const response = await apiClient.get(`/api/crops/disease/${encodeURIComponent(classId)}`);
  return response.data;
};
