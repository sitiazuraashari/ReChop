// Import layout dan proteksi rute
// Fungsi: layout utama yang memeriksa autentikasi
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// Melindungi rute admin dan menyusun sidebar, header, serta konten halaman.
export default function MainLayout() {
  const isLoggedIn = Boolean(localStorage.getItem("rechopCurrentUser"));

  // Pengguna tanpa sesi akan dialihkan ke halaman login.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div id="app-container" className="min-h-screen">
      <div id="layout-wrapper" className="flex min-h-screen flex-row">
        <Sidebar />
        <main id="main-content" className="flex-1 p-4 md:p-6 xl:p-8">
          <div className="mx-auto w-full max-w-[1440px]">
            <Header />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
