import type { Metadata } from "next";
import Link from "next/link";
import { FilterChips } from "@/components/transactions/FilterChips";
import { TransactionList } from "@/components/transactions/TransactionList";
import { primaryButtonClass } from "@/components/transactions/styles";
import { listTransactions } from "@/lib/transactions/queries";
import { requireUser } from "@/lib/transactions/session";
import type { TransactionFilter } from "@/lib/transactions/types";

export const metadata: Metadata = {
  title: "Riwayat transaksi | DUITku",
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

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-duit">DUITku</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            Riwayat transaksi
          </h1>
        </div>
        <Link href="/transactions/new" className={primaryButtonClass}>
          Catat transaksi
        </Link>
      </header>

      <div className="mt-6">
        <FilterChips active={filter} />
      </div>

      <section aria-label="Daftar transaksi" className="mt-4">
        <TransactionList transactions={transactions} filter={filter} />
      </section>
    </main>
  );
}
