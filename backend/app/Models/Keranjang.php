<?php

// Namespace untuk model Keranjang
namespace App\Models;

// Import class Model Laravel
use Illuminate\Database\Eloquent\Model;

// Model yang merepresentasikan tabel keranjang
class Keranjang extends Model
{
    // Menentukan field yang boleh diisi secara mass assignment
    protected $fillable = [
        'produk_id',
        'qty',
        'subtotal'
    ];

    // Relasi many-to-one dengan tabel produk_pencacahans
    // Satu data keranjang hanya memiliki satu produk
    public function produk()
    {
        return $this->belongsTo(ProdukPencacahan::class,'produk_id');
    }
}