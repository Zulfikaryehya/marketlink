# Quick Setup & Testing Guide

## Backend Setup (Laravel)

### 1. Start the Laravel Development Server

Open a terminal in your backend directory and run:

```bash
cd c:\Users\zulfi\Desktop\marketlink\backend
php artisan serve
```

This will start Laravel on `http://localhost:8000`

### 2. Test the API Endpoint

You can test if your registration endpoint is working by using curl or a tool like Postman:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}"
```

### 3. Enable CORS (if not already done)

Make sure CORS is enabled in your Laravel app. Check `config/cors.php`:

```php
'allowed_origins' => ['http://localhost:3000'], // Your React app URL
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

## Frontend Setup

### 1. Start the React Development Server

Open a terminal in your frontend directory and run:

```bash
cd c:\Users\zulfi\Desktop\marketlink\frontend
npm start
```

This will start React on `http://localhost:3000`

### 2. Test the Registration

1. Go to `http://localhost:3000`
2. Fill out the signup form
3. Click "Register"
4. Check the browser console for any errors

## Fixed Issues

✅ **API Endpoint**: Updated to use `/api/auth/register` (matches your Laravel routes)
✅ **Field Names**: Frontend now sends `name` instead of `username` (matches your Laravel controller)
✅ **Password Confirmation**: Uses `password_confirmation` field (matches Laravel validation)
✅ **Error Handling**: Better error messages for connection issues and validation errors

## Troubleshooting

### If you get "Cannot connect to server":

- Make sure Laravel is running on `http://localhost:8000`
- Check that the API routes are accessible at `http://localhost:8000/api/auth/register`

### If you get validation errors:

- Check that all required fields are filled
- Password must be at least 8 characters
- Email must be unique in the database
- Password confirmation must match password

### If you get CORS errors:

- Make sure your Laravel CORS settings allow `http://localhost:3000`
- Install Laravel Sanctum if not already installed: `composer require laravel/sanctum`

## Testing the Connection

You can test if everything is connected properly by:

1. **Start both servers** (Laravel on :8000, React on :3000)
2. **Open browser console** (F12)
3. **Fill out the signup form** and submit
4. **Check the console** for any error messages
5. **Check your database** to see if the user was created

The form will show an alert if registration is successful, or display error messages if something goes wrong.
