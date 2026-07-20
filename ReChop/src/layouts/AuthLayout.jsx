// Layout minimal untuk menampilkan halaman autentikasi melalui nested route.
import { Outlet } from "react-router-dom";

// Merender halaman login, daftar, atau lupa kata sandi tanpa navigasi admin.
export default function AuthLayout() {
    return (
        <div className="w-screen h-screen overflow-hidden">
            <Outlet />
        </div>
    );
}
