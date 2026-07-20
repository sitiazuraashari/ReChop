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
    Schema::create('produk_pencacahans', function (Blueprint $table) {
        $table->id();
        $table->string('kode_produk')->unique();
        $table->string('nama');
        $table->string('jenis');
        $table->integer('stok');
        $table->decimal('harga', 12, 2);
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('produk_pencacahans');
    }
};
