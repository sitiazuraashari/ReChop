<?php

// Import class Request untuk menangani request HTTP
use Illuminate\Http\Request;

// Import Route untuk mendefinisikan API routes
use Illuminate\Support\Facades\Route;

// Import seluruh controller API yang digunakan
use App\Http\Controllers\Api\PemasokController;
use App\Http\Controllers\Api\PembeliController;
use App\Http\Controllers\Api\PenjualanController;
use App\Http\Controllers\Api\PembelianController;
use App\Http\Controllers\Api\ProdukPencacahanController;
use App\Http\Controllers\Api\KeranjangController;
use App\Http\Controllers\Api\AuthController;


/*
|--------------------------------------------------------------------------
| AUTHENTICATION ROUTES
|--------------------------------------------------------------------------
| Route yang digunakan untuk proses registrasi, login,
| mendapatkan data user yang sedang login, dan logout.
|
*/

// Route untuk registrasi akun baru
Route::post('/register',[AuthController::class,'register']);

// Route untuk login user
Route::post('/login',[AuthController::class,'login']);

// Route yang hanya bisa diakses oleh user yang sudah login
Route::middleware('auth:sanctum')->group(function(){

    // Mengambil data user yang sedang login
    Route::get('/me',[AuthController::class,'me']);

    // Logout user dan menghapus token autentikasi
    Route::post('/logout',[AuthController::class,'logout']);

});


/*
|--------------------------------------------------------------------------
| KERANJANG ROUTES
|--------------------------------------------------------------------------
| Route untuk mengelola data keranjang belanja.
|
*/

// Menampilkan seluruh isi keranjang
Route::get('/keranjang',[KeranjangController::class,'index']);

// Menambahkan produk ke dalam keranjang
Route::post('/keranjang',[KeranjangController::class,'store']);

// Menghapus produk dari keranjang berdasarkan ID
Route::delete('/keranjang/{id}',[KeranjangController::class,'destroy']);


/*
|--------------------------------------------------------------------------
| PRODUK PENCACAHAN ROUTES
|--------------------------------------------------------------------------
| Route untuk mengelola data produk hasil pencacahan.
|
*/

// Menampilkan seluruh produk pencacahan
Route::get('/produk-pencacahans', [ProdukPencacahanController::class, 'index']);

// Menampilkan detail produk berdasarkan ID
Route::get('/produk-pencacahans/{id}', [ProdukPencacahanController::class, 'show']);

// Menambahkan produk pencacahan baru
Route::post('/produk-pencacahans', [ProdukPencacahanController::class, 'store']);

// Menghapus produk pencacahan berdasarkan ID
Route::delete('/produk-pencacahans/{id}', [ProdukPencacahanController::class, 'destroy']);


/*
|--------------------------------------------------------------------------
| PEMBELIAN ROUTES
|--------------------------------------------------------------------------
| Route untuk mengelola transaksi pembelian sampah.
|
*/

// Menampilkan seluruh data pembelian
Route::get('/pembelians', [PembelianController::class, 'index']);

// Menambahkan data pembelian baru
Route::post('/pembelians', [PembelianController::class, 'store']);

// Menghapus data pembelian berdasarkan ID
Route::delete('/pembelians/{id}', [PembelianController::class, 'destroy']);


/*
|--------------------------------------------------------------------------
| PENJUALAN ROUTES
|--------------------------------------------------------------------------
| Route untuk mengelola transaksi penjualan produk.
|
*/

// Menampilkan seluruh data penjualan
Route::get('/penjualans', [PenjualanController::class, 'index']);

// Menambahkan data penjualan baru
Route::post('/penjualans', [PenjualanController::class, 'store']);

// Menghapus data penjualan berdasarkan ID
Route::delete('/penjualans/{id}', [PenjualanController::class, 'destroy']);


/*
|--------------------------------------------------------------------------
| PEMBELI ROUTES
|--------------------------------------------------------------------------
| Route untuk mengelola data pembeli.
|
*/

// Menampilkan seluruh data pembeli
Route::get('/pembelis', [PembeliController::class, 'index']);

// Menambahkan data pembeli baru
Route::post('/pembelis', [PembeliController::class, 'store']);


/*
|--------------------------------------------------------------------------
| PEMASOK ROUTES
|--------------------------------------------------------------------------
| Route untuk mengelola data pemasok.
|
*/

// Menampilkan seluruh data pemasok
Route::get('/pemasoks', [PemasokController::class, 'index']);

// Menambahkan data pemasok baru
Route::post('/pemasoks', [PemasokController::class, 'store']);


/*
|--------------------------------------------------------------------------
| USER ROUTE
|--------------------------------------------------------------------------
| Route untuk mendapatkan data user yang sedang login.
| Hanya dapat diakses menggunakan autentikasi Sanctum.

*/

// Mengembalikan data user yang sedang login
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');