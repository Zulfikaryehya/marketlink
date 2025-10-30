import axios from "axios";

// Import axios for HTTP requests

// Listing API Service
// Set base URL from environment variable or default to localhost
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Function to generate authentication headers
/**
 * Generates authentication headers for API requests.
 *
 * This function retrieves the JWT token from localStorage and creates
 * the necessary headers for authenticated API calls. It ensures that
 * all requests include proper content type and authorization headers.
 *
 * @returns {Object} Headers object containing:
 *   - Content-Type: Set to "application/json" for JSON API communication
 *   - Authorization: Bearer token if available, empty string if no token exists
 *
 * @example
 * // Usage in an API call
 * const headers = getAuthHeaders();
 * fetch('/api/listings', { headers });
 *
 * @since 1.0.0
 */
const getAuthHeaders = () => {
  // Get JWT token from localStorage
  const token = localStorage.getItem("token");
  // Return headers object with content type and authorization
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const listingApi = {
  // Get all listings from the API
  getAll: async () => {
    try {
      // Make GET request to listings endpoint with auth headers
      const response = await axios.get(`${API_BASE_URL}/listings`, {
        headers: getAuthHeaders(),
      });

      // Return success response with data
      return { success: true, data: response.data };
    } catch (error) {
      // Log error to console for debugging
      console.error("Get listings error:", error);
      // Return error response with message
      return { success: false, error: error.message };
    }
  },

  // Get single listing by ID from the API
  getById: async (id) => {
    try {
      // Make GET request to specific listing endpoint with auth headers
      const response = await axios.get(`${API_BASE_URL}/listings/${id}`, {
        headers: getAuthHeaders(),
      });

      // Return success response with data
      return { success: true, data: response.data };
    } catch (error) {
      // Log error to console for debugging
      console.error("Get listing error:", error);
      // Return error response with message
      return { success: false, error: error.message };
    }
  },

  // Create new listing via API
  create: async (listingData) => {
    try {
      // Make POST request to listings endpoint with data and auth headers
      const response = await axios.post(
        `${API_BASE_URL}/listings`,
        listingData,
        {
          headers: getAuthHeaders(),
        }
      );

      // Return success response with created data
      return { success: true, data: response.data };
    } catch (error) {
      // Log error to console for debugging
      console.error("Create listing error:", error);
      // Return error response with message
      return { success: false, error: error.message };
    }
  },

  // Update existing listing via API
  update: async (id, listingData) => {
    try {
      // Make PUT request to specific listing endpoint with updated data and auth headers
      const response = await axios.put(
        `${API_BASE_URL}/listings/${id}`,
        listingData,
        {
          headers: getAuthHeaders(),
        }
      );

      // Return success response with updated data
      return { success: true, data: response.data };
    } catch (error) {
      // Log error to console for debugging
      console.error("Update listing error:", error);
      // Return error response with message
      return { success: false, error: error.message };
    }
  },

  // Delete listing from API
  delete: async (id) => {
    try {
      // Make DELETE request to specific listing endpoint with auth headers
      await axios.delete(`${API_BASE_URL}/listings/${id}`, {
        headers: getAuthHeaders(),
      });

      // Return success response (no data needed for delete)
      return { success: true };
    } catch (error) {
      // Log error to console for debugging
      console.error("Delete listing error:", error);
      // Return error response with message
      return { success: false, error: error.message };
    }
  },
};
