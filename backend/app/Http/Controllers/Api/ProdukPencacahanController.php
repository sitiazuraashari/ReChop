<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProdukPencacahan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProdukPencacahanController extends Controller
{
    public function index()
    {
        $perPage = (int) request()->query('per_page', 10);
        $q = request()->query('q', null);

        // Build query with a simple relevance scoring when search query is present.
        $query = ProdukPencacahan::query();

        if ($q) {
            $like = "%{$q}%";

            $query->where(function ($sub) use ($q, $like) {
                $sub->where('nama', 'like', $like)
                    ->orWhere('jenis', 'like', $like)
                    ->orWhere('kode_produk', 'like', $like);
            });

            // Add relevance score: nama matches are strongest, then jenis, then kode.
            $query->select('*', DB::raw("(CASE WHEN nama LIKE ? THEN 300 WHEN jenis LIKE ? THEN 200 WHEN kode_produk LIKE ? THEN 100 ELSE 0 END) as relevance"))
                ->setBindings([$like, $like, $like], 'select')
                ->orderByDesc('relevance')
                ->orderByDesc('created_at');
        } else {
            $query->latest();
        }

        $produk = $query->paginate($perPage);

        // transform collection to include full image URL
        $produk->getCollection()->transform(function ($item) {
            $item->gambar = $item->gambar
                ? asset('storage/' . $item->gambar)
                : null;

            return $item;
        });

        return response()->json($produk);
    }

    /*
    |--------------------------------------------------------------------------
    | Detail Produk
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        $produk = ProdukPencacahan::findOrFail($id);

        $produk->gambar = $produk->gambar
            ? asset('storage/' . $produk->gambar)
            : null;

        return response()->json($produk);
    }

    /*
    |--------------------------------------------------------------------------
    | Simpan Produk
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama'   => 'required|string|max:255',
            'jenis'  => 'required|string|max:255',
            'stok'   => 'required|integer|min:0',
            'harga'  => 'required|numeric|min:0',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $last = ProdukPencacahan::latest()->first();

        $nextNumber = $last
            ? ((int) substr($last->kode_produk, 2)) + 1
            : 1;

        $validated['kode_produk'] =
            'PR' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        if ($request->hasFile('gambar')) {

            $validated['gambar'] = $request
                ->file('gambar')
                ->store('produk', 'public');
        }

        $produk = ProdukPencacahan::create($validated);

        $produk->gambar = $produk->gambar
            ? asset('storage/' . $produk->gambar)
            : null;

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'data' => $produk,
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | Hapus Produk
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        $produk = ProdukPencacahan::findOrFail($id);

        if ($produk->gambar) {
            Storage::disk('public')->delete($produk->gambar);
        }

        $produk->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus',
        ]);
    }
}