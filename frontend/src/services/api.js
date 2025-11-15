import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Ensure credentials are always included
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Handle unauthorized/forbidden access
      const user = localStorage.getItem('user');
      // If we have a user in localStorage but get 403, session might be expired
      if (user && error.response?.status === 403) {
        // Check if it's a session expiration issue
        const errorDetail = error.response?.data?.detail;
        if (errorDetail && (errorDetail.includes('اعتبارسنجی') || errorDetail.includes('Authentication'))) {
          // Session expired or missing, clear localStorage and redirect to login
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }
      // If no user in localStorage, redirect to login
      if (!user) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
