<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('penjualans', 'pembeli_id')) {
            Schema::table('penjualans', function (Blueprint $table) {
                $table->foreignId('pembeli_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('pembelis')
                    ->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('penjualans', 'pembeli_id')) {
            Schema::table('penjualans', function (Blueprint $table) {
                $table->dropConstrainedForeignId('pembeli_id');
            });
        }
    }
};
