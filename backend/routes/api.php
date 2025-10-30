<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ImageUploadController;

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


Route::apiResource('listings', ListingController::class)->middleware('auth:api');
// Route::get('/listings', [ListingController::class, 'index']);       // GET all listings
// Route::post('/listings', [ListingController::class, 'store']);      // POST create new listing
// Route::get('/listings/{listing}', [ListingController::class, 'show']); // GET single listing
// Route::put('/listings/{listing}', [ListingController::class, 'update']); // PUT update listing
// Route::delete('/listings/{listing}', [ListingController::class, 'destroy']); // DELETE listing




Route::post('/upload-image', [ImageUploadController::class, 'upload']);
