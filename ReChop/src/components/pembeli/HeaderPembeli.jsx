// Ringkasan: Komponen/halaman frontend (singkat)
// Tujuan: src/components/pembeli/HeaderPembeli.jsx
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut, FiMenu, FiShoppingCart, FiUser, FiX } from "react-icons/fi";

export default function HeaderPembeli() {
    // Mengatur navigasi, referensi dropdown, dan status menu desktop/mobile.
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Membaca sesi pembeli dari localStorage untuk menentukan menu yang ditampilkan.
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const pembeli = JSON.parse(localStorage.getItem("pembeli") || "null");
    const profileName = pembeli?.name || user?.name || "Pembeli";

    // Menutup dropdown profil ketika pengguna mengklik area di luar menu.
    useEffect(() => {
        const closeProfileMenu = (event) => {
            if (!profileMenuRef.current?.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", closeProfileMenu);
        return () => document.removeEventListener("mousedown", closeProfileMenu);
    }, []);

    // Memberi tahu server, membersihkan sesi lokal, lalu kembali ke halaman login.
    const handleLogout = async () => {
        try {
            if (token) {
                await axios.post(
                    "http://127.0.0.1:8000/api/logout",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch {
            // Sesi lokal tetap dihapus jika token server sudah tidak aktif.
        } finally {
            ["token", "user", "pembeli_id", "pembeli", "cart"].forEach((key) =>
                localStorage.removeItem(key)
            );
            setProfileOpen(false);
            navigate("/login", { replace: true });
        }
    };

    // Menentukan gaya navigasi berdasarkan rute pembeli yang sedang aktif.
    const menuClass = ({ isActive }) =>
        `relative text-base font-bold transition duration-300
        ${
            isActive
                ? "text-green-600"
                : "text-slate-900 hover:text-green-600"
        }
        after:absolute after:left-0 after:-bottom-2 after:h-[3px]
        after:rounded-full after:bg-green-600 after:transition-all
        ${
            isActive
                ? "after:w-full"
                : "after:w-0 hover:after:w-full"
        }`;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">

            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3"
                >
                    <img
                        src="https://i.pinimg.com/736x/47/47/9b/47479bc432f0d3d4df0ecb3eaa82159a.jpg"
                        alt="ReChop"
                        className="h-12 w-12 rounded-full object-cover"
                    />

                    <h1 className="text-2xl font-black text-slate-900">
                        ReChop
                    </h1>
                </Link>

                {/* Menu */}
                <nav className="hidden items-center gap-8 lg:flex">

                    <NavLink
                        to="/pembeli-utama"
                        className={menuClass}
                    >
                        <span>Home</span>
                    </NavLink>

                    <NavLink
                        to="/produk-utama"
                        className={menuClass}
                    >
                        <span>PRODUK</span>
                    </NavLink>

                    <NavLink
                        to="/about-utama"
                        className={menuClass}
                    >
                        <span>ABOUT US</span>
                    </NavLink>

                    <NavLink
                        to="/riwayat-checkout"
                        className={menuClass}
                    >
                        <span>RIWAYAT</span>
                    </NavLink>

                </nav>

                <div className="hidden items-center gap-4 lg:flex">

                    <Link
                        to="/keranjang"
                        title="Keranjang"
                        aria-label="Buka keranjang"
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-700 transition hover:border-green-400 hover:bg-green-100"
                    >
                        <FiShoppingCart size={21} />
                    </Link>

                    {token ? (
                        <div ref={profileMenuRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setProfileOpen((open) => !open)}
                                aria-expanded={profileOpen}
                                className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-left transition hover:border-green-300 hover:bg-green-50"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white">
                                    <FiUser size={18} />
                                </span>
                                <span className="max-w-32 truncate text-sm font-bold text-slate-900">
                                    {profileName}
                                </span>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
                                    <div className="border-b border-slate-100 px-4 py-2">
                                        <p className="truncate text-sm font-bold text-slate-900">
                                            {profileName}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <Link
                                        to="/profil-pembeli"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700"
                                    >
                                        <FiUser size={17} />
                                        Profil Saya
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                                    >
                                        <FiLogOut size={17} />
                                        Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="font-bold text-slate-900 transition hover:text-green-600"
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
                            >
                                Daftar
                            </Link>
                        </>
                    )}

                </div>

                <button
                    type="button"
                    onClick={() => setMobileOpen((open) => !open)}
                    aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
                    className="flex h-11 w-11 items-center justify-center text-slate-900 lg:hidden"
                >
                    {mobileOpen ? <FiX size={25} /> : <FiMenu size={25} />}
                </button>
            </div>

            {/* Navigasi versi ponsel yang muncul saat tombol menu ditekan. */}
            {mobileOpen && (
                <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
                    <nav className="flex flex-col gap-1">
                        {[
                            ["/pembeli-utama", "Home"],
                            ["/produk-utama", "Produk"],
                            ["/about-utama", "About Us"],
                            ["/riwayat-checkout", "Riwayat"],
                            ["/keranjang", "Keranjang"],
                        ].map(([to, label]) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `rounded-md px-3 py-3 font-semibold ${
                                        isActive
                                            ? "bg-green-50 text-green-700"
                                            : "text-slate-700 hover:bg-slate-50"
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}

                        {token ? (
                            <>
                                <NavLink
                                    to="/profil-pembeli"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md px-3 py-3 font-semibold text-slate-700 hover:bg-green-50"
                                >
                                    Profil Saya
                                </NavLink>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-md px-3 py-3 text-left font-semibold text-red-600 hover:bg-red-50"
                                >
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                <Link
                                    to="/login"
                                    className="rounded-lg border border-slate-300 px-4 py-3 text-center font-bold"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-lg bg-green-600 px-4 py-3 text-center font-bold text-white"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
