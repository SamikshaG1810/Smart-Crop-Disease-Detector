import axios from 'axios';

// Use the local FastAPI server by default; VITE_API_URL can override it for deployment.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically if available in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agroscan_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauth
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if on login or landing page
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup' && path !== '/') {
        localStorage.removeItem('agroscan_token');
        localStorage.removeItem('agroscan_user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
