// Ringkasan: Halaman 404 singkat
// Tujuan: src/pages/NotFound.jsx
// Menampilkan halaman 404 ketika URL yang diminta tidak memiliki rute.
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-500 mt-2">Halaman tidak ditemukan.</p>
      
      <a 
        href="/" 
        className="mt-6 text-indigo-600 hover:underline font-medium"
      >
        ← Kembali ke beranda
      </a>
    </div>
  );
}
