# Frontend to Backend Integration Guide

## Overview

This document explains how to connect your React frontend to your Laravel backend for user registration and authentication.

## Backend Setup (Laravel)

### 1. API Routes Setup

In your `backend/routes/api.php` file, add these routes:

```php
<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});
```

### 2. Create Authentication Controller

Create `backend/app/Http/Controllers/Auth/AuthController.php`:

```php
<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'password_confirmation' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->username, // or create a separate username field
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
```

### 3. Enable CORS

In `backend/config/cors.php`, make sure these settings allow your frontend:

```php
'allowed_origins' => ['http://localhost:3000'], // Your React app URL
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### 4. Update User Model (if needed)

If you want to add a username field, create a migration:

```bash
php artisan make:migration add_username_to_users_table --table=users
```

## Frontend Integration

### 1. Environment Variables

Create a `.env` file in your frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 2. API Service (Create this file)

Create `frontend/src/services/api.js` with comments explaining each line:

```javascript
// Get base API URL from environment or fallback to local dev server
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const api = {
  // Register a new user
  async register(userData) {
    // Send POST request to /register with JSON body
    const response = await fetch(`${API_URL}/register`, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // tell server we're sending JSON
        Accept: "application/json", // tell server we expect JSON back
      },
      body: JSON.stringify({
        username: userData.username, // send username field
        email: userData.email, // send email field
        password: userData.password, // send password field
        password_confirmation: userData.confirmPassword, // send password confirmation
      }),
    });

    // Parse JSON response body
    const data = await response.json();

    // If response status is not 2xx, throw an error (will be caught by caller)
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Return parsed data to caller
    return data;
  },
  //--------------------------------------
  // Log in a user
  async login(credentials) {
    // Send POST request to /login with credentials as JSON
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials), // credentials usually { email, password }
    });

    // Parse JSON response
    const data = await response.json();

    // Throw on non-2xx responses
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Return parsed response (should include token and user)
    return data;
  },

  // Log out the current user
  async logout() {
    // Read stored token from localStorage
    const token = localStorage.getItem("token");

    // Send POST request to /logout with Authorization header
    const response = await fetch(`${API_URL}/logout`, {
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
```

### 3. Update SignupPage Component

Replace the try block in `SignupPage.js` with this commented version (each line explained):

```javascript
try {
  // Call the api.register function with form data and wait for response
  const data = await api.register(formData);

  // Store returned token so we can authenticate later
  localStorage.setItem("token", data.token);

  // Store user information (stringified) for quick access in the UI
  localStorage.setItem("user", JSON.stringify(data.user));

  // Inform the user that registration succeeded (replace with proper UI in production)
  alert("Registration successful! You are now logged in.");
  // navigate('/dashboard'); // optional: navigate to dashboard if using React Router
} catch (error) {
  // Log the error for debugging
  console.error("Registration error:", error);

  // If backend returned validation errors, show a friendly message
  if (error.message.includes("Validation failed")) {
    setErrors({ general: "Please check your input and try again." });
  } else {
    // Otherwise show the error message or a generic fallback
    setErrors({
      general: error.message || "Registration failed. Please try again.",
    });
  }
}
```

### 4. Install Required Dependencies

```bash
npm install react-router-dom  # for navigation (optional but recommended)
```

## Authentication Context (Recommended)

Create `frontend/src/contexts/AuthContext.js` with comments that explain each line:

```javascript
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

  // On mount, load saved token/user from localStorage if present
  useEffect(() => {
    const token = localStorage.getItem("token"); // get token string
    const user = localStorage.getItem("user"); // get user JSON string

    if (token && user) {
      // If stored data exists, dispatch login success to populate state
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token,
          user: JSON.parse(user), // parse JSON back to object
        },
      });
    }

    // Turn off initial loading state
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  // login action that calls API and updates context + localStorage
  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true }); // show loading
      const data = await api.login(credentials); // call API

      // Store token and user in localStorage for persistence
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update context state with successful login payload
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: data,
      });

      return { success: true }; // return success to caller
    } catch (error) {
      // Turn off loading and return error information
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: error.message };
    }
  };

  // logout action that calls API and clears state/localStorage
  const logout = async () => {
    await api.logout(); // attempt server-side logout
    dispatch({ type: "LOGOUT" }); // clear local auth state
  };

  // Provide state and actions to any child component
  return (
    <AuthContext.Provider
      value={{
        ...state, // spread current auth state (isAuthenticated, user, token, loading)
        login, // expose login function
        logout, // expose logout function
      }}
    >
      {children} {/* render child components */}
    </AuthContext.Provider>
  );
};

// Custom hook to consume auth context more easily
export const useAuth = () => {
  const context = useContext(AuthContext); // read context
  if (!context) {
    // guard clause to ensure hook is used inside provider
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context; // return the auth context (state + actions)
};
```

## Testing the Integration

1. Start your Laravel backend: `php artisan serve`
2. Start your React frontend: `npm start`
3. Navigate to the signup page
4. Fill out the form and submit
5. Check the Laravel logs and database for the new user
6. Verify the token is stored in localStorage

## Security Notes

- Always use HTTPS in production
- Implement proper CSRF protection
- Use environment variables for sensitive data
- Consider implementing refresh tokens for better security
- Validate and sanitize all inputs on both frontend and backend
- Implement rate limiting on your API endpoints
