// Ringkasan: Komponen/halaman frontend (singkat)
// Tujuan: src/pages/auth/Forgot.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";
import { BsFillExclamationDiamondFill } from "react-icons/bs";

// Mengelola permintaan pemulihan kata sandi melalui alamat email pengguna.
export default function Forgot() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState("email");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const cleanEmail = email.trim().toLowerCase();

        if (cleanEmail === "admin@gmail.com") {
            setMessage(
                "Akun admin memakai password bawaan: admin123. Silakan kembali ke login."
            );
            return;
        }

        const savedUsers = JSON.parse(
            localStorage.getItem("rechopUsers") || "[]"
        );

        const userExists = savedUsers.some(
            (user) => user.email.toLowerCase() === cleanEmail
        );

        if (!userExists) {
            setError("Email tidak ditemukan. Silakan register terlebih dahulu.");
            return;
        }

        setStep("reset");
        setMessage("Email ditemukan. Silakan buat password baru.");
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword.length < 6) {
            setError("Password baru minimal 6 karakter.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Konfirmasi password tidak sama.");
            return;
        }

        const cleanEmail = email.trim().toLowerCase();
        const savedUsers = JSON.parse(
            localStorage.getItem("rechopUsers") || "[]"
        );

        const updatedUsers = savedUsers.map((user) =>
            user.email.toLowerCase() === cleanEmail
                ? { ...user, password: newPassword }
                : user
        );

        localStorage.setItem("rechopUsers", JSON.stringify(updatedUsers));
        localStorage.removeItem("rechopCurrentUser");

        alert("Password berhasil diubah. Silakan login kembali.");
        navigate("/login");
    };

    return (
        <div className="grid min-h-screen w-screen bg-latar font-fustat md:grid-cols-2">
            <div
                className="relative hidden bg-cover bg-center md:block"
                style={{
                    backgroundImage:
                        "url('https://png.pngtree.com/background/20210710/original/pngtree-garbage-disposal-vector-environmental-education-simple-background-picture-image_1028473.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-hijau/70" />

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-10 text-white">
                    <div className="mb-6 flex h-44 w-44 items-center justify-center rounded-full bg-white p-3 shadow-2xl">
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/014/857/137/large_2x/leaf-logo-images-vector.jpg"
                            alt="Logo ReChop"
                            className="h-full w-full rounded-full object-contain"
                        />
                    </div>

                    <h1 className="mb-6 font-poppins text-7xl tracking-wide drop-shadow-lg">
                        ReChop
                    </h1>

                    <p className="max-w-lg text-center text-xl leading-8 text-white/90">
                        Reset password akun kamu dengan mudah untuk kembali
                        mengakses dashboard ReChop.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-white px-10 py-12 overflow-y-auto max-h-screen">
                <div className="mb-8 w-full text-left">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="flex items-center text-hijau hover:underline"
                    >
                        <IoArrowBack className="me-2" />
                        Kembali ke Login
                    </button>
                </div>

                <MdEmail className="mb-4 text-8xl text-teks" />

                <div className="w-full max-w-md auth-scroll max-h-[80vh] overflow-y-auto pr-2">
                    <h2 className="mb-3 text-center font-poppins text-5xl text-teks">
                        Forgot Password
                    </h2>

                    <p className="mb-8 text-center text-lg leading-7 text-teks-samping">
                        Masukkan email akun kamu, lalu buat password baru.
                    </p>

                    {error && (
                        <div className="mb-5 flex items-center rounded-2xl bg-red-100 p-4 text-sm text-merah">
                            <BsFillExclamationDiamondFill className="me-2" />
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-hijau">
                            {message}
                        </div>
                    )}

                    {step === "email" ? (
                        <form onSubmit={handleEmailSubmit}>
                            <div className="mb-8">
                                <label className="mb-2 block font-semibold text-teks">
                                    Email Address
                                </label>

                                <div className="flex items-center rounded-2xl border border-garis bg-latar px-5 py-4 transition-all duration-300 focus-within:border-hijau focus-within:ring-2 focus-within:ring-hijau/20">
                                    <MdEmail className="me-4 text-xl text-teks-samping" />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full bg-transparent text-teks outline-none placeholder:text-teks-samping"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-hijau py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:opacity-90"
                            >
                                Cek Email
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetSubmit}>
                            <div className="mb-6">
                                <label className="mb-2 block font-semibold text-teks">
                                    Password Baru
                                </label>

                                <div className="flex items-center rounded-2xl border border-garis bg-latar px-5 py-4 transition-all duration-300 focus-within:border-hijau focus-within:ring-2 focus-within:ring-hijau/20">
                                    <RiLockPasswordFill className="me-4 text-xl text-teks-samping" />

                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        placeholder="Masukkan password baru"
                                        className="w-full bg-transparent text-teks outline-none placeholder:text-teks-samping"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="mb-2 block font-semibold text-teks">
                                    Konfirmasi Password
                                </label>

                                <div className="flex items-center rounded-2xl border border-garis bg-latar px-5 py-4 transition-all duration-300 focus-within:border-hijau focus-within:ring-2 focus-within:ring-hijau/20">
                                    <RiLockPasswordFill className="me-4 text-xl text-teks-samping" />

                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Ulangi password baru"
                                        className="w-full bg-transparent text-teks outline-none placeholder:text-teks-samping"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-hijau py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:opacity-90"
                            >
                                Simpan Password Baru
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
