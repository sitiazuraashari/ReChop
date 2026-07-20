// Ringkasan: Halaman keranjang pembeli (singkat)
// Tujuan: src/pages/utama/Cart.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import HeaderPembeli from "../../components/pembeli/HeaderPembeli";
import FooterPembeli from "../../components/pembeli/FooterPembeli";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 5;

// Komponen halaman keranjang: menampilkan item, hapus, dan checkout
// Mengelola daftar produk keranjang milik pembeli sebelum checkout.
export default function Cart() {

    // State: data keranjang, loading, filter, paginasi, dan navigasi
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    // Function: ambil data keranjang dari localStorage atau API
    const fetchCart = () => {
        setLoading(true);

        axios
            .get("http://127.0.0.1:8000/api/keranjang")
            .then(res => {
                setCart(res.data);
            })
            .catch(() => {
                alert("Gagal mengambil data keranjang");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/keranjang/${id}`);
            setCart((items) => items.filter((item) => item.id !== id));
        } catch (error) {
            console.log(error);
            alert("Gagal menghapus produk dari keranjang");
        }
    };

    const rupiah = (angka = 0) => {

        return new Intl.NumberFormat("id-ID", {

            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0

        }).format(angka);

    }

    const total = cart.reduce((a, b) => a + Number(b.subtotal), 0);
    const totalQty = cart.reduce((a, b) => a + Number(b.qty), 0);
    const filteredCart = cart.filter((item) => {
        const query = searchTerm.toLowerCase();

        return (
            item.produk?.nama?.toLowerCase().includes(query) ||
            item.produk?.jenis?.toLowerCase().includes(query) ||
            String(item.qty).includes(query)
        );
    });
    const totalPages = Math.max(1, Math.ceil(filteredCart.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedCart = filteredCart.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    return (

        <>
            <HeaderPembeli />

            <main className="min-h-screen bg-[#f4f7f3] px-4 py-10 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-7xl">

                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-hijau">
                                Belanja produk cacahan
                            </p>
                            <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
                                Keranjang Belanja
                            </h1>
                            <p className="mt-3 max-w-2xl text-slate-600">
                                Cek kembali produk, jumlah, dan subtotal sebelum melanjutkan checkout.
                            </p>
                        </div>

                        <Link
                            to="/produk-utama"
                            className="inline-flex items-center justify-center rounded-lg border border-hijau-200 bg-white px-5 py-3 font-bold text-hijau shadow-sm transition hover:border-hijau hover:text-hijau"
                        >
                            Lanjut Belanja
                        </Link>
                    </div>

                    {loading ? (
                        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                            Memuat isi keranjang...
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-hijau-200 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-hijau-100 text-hijau">
                                <FiShoppingBag size={30} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-950">
                                Keranjang masih kosong
                            </h2>
                            <p className="mx-auto mt-3 max-w-md text-slate-600">
                                Tambahkan produk terlebih dahulu sebelum checkout.
                            </p>
                            <Link
                                to="/produk-utama"
                                className="mt-7 inline-flex items-center justify-center rounded-lg bg-hijau px-6 py-3 font-bold text-white shadow-lg shadow-green-900/10 hover:opacity-95"
                            >
                                Lihat Produk
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                            <section className="space-y-4">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari produk di keranjang..."
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/20"
                                />

                                {paginatedCart.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                                        Produk tidak ditemukan.
                                    </div>
                                ) : (
                                    paginatedCart.map(item => (

                                    <div
                                        key={item.id}
                                        className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[144px_1fr_auto] md:items-center"
                                    >

                                        <img
                                            src={item.produk?.gambar || "/img/images.jpeg"}
                                            alt={item.produk?.nama || "Produk"}
                                            className="h-36 w-full rounded-lg bg-slate-100 object-cover md:w-36"
                                        />

                                        <div className="min-w-0">

                                            <h2 className="truncate text-2xl font-black text-slate-950">
                                                {item.produk?.nama}
                                            </h2>

                                            <p className="mt-2 text-lg font-bold text-hijau">
                                                {rupiah(item.produk?.harga)}
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                                                    Qty: {item.qty}
                                                </span>
                                                <span className="rounded-full bg-hijau-100 px-3 py-1 font-semibold text-hijau">
                                                    Subtotal: {rupiah(item.subtotal)}
                                                </span>
                                            </div>

                                        </div>

                                        <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                                            <h3 className="text-2xl font-black text-slate-950">
                                                {rupiah(item.subtotal)}
                                            </h3>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.id)}
                                                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                                                title="Hapus produk"
                                            >
                                                <FiTrash2 size={19} />
                                            </button>
                                        </div>

                                    </div>

                                    ))
                                )}
                                <Pagination
                                    currentPage={safePage}
                                    totalItems={filteredCart.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={setCurrentPage}
                                />
                            </section>

                            <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">

                                <h2 className="text-2xl font-black text-slate-950">
                                    Ringkasan Pesanan
                                </h2>

                                <div className="mt-6 space-y-4 border-b border-slate-200 pb-6">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Total produk</span>
                                        <span className="font-bold text-slate-950">{cart.length} item</span>
                                    </div>

                                    <div className="flex justify-between text-slate-600">
                                        <span>Total qty</span>
                                        <span className="font-bold text-slate-950">{totalQty}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-end justify-between gap-4">

                                    <h3 className="text-lg font-black text-slate-950">
                                        Total
                                    </h3>

                                    <h3 className="text-3xl font-black text-hijau">
                                        {rupiah(total)}
                                    </h3>

                                </div>

                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-hijau py-4 text-lg font-bold text-white shadow-lg shadow-green-900/10 hover:opacity-95"
                                >
                                    Checkout
                                    <FiArrowRight size={20} />
                                </button>

                            </aside>
                        </div>
                    )}

                </div>

            </main>

            <FooterPembeli />

        </>

    )

}
