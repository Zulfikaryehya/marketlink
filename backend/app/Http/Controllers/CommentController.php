<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CommentController extends Controller
{
    use AuthorizesRequests;

    // Show all comments for a listing
    public function index($listingId)
    {
        $comments = Comment::with('user')
            ->where('listing_id', $listingId)
            ->latest()
            ->get();

        return response()->json($comments);
    }

    // Add a comment to a listing
    public function store(Request $request, $listingId)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'listing_id' => $listingId,
            'user_id' => Auth::id(), // Or set manually for testing
            'body' => $request->body,
        ]);

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment->load('user'),
        ], 201);
    }

    // Delete a comment
    public function destroy(Comment $comment)
    {
        // Check if the authenticated user owns the comment
        if (Auth::id() !== $comment->user_id) {
            return response()->json(['message' => 'Unauthorized to delete this comment'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
