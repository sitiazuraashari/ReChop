// Import: komponen loading sederhana
// Fungsi: tampilkan spinner saat data sedang dimuat
// Menampilkan indikator sederhana ketika konten masih dimuat.
export default function Loading() {
    return (
        <div className=" flex flex-col justify-center items-center min-h-screen bg-white">
            <div className="w-12 h-12 border-4 border-hijau border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-hijau text-lg">Loading...</p>
        </div>
    );
}
