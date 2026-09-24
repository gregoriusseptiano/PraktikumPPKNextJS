import Link from "next/link";
import { formatDate } from "@/lib/transactions/format";
import type { Transaction, TransactionFilter } from "@/lib/transactions/types";
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
    <ul className="divide-y divide-line border-y border-line">
      {transactions.map((transaction) => (
        <li
          key={transaction.id}
          className="flex items-start justify-between gap-3 py-4"
        >
          <div className="min-w-0 flex-1">
            <Link
              href={`/transactions/${transaction.id}`}
              className="block truncate font-medium text-ink hover:text-duit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-duit"
            >
              {transaction.category}
            </Link>
            {transaction.description ? (
              <p className="mt-0.5 truncate text-sm text-ink/70">
                {transaction.description}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-ink/60">
              {formatDate(transaction.transaction_date)}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1">
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
          <TransactionAmount
            type={transaction.type}
            amount={transaction.amount}
            className="pt-0.5"
          />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ filter }: { filter: TransactionFilter }) {
  if (filter !== "all") {
    const label = filter === "income" ? "pemasukan" : "pengeluaran";

    return (
      <div className="rounded-[10px] border border-dashed border-line px-6 py-12 text-center">
        <p className="font-medium text-ink">Belum ada {label}</p>
        <p className="mt-1 text-sm text-ink/70">
          Transaksi {label} yang kamu catat akan muncul di sini.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={`/transactions/new?type=${filter}`}
            className={primaryButtonClass}
          >
            Catat {label}
          </Link>
          <Link href="/transactions" className={secondaryButtonClass}>
            Lihat semua
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-dashed border-line px-6 py-12 text-center">
      <p className="font-medium text-ink">Belum ada transaksi</p>
      <p className="mt-1 text-sm text-ink/70">
        Mulai catat pemasukan atau pengeluaran pertamamu.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
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
