import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard/dal";
import type { RecentTransaction } from "@/lib/dashboard/types";

export const metadata: Metadata = {
  title: "Dashboard | DUITku",
  description: "Ringkasan keuangan: saldo, pemasukan, dan pengeluaran.",
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatRupiah(amount: number): string {
  return rupiah.format(amount);
}

function formatTanggal(isoDate: string): string {
  if (!isoDate) return "-";
  const parsed = new Date(isoDate + (isoDate.length === 10 ? "T00:00:00" : ""));
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function RecentRow({ item }: { item: RecentTransaction }) {
  const isIncome = item.type === "income";
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-ink/10 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="truncate text-[15px] font-medium text-ink">
          {item.category || "Tanpa kategori"}
        </p>
        <p className="truncate text-sm text-ink/60">
          {item.description || formatTanggal(item.transactionDate)}
          {item.description
            ? `, ${formatTanggal(item.transactionDate)}`
            : ""}
        </p>
      </div>
      <p
        className={`shrink-0 text-[15px] font-semibold tabular-nums ${
          isIncome ? "text-duit" : "text-expense"
        }`}
      >
        {isIncome ? "+" : "-"}
        {formatRupiah(item.amount)}
      </p>
    </li>
  );
}

/**
 * Dashboard (Modul E, SRS P3-01..P3-07; visual DESIGN.md §6.2).
 * Server Component: data selalu segar tiap request sehingga ringkasan
 * mengikuti CRUD transaksi (P3-07). Tanpa session valid, DAL
 * redirect ke /login (integrasi Auth, P3-15).
 */
export default async function DashboardPage() {
  const { summary, recent } = await getDashboardData();
  const isZero = recent.length === 0;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 bg-paper px-5 py-8 text-ink">
      <header>
        <p className="text-sm font-semibold tracking-tight text-ink/60">
          DUITku
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-[15px] text-ink/60">
          Ringkasan keuanganmu, khusus milikmu.
        </p>
      </header>

      {/* Hero saldo: satu-satunya penekanan aksen per layar (DESIGN.md §3). */}
      <section
        aria-label="Saldo"
        className="rounded-[10px] bg-duit/10 px-5 py-6 shadow-[0_1px_2px_rgba(28,27,23,0.08)]"
      >
        <p className="text-[15px] text-ink/60">Saldo bulan ini</p>
        <p className="mt-1 text-[40px] leading-none font-semibold tracking-tight text-accent tabular-nums">
          {formatRupiah(summary.balance)}
        </p>
        {isZero && (
          <p className="mt-3 text-[15px] text-ink/70">
            Catat transaksi pertamamu untuk melihat ringkasan di sini.
          </p>
        )}
        {/*
         * Route /transactions milik Programmer 2 (Modul C/D).
         * Tombol ini jahitan integrasi P3-15, halamannya diisi P2.
         */}
        <Link
          href="/transactions"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-duit px-5 text-[15px] font-semibold text-on-duit transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-duit"
        >
          Catat transaksi
        </Link>
      </section>

      <section aria-label="Ringkasan" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[10px] bg-duit/10 px-5 py-4 shadow-[0_1px_2px_rgba(28,27,23,0.08)]">
          <p className="text-[15px] text-ink/60">Total pemasukan</p>
          <p className="mt-1 text-xl font-semibold text-duit tabular-nums">
            {formatRupiah(summary.totalIncome)}
          </p>
        </div>
        <div className="rounded-[10px] bg-expense/10 px-5 py-4 shadow-[0_1px_2px_rgba(28,27,23,0.08)]">
          <p className="text-[15px] text-ink/60">Total pengeluaran</p>
          <p className="mt-1 text-xl font-semibold text-expense tabular-nums">
            {formatRupiah(summary.totalExpense)}
          </p>
        </div>
      </section>

      {/* Widget transaksi terbaru: garis ledger, angka rata kanan (DESIGN.md §2). */}
      <section aria-label="Transaksi terbaru">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Transaksi terbaru
          </h2>
          {!isZero && (
            <Link
              href="/transactions"
              className="inline-flex min-h-11 items-center text-[15px] font-medium text-duit underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-duit"
            >
              Lihat semua
            </Link>
          )}
        </div>
        {isZero ? (
          <p className="mt-3 border-t border-ink/10 pt-4 text-[15px] text-ink/60">
            Belum ada transaksi. Mulai dari pemasukan atau pengeluaran
            pertamamu lewat tombol Catat transaksi di atas.
          </p>
        ) : (
          <ul className="mt-1 border-t border-ink/10">
            {recent.map((item) => (
              <RecentRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
