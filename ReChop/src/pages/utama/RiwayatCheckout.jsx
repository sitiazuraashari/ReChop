import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import HeaderPembeli from "../../components/pembeli/HeaderPembeli";
import FooterPembeli from "../../components/pembeli/FooterPembeli";
import { Link } from "react-router-dom";
import { FiClock, FiShoppingBag } from "react-icons/fi";
import Pagination from "../../components/Pagination";

// Jumlah item transaksi yang ditampilkan per halaman (untuk paginasi).
// Batas jumlah riwayat checkout yang ditampilkan pada setiap halaman.
const ITEMS_PER_PAGE = 6;

// Helper: ubah angka menjadi format mata uang Rupiah (contoh: Rp 1.000.000)
const formatCurrency = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;


// Mengubah string tanggal dari API menjadi format tanggal Indonesia yang mudah dibaca.
// Dipakai untuk filter pencarian (search) dan juga tampilan tanggal transaksi.
const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

// Halaman riwayat pesanan khusus untuk pembeli yang sedang login.
// Menampilkan daftar checkout milik pembeli beserta pencarian dan paginasi.
export default function RiwayatCheckout() {
    // Ambil ID pembeli yang sedang login dari localStorage.
    // Digunakan sebagai parameter untuk memanggil riwayat transaksi milik pembeli tersebut.
    const pembeliId = localStorage.getItem("pembeli_id");

    // State daftar transaksi yang didapat dari API.
    const [transactions, setTransactions] = useState([]);

    // State loading untuk mengatur tampilan "memuat data" vs "data siap".
    const [loading, setLoading] = useState(true);

    // Term pencarian untuk memfilter transaksi berdasarkan produk/tanggal/metode pembayaran.
    const [searchTerm, setSearchTerm] = useState("");

    // State halaman aktif untuk kebutuhan paginasi.
    const [currentPage, setCurrentPage] = useState(1);

    // Ambil data user (untuk menampilkan nama) dari localStorage.
    // useMemo dipakai agar parse JSON hanya dilakukan sekali saat komponen mount.
    // Membaca data pengguna tersimpan agar transaksi dapat difilter sesuai pemiliknya.
    const user = useMemo(() => {
        // localStorage menyimpan data user setelah login.
        // try/catch dipakai supaya aplikasi tetap jalan jika data tidak valid.
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    }, []);


    // Fetch riwayat transaksi milik pembeli.
    // API dipanggil saat pembeliId berubah.
    // Mengambil pesanan dari API dan menyisakan transaksi milik pembeli aktif.
    useEffect(() => {
        // Request ke backend untuk mengambil daftar penjualan (transaksi) milik pembeli.
        axios
            .get("http://127.0.0.1:8000/api/penjualans", {
                params: {
                    pembeli_id: pembeliId,
                },
            })
            .then((res) => {
                // Urutkan transaksi dari yang terbaru ke yang terlama.
                const ownedTransactions = res.data
                    .slice()
                    .sort(
                        (a, b) =>
                            new Date(b.tanggal_transaksi) -
                            new Date(a.tanggal_transaksi)
                    );

                // Simpan hasil pengurutan ke state.
                setTransactions(ownedTransactions);
            })
            .catch((err) => {
                // Menangani error saat request gagal.
                console.log(err);
                alert("Gagal mengambil riwayat transaksi");
            })
            .finally(() => setLoading(false));
    }, [pembeliId]);

    // Reset ke halaman pertama setiap kali user mengubah searchTerm.
    // Agar hasil filter langsung tampil dari halaman awal.
    // Reset paginasi setiap kali pengguna mengubah kata kunci pencarian.
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Hitung total belanja (jumlah seluruh harga dari semua transaksi).
    // Dipakai untuk kartu ringkasan "Total Belanja".
    // Menghitung total transaksi dan nilai belanja untuk kartu statistik.
    const totalBelanja = transactions.reduce(
        (sum, item) => sum + Number(item.harga),
        0
    );

    // Filter transaksi berdasarkan searchTerm.
    // Filter mencocokkan:
    // - nama produk
    // - metode pembayaran
    // - tanggal transaksi (setelah diformat)
    // Menyaring riwayat menggunakan nama produk, tanggal, atau metode pembayaran.
    const filteredTransactions = transactions.filter((item) => {
        const query = searchTerm.toLowerCase();

        return (
            item.nama_produk?.toLowerCase().includes(query) ||
            item.metode_pembayaran?.toLowerCase().includes(query) ||
            formatDate(item.tanggal_transaksi).toLowerCase().includes(query)
        );
    });

    // Total halaman dari jumlah data hasil filter.
    // Minimal 1 supaya komponen paginasi tetap aman saat tidak ada data.
    // Menentukan halaman aktif yang valid dan potongan data untuk ditampilkan.
    const totalPages = Math.max(
        1,
        Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
    );

    // Pastikan currentPage tidak melebihi totalPages (misal saat filter mengecilkan data).
    const safePage = Math.min(currentPage, totalPages);

    // Ambil subset data sesuai halaman aktif.
    const paginatedTransactions = filteredTransactions.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    return (
        <>
            <HeaderPembeli />

            <main className="min-h-screen bg-[#f4f7f3] px-4 py-10 sm:px-6 lg:px-8">
                {/* Konten halaman */}
                <div className="mx-auto max-w-7xl">
                    {/* Header halaman + tombol "Belanja Lagi" */}
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-hijau">
                                Transaksi saya
                            </p>
                            <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
                                Riwayat Checkout
                            </h1>
                            <p className="mt-3 max-w-2xl text-slate-600">
                                Semua transaksi checkout dari akun {user?.name || "pembeli"} tersimpan di sini.
                            </p>
                        </div>

                        <Link
                            to="/produk-utama"
                            className="inline-flex items-center justify-center rounded-lg bg-hijau px-5 py-3 font-bold text-white shadow-lg shadow-green-900/10 hover:opacity-95"
                        >
                            Belanja Lagi
                        </Link>
                    </div>

                    {/* Ringkasan statistik transaksi */}
                    {/* Ringkasan jumlah pesanan, total belanja, dan hasil pencarian. */}
                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-500">Pembeli ID</p>
                            <p className="mt-2 text-2xl font-black text-hijau">{pembeliId || "-"}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-500">Total Transaksi</p>
                            <p className="mt-2 text-2xl font-black text-slate-950">{transactions.length}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-500">Total Belanja</p>
{formatCurrency(totalBelanja)}
                        </div>
                    </div>

                    {/* Input pencarian untuk filter transaksi */}
                    {/* Input untuk mencari riwayat checkout. */}
                    <div className="mb-6">
                        {/* Ketik untuk memfilter transaksi.
                            Hasilnya otomatis menghitung ulang `filteredTransactions` dan paginasi.
                        */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari produk, tanggal, atau metode pembayaran..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/20 sm:max-w-md"
                        />
                    </div>

                    {/* Tampilkan UI berdasarkan state:
                        - loading: data sedang diambil dari server
                        - kosong: hasil filter tidak ada
                        - ada data: render tabel transaksi + paginasi
                    */}
                    {/* Menampilkan status pemuatan, keadaan kosong, atau daftar transaksi. */}
                    {loading ? (
                        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                            Memuat riwayat transaksi...
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-hijau-200 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-hijau-100 text-hijau">
                                <FiClock size={30} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-950">
                                Riwayat checkout tidak ditemukan
                            </h2>
                            <p className="mx-auto mt-3 max-w-md text-slate-600">
                                Setelah checkout berhasil, transaksi kamu akan muncul di halaman ini.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                <div className="grid grid-cols-[1fr_140px_150px_180px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-slate-500 max-lg:hidden">
                                    <span>Produk</span>
                                    <span>Jumlah</span>
                                    <span>Pembayaran</span>
                                    <span className="text-right">Total</span>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {/* Render daftar transaksi yang sudah dipaginasi.
                                        `paginatedTransactions` berisi data sesuai halaman aktif (safePage).
                                    */}
                                    {paginatedTransactions.map((item) => (
                                        <div
                                            key={item.id}
                                            className="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_140px_150px_180px] lg:items-center"
                                        >
                                            {/* Kolom produk + ikon + tanggal transaksi */}
                                            <div className="flex min-w-0 gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-hijau-100 text-hijau">
                                                    <FiShoppingBag size={22} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-lg font-black text-slate-950">
                                                        {item.nama_produk}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {formatDate(item.tanggal_transaksi)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Kolom jumlah barang */}
                                            <p className="font-bold text-slate-700">
                                                {item.jumlah} qty
                                            </p>

                                            {/* Kolom metode pembayaran */}
                                            <span className="w-fit rounded-full bg-hijau-100 px-3 py-1 text-sm font-bold text-hijau">
                                                {item.metode_pembayaran}
                                            </span>

                                            {/* Kolom total/harga per transaksi */}
                                            <p className="text-left text-xl font-black text-slate-950 lg:text-right">
{formatCurrency(item.harga)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Kontrol navigasi halaman (paginasi) untuk membatasi jumlah baris yang ditampilkan. */}
                            <Pagination
                                currentPage={safePage}
                                totalItems={filteredTransactions.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </main>

            <FooterPembeli />
        </>
    );
}
