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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'images' => 'nullable|array',      // must be an array of URLs
            'images.*' => 'string|url',        // each one must be a URL
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
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string|url',
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
}
