// Import React Hooks dan library yang dibutuhkan
// Fungsi: menampilkan informasi akun admin dan opsi pengaturan
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaIdBadge, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import PageHeader from "../components/PageHeader";

// Data cadangan yang digunakan sebelum informasi akun dari penyimpanan lokal tersedia.
const defaultAdmin = {
    username: "Admin ReChop",
    email: "admin@gmail.com",
    role: "Administrator",
    joinedAt: "2026-01-01T00:00:00.000Z",
};

// Menampilkan informasi akun administrator yang sedang menggunakan aplikasi.
export default function InformasiAkun() {
    // Hook navigasi dan state data akun yang sedang login.
    const navigate = useNavigate();
    const [user, setUser] = useState(defaultAdmin);

    // Memuat akun aktif dari localStorage; pengguna diarahkan ke login bila tidak ditemukan.
    useEffect(() => {
        const rawUser = localStorage.getItem("rechopCurrentUser");

        if (!rawUser) {
            navigate("/login");
            return;
        }

        setUser({
            ...defaultAdmin,
            ...JSON.parse(rawUser),
        });
    }, [navigate]);

    // Menghapus sesi lokal lalu mengarahkan pengguna kembali ke halaman login.
    const handleLogout = () => {
        localStorage.removeItem("rechopCurrentUser");
        navigate("/login");
    };

    return (
        <>
            <PageHeader
                sub="Informasi Akun"
                sub2="Akun"
                sub3="Profil Admin"
            />

            <div className="p-8">
                {/* Kolom profil singkat dan detail akun administrator. */}
                <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-hijau text-3xl font-black text-white shadow-lg">
                                AR
                            </div>

                            <h2 className="mt-5 text-2xl font-black text-slate-950">
                                {user.username}
                            </h2>

                            <p className="mt-1 text-sm font-semibold text-slate-500">
                                {user.role}
                            </p>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-3 font-black text-white hover:opacity-95"
                            >
                                <FaSignOutAlt />
                                Log Out
                            </button>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-black text-slate-950">
                            Detail Akun Login
                        </h3>

                        {/* Kartu-kartu informasi identitas akun. */}
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg bg-slate-50 p-5">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-hijau">
                                    <FaUserShield />
                                </div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Username
                                </p>
                                <p className="mt-1 text-lg font-black text-slate-900">
                                    {user.username}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-5">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                    <FaEnvelope />
                                </div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Email
                                </p>
                                <p className="mt-1 break-all text-lg font-black text-slate-900">
                                    {user.email}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-5">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                    <FaIdBadge />
                                </div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Role
                                </p>
                                <p className="mt-1 text-lg font-black text-slate-900">
                                    {user.role}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-5">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                    <FaIdBadge />
                                </div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Bergabung
                                </p>
                                <p className="mt-1 text-lg font-black text-slate-900">
                                    {new Date(user.joinedAt).toLocaleDateString("id-ID")}
                                </p>
                            </div>
                        </div>

                        {/* Informasi kredensial contoh untuk akses admin. */}
                        <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 p-5">
                            <p className="font-black text-hijau">
                                Credential Login Admin
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-600">
                                Email: admin@gmail.com
                            </p>
                            <p className="text-sm font-semibold text-slate-600">
                                Password: admin123
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
