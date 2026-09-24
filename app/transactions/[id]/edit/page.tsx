import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { backLinkClass } from "@/components/transactions/styles";
import { updateTransactionAction } from "@/lib/transactions/actions";
import { formatAmountInput } from "@/lib/transactions/format";
import { getTransaction } from "@/lib/transactions/queries";
import { requireUser } from "@/lib/transactions/session";
import { isTransactionId } from "@/lib/transactions/validation";

export const metadata: Metadata = {
  title: "Ubah transaksi | DUITku",
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

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <Link
        href={`/transactions/${transaction.id}`}
        className={backLinkClass}
      >
        Kembali ke detail
      </Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        Ubah transaksi
      </h1>
      <TransactionForm
        action={updateTransactionAction.bind(null, transaction.id)}
        initial={{
          type: transaction.type,
          amount: formatAmountInput(transaction.amount),
          category: transaction.category,
          description: transaction.description,
          transaction_date: transaction.transaction_date,
        }}
        submitLabel="Simpan perubahan"
        cancelHref={`/transactions/${transaction.id}`}
      />
    </main>
  );
}
