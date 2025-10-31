<?php

namespace App\Http\Middleware;

use App\Models\Listing;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckListingOwnership
{
    /**
     * Handle an incoming request.
     *
     * This middleware ensures that only the owner of a listing can perform
     * destructive operations like updating or deleting the listing.
     *
     * Usage: Apply this middleware to routes that modify listings:
     * - PUT /api/listings/{id} (update)
     * - DELETE /api/listings/{id} (delete)
     *
     * The middleware will:
     * 1. Extract the listing ID from the route
     * 2. Find the corresponding listing in the database
     * 3. Check if the authenticated user owns the listing
     * 4. Return 403 Unauthorized if not the owner
     * 5. Allow the request to proceed if the user owns the listing
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get the listing ID from the route parameter
        $listingId = $request->route('listing');

        // If listing ID is an object (model binding), get the ID
        if ($listingId instanceof Listing) {
            $listing = $listingId;
        } else {
            // Find the listing by ID
            $listing = Listing::find($listingId);
        }

        // Check if listing exists
        if (!$listing) {
            return response()->json([
                'message' => 'Listing not found'
            ], 404);
        }

        // Check if the authenticated user owns the listing
        if (Auth::id() !== $listing->user_id) {
            return response()->json([
                'message' => 'Unauthorized. You do not own this listing.'
            ], 403);
        }

        return $next($request);
    }
}
