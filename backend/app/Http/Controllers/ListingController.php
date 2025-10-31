<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ListingController extends Controller
{
    /**
     * Display all listings
     */
    public function index()
    {
        $listings = Listing::with('user')->latest()->get();

        return response()->json($listings);
    }


    /**
     * Store a new listing
     */
    public function store(Request $request)
    {
        $mainCategories = ['Electronics', 'Fashion & Apparel', 'Home & Furniture', 'Vehicles', 'Books & Education', 'Sports & Recreation', 'Health & Beauty', 'Collectibles & Art'];
        $conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor', 'Used'];
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string|url',
            'category' => 'required|string|in:' . implode(',', $mainCategories),
            'condition' => 'required|string|in:' . implode(',', $conditions),
            'location' => 'nullable|string|max:255',
        ]);
        // For learning, you can set user manually if not using auth
        $userId = Auth::id();

        $listing = Listing::create([
            'user_id' => $userId,
            ...$validated,
        ]);

        return response()->json([
            'message' => 'Listing created successfully',
            'listing' => $listing,
        ], 201);
    }

    /**
     * Display a single listing
     */
    public function show(Listing $listing)
    {
        return response()->json($listing->load('user'));
    }

    /**
     * Update a listing
     */
    public function update(Request $request, Listing $listing)
    {
        $mainCategories = ['Electronics', 'Fashion & Apparel', 'Home & Furniture', 'Vehicles', 'Books & Education', 'Sports & Recreation', 'Health & Beauty', 'Collectibles & Art'];
        $conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor', 'Used'];
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string|url',
            'category' => 'sometimes|string|in:' . implode(',', $mainCategories),
            'condition' => 'sometimes|string|in:' . implode(',', $conditions),
            'location' => 'sometimes|nullable|string|max:255',
        ]);
        $listing->update($validated);

        return response()->json([
            'message' => 'Listing updated successfully',
            'listing' => $listing,
        ]);
    }

    /**
     * Delete a listing
     */
    public function destroy(Listing $listing)
    {
        $listing->delete();

        return response()->json(['message' => 'Listing deleted successfully']);
    }

    public function getListingsByCategory(Request $request, $category)
    {
        $query = Listing::where('category', $category)->with('user');

        // Exclude a specific listing if provided
        if ($request->has('exclude')) {
            $query->where('id', '!=', $request->get('exclude'));
        }

        // Limit results if provided
        if ($request->has('limit')) {
            $query->limit((int) $request->get('limit'));
        }

        $listings = $query->latest()->get();

        return response()->json($listings);
    }

    public function getListingsByPriceRange(Request $request)
    {
        $minPrice = $request->query('min', 0);
        $maxPrice = $request->query('max', PHP_INT_MAX);

        $listings = Listing::whereBetween('price', [$minPrice, $maxPrice])
            ->with('user')
            ->latest()
            ->get();

        return response()->json($listings);
    }



    /**
     * Get listings by user ID
     */
    public function getUserListings($userId)
    {
        $listings = Listing::where('user_id', $userId)
            ->with('user')
            ->latest()
            ->get();

        return response()->json($listings);
    }
}
