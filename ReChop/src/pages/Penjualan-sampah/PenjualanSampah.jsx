// Ringkasan: Halaman daftar penjualan sampah (singkat)
// Tujuan: src/pages/Penjualan-sampah/PenjualanSampah.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 6;

// Komponen: daftar penjualan sampah dengan pencarian dan paginasi
// Menampilkan daftar penjualan sampah serta fitur pencarian dan paginasi.
export default function PenjualanSampah() {
    // State: data, filter pencarian, dan pagination
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/penjualans"
            );

            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredData = data.filter((item) => {
        return (
            item.nama_pembeli
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.nama_produk
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            String(item.id)
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedData = filteredData.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/penjualans/${id}`
            );

            alert("Data berhasil dihapus");
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus data");
        }
    };

    return (
        <>
            <PageHeader
                sub="Penjualan Sampah"
                sub2="Transaksi"
                sub3="Daftar Penjualan Sampah"
            />

            <div className="p-8">
                {/* Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Cari nama pembeli, produk, atau ID transaksi..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hijau focus:border-hijau outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>

                {/* Tombol Tambah */}
                <div className="flex justify-end mb-6">
                    <Link
                        to="/penjualan-sampah/create"
                        className="bg-hijau text-white px-5 py-2 rounded-lg hover:opacity-90 transition-all"
                    >
                        + Tambah Penjualan
                    </Link>
                </div>

                {/* Card List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredData.length > 0 ? (
                        paginatedData.map((item) => (
                            <div
                                key={item.id}
                                className="border p-6 rounded-2xl shadow-sm bg-white hover:shadow-lg transition-all border-gray-100"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">
                                            PJ
                                            {String(
                                                item.id
                                            ).padStart(3, "0")}
                                        </h2>

                                        <p className="text-gray-600 mt-1">
                                            {item.nama_pembeli}
                                        </p>
                                    </div>

                                    <span className="bg-hijau-100 text-hijau px-3 py-1 text-sm font-semibold rounded-full">
                                        {item.nama_produk}
                                    </span>
                                </div>

                                {/* Detail */}
                                <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                                    <div>
                                        <p className="text-gray-500">
                                            Jumlah
                                        </p>

                                        <p className="font-bold text-2xl text-hijau">
                                            {item.jumlah} Kg
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">
                                            Harga Satuan
                                        </p>

                                        <p className="font-bold text-xl text-blue-600">
                                            Rp{" "}
                                            {Number(
                                                item.harga
                                            ).toLocaleString(
                                                "id-ID"
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="border-b pb-4 mb-4">
                                    <p className="text-gray-500 text-sm">
                                        Total Penjualan
                                    </p>

                                    <p className="text-2xl font-bold text-hijau">
                                        Rp{" "}
                                        {(
                                            Number(
                                                item.jumlah
                                            ) *
                                            Number(item.harga)
                                        ).toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>
                                </div>

                                {/* Metode Pembayaran */}
                                <div className="mb-4">
                                    <p className="text-gray-500 text-sm">
                                        Metode Pembayaran
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {
                                            item.metode_pembayaran
                                        }
                                    </p>
                                </div>

                                {/* Tanggal */}
                                <div className="mb-4">
                                    <p className="text-gray-500 text-sm">
                                        Tanggal Transaksi
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {new Date(
                                            item.tanggal_transaksi
                                        ).toLocaleDateString(
                                            "id-ID"
                                        )}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Link
                                        to={`/penjualan-sampah/edit/${item.id}`}
                                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-center hover:bg-blue-600 transition"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                item.id
                                            )
                                        }
                                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <div className="text-6xl mb-4">
                                ♻️
                            </div>

                            <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                                Data tidak ditemukan
                            </h3>

                            <p className="text-gray-500">
                                Coba ubah kata kunci pencarian
                            </p>
                        </div>
                    )}
                </div>
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
