import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteTransactionButton } from "@/components/transactions/DeleteTransactionButton";
import {
  backLinkClass,
  primaryButtonClass,
} from "@/components/transactions/styles";
import {
  formatDate,
  formatDateTime,
  formatRupiah,
} from "@/lib/transactions/format";
import { getTransaction } from "@/lib/transactions/queries";
import { requireUser } from "@/lib/transactions/session";
import { isTransactionId } from "@/lib/transactions/validation";

export const metadata: Metadata = {
  title: "Detail transaksi | DUITku",
};

export default async function TransactionDetailPage({
  params,
}: PageProps<"/transactions/[id]">) {
  const { user } = await requireUser();
  const { id } = await params;

  if (!isTransactionId(id)) {
    notFound();
  }

  const transaction = await getTransaction(user.id, id);

  if (!transaction) {
    notFound();
  }

  const isIncome = transaction.type === "income";

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <Link href="/transactions" className={backLinkClass}>
        Kembali ke riwayat
      </Link>

      <article className="mt-4 rounded-[10px] border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isIncome
                ? "bg-duit/10 text-duit"
                : "bg-expense/10 text-expense"
            }`}
          >
            {isIncome ? "Pemasukan" : "Pengeluaran"}
          </span>
          <span className="text-xs text-ink/60">
            Dibuat {formatDateTime(transaction.created_at)}
          </span>
        </div>

        <p
          className={`mt-4 text-[40px] font-semibold leading-none tabular-nums ${
            isIncome ? "text-duit" : "text-expense"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatRupiah(transaction.amount)}
        </p>

        <h1 className="mt-3 text-xl font-semibold text-ink">
          {transaction.category}
        </h1>

        {transaction.description ? (
          <p className="mt-2 whitespace-pre-wrap text-[15px] text-ink/80">
            {transaction.description}
          </p>
        ) : null}

        <dl className="mt-5 divide-y divide-line border-t border-line text-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-ink/70">Tanggal transaksi</dt>
            <dd className="font-medium text-ink">
              {formatDate(transaction.transaction_date)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-ink/70">Terakhir diperbarui</dt>
            <dd className="font-medium text-ink">
              {formatDateTime(transaction.updated_at)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={`/transactions/${transaction.id}/edit`}
            className={primaryButtonClass}
          >
            Ubah transaksi
          </Link>
          <DeleteTransactionButton
            id={transaction.id}
            label="Hapus transaksi"
            variant="danger"
          />
        </div>
      </article>
    </main>
  );
}
