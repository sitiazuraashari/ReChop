// Ringkasan: Komponen/halaman frontend (singkat)
// Tujuan: src/components/pembeli/FooterPembeli.jsx
import { Link } from "react-router-dom";
import { FiInstagram, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

// Menampilkan tautan, kontak, dan informasi hak cipta untuk halaman pembeli.
export default function FooterPembeli() {
    return (
        <footer id="footer" className="border-t border-slate-200 bg-slate-950 text-white">
            {/* Kolom identitas aplikasi, navigasi, akun, dan informasi kontak. */}
            <div className="mx-auto grid max-w-7xl gap-10 px-8 py-14 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr]">
                <div>
                    <Link to="/" className="inline-flex items-center gap-3">
                        <img
                            src="https://i.pinimg.com/736x/47/47/9b/47479bc432f0d3d4df0ecb3eaa82159a.jpg"
                            alt="ReChop logo"
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="text-2xl font-black">ReChop</span>
                    </Link>

                    <p className="mt-5 max-w-sm text-base font-medium leading-7 text-slate-300">
                        Platform untuk belanja produk daur ulang, mengelola
                        sampah bernilai, dan mendukung ekonomi sirkular.
                    </p>
                </div>

                <div>
                    <h3 className="font-black">Menu</h3>
                    <div className="mt-5 space-y-3 text-slate-300">
                        <a href="#produk" className="block hover:text-white">
                            Product
                        </a>
                        <a href="#layanan" className="block hover:text-white">
                            Features
                        </a>
                        <a href="#marketplace" className="block hover:text-white">
                            Marketplace
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="font-black">Akun</h3>
                    <div className="mt-5 space-y-3 text-slate-300">
                        <Link to="/login" className="block hover:text-white">
                            Log in
                        </Link>
                        <Link to="/register" className="block hover:text-white">
                            Sign up
                        </Link>
                        <Link to="/forgot" className="block hover:text-white">
                            Forgot password
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="font-black">Kontak</h3>
                    <div className="mt-5 space-y-4 text-slate-300">
                        <p className="flex items-center gap-3">
                            <FiMapPin className="text-indigo-300" />
                            Jakarta, Indonesia
                        </p>
                        <p className="flex items-center gap-3">
                            <FiMail className="text-indigo-300" />
                            hello@rechop.id
                        </p>
                        <p className="flex items-center gap-3">
                            <FiPhone className="text-indigo-300" />
                            +62 812 0000 2026
                        </p>
                        <p className="flex items-center gap-3">
                            <FiInstagram className="text-indigo-300" />
                            @rechop.id
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 px-8 py-6">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-semibold text-slate-400 md:flex-row md:items-center md:justify-between">
                    <p>Copyright 2026 ReChop. All rights reserved.</p>
                    <p>Dibuat untuk ekosistem daur ulang yang lebih mudah.</p>
                </div>
            </div>
        </footer>
    );
}
