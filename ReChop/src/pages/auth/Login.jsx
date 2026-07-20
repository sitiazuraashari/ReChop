// Ringkasan: Komponen/halaman frontend (singkat)
// Tujuan: src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { MdAccountCircle, MdEmail } from "react-icons/md";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { RiLockPasswordFill } from "react-icons/ri";

const getRedirectPath = (role, email = "") => {
    const normalizedRole = String(role || "").toLowerCase();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    return normalizedRole === "admin" || normalizedEmail === "admin@gmail.com"
        ? "/"
        : "/pembeli-utama";
};

// Menangani autentikasi pengguna dan pengalihan sesuai peran akun.
export default function Login() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [dataForm, setDataForm] = useState({
        email: "",
        password: "",
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

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                {
                    email: dataForm.email.trim(),
                    password: dataForm.password,
                }
            );

            const user = response.data.user;
            const redirectPath = getRedirectPath(user?.role, user?.email);

            // Simpan Token
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Simpan User
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "rechopCurrentUser",
                JSON.stringify(user)
            );

            // Simpan pembeli_id
            localStorage.setItem(
                "pembeli_id",
                response.data.pembeli_id
            );

            localStorage.setItem(
                "pembeli",
                JSON.stringify(response.data.pembeli)
            );

            // Admin masuk dashboard, pembeli masuk halaman utama pembeli.
            navigate(redirectPath, { replace: true });

        } catch (err) {

            console.log(err);

            if (err.response?.status === 401) {

                setError("Email atau Password salah");

            } else if (err.response?.status === 422) {

                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0][0];
                setError(firstError);

            } else {

                setError("Tidak dapat terhubung ke server");

            }

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="grid min-h-screen w-screen bg-latar font-fustat md:grid-cols-2">

            {/* LEFT */}
            <div
                className="relative hidden bg-cover bg-center md:block"
                style={{
                    backgroundImage:
                        "url('https://png.pngtree.com/background/20210710/original/pngtree-garbage-disposal-vector-environmental-education-simple-background-picture-image_1028473.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-hijau/70"></div>

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-10 text-white">

                    <div className="mb-6 flex h-44 w-44 items-center justify-center rounded-full bg-white p-3 shadow-2xl">

                        <img
                            src="https://i.pinimg.com/736x/47/47/9b/47479bc432f0d3d4df0ecb3eaa82159a.jpg"
                            alt="Logo"
                            className="h-full w-full rounded-full object-contain"
                        />

                    </div>

                    <h1 className="mb-6 font-poppins text-7xl tracking-wide">
                        ReChop
                    </h1>

                    <p className="max-w-lg text-center text-xl leading-8 text-white/90">
                        ReChop Dashboard Management untuk membantu
                        pengelolaan pencacahan sampah menjadi lebih
                        mudah, cepat, dan modern.
                    </p>

                </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-center justify-center bg-white px-10 py-12 overflow-y-auto max-h-screen">

                <MdAccountCircle className="mb-4 text-8xl text-teks" />

                <div className="w-full max-w-md auth-scroll max-h-[80vh] overflow-y-auto pr-2">

                    <h2 className="mb-3 text-center font-poppins text-5xl font-semibold text-teks">
                        Login
                    </h2>

                    <p className="mb-10 text-center text-lg text-teks-samping">
                        Silahkan masuk ke akun kamu
                    </p>

                    {error && (
                        <div className="mb-5 flex items-center rounded-2xl bg-red-100 p-4 text-red-600">
                            <BsFillExclamationDiamondFill className="me-2" />
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="mb-5 flex items-center rounded-2xl bg-gray-100 p-4">
                            <ImSpinner2 className="me-2 animate-spin" />
                            Mohon Tunggu...
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Email */}

                        <div className="mb-6">

                            <label className="mb-2 block font-semibold">
                                Email
                            </label>

                            <div className="flex items-center rounded-2xl border px-5 py-4">

                                <MdEmail className="me-4 text-xl" />

                                <input
                                    type="email"
                                    name="email"
                                    value={dataForm.email}
                                    onChange={handleChange}
                                    placeholder="Masukkan Email"
                                    className="w-full outline-none"
                                    required
                                />

                            </div>

                        </div>

                        {/* Password */}

                        <div className="mb-6">

                            <label className="mb-2 block font-semibold">
                                Password
                            </label>

                            <div className="flex items-center rounded-2xl border px-5 py-4">

                                <RiLockPasswordFill className="me-4 text-xl" />

                                <input
                                    type="password"
                                    name="password"
                                    value={dataForm.password}
                                    onChange={handleChange}
                                    placeholder="Masukkan Password"
                                    className="w-full outline-none"
                                    required
                                />

                            </div>

                        </div>

                        <div className="mb-8 flex justify-end">

                            <button
                                type="button"
                                onClick={() => navigate("/forgot")}
                                className="text-sm font-semibold text-hijau hover:underline"
                            >
                                Forgot Password?
                            </button>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-hijau py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:bg-gray-400"
                        >
                            {loading ? "Loading..." : "Sign In"}
                        </button>

                        <div className="mt-8 text-center">

                            <p>
                                Belum punya akun?{" "}

                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="font-semibold text-hijau hover:underline"
                                >
                                    Register
                                </button>

                            </p>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}
