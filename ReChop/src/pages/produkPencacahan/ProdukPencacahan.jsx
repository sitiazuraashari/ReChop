// Ringkasan: Halaman daftar produk pencacahan (singkat)
// Tujuan: src/pages/produkPencacahan/ProdukPencacahan.jsx
// Import React Hooks dan library yang dibutuhkan
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import PageHeader from "../../components/PageHeader";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 6;

// Menampilkan dan mengelola inventaris produk hasil pencacahan.
export default function ProdukPencacahan() {
    // State: list produk, kata kunci pencarian, loading, dan pagination
    const [produk, setProduk] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchProduk();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Function: ambil data produk dari API dan normalisasi respons
    const fetchProduk = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/produk-pencacahans"
            );

            const produkData = Array.isArray(response.data)
                ? response.data
                : response.data?.data ?? [];

            setProduk(produkData);
        } catch (error) {
            console.error(error);
            alert("Gagal mengambil data produk");
        } finally {
            setLoading(false);
        }
    };

    // Handler: hapus produk dan update state lokal
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Yakin ingin menghapus produk ini?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/produk-pencacahans/${id}`
            );

            setProduk((prev) =>
                prev.filter((item) => item.id !== id)
            );

            alert("Produk berhasil dihapus");
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus produk");
        }
    };

    // Derived: filter produk berdasarkan kata kunci pencarian
    const filteredData = produk.filter((item) => {
        return (
            item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.jenis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.kode_produk
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedData = filteredData.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    return (
        <>
            <PageHeader
                sub="Produk Hasil Pencacahan"
                sub2="Produksi"
                sub3="Daftar Produk"
            />

            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Cari nama produk, kode, atau jenis produk..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hijau outline-none"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>

                <div className="flex justify-end mb-6">
                    <Link
                        to="/produk-cacah/create"
                        className="bg-hijau text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
                    >
                        + Tambah Produk
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        Memuat data...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredData.length > 0 ? (
                            paginatedData.map((item) => (
                                <div
                                    key={item.id}
                                    className="border p-6 rounded-2xl shadow-sm bg-white hover:shadow-lg transition-all"
                                >
                                    <div className="flex justify-between items-start mb-5">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">
                                                {item.kode_produk}
                                            </h2>

                                            <p className="text-gray-600 mt-1">
                                                {item.nama}
                                            </p>
                                        </div>

                                        <span className="bg-hijau-100 text-hijau px-3 py-1 rounded-full text-sm font-semibold">
                                            {item.jenis}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Stok
                                            </p>

                                            <p className="text-2xl font-bold text-hijau">
                                                {item.stok} Kg
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Harga
                                            </p>

                                            <p className="text-xl font-bold text-blue-600">
                                                Rp{" "}
                                                {Number(
                                                    item.harga
                                                ).toLocaleString(
                                                    "id-ID"
                                                )}
                                                /Kg
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 mb-4">
                                        <p className="text-gray-500 text-sm">
                                            Total Nilai Stok
                                        </p>

                                        <p className="text-2xl font-bold text-hijau">
                                            Rp{" "}
                                            {(
                                                item.stok * item.harga
                                            ).toLocaleString("id-ID")}
                                        </p>
                                    </div>

                                    {(item.gambar || item.imageUrl) && (
                                        <div className="mb-4">
                                            <p className="text-gray-500 text-sm mb-2">
                                                Gambar
                                            </p>
                                            <img
                                                className="w-full h-48 object-cover rounded-lg border bg-white"
                                                src={
                                                    item.gambar || item.imageUrl
                                                }
                                                alt={item.nama || "gambar"}
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <Link
                                            to={`/produk-cacah/edit/${item.id}`}
                                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-center hover:bg-blue-600 transition"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <div className="text-6xl mb-4">📦</div>

                                <h3 className="text-2xl font-semibold text-gray-400">
                                    Produk tidak ditemukan
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    Coba gunakan kata kunci lain
                                </p>
                            </div>
                        )}
                    </div>
                )}
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
