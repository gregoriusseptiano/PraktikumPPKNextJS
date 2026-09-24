import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { FilterChips } from "@/components/transactions/FilterChips";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Navbar } from "@/components/duitku/Navbar";
import { listTransactions } from "@/lib/transactions/queries";
import { requireUser } from "@/lib/transactions/session";
import type { TransactionFilter } from "@/lib/transactions/types";

export const metadata: Metadata = {
  title: "Riwayat Transaksi | DUITku",
  description: "Daftar pemasukan dan pengeluaran milikmu.",
};

export default async function TransactionsPage({
  searchParams,
}: PageProps<"/transactions">) {
  const { user } = await requireUser();
  const params = await searchParams;
  const filter: TransactionFilter =
    params.type === "income" || params.type === "expense" ? params.type : "all";
  const transactions = await listTransactions(user.id, filter);
  const displayName =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Mahasiswa";

  return (
    <div className="min-h-screen bg-background">
      <Navbar displayName={displayName} />

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

        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-divider pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Riwayat Transaksi
            </h1>
            <p className="mt-1 text-sm text-subtle">
              Daftar seluruh catatan pemasukan dan pengeluaran kamu.
            </p>
          </div>

          <Link
            href="/transactions/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Catat Transaksi</span>
          </Link>
        </header>

        {/* Filter Navigation */}
        <div className="flex items-center justify-between gap-4">
          <FilterChips active={filter} />
          <span className="text-xs font-semibold text-subtle tabular-nums">
            {transactions.length} transaksi ditemukan
          </span>
        </div>

        {/* Transaction List */}
        <section aria-label="Daftar transaksi" className="pt-2">
          <TransactionList transactions={transactions} filter={filter} />
        </section>
      </main>
    </div>
  );
}
