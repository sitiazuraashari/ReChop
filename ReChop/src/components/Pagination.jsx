// Import: ikon dan props
// Komponen: pagination sederhana untuk daftar panjang
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Komponen utama: menampilkan kontrol paging
export default function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) {
    // Hitung jumlah halaman berdasarkan total data dan kapasitas per halaman.
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Sembunyikan kontrol saat semua data masih muat dalam satu halaman.
    if (totalItems <= itemsPerPage) return null;

    // Membuat daftar nomor halaman ringkas dengan elipsis untuk data panjang.
    const buildPages = () => {
        const pages = [];
        const delta = 2; // show two pages around current
        const left = Math.max(1, currentPage - delta);
        const right = Math.min(totalPages, currentPage + delta);

        if (left > 1) pages.push(1);
        if (left > 2) pages.push("...");

        for (let p = left; p <= right; p++) pages.push(p);

        if (right < totalPages - 1) pages.push("...");
        if (right < totalPages) pages.push(totalPages);

        return pages;
    };

    const pages = buildPages();

    return (
        <div className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <p className="font-semibold text-slate-500">
                Halaman <span className="font-bold text-slate-700">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
                <span className="mx-2 text-slate-400">•</span>
                <span className="text-slate-500">{totalItems} data</span>
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-hijau hover:bg-hijau/10 disabled:opacity-40"
                    aria-label="Previous page"
                >
                    <FaChevronLeft />
                </button>

                {/* Tombol nomor halaman dan elipsis hasil perhitungan buildPages. */}
                {pages.map((p, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => typeof p === "number" && onPageChange(p)}
                        disabled={p === "..."}
                        className={`flex h-10 min-w-[40px] items-center justify-center rounded-lg px-3 font-bold ${
                            p === currentPage
                                ? "bg-hijau text-white"
                                : p === "..."
                                ? "bg-transparent text-slate-400 cursor-default"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-hijau-200 hover:text-hijau"
                        }`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-hijau hover:bg-hijau/10 disabled:opacity-40"
                    aria-label="Next page"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
}
