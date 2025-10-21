// Environment configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
};
