import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import Pagination from "../../components/Pagination";

// Menentukan jumlah data yang ditampilkan setiap halaman
const ITEMS_PER_PAGE = 6;

// Komponen halaman daftar pembeli
export default function Pembeli() {

    // State untuk menyimpan seluruh data pembeli
    const [data, setData] = useState([]);

    // State untuk kata kunci pencarian
    const [searchTerm, setSearchTerm] = useState("");

    // State untuk filter status pembeli
    const [selectedStatus, setSelectedStatus] = useState("");

    // State untuk menyimpan halaman aktif
    const [currentPage, setCurrentPage] = useState(1);

    // Menjalankan fetch data ketika halaman pertama kali dibuka
    useEffect(() => {
        fetchPembeli();
    }, []);

    // Mengembalikan halaman ke halaman pertama ketika filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus]);

    // Mengambil data pembeli dari backend Laravel
    const fetchPembeli = async () => {
        try {

            // Request GET ke API pembeli
            const response = await axios.get(
                "http://127.0.0.1:8000/api/pembelis"
            );

            // Menyimpan data ke state
            setData(response.data);

        } catch (error) {

            // Menampilkan error jika request gagal
            console.error("Error:", error);
        }
    };

    // Mengambil daftar status yang unik
    const allStatuses = [
        ...new Set(data.map((item) => item.status)),
    ];

    // Melakukan filter berdasarkan pencarian dan status
    const filteredData = data.filter((item) => {

        // Filter berdasarkan nama, email, nomor telepon, atau jenis sampah
        const matchesSearch =
            (item.name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (item.email || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (item.phone || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (item.waste_type || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        // Filter berdasarkan status
        const matchesStatus =
            selectedStatus === "" ||
            item.status === selectedStatus;

        // Mengembalikan data yang memenuhi kedua filter
        return matchesSearch && matchesStatus;
    });

    // Menghitung jumlah halaman
    const totalPages = Math.max(
        1,
        Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    );

    // Memastikan halaman aktif tidak melebihi jumlah halaman
    const safePage = Math.min(currentPage, totalPages);

    // Mengambil data sesuai halaman yang sedang aktif
    const paginatedData = filteredData.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    // Mengubah angka menjadi format mata uang Rupiah
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <>
            <PageHeader
                sub="Pembeli"
                sub2="Pembeli"
                sub3="Pembeli Sampah"
            />

            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search pembeli, email, jenis sampah..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                        value={selectedStatus}
                        onChange={(e) =>
                            setSelectedStatus(e.target.value)
                        }
                    >
                        <option value="">
                            All Status
                        </option>

                        {allStatuses.map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end mb-6">
                    <Link
                        to="/pembeli/create"
                        className="bg-hijau text-white px-5 py-2 rounded-lg"
                    >
                        + Tambah Pembeli
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.length > 0 ? (
                        paginatedData.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {item.name}
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            PEM-
                                            {String(
                                                item.id
                                            ).padStart(
                                                3,
                                                "0"
                                            )}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                                            item.status ===
                                            "Active"
                                                ? "bg-hijau-100 text-hijau"
                                                : item.status ===
                                                  "Inactive"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-5 text-sm">
                                    <p>
                                        <strong>
                                            Email:
                                        </strong>{" "}
                                        {item.email}
                                    </p>

                                    <p>
                                        <strong>
                                            Phone:
                                        </strong>{" "}
                                        {item.phone}
                                    </p>

                                    <p>
                                        <strong>
                                            Address:
                                        </strong>{" "}
                                        {item.address}
                                    </p>
                                </div>

                                <div className="mb-5">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Jenis Sampah
                                    </p>

                                    <span className="inline-block bg-hijau-100 text-hijau px-3 py-1 rounded-full text-xs font-semibold">
                                        {item.waste_type}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {
                                                item.total_orders
                                            }
                                        </p>

                                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                                            Transaksi
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-lg font-bold text-hijau">
                                            {formatRupiah(
                                                item.total_spent
                                            )}
                                        </p>

                                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                                            Total
                                            Pembelian
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-xs text-gray-500 mb-2">
                                        Bergabung:
                                        <span className="font-semibold ml-1">
                                            {item.join_date
                                                ? new Date(
                                                      item.join_date
                                                  ).toLocaleDateString(
                                                      "id-ID"
                                                  )
                                                : "-"}
                                        </span>
                                    </p>

                                    <div className="flex gap-3">
                                        <Link
                                            to={`/pembeli/edit/${item.id}`}
                                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-center hover:bg-blue-600"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                                            onClick={() =>
                                                alert(
                                                    "Fitur hapus belum dibuat"
                                                )
                                            }
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 text-gray-500">
                            <div className="text-6xl mb-4">
                                ♻️
                            </div>

                            <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                                Data pembeli tidak ditemukan
                            </h3>

                            <p>
                                Coba gunakan kata kunci
                                atau filter yang lain
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
