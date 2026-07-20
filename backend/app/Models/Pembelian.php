<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProdukPencacahan;
use App\Models\Pemasok;

class Pembelian extends Model
{
    protected $fillable = [
        'kode_transaksi',
        'pemasok_id',
        'nama_pembeli',
        'produk_pencacahan_id',
        'nama_sampah',
        'berat',
        'harga',
        'tanggal_transaksi',
    ];

    public function produkPencacahan()
    {
        return $this->belongsTo(ProdukPencacahan::class);
    }

    public function pemasok()
    {
        return $this->belongsTo(Pemasok::class);
    }
}
