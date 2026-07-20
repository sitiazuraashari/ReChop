// Ringkasan: Layout frontend singkat
// Tujuan: src/layouts/PembeliLandingLayout.jsx
import { Outlet } from "react-router-dom";

// Menyediakan wadah halaman publik/pembeli dengan tinggi layar minimum.
export default function PembeliLandingLayout() {
    return (
        <div className="min-h-screen bg-white">
            <Outlet />
        </div>
    );
}

