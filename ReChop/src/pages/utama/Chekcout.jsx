// Ringkasan: Komponen/halaman frontend (singkat)
// Tujuan: src/pages/utama/Chekcout.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import HeaderPembeli from "../../components/pembeli/HeaderPembeli";
import FooterPembeli from "../../components/pembeli/FooterPembeli";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiShield } from "react-icons/fi";

const rupiah = (angka = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

const shippingOptions = [
    {
        id: "regular",
        label: "ReChop Reguler",
        description: "Estimasi 3-5 hari kerja",
        price: 25000,
    },
    {
        id: "cargo",
        label: "ReChop Cargo",
        description: "Estimasi 2-3 hari, cocok untuk pesanan besar",
        price: 45000,
    },
    {
        id: "pickup",
        label: "Ambil di Lokasi",
        description: "Ambil langsung di titik ReChop",
        price: 0,
    },
];

const paymentOptions = [
    {
        value: "Transfer Bank",
        label: "Transfer Bank",
        description: "Transfer ke rekening BCA, Mandiri, BRI, atau BNI",
    },
    {
        value: "E-Wallet",
        label: "E-Wallet",
        description: "OVO, GoPay, Dana, atau ShopeePay",
    },
    {
        value: "QRIS",
        label: "QRIS",
        description: "Scan kode QR pembayaran",
    },
    {
        value: "Cash",
        label: "Cash",
        description: "Bayar tunai saat pickup atau saat pesanan diterima",
    },
];

// Menangani konfirmasi pesanan, pembayaran, dan pembuatan transaksi checkout.
export default function Checkout() {
    const navigate = useNavigate();
    const pembeliId = localStorage.getItem("pembeli_id");

    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    }, []);

    const pembeli = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("pembeli")) || null;
        } catch {
            return null;
        }
    }, []);

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        nama_lengkap: user?.name || "",
        telepon: pembeli?.phone || "",
        alamat: pembeli?.address || "",
        kota: "",
        provinsi: "",
        kode_pos: "",
        metode_pengiriman: "regular",
        metode_pembayaran: "Transfer Bank",
        catatan: "",
    });

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/keranjang")
            .then((res) => setCart(res.data))
            .catch((err) => {
                console.log(err);
                alert("Gagal mengambil data keranjang");
            })
            .finally(() => setLoading(false));
    }, []);

    const selectedShipping =
        shippingOptions.find((option) => option.id === form.metode_pengiriman) ||
        shippingOptions[0];

    const subtotal = cart.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const totalQty = cart.reduce((sum, item) => sum + Number(item.qty), 0);
    const grandTotal = subtotal + selectedShipping.price;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!pembeliId || pembeliId === "null" || pembeliId === "undefined") {
            alert("Data pembeli belum terbaca. Silakan login ulang.");
            navigate("/login");
            return false;
        }

        if (cart.length === 0) {
            alert("Keranjang masih kosong.");
            navigate("/produk-utama");
            return false;
        }

        if (
            !form.nama_lengkap.trim() ||
            !form.telepon.trim() ||
            !form.alamat.trim() ||
            !form.kota.trim() ||
            !form.provinsi.trim() ||
            !form.kode_pos.trim()
        ) {
            alert("Lengkapi informasi pengiriman terlebih dahulu.");
            return false;
        }

        return true;
    };

    const handleCheckout = async () => {
        if (!validateForm()) return;

        setSubmitting(true);

        try {
            localStorage.setItem(
                "checkout_address",
                JSON.stringify({
                    nama_lengkap: form.nama_lengkap,
                    telepon: form.telepon,
                    alamat: form.alamat,
                    kota: form.kota,
                    provinsi: form.provinsi,
                    kode_pos: form.kode_pos,
                    metode_pengiriman: selectedShipping.label,
                    ongkos_kirim: selectedShipping.price,
                    catatan: form.catatan,
                })
            );

            await axios.post("http://127.0.0.1:8000/api/penjualans", {
                pembeli_id: pembeliId,
                metode_pembayaran: form.metode_pembayaran,
                tanggal_transaksi: new Date().toISOString().slice(0, 10),
            });

            alert("Checkout berhasil. Transaksi masuk ke riwayat.");
            navigate("/riwayat-checkout");
        } catch (err) {
            console.log(err.response || err);

            alert(
                err.response?.data?.message ||
                JSON.stringify(err.response?.data) ||
                "Checkout gagal"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <HeaderPembeli />

            <main className="min-h-screen bg-[#f7faf6] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-slate-950">
                                Checkout
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Silakan lengkapi data dan pilih metode pembayaran untuk melanjutkan pesanan.
                            </p>
                        </div>

                        <Link
                            to="/keranjang"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-white px-5 py-3 font-bold text-green-700 shadow-sm hover:border-green-400"
                        >
                            <FiArrowLeft size={18} />
                            Kembali
                        </Link>
                    </div>

                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-100 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800">
                        <FiCheckCircle className="shrink-0" size={19} />
                        Silakan lengkapi data dan pilih metode pembayaran untuk melanjutkan pesanan.
                    </div>

                    {loading ? (
                        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                            Memuat data checkout...
                        </div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
                            <section className="space-y-5">
                                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-5 text-lg font-black text-slate-950">
                                        1. Informasi Pengiriman
                                    </h2>

                                    <div className="grid gap-4">
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-bold text-slate-700">
                                                Nama Lengkap
                                            </span>
                                            <input
                                                type="text"
                                                name="nama_lengkap"
                                                value={form.nama_lengkap}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border px-4 py-3"
                                                placeholder="Masukkan nama lengkap"
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="mb-2 block text-sm font-bold text-slate-700">
                                                Nomor Telepon
                                            </span>
                                            <input
                                                type="tel"
                                                name="telepon"
                                                value={form.telepon}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border px-4 py-3"
                                                placeholder="08xxxxxxxxxx"
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="mb-2 block text-sm font-bold text-slate-700">
                                                Alamat Lengkap
                                            </span>
                                            <textarea
                                                name="alamat"
                                                value={form.alamat}
                                                onChange={handleChange}
                                                className="min-h-24 w-full rounded-lg border px-4 py-3"
                                                placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan"
                                            />
                                        </label>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">
                                                    Kota / Kabupaten
                                                </span>
                                                <input
                                                    type="text"
                                                    name="kota"
                                                    value={form.kota}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border px-4 py-3"
                                                    placeholder="Kota"
                                                />
                                            </label>

                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">
                                                    Provinsi
                                                </span>
                                                <input
                                                    type="text"
                                                    name="provinsi"
                                                    value={form.provinsi}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border px-4 py-3"
                                                    placeholder="Provinsi"
                                                />
                                            </label>

                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">
                                                    Kode Pos
                                                </span>
                                                <input
                                                    type="text"
                                                    name="kode_pos"
                                                    value={form.kode_pos}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border px-4 py-3"
                                                    placeholder="28156"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-5 text-lg font-black text-slate-950">
                                        2. Metode Pengiriman
                                    </h2>

                                    <div className="overflow-hidden rounded-lg border border-slate-200">
                                        {shippingOptions.map((option) => (
                                            <label
                                                key={option.id}
                                                className="flex cursor-pointer items-start gap-4 border-b border-slate-200 p-4 last:border-b-0 hover:bg-green-50/50"
                                            >
                                                <input
                                                    type="radio"
                                                    name="metode_pengiriman"
                                                    value={option.id}
                                                    checked={form.metode_pengiriman === option.id}
                                                    onChange={handleChange}
                                                    className="mt-1 h-4 w-4 accent-green-700"
                                                />
                                                <span className="min-w-0 flex-1">
                                                    <span className="block font-black text-slate-900">
                                                        {option.label}
                                                    </span>
                                                    <span className="mt-1 block text-sm text-slate-500">
                                                        {option.description}
                                                    </span>
                                                </span>
                                                <span className="font-black text-slate-950">
                                                    {rupiah(option.price)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-5 text-lg font-black text-slate-950">
                                        3. Metode Pembayaran
                                    </h2>

                                    <div className="overflow-hidden rounded-lg border border-slate-200">
                                        {paymentOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex cursor-pointer items-start gap-4 border-b border-slate-200 p-4 last:border-b-0 hover:bg-green-50/50"
                                            >
                                                <input
                                                    type="radio"
                                                    name="metode_pembayaran"
                                                    value={option.value}
                                                    checked={form.metode_pembayaran === option.value}
                                                    onChange={handleChange}
                                                    className="mt-1 h-4 w-4 accent-green-700"
                                                />
                                                <span>
                                                    <span className="block font-black text-slate-900">
                                                        {option.label}
                                                    </span>
                                                    <span className="mt-1 block text-sm text-slate-500">
                                                        {option.description}
                                                    </span>
                                                </span>
                                            </label>
                                        ))}
                                        {/* QRIS preview */}
                                        {form.metode_pembayaran === "QRIS" && (
                                            <div className="p-6">
                                                <div className="mx-auto max-w-[360px] rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
                                                    <h3 className="mb-3 text-lg font-black text-slate-900">Pembayaran QRIS</h3>
                                                    <p className="mb-4 text-sm text-slate-600">Scan QR dengan aplikasi e-wallet atau perbankan Anda.</p>
                                                    <img
                                                        src="/img/qris.png"
                                                        alt="QRIS ReChop"
                                                        className="mx-auto mb-4 max-h-64 w-auto object-contain"
                                                    />
                                                    <div className="flex items-center justify-center gap-3">
                                                        <a
                                                            href="/img/qris.png"
                                                            download="ReChop-QRIS.png"
                                                            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Unduh QR
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                navigator.clipboard?.writeText(window.location.origin + "/img/qris.png");
                                                                alert("Link QR disalin ke clipboard");
                                                            }}
                                                            className="rounded-md bg-hijau px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                                                        >
                                                            Salin Link
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <aside className="h-fit space-y-5">
                                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-5 text-lg font-black text-slate-950">
                                        Ringkasan Pesanan
                                    </h2>

                                    {cart.length === 0 ? (
                                        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                                            Keranjang masih kosong.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <div key={item.id} className="flex gap-4">
                                                    <img
                                                        src={item.produk?.gambar || "/img/images.jpeg"}
                                                        alt={item.produk?.nama || "Produk"}
                                                        className="h-20 w-20 shrink-0 rounded-lg bg-slate-100 object-cover"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="line-clamp-2 font-black text-slate-950">
                                                            {item.produk?.nama}
                                                        </h3>
                                                        <p className="mt-1 text-sm font-semibold text-slate-500">
                                                            {rupiah(item.produk?.harga)}
                                                        </p>
                                                        <p className="mt-1 text-sm text-slate-500">
                                                            {item.qty} kg
                                                        </p>
                                                    </div>
                                                    <p className="font-black text-slate-950">
                                                        {rupiah(item.subtotal)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-500">
                                                Subtotal ({totalQty} kg)
                                            </span>
                                            <span className="font-black text-slate-950">
                                                {rupiah(subtotal)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-500">Ongkos Kirim</span>
                                            <span className="font-black text-slate-950">
                                                {rupiah(selectedShipping.price)}
                                            </span>
                                        </div>
                                        <div className="flex items-end justify-between gap-4 border-t border-slate-200 pt-4">
                                            <span className="text-lg font-black text-slate-950">
                                                Total
                                            </span>
                                            <span className="text-2xl font-black text-green-700">
                                                {rupiah(grandTotal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                    <label className="block">
                                        <span className="mb-2 block text-sm font-black text-slate-700">
                                            Catatan untuk Penjual (Opsional)
                                        </span>
                                        <textarea
                                            name="catatan"
                                            value={form.catatan}
                                            onChange={handleChange}
                                            className="min-h-28 w-full rounded-lg border px-4 py-3"
                                            placeholder="Tulis catatan untuk penjual..."
                                        />
                                    </label>
                                </div>

                                <div className="rounded-lg border border-green-100 bg-green-50 p-5 text-green-900">
                                    <div className="flex items-start gap-3">
                                        <FiShield className="mt-1 shrink-0" size={24} />
                                        <div>
                                            <h3 className="font-black">Transaksi Aman</h3>
                                            <p className="mt-1 text-sm font-semibold text-green-800/80">
                                                Data pesanan diproses oleh sistem ReChop dan transaksi tercatat di riwayat.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    disabled={submitting || cart.length === 0}
                                    className="w-full rounded-lg bg-green-700 py-4 text-lg font-black text-white shadow-lg shadow-green-900/10 hover:bg-green-800 disabled:bg-slate-400"
                                >
                                    {submitting ? "Memproses..." : "Buat Pesanan"}
                                </button>

                                <p className="px-4 text-center text-xs font-semibold leading-5 text-slate-500">
                                    Dengan membuat pesanan, kamu menyetujui syarat dan ketentuan ReChop.
                                </p>
                            </aside>
                        </div>
                    )}
                </div>
            </main>

            <FooterPembeli />
        </>
    );
}
