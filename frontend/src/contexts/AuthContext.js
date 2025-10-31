import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api } from "../services/api";

// Create a context object to hold auth state and actions
const AuthContext = createContext();

// Reducer to update auth state based on dispatched actions
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      // When login succeeds, set authenticated state, user and token
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "LOGOUT":
      // Clear auth state on logout
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case "SET_LOADING":
      // Toggle loading flag while async operations run
      return { ...state, loading: action.payload };
    case "SET_AUTHENTICATED":
      // Set authentication status without user data
      return {
        ...state,
        isAuthenticated: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Provider component that wraps the app and provides auth state/actions
export const AuthProvider = ({ children }) => {
  // Initialize reducer with default auth state
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
  });

  // On mount, check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) {
      // If token exists, set as authenticated
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token,
          user: user ? JSON.parse(user) : null,
        },
      });
    } else {
      // No token found, user is not authenticated
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);
  // login action that calls API and updates context + localStorage
  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await api.login(credentials);

      // Store token and user in localStorage for persistence
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("token_type", data.token_type || "bearer");
        localStorage.setItem("expires_in", data.expires_in || "3600");
      }

      // Store user data in localStorage
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_Id", data.user.id); // Store user ID separately for easy access
      }

      // Update context state with successful login
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: data.access_token,
          user: data.user || null,
        },
      });

      return { success: true, data };
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: error.message };
    }
  };
  // logout action that calls API and clears state/localStorage
  const logout = async () => {
    try {
      // Attempt server-side logout if token exists
      const token = localStorage.getItem("token");
      if (token) {
        await api.logout();
      }
    } catch (error) {
      console.log("Server logout failed:", error);
    } finally {
      // Clear local auth state regardless of server response
      localStorage.removeItem("token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("expires_in");
      localStorage.removeItem("user");
      localStorage.removeItem("user_Id");
      dispatch({ type: "LOGOUT" });
    }
  };

  // Provide state and actions to any child component
  return (
    <AuthContext.Provider
      value={{
        ...state, // spread current auth state
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume auth context more easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
