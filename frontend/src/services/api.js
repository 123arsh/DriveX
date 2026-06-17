import axios from 'axios';

let csrfToken = null;

const rawBaseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const normalizedBaseURL = rawBaseURL.endsWith('/api')
  ? rawBaseURL
  : `${rawBaseURL}/api`;

const api = axios.create({
  baseURL: normalizedBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for cold starts on Render
});

async function ensureCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await api.get('/csrf-token');
  csrfToken = response.data?.csrfToken || null;
  return csrfToken;
}

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('drivex-access-token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (
    config.url &&
    !config.url.includes('/auth/') &&
    !config.url.includes('/csrf-token') &&
    config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())
  ) {
    const currentToken = await ensureCsrfToken();
    if (currentToken && config.headers) {
      config.headers['X-CSRF-Token'] = currentToken;
    }
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
