import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { getDashboardData, getReportsData } from "@/lib/dashboard/dal";
import { currentMonthKey, rupiah } from "@/lib/dashboard/format";
import type { CategoryTotal } from "@/lib/dashboard/summary";
import { Navbar } from "@/components/duitku/Navbar";
import {
  LihatSemua,
  TransactionRow,
} from "@/components/duitku/TransactionRow";
import { CategoryIcon } from "@/components/duitku/category-icons";

export const metadata: Metadata = {
  title: "Beranda | DUITku",
  description: "Saldo, ringkasan, dan transaksi terakhir milikmu.",
};

function MetricCard({
  title,
  amount,
  description,
  type,
}: {
  title: string;
  amount: number;
  description: string;
  type: "balance" | "income" | "expense";
}) {
  const isBalance = type === "balance";
  const isIncome = type === "income";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-divider bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-subtle">{title}</span>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            isBalance
              ? "bg-primary-soft text-primary"
              : isIncome
              ? "bg-income/10 text-income-deep"
              : "bg-expense/10 text-expense-deep"
          }`}
        >
          {isBalance ? (
            <Wallet size={20} strokeWidth={2.2} />
          ) : isIncome ? (
            <TrendingUp size={20} strokeWidth={2.2} />
          ) : (
            <TrendingDown size={20} strokeWidth={2.2} />
          )}
        </span>
      </div>

      <div className="mt-4">
        <p
          className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${
            isBalance
              ? "text-ink"
              : isIncome
              ? "text-income-deep"
              : "text-expense-deep"
          }`}
        >
          {rupiah(amount, { sign: isBalance ? "auto" : undefined })}
        </p>
        <p className="mt-1.5 text-xs text-subtle">{description}</p>
      </div>
    </div>
  );
}

