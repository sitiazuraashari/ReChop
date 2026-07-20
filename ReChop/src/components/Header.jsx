// Import hooks dan utilitas kecil
// Fungsi: header admin, menampilkan notifikasi dan menu user
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";

// Helper: ambil inisial dari nama (mis. "John Doe" -> "JD")
const getInitials = (name = "User") =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function Header() {
  // Menyimpan status menu akun dan informasi pengguna admin yang sedang login.
  const navigate = useNavigate();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Memuat data akun admin dari localStorage saat header pertama kali dirender.
  useEffect(() => {
    const rawUser = localStorage.getItem("rechopCurrentUser");

    if (rawUser) {
      setCurrentUser(JSON.parse(rawUser));
      return;
    }

    setCurrentUser(null);
  }, []);

  // Menyediakan nilai aman agar header tetap tampil saat data akun belum tersedia.
  const username = currentUser?.username || "Guest";
  const email = currentUser?.email || "Belum login";
  const joinedAt = currentUser?.joinedAt
    ? new Date(currentUser.joinedAt).toLocaleDateString("id-ID")
    : "-";

  // Menghapus sesi login lalu mengarahkan admin ke halaman autentikasi.
  const handleLogout = () => {
    localStorage.removeItem("rechopCurrentUser");
    setIsAccountOpen(false);
    navigate("/login");
  };

  return (
    <header
      id="header-container"
      className="sticky top-4 z-10 flex items-center justify-between rounded-lg border border-slate-200/80 bg-white/88 px-4 py-3 shadow-sm backdrop-blur md:px-5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <img
          src="https://i.pinimg.com/736x/47/47/9b/47479bc432f0d3d4df0ecb3eaa82159a.jpg"
          alt="ReChop logo"
          className="h-10 w-10 rounded-full object-cover"
        />

        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-hijau">
            ReChop Workspace
          </p>
          <h2 className="mt-1 truncate text-lg font-black text-slate-950 md:text-2xl">
            Operasional Daur Ulang
          </h2>
        </div>
      </div>

      <div id="right-section" className="flex items-center gap-3 md:gap-4">
        <button
          id="notification-icon"
          type="button"
          aria-label="Notifikasi"
          className="relative rounded-lg bg-blue-50 p-3 text-blue-600 hover:bg-blue-100"
        >
          <FaBell className="text-base" />
          <span
            id="notification-badge"
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white"
          >
            50
          </span>
        </button>

        <button
          id="chart-icon"
          type="button"
          aria-label="Grafik"
          className="hidden rounded-lg bg-slate-50 p-3 hover:bg-slate-100 sm:block"
        >
          <FcAreaChart className="text-base" />
        </button>

        <button
          id="settings-icon"
          type="button"
          aria-label="Pengaturan"
          className="hidden rounded-lg bg-orange-50 p-3 text-orange-600 hover:bg-orange-100 sm:block"
        >
          <SlSettings className="text-base" />
        </button>

        <div id="profile-container" className="relative">
          <button
            type="button"
            onClick={() => setIsAccountOpen((prev) => !prev)}
            className="flex items-center gap-3 border-l border-slate-200 pl-3 md:pl-5"
          >
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-slate-400">
                Welcome back
              </p>
              <h1 className="max-w-32 truncate text-sm font-black text-slate-800">
                {username}
              </h1>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-hijau text-sm font-black text-white ring-2 ring-emerald-100">
              {getInitials(username)}
            </div>
          </button>

          {/* Panel detail akun hanya tampil ketika tombol profil dibuka. */}
          {isAccountOpen && (
            <div className="absolute right-0 mt-3 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-hijau">
                  <FaUserCircle className="text-2xl" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-black text-slate-900">
                    {username}
                  </p>
                  <p className="truncate text-sm font-medium text-slate-500">
                    {email}
                  </p>
                </div>
              </div>

              <div className="space-y-3 py-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Username</span>
                  <span className="truncate font-bold text-slate-800">
                    {username}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Email</span>
                  <span className="truncate font-bold text-slate-800">
                    {email}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Bergabung</span>
                  <span className="font-bold text-slate-800">{joinedAt}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAccountOpen(false);
                  navigate("/informasi-akun");
                }}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-hijau px-4 py-3 text-sm font-black text-white hover:opacity-95"
              >
                <FaUserCircle />
                Informasi Akun
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-black text-white hover:opacity-95"
              >
                <FaSignOutAlt />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
