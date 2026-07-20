// Ringkasan: Halaman tambah pembelian sampah (singkat)
// Tujuan: src/pages/pembeliansampah/TambahPembelianSampah.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import PageHeader from "../../components/PageHeader";

const today = new Date().toISOString().slice(0, 10);

// Menyediakan form pencatatan transaksi pembelian sampah dari pemasok.
export default function TambahPembelianSampah() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nama_pembeli: "",
        jenis_sampah: "",
        berat: "",
        harga: "",
        tanggal_transaksi: today,
    });

    const [pembeli, setPembeli] = useState([]);
    const [loading, setLoading] = useState(false);
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/pembelians",
                {
                    nama_pembeli: form.nama_pembeli,
                    jenis_sampah: form.jenis_sampah,
                    berat: Number(form.berat),
                    harga: Number(form.harga),
                    tanggal_transaksi: form.tanggal_transaksi,
                }
            );

            console.log(response.data);

            alert("Transaksi pembelian berhasil ditambahkan");

            navigate("/pembelian-sampah");
        } catch (error) {
            console.error(error);

            if (error.response?.status === 422) {
                const errors = error.response.data.errors;

                const firstError = Object.values(errors)[0][0];

                alert(firstError);
            } else {
                alert(
                    error.response?.data?.message ||
                        "Terjadi kesalahan saat menyimpan data"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <PageHeader
                sub="Pembelian Sampah"
                sub2="Transaksi"
                sub3="Tambah Transaksi"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    name="nama_pembeli"
                    value={form.nama_pembeli}
                    onChange={handleChange}
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
                    type="text"
                    name="jenis_sampah"
                    value={form.jenis_sampah}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    placeholder="Jenis Sampah"
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="berat"
                        min="0"
                        step="0.01"
                        value={form.berat}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        placeholder="Berat (Kg)"
                        required
                    />

                    <input
                        type="number"
                        name="harga"
                        min="0"
                        step="0.01"
                        value={form.harga}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        placeholder="Harga /Kg"
                        required
                    />
                </div>

                <input
                    type="date"
                    name="tanggal_transaksi"
                    value={form.tanggal_transaksi}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 rounded text-white ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-hijau hover:opacity-90"
                    }`}
                >
                    {loading ? "Menyimpan..." : "Simpan"}
                </button>
            </form>
        </div>
    );
}
