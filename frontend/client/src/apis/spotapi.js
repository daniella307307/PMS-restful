import axios from 'axios';

// Base API for parking spots
const spotApi = axios.create({
  baseURL: 'http://localhost:8080/api/parking-spots',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
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

// Utility: check if current user is admin
function isAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role === 'admin';
  } catch {
    return false;
  }
}

export const parkingSpotApi = {
  // ✅ Get all spots for a specific parking lot
  getSpotsForLot: async (lotId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/api/parking-lots/${lotId}/spots`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ✅ Create a new parking spot
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

  // ✅ Get all spots (with optional filters)
  getSpots: async (filters = {}) => {
    try {
      const response = await spotApi.get('/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ✅ Get a specific spot by ID
  getSpotById: async (id) => {
    try {
      const response = await spotApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ✅ Update a parking spot
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

  // ✅ Delete a parking spot
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
