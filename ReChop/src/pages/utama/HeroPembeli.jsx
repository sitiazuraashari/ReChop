// Ringkasan: Komponen/halaman frontend (singkat)
// Tujuan: src/pages/utama/HeroPembeli.jsx
import { Link } from "react-router-dom";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";

import HeaderPembeli from "../../components/pembeli/HeaderPembeli";
import FooterPembeli from "../../components/pembeli/FooterPembeli";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FiArrowUpRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Menampilkan bagian hero dan informasi utama pada beranda pembeli.
export default function HeroPembeli() {
    const testimonials = [
        {
            name: "Rani Putri",
            company: "UMKM Kerajinan Plastik",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            quote:
                "ReChop sangat membantu kami mendapatkan bahan baku plastik daur ulang dengan kualitas yang konsisten. Proses transaksi cepat dan transparan sehingga kebutuhan produksi selalu terpenuhi.",
        },
        {
            name: "Bima Saputra",
            company: "PT Daur Plastik Indonesia",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            quote:
                "Platform ReChop mempermudah kami dalam membeli produk daur ulang. Informasi stok selalu diperbarui dan pelayanan sangat responsif.",
        },
        {
            name: "Siti Rahma",
            company: "Pengelola Bank Sampah",
            image: "https://randomuser.me/api/portraits/women/45.jpg",
            quote:
                "Dengan ReChop kami lebih mudah menjual hasil pengolahan sampah. Sistemnya sederhana, aman, dan membantu meningkatkan nilai ekonomi sampah.",
        },
        {
            name: "Andi Pratama",
            company: "CV Green Industry",
            image: "https://randomuser.me/api/portraits/men/51.jpg",
            quote:
                "Kami sangat puas menggunakan ReChop karena proses pembelian lebih efisien. Kualitas produk sesuai dengan kebutuhan industri kami.",
        },
    ];
    return (
        <div className="min-h-screen bg-white">
            <HeaderPembeli />

            <section
                className="relative flex min-h-screen items-center overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1800&q=80')",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-cyan-700/60 to-emerald-500/60" />

                {/* Content */}
                <div className="relative z-10 mx-auto w-full max-w-7xl px-8">

                    <div className="max-w-3xl">

                        <div className="mb-8 inline-flex items-center rounded-full bg-white/20 px-5 py-2 backdrop-blur-md">
                            <FiShoppingBag className="mr-2 text-white" />
                            <span className="font-semibold text-white">
                                Marketplace Produk Daur Ulang
                            </span>
                        </div>

                        <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">
                            Kelola Sampah
                            <br />

                            <span className="text-lime-400">
                                Menjadi Produk
                            </span>

                            <br />
                            Bernilai Bersama ReChop
                        </h1>

                        <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-200">
                            ReChop menghubungkan pemasok, pembeli, dan industri daur ulang
                            dalam satu platform digital untuk menciptakan pengelolaan
                            sampah yang lebih efektif, transparan, dan berkelanjutan.
                        </p>

                        <div className="mt-12 flex flex-wrap gap-5">

                            <Link
                                to="/register"
                                className="rounded-lg bg-green-500 px-8 py-4 text-lg font-bold text-white transition hover:bg-cyan-600"
                            >
                                Mulai Sekarang
                            </Link>

                            <Link
                                to="/login"
                                className="rounded-lg border-2 border-white px-8 py-4 text-lg font-bold text-white transition hover:bg-white hover:text-slate-900"
                            >
                                Masuk
                            </Link>

                        </div>

                        {/* Statistik */}
                        <div className="mt-16 grid grid-cols-3 gap-10">

                            <div>
                                <h2 className="text-5xl font-black text-white">
                                    500+
                                </h2>

                                <p className="mt-2 text-lg text-slate-200">
                                    Produk
                                </p>
                            </div>

                            <div>
                                <h2 className="text-5xl font-black text-white">
                                    320+
                                </h2>

                                <p className="mt-2 text-lg text-slate-200">
                                    Mitra
                                </p>
                            </div>

                            <div>
                                <h2 className="text-5xl font-black text-white">
                                    128K+
                                </h2>

                                <p className="mt-2 text-lg text-slate-200">
                                    Kg Terolah
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* PENCAPAIAN */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-8">

                    <div className="text-center">
                        <h2 className="text-5xl font-black uppercase tracking-wide text-slate-900">
                            Pencapaian Kami
                        </h2>

                        <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-500">
                            ReChop terus membangun ekosistem pengelolaan sampah yang
                            berkelanjutan dengan menghubungkan pemasok, pembeli, dan
                            industri daur ulang dalam satu platform.
                        </p>
                    </div>

                    <div className="mt-20 grid grid-cols-2 gap-10 text-center lg:grid-cols-4">

                        <div>
                            <h3 className="text-6xl font-black text-green-500">
                                320+
                            </h3>

                            <p className="mt-5 text-3xl font-bold text-slate-900">
                                Klien Aktif
                            </p>

                            <p className="mt-2 text-base text-slate-500">
                                UMKM & Industri
                            </p>
                        </div>

                        <div>
                            <h3 className="text-6xl font-black text-green-500">
                                128K+
                            </h3>

                            <p className="mt-5 text-3xl font-bold text-slate-900">
                                Kg Sampah
                            </p>

                            <p className="mt-2 text-base text-slate-500">
                                Berhasil Dikelola
                            </p>
                        </div>

                        <div>
                            <h3 className="text-6xl font-black text-green-500">
                                98%
                            </h3>

                            <p className="mt-5 text-3xl font-bold text-slate-900">
                                Transaksi
                            </p>

                            <p className="mt-2 text-base text-slate-500">
                                Berhasil Diselesaikan
                            </p>
                        </div>

                        <div>
                            <h3 className="text-6xl font-black text-green-500">
                                500+
                            </h3>

                            <p className="mt-5 text-3xl font-bold text-slate-900">
                                Produk
                            </p>

                            <p className="mt-2 text-base text-slate-500">
                                Daur Ulang Tersedia
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* TESTIMONI */}
            <section className="bg-slate-50 py-20">

                <div className="mx-auto max-w-7xl px-8">

                    <div className="mb-12 text-center">
                        <h2 className="mt-3 text-4xl font-black text-slate-900">
                            TESTIMONI PELANGGAN
                        </h2>
                        <p className="mt-3 text-lg font-semibold text-slate-600">
                            Apa kata mereka tentang pengalaman berbelanja di ReChop?
                        </p>
                    </div>
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        spaceBetween={30}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            1024: {
                                slidesPerView: 2,
                            },
                        }}
                    >
                        {testimonials.map((item, index) => (
                            <SwiperSlide key={index}>

                                <div className="h-full rounded-xl bg-white p-10 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                                    <div className="flex gap-6">

                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-20 w-20 rounded-full border-4 border-cyan-100 object-cover"
                                        />

                                        <div>

                                            <p className="italic leading-8 text-slate-600">
                                                "{item.quote}"
                                            </p>

                                            <h3 className="mt-7 text-2xl font-black uppercase text-green-600">
                                                {item.name}
                                            </h3>

                                            <p className="mt-1 text-slate-500">
                                                {item.company}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* BERITA */}
            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-7xl px-8">

                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-600">
                                BERITA TERBARU
                            </p>

                            <h2 className="mt-3 text-4xl font-black text-slate-900">
                                Kondisi Sampah di Indonesia
                            </h2>

                            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
                                Berbagai permasalahan penumpukan sampah di berbagai daerah
                                menjadi pengingat bahwa pengelolaan sampah yang baik sangat
                                diperlukan demi menciptakan lingkungan yang lebih bersih
                                dan berkelanjutan.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                        {[
                            {
                                image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
                                date: "29 Juni 2026",
                                title: "Tumpukan Sampah Liar Meluber ke Jalan Ganggu Pengendara",
                                desc: "Penumpukan sampah di pinggir jalan mengganggu aktivitas masyarakat dan membahayakan pengguna jalan.",
                                link: "https://news.detik.com/foto-news/d-8551716/tumpukan-sampah-liar-meluber-ke-jalan-ganggu-pengendara",
                            },
                            {
                                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
                                date: "29 Juni 2026",
                                title: "Sampah Menumpuk di Sungai Cikundul Hingga Muara Waduk Cirata",
                                desc: "Warga mengkhawatirkan tumpukan sampah di aliran sungai dapat memicu banjir dan mencemari lingkungan sekitar.",
                                link: "https://beritacianjur.com/sampah-menumpuk-di-sungai-cikundul-hingga-muara-waduk-cirata-warga-khawatir-picu-banjir-ini-penjelasan-dlh/",
                            },
                            {
                                image: "https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?auto=format&fit=crop&w=1200&q=80",
                                date: "29 Juni 2026",
                                title: "Sampah Terus Menumpuk, Jakarta Diuji dari Hulu hingga Hilir",
                                desc: "Pengelolaan sampah yang belum optimal menjadi tantangan besar dalam menjaga kebersihan ibu kota.",
                                link: "https://www.kompas.id/artikel/sampah-terus-menumpuk-jakarta-diuji-dari-hulu-hingga-hilir",
                            },
                            {
                                image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1200&q=80",
                                date: "29 Juni 2026",
                                title: "Sampah Menumpuk di Pasar Cikurubuk Ganggu Aktivitas Pedagang",
                                desc: "Volume sampah yang meningkat membuat aktivitas perdagangan menjadi kurang nyaman bagi pedagang maupun pengunjung.",
                                link: "https://koran.pikiran-rakyat.com/news/pr-30310201286/sampah-menumpuk-di-pasar-cikurubuk-ganggu-aktivitas-pedagang",
                            },
                            {
                                image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=1200&q=80",
                                date: "29 Juni 2026",
                                title: "Seratusan Ton Sampah Menumpuk di Bandung Raya",
                                desc: "Pemerintah berupaya mempercepat penanganan sampah agar tidak berdampak pada kesehatan dan lingkungan masyarakat.",
                                link: "https://news.republika.co.id/berita/tfqhcw377/seratusan-ton-sampah-menumpuk-di-bandung-raya-kdm-pegang-komando-janji-tiga-hari-kelar",
                            },
                            {
                                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
                                date: "29 Juni 2026",
                                title: "PPSU Jelambar Atasi Sampah Menumpuk Pasca Lebaran",
                                desc: "Petugas PPSU bergerak cepat membersihkan sampah yang menumpuk agar lingkungan kembali bersih dan nyaman.",
                                link: "https://barat.jakarta.go.id/berita/ppsu-jelambar-atasi-sampah-menumpuk-pasca-lebaran-di-jl-latumeten",
                            },
                        ].map((item, index) => (

                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >

                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                                />

                                <div className="p-7">

                                    <p className="text-sm text-slate-500">
                                        {item.date}
                                    </p>

                                    <h3 className="mt-4 min-h-[120px] text-2xl font-black leading-snug text-slate-900 transition group-hover:text-green-600">
                                        {item.title}
                                    </h3>

                                    <p className="mt-4 min-h-[90px] text-base leading-7 text-slate-600">
                                        {item.desc}
                                    </p>

                                </div>

                                <div className="flex items-center justify-between border-t border-slate-200 px-7 py-5">

                                    <span className="font-bold uppercase tracking-wide text-green-600 group-hover:underline">
                                        Selengkapnya »
                                    </span>

                                    <FiArrowUpRight
                                        size={22}
                                        className="text-green-600 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                    />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <FooterPembeli />
        </div>
    );
}
