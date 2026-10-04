import axios from 'axios';

// Development uses Vite's same-origin proxy; production can provide an API URL.
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Warm up the backend on first load to reduce Render cold-start delay
if (API_BASE_URL) {
  axios.get(`${API_BASE_URL}/healthz`, { timeout: 10000 }).catch((error) => {
    console.warn('API warm-up request failed:', error.message);
  });
}

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
        window.dispatchEvent(new Event('agroscan:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
