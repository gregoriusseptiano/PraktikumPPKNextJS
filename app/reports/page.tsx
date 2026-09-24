import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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
import { BottomNav } from "@/components/duitku/BottomNav";
import {
  LihatSemua,
  TransactionRow,
} from "@/components/duitku/TransactionRow";

export const metadata: Metadata = {
  title: "Laporan Keuangan | DUITku",
  description: "Grafik dan daftar transaksi per bulan milikmu.",
};

/**
 * Pie chart 150px (DESIGN.md §3.9). Server-rendered SVG, irisan searah
 * jarum jam dari atas, urutan warna kategori tetap (§2.1).
 */
function PieChart({ items }: { items: readonly CategoryTotal[] }) {
  const slices = buildPieSlices(items);
  const cx = 80;
  const cy = 80;
  const r = 70;
  const point = (angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  if (slices.length === 0) {
    return (
      <svg
        viewBox="0 0 160 160"
        className="h-[150px] w-[150px]"
        role="img"
        aria-label="Belum ada data untuk grafik"
      >
        <circle cx={cx} cy={cy} r={r} fill="var(--color-divider)" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 160 160"
      className="h-[150px] w-[150px]"
      role="img"
      aria-label="Grafik lingkaran pengeluaran per kategori"
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
    <ul className="flex min-w-0 flex-1 flex-col gap-3.5">
      {items.map((item) => (
        <li key={item.category} className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ background: `var(--color-${item.colorToken})` }}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-ink">
              {item.category}
            </span>
            <span className="block text-[11px] text-subtle tabular-nums">
              {rupiah(item.total, { prefix: false })} (
              {Math.round(item.share * 100)}%)
            </span>
          </span>
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

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-background">
      {/* Header biru: judul + segmented (DESIGN.md §4.4, §3.8). */}
      <header className="bg-header px-5 pt-6 pb-12 text-on-header">
        <h1 className="text-lg font-bold">Laporan Keuangan</h1>
        <div
          role="group"
          aria-label="Jenis transaksi"
          className="mt-3 flex h-11 rounded-md border border-on-header/60 p-1"
        >
          {(["income", "expense"] as const).map((t) => {
            const isActive = t === type;
            return (
              <Link
                key={t}
                href={monthQuery(month, t)}
                aria-current={isActive ? "true" : undefined}
                className={`flex flex-1 items-center justify-center rounded text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isActive
                    ? "bg-surface text-header"
                    : "text-on-header"
                }`}
              >
                {t === "income" ? "Pemasukan" : "Pengeluaran"}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Date picker bulan di perbatasan header dan area abu-abu (§3.7). */}
      <div className="mx-[18px] -mt-6 flex justify-center">
        <div className="flex items-center gap-1 rounded bg-surface px-2 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <Link
            href={monthQuery(prev, type)}
            aria-label={`Bulan sebelumnya, ${formatBulan(prev)}`}
            className="flex min-h-11 min-w-11 items-center justify-center rounded text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronLeft size={20} />
          </Link>
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink tabular-nums">
            <Calendar size={16} aria-hidden="true" className="text-primary" />
            {formatBulan(month)}
          </span>
          <Link
            href={monthQuery(next, type)}
            aria-label={`Bulan berikutnya, ${formatBulan(next)}`}
            className="flex min-h-11 min-w-11 items-center justify-center rounded text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      {/* Area abu-abu: pie + legend (§3.9, §4.4). */}
      <section
        aria-label="Grafik per kategori"
        className="mx-[18px] mt-3 flex items-center gap-4 rounded-md bg-muted px-4 py-5"
      >
        <PieChart items={data.byCategory} />
        {data.byCategory.length > 0 ? (
          <Legend items={data.byCategory} />
        ) : (
          <p className="text-sm text-subtle">Belum ada data bulan ini.</p>
        )}
        {/*
         * Alternatif tabel untuk screen reader: info chart tidak
         * bergantung pada warna saja (§8).
         */}
        <table className="sr-only">
          <caption>
            {type === "income" ? "Pemasukan" : "Pengeluaran"} per kategori,{" "}
            {formatBulan(month)}
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

      {/* Sheet putih: transaksi bulan berjalan. */}
      <section
        aria-label="Transaksi"
        className="mt-4 flex-1 rounded-t-[32px] bg-surface px-[18px] pt-5 pb-4"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold text-ink">
            Transaksi{" "}
            <span className="text-[13px] font-medium text-subtle tabular-nums">
              {data.count} catatan
            </span>
          </h2>
          {data.items.length > 0 && <LihatSemua href="/transactions" />}
        </div>
        {data.items.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-subtle">
              Belum ada transaksi bulan ini
            </p>
            <Link
              href="/transactions"
              className="mt-3 inline-flex min-h-11 items-center rounded-md bg-header px-5 text-sm font-semibold text-on-header focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Tambah transaksi
            </Link>
          </div>
        ) : (
          <ul>
            {data.items.map((item) => (
              <TransactionRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>

      <BottomNav active="laporan" />
    </div>
  );
}
