// Import ikon dan props
// Fungsi: header halaman yang menampilkan breadcrumb dan judul
import { HiOutlineChevronRight } from "react-icons/hi";

// Menampilkan judul halaman dan breadcrumb yang diterima melalui props.
export default function PageHeader({ sub, sub2, sub3 }) {
  return (
    <section
      id="pageheader-container"
      className="mt-6 flex flex-col gap-4 rounded-lg border border-slate-200/80 bg-white/92 px-5 py-5 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between md:px-6"
    >
      <div id="pageheader-left" className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400">
          <span>{sub2}</span>
          <HiOutlineChevronRight className="text-xs" />
          <span className="text-hijau">{sub3}</span>
        </div>

        <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-4xl">
          {sub}
        </h1>
      </div>

      <div className="h-1.5 w-28 rounded-full bg-hijau md:mb-2" />
    </section>
  );
}
