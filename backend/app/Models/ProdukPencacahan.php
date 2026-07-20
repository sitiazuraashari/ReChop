<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdukPencacahan extends Model
{
    protected $fillable = [
        'kode_produk',
        'nama',
        'jenis',
        'gambar',
        'stok',
        'harga',
    ];

    public function keranjangs()
{
    return $this->hasMany(Keranjang::class,'produk_id');
}
}