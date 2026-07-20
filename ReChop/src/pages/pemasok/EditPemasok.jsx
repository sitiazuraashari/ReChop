// Ringkasan: Halaman edit pemasok (singkat)
// Tujuan: src/pages/pemasok/EditPemasok.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Memuat data pemasok terpilih dan menyediakan form untuk memperbaruinya.
export default function EditPemasok() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        supplier_name: "",
        email: "",
        phone: "",
        waste_type: "",
        total_pickup: 0,
        city: "",
        status: "Active",
        join_date: "",
        last_pickup: "",
        payment_method: "Transfer Bank",
        address: "",
    });

    useEffect(() => {
        const data =
            JSON.parse(localStorage.getItem("pemasok")) || [];

        const supplier = data.find((item) => item.id === id);

        if (supplier) {
            setForm({
                ...supplier,
                waste_type: Array.isArray(supplier.waste_type)
                    ? supplier.waste_type.join(", ")
                    : supplier.waste_type || "",
            });
        }
    }, [id]);

    const handleUpdate = (e) => {
        e.preventDefault();

        const data =
            JSON.parse(localStorage.getItem("pemasok")) || [];

        const updatedData = data.map((item) =>
            item.id === id
                ? {
                      ...form,
                      waste_type: form.waste_type
                          .split(",")
                          .map((value) => value.trim())
                          .filter(Boolean),
                      total_pickup: Number(form.total_pickup),
                  }
                : item
        );

        localStorage.setItem(
            "pemasok",
            JSON.stringify(updatedData)
        );

        navigate("/pemasok");
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">
                Edit Pemasok
            </h1>

            <form onSubmit={handleUpdate} className="space-y-4">
                <input
                    value={form.supplier_name}
                    placeholder="Nama Supplier"
                    className="w-full border p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            supplier_name: e.target.value,
                        })
                    }
                />

                <input
                    type="email"
                    value={form.email}
                    placeholder="Email"
                    className="w-full border p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }
                />

                <input
                    type="tel"
                    value={form.phone}
                    placeholder="Phone"
                    className="w-full border p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            phone: e.target.value,
                        })
                    }
                />

                <input
                    value={form.city}
                    placeholder="Kota"
                    className="w-full border p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            city: e.target.value,
                        })
                    }
                />

                <input
                    value={form.waste_type}
                    placeholder="Jenis Sampah (pisahkan dengan koma)"
                    className="w-full border p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            waste_type: e.target.value,
                        })
                    }
                />

                <input
                    type="number"
                    value={form.total_pickup}
                    placeholder="Total Pickup"
                    className="w-full border p-3 rounded"
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
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="BCA Virtual Account">BCA Virtual Account</option>
                    <option value="OVO">OVO</option>
                    <option value="DANA">DANA</option>
                    <option value="GoPay">GoPay</option>
                    <option value="ShopeePay">ShopeePay</option>
                </select>

                <textarea
                    value={form.address}
                    placeholder="Address"
                    className="w-full border p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            address: e.target.value,
                        })
                    }
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded"
                >
                    Update
                </button>
            </form>
        </div>
    );
}
