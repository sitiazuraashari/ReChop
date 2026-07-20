// Ringkasan: Halaman riwayat transaksi, menampilkan tabel transaksi
// Tujuan: src/pages/RiwayatTransaksi.jsx
// Import React Hooks dan library yang dibutuhkan
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 8;

// Helper: ubah angka menjadi format mata uang Rupiah (contoh: Rp 1.000.000)
const formatCurrency = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

// Helper: format tanggal menjadi '12 Jul 2026'
const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

// Komponen utama: menampilkan daftar & filter riwayat penjualan
// Komponen utama: menampilkan tabel riwayat transaksi dan kontrol pencarian/paginasi
// Menampilkan riwayat penjualan yang dapat dicari dan dipaginasi.
export default function RiwayatTransaksi() {
    // State: data, filter, loading, dan halaman saat ini
    const [penjualanData, setPenjualanData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Mengambil data penjualan saat halaman pertama kali dimuat.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/penjualans"
                );
                setPenjualanData(response.data);
            } catch (error) {
                console.error(error);
                alert("Gagal mengambil data penjualan");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mengembalikan pengguna ke halaman pertama ketika kata kunci pencarian berubah.
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Mengurutkan transaksi terbaru lalu menyaringnya berdasarkan kata kunci.
    const filteredData = useMemo(() => {
        return penjualanData
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.tanggal_transaksi) -
                    new Date(a.tanggal_transaksi)
            )
            .filter((item) => {
                const query = searchTerm.toLowerCase();
                return (
                    item.nama_produk
                        ?.toLowerCase()
                        .includes(query) ||
                    item.metode_pembayaran
                        ?.toLowerCase()
                        .includes(query) ||
                    formatDate(item.tanggal_transaksi)
                        .toLowerCase()
                        .includes(query)
                );
            });
    }, [penjualanData, searchTerm]);

    // Menentukan halaman aman dan data yang ditampilkan pada halaman tersebut.
    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedData = filteredData.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    return (
        <>
            <PageHeader
                sub="Riwayat Transaksi"
                sub2="Transaksi"
                sub3="Riwayat Penjualan"
            />

            <div className="p-8 space-y-6">
                {/* Kolom pencarian transaksi berdasarkan produk, tanggal, atau pembayaran. */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="w-full md:w-80">
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35"
                                />
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari produk, tanggal, atau metode pembayaran..."
                                className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm outline-none transition-all focus:border-hijau focus:ring-2 focus:ring-hijau/20"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menampilkan status pemuatan atau tabel riwayat transaksi. */}
                {loading ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                        Memuat riwayat transaksi...
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em]">Produk</th>
                                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em]">Tanggal</th>
                                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em]">Harga Satuan</th>
                                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em]">Total Harga</th>
                                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em]">Metode Pembayaran</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {/* Render hasil transaksi per halaman atau pesan saat data kosong. */}
                                {filteredData.length > 0 ? (
                                    paginatedData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 odd:bg-white even:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-900 max-w-xs truncate">{item.nama_produk}</td>
                                            <td className="px-6 py-4 text-slate-600">{formatDate(item.tanggal_transaksi)}</td>
                                            <td className="px-6 py-4 text-slate-600">{formatCurrency(item.harga)}</td>
                                            <td className="px-6 py-4 text-slate-900">{formatCurrency(item.harga * item.jumlah)}</td>
                                            <td className="px-6 py-4 text-slate-600">{item.metode_pembayaran}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            Tidak ada riwayat transaksi yang cocok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Kontrol perpindahan halaman untuk daftar transaksi. */}
                <Pagination
                    currentPage={safePage}
                    totalItems={filteredData.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            </div>
        </>
    );
}
