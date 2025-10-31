# Listing Ownership Middleware Documentation

## Overview

The `CheckListingOwnership` middleware ensures that only the owner of a listing can perform destructive operations on it.

## Implementation Details

### Middleware Location

-   **File**: `app/Http/Middleware/CheckListingOwnership.php`
-   **Alias**: `listing.owner`
-   **Registration**: `bootstrap/app.php`

### Protected Routes

The middleware is applied to the following API endpoints:

1. **PUT** `/api/listings/{listing}` - Update listing (owner only)
2. **DELETE** `/api/listings/{listing}` - Delete listing (owner only)

### Middleware Logic

1. Extracts the listing ID from the route parameter
2. Finds the corresponding listing in the database
3. Checks if the authenticated user owns the listing (`user_id` matches)
4. Returns `403 Unauthorized` if not the owner
5. Allows the request to proceed if the user owns the listing

### Response Codes

-   **200**: Success - User owns the listing, operation allowed
-   **403**: Forbidden - User doesn't own the listing
-   **404**: Not Found - Listing doesn't exist
-   **401**: Unauthorized - User not authenticated

### Usage Example

#### Protected Routes (Require ownership):

```php
// These routes require both authentication and ownership
Route::put('/listings/{listing}', [ListingController::class, 'update'])
    ->middleware(['auth:api', 'listing.owner']);

Route::delete('/listings/{listing}', [ListingController::class, 'destroy'])
    ->middleware(['auth:api', 'listing.owner']);
```

#### Public Routes (No ownership required):

```php
// These routes don't require ownership
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{listing}', [ListingController::class, 'show']);
Route::post('/listings', [ListingController::class, 'store'])->middleware('auth:api');
```

### Frontend Integration

The frontend should handle the middleware responses appropriately:

-   **403 responses**: Show "You don't have permission to perform this action"
-   **404 responses**: Show "Listing not found"
-   **401 responses**: Redirect to login page

### Security Benefits

1. **Data Protection**: Prevents users from modifying others' listings
2. **Access Control**: Centralized ownership verification
3. **Consistency**: Same ownership logic across all protected endpoints
4. **Maintainability**: Easy to modify ownership rules in one place

### Testing

To test the middleware:

1. Create a listing as User A
2. Try to edit/delete it as User B (should get 403)
3. Try to edit/delete it as User A (should succeed)
4. Try to edit/delete non-existent listing (should get 404)
