// Ringkasan: Halaman edit produk pencacahan (singkat)
// Tujuan: src/pages/produkPencacahan/EditProdukPencacahan.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import produkData from "../../assets/ProdukPencacahan.json";

const getSavedData = () => {
    try {
        const raw = localStorage.getItem("produkData");
        return raw ? JSON.parse(raw) : produkData;
    } catch {
        return produkData;
    }
};

// Memuat detail produk cacahan untuk diperbarui melalui form edit.
export default function EditProdukPencacahan() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nama: "",
        jenis: "",
        stok: 0,
        harga: 0,
        imageUrl: "",
        imageFile: null,
    });

    useEffect(() => {
        const data = getSavedData();
        const item = data.find((entry) => entry.id === id);
        if (item) {
            setForm({
                nama: item.nama || "",
                jenis: item.jenis || "",
                stok: item.stok || 0,
                harga: item.harga || 0,
                imageUrl: item.gambar || "",
                imageFile: null,
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
                      gambar: form.imageUrl || entry.gambar,
                      stok: Number(form.stok),
                      harga: Number(form.harga),
                  }
                : entry
        );
        localStorage.setItem("produkData", JSON.stringify(next));
        alert("Produk berhasil diperbarui");
        navigate("/produk-cacah");
    };

    return (
        <div className="p-8">
            <PageHeader sub="Produk Hasil Pencacahan" sub2="Produksi" sub3="Edit Produk" />

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full border p-3 rounded"
                    placeholder="Nama Produk"
                    required
                />
                <input
                    value={form.jenis}
                    onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                    className="w-full border p-3 rounded"
                    placeholder="Jenis Produk"
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="number"
                        min="0"
                        value={form.stok}
                        onChange={(e) => setForm({ ...form, stok: e.target.value })}
                        className="border p-3 rounded"
                        placeholder="Stok"
                        required
                    />
                    <input
                        type="number"
                        min="0"
                        value={form.harga}
                        onChange={(e) => setForm({ ...form, harga: e.target.value })}
                        className="border p-3 rounded"
                        placeholder="Harga"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Gambar (opsional)
                    </label>

                    <input
                        type="url"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                imageUrl: e.target.value,
                            }))
                        }
                        className="w-full border p-3 rounded"
                        placeholder="Tempel URL gambar (opsional)"
                    />

                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-gray-600"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setForm((prev) => ({
                                    ...prev,
                                    imageFile: file,
                                }));
                            }}
                        />
                    </div>

                    {(form.imageFile || form.imageUrl) && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-2">Preview</p>
                            <img
                                className="w-full max-w-md rounded-lg border bg-white"
                                src={
                                    form.imageFile
                                        ? URL.createObjectURL(form.imageFile)
                                        : form.imageUrl
                                }
                                alt="preview"
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded">
                    Update
                </button>
            </form>
        </div>
    );
}
