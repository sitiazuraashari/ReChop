// Ringkasan: Halaman tambah penjualan sampah (singkat)
// Tujuan: src/pages/Penjualan-sampah/TambahPenjualanSampah.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/PageHeader";

const today = new Date().toISOString().split("T")[0];

// Menyediakan form pencatatan transaksi penjualan produk/sampah.
export default function TambahPenjualanSampah() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(true);
    const [pembeli, setPembeli] = useState([]);
    const [pembeliLoading, setPembeliLoading] = useState(true);

    const [form, setForm] = useState({
        pembeli_id: "",
        nama_produk: "",
        jumlah: "",
        harga: "",
        metode_pembayaran: "Transfer Bank",
        tanggal_transaksi: today,
    });

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
            await axios.post(
                "http://127.0.0.1:8000/api/penjualans",
                {
                    pembeli_id: Number(form.pembeli_id),
                    nama_produk: form.nama_produk,
                    jumlah: Number(form.jumlah),
                    harga: Number(form.harga),
                    metode_pembayaran: form.metode_pembayaran,
                    tanggal_transaksi: form.tanggal_transaksi,
                }
            );

            alert("Data penjualan berhasil ditambahkan");

            navigate("/penjualan-sampah");
        } catch (error) {
            console.error(error);

            if (error.response?.data?.errors) {
                console.log(error.response.data.errors);
                alert(Object.values(error.response.data.errors)[0][0]);
            } else {
                alert(error.response?.data?.message || "Gagal menyimpan data penjualan");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <PageHeader
                sub="Penjualan Sampah"
                sub2="Transaksi"
                sub3="Tambah Penjualan"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    name="pembeli_id"
                    value={form.pembeli_id}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                    disabled={pembeliLoading}
                >
                    <option value="">-- Pilih Nama Pembeli --</option>
                    {pembeli.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <select
                    name="nama_produk"
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
                        name="jumlah"
                        min="0"
                        value={form.jumlah}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        placeholder="Jumlah (Kg)"
                        required
                    />

                    <input
                        type="number"
                        name="harga"
                        min="0"
                        value={form.harga}
                        className="border p-3 rounded bg-gray-100"
                        placeholder="Harga /Kg"
                        readOnly
                        required
                    />
                </div>

                <select
                    name="metode_pembayaran"
                    value={form.metode_pembayaran}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                >
                    <option value="Transfer Bank">
                        Transfer Bank
                    </option>
                    <option value="Cash">
                        Cash
                    </option>
                    <option value="QRIS">
                        QRIS
                    </option>
                    <option value="E-Wallet">
                        E-Wallet
                    </option>
                </select>

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
                    className="bg-hijau text-white px-6 py-3 rounded disabled:opacity-50"
                >
                    {loading ? "Menyimpan..." : "Simpan"}
                </button>
            </form>
        </div>
    );
}
