import axios from "axios";

// Create Axios instance
const vehicleApi = axios.create({
  baseURL: "http://localhost:8080/api/vehicles",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to each request if available
vehicleApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Check if user is admin (can be used for frontend UI logic)
function isAdmin() {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return false;
    const user = JSON.parse(userData);
    return user?.role === "admin";
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return false;
  }
}

// Exported vehicle API functions
export const vehicleRoutesApi = {
  createVehicle: async (vehicleData) => {
    try {
      const response = await vehicleApi.post("/", vehicleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getVehicle: async (filters = {}) => {
    try {
      const response = await vehicleApi.get("/", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

 getMyVehicle: async (filters = {}, page = 1, limit = 10) => {
  try {
    const response = await vehicleApi.get('/', {
      params: { ...filters, page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},


  updateVehicle: async (id, updatedData) => {
    try {
      const response = await vehicleApi.put(`/${id}`, updatedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteVehicle: async (id) => {
    try {
      const response = await vehicleApi.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default vehicleApi;
