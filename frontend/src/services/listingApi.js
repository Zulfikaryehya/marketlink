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
  // Get listings by category from the API
  getByCategory: async (category, excludeId = null, limit = 4) => {
    try {
      // Build query parameters for exclude and limit
      const params = new URLSearchParams();
      if (excludeId) {
        params.append("exclude", excludeId);
      }
      if (limit) {
        params.append("limit", limit);
      }

      // Make GET request to category-specific endpoint
      const url = `${API_BASE_URL}/listings/category/${encodeURIComponent(
        category
      )}${params.toString() ? "?" + params.toString() : ""}`;
      const response = await axios.get(url, {
        headers: getAuthHeaders(),
      });

      // Return success response with data
      return { success: true, data: response.data };
    } catch (error) {
      // Log error to console for debugging
      console.error("Get listings by category error:", error);
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

      // Handle specific HTTP status codes from middleware
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        switch (status) {
          case 403:
            return {
              success: false,
              error: "You don't have permission to edit this listing",
            };
          case 404:
            return { success: false, error: "Listing not found" };
          case 401:
            return { success: false, error: "Please log in to edit listings" };
          default:
            return { success: false, error: message };
        }
      }

      // Return generic error message for network issues
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

      // Handle specific HTTP status codes from middleware
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        switch (status) {
          case 403:
            return {
              success: false,
              error: "You don't have permission to delete this listing",
            };
          case 404:
            return { success: false, error: "Listing not found" };
          case 401:
            return {
              success: false,
              error: "Please log in to delete listings",
            };
          default:
            return { success: false, error: message };
        }
      }

      // Return generic error message for network issues
      return { success: false, error: error.message };
    }
  },

  // Upload image for listing
  uploadImage: async (file) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", file);

      // Get auth headers (remove Content-Type to let browser set it for multipart/form-data)
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
      };

      // Make POST request to image upload endpoint
      const response = await axios.post(
        `${API_BASE_URL}/upload-image`,
        formData,
        { headers }
      );

      // Return success response with image URL/path
      return { success: true, data: response.data };
    } catch (error) {
      // Log error to console for debugging
      console.error("Upload image error:", error);
      // Return error response with message
      return { success: false, error: error.message };
    }
  },

  // Create listing with images
  createWithImages: async (listingData, imageFiles) => {
    try {
      // First upload images if any
      const imageUrls = [];
      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          const uploadResult = await listingApi.uploadImage(file);
          if (uploadResult.success) {
            imageUrls.push(uploadResult.data.url || uploadResult.data.path);
          }
        }
      }

      // Add images to listing data
      const listingWithImages = {
        ...listingData,
        images: imageUrls,
      };

      // Create listing with image URLs
      return await listingApi.create(listingWithImages);
    } catch (error) {
      console.error("Create listing with images error:", error);
      return { success: false, error: error.message };
    }
  },

  // Update listing with new images
  updateWithImages: async (id, listingData, imageFiles) => {
    try {
      // First upload new images if any
      const newImageUrls = [];
      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          const uploadResult = await listingApi.uploadImage(file);
          if (uploadResult.success) {
            newImageUrls.push(uploadResult.data.url || uploadResult.data.path);
          }
        }
      }

      // Merge existing images with new ones
      const existingImages = listingData.images || [];
      const allImages = [...existingImages, ...newImageUrls];

      // Update listing with all images
      const listingWithImages = {
        ...listingData,
        images: allImages,
      };

      return await listingApi.update(id, listingWithImages);
    } catch (error) {
      console.error("Update listing with images error:", error);
      return { success: false, error: error.message };
    }
  },
};
