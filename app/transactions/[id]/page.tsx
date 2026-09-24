import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Edit3 } from "lucide-react";
import { Navbar } from "@/components/duitku/Navbar";
import { CategoryIcon } from "@/components/duitku/category-icons";
import { DeleteTransactionButton } from "@/components/transactions/DeleteTransactionButton";
import {
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
  title: "Detail Transaksi | DUITku",
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
  const displayName =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Mahasiswa";

  return (
    <div className="min-h-screen bg-background">
      <Navbar displayName={displayName} />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Tombol Back & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 rounded-lg py-1.5 text-sm font-semibold text-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
            <span>Kembali ke Riwayat Transaksi</span>
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-subtle">
            <Link href="/dashboard" className="hover:text-ink transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/transactions" className="hover:text-ink transition-colors">
              Transaksi
            </Link>
            <span>/</span>
            <span className="font-semibold text-ink">Detail</span>
          </nav>
        </div>

        {/* Transaction Detail Card */}
        <article className="overflow-hidden rounded-2xl border border-divider bg-surface shadow-sm">
          {/* Top category & status header */}
          <div className="border-b border-divider bg-muted/20 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm"
                >
                  <CategoryIcon category={transaction.category} size={24} />
                </span>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-ink">
                    {transaction.category}
                  </h1>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                      isIncome
                        ? "bg-income/10 text-income-deep"
                        : "bg-expense/10 text-expense-deep"
                    }`}
                  >
                    {isIncome ? "Pemasukan (+)" : "Pengeluaran (-)"}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-subtle">Nominal Transaksi</p>
                <p
                  className={`mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
                    isIncome ? "text-income-deep" : "text-expense-deep"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatRupiah(transaction.amount)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-xs font-semibold tracking-wider text-subtle uppercase">
                Deskripsi / Catatan
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-base text-ink">
                {transaction.description || "Tidak ada catatan tambahan."}
              </p>
            </div>

            {/* Timestamps and dates */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-divider bg-muted/10 p-4">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-primary" />
                <div>
                  <dt className="text-xs text-subtle">Tanggal Transaksi</dt>
                  <dd className="text-sm font-semibold text-ink">
                    {formatDate(transaction.transaction_date)}
                  </dd>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={18} className="text-subtle" />
                <div>
                  <dt className="text-xs text-subtle">Dicatat Pada</dt>
                  <dd className="text-sm font-semibold text-ink">
                    {formatDateTime(transaction.created_at)}
                  </dd>
                </div>
              </div>
            </dl>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-divider pt-6">
              <Link
                href="/transactions"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-divider px-4 text-sm font-semibold text-subtle transition-colors hover:bg-muted/40 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <ArrowLeft size={16} />
                <span>Kembali ke Riwayat</span>
              </Link>

              <div className="flex items-center gap-2.5">
                <Link
                  href={`/transactions/${transaction.id}/edit`}
                  className={`${primaryButtonClass} gap-2`}
                >
                  <Edit3 size={16} />
                  <span>Ubah Transaksi</span>
                </Link>
                <DeleteTransactionButton
                  id={transaction.id}
                  label="Hapus Transaksi"
                  variant="danger"
                />
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
