<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pemasok;

class PemasokController extends Controller
{
    // Menampilkan semua data pemasok
    public function index()
    {
        return response()->json(
            Pemasok::all()
        );
    }

    // Menyimpan data pemasok
    public function store(Request $request)
    {
        $pemasok = Pemasok::create([
            'supplier_name' => $request->supplier_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'waste_type' => $request->waste_type,
            'total_pickup' => $request->total_pickup,
            'city' => $request->city,
            'status' => $request->status,
            'join_date' => $request->join_date,
            'last_pickup' => $request->last_pickup,
            'payment_method' => $request->payment_method,
            'address' => $request->address,
        ]);

        return response()->json([
            'message' => 'Data berhasil disimpan',
            'data' => $pemasok
        ]);
    }
}