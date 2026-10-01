import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/duitku/Navbar";
import { TransactionsClientView } from "@/components/budgets/TransactionsClientView";
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

        {/* Client View: Header, BudgetProgressBar, AJAX Filter/Search & List, Modal Tambah */}
        <TransactionsClientView
          initialFilter={filter}
          initialTransactions={transactions}
        />
      </main>
    </div>
  );
}
