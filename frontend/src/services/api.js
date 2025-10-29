// Get base API URL from environment or fallback to local dev server
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const api = {
  // Register a new user
  async register(userData) {
    // Send POST request to /register with JSON body
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // tell server we're sending JSON
        Accept: "application/json", // tell server we expect JSON back
      },
      body: JSON.stringify({
        name: userData.username, // backend expects 'name' field
        email: userData.email, // send email field
        password: userData.password, // send password field
        password_confirmation: userData.confirmPassword, // Laravel expects 'password_confirmation'
      }),
    }); // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        `Server returned ${response.status}: ${response.statusText}. Expected JSON response. Make sure Laravel backend is running on http://localhost:8000`
      );
    }

    // Parse JSON response body
    const data = await response.json();

    // If response status is not 2xx, throw an error (will be caught by caller)
    if (!response.ok) {
      // Handle Laravel validation errors
      if (response.status === 400 && typeof data === "string") {
        const errors = JSON.parse(data);
        throw new Error(Object.values(errors).flat().join(", "));
      }
      throw new Error(
        data.message || `Registration failed with status ${response.status}`
      );
    }

    // Return parsed data to caller
    return data;
  },
  //--------------------------------------  // Log in a user
  async login(credentials) {
    try {
      // Send POST request to /login with credentials as JSON
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials), // credentials usually { email, password }
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}. Expected JSON response.`
        );
      }

      // Parse JSON response
      const data = await response.json();

      // Throw on non-2xx responses
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Invalid credentials. Please check your email and password."
          );
        }
        throw new Error(data.message || data.error || "Login failed");
      }

      // Return parsed response (should include token and user)
      return data;
    } catch (error) {
      // Handle network errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to server. Make sure your Laravel backend is running on http://localhost:8000"
        );
      }
      throw error;
    }
  },

  // Log out the current user
  async logout() {
    // Read stored token from localStorage
    const token = localStorage.getItem("token");

    // Send POST request to /logout with Authorization header
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // include token for auth
        Accept: "application/json",
      },
    });

    // If logout succeeded, remove stored auth data
    if (response.ok) {
      localStorage.removeItem("token"); // remove token
      localStorage.removeItem("user"); // remove user object
    }

    // Return boolean indicating success
    return response.ok;
  },
};
