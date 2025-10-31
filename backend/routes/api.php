<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\UserController;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api')->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api')->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->middleware('auth:api')->name('me');
});


// Route::apiResource('listings', ListingController::class)->middleware('auth:api');
Route::get('/listings', [ListingController::class, 'index']);     // GET all listings
Route::post('/listings', [ListingController::class, 'store'])->middleware('auth:api');      // POST create new listing
Route::get('/listings/{listing}', [ListingController::class, 'show']); // GET single listing
Route::put('/listings/{listing}', [ListingController::class, 'update'])->middleware(['auth:api', 'listing.owner']); // PUT update listing (owner only)
Route::delete('/listings/{listing}', [ListingController::class, 'destroy'])->middleware(['auth:api', 'listing.owner']); // DELETE listing (owner only)
Route::get('/listings/category/{category}', [ListingController::class, 'getListingsByCategory']); // GET listings by category
Route::get('/users/{userId}/listings', [ListingController::class, 'getUserListings']); // GET listings by user
Route::get('/users/{id}', [UserController::class, 'show']); // GET user profile by ID



Route::post('/upload-image', [ImageUploadController::class, 'upload']);


//for comments
use App\Http\Controllers\CommentController;

Route::get('listings/{listing}/comments', [CommentController::class, 'index']);
Route::post('listings/{listing}/comments', [CommentController::class, 'store'])->middleware('auth:api');;
Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->middleware('auth:api');;
