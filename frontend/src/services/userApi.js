import axios from "axios";

// User API Service
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Function to generate authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const userApi = {
  // Get user profile by ID
  getById: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: getAuthHeaders(),
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching user:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch user profile",
      };
    }
  },
};
