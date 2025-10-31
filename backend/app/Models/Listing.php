<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'price',
        'images',
        'category',  // Add this
    ];

    protected $casts = [
        'images' => 'array', // So images column is automatically cast to array
    ];

    // Optional: Relation to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
