// Ringkasan: Komponen/halaman frontend (singkat)
// Tujuan: src/pages/utama/ProductDetail.jsx
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import HeaderPembeli from "../../components/pembeli/HeaderPembeli";
import FooterPembeli from "../../components/pembeli/FooterPembeli";
import {
    FiCheckCircle,
    FiChevronRight,
    FiMapPin,
    FiMinus,
    FiPlus,
    FiShoppingCart,
    FiTruck,
} from "react-icons/fi";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

// Memuat detail produk serta aksi pembelian untuk produk yang dipilih.
export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produk, setProduk] = useState(null);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState("deskripsi");
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/produk-pencacahans/${id}`)
            .then((res) => {
                setProduk(res.data);
            })
            .catch((error) => {
                console.log(error);
                alert("Gagal mengambil detail produk");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const image = produk?.gambar || "https://placehold.co/800x800?text=ReChop";
    const thumbnails = useMemo(() => [image, image, image, image], [image]);
    const stockIsReady = Number(produk?.stok) > 0;
    const maxQty = Math.max(Number(produk?.stok || 1), 1);

    const addToCart = async (showSuccess = true) => {
        try {
            await axios.post("http://127.0.0.1:8000/api/keranjang", {
                produk_id: produk.id,
                qty,
            });

            if (showSuccess) {
                alert("Produk berhasil ditambahkan ke keranjang");
            }

            return true;
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Gagal menambahkan produk");
            return false;
        }
    };

    const checkoutNow = async () => {
        setCheckingOut(true);
        const added = await addToCart(false);

        if (added) {
            navigate("/checkout");
        } else {
            setCheckingOut(false);
        }
    };

    const tabContent = {
        deskripsi: (
            <>
                <p>
                    {produk?.nama} adalah produk hasil pencacahan berkualitas dari ReChop
                    yang cocok untuk kebutuhan produksi, daur ulang, dan pengolahan material.
                </p>
                <p className="mt-4">
                    Produk ini masuk kategori {produk?.jenis} dengan kode {produk?.kode_produk}.
                    Stok tersedia saat ini {produk?.stok} Kg.
                </p>
            </>
        ),
        penggunaan: (
            <ul className="space-y-2">
                <li>Gunakan sesuai kebutuhan berat produksi atau pengolahan.</li>
                <li>Simpan di tempat kering agar kualitas material tetap terjaga.</li>
                <li>Hubungi admin ReChop untuk pembelian jumlah besar.</li>
            </ul>
        ),
        spesifikasi: (
            <div className="grid gap-3 text-slate-700 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Kode Produk</p>
                    <p className="mt-1 font-black text-slate-950">{produk?.kode_produk}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Jenis</p>
                    <p className="mt-1 font-black text-slate-950">{produk?.jenis}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Stok</p>
                    <p className="mt-1 font-black text-slate-950">{produk?.stok} Kg</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Harga</p>
                    <p className="mt-1 font-black text-slate-950">{formatCurrency(produk?.harga)}</p>
                </div>
            </div>
        ),
    };

    if (loading) {
        return (
            <>
                <HeaderPembeli />
                <main className="min-h-screen bg-white px-6 py-24 text-center text-slate-500">
                    Memuat detail produk...
                </main>
                <FooterPembeli />
            </>
        );
    }

    if (!produk) {
        return (
            <>
                <HeaderPembeli />
                <main className="min-h-screen bg-white px-6 py-24 text-center text-slate-500">
                    Produk tidak ditemukan.
                </main>
                <FooterPembeli />
            </>
        );
    }

    return (
        <>
            <HeaderPembeli />

            <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400">
                        <Link to="/pembeli-utama" className="hover:text-green-700">
                            Home
                        </Link>
                        <FiChevronRight size={15} />
                        <Link to="/produk-utama" className="hover:text-green-700">
                            Produk
                        </Link>
                        <FiChevronRight size={15} />
                        <span className="text-slate-600">{produk.jenis}</span>
                        <FiChevronRight size={15} />
                        <span className="text-slate-900">{produk.nama}</span>
                    </nav>

                    <section className="grid gap-12 lg:grid-cols-[0.92fr_1fr] lg:items-start">
                        <div>
                            <div className="relative overflow-hidden rounded-lg bg-[#f3f7ef]">
                                <span className="absolute left-6 top-6 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-lg font-black text-white shadow-lg">
                                    {stockIsReady ? "OK" : "0"}
                                </span>
                                <img
                                    src={image}
                                    alt={produk.nama}
                                    className="aspect-square w-full object-cover"
                                />
                            </div>

                            <div className="mt-5 grid grid-cols-4 gap-4">
                                {thumbnails.map((thumb, index) => (
                                    <button
                                        key={`${thumb}-${index}`}
                                        type="button"
                                        className={`overflow-hidden rounded-lg border-2 bg-white p-1 ${
                                            index === 0
                                                ? "border-green-700"
                                                : "border-slate-200 hover:border-green-300"
                                        }`}
                                    >
                                        <img
                                            src={thumb}
                                            alt={`${produk.nama} ${index + 1}`}
                                            className="aspect-square w-full rounded-md object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-lg font-black uppercase tracking-[0.08em] text-slate-800">
                                ReChop
                            </p>

                            <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                                {produk.nama}
                            </h1>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1 text-green-700">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <span key={index} className="text-xl">★</span>
                                    ))}
                                </div>
                                <span className="text-lg font-black text-slate-950">4.9</span>
                                <span className="text-sm font-semibold text-slate-500">
                                    28 pembeli merekomendasikan.
                                </span>
                                <Link to="/riwayat-checkout" className="text-sm font-black text-green-700 underline">
                                    Lihat riwayat
                                </Link>
                            </div>

                            <div className="mt-6 flex flex-wrap items-end gap-3">
                                <p className="text-4xl font-black text-green-700">
                                    {formatCurrency(produk.harga)}
                                </p>
                                <p className="pb-1 text-lg font-semibold text-slate-400 line-through">
                                    {formatCurrency(Number(produk.harga) * 1.15)}
                                </p>
                                <span className="mb-1 rounded-md bg-green-50 px-2 py-1 text-sm font-black text-green-700">
                                    Hemat 15%
                                </span>
                            </div>

                            <p className="mt-5 text-sm font-semibold text-slate-500">
                                Kode Produk: <span className="text-slate-800">{produk.kode_produk}</span>
                            </p>

                            <div className="mt-7">
                                <p className="mb-3 font-black text-slate-900">Jenis</p>
                                <span className="inline-flex rounded-lg border border-green-300 bg-white px-7 py-3 font-black text-green-700">
                                    {produk.jenis}
                                </span>
                            </div>

                            <div className="mt-7">
                                <div className="mb-3 flex items-center justify-between gap-4">
                                    <p className="font-black text-slate-900">Jumlah</p>
                                    <span className="text-sm font-semibold text-slate-500">
                                        Stok {produk.stok} Kg
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex h-12 items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                                        <button
                                            type="button"
                                            onClick={() => setQty((value) => Math.max(value - 1, 1))}
                                            className="flex h-full w-12 items-center justify-center text-slate-700 hover:bg-slate-50"
                                        >
                                            <FiMinus />
                                        </button>
                                        <span className="flex h-full min-w-16 items-center justify-center border-x border-slate-200 px-5 text-lg font-black">
                                            {qty}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setQty((value) => Math.min(value + 1, maxQty))}
                                            className="flex h-full w-12 items-center justify-center text-slate-700 hover:bg-slate-50"
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>

                                    <p className="text-sm font-semibold text-slate-500">
                                        Subtotal <span className="font-black text-green-700">{formatCurrency(produk.harga * qty)}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 rounded-lg bg-green-50 p-5">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-green-700">
                                        <FiMapPin size={24} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <h2 className="text-xl font-black text-slate-950">
                                                Pickup dan pengiriman tersedia
                                            </h2>
                                            <Link to="/about-utama" className="text-sm font-black text-green-700">
                                                Lihat info toko
                                            </Link>
                                        </div>
                                        <p className="mt-2 text-slate-600">
                                            Pilih jumlah produk, masukkan ke keranjang, lalu checkout untuk mencatat transaksi.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={addToCart}
                                    disabled={!stockIsReady}
                                    className="inline-flex items-center justify-center gap-3 rounded-lg border-2 border-green-700 py-4 text-lg font-black text-green-700 hover:bg-green-50 disabled:border-slate-300 disabled:text-slate-400"
                                >
                                    <FiShoppingCart />
                                    Tambah Keranjang
                                </button>

                                <button
                                    type="button"
                                    onClick={checkoutNow}
                                    disabled={!stockIsReady || checkingOut}
                                    className="inline-flex items-center justify-center gap-3 rounded-lg bg-green-700 py-4 text-lg font-black text-white shadow-lg shadow-green-900/10 hover:bg-green-800 disabled:bg-slate-400"
                                >
                                    <FiTruck />
                                    {checkingOut ? "Mengarahkan..." : "Checkout"}
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="mt-14 lg:ml-[calc(46%+3rem)]">
                        <div className="grid grid-cols-3 border-b border-slate-200 text-center">
                            {[
                                ["deskripsi", "Deskripsi"],
                                ["penggunaan", "Cara Pakai"],
                                ["spesifikasi", "Spesifikasi"],
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setActiveTab(key)}
                                    className={`border-b-4 px-3 py-4 font-black ${
                                        activeTab === key
                                            ? "border-green-700 text-slate-950"
                                            : "border-transparent text-slate-500 hover:text-green-700"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="max-w-2xl py-9 text-lg leading-8 text-slate-700">
                            {tabContent[activeTab]}

                            <div className="mt-8 flex items-center gap-3 rounded-lg border border-green-100 bg-green-50 p-4 text-base font-semibold text-green-800">
                                <FiCheckCircle className="shrink-0" size={22} />
                                Produk sudah tercatat dalam katalog ReChop dan siap masuk proses checkout.
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <FooterPembeli />
        </>
    );
}
