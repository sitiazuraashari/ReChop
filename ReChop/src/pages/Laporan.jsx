// Ringkasan: Komponen/halaman frontend (singkat)
// Tujuan: src/pages/Laporan.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";

// Helper: ubah angka menjadi format mata uang Rupiah (contoh: Rp 1.000.000)
const formatCurrency = (value) =>
    `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

// Helper: format tanggal menjadi label hari (contoh: 12 Jul)
const getDayLabel = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    });

// Helper: format tanggal menjadi label bulan (contoh: Jul 2026)
const getMonthLabel = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
    });

// Utility: gabungkan data berdasarkan bulan dan hitung nilai agregat
// - `items`: array data dengan properti `tanggal_transaksi`
// - `valueFn`: fungsi yang mengembalikan nilai numerik untuk setiap item
const aggregateByMonth = (items, valueFn) => {
    const grouped = items.reduce((acc, item) => {
        const label = getMonthLabel(item.tanggal_transaksi);
        acc[label] = (acc[label] || 0) + valueFn(item);
        return acc;
    }, {});

    return Object.entries(grouped)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => new Date(a.label) - new Date(b.label));
};

// Utility: bangun koordinat titik untuk menggambar grafik garis
// - `data`: array {label, value}
// - `width`, `height`, `padding`: ukuran SVG
const buildLinePoints = (data, width, height, padding) => {
    const maxValue = Math.max(...data.map((item) => item.value), 1);
    const step = (width - padding * 2) / Math.max(data.length - 1, 1);

    return data.map((item, index) => {
        const x = padding + index * step;
        const y =
            height - padding -
            (item.value / maxValue) * (height - padding * 2);
        return { x, y };
    });
};

// Utility: hitung posisi dan label ticks (sumbu-y) untuk grafik
const buildTicks = (maxValue, count, height, padding) => {
    return Array.from({ length: count }, (_, index) => {
        const value = Math.round((maxValue * (count - 1 - index)) / (count - 1) / 1000) * 1000;
        return {
            value,
            y: padding + index * ((height - padding * 2) / (count - 1)),
        };
    });
};

// Menyajikan laporan nilai transaksi dan komposisi data dalam bentuk grafik.
export default function Laporan() {
    // State: kontrol pagination, data laporan, dan flag loading
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9); // opsi: 6,9,12
    const [penjualanData, setPenjualanData] = useState([]); // data penjualan mentah
    const [pembelianData, setPembelianData] = useState([]); // data pembelian mentah
    const [produkData, setProdukData] = useState([]); // data produk/stok
    const [loading, setLoading] = useState(true);

    // Effect: ambil data laporan (penjualan, pembelian, produk) sekali saat mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [penjualanRes, pembelianRes, produkRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/penjualans"),
                    axios.get("http://127.0.0.1:8000/api/pembelians"),
                    axios.get("http://127.0.0.1:8000/api/produk-pencacahans"),
                ]);

                // Normalisasi respons (bisa berupa array langsung atau objek paginasi)
                setPenjualanData(penjualanRes.data?.data ?? penjualanRes.data ?? []);
                setPembelianData(pembelianRes.data?.data ?? pembelianRes.data ?? []);
                setProdukData(produkRes.data?.data ?? produkRes.data ?? []);
            } catch (error) {
                console.error(error);
                alert("Gagal mengambil data laporan");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Compute: buat series penjualan per-bulan (untuk chart garis)
    const salesSeries = useMemo(() => {
        return aggregateByMonth(
            [...penjualanData].sort(
                (a, b) => new Date(a.tanggal_transaksi) - new Date(b.tanggal_transaksi)
            ),
            (item) => item.jumlah * item.harga
        );
    }, [penjualanData]);

    // Compute: buat series pembelian per-bulan (untuk chart garis)
    const purchaseSeries = useMemo(() => {
        return aggregateByMonth(
            [...pembelianData].sort(
                (a, b) => new Date(a.tanggal_transaksi) - new Date(b.tanggal_transaksi)
            ),
            (item) => item.berat * item.harga
        );
    }, [pembelianData]);

    // Compute: komposisi produk berdasarkan jumlah terjual
    const categorySeries = useMemo(() => {
        const map = penjualanData.reduce((acc, item) => {
            const category = item.nama_produk || "Lainnya";
            acc[category] = (acc[category] || 0) + item.jumlah;
            return acc;
        }, {});

        return Object.entries(map).map(([label, value]) => ({ label, value }));
    }, [penjualanData]);

    // Compute: ringkasan total untuk kartu informasi (pembelian, penjualan, stok)
    const totals = useMemo(
        () => ({
            pembelian: pembelianData.reduce((sum, item) => sum + item.berat * item.harga, 0),
            penjualan: penjualanData.reduce((sum, item) => sum + item.jumlah * item.harga, 0),
            stok: produkData.reduce((sum, item) => sum + item.stok, 0),
            produksi: produkData.reduce((sum, item) => sum + item.stok, 0),
        }),
        [pembelianData, penjualanData, produkData]
    );

    // Persiapan data visual (titik, ticks, donut) untuk rendering SVG chart
    const salesPoints = buildLinePoints(salesSeries, 360, 180, 28);
    const purchasePoints = buildLinePoints(purchaseSeries, 360, 180, 24);
    const salesMax = Math.max(...salesSeries.map((item) => item.value), 1);
    const purchaseMax = Math.max(...purchaseSeries.map((item) => item.value), 1);
    const salesTicks = buildTicks(salesMax, 4, 180, 24);
    const purchaseTicks = buildTicks(purchaseMax, 4, 180, 24);
    const categoryTotal = categorySeries.reduce((sum, item) => sum + item.value, 0) || 1;
    const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#e11d48"];
    const donutRadius = 62;
    const circumference = 2 * Math.PI * donutRadius;
    let offsetAccumulator = 0;

    return (
        <>
            <PageHeader sub="Laporan Bulanan" sub2="Laporan" sub3="Grafik Real Time" />

            {loading ? (
                <div className="p-8 text-center text-slate-500">
                    <p>Memuat data laporan...</p>
                </div>
            ) : (
            <div className="p-5 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row items-start md:items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Dashboard Laporan Real Time</h2>
                        <p className="text-sm text-slate-500 mt-1">Grafik untuk penjualan, pembelian, dan stok.</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        Data bulanan saat ini
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Total Pembelian</p>
                        <p className="mt-4 text-3xl font-extrabold text-emerald-600">{formatCurrency(totals.pembelian)}</p>
                        <p className="mt-3 text-sm text-slate-500">Total pembelian sampah bulan ini.</p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Total Penjualan</p>
                        <p className="mt-4 text-3xl font-extrabold text-cyan-700">{formatCurrency(totals.penjualan)}</p>
                        <p className="mt-3 text-sm text-slate-500">Total penjualan produk cacahan bulan ini.</p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Stok & Produksi</p>
                        <p className="mt-4 text-3xl font-extrabold text-orange-600">{totals.stok} Kg</p>
                        <p className="mt-3 text-sm text-slate-500">Total stok produk cacahan bulan ini.</p>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Grafik Penjualan</h3>
                                <p className="text-sm text-slate-500">Tren penjualan bulanan</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Bulanan</span>
                        </div>
                        <div className="h-[260px] overflow-hidden rounded-3xl bg-slate-50 p-4">
                            <svg viewBox="0 0 360 180" className="h-full w-full">
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <line x1="24" y1="24" x2="24" y2="156" stroke="#cbd5e1" strokeWidth="1" />
                                <line x1="24" y1="156" x2="336" y2="156" stroke="#cbd5e1" strokeWidth="1" />
                                {salesTicks.map((tick, index) => (
                                    <g key={index}>
                                        <line x1="24" y1={tick.y} x2="336" y2={tick.y} stroke="#e2e8f0" strokeWidth="1" />
                                        <text x="18" y={tick.y + 4} textAnchor="end" className="text-[10px] fill-slate-500">{formatCurrency(tick.value)}</text>
                                    </g>
                                ))}
                                <path d={salesPoints.length > 0 ? `M${salesPoints.map((point) => `${point.x} ${point.y}`).join(" L ")}` : ""} fill="none" stroke="#10B981" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                                <path d={salesPoints.length > 1 ? `M${salesPoints[0].x} ${180 - 28} L${salesPoints.map((point) => `${point.x} ${point.y}`).join(" L ")} L${salesPoints[salesPoints.length - 1].x} ${180 - 28} Z` : ""} fill="url(#salesGradient)" opacity="0.85" />

                                {salesPoints.map((point, index) => (
                                    <circle key={index} cx={point.x} cy={point.y} r="4" fill="#10B981" />
                                ))}

                                {/* render fewer x-labels to avoid overlap */}
                                {(() => {
                                    const maxLabels = 6;
                                    const interval = Math.max(1, Math.ceil(salesSeries.length / maxLabels));
                                    return salesPoints.map((point, index) => (
                                        index % interval === 0 ? (
                                            <text key={index} x={point.x} y="172" textAnchor="middle" className="text-[10px] fill-slate-500">{salesSeries[index]?.label}</text>
                                        ) : null
                                    ));
                                })()}
                            </svg>
                        </div>
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm text-slate-500">Total {salesSeries.length} data</div>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-slate-500">Per halaman</label>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
                                    >
                                        <option value={6}>6</option>
                                        <option value={9}>9</option>
                                        <option value={12}>12</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {salesSeries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, idx) => {
                                    const globalIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                                    return (
                                        <div key={item.label} className="rounded-3xl bg-slate-50 p-4 text-center relative">
                                            <span className="absolute -top-3 left-3 inline-flex items-center rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600 shadow-sm">#{globalIndex}</span>
                                            <p className="text-sm text-slate-500">{item.label}</p>
                                            <p className="mt-2 font-semibold text-slate-900">{formatCurrency(item.value)}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalItems={salesSeries.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={(p) => setCurrentPage(p)}
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Komposisi Produk</h3>
                                <p className="text-sm text-slate-500">Stok produk terjual saat ini</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Bulanan</span>
                        </div>
                                        <div className="flex flex-col xl:flex-row items-start gap-6">
                                            <div className="mx-auto">
                                                <svg viewBox="0 0 220 220" className="h-48 w-48">
                                                    <circle cx="110" cy="110" r={donutRadius} fill="transparent" stroke="#eef2f7" strokeWidth="18" />
                                                    {categorySeries.map((item, index) => {
                                                        const dash = (item.value / categoryTotal) * circumference;
                                                        const strokeOffset = offsetAccumulator;
                                                        offsetAccumulator += dash;
                                                        return (
                                                            <circle
                                                                key={item.label}
                                                                cx="110"
                                                                cy="110"
                                                                r={donutRadius}
                                                                fill="transparent"
                                                                stroke={colors[index % colors.length]}
                                                                strokeWidth="18"
                                                                strokeDasharray={`${dash} ${circumference - dash}`}
                                                                strokeDashoffset={-strokeOffset}
                                                                strokeLinecap="round"
                                                                transform="rotate(-90 110 110)"
                                                            />
                                                        );
                                                    })}
                                                    <text x="110" y="98" textAnchor="middle" className="text-2xl font-extrabold fill-slate-900">{categoryTotal}</text>
                                                    <text x="110" y="118" textAnchor="middle" className="text-[11px] fill-slate-500">Kg Total</text>
                                                </svg>
                                            </div>

                                            <div className="space-y-3 w-full max-h-[480px] overflow-auto pr-2">
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

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Pembelian vs Penjualan</h3>
                            <p className="text-sm text-slate-500">Perbandingan pembelian dan penjualan per bulan.</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Realtime</span>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="mb-3 text-sm font-medium text-slate-500">Pembelian</p>
                            <div className="h-48 overflow-hidden">
                                <svg viewBox="0 0 360 180" className="h-full w-full">
                                    <line x1="24" y1="24" x2="24" y2="156" stroke="#cbd5e1" strokeWidth="1" />
                                    <line x1="24" y1="156" x2="336" y2="156" stroke="#cbd5e1" strokeWidth="1" />
                                    {purchaseTicks.map((tick, index) => (
                                        <g key={index}>
                                            <line x1="24" y1={tick.y} x2="336" y2={tick.y} stroke="#e2e8f0" strokeWidth="1" />
                                            <text x="18" y={tick.y + 4} textAnchor="end" className="text-[10px] fill-slate-500">
                                                {formatCurrency(tick.value)}
                                            </text>
                                        </g>
                                    ))}
                                    {purchasePoints.map((point, index) => {
                                        const barHeight = ((purchaseSeries[index].value / purchaseMax) * 112) || 2;
                                        return (
                                            <g key={index}>
                                                <rect
                                                    x={point.x - 12}
                                                    y={180 - 24 - barHeight}
                                                    width="24"
                                                    height={barHeight}
                                                    rx="8"
                                                    fill="#3b82f6"
                                                />
                                                <text x={point.x} y="172" textAnchor="middle" className="text-[10px] fill-slate-500">
                                                    {purchaseSeries[index]?.label}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="mb-3 text-sm font-medium text-slate-500">Penjualan</p>
                            <div className="h-48 overflow-hidden">
                                <svg viewBox="0 0 360 180" className="h-full w-full">
                                    <path
                                        d={salesPoints.length > 0 ? `M${salesPoints.map((point) => `${point.x} ${point.y}`).join(" L ")}` : ""}
                                        fill="none"
                                        stroke="#0ea5e9"
                                        strokeWidth="4"
                                        strokeLinejoin="round"
                                    />
                                    {salesPoints.map((point, index) => (
                                        <circle key={index} cx={point.x} cy={point.y} r="3.5" fill="#0ea5e9" />
                                    ))}
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}
