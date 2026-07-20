import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/PageHeader";

const today = new Date().toISOString().slice(0, 10);

// Menyediakan form untuk menambahkan profil pembeli baru.
export default function TambahPembeli() {
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
        join_date: today,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/pembelis",
                {
                    ...form,
                    total_orders: Number(form.total_orders),
                    total_spent: Number(form.total_spent),
                }
            );

            alert("Pembeli berhasil ditambahkan");
            navigate("/pembeli");
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal menyimpan data pembeli");
        }
    };

    return (
        <div className="p-8">
            <PageHeader
                sub="Pembeli"
                sub2="Pembeli"
                sub3="Tambah Pembeli"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    value={form.name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value,
                        })
                    }
                    className="w-full border p-3 rounded"
                    placeholder="Nama Pembeli"
                    required
                />

                <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }
                    className="w-full border p-3 rounded"
                    placeholder="Email"
                    required
                />

                <input
                    value={form.phone}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            phone: e.target.value,
                        })
                    }
                    className="w-full border p-3 rounded"
                    placeholder="Phone"
                    required
                />

                <input
                    value={form.address}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            address: e.target.value,
                        })
                    }
                    className="w-full border p-3 rounded"
                    placeholder="Address"
                    required
                />

                <input
                    value={form.waste_type}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            waste_type: e.target.value,
                        })
                    }
                    className="w-full border p-3 rounded"
                    placeholder="Jenis Sampah"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="number"
                        min="0"
                        value={form.total_orders}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                total_orders: e.target.value,
                            })
                        }
                        className="border p-3 rounded"
                        placeholder="Total Transaksi"
                    />

                    <input
                        type="number"
                        min="0"
                        value={form.total_spent}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                total_spent: e.target.value,
                            })
                        }
                        className="border p-3 rounded"
                        placeholder="Total Pembelian"
                    />
                </div>

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
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
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
