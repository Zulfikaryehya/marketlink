<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB limit
        ]);

        $image = $request->file('image');
        $imageData = base64_encode(file_get_contents($image));

        $response = Http::asForm()->post('https://api.imgbb.com/1/upload', [
            'key' => env('IMGBB_API_KEY'), // stored securely in .env
            'image' => $imageData,
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Image upload failed'], 500);
        }

        $imageUrl = $response->json()['data']['url'];

        return response()->json(['url' => $imageUrl]);
    }
}
