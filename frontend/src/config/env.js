// Environment configuration
export const config = {
  // In development, use relative path when proxying through Vite
  // In production, use full URL
  API_BASE_URL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:8000'),
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
};
