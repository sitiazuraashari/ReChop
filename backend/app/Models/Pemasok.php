<?php

// Namespace untuk model Pemasok
namespace App\Models;

// Import class Model Laravel
use Illuminate\Database\Eloquent\Model;

// Model yang merepresentasikan tabel pemasok
class Pemasok extends Model
{
    // Menentukan field yang boleh diisi menggunakan mass assignment
    protected $fillable = [
        'supplier_name',
        'email',
        'phone',
        'waste_type',
        'total_pickup',
        'city',
        'status',
        'join_date',
        'last_pickup',
        'payment_method',
        'address'
    ];

    // Melakukan konversi otomatis tipe data pada atribut tertentu
    protected $casts = [
        // Mengubah data waste_type menjadi array
        'waste_type' => 'array',

        // Mengubah join_date menjadi objek tanggal
        'join_date' => 'date',

        // Mengubah last_pickup menjadi objek tanggal
        'last_pickup' => 'date'
    ];
}