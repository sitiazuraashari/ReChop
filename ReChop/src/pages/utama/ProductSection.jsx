// Import React Hooks dan library yang dibutuhkan
// Fungsi: menampilkan daftar produk untuk pembeli (landing)
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import HeaderPembeli from "../../components/pembeli/HeaderPembeli";
import FooterPembeli from "../../components/pembeli/FooterPembeli";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 10;

const rupiah = (angka = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

// Menampilkan katalog produk pencacahan dengan pencarian dan paginasi.
export default function ProductSection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        setLoading(true);

        axios
            .get("http://127.0.0.1:8000/api/produk-pencacahans", {
                params: {
                    page: currentPage,
                    per_page: ITEMS_PER_PAGE,
                    q: searchTerm || undefined,
                },
            })
            .then((response) => {
                const data = response.data;

                // Laravel paginator returns { data, total, per_page, current_page }
                setProducts(data.data || data);
                setTotalItems(data.total || (data.data ? data.data.length : 0));
            })
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredProducts = products.filter((product) => {
        const query = searchTerm.toLowerCase();

        return (
            product.nama?.toLowerCase().includes(query) ||
            product.jenis?.toLowerCase().includes(query) ||
            product.kode_produk?.toLowerCase().includes(query)
        );
    });

    // When using server-side pagination, total items come from API. If not present, fall back to local calculation.
    const safePage = Math.min(currentPage, Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE)));
    const paginatedProducts = filteredProducts; // when server paginates, products already contains current page

    return (
        <>
            <HeaderPembeli />

            <main className="min-h-screen bg-white">
                <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:py-14">
                    <div className="mb-10 border-b border-slate-200 pb-7">
                        <p className="text-sm font-bold uppercase text-hijau">
                            Marketplace ReChop
                        </p>
                        <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
                            Produk Pencacahan
                        </h1>
                        <p className="mt-3 max-w-2xl text-base text-slate-600">
                            Pilih produk cacahan berkualitas untuk kebutuhan produksi dan daur ulang.
                        </p>
                    </div>

                    <div className="mb-8">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari nama produk, kode, atau jenis..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/20 sm:max-w-md"
                        />
                    </div>

                    {loading ? (
                        <div className="py-32 text-center text-lg font-bold text-slate-500">
                            Memuat produk...
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="border border-dashed border-slate-300 py-24 text-center text-slate-500">
                            Produk tidak ditemukan.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
                                {paginatedProducts.map((product) => (
                                    <article key={product.id} className="group min-w-0">
                                        <Link
                                            to={`/produk-utama/${product.id}`}
                                            className="block aspect-[4/3] overflow-hidden bg-white"
                                            aria-label={`Lihat detail ${product.nama}`}
                                        >
                                            <img
                                                src={
                                                    product.gambar ??
                                                    "https://placehold.co/600x450?text=No+Image"
                                                }
                                                alt={product.nama}
                                                className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                                            />
                                        </Link>

                                        <div className="pt-4">
                                            <p className="truncate text-xs font-black uppercase text-slate-950">
                                                {product.jenis || "ReChop"}
                                            </p>
                                            <Link
                                                to={`/produk-utama/${product.id}`}
                                                className="mt-1 block min-h-10 text-sm leading-5 text-slate-600 hover:text-hijau"
                                            >
                                                {product.nama}
                                            </Link>
                                            <p className="mt-1 text-sm font-black text-slate-950">
                                                {rupiah(product.harga)}
                                            </p>
                                            <div className="mt-1 flex items-center gap-0.5 text-xs text-rose-600">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <span key={index} aria-hidden="true">
                                                        &#9733;
                                                    </span>
                                                ))}
                                                <span className="ml-2 text-[11px] font-semibold text-slate-400">
                                                    Stok {product.stok} kg
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            <Pagination
                                  currentPage={safePage}
                                  totalItems={totalItems || filteredProducts.length}
                                  itemsPerPage={ITEMS_PER_PAGE}
                                  onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </section>
            </main>

            <FooterPembeli />
        </>
    );
}
