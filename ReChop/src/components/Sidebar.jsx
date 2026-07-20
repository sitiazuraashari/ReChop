// Import ikon dan helper navigasi
// Fungsi: sidebar navigasi admin
import { BiStore } from "react-icons/bi";
import {
  MdDashboard,
  MdPointOfSale,
  MdInventory2,
  MdHistory,
  MdDescription,
  MdShowChart,
} from "react-icons/md";
import {
  AiOutlineUnorderedList,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  // Menentukan gaya tautan menu berdasarkan rute yang sedang aktif.
  const menuClass = ({ isActive }) =>
    `group flex cursor-pointer items-center rounded-lg px-4 py-3.5 text-sm font-semibold transition-all ${
      isActive
        ? "bg-hijau-100 text-hijau shadow-sm"
        : "text-slate-500 hover:bg-hijau-100 hover:text-hijau"
    }`;

  return (
    <aside
      id="sidebar"
      className="sticky top-0 z-20 flex h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-slate-200/80 bg-white/90 p-5 shadow-lg backdrop-blur"
    >
        <div
        id="sidebar-logo"
        className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/70 p-3"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
          <img
            src="https://i.pinimg.com/736x/47/47/9b/47479bc432f0d3d4df0ecb3eaa82159a.jpg"
            alt="ReChop logo"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-poppins text-2xl font-black text-slate-950">
            ReChop
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Waste Commerce Admin
          </span>
        </div>
      </div>

      {/* Kelompok navigasi utama untuk seluruh fitur administrasi. */}
      <nav className="mt-8">
        <ul className="space-y-7">
          <li>
            <NavLink to="/" className={menuClass}>
              <MdDashboard className="mr-4 text-xl" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <p className="mb-2 px-4 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Kelola Data
            </p>

            <ul className="space-y-2">
              <li>
                <NavLink to="/pemasok" className={menuClass}>
                  <AiOutlineUnorderedList className="mr-4 text-xl" />
                  <span>Data Pemasok</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/pembeli" className={menuClass}>
                  <BiStore className="mr-4 text-xl" />
                  <span>Data Pembeli</span>
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <p className="mb-2 px-4 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Transaksi
            </p>

            <ul className="space-y-2">
              <li>
                <NavLink to="/penjualan-sampah" className={menuClass}>
                  <AiOutlineShoppingCart className="mr-4 text-xl" />
                  <span>Penjualan Sampah</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/pembelian-sampah" className={menuClass}>
                  <MdPointOfSale className="mr-4 text-xl" />
                  <span>Pembelian Sampah</span>
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <p className="mb-2 px-4 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Inventori
            </p>

            <ul className="space-y-2">
              <li>
                <NavLink to="/produk-cacah" className={menuClass}>
                  <MdInventory2 className="mr-4 text-xl" />
                  <span>Produk Cacah</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/riwayat-transaksi" className={menuClass}>
                  <MdHistory className="mr-4 text-xl" />
                  <span>Riwayat Transaksi</span>
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <p className="mb-2 px-4 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Laporan
            </p>

            <ul className="space-y-2">
              <li>
                <NavLink to="/laporan" className={menuClass}>
                  <MdDescription className="mr-4 text-xl" />
                  <span>Laporan Bulanan</span>
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Informasi aplikasi yang selalu berada di bagian bawah sidebar. */}
      <div className="mt-auto pt-8">
        <div className="mb-5 rounded-lg bg-hijau p-4 shadow-lg">
          <div className="text-sm text-white">
            <p className="font-bold leading-snug">
              Kelola sampah hari ini untuk lingkungan yang lebih baik.
            </p>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-white/95 px-3 py-2">
              <span className="text-xs font-bold text-slate-700">
                ReChop System
              </span>
              <MdShowChart className="text-hijau" />
            </div>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-500">
          ReChop Trash Admin Dashboard
        </span>
        <p className="text-xs font-medium text-slate-400">
          Copyright 2026. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
