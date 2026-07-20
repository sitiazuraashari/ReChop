// Ringkasan: Halaman edit pembelian sampah (singkat)
// Tujuan: src/pages/pembeliansampah/EditPembelianSampah.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import pembelianData from "../../assets/PembelianSampah.json";

const getSavedData = () => {
    try {
        const raw = localStorage.getItem("pembelianData");
        return raw ? JSON.parse(raw) : pembelianData;
    } catch {
        return pembelianData;
    }
};

// Menyediakan form untuk memperbarui transaksi pembelian sampah yang dipilih.
export default function EditPembelianSampah() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nama_pembeli: "",
        jenis_sampah: "",
        berat: 0,
        harga: 0,
        tanggal_transaksi: "",
    });
    const [pembeli, setPembeli] = useState([]);
    const [pembeliLoading, setPembeliLoading] = useState(true);

    useEffect(() => {
        const fetchPemasok = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/pemasoks");
                setPembeli(response.data);
            } catch (error) {
                console.error(error);
                alert("Gagal mengambil data pemasok");
            } finally {
                setPembeliLoading(false);
            }
        };

        fetchPemasok();
    }, []);

    useEffect(() => {
        const data = getSavedData();
        const item = data.find((entry) => entry.id === id);
        if (item) {
            setForm({
                nama_pembeli: item.nama_pembeli || "",
                jenis_sampah: item.jenis_sampah || "",
                berat: item.berat || 0,
                harga: item.harga || 0,
                tanggal_transaksi: item.tanggal_transaksi || "",
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
                      berat: Number(form.berat),
                      harga: Number(form.harga),
                  }
                : entry
        );
        localStorage.setItem("pembelianData", JSON.stringify(next));
        alert("Transaksi berhasil diperbarui");
        navigate("/pembelian-sampah");
    };

    return (
        <div className="p-8">
            <PageHeader sub="Pembelian Sampah" sub2="Transaksi" sub3="Edit Transaksi" />

            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={form.nama_pembeli}
                    onChange={(e) => setForm({ ...form, nama_pembeli: e.target.value })}
                    className="w-full border p-3 rounded"
                    required
                    disabled={pembeliLoading}
                >
                    <option value="">-- Pilih Nama Pemasok --</option>
                    {pembeli.map((item) => (
                        <option key={item.id} value={item.supplier_name}>
                            {item.supplier_name}
                        </option>
                    ))}
                </select>
                <input
                    value={form.jenis_sampah}
                    onChange={(e) => setForm({ ...form, jenis_sampah: e.target.value })}
                    className="w-full border p-3 rounded"
                    placeholder="Jenis Sampah"
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="number"
                        min="0"
                        value={form.berat}
                        onChange={(e) => setForm({ ...form, berat: e.target.value })}
                        className="border p-3 rounded"
                        placeholder="Berat (Kg)"
                        required
                    />
                    <input
                        type="number"
                        min="0"
                        value={form.harga}
                        onChange={(e) => setForm({ ...form, harga: e.target.value })}
                        className="border p-3 rounded"
                        placeholder="Harga /Kg"
                        required
                    />
                </div>
                <input
                    type="date"
                    className="w-full border p-3 rounded"
                    value={form.tanggal_transaksi}
                    onChange={(e) => setForm({ ...form, tanggal_transaksi: e.target.value })}
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded">
                    Update
                </button>
            </form>
        </div>
    );
}
