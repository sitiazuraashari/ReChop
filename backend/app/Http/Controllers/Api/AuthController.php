<?php

// Namespace controller API
namespace App\Http\Controllers\Api;

// Import controller utama Laravel
use App\Http\Controllers\Controller;

// Import model User dan Pembeli
use App\Models\User;
use App\Models\Pembeli;

// Import class yang dibutuhkan
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// Controller untuk menangani autentikasi pengguna
class AuthController extends Controller
{

    // Method untuk registrasi akun baru
    public function register(Request $request)
    {
        // Validasi data yang dikirim dari frontend
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'phone'      => 'required|string|max:25',
            'address'    => 'required|string|max:1000',
            'waste_type' => 'nullable|string|max:255',
            'password'   => 'required|min:6|confirmed',
        ]);

        // Menjalankan proses penyimpanan user dan pembeli dalam satu transaksi database
        [$user, $pembeli] = DB::transaction(function () use ($validated) {

            // Membuat akun user baru
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'pembeli',
            ]);

            // Membuat atau memperbarui data pembeli berdasarkan user_id
            $pembeli = Pembeli::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'phone' => $validated['phone'],
                    'address' => $validated['address'],
                    'email' => $user->email,
                    'waste_type' => $validated['waste_type'] ?? null,
                    'status' => 'Active',
                    'join_date' => now()->toDateString(),
                ]
            );

            // Mengembalikan data user dan pembeli
            return [$user, $pembeli];
        });

        // Membuat token autentikasi menggunakan Laravel Sanctum
        $token = $user->createToken('rechop')->plainTextToken;

        // Mengirimkan response berhasil registrasi
        return response()->json([
            'message' => 'Register berhasil',
            'token' => $token,
            'user' => $user,
            'pembeli_id' => $pembeli->id,
            'pembeli' => $pembeli,
        ]);
    }

    // Method untuk login pengguna
    public function login(Request $request)
    {
        // Mengambil email dan password dari request
        $credentials = $request->only('email', 'password');

        // Membersihkan input email dan password
        $email = trim((string) ($credentials['email'] ?? ''));
        $password = (string) ($credentials['password'] ?? '');

        // Mengecek apakah login menggunakan akun admin bawaan
        $isAdminCredential = strtolower($email) === 'admin@gmail.com' && $password === 'admin123';

        if ($isAdminCredential) {

            // Membuat atau memperbarui akun admin jika belum tersedia
            $user = User::updateOrCreate(
                ['email' => 'admin@gmail.com'],
                [
                    'name' => 'Administrator',
                    'password' => Hash::make('admin123'),
                    'role' => 'admin',
                ]
            );

            // Login sebagai admin
            Auth::login($user);

        } elseif (!Auth::attempt($credentials)) {

            // Mengembalikan pesan jika login gagal
            return response()->json(['message' => 'Login gagal'], 401);
        }

        // Mengambil data user yang berhasil login
        $user = Auth::user();

        // Variabel pembeli dikosongkan terlebih dahulu
        $pembeli = null;

        // Jika role user adalah pembeli
        if ($user->role === 'pembeli') {

            // Membuat data pembeli jika belum tersedia
            $pembeli = Pembeli::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'join_date' => now()->toDateString(),
                ]
            );
        }

        // Mengirimkan response login berhasil beserta token
        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'pembeli_id' => $pembeli?->id,
            'pembeli' => $pembeli,
            'token' => $user->createToken('auth')->plainTextToken
        ]);
    }

    // Method untuk mengambil data user yang sedang login
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // Method untuk logout user
    public function logout(Request $request)
    {
        // Menghapus token akses yang sedang digunakan
        $request->user()->currentAccessToken()->delete();

        // Mengembalikan response logout berhasil
        return response()->json([
            "message"=>"Logout berhasil"
        ]);
    }
}