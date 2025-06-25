import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const deploymentService = {
  // Get all deployments for the current user
  getDeployments: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/deployments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch deployments' };
    }
  },

  // Create a new deployment
  createDeployment: async (deploymentData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/deployments`, deploymentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create deployment' };
    }
  },

  // Delete a deployment
  deleteDeployment: async (deploymentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`${API_BASE_URL}/deployments/${deploymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete deployment' };
    }
  },

  // Get deployment status
  getDeploymentStatus: async (deploymentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/deployments/${deploymentId}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get deployment status' };
    }
  }
};

export default deploymentService;