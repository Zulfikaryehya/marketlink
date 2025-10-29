# Login Page Setup & Testing Guide

## ✅ What's Complete

### Login Page Features:

- **Form Validation**: Email format and required field validation
- **Password Toggle**: Show/hide password functionality
- **Error Handling**: Proper error messages for different scenarios
- **Social Login Placeholders**: Google and Facebook login buttons (UI only)
- **Responsive Design**: Mobile-friendly layout
- **Backend Integration**: Ready to connect with your Laravel JWT authentication

### Backend Integration:

- **API Calls**: Configured for `/api/auth/login` endpoint
- **JWT Token Handling**: Stores `access_token`, `token_type`, and `expires_in`
- **Error Handling**: Handles 401 Unauthorized and network errors

## 🔧 Backend Requirements

Your Laravel backend should have these endpoints:

### 1. Login Endpoint: `POST /api/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

**Error Response (401):**

```json
{
  "error": "Unauthorized"
}
```

### 2. User Info Endpoint: `POST /api/auth/me` (Optional)

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-10-25T10:00:00.000000Z",
  "updated_at": "2025-10-25T10:00:00.000000Z"
}
```

## 🚀 How to Test

### 1. Start Your Laravel Backend

```powershell
cd "c:\Users\zulfi\Desktop\marketlink\backend"
php artisan serve
```

### 2. Start Your React Frontend

```powershell
cd "c:\Users\zulfi\Desktop\marketlink\frontend"
npm start
```

### 3. Test Login Flow

1. Go to `http://localhost:3000`
2. Enter valid email and password
3. Click "Log In"
4. Check browser console for success message
5. Check localStorage for stored token

### 4. Test Error Scenarios

- **Invalid Credentials**: Use wrong email/password
- **Server Offline**: Stop Laravel server and try to login
- **Empty Fields**: Submit form without filling fields

## 🔍 Debugging

### Check if Backend is Running:

```powershell
# Test the login endpoint directly
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -H "Accept: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password\"}"
```

### Check Browser Developer Tools:

1. **Network Tab**: See if API calls are being made
2. **Console Tab**: Check for error messages
3. **Application Tab**: Check localStorage for stored tokens

### Common Issues:

**❌ "Cannot connect to server"**

- Laravel server is not running
- Wrong API URL in .env file

**❌ "Invalid credentials"**

- Wrong email/password combination
- User doesn't exist in database

**❌ "Unexpected token"**

- Laravel returning HTML error page instead of JSON
- CORS issues

## 🎯 Next Steps

1. **Create a user** in your Laravel database for testing
2. **Test the login flow** with valid credentials
3. **Implement routing** to redirect after successful login
4. **Add user context** to manage authentication state globally
5. **Implement social login** (Google/Facebook OAuth)

## 📝 Code Integration Points

In `LoginPage.js`, replace the TODO comments with:

### 1. Navigation After Login

```javascript
// After successful login:
navigate("/dashboard"); // Requires react-router-dom
```

### 2. Fetch User Data

Uncomment the user data fetching code in the success handler to get user information immediately after login.

### 3. Global Auth Context

Use the AuthContext from the integration guide to manage authentication state across your app.

## 🔐 Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Implement token refresh logic for long-term sessions
- Add CSRF protection for additional security
- Use HTTPS in production environments
