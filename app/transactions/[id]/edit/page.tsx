import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/duitku/Navbar";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { updateTransactionAction } from "@/lib/transactions/actions";
import { formatAmountInput } from "@/lib/transactions/format";
import { getTransaction } from "@/lib/transactions/queries";
import { requireUser } from "@/lib/transactions/session";
import { isTransactionId } from "@/lib/transactions/validation";

export const metadata: Metadata = {
  title: "Ubah Transaksi | DUITku",
};

export default async function EditTransactionPage({
  params,
}: PageProps<"/transactions/[id]/edit">) {
  const { user } = await requireUser();
  const { id } = await params;

  if (!isTransactionId(id)) {
    notFound();
  }

  const transaction = await getTransaction(user.id, id);

  if (!transaction) {
    notFound();
  }

  const displayName =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Mahasiswa";

  return (
    <div className="min-h-screen bg-background">
      <Navbar displayName={displayName} />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/transactions/${transaction.id}`}
            className="inline-flex items-center gap-2 rounded-lg py-1.5 text-sm font-semibold text-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
            <span>Kembali ke Detail Transaksi</span>
          </Link>
          <span className="text-divider">|</span>
          <Link
            href="/transactions"
            className="text-sm font-semibold text-subtle hover:text-ink transition-colors"
          >
            Ke Riwayat
          </Link>
        </div>

        <div className="border-b border-divider pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Ubah Transaksi
          </h1>
          <p className="mt-1 text-sm text-subtle">
            Perbarui data transaksi yang sudah kamu catat sebelumnya.
          </p>
        </div>

        <TransactionForm
          action={updateTransactionAction.bind(null, transaction.id)}
          initial={{
            type: transaction.type,
            amount: formatAmountInput(transaction.amount),
            category: transaction.category,
            description: transaction.description,
            transaction_date: transaction.transaction_date,
          }}
          submitLabel="Simpan Perubahan"
          cancelHref={`/transactions/${transaction.id}`}
        />
      </main>
    </div>
  );
}
