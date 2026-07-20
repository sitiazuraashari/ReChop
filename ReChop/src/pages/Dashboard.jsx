// Import React Hooks dan library yang dibutuhkan
// Fungsi: halaman dashboard utama, menampilkan ringkasan metrik
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";

// Mengubah nilai angka menjadi tampilan mata uang Rupiah.
const formatCurrency = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

// Membuat label tanggal singkat untuk sumbu grafik.
const getDayLabel = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });

// Mengonversi data nilai menjadi koordinat SVG untuk grafik garis.
const buildLinePoints = (data, width, height, padding) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const step = (width - padding * 2) / Math.max(data.length - 1, 1);

  return data.map((item, index) => {
    const x = padding + index * step;
    const y = height - padding - (item.value / maxValue) * (height - padding * 2);
    return { x, y };
  });
};

// Mengonversi data nilai menjadi posisi dan tinggi batang pada grafik SVG.
const buildBarPoints = (data, width, height, padding) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const step = (width - padding * 2) / Math.max(data.length, 1);

  return data.map((item, index) => {
    const x = padding + index * step + step / 2;
    const barHeight = Math.max(8, (item.value / maxValue) * (height - padding * 2));
    return { x, barHeight, value: item.value, label: item.label };
  });
};

// Menggabungkan stok produk dengan nama yang sama untuk diagram komposisi.
const getCategorySeries = (products) => {
  const map = products.reduce((acc, item) => {
    const name = item.nama || item.nama_produk || "Lainnya";
    acc[name] = (acc[name] || 0) + (item.stok ?? item.jumlah ?? 0);
    return acc;
  }, {});

  return Object.entries(map).map(([label, value]) => ({ label, value }));
};

