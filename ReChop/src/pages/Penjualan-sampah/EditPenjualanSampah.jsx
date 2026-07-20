// Ringkasan: Halaman edit penjualan sampah (singkat)
// Tujuan: src/pages/Penjualan-sampah/EditPenjualanSampah.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import penjualanData from "../../assets/PenjualanSampah.json";
import axios from "axios";

const getSavedData = () => {
    try {
        const raw = localStorage.getItem("penjualanData");
        return raw ? JSON.parse(raw) : penjualanData;
    } catch {
        return penjualanData;
    }
};

// Memuat transaksi penjualan yang dipilih untuk diperbarui melalui form.
export default function EditPenjualanSampah() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(true);
    const [pembeli, setPembeli] = useState([]);
    const [pembeliLoading, setPembeliLoading] = useState(true);
    const [form, setForm] = useState({
        nama_pembeli: "",
        nama_produk: "",
        jumlah: 0,
        harga: 0,
        metode_pembayaran: "Transfer Bank",
        tanggal_transaksi: "",
    });

    useEffect(() => {
        const data = getSavedData();
        const item = data.find((entry) => entry.id === id);
        if (item) {
            setForm({
                nama_pembeli: item.nama_pembeli || "",
                nama_produk: item.nama_produk || "",
                jumlah: item.jumlah || 0,
                harga: item.harga || 0,
                metode_pembayaran: item.metode_pembayaran || "Transfer Bank",
                tanggal_transaksi: item.tanggal_transaksi || "",
            });
        }
    }, [id]);

    useEffect(() => {
        fetchProducts();
        fetchPembeli();
    }, []);

    const fetchPembeli = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/pembelis"
            );
            setPembeli(response.data);
        } catch (error) {
            console.error(error);
            alert("Gagal mengambil data pembeli");
        } finally {
            setPembeliLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/produk-pencacahans"
            );
            setProducts(response.data);
        } catch (error) {
            console.error(error);
            alert("Gagal mengambil data produk");
        } finally {
            setProductLoading(false);
        }
    };

    const handleProductChange = (e) => {
        const selectedName = e.target.value;
        const selectedProduct = products.find(
            (product) => product.nama === selectedName
        );

        setForm((prev) => ({
            ...prev,
            nama_produk: selectedName,
            harga: selectedProduct ? selectedProduct.harga : "",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = getSavedData();
        const next = data.map((entry) =>
            entry.id === id
                ? {
                      ...entry,
                      ...form,
                      jumlah: Number(form.jumlah),
                      harga: Number(form.harga),
                  }
                : entry
        );
        localStorage.setItem("penjualanData", JSON.stringify(next));
        alert("Data penjualan berhasil diperbarui");
        navigate("/penjualan-sampah");
    };

    return (
        <div className="p-8">
            <PageHeader sub="Penjualan Sampah" sub2="Transaksi" sub3="Edit Penjualan" />

            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={form.nama_pembeli}
                    onChange={(e) => setForm({ ...form, nama_pembeli: e.target.value })}
                    className="w-full border p-3 rounded"
                    required
                    disabled={pembeliLoading}
                >
                    <option value="">-- Pilih Nama Pembeli --</option>
                    {pembeli.map((item) => (
                        <option key={item.id} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <select
                    value={form.nama_produk}
                    onChange={handleProductChange}
                    className="w-full border p-3 rounded"
                    disabled={productLoading}
                    required
                >
                    <option value="">
                        {productLoading ? "Memuat produk..." : "Pilih Produk"}
                    </option>
                    {products.map((product) => (
                        <option key={product.id} value={product.nama}>
                            {product.nama}
                        </option>
                    ))}
                </select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="number"
                        min="0"
                        value={form.jumlah}
                        onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                        className="border p-3 rounded"
                        placeholder="Jumlah (Kg)"
                        required
                    />
                    <input
                        type="number"
                        min="0"
                        value={form.harga}
                        className="border p-3 rounded bg-gray-100"
                        placeholder="Harga /Kg"
                        readOnly
                        required
                    />
                </div>
                <select
                    className="w-full border p-3 rounded"
                    value={form.metode_pembayaran}
                    onChange={(e) => setForm({ ...form, metode_pembayaran: e.target.value })}
                >
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="Cash">Cash</option>
                    <option value="QRIS">QRIS</option>
                    <option value="E-Wallet">E-Wallet</option>
                </select>
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
