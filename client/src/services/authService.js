import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Your Flask backend URL

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }
};

export default authService;