<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Pembeli;

class Penjualan extends Model
{
    protected $fillable = [
        'pembeli_id',
        'nama_pembeli',
        'nama_produk',
        'jumlah',
        'harga',
        'metode_pembayaran',
        'tanggal_transaksi'
    ];

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class);
    }
}