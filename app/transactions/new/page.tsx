import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/duitku/Navbar";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { createTransactionAction } from "@/lib/transactions/actions";
import { todayISO } from "@/lib/transactions/format";
import { requireUser } from "@/lib/transactions/session";

export const metadata: Metadata = {
  title: "Catat Transaksi Baru | DUITku",
};

export default async function NewTransactionPage({
  searchParams,
}: PageProps<"/transactions/new">) {
  const { user } = await requireUser();
  const params = await searchParams;
  const type = params.type === "income" ? "income" : "expense";
  const displayName =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Mahasiswa";

  return (
    <div className="min-h-screen bg-background">
      <Navbar displayName={displayName} />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 rounded-lg py-1.5 text-sm font-semibold text-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
            <span>Kembali ke Riwayat Transaksi</span>
          </Link>
        </div>

        <div className="border-b border-divider pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Catat Transaksi Baru
          </h1>
          <p className="mt-1 text-sm text-subtle">
            Masukkan rincian transaksi pemasukan atau pengeluaran keuanganmu.
          </p>
        </div>

        <TransactionForm
          action={createTransactionAction}
          initial={{
            type,
            amount: "",
            category: "",
            description: "",
            transaction_date: todayISO(),
          }}
          submitLabel="Simpan Transaksi"
          cancelHref="/transactions"
        />
      </main>
    </div>
  );
}
