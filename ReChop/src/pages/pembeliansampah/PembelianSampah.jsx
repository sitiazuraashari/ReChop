// Ringkasan: Halaman daftar pembelian sampah (singkat)
// Tujuan: src/pages/pembeliansampah/PembelianSampah.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import Pagination from "../../components/Pagination";

// Konstanta API dan pagination
const API_URL = "http://127.0.0.1:8000/api/pembelians";
const ITEMS_PER_PAGE = 6;

// Komponen: halaman daftar pembelian sampah
// Menampilkan daftar transaksi pembelian sampah dan tindakan pengelolaannya.
export default function PembelianSampah() {
    // State: data list, filter pencarian
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const response = await axios.get(API_URL);

            console.log("Data dari Laravel:", response.data);

            setData(response.data);
        } catch (error) {
            console.error("Gagal mengambil data:", error);

            alert("Gagal mengambil data pembelian");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Yakin ingin menghapus transaksi ini?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_URL}/${id}`);

            setData((prev) =>
                prev.filter((item) => item.id !== id)
            );

            alert("Data berhasil dihapus");
        } catch (error) {
            console.error("Gagal menghapus data:", error);

            alert("Gagal menghapus data");
        }
    };

    const filteredData = data.filter((item) => {
        const keyword = searchTerm.toLowerCase();

        return (
            item.kode_transaksi?.toLowerCase().includes(keyword) ||
            item.nama_pembeli?.toLowerCase().includes(keyword) ||
            item.jenis_sampah?.toLowerCase().includes(keyword)
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
                sub="Pembelian Sampah"
                sub2="Transaksi"
                sub3="Daftar Pembelian Sampah"
            />

            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Cari nama pembeli, kode transaksi, atau jenis sampah..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hijau focus:border-hijau outline-none"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>

                <div className="flex justify-end mb-6">
                    <Link
                        to="/pembelian-sampah/create"
                        className="bg-hijau text-white px-5 py-2 rounded-lg hover:opacity-90 transition-all"
                    >
                        + Tambah Transaksi
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">
                        Memuat data...
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <div className="text-6xl mb-4">♻️</div>

                        <h3 className="text-2xl font-semibold mb-2">
                            Data tidak ditemukan
                        </h3>

                        <p>
                            Belum ada data pembelian atau kata kunci tidak cocok.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {paginatedData.map((item) => (
                            <div
                                key={item.id}
                                className="border p-6 rounded-2xl shadow-sm bg-white hover:shadow-lg transition-all border-gray-100"
                            >
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {item.kode_transaksi}
                                        </h2>

                                        <p className="text-gray-600 mt-1">
                                            {item.nama_pembeli}
                                        </p>
                                    </div>

                                    <span className="bg-hijau-100 text-hijau px-3 py-1 text-sm font-semibold rounded-full">
                                        {item.jenis_sampah}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                                    <div>
                                        <p className="text-gray-500">
                                            Berat
                                        </p>

                                        <p className="font-bold text-2xl text-hijau">
                                            {item.berat} Kg
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">
                                            Harga / Kg
                                        </p>

                                        <p className="font-bold text-xl text-blue-600">
                                            Rp{" "}
                                            {Number(
                                                item.harga
                                            ).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-b pb-4 mb-4">
                                    <p className="text-gray-500 text-sm">
                                        Total Pembelian
                                    </p>

                                    <p className="text-2xl font-bold text-hijau">
                                        Rp{" "}
                                        {(
                                            Number(item.berat) *
                                            Number(item.harga)
                                        ).toLocaleString("id-ID")}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-gray-500 text-sm">
                                        Tanggal Transaksi
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {new Date(
                                            item.tanggal_transaksi
                                        ).toLocaleDateString("id-ID")}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Link
                                        to={`/pembelian-sampah/edit/${item.id}`}
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
                        ))}
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
