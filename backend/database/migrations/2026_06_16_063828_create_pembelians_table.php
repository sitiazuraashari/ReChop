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
    Schema::create('pembelians', function (Blueprint $table) {
        $table->id();
        $table->string('kode_transaksi')->unique();
        $table->foreignId('pemasok_id')
            ->constrained('pemasoks')
            ->cascadeOnDelete();
        $table->string('nama_pembeli');
        $table->foreignId('produk_pencacahan_id')
            ->constrained('produk_pencacahans')
            ->cascadeOnDelete();
        $table->string('nama_sampah');
        $table->decimal('berat', 10, 2);
        $table->decimal('harga', 15, 2);
        $table->date('tanggal_transaksi');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembelians');
    }
};
