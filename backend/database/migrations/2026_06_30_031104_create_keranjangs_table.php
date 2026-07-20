<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('keranjangs', function (Blueprint $table) {

            $table->id();

            $table->foreignId('produk_id')
                ->constrained('produk_pencacahans')
                ->onDelete('cascade');

            $table->integer('qty');

            $table->decimal('subtotal',12,2);

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('keranjangs');
    }
};