import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getReportsData } from "@/lib/dashboard/dal";
import {
  currentMonthKey,
  formatBulan,
  isValidMonth,
  rupiah,
  shiftMonth,
} from "@/lib/dashboard/format";
import { buildPieSlices, isTransactionType } from "@/lib/dashboard/summary";
import type { CategoryTotal } from "@/lib/dashboard/summary";
import { Navbar } from "@/components/duitku/Navbar";
import {
  LihatSemua,
  TransactionRow,
} from "@/components/duitku/TransactionRow";

export const metadata: Metadata = {
  title: "Laporan Keuangan | DUITku",
  description: "Grafik dan daftar transaksi per bulan milikmu.",
};

/**
 * Pie chart (DESIGN.md §3.9). Server-rendered SVG, irisan searah
 * jarum jam dari atas, urutan warna kategori tetap (§2.1).
 */
function PieChart({ items }: { items: readonly CategoryTotal[] }) {
  const slices = buildPieSlices(items);
  const cx = 90;
  const cy = 90;
  const r = 75;
  const point = (angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  if (slices.length === 0) {
    return (
      <svg
        viewBox="0 0 180 180"
        className="h-[180px] w-[180px]"
        role="img"
        aria-label="Belum ada data untuk grafik"
      >
        <circle cx={cx} cy={cy} r={r} fill="var(--color-divider)" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 180 180"
      className="h-[180px] w-[180px] drop-shadow-sm"
      role="img"
      aria-label="Grafik lingkaran transaksi per kategori"
    >
      {slices.map((s) => {
        if (s.share >= 1) {
          return (
            <circle
              key={s.category}
              cx={cx}
              cy={cy}
              r={r}
              fill={`var(--color-${s.colorToken})`}
            />
          );
        }
        const a = point(s.startAngle);
        const b = point(s.endAngle);
        const large = s.endAngle - s.startAngle > 180 ? 1 : 0;
        return (
          <path
            key={s.category}
            d={`M ${cx} ${cy} L ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y} Z`}
            fill={`var(--color-${s.colorToken})`}
          />
        );
      })}
    </svg>
  );
}

function Legend({ items }: { items: readonly CategoryTotal[] }) {
  return (
    <ul className="flex min-w-0 flex-1 flex-col gap-3">
      {items.map((item) => (
        <li
          key={item.category}
          className="flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-muted/40"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 rounded-full"
              style={{ background: `var(--color-${item.colorToken})` }}
            />
            <span className="block truncate text-sm font-semibold text-ink">
              {item.category}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="block text-sm font-bold text-ink tabular-nums">
              {rupiah(item.total, { prefix: true })}
            </span>
            <span className="block text-xs font-semibold text-subtle tabular-nums">
              {Math.round(item.share * 100)}%
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; month?: string }>;
}) {
  const params = await searchParams;
  const type = isTransactionType(params.type) ? params.type : "expense";
  const month =
    isValidMonth(params.month) && typeof params.month === "string"
      ? params.month
      : currentMonthKey();
  const data = await getReportsData(type, month);
  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);
  const monthQuery = (m: string, t: string) =>
    `/reports?month=${m}&type=${t}`;

  const isIncome = type === "income";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Tombol Back ke Beranda */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg py-1.5 text-sm font-semibold text-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Header & Controls Card */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-divider bg-surface p-6 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Laporan Keuangan
            </h1>
            <p className="mt-1 text-sm text-subtle">
              Analisis visual dan perincian kategori transaksi per bulan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Month selector */}
            <div className="flex items-center gap-1 rounded-xl border border-divider bg-surface px-2 py-1 shadow-sm">
              <Link
                href={monthQuery(prev, type)}
                aria-label={`Bulan sebelumnya, ${formatBulan(prev)}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-primary hover:bg-primary-soft transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <ChevronLeft size={18} />
              </Link>
              <span className="flex items-center gap-1.5 px-2 text-sm font-bold text-ink tabular-nums">
                <Calendar size={16} aria-hidden="true" className="text-primary" />
                {formatBulan(month)}
              </span>
              <Link
                href={monthQuery(next, type)}
                aria-label={`Bulan berikutnya, ${formatBulan(next)}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-primary hover:bg-primary-soft transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Segmented type switcher */}
            <div
              role="group"
              aria-label="Jenis transaksi"
              className="flex rounded-xl border border-divider bg-muted/30 p-1"
            >
              {(["expense", "income"] as const).map((t) => {
                const isActive = t === type;
                return (
                  <Link
                    key={t}
                    href={monthQuery(month, t)}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex min-h-9 items-center px-4 rounded-lg text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isActive
                        ? "bg-surface text-primary shadow-sm"
                        : "text-subtle hover:text-ink"
                    }`}
                  >
                    {t === "income" ? "Pemasukan" : "Pengeluaran"}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-divider bg-surface p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Total {isIncome ? "Pemasukan" : "Pengeluaran"} Bulan Ini
            </span>
            <p
              className={`mt-2 text-2xl sm:text-3xl font-extrabold tabular-nums ${
                isIncome ? "text-income-deep" : "text-expense-deep"
              }`}
            >
              {rupiah(data.total)}
            </p>
          </div>
          <div className="rounded-xl border border-divider bg-surface p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Frekuensi Transaksi
            </span>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink tabular-nums">
              {data.count} <span className="text-base font-medium text-subtle">catatan</span>
            </p>
          </div>
        </div>

        {/* Desktop 2-Column Grid: Chart (Left) & Transaction List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Chart & Legend (5 cols) */}
          <section
            aria-label="Grafik per kategori"
            className="lg:col-span-5 rounded-2xl border border-divider bg-surface p-6 shadow-sm space-y-6"
          >
            <h2 className="text-base font-bold text-ink border-b border-divider pb-3">
              Distribusi Kategori {isIncome ? "Pemasukan" : "Pengeluaran"}
            </h2>

            <div className="flex flex-col items-center justify-center pt-2">
              <PieChart items={data.byCategory} />
            </div>

            {data.byCategory.length > 0 ? (
              <Legend items={data.byCategory} />
            ) : (
              <p className="text-center text-sm text-subtle py-4">
                Belum ada data transaksi di bulan ini.
              </p>
            )}

            {/* Alternatif tabel untuk screen reader */}
            <table className="sr-only">
              <caption>
                {isIncome ? "Pemasukan" : "Pengeluaran"} per kategori, {formatBulan(month)}
              </caption>
              <tbody>
                {data.byCategory.map((item) => (
                  <tr key={item.category}>
                    <th scope="row">{item.category}</th>
                    <td>
                      {rupiah(item.total, { prefix: false })} (
                      {Math.round(item.share * 100)} persen)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Transaction list for this month (7 cols) */}
          <section
            aria-label="Daftar transaksi bulan ini"
            className="lg:col-span-7 rounded-2xl border border-divider bg-surface p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-divider pb-3">
              <div>
                <h2 className="text-base font-bold text-ink">
                  Catatan {isIncome ? "Pemasukan" : "Pengeluaran"}
                </h2>
                <p className="text-xs text-subtle">
                  Bulan {formatBulan(month)} ({data.count} transaksi)
                </p>
              </div>

              {data.items.length > 0 && <LihatSemua href="/transactions" />}
            </div>

            {data.items.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-sm font-semibold text-ink">Belum ada transaksi</p>
                <p className="mt-1 text-xs text-subtle">
                  Belum ada transaksi {isIncome ? "pemasukan" : "pengeluaran"} yang dicatat untuk periode ini.
                </p>
                <Link
                  href={`/transactions/new?type=${type}`}
                  className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  <Plus size={14} />
                  <span>Tambah Transaksi Baru</span>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-divider">
                {data.items.map((item) => (
                  <TransactionRow key={item.id} item={item} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
