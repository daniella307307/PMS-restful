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
  (error) => Promise.reject(error)
);

// ✅ Authentication APIs
export const authApi = {
  register: async (userData) => {
    try {
      const response = await userApi.post('/register', userData);
      const { token, data } = response.data;

      if (token && data) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (identifier, password) => {
    try {
      const response = await userApi.post('/login', { identifier, password });
      const { token, data } = response.data;

      if (token && data) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

// ✅ Email Verification APIs
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

// ✅ User Profile APIs
export const userProfileApi = {
  getMe: async () => {
    const res = await userApi.get('/me');
    return res.data;
  },
  // In userApi.js
updateProfile: async (formData) => {
  try {
    // Make sure to include the user ID in the formData
    const userId = JSON.parse(localStorage.getItem('user')).id;
    formData.append('id', userId);
    
    const res = await userApi.put(`/update/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
  updatePassword: async (currentPassword, newPassword) => {
    const res = await userApi.put('/update-password', { currentPassword, newPassword });
    return res.data;
  },
};

// ✅ Admin APIs
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
