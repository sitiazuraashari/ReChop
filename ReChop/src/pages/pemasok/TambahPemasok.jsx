// Ringkasan: Halaman tambah pemasok (singkat)
// Tujuan: src/pages/pemasok/TambahPemasok.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const today = new Date().toISOString().slice(0, 10);

// Menyediakan form untuk menambahkan data pemasok sampah baru.
export default function TambahPemasok() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        supplier_name: "",
        email: "",
        phone: "",
        waste_type: "",
        total_pickup: 0,
        city: "",
        status: "Active",
        join_date: today,
        last_pickup: today,
        payment_method: "Transfer Bank",
        address: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/pemasoks",
                {
                    ...form,
                    waste_type: form.waste_type
                        .split(",")
                        .map((value) => value.trim())
                        .filter(Boolean),
                    total_pickup: Number(form.total_pickup),
                }
            );

            alert("Data berhasil disimpan");
            navigate("/pemasok");
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal menyimpan data");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">
                Tambah Pemasok
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    placeholder="Nama Supplier"
                    className="w-full border p-3 rounded"
                    value={form.supplier_name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            supplier_name: e.target.value,
                        })
                    }
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }
                />

                <input
                    type="tel"
                    placeholder="Phone"
                    className="w-full border p-3 rounded"
                    value={form.phone}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            phone: e.target.value,
                        })
                    }
                />

                <input
                    placeholder="Kota"
                    className="w-full border p-3 rounded"
                    value={form.city}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            city: e.target.value,
                        })
                    }
                />

                <input
                    placeholder="Jenis Sampah (pisahkan dengan koma)"
                    className="w-full border p-3 rounded"
                    value={form.waste_type}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            waste_type: e.target.value,
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Total Pickup"
                    className="w-full border p-3 rounded"
                    value={form.total_pickup}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            total_pickup: e.target.value,
                        })
                    }
                />

                <select
                    className="w-full border p-3 rounded"
                    value={form.status}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            status: e.target.value,
                        })
                    }
                >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                </select>

                <input
                    type="date"
                    className="w-full border p-3 rounded"
                    value={form.join_date}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            join_date: e.target.value,
                        })
                    }
                />

                <input
                    type="date"
                    className="w-full border p-3 rounded"
                    value={form.last_pickup}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            last_pickup: e.target.value,
                        })
                    }
                />

                <select
                    className="w-full border p-3 rounded"
                    value={form.payment_method}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            payment_method: e.target.value,
                        })
                    }
                >
                    <option value="Transfer Bank">
                        Transfer Bank
                    </option>
                    <option value="BCA Virtual Account">
                        BCA Virtual Account
                    </option>
                    <option value="OVO">OVO</option>
                    <option value="DANA">DANA</option>
                    <option value="GoPay">GoPay</option>
                    <option value="ShopeePay">ShopeePay</option>
                </select>

                <textarea
                    placeholder="Address"
                    className="w-full border p-3 rounded"
                    value={form.address}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            address: e.target.value,
                        })
                    }
                />

                <button
                    type="submit"
                    className="bg-hijau text-white px-6 py-3 rounded"
                >
                    Simpan
                </button>
            </form>
        </div>
    );
}
