import axios from 'axios';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/secure-admin-panel/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for cold starts
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('drivex-admin-token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor for better error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('Admin API Error:', error.response.status, error.response.data);
      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from admin API server:', error.request);
      const err = new Error('Network Error: Unable to reach the admin server. Please check your connection.');
      err.response = { data: { error: 'Unable to reach the server' } };
      return Promise.reject(err);
    } else {
      // Error in request setup
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export async function fetchDashboard() {
  const response = await adminApi.get('/dashboard');
  return response.data;
}

export default adminApi;
