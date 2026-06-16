import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for cold starts on Render
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
    console.log(error.response?.data);
    console.log(error.message);

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      console.error('API Error:', status, data);

      let errorMsg = data?.error || data?.message || 'Request failed';
      if (status === 404) {
        errorMsg = data?.error || 'Endpoint not found. Server may be unavailable.';
      } else if (status === 401) {
        errorMsg = data?.error || 'Invalid credentials';
      } else if (status === 409) {
        errorMsg = data?.error || 'Email already registered';
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
      console.error('No response from server:', error.request);
      console.error('Attempted URL:', error.config?.baseURL, error.config?.url);
      console.error('Request timeout:', error.code);

      let errorMsg = 'Unable to reach the server';
      if (error.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout. Server may be starting up or unreachable.';
      } else if (error.message.includes('CORS')) {
        errorMsg = 'CORS error: Request blocked by server';
      } else if (!import.meta.env.VITE_API_URL) {
        errorMsg = 'API URL is not configured. Set VITE_API_URL in your environment.';
      }

      const err = new Error(errorMsg);
      err.response = { data: { error: errorMsg } };
      return Promise.reject(err);
    }

    console.error('Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;