function CategoryBreakdownCard({ item }: { item: CategoryTotal }) {
  const r = 24;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3.5 rounded-lg border border-divider bg-surface p-3 transition-colors hover:bg-muted/40">
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center" aria-hidden="true">
        <svg viewBox="0 0 56 56" className="h-12 w-12 -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="var(--color-primary)"
            strokeOpacity="0.2"
            strokeWidth="8"
          />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="var(--color-danger-arc)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${Math.max(item.share * c, 0.001 * c)} ${c}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-primary">
          <CategoryIcon category={item.category} size={16} />
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-ink">{item.category}</p>
          <span className="text-xs font-semibold text-subtle tabular-nums">
            {Math.round(item.share * 100)}%
          </span>
        </div>
        <p className="mt-0.5 text-xs text-subtle tabular-nums">
          {rupiah(item.total, { prefix: true })}
        </p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const month = currentMonthKey();
  const [{ summary, recent, displayName }, monthExpense] = await Promise.all([
    getDashboardData(),
    getReportsData("expense", month),
  ]);
  const isZero = summary.totalIncome === 0 && summary.totalExpense === 0;
  const name = displayName ?? "Mahasiswa";
  const topCategories = monthExpense.byCategory.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar displayName={displayName} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Web Hero Banner */}
        <section aria-label="Sapaan Pengguna" className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-header to-primary p-6 sm:p-8 text-on-header shadow-md">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                Dashboard Keuangan Mahasiswa
              </span>
              <h1 className="mt-2.5 text-2xl sm:text-3xl font-bold tracking-tight">
                Halo, {name}!
              </h1>
              <p className="mt-1 text-sm text-white/90">
                Kelola dan pantau uang masuk dan keluar dengan mudah agar keuangan kuliah tetap sehat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/transactions/new"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-surface px-5 py-2.5 text-sm font-bold text-header shadow transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span>Catat Transaksi</span>
              </Link>
              <Link
                href="/transactions"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ReceiptText size={18} />
                <span>Riwayat</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3 Metric Summary Cards */}
        <section aria-label="Ringkasan Keuangan" className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MetricCard
            title="Saldo Saat Ini"
            amount={summary.balance}
            description="Pemasukan bersih yang masih tersedia"
            type="balance"
          />
          <MetricCard
            title="Total Pemasukan"
            amount={summary.totalIncome}
            description="Akumulasi seluruh pemasukan tercatat"
            type="income"
          />
          <MetricCard
            title="Total Pengeluaran"
            amount={summary.totalExpense}
            description="Akumulasi seluruh pengeluaran tercatat"
            type="expense"
          />
        </section>

        {isZero && (
          <div className="rounded-xl border border-dashed border-divider bg-surface p-6 text-center">
            <p className="text-base font-semibold text-ink">Belum ada transaksi tercatat</p>
            <p className="mt-1 text-sm text-subtle">
              Mulai catat transaksi pertamamu untuk melihat analisis dan ringkasan keuangan di sini.
            </p>
            <Link
              href="/transactions/new"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Catat Transaksi Pertama</span>
            </Link>
          </div>
        )}

        {/* Desktop Main Grid: Recent Transactions (Left) & Categories/Actions (Right) */}
        <section aria-label="Aktivitas dan Pengeluaran" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-divider bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-divider pb-4">
                <div>
                  <h2 className="text-lg font-bold text-ink">Transaksi Terakhir</h2>
                  <p className="text-xs text-subtle">Klik transaksi untuk melihat detail lengkap</p>
                </div>
                {recent.length > 0 && <LihatSemua href="/transactions" />}
              </div>

              {recent.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-medium text-subtle">Belum ada transaksi</p>
                  <p className="mt-1 text-xs text-subtle">Tambahkan catatan keuangan baru kapan saja.</p>
                  <Link
                    href="/transactions/new"
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    <Plus size={16} />
                    <span>Tambah Transaksi</span>
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-divider">
                  {recent.slice(0, 5).map((item) => (
                    <TransactionRow key={item.id} item={item} />
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column: Category Breakdown & Quick Actions */}
          <div className="space-y-6">
            {/* Category breakdown */}
            <div className="rounded-xl border border-divider bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-divider pb-4">
                <h2 className="text-base font-bold text-ink">Pengeluaran Bulan Ini</h2>
                <Link
                  href="/reports"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Detail Laporan
                </Link>
              </div>

              {topCategories.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-subtle">Belum ada pengeluaran di bulan ini.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {topCategories.map((item) => (
                    <CategoryBreakdownCard key={item.category} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-xl border border-divider bg-surface p-6 shadow-sm">
              <h2 className="text-base font-bold text-ink">Aksi Cepat</h2>
              <div className="mt-4 grid grid-cols-1 gap-2.5">
                <Link
                  href="/transactions/new?type=income"
                  className="flex items-center justify-between rounded-lg border border-divider p-3 text-sm font-semibold text-ink transition-colors hover:bg-income/10 hover:border-income"
                >
                  <span className="flex items-center gap-2 text-income-deep">
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                    <span>Catat Pemasukan</span>
                  </span>
                  <span className="text-xs text-subtle">+ Saldo</span>
                </Link>

                <Link
                  href="/transactions/new?type=expense"
                  className="flex items-center justify-between rounded-lg border border-divider p-3 text-sm font-semibold text-ink transition-colors hover:bg-expense/10 hover:border-expense"
                >
                  <span className="flex items-center gap-2 text-expense-deep">
                    <ArrowDownRight size={18} strokeWidth={2.5} />
                    <span>Catat Pengeluaran</span>
                  </span>
                  <span className="text-xs text-subtle">- Saldo</span>
                </Link>

                <Link
                  href="/reports"
                  className="flex items-center justify-between rounded-lg border border-divider p-3 text-sm font-semibold text-ink transition-colors hover:bg-primary-soft hover:border-primary"
                >
                  <span className="flex items-center gap-2 text-primary">
                    <ReceiptText size={18} />
                    <span>Analisis Keuangan</span>
                  </span>
                  <span className="text-xs text-subtle">Grafik</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