// Menampilkan ringkasan transaksi, stok, dan grafik operasional secara real-time.
export default function Dashboard() {
  // Menyimpan status paginasi, data dari API, dan kondisi pemuatan halaman.
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [penjualanData, setPenjualanData] = useState([]);
  const [pembelianData, setPembelianData] = useState([]);
  const [produkData, setProdukData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mengambil seluruh data ringkasan secara paralel saat halaman pertama dibuka.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [penjualanRes, pembelianRes, produkRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/penjualans"),
          axios.get("http://127.0.0.1:8000/api/pembelians"),
          axios.get("http://127.0.0.1:8000/api/produk-pencacahans"),
        ]);

        setPenjualanData(penjualanRes.data?.data ?? penjualanRes.data ?? []);
        setPembelianData(pembelianRes.data?.data ?? pembelianRes.data ?? []);
        setProdukData(produkRes.data?.data ?? produkRes.data ?? []);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Menghitung metrik utama yang ditampilkan pada kartu ringkasan.
  const totalPembelian = pembelianData.reduce((sum, item) => sum + (item.berat ?? 0) * (item.harga ?? 0), 0);
  const totalPenjualan = penjualanData.reduce((sum, item) => sum + (item.jumlah ?? 0) * (item.harga ?? 0), 0);
  const totalStok = produkData.reduce((sum, item) => sum + (item.stok ?? 0), 0);
  const totalProduk = produkData.length;

  // Menyiapkan seri data penjualan dan pembelian yang sudah diurutkan berdasarkan tanggal.
  const salesSeries = useMemo(() =>
    penjualanData
      .slice()
      .sort((a, b) => new Date(a.tanggal_transaksi) - new Date(b.tanggal_transaksi))
      .map((item) => ({ label: getDayLabel(item.tanggal_transaksi), value: (item.jumlah ?? 0) * (item.harga ?? 0) })),
    [penjualanData]
  );

  const purchaseSeries = useMemo(() =>
    pembelianData
      .slice()
      .sort((a, b) => new Date(a.tanggal_transaksi) - new Date(b.tanggal_transaksi))
      .map((item) => ({ label: getDayLabel(item.tanggal_transaksi), value: (item.berat ?? 0) * (item.harga ?? 0) })),
    [pembelianData]
  );

  // Menyiapkan data stok per produk untuk diagram donat.
  const categorySeries = useMemo(() => getCategorySeries(produkData), [produkData]);
  const categoryTotal = categorySeries.reduce((sum, item) => sum + item.value, 0) || 1;

  // Menghitung skala, titik, dan garis bantu untuk seluruh grafik SVG.
  const salesMax = Math.max(...salesSeries.map((s) => s.value), 1);
  const purchaseMax = Math.max(...purchaseSeries.map((s) => s.value), 1);
  const salesPoints = buildLinePoints(salesSeries, 340, 180, 28);
  const purchaseBars = buildBarPoints(purchaseSeries, 340, 180, 20);

  const salesTicks = Array.from({ length: 4 }, (_, index) => ({ value: Math.round((salesMax * (3 - index)) / 3 / 1000) * 1000, y: 20 + index * 40 }));
  const purchaseTicks = Array.from({ length: 4 }, (_, index) => ({ value: Math.round((purchaseMax * (3 - index)) / 3 / 1000) * 1000, y: 20 + index * 40 }));

  // Menentukan warna dan panjang setiap segmen diagram donat.
  const colors = ["#10B981", "#3b82f6", "#f59e0b", "#e11d48"];
  const donutRadius = 56;
  const circumference = 2 * Math.PI * donutRadius;
  let offsetAccumulator = 0;
  const donutData = categorySeries.map((item, index) => {
    const dash = (item.value / categoryTotal) * circumference;
    const strokeOffset = offsetAccumulator;
    offsetAccumulator += dash;
    return { ...item, dash, strokeOffset, color: colors[index % colors.length] };
  });

  return (
    <div id="dashboard-container">
      <PageHeader sub="Dashboard" sub2="Dashboard" sub3="Ringkasan" />

      {/* Menampilkan indikator selama data API belum selesai dimuat. */}
      {loading ? (
        <div className="p-8 text-center text-slate-500">
          <p>Memuat data dashboard...</p>
        </div>
      ) : (
        <>
          {/* Kartu ringkasan jumlah transaksi, produk, dan pendapatan. */}
          <div className="p-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-hijau/10 p-3 text-hijau">
                  <FaShoppingCart className="text-xl" />
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Pembelian</span>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-bold text-slate-900">{pembelianData.length}</p>
                <p className="mt-2 text-sm text-slate-500">Transaksi Pembelian</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
                  <FaTruck className="text-xl" />
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Penjualan</span>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-bold text-slate-900">{penjualanData.length}</p>
                <p className="mt-2 text-sm text-slate-500">Transaksi Penjualan</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                  <FaBan className="text-xl" />
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Produk</span>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-bold text-slate-900">{totalProduk}</p>
                <p className="mt-2 text-sm text-slate-500">Produk Cacahan</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-yellow-100 p-3 text-yellow-600">
                  <FaDollarSign className="text-xl" />
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Pendapatan</span>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalPenjualan)}</p>
                <p className="mt-2 text-sm text-slate-500">Total Penjualan</p>
              </div>
            </div>
          </div>

          {/* Grafik tren penjualan beserta komposisi stok produk. */}
          <div className="grid gap-6 xl:grid-cols-2 mt-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Grafik Penjualan</h3>
                  <p className="text-sm text-slate-500">Tren penjualan harian</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Live</span>
              </div>

              <div className="h-[220px] overflow-hidden rounded-3xl bg-slate-50 p-4">
                <svg viewBox="0 0 340 180" className="h-full w-full">
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <line x1="20" y1="20" x2="20" y2="160" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="20" y1="160" x2="320" y2="160" stroke="#cbd5e1" strokeWidth="1" />

                  {salesTicks.map((tick, index) => (
                    <g key={index}>
                      <line x1="20" y1={tick.y} x2="320" y2={tick.y} stroke="#e2e8f0" strokeWidth="1" />
                      <text x="12" y={tick.y + 4} textAnchor="end" className="text-[10px] fill-slate-500">{formatCurrency(tick.value)}</text>
                    </g>
                  ))}

                  <path d={salesPoints.length > 0 ? `M${salesPoints.map((point) => `${point.x} ${point.y}`).join(" L ")}` : ""} fill="none" stroke="#10B981" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                  <path d={salesPoints.length > 1 ? `M${salesPoints[0].x} ${160} L${salesPoints.map((point) => `${point.x} ${point.y}`).join(" L ")} L${salesPoints[salesPoints.length - 1].x} ${160} Z` : ""} fill="url(#salesGradient)" opacity="0.85" />

                  {salesPoints.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="4" fill="#10B981" />)}

                  {(() => {
                    const maxLabels = 6;
                    const interval = Math.max(1, Math.ceil(salesSeries.length / maxLabels));
                    return salesPoints.map((point, index) => (
                      index % interval === 0 ? (
                        <text key={index} x={point.x} y="175" textAnchor="middle" className="text-[10px] fill-slate-500">{salesSeries[index]?.label}</text>
                      ) : null
                    ));
                  })()}
                </svg>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-slate-500">Total {salesSeries.length} data</div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-500">Per halaman</label>
                    <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700">
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {salesSeries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, idx) => (
                    <div key={item.label} className="rounded-3xl bg-slate-50 p-4 text-center flex flex-col justify-center min-h-[84px] relative">
                      <span className="absolute -top-3 left-3 inline-flex items-center rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600 shadow-sm">#{(currentPage - 1) * itemsPerPage + idx + 1}</span>
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-2 font-semibold text-slate-900">{formatCurrency(item.value)}</p>
                    </div>
                  ))}
                </div>

                <Pagination currentPage={currentPage} totalItems={salesSeries.length} itemsPerPage={itemsPerPage} onPageChange={(p) => setCurrentPage(p)} />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Komposisi Produk</h3>
                  <p className="text-sm text-slate-500">Stok produk terjual saat ini</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Live</span>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="w-full flex justify-center">
                  <svg viewBox="0 0 280 280" className="h-72 w-72">
                    <circle cx="140" cy="140" r={donutRadius + 16} fill="transparent" stroke="#eef2f7" strokeWidth="22" />
                    {donutData.map((item, index) => (
                      <circle key={item.label} cx="140" cy="140" r={donutRadius + 16} fill="transparent" stroke={colors[index % colors.length]} strokeWidth="22" strokeDasharray={`${item.dash} ${circumference - item.dash}`} strokeDashoffset={-item.strokeOffset} strokeLinecap="round" transform="rotate(-90 140 140)" />
                    ))}

                    <text x="140" y="128" textAnchor="middle" className="text-3xl font-extrabold fill-slate-900">{categoryTotal}</text>
                    <text x="140" y="150" textAnchor="middle" className="text-sm fill-slate-500">Kg Total</text>
                  </svg>
                </div>

                <div className="w-full space-y-3 max-h-[340px] overflow-auto pt-2">
                  {categorySeries.map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                        <div>
                          <p className="font-semibold text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-400">{((item.value / categoryTotal) * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{item.value} Kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Perbandingan nilai pembelian dan grafik penjualan tambahan. */}
          <div className="grid gap-6 xl:grid-cols-2 mt-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Pembelian</h3>
                  <p className="text-sm text-slate-500">Perbandingan nilai pembelian per transaksi</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Realtime</span>
              </div>
              <div className="h-[220px] overflow-hidden rounded-3xl bg-slate-50 p-4">
                <svg viewBox="0 0 360 180" className="h-full w-full">
                  <line x1="24" y1="24" x2="24" y2="156" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="24" y1="156" x2="336" y2="156" stroke="#cbd5e1" strokeWidth="1" />
                  {purchaseTicks.map((tick, index) => (
                    <g key={index}>
                      <line x1="24" y1={tick.y} x2="336" y2={tick.y} stroke="#e2e8f0" strokeWidth="1" />
                      <text x="18" y={tick.y + 4} textAnchor="end" className="text-[10px] fill-slate-500">{formatCurrency(tick.value)}</text>
                    </g>
                  ))}

                  {purchaseBars.map((point, index) => (
                    <g key={index}>
                      <rect x={point.x - 12} y={180 - 24 - point.barHeight} width="24" height={point.barHeight} rx="8" fill="#3b82f6" />
                      <text x={point.x} y="172" textAnchor="middle" className="text-[10px] fill-slate-500">{point.label}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Penjualan</h3>
                  <p className="text-sm text-slate-500">Tren nilai penjualan bulanan</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Realtime</span>
              </div>
              <div className="h-[220px] overflow-hidden rounded-3xl bg-slate-50 p-4">
                <svg viewBox="0 0 360 180" className="h-full w-full">
                  <path d={salesPoints.length > 0 ? `M${salesPoints.map((point) => `${point.x} ${point.y}`).join(" L ")}` : ""} fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinejoin="round" />
                  {salesPoints.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3.5" fill="#0ea5e9" />)}
                </svg>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
