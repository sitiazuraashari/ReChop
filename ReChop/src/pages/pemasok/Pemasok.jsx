// Ringkasan: Halaman daftar pemasok (singkat)
// Tujuan: src/pages/pemasok/Pemasok.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 6;

// Menampilkan, mencari, dan mengelola daftar pemasok yang tersimpan.
export default function Pemasok() {
    // State Search & Filter
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchPemasok();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus]);


    const fetchPemasok = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/pemasoks"
            );

            setData(response.data);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        }
    };



    // Ambil semua status unik
    const allStatuses = [
        ...new Set(data.map((item) => item.status)),
    ];

    // Filter Data
    const filteredData = data.filter((item) => {
        const wasteTypeText = Array.isArray(item.waste_type)
            ? item.waste_type.join(", ")
            : item.waste_type || "";

        const matchesSearch =
            item.supplier_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            String(item.id)
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            wasteTypeText
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            selectedStatus === "" || item.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedData = filteredData.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const handleDelete = (id) => {
        if (window.confirm("Yakin ingin menghapus pemasok?")) {
            const newData = data.filter(
                (item) => item.id !== id
            );

            setData(newData);

            localStorage.setItem(
                "pemasok",
                JSON.stringify(newData)
            );
        }
    };



    return (
        <>
            <PageHeader sub="Pemasok" sub2="Pemasok" sub3="Pemasok List" />

            <div className="p-8">
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search supplier, ID, or waste type..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hijau focus:border-hijau outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-hijau focus:border-hijau outline-none transition-all cursor-pointer"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">All Status</option>

                        {allStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end mb-6">
                    <Link
                        to="/pemasok/create"
                        className="bg-hijau text-white px-5 py-2 rounded-lg hover:opacity-90"
                    >
                        + Tambah Pemasok
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
                                            SUP-{String(item.id).padStart(3, "0")}
                                        </h2>

                                        <p className="text-gray-600 mt-1">
                                            {item.supplier_name}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${item.status === "Active"
                                            ? "bg-hijau-100 text-hijau"
                                            : item.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>

                                {/* Jenis Sampah */}
                                <div className="mb-5">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Jenis Sampah:
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(item.waste_type) &&
                                            item.waste_type.map((waste, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-hijau-100 text-hijau px-3 py-1 text-xs rounded-full"
                                                >
                                                    {waste}
                                                </span>
                                            ))}
                                    </div>
                                </div>

                                {/* Detail */}
                                <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                                    <div>
                                        <p className="text-gray-500">
                                            Join Date
                                        </p>

                                        <p className="font-semibold">
                                            {new Date(
                                                item.join_date
                                            ).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">
                                            Last Pickup
                                        </p>

                                        <p className="font-semibold">
                                            {new Date(
                                                item.last_pickup
                                            ).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>
                                </div>

                                {/* Statistik */}
                                <div className="grid grid-cols-2 gap-4 border-t pt-4 mb-5">
                                    <div>
                                        <p className="text-3xl font-bold text-hijau">
                                            {item.total_pickup}
                                        </p>

                                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                                            Pickup
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xl font-bold text-blue-600">
                                            {item.city}
                                        </p>

                                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                                            Kota
                                        </p>
                                    </div>
                                </div>

                                {/* Kontak */}
                                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-1">
                                            Payment Method
                                        </p>

                                        <span className="inline-block bg-gradient-to-r from-hijau to-hijau-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            {item.payment_method}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 mb-1">
                                            Address
                                        </p>

                                        <p className="font-medium text-gray-800">
                                            {item.address}
                                        </p>
                                    </div>
                                </div>

                                {/* Email & Phone */}
                                <div className="mt-5 border-t pt-4 flex gap-3">
                                    <Link
                                        to={`/pemasok/edit/${item.id}`}
                                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-center hover:bg-blue-600"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <div className="text-6xl mb-4">♻️</div>

                            <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                                No pemasok found
                            </h3>

                            <p className="text-gray-500">
                                Try adjusting your search or filter criteria
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
