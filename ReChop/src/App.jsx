// Import library routing dan styling
// File ini mendefinisikan route utama aplikasi
import { Suspense } from "react";
import "./assets/tailwind.css";
import { Routes, Route } from "react-router-dom";
import React from "react";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import PembeliLandingLayout from "./layouts/PembeliLandingLayout";

import Loading from "./components/Loading";



// Main Pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const InformasiAkun = React.lazy(() => import("./pages/InformasiAkun"));
const Laporan = React.lazy(() => import("./pages/Laporan"));
const RiwayatTransaksi = React.lazy(() => import("./pages/RiwayatTransaksi"));

const HeroPembeli = React.lazy(() => import("./pages/utama/HeroPembeli")
);
const Checkout = React.lazy(() => import("./pages/utama/Chekcout"));
const ProdukUtama = React.lazy(() => import("./pages/utama/ProductSection"));
const ProductDetail = React.lazy(() => import("./pages/utama/ProductDetail"));
const RiwayatCheckout = React.lazy(() => import("./pages/utama/RiwayatCheckout"));
const ProfilPembeli = React.lazy(() => import("./pages/utama/ProfilPembeli"));

const AboutUs = React.lazy(() => import("./pages/utama/aboutUs"));

const Cart = React.lazy(() => import("./pages/utama/Cart"));

/* Stok page removed */
const Pembeli = React.lazy(() => import("./pages/pembeli/Pembeli"));

const TambahPembeli = React.lazy(() => import("./pages/pembeli/TambahPembeli"));
const EditPembeli = React.lazy(() => import("./pages/pembeli/EditPembeli"));

// Pemasok
const Pemasok = React.lazy(() => import("./pages/pemasok/Pemasok"));
const TambahPemasok = React.lazy(() => import("./pages/pemasok/TambahPemasok"));
const EditPemasok = React.lazy(() => import("./pages/pemasok/EditPemasok"));

// Penjualan Sampah
const PenjualanSampah = React.lazy(() =>
    import("./pages/Penjualan-sampah/PenjualanSampah")
);
const TambahPenjualanSampah = React.lazy(() =>
    import("./pages/Penjualan-sampah/TambahPenjualanSampah")
);
const EditPenjualanSampah = React.lazy(() =>
    import("./pages/Penjualan-sampah/EditPenjualanSampah")
);

// Pembelian Sampah
const PembelianSampah = React.lazy(() =>
    import("./pages/pembeliansampah/PembelianSampah")
);
const TambahPembelianSampah = React.lazy(() =>
    import("./pages/pembeliansampah/TambahPembelianSampah")
);
const EditPembelianSampah = React.lazy(() =>
    import("./pages/pembeliansampah/EditPembelianSampah")
);

// Produk Cacah
const ProdukPencacahan = React.lazy(() =>
    import("./pages/produkPencacahan/ProdukPencacahan")
);
const TambahProdukPencacahan = React.lazy(() =>
    import("./pages/produkPencacahan/TambahProdukPencacahan")
);
const EditProdukPencacahan = React.lazy(() =>
    import("./pages/produkPencacahan/EditProdukPencacahan")
);

// Error Page
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Auth Pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

export default function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route element={<MainLayout />}>

                    <Route
                        path="/"

                        element={<Dashboard />}
                    />
                    <Route
                        path="/informasi-akun"
                        element={<InformasiAkun />}
                    />
                    <Route
                        path="/pembeli"
                        element={<Pembeli />}
                    />


                    <Route
                        path="/pembeli/create"
                        element={<TambahPembeli />}
                    />
                    <Route
                        path="/pembeli/edit/:id"
                        element={<EditPembeli />}
                    />

                    {/* Pemasok */}
                    <Route
                        path="/pemasok"
                        element={<Pemasok />}
                    />

                    <Route
                        path="/pemasok/create"
                        element={<TambahPemasok />}
                    />

                    <Route
                        path="/pemasok/edit/:id"
                        element={<EditPemasok />}
                    />

                    {/* Penjualan Sampah */}
                    <Route
                        path="/penjualan-sampah"
                        element={<PenjualanSampah />}
                    />
                    <Route
                        path="/penjualan-sampah/create"
                        element={<TambahPenjualanSampah />}
                    />
                    <Route
                        path="/penjualan-sampah/edit/:id"
                        element={<EditPenjualanSampah />}
                    />

                    {/* Pembelian Sampah */}
                    <Route
                        path="/pembelian-sampah"
                        element={<PembelianSampah />}
                    />
                    <Route
                        path="/pembelian-sampah/create"
                        element={<TambahPembelianSampah />}
                    />
                    <Route
                        path="/pembelian-sampah/edit/:id"
                        element={<EditPembelianSampah />}
                    />

                    {/* Produk Cacah */}
                    <Route
                        path="/produk-cacah"
                        element={<ProdukPencacahan />}
                    />
                    <Route
                        path="/produk-cacah/create"
                        element={<TambahProdukPencacahan />}
                    />
                    <Route
                        path="/produk-cacah/edit/:id"
                        element={<EditProdukPencacahan />}
                    />

                    {/* Riwayat Transaksi */}
                    <Route
                        path="/riwayat-transaksi"
                        element={<RiwayatTransaksi />}
                    />

                    {/* Stok removed */}

                    {/* Laporan Bulanan */}
                    <Route
                        path="/laporan"
                        element={<Laporan />}
                    />

                    {/* Not Found */}
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/forgot"
                        element={<Forgot />}
                    />

                </Route>

                <Route element={<PembeliLandingLayout />}>

                    <Route
                        path="/pembeli-utama"
                        element={<HeroPembeli />}
                    />

                    <Route
                        path="/about-utama"
                        element={<AboutUs />}
                    />
                    <Route
                        path="/produk-utama"
                        element={<ProdukUtama />}
                    />

                    <Route
                        path="/produk-utama/:id"
                        element={<ProductDetail />}
                    />

                    <Route
                        path="/keranjang"
                        element={<Cart />}
                    />
                    <Route
                        path="/checkout"
                        element={<Checkout />}
                    />
                    <Route
                        path="/riwayat-checkout"
                        element={<RiwayatCheckout />}
                    />
                    <Route
                        path="/profil-pembeli"
                        element={<ProfilPembeli />}
                    />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
