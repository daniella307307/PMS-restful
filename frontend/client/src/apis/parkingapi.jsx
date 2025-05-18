import axios from 'axios';

// Create Axios instance
const lotApi = axios.create({
  baseURL: 'http://localhost:8080/api/parking-lots',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to each request if available
lotApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Role check logic (can be removed or replaced by backend protection)
function isAdmin() {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return false;

    const user = JSON.parse(userData);
    return user?.role === 'admin';
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return false;
  }
}


// Exported parkingLot API functions
export const parkingLotApi = {
  createLot: async (lotData) => {
    if (!isAdmin()) {
      throw { message: 'Unauthorized: Only admins can create parking lots' };
    }

    try {
      const response = await lotApi.post('/', lotData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getLots: async (filters = {}) => {
    try {
      const response = await lotApi.get('/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getLotById: async (id) => {
    try {
      const response = await lotApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateLot: async (id, updatedData) => {
    if (!isAdmin()) {
      throw { message: 'Unauthorized: Only admins or owners can update lots' };
    }

    try {
      const response = await lotApi.put(`/${id}`, updatedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteLot: async (id) => {
    if (!isAdmin()) {
      throw { message: 'Unauthorized: Only admins or owners can delete lots' };
    }

    try {
      const response = await lotApi.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default lotApi;