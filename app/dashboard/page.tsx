import Link from "next/link";
import type { Metadata } from "next";
import { TrendingDown, TrendingUp } from "lucide-react";
import { getDashboardData, getReportsData } from "@/lib/dashboard/dal";
import { currentMonthKey, rupiah } from "@/lib/dashboard/format";
import type { CategoryTotal } from "@/lib/dashboard/summary";
import { BottomNav } from "@/components/duitku/BottomNav";
import {
  LihatSemua,
  TransactionRow,
} from "@/components/duitku/TransactionRow";
import { CategoryIcon } from "@/components/duitku/category-icons";

/**
 * Beranda = /dashboard (Modul E, SRS P3-01..P3-07; layout DESIGN.md §4.2).
 * Server Component: data segar tiap request sehingga ringkasan mengikuti
 * CRUD transaksi (P3-07). Tanpa session valid, DAL redirect ke /login
 * (integrasi Auth, P3-15).
 */

export const metadata: Metadata = {
  title: "Beranda | DUITku",
  description: "Saldo, ringkasan, dan transaksi terakhir milikmu.",
};

function Avatar({ name }: { name: string | null }) {
  const initial = (name ?? "K").trim().charAt(0).toUpperCase() || "K";
  return (
    <span
      aria-hidden="true"
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-on-header/20 text-xl font-bold text-on-header"
    >
      {initial}
    </span>
  );
}

function SummaryCard({
  label,
  amount,
  kind,
}: {
  label: string;
  amount: number;
  kind: "income" | "expense";
}) {
  const isIncome = kind === "income";
  const Icon = isIncome ? TrendingUp : TrendingDown;
  return (
    <div className="flex-1 rounded-md bg-surface px-3.5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <p className="flex items-center gap-1.5 text-[13px] font-medium text-subtle">
        {label}
        <Icon
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={isIncome ? "text-income-deep" : "text-expense-deep"}
        />
      </p>
      <p
        className={`mt-1 text-base font-bold tabular-nums ${
          isIncome ? "text-income-deep" : "text-expense-deep"
        }`}
      >
        {rupiah(amount)}
      </p>
    </div>
  );
}

/**
 * Kartu donut anggaran (DESIGN.md §3.3, pengayaan di luar SRS minimum).
 * Tanpa target anggaran di SRS, busur merah = pangsa kategori terhadap
 * total pengeluaran bulan berjalan, busur biru = sisanya.
 */
function BudgetDonutCard({ item }: { item: CategoryTotal }) {
  const r = 24;
  const c = 2 * Math.PI * r;
  return (
    <div className="w-[92px] shrink-0 snap-start rounded-md bg-surface px-2 py-3 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <span className="relative mx-auto block h-14 w-14" aria-hidden="true">
        <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="var(--color-primary)"
            strokeOpacity="0.25"
            strokeWidth="9"
          />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="var(--color-danger-arc)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${Math.max(item.share * c, 0.001 * c)} ${c}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-primary">
          <CategoryIcon category={item.category} />
        </span>
      </span>
      <span className="mt-2 block truncate text-[11px] font-medium text-ink">
        {item.category}
      </span>
      <span className="block text-[11px] text-subtle tabular-nums">
        {rupiah(item.total, { prefix: false })}
      </span>
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
  const name = displayName ?? "Kamu";
  const topCategories = monthExpense.byCategory.slice(0, 6);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-background">
      {/* Header biru: sapaan + avatar + saldo (focal point, DESIGN.md §3.1). */}
      <header className="bg-header px-5 pt-6 pb-10 text-on-header">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium">Hi {name}</p>
            <p className="mt-0.5 text-[11px] opacity-90">Uang kamu tersisa</p>
            {/*
             * Saldo negatif memakai awalan "-" (§7). Tetap putih di atas
             * header agar kontras lolos; merah expense di atas biru
             * header tidak terbaca.
             */}
            <p className="mt-1 text-xl font-bold tracking-tight tabular-nums">
              {rupiah(summary.balance, { sign: "auto" })}
            </p>
          </div>
          <Avatar name={displayName} />
        </div>
      </header>

      {/* Dua kartu ringkasan (SRS P3-02, P3-03). */}
      <section
        aria-label="Ringkasan"
        className="mx-[18px] -mt-6 flex gap-2"
      >
        <SummaryCard
          label="Pemasukan"
          amount={summary.totalIncome}
          kind="income"
        />
        <SummaryCard
          label="Pengeluaran"
          amount={summary.totalExpense}
          kind="expense"
        />
      </section>

      {isZero && (
        <p className="mx-[18px] mt-4 text-sm text-subtle">
          Catat transaksi pertamamu untuk melihat ringkasan di sini.
        </p>
      )}

      {/* Carousel anggaran (pengayaan, data dari transactions). */}
      {!isZero && topCategories.length > 0 && (
        <section aria-label="Anggaran Pengeluaran" className="mt-6">
          <h2 className="px-[18px] text-base font-semibold text-ink">
            Anggaran Pengeluaran
          </h2>
          <div className="mt-2 flex snap-x gap-2.5 overflow-x-auto px-[18px] pb-1">
            {topCategories.map((item) => (
              <BudgetDonutCard key={item.category} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Sheet putih: transaksi terakhir (SRS P3-05). */}
      <section
        aria-label="Transaksi Terakhir"
        className="mt-4 flex-1 rounded-t-[32px] bg-surface px-[18px] pt-5 pb-4"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold text-ink">Transaksi Terakhir</h2>
          {recent.length > 0 && <LihatSemua href="/transactions" />}
        </div>
        {recent.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-subtle">Belum ada transaksi bulan ini</p>
            {/*
             * Route /transactions milik Programmer 2 (Modul C/D).
             * Tombol ini jahitan integrasi P3-15, halaman dan bottom
             * sheet formnya diisi P2.
             */}
            <Link
              href="/transactions"
              className="mt-3 inline-flex min-h-11 items-center rounded-md bg-header px-5 text-sm font-semibold text-on-header focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Tambah transaksi
            </Link>
          </div>
        ) : (
          <ul>
            {recent.slice(0, 4).map((item) => (
              <TransactionRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>

      <BottomNav active="beranda" />
    </div>
  );
}
