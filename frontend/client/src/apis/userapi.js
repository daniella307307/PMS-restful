// src/api/userApi.js
import axios from 'axios';

const userApi = axios.create({
  baseURL: 'http://localhost:8080/api/users', // Adjust port if different
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to inject the token
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authApi = {
  register: async (userData) => {
    try {
      const response = await userApi.post('/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (identifier, password) => {
    try {
      const response = await userApi.post('/login', { identifier, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },

  forgotPassword: async (email) => {
    try {
      const response = await userApi.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await userApi.put(`/reset-password/${resetToken}`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Email Verification APIs
export const emailVerificationApi = {
  sendVerificationEmail: async (email) => {
    try {
      const response = await userApi.post('/send-verification-email', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verifyEmail: async (email, otpCode) => {
    try {
      const response = await userApi.post('/verify-email', { email, otpCode });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};


// User Profile APIs
export const userProfileApi = {
  getMe: async () => {
    try {
      const response = await userApi.get('/me');
      return response.data.data; // Adjust based on backend response shape
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (updates) => {
    try {
      const response = await userApi.put('/me', updates); // Assuming backend uses /me for current user update
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await userApi.put('/update-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Admin APIs
export const adminUserApi = {
  getAllUsers: async () => {
    try {
      const response = await userApi.get('/');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await userApi.get(`/${userId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await userApi.delete(`/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default userApi;