// Ringkasan: Komponen/halaman frontend (singkat)
// Tujuan: src/pages/utama/ProfilPembeli.jsx
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import {
    FiCalendar,
    FiLogOut,
    FiMail,
    FiMapPin,
    FiPhone,
    FiUser,
} from "react-icons/fi";

import HeaderPembeli from "../../components/pembeli/HeaderPembeli";
import FooterPembeli from "../../components/pembeli/FooterPembeli";

// Menampilkan dan memperbarui profil pembeli yang sedang login.
export default function ProfilPembeli() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const pembeli = JSON.parse(localStorage.getItem("pembeli") || "null");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const data = {
        name: pembeli?.name || user?.name || "-",
        email: pembeli?.email || user?.email || "-",
        phone: pembeli?.phone || "-",
        address: pembeli?.address || "-",
        wasteType: pembeli?.waste_type || "Belum ditentukan",
        status: pembeli?.status || "Active",
        joinDate: pembeli?.join_date
            ? new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
              }).format(new Date(pembeli.join_date))
            : "-",
    };

    const profileRows = [
        {
            label: "Nama lengkap",
            value: data.name,
            icon: <FiUser className="text-green-600" size={18} />,
        },
        {
            label: "Email",
            value: data.email,
            icon: <FiMail className="text-green-600" size={18} />,
        },
        {
            label: "Nomor telepon",
            value: data.phone,
            icon: <FiPhone className="text-green-600" size={18} />,
        },
        {
            label: "Tanggal bergabung",
            value: data.joinDate,
            icon: <FiCalendar className="text-green-600" size={18} />,
        },
    ];

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch {
            // Sesi lokal tetap dihapus jika token server sudah tidak aktif.
        } finally {
            ["token", "user", "pembeli_id", "pembeli", "cart"].forEach((key) =>
                localStorage.removeItem(key)
            );
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <HeaderPembeli />

            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase text-green-600">
                        Akun Pembeli
                    </p>
                    <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                        Profil Saya
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Informasi pribadi dan alamat yang tersimpan pada akun ReChop.
                    </p>
                </div>

                <section className="mb-6 flex flex-col gap-5 border-b border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                        <FiUser size={34} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="truncate text-2xl font-black text-slate-900">
                                {data.name}
                            </h2>
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-green-700">
                                {data.status}
                            </span>
                        </div>
                        <p className="mt-1 truncate text-slate-500">{data.email}</p>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <section className="bg-white p-6">
                        <h2 className="text-xl font-black text-slate-900">
                            Data Diri
                        </h2>
                        <div className="mt-5 divide-y divide-slate-100">
                            {profileRows.map(({ label, value, icon }) => (
                                <div
                                    key={label}
                                    className="grid gap-2 py-4 sm:grid-cols-[190px_1fr]"
                                >
                                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                                        {icon}
                                        {label}
                                    </div>
                                    <p className="break-words font-semibold text-slate-900">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="space-y-6">
                        <section className="bg-white p-6">
                            <div className="flex items-center gap-3">
                                <FiMapPin className="text-green-600" size={22} />
                                <h2 className="text-xl font-black text-slate-900">
                                    Alamat
                                </h2>
                            </div>
                            <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">
                                {data.address}
                            </p>
                        </section>

                        <section className="bg-white p-6">
                            <p className="text-sm font-semibold text-slate-500">
                                Minat jenis sampah
                            </p>
                            <p className="mt-2 font-bold text-slate-900">
                                {data.wasteType}
                            </p>
                        </section>

                        <section className="border border-red-100 bg-white p-6">
                            <div className="flex items-start gap-3">
                                <FiLogOut
                                    className="mt-1 shrink-0 text-red-600"
                                    size={21}
                                />
                                <div>
                                    <h2 className="font-black text-slate-900">
                                        Keluar dari akun
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Akhiri sesi ReChop pada perangkat ini.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-700"
                            >
                                <FiLogOut size={18} />
                                Keluar
                            </button>
                        </section>
                    </div>
                </div>
            </main>

            <FooterPembeli />
        </div>
    );
}
