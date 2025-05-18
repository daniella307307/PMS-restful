import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/bookings';

// Helper to get auth token from localStorage (adjust if you use another auth method)
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const bookingApi = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const res = await axios.post(API_BASE_URL, bookingData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get current user's bookings, optional filters { status, upcoming }
  getMyBookings: async (params = {}) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/my-bookings`, {
        headers: getAuthHeaders(),
        params,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get booking details by ID (user or admin)
  getBookingById: async (bookingId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${bookingId}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel a booking by ID (user)
  cancelBooking: async (bookingId) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${bookingId}/cancel`, null, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Update booking status (e.g., active, completed)
  updateBookingStatusByAdmin: async (bookingId, statusData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${bookingId}/status`, statusData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get all bookings with optional filters (userId, parkingLotId, status)
  getAllBookings: async (params = {}) => {
    try {
      const res = await axios.get(API_BASE_URL, {
        headers: getAuthHeaders(),
        params,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
