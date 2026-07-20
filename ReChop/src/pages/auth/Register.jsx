// Ringkasan: Komponen/halaman frontend (singkat)
// Tujuan: src/pages/auth/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";
import { FaRecycle, FaUser } from "react-icons/fa";

const getRedirectPath = (role) => {
    return String(role).toLowerCase() === "admin" ? "/" : "/pembeli-utama";
};

// Menangani pendaftaran akun baru serta validasi data yang diisi pengguna.
export default function Register() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [dataForm, setDataForm] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
        wasteType: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDataForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !dataForm.username ||
            !dataForm.email ||
            !dataForm.phone ||
            !dataForm.address ||
            !dataForm.password ||
            !dataForm.confirmPassword
        ) {
            alert("Semua data wajib diisi!");
            return;
        }

        if (dataForm.password !== dataForm.confirmPassword) {
            alert("Password dan Konfirmasi Password tidak sama!");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://127.0.0.1:8000/api/register",
                {
                    name: dataForm.username,
                    email: dataForm.email,
                    phone: dataForm.phone,
                    address: dataForm.address,
                    waste_type: dataForm.wasteType,
                    password: dataForm.password,
                    password_confirmation: dataForm.confirmPassword,
                }
            );

            // Simpan token
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Simpan user
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            localStorage.setItem(
                "pembeli_id",
                response.data.pembeli_id
            );

            localStorage.setItem(
                "pembeli",
                JSON.stringify(response.data.pembeli)
            );

            alert(response.data.message);

            // Admin masuk dashboard, pembeli masuk halaman utama pembeli.
            navigate(getRedirectPath(response.data.user.role));
        } catch (err) {
            console.log(err);

            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0][0];
                alert(firstError);
            } else if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("Register gagal");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid min-h-screen w-screen bg-latar font-fustat md:grid-cols-2">

            {/* LEFT */}
            <div
                className="relative hidden md:block bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://png.pngtree.com/background/20210710/original/pngtree-garbage-disposal-vector-environmental-education-simple-background-picture-image_1028473.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-hijau/70"></div>

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-10">

                    <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center shadow-2xl p-3 mb-6">
                        <img
                            src="https://i.pinimg.com/736x/47/47/9b/47479bc432f0d3d4df0ecb3eaa82159a.jpg"
                            alt="Logo"
                            className="w-full h-full rounded-full object-contain"
                        />
                    </div>

                    <h1 className="font-poppins text-7xl tracking-wide mb-6">
                        ReChop
                    </h1>

                    <p className="max-w-lg text-center text-xl leading-8 text-white/90">
                        Buat akun baru dan mulai kelola pencacahan sampah
                        dengan lebih mudah, cepat, dan modern.
                    </p>

                </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-center justify-center bg-white px-6 py-10 sm:px-10 overflow-y-auto max-h-screen">

                <div className="w-full text-left mb-8">

                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center text-hijau hover:underline"
                    >
                        <IoArrowBack className="me-2" />
                        Kembali ke Login
                    </button>

                </div>

                <FaUser className="mb-3 text-6xl text-teks" />

                <div className="w-full max-w-md auth-scroll max-h-[80vh] overflow-y-auto pr-2">

                    <h2 className="mb-2 text-center font-poppins text-4xl text-teks">
                        Register
                    </h2>

                    <p className="mb-6 text-center text-base text-teks-samping">
                        Lengkapi data diri untuk membuat akun pembeli
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Username */}
                        <div>

                            <label className="block mb-2 font-semibold text-teks">
                                Username
                            </label>

                            <div className="flex items-center rounded-2xl border border-garis bg-latar px-5 py-4">

                                <FaUser className="me-4 text-lg text-teks-samping" />

                                <input
                                    type="text"
                                    name="username"
                                    value={dataForm.username}
                                    onChange={handleChange}
                                    placeholder="Masukkan Username"
                                    className="w-full bg-transparent outline-none"
                                />

                            </div>

                        </div>

                        {/* Email */}
                        <div>

                            <label className="block mb-2 font-semibold text-teks">
                                Email
                            </label>

                            <div className="flex items-center rounded-2xl border border-garis bg-latar px-5 py-4">

                                <MdEmail className="me-4 text-xl text-teks-samping" />

                                <input
                                    type="email"
                                    name="email"
                                    value={dataForm.email}
                                    onChange={handleChange}
                                    placeholder="Masukkan Email"
                                    className="w-full bg-transparent outline-none"
                                />

                            </div>

                        </div>

                        <div>
                            <label className="mb-2 block font-semibold text-teks">
                                Nomor Telepon
                            </label>

                            <div className="flex items-center rounded-2xl border border-garis bg-latar px-5 py-3">
                                <MdPhone className="me-4 text-xl text-teks-samping" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={dataForm.phone}
                                    onChange={handleChange}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full bg-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold text-teks">
                                Alamat Lengkap
                            </label>

                            <div className="flex items-start rounded-2xl border border-garis bg-latar px-5 py-3">
                                <MdLocationOn className="me-4 mt-3 text-xl text-teks-samping" />
                                <textarea
                                    name="address"
                                    value={dataForm.address}
                                    onChange={handleChange}
                                    placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, kota"
                                    className="min-h-20 w-full resize-y bg-transparent py-2 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold text-teks">
                                Jenis Sampah yang Diminati
                                <span className="ml-1 font-normal text-teks-samping">(Opsional)</span>
                            </label>

                            <div className="flex items-center rounded-2xl border border-garis bg-latar px-5 py-3">
                                <FaRecycle className="me-4 text-lg text-teks-samping" />
                                <input
                                    type="text"
                                    name="wasteType"
                                    value={dataForm.wasteType}
                                    onChange={handleChange}
                                    placeholder="Contoh: PET, HDPE, plastik campuran"
                                    className="w-full bg-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>

                            <label className="block mb-2 font-semibold text-teks">
                                Password
                            </label>

                            <div className="flex items-center rounded-2xl border border-garis bg-latar px-5 py-4">

                                <RiLockPasswordFill className="me-4 text-xl text-teks-samping" />

                                <input
                                    type="password"
                                    name="password"
                                    value={dataForm.password}
                                    onChange={handleChange}
                                    placeholder="Masukkan Password"
                                    className="w-full bg-transparent outline-none"
                                />

                            </div>

                        </div>

                        {/* Confirm Password */}
                        <div>

                            <label className="block mb-2 font-semibold text-teks">
                                Konfirmasi Password
                            </label>

                            <div className="flex items-center rounded-2xl border border-garis bg-latar px-5 py-4">

                                <RiLockPasswordFill className="me-4 text-xl text-teks-samping" />

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={dataForm.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Ulangi Password"
                                    className="w-full bg-transparent outline-none"
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-hijau py-4 text-lg font-semibold text-white hover:opacity-90 disabled:bg-gray-400"
                        >
                            {loading ? "Register..." : "Register"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}
