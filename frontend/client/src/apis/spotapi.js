// src/apis/parkingSpotApi.jsx
import axios from 'axios';

const spotApi = axios.create({
  baseURL: 'http://localhost:8080/api/parking-spots',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if present
spotApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Check if current user is admin
function isAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role === 'admin';
  } catch {
    return false;
  }
}

export const parkingSpotApi = {
  // Create a new spot
  createSpot: async (spotData) => {
    if (!isAdmin()) {
      throw { message: 'Unauthorized: Only admins can create parking spots' };
    }
    try {
      const response = await spotApi.post('/', spotData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Fetch spots with optional filters (e.g., parkingLotId)
  getSpots: async (filters = {}) => {
    try {
      const response = await spotApi.get('/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a specific spot by ID
  getSpotById: async (id) => {
    try {
      const response = await spotApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update spot status or data
  updateSpot: async (id, updatedData) => {
    if (!isAdmin()) {
      throw { message: 'Unauthorized: Only admins can update parking spots' };
    }
    try {
      const response = await spotApi.put(`/${id}`, updatedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a spot
  deleteSpot: async (id) => {
    if (!isAdmin()) {
      throw { message: 'Unauthorized: Only admins can delete parking spots' };
    }
    try {
      const response = await spotApi.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default spotApi;
