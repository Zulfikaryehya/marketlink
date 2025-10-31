<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing listings that have null or empty condition values
        DB::table('listings')
            ->whereNull('condition')
            ->orWhere('condition', '')
            ->update(['condition' => 'Used']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No rollback needed for data updates
    }
};
