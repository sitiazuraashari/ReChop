// Ringkasan: Halaman tambah produk pencacahan (singkat)
// Tujuan: src/pages/produkPencacahan/TambahProdukPencacahan.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import PageHeader from "../../components/PageHeader";

// Menyediakan form untuk mencatat produk hasil proses pencacahan.
export default function TambahProdukPencacahan() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nama: "",
        jenis: "",
        stok: "",
        harga: "",
        gambar: null,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setForm((prev) => ({
            ...prev,
            gambar: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("nama", form.nama);
            formData.append("jenis", form.jenis);
            formData.append("stok", form.stok);
            formData.append("harga", form.harga);

            if (form.gambar) {
                formData.append("gambar", form.gambar);
            }

            await axios.post(
                "http://127.0.0.1:8000/api/produk-pencacahans",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Produk berhasil ditambahkan");

            navigate("/produk-cacah");
        } catch (error) {
            console.error(error);

            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0][0];

                alert(firstError);
            } else {
                alert("Gagal menyimpan data");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <PageHeader
                sub="Produk Hasil Pencacahan"
                sub2="Produksi"
                sub3="Tambah Produk"
            />

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl bg-white p-6 shadow"
            >
                <input
                    type="text"
                    name="nama"
                    placeholder="Nama Produk"
                    className="w-full rounded border p-3"
                    value={form.nama}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="jenis"
                    placeholder="Jenis Produk"
                    className="w-full rounded border p-3"
                    value={form.jenis}
                    onChange={handleChange}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="stok"
                        placeholder="Stok"
                        className="rounded border p-3"
                        value={form.stok}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="harga"
                        placeholder="Harga"
                        className="rounded border p-3"
                        value={form.harga}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block font-semibold">
                        Gambar Produk
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full rounded border p-3"
                    />
                </div>

                {form.gambar && (
                    <div>
                        <p className="mb-2 text-sm text-gray-500">
                            Preview Gambar
                        </p>

                        <img
                            src={URL.createObjectURL(form.gambar)}
                            alt="Preview"
                            className="h-60 w-60 rounded-lg border object-cover"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                >
                    {loading ? "Menyimpan..." : "Simpan Produk"}
                </button>
            </form>
        </div>
    );
}
