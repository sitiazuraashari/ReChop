<?php

// Namespace untuk controller API
namespace App\Http\Controllers\Api;

// Import controller utama Laravel
use App\Http\Controllers\Controller;

// Import model yang digunakan
use App\Models\Pembelian;
use App\Models\ProdukPencacahan;
use App\Models\Pemasok;

// Import class Request
use Illuminate\Http\Request;

// Controller untuk mengelola data pembelian
class PembelianController extends Controller
{
    // Menampilkan seluruh data pembelian
    public function index()
    {
        // Mengambil data pembelian beserta relasi produk pencacahan dan pemasok
        // kemudian diurutkan dari data terbaru
        return response()->json(
            Pembelian::with(['produkPencacahan', 'pemasok'])->latest()->get()
        );
    }

    // Menyimpan data pembelian baru
    public function store(Request $request)
    {
        // Validasi data yang dikirim dari frontend
        $validated = $request->validate([
            'pemasok_id' => 'required|exists:pemasoks,id',
            'produk_pencacahan_id' => 'required|exists:produk_pencacahans,id',
            'berat' => 'required|numeric|min:0',
            'tanggal_transaksi' => 'required|date',
        ]);

        // Mengambil data pemasok berdasarkan ID
        $pemasok = Pemasok::findOrFail($validated['pemasok_id']);

        // Mengambil data produk pencacahan berdasarkan ID
        $produk = ProdukPencacahan::findOrFail($validated['produk_pencacahan_id']);

        // Mengisi data otomatis dari relasi
        $validated['nama_pembeli'] = $pemasok->supplier_name;
        $validated['nama_sampah'] = $produk->nama;
        $validated['harga'] = $produk->harga;

        // Mengambil transaksi terakhir
        $last = Pembelian::latest()->first();

        // Membuat nomor urut transaksi berikutnya
        $nextNumber = $last
            ? ((int) substr($last->kode_transaksi, 4)) + 1
            : 1;

        // Membuat kode transaksi dengan format TRX-001
        $validated['kode_transaksi'] =
            'TRX-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        // Menyimpan data pembelian ke database
        $pembelian = Pembelian::create($validated);

        // Memuat relasi produk pencacahan
        $pembelian->load('produkPencacahan');

        // Mengembalikan response berhasil
        return response()->json([
            'message' => 'Data berhasil ditambahkan',
            'data' => $pembelian,
        ], 201);
    }

    // Menghapus data pembelian berdasarkan ID
    public function destroy($id)
    {
        // Mencari data pembelian
        $pembelian = Pembelian::findOrFail($id);

        // Menghapus data pembelian
        $pembelian->delete();

        // Mengembalikan response berhasil
        return response()->json([
            'message' => 'Data berhasil dihapus'
        ]);
    }
}