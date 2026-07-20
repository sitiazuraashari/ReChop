// Ringkasan: Halaman About Us pengunjung (singkat)
// Tujuan: src/pages/utama/aboutUs.jsx
import { Link } from "react-router-dom";

import { FaLinkedinIn } from "react-icons/fa";
import {
    FiGlobe,
    FiPackage,
    FiShield,
    FiTrendingUp,
    FiTruck,
    FiUsers,
} from "react-icons/fi";

import HeaderPembeli from "../../components/pembeli/HeaderPembeli";
import FooterPembeli from "../../components/pembeli/FooterPembeli";

// Menampilkan informasi tentang ReChop, tujuan, dan nilai keberlanjutannya.
export default function aboutUS() {


    return (
        <>
            <HeaderPembeli />

            {/* HERO */}
            <section className="relative h-screen overflow-hidden">

                <img
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1800&q=80"
                    alt="About ReChop"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-green-900/30" />

                <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-8">

                    <div className="max-w-3xl">

                        <span className="rounded-full bg-green-600 px-5 py-2 text-sm font-bold uppercase tracking-widest text-white">
                            About ReChop
                        </span>

                        <h1 className="mt-8 text-6xl font-black leading-tight text-white">

                            Solusi Digital
                            <br />

                            Pengelolaan Sampah
                            <br />

                            <span className="text-green-400">
                                yang Modern &
                                Berkelanjutan
                            </span>

                        </h1>

                        <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-200">

                            ReChop hadir sebagai platform digital yang
                            menghubungkan pemasok, pembeli, dan industri
                            daur ulang untuk menciptakan ekosistem ekonomi
                            sirkular yang transparan, efisien, dan ramah
                            lingkungan.

                        </p>

                        <div className="mt-10 flex gap-5">

                            <Link
                                to="/register"
                                className="rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-700"
                            >
                                Bergabung Sekarang
                            </Link>

                            <Link
                                to="/produk-utama"
                                className="rounded-xl border border-white px-8 py-4 text-lg font-bold text-white transition hover:bg-white hover:text-slate-900"
                            >
                                Jelajahi Produk
                            </Link>

                        </div>

                    </div>

                </div>

            </section>
            {/* VISI MISI */}
            <section className="bg-slate-50 py-24">
                <div className="mx-auto grid max-w-7xl gap-10 px-8 lg:grid-cols-2">

                    {/* Video / Gambar */}
                    <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

                        <div className="relative">

                            <img
                                src="https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1200&q=80"
                                alt="ReChop"
                                className="h-[420px] w-full object-cover"
                            />

                            <a
                                href="https://youtu.be/dQw4w9WgXcQ"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-center justify-center"
                            >

                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-2xl transition hover:scale-110">

                                    <svg
                                        className="ml-1 h-8 w-8 fill-white"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>

                                </div>

                            </a>

                        </div>

                    </div>

                    {/* Visi Misi */}

                    <div className="rounded-3xl bg-white p-10 shadow-xl">

                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-600">
                            Tentang Kami
                        </p>

                        <h2 className="mt-3 text-4xl font-black text-slate-900">
                            Visi & Misi ReChop
                        </h2>

                        <div className="mt-10 space-y-8">

                            {/* VISI */}

                            <div>

                                <div className="mb-3 flex items-center gap-3">

                                    <div className="h-10 w-2 rounded-full bg-green-600"></div>

                                    <h3 className="text-2xl font-black text-slate-900">
                                        Visi
                                    </h3>

                                </div>

                                <p className="leading-8 text-slate-600">

                                    Menjadi platform digital pengelolaan sampah
                                    terdepan yang mendorong ekonomi sirkular,
                                    menghubungkan seluruh pelaku industri daur ulang,
                                    serta menciptakan lingkungan yang lebih bersih,
                                    hijau, dan berkelanjutan.

                                </p>

                            </div>

                            {/* MISI */}

                            <div>

                                <div className="mb-3 flex items-center gap-3">

                                    <div className="h-10 w-2 rounded-full bg-green-600"></div>

                                    <h3 className="text-2xl font-black text-slate-900">
                                        Misi
                                    </h3>

                                </div>

                                <ul className="space-y-4">

                                    <li className="flex gap-3">

                                        <span className="mt-1 text-green-600">
                                            ✔
                                        </span>

                                        <span className="text-slate-600">
                                            Menghubungkan pemasok dan pembeli
                                            material daur ulang melalui platform
                                            digital.
                                        </span>

                                    </li>

                                    <li className="flex gap-3">

                                        <span className="mt-1 text-green-600">
                                            ✔
                                        </span>

                                        <span className="text-slate-600">
                                            Mendukung transaksi yang aman,
                                            transparan, dan mudah dipantau.
                                        </span>

                                    </li>

                                    <li className="flex gap-3">

                                        <span className="mt-1 text-green-600">
                                            ✔
                                        </span>

                                        <span className="text-slate-600">
                                            Mendorong pemanfaatan kembali limbah
                                            plastik menjadi produk bernilai.
                                        </span>

                                    </li>

                                    <li className="flex gap-3">

                                        <span className="mt-1 text-green-600">
                                            ✔
                                        </span>

                                        <span className="text-slate-600">
                                            Berkontribusi dalam mengurangi jumlah
                                            sampah yang berakhir di TPA.
                                        </span>

                                    </li>

                                </ul>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* OUR JOURNEY */}
            <section className="bg-white py-24">

                <div className="mx-auto max-w-7xl px-8">

                    <div className="text-center">

                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-600">
                            Perjalanan Kami
                        </p>

                        <h2 className="mt-3 text-4xl font-black text-slate-900">
                            Sejarah ReChop
                        </h2>

                        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                            ReChop terus berkembang menjadi platform digital yang
                            mempertemukan pemasok, pembeli, dan industri daur ulang
                            untuk membangun ekosistem ekonomi sirkular di Indonesia.
                        </p>

                    </div>

                    <div className="relative mt-20">

                        {/* Garis Tengah */}
                        <div className="absolute left-1/2 hidden h-full w-1 -translate-x-1/2 rounded-full bg-green-200 lg:block"></div>

                        <div className="space-y-16">

                            {/* 2022 */}
                            <div className="grid items-center gap-10 lg:grid-cols-2">

                                <div className="rounded-3xl bg-green-50 p-8 shadow-lg">

                                    <span className="text-5xl font-black text-green-600">
                                        2022
                                    </span>

                                    <h3 className="mt-4 text-2xl font-black text-slate-900">
                                        ReChop Didirikan
                                    </h3>

                                    <p className="mt-4 leading-8 text-slate-600">
                                        ReChop hadir sebagai platform digital untuk
                                        membantu pengelolaan sampah plastik melalui
                                        sistem marketplace yang menghubungkan pemasok
                                        dan pembeli secara langsung.
                                    </p>

                                </div>

                                <div className="hidden lg:flex justify-center">

                                    <div className="h-8 w-8 rounded-full border-8 border-green-500 bg-white"></div>

                                </div>

                            </div>

                            {/* 2023 */}

                            <div className="grid items-center gap-10 lg:grid-cols-2">

                                <div className="order-2 hidden lg:flex justify-center">

                                    <div className="h-8 w-8 rounded-full border-8 border-green-500 bg-white"></div>

                                </div>

                                <div className="order-1 rounded-3xl bg-slate-50 p-8 shadow-lg lg:order-2">

                                    <span className="text-5xl font-black text-green-600">
                                        2023
                                    </span>

                                    <h3 className="mt-4 text-2xl font-black text-slate-900">
                                        Marketplace Diluncurkan
                                    </h3>

                                    <p className="mt-4 leading-8 text-slate-600">
                                        Sistem jual beli plastik cacah mulai digunakan
                                        oleh berbagai pemasok dan pelaku industri
                                        daur ulang sehingga transaksi menjadi lebih
                                        cepat dan transparan.
                                    </p>

                                </div>

                            </div>

                            {/* 2024 */}

                            <div className="grid items-center gap-10 lg:grid-cols-2">

                                <div className="rounded-3xl bg-green-50 p-8 shadow-lg">

                                    <span className="text-5xl font-black text-green-600">
                                        2024
                                    </span>

                                    <h3 className="mt-4 text-2xl font-black text-slate-900">
                                        Ribuan Transaksi Berhasil
                                    </h3>

                                    <p className="mt-4 leading-8 text-slate-600">
                                        ReChop telah melayani ribuan transaksi,
                                        memperluas jaringan mitra, serta membantu
                                        mengurangi limbah plastik yang berakhir
                                        di tempat pembuangan akhir.
                                    </p>

                                </div>

                                <div className="hidden lg:flex justify-center">

                                    <div className="h-8 w-8 rounded-full border-8 border-green-500 bg-white"></div>

                                </div>

                            </div>

                            {/* 2025 */}

                            <div className="grid items-center gap-10 lg:grid-cols-2">

                                <div className="order-2 hidden lg:flex justify-center">

                                    <div className="h-8 w-8 rounded-full border-8 border-green-500 bg-white"></div>

                                </div>

                                <div className="order-1 rounded-3xl bg-slate-50 p-8 shadow-lg lg:order-2">

                                    <span className="text-5xl font-black text-green-600">
                                        2025
                                    </span>

                                    <h3 className="mt-4 text-2xl font-black text-slate-900">
                                        Menuju Ekonomi Sirkular
                                    </h3>

                                    <p className="mt-4 leading-8 text-slate-600">
                                        ReChop terus berinovasi untuk membangun
                                        ekosistem pengelolaan sampah yang lebih
                                        modern, transparan, dan berkelanjutan
                                        di seluruh Indonesia.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* OUR TEAM */}
            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-8">

                    <div className="text-center">

                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-600">
                            Tim Kami
                        </p>

                        <h2 className="mt-3 text-4xl font-black text-slate-900">
                            Orang-Orang di Balik ReChop
                        </h2>

                        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                            Kami percaya bahwa perubahan besar dimulai dari tim yang
                            memiliki visi yang sama untuk menciptakan lingkungan yang
                            lebih bersih dan berkelanjutan.
                        </p>

                    </div>

                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

                        {[
                            {
                                name: "Andi Pratama",
                                role: "Chief Executive Officer",
                                image: "https://randomuser.me/api/portraits/men/32.jpg",
                            },
                            {
                                name: "Siti Rahma",
                                role: "Chief Technology Officer",
                                image: "https://randomuser.me/api/portraits/women/65.jpg",
                            },
                            {
                                name: "Budi Santoso",
                                role: "Operations Manager",
                                image: "https://randomuser.me/api/portraits/men/68.jpg",
                            },
                            {
                                name: "Dewi Lestari",
                                role: "Marketing Manager",
                                image: "https://randomuser.me/api/portraits/women/45.jpg",
                            },
                        ].map((member, index) => (

                            <div
                                key={index}
                                className="group overflow-hidden rounded-3xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >

                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="mx-auto h-40 w-40 rounded-full border-4 border-green-100 object-cover transition duration-300 group-hover:border-green-500"
                                />

                                <h3 className="mt-6 text-2xl font-black text-slate-900">
                                    {member.name}
                                </h3>

                                <p className="mt-2 text-green-600 font-semibold">
                                    {member.role}
                                </p>

                                <p className="mt-5 text-sm leading-7 text-slate-500">
                                    Berkomitmen menghadirkan solusi digital yang mampu
                                    meningkatkan efektivitas pengelolaan sampah dan
                                    mendukung ekonomi sirkular di Indonesia.
                                </p>

                                <div className="mt-6 flex justify-center">

                                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 transition hover:bg-green-600 hover:text-white">

                                        <FaLinkedinIn />

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* WHY CHOOSE US */}
            <section className="bg-white py-24">

                <div className="mx-auto max-w-7xl px-8">

                    <div className="text-center">

                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-600">
                            Mengapa Memilih Kami
                        </p>

                        <h2 className="mt-3 text-4xl font-black text-slate-900">
                            Solusi Pengelolaan Sampah yang Terpercaya
                        </h2>

                        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                            ReChop hadir sebagai platform digital yang mempermudah proses
                            pengelolaan sampah mulai dari pemasok, pembeli, hingga industri
                            daur ulang dalam satu ekosistem yang terintegrasi.
                        </p>

                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                        {[
                            {
                                icon: <FiShield size={34} />,
                                title: "Transaksi Aman",
                                desc: "Seluruh transaksi tercatat secara transparan sehingga memberikan rasa aman bagi pemasok maupun pembeli.",
                            },
                            {
                                icon: <FiTrendingUp size={34} />,
                                title: "Harga Kompetitif",
                                desc: "Membantu pemasok mendapatkan harga terbaik dan pembeli memperoleh material berkualitas.",
                            },
                            {
                                icon: <FiUsers size={34} />,
                                title: "Jaringan Luas",
                                desc: "Menghubungkan pemasok, pengepul, industri, dan pelaku usaha daur ulang di seluruh Indonesia.",
                            },
                            {
                                icon: <FiTruck size={34} />,
                                title: "Distribusi Mudah",
                                desc: "Mendukung proses distribusi material sehingga transaksi menjadi lebih efisien.",
                            },
                            {
                                icon: <FiPackage size={34} />,
                                title: "Produk Berkualitas",
                                desc: "Marketplace menyediakan plastik cacah dan material daur ulang dengan kualitas terbaik.",
                            },
                            {
                                icon: <FiGlobe size={34} />,
                                title: "Peduli Lingkungan",
                                desc: "Bersama ReChop kita membantu mengurangi limbah dan mendukung ekonomi sirkular.",
                            },
                        ].map((item, index) => (

                            <div
                                key={index}
                                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-green-500 hover:shadow-2xl"
                            >

                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">

                                    {item.icon}

                                </div>

                                <h3 className="mt-6 text-2xl font-black text-slate-900">
                                    {item.title}
                                </h3>

                                <p className="mt-4 leading-8 text-slate-600">
                                    {item.desc}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* FAQ */}
            <section className="bg-slate-50 py-24" id="faq">
                <div className="mx-auto max-w-7xl px-8">
                    <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-600">
                            Pertanyaan Umum
                        </p>
                        <h2 className="mt-3 text-4xl font-black text-slate-900">
                            FAQ tentang ReChop
                        </h2>
                        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                            Temukan jawaban cepat untuk kebutuhan Anda terkait platform pengelolaan sampah dan transaksi daur ulang.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-3xl space-y-4">
                        {[
                            {
                                q: "Apa itu ReChop?",
                                a: "ReChop adalah platform digital yang menghubungkan pemasok, pembeli, dan industri daur ulang agar transaksi lebih transparan, efisien, dan berkelanjutan.",
                            },
                            {
                                q: "Bagaimana cara memulai transaksi?",
                                a: "Daftar terlebih dahulu, lalu pilih peran Anda (pembeli/pemasok). Setelah itu Anda dapat melihat produk dan melakukan permintaan transaksi sesuai kebutuhan.",
                            },
                            {
                                q: "Apakah transaksi aman?",
                                a: "Kami menekankan pencatatan transaksi yang jelas dan pemantauan yang mudah. Detail transaksi tercatat agar pengguna dapat melacak prosesnya.",
                            },
                            {
                                q: "Apakah ada dukungan untuk pelaku UMKM?",
                                a: "Ada. ReChop dirancang untuk membantu UMKM dan industri kecil-menengah mendapatkan akses pasar, informasi, dan kemudahan transaksi.",
                            },
                            {
                                q: "Bagaimana ReChop berkontribusi pada lingkungan?",
                                a: "Dengan mendorong pemanfaatan kembali limbah plastik menjadi produk bernilai, ReChop membantu mengurangi sampah yang berakhir di tempat pembuangan akhir.",
                            },
                        ].map((item, idx) => (
                            <details
                                key={idx}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-green-400"
                            >
                                <summary className="cursor-pointer list-none text-left">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-lg font-black text-slate-900">
                                            {item.q}
                                        </h3>
                                        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600 transition group-open:bg-green-600 group-open:text-white">
                                            +
                                        </span>
                                    </div>
                                </summary>
                                <p className="mt-3 text-slate-600 leading-7">
                                    {item.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
            
            <FooterPembeli />

        </>

    );
}

