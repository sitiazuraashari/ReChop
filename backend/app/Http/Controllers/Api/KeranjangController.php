<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Keranjang;
use App\Models\ProdukPencacahan;
use Illuminate\Http\Request;

class KeranjangController extends Controller
{
    // Menampilkan isi keranjang
    public function index()
    {
        $keranjang = Keranjang::with('produk')->latest()->get();

        $keranjang->map(function ($item) {

            if ($item->produk && $item->produk->gambar) {
                $item->produk->gambar = asset('storage/' . $item->produk->gambar);
            }

            return $item;
        });

        return response()->json($keranjang);
    }

    // Tambah ke keranjang
    public function store(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produk_pencacahans,id',
            'qty' => 'required|integer|min:1',
        ]);

        $produk = ProdukPencacahan::findOrFail($request->produk_id);

        if ($request->qty > $produk->stok) {

            return response()->json([
                'message' => 'Stok tidak mencukupi.'
            ],422);

        }

        // Kalau produk sudah ada di keranjang
        $keranjang = Keranjang::where('produk_id',$produk->id)->first();

        if($keranjang){

            $keranjang->qty += $request->qty;
            $keranjang->subtotal = $keranjang->qty * $produk->harga;
            $keranjang->save();

        }else{

            $keranjang = Keranjang::create([
                'produk_id'=>$produk->id,
                'qty'=>$request->qty,
                'subtotal'=>$produk->harga * $request->qty,
            ]);

        }

        return response()->json([
            'message'=>'Produk berhasil ditambahkan ke keranjang',
            'data'=>$keranjang
        ]);
    }

    // Hapus item keranjang
    public function destroy($id)
    {
        $keranjang = Keranjang::findOrFail($id);

        $keranjang->delete();

        return response()->json([
            'message'=>'Produk berhasil dihapus dari keranjang'
        ]);
    }
}