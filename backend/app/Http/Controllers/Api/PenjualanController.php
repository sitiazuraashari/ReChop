<?php

// Namespace untuk controller API
namespace App\Http\Controllers\Api;

// Import model yang digunakan
use App\Models\Keranjang;
use App\Models\ProdukPencacahan;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Penjualan;
use App\Models\Pembeli;

// Import class Request
use Illuminate\Http\Request;

// Controller untuk mengelola transaksi penjualan
class PenjualanController extends Controller
{
    // Menampilkan data penjualan
    public function index(Request $request)
    {
        // Mengambil data penjualan dan memfilter berdasarkan pembeli_id jika tersedia
        return response()->json(
            Penjualan::when($request->pembeli_id, function ($query, $pembeliId) {
                $query->where('pembeli_id', $pembeliId);
            })
                ->latest()
                ->get()
        );
    }

    // Menyimpan transaksi penjualan (checkout)
    public function store(Request $request)
    {
        // Validasi data yang dikirim dari frontend
        $request->validate([
            'pembeli_id' => 'required|exists:pembelis,id',
            'metode_pembayaran' => 'required|string|max:255',
            'tanggal_transaksi' => 'required|date',
        ]);

        // Memulai transaksi database
        DB::beginTransaction();

        try {

            // Mengambil data pembeli
            $pembeli = Pembeli::findOrFail($request->pembeli_id);

            // Mengambil seluruh isi keranjang beserta relasi produk
            $keranjang = Keranjang::with('produk')->get();

            // Mengecek apakah keranjang kosong
            if ($keranjang->isEmpty()) {
                DB::rollBack();

                return response()->json([
                    'message' => 'Keranjang kosong.'
                ], 422);
            }

            // Memproses setiap item dalam keranjang
            foreach ($keranjang as $item) {

                // Mengambil data produk
                $produk = ProdukPencacahan::find($item->produk_id);

                // Mengecek apakah stok mencukupi
                if ($produk->stok < $item->qty) {

                    DB::rollBack();

                    return response()->json([
                        'message' => 'Stok ' . $produk->nama . ' tidak mencukupi.'
                    ], 422);
                }

                // Menyimpan data penjualan
                Penjualan::create([

                    'pembeli_id' => $pembeli->id,

                    // Menyimpan nama pembeli
                    'nama_pembeli' => $pembeli->name,

                    // Menyimpan nama produk
                    'nama_produk' => $produk->nama,

                    // Menyimpan jumlah produk
                    'jumlah' => $item->qty,

                    // Menghitung total harga
                    'harga' => $produk->harga * $item->qty,

                    // Menyimpan metode pembayaran
                    'metode_pembayaran' => $request->metode_pembayaran,

                    // Menyimpan tanggal transaksi
                    'tanggal_transaksi' => $request->tanggal_transaksi,

                ]);

                // Mengurangi stok produk setelah transaksi
                $produk->stok -= $item->qty;
                $produk->save();

            }

            // Menambah total pesanan pembeli
            $pembeli->increment('total_orders');

            // Menambah total pengeluaran pembeli
            $pembeli->increment('total_spent', $keranjang->sum('subtotal'));

            // Menghapus seluruh isi keranjang setelah checkout berhasil
            Keranjang::query()->delete();

            // Menyimpan seluruh perubahan ke database
            DB::commit();

            // Mengembalikan response berhasil
            return response()->json([
                'message' => 'Checkout berhasil.'
            ]);

        } catch (\Exception $e) {

            // Membatalkan transaksi jika terjadi error
            DB::rollBack();

            // Mengembalikan pesan error
            return response()->json([
                'message' => $e->getMessage()
            ],500);

        }
    }

    // Menghapus data penjualan berdasarkan ID
    public function destroy($id)
    {
        // Mencari data penjualan
        $penjualan = Penjualan::findOrFail($id);

        // Menghapus data penjualan
        $penjualan->delete();

        // Mengembalikan response berhasil
        return response()->json([
            'message' => 'Data berhasil dihapus'
        ]);
    }
}