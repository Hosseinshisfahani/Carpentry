import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  async updateProfile(profileData) {
    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });
    
    const response = await api.put('/auth/profile/update/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.post('/auth/profile/change-password/', passwordData);
    return response.data;
  },

  async requestPasswordReset(email) {
    const response = await api.post('/auth/password-reset/request/', { email });
    return response.data;
  },

  async confirmPasswordReset(resetData) {
    const response = await api.post('/auth/password-reset/confirm/', resetData);
    return response.data;
  },
};
