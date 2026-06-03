import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for cold starts
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('drivex-access-token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server:', error.request);
      const err = new Error('Network Error: Unable to reach the server. Please check your connection.');
      err.response = { data: { error: 'Unable to reach the server' } };
      return Promise.reject(err);
    } else {
      // Error in request setup
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;
