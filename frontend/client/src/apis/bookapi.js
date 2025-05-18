import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/bookings';

// Helper to get auth token from localStorage (adjust to your auth implementation)
function getAuthHeaders() {
  const token = localStorage.getItem('token'); // or from context/store
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
}

export const bookingApi = {
  // Create booking
  createBooking: async (bookingData) => {
    const res = await axios.post(API_BASE_URL, bookingData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  // Get current user's bookings (optionally filtered by status/upcoming)
  getMyBookings: async (params = {}) => {
    // params example: { status: 'confirmed', upcoming: 'true' }
    const res = await axios.get(`${API_BASE_URL}/my-bookings`, {
      headers: getAuthHeaders(),
      params,
    });
    return res.data;
  },

  // Get booking by id (accessible by user or admin)
  getBookingById: async (bookingId) => {
    const res = await axios.get(`${API_BASE_URL}/${bookingId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  // Cancel booking by id (user)
  cancelBooking: async (bookingId) => {
    const res = await axios.put(`${API_BASE_URL}/${bookingId}/cancel`, null, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  // Admin: update booking status
  updateBookingStatusByAdmin: async (bookingId, statusData) => {
    // statusData example: { status: 'active' }
    const res = await axios.put(`${API_BASE_URL}/${bookingId}/status`, statusData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  // Admin: get all bookings with optional filters
  getAllBookings: async (params = {}) => {
    // params example: { userId, parkingLotId, status }
    const res = await axios.get(API_BASE_URL, {
      headers: getAuthHeaders(),
      params,
    });
    return res.data;
  },
};
