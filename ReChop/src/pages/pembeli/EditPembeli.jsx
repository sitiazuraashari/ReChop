// Ringkasan: Halaman edit pembeli (singkat)
// Tujuan: src/pages/pembeli/EditPembeli.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import pembeliData from "../../assets/Pembeli.json";

const getSavedData = () => {
    try {
        const raw = localStorage.getItem("pembeliData");
        return raw ? JSON.parse(raw) : pembeliData;
    } catch {
        return pembeliData;
    }
};

// Memuat data pembeli untuk diubah dan menyimpan hasil perubahannya.
export default function EditPembeli() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "Active",
        total_orders: 0,
        total_spent: 0,
        waste_type: "",
        join_date: "",
    });

    useEffect(() => {
        const data = getSavedData();
        const item = data.find((entry) => entry.id === id);
        if (item) {
            setForm({
                name: item.name || "",
                email: item.email || "",
                phone: item.phone || "",
                address: item.address || "",
                status: item.status || "Active",
                total_orders: item.total_orders || 0,
                total_spent: item.total_spent || 0,
                waste_type: item.waste_type || "",
                join_date: item.join_date || "",
            });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = getSavedData();
        const next = data.map((entry) =>
            entry.id === id
                ? {
                      ...entry,
                      ...form,
                      total_orders: Number(form.total_orders),
                      total_spent: Number(form.total_spent),
                  }
                : entry
        );

        localStorage.setItem("pembeliData", JSON.stringify(next));
        alert("Data pembeli berhasil diperbarui");
        navigate("/pembeli");
    };

    return (
        <div className="p-8">
            <PageHeader sub="Pembeli" sub2="Pembeli" sub3="Edit Pembeli" />

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border p-3 rounded"
                    placeholder="Nama Pembeli"
                    required
                />

                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border p-3 rounded"
                    placeholder="Email"
                    required
                />

                <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border p-3 rounded"
                    placeholder="Phone"
                    required
                />

                <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full border p-3 rounded"
                    placeholder="Address"
                    required
                />

                <input
                    value={form.waste_type}
                    onChange={(e) => setForm({ ...form, waste_type: e.target.value })}
                    className="w-full border p-3 rounded"
                    placeholder="Jenis Sampah"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="number"
                        min="0"
                        value={form.total_orders}
                        onChange={(e) => setForm({ ...form, total_orders: e.target.value })}
                        className="border p-3 rounded"
                        placeholder="Total Transaksi"
                    />
                    <input
                        type="number"
                        min="0"
                        value={form.total_spent}
                        onChange={(e) => setForm({ ...form, total_spent: e.target.value })}
                        className="border p-3 rounded"
                        placeholder="Total Pembelian"
                    />
                </div>

                <select
                    className="w-full border p-3 rounded"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
                </select>

                <input
                    type="date"
                    className="w-full border p-3 rounded"
                    value={form.join_date}
                    onChange={(e) => setForm({ ...form, join_date: e.target.value })}
                />

                <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded">
                    Update
                </button>
            </form>
        </div>
    );
}
