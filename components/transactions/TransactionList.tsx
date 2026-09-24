import Link from "next/link";
import { formatDate } from "@/lib/transactions/format";
import type { Transaction, TransactionFilter } from "@/lib/transactions/types";
import { CategoryIcon } from "@/components/duitku/category-icons";
import { DeleteTransactionButton } from "./DeleteTransactionButton";
import { TransactionAmount } from "./TransactionAmount";
import {
  actionLinkClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./styles";

type TransactionListProps = {
  transactions: Transaction[];
  filter: TransactionFilter;
};

export function TransactionList({ transactions, filter }: TransactionListProps) {
  if (transactions.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <ul className="divide-y divide-divider rounded-xl border border-divider bg-surface shadow-sm">
      {transactions.map((transaction) => (
        <li
          key={transaction.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 transition-colors hover:bg-muted/30"
        >
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm"
            >
              <CategoryIcon category={transaction.category} size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <Link
                href={`/transactions/${transaction.id}`}
                className="block truncate font-semibold text-ink hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {transaction.category}
              </Link>
              {transaction.description ? (
                <p className="mt-0.5 truncate text-sm text-subtle">
                  {transaction.description}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-subtle">
                {formatDate(transaction.transaction_date)}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t border-divider sm:border-0">
            <TransactionAmount
              type={transaction.type}
              amount={transaction.amount}
              className="text-base sm:text-lg font-bold"
            />
            <div className="flex items-center gap-1.5">
              <Link
                href={`/transactions/${transaction.id}`}
                className={actionLinkClass}
              >
                Detail
              </Link>
              <Link
                href={`/transactions/${transaction.id}/edit`}
                className={actionLinkClass}
              >
                Ubah
              </Link>
              <DeleteTransactionButton id={transaction.id} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ filter }: { filter: TransactionFilter }) {
  if (filter !== "all") {
    const label = filter === "income" ? "pemasukan" : "pengeluaran";

    return (
      <div className="rounded-xl border border-dashed border-divider bg-surface px-6 py-14 text-center shadow-sm">
        <p className="text-base font-semibold text-ink">Belum ada {label}</p>
        <p className="mt-1 text-sm text-subtle">
          Transaksi {label} yang kamu catat akan muncul di sini.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/transactions/new?type=${filter}`}
            className={primaryButtonClass}
          >
            Catat {label}
          </Link>
          <Link href="/transactions" className={secondaryButtonClass}>
            Lihat semua transaksi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-divider bg-surface px-6 py-14 text-center shadow-sm">
      <p className="text-base font-semibold text-ink">Belum ada transaksi</p>
      <p className="mt-1 text-sm text-subtle">
        Mulai catat pemasukan atau pengeluaran pertamamu.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/transactions/new?type=income"
          className={secondaryButtonClass}
        >
          Catat pemasukan
        </Link>
        <Link
          href="/transactions/new?type=expense"
          className={primaryButtonClass}
        >
          Catat pengeluaran
        </Link>
      </div>
    </div>
  );
}
