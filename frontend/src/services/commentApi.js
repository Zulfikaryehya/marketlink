import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const commentApi = {
  // Get comments for a specific listing
  getByListing: async (listingId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/listings/${listingId}/comments`,
        {
          headers: getAuthHeaders(),
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Get comments error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Add a comment to a listing
  create: async (listingId, commentData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/listings/${listingId}/comments`,
        commentData,
        { headers: getAuthHeaders() }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Create comment error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Delete a comment
  delete: async (commentId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/comments/${commentId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Delete comment error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Update a comment
  update: async (commentId, commentData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/comments/${commentId}`,
        commentData,
        { headers: getAuthHeaders() }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Update comment error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};
