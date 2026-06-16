import axios from 'axios';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api/secure-admin-panel',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for cold starts on Render
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
    console.log(error.response?.data);
    console.log(error.message);

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      console.error('Admin API Error:', status, data);

      let errorMsg = data?.error || data?.message || 'Request failed';
      if (status === 404) {
        errorMsg = data?.error || 'Endpoint not found. Server may be unavailable.';
      } else if (status === 403) {
        errorMsg = data?.error || 'Admin access denied';
      } else if (status === 500) {
        errorMsg = data?.error || 'Server error. Please try again later.';
      } else if (status === 503) {
        errorMsg = data?.error || 'Server is currently unavailable. Please try again later.';
      }

      const err = new Error(errorMsg);
      err.response = error.response;
      return Promise.reject(err);
    }

    if (error.request) {
      console.error('No response from admin API server:', error.request);
      console.error('Attempted URL:', error.config?.baseURL, error.config?.url);
      console.error('Request timeout:', error.code);

      let errorMsg = 'Unable to reach the server';
      if (error.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout. Server may be starting up or unreachable.';
      } else if (error.message.includes('CORS')) {
        errorMsg = 'CORS error: Request blocked by server';
      } else if (!import.meta.env.VITE_ADMIN_API_URL) {
        errorMsg = 'Admin API URL is not configured. Set VITE_ADMIN_API_URL in your environment.';
      }

      const err = new Error(errorMsg);
      err.response = { data: { error: errorMsg } };
      return Promise.reject(err);
    }

    console.error('Error:', error.message);
    return Promise.reject(error);
  }
);

export async function fetchDashboard() {
  const response = await adminApi.get('/dashboard');
  return response.data;
}

export default adminApi;
