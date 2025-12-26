import axios from 'axios';
import { API_URL, API_KEY } from '@env';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10 * 1000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Add Bearer Token into every request
apiClient.interceptors.request.use(
  async config => {
    if (API_KEY) {
      config.headers.Authorization = `Bearer ${API_KEY}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Interceptor: Handle responses and errors globally
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
