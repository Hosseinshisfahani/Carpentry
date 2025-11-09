import api from './api';

export const projectService = {
  async getProjects() {
    const response = await api.get('/projects/');
    return response.data;
  },

  async getProject(id) {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },

  async createProject(projectData) {
    const formData = new FormData();
    Object.keys(projectData).forEach(key => {
      if (projectData[key] !== null && projectData[key] !== undefined) {
        formData.append(key, projectData[key]);
      }
    });
    
    const response = await api.post('/projects/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateProject(id, projectData) {
    const formData = new FormData();
    Object.keys(projectData).forEach(key => {
      if (projectData[key] !== null && projectData[key] !== undefined) {
        formData.append(key, projectData[key]);
      }
    });
    
    const response = await api.put(`/projects/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}/`);
    return response.data;
  },

  async getDashboardStatistics() {
    const response = await api.get('/dashboard/statistics/');
    return response.data;
  },
};
