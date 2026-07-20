<?php

// Namespace untuk controller API
namespace App\Http\Controllers\Api;

// Import controller utama Laravel
use App\Http\Controllers\Controller;

// Import model Pembeli
use App\Models\Pembeli;

// Import class Request
use Illuminate\Http\Request;

// Controller untuk mengelola data pembeli
class PembeliController extends Controller
{
    // Menampilkan seluruh data pembeli
    public function index()
    {
        // Mengambil semua data pembeli dari database
        return response()->json(
            Pembeli::all()
        );
    }

    // Menyimpan data pembeli baru
    public function store(Request $request)
    {
        // Membuat data pembeli berdasarkan input dari request
        $pembeli = Pembeli::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'status' => $request->status,
            'total_orders' => $request->total_orders,
            'total_spent' => $request->total_spent,
            'waste_type' => $request->waste_type,
            'join_date' => $request->join_date,
        ]);

        // Mengembalikan response bahwa data berhasil disimpan
        return response()->json([
            'message' => 'Data pembeli berhasil disimpan',
            'data' => $pembeli
        ]);
    }
}