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
    Schema::create('penjualans', function (Blueprint $table) {
        $table->id();

        $table->foreignId('pembeli_id')
            ->constrained('pembelis')
            ->cascadeOnDelete();
        $table->string('nama_pembeli');
        $table->string('nama_produk');

        $table->integer('jumlah')->default(0);

        $table->decimal('harga', 15, 2)->default(0);

        $table->enum('metode_pembayaran', [
            'Transfer Bank',
            'Cash',
            'QRIS',
            'E-Wallet'
        ])->default('Transfer Bank');

        $table->date('tanggal_transaksi');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penjualans');
    }
};
