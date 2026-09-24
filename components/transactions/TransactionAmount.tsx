import { formatRupiah } from "@/lib/transactions/format";
import type { TransactionType } from "@/lib/transactions/types";

type TransactionAmountProps = {
  type: TransactionType;
  amount: number;
  className?: string;
};

export function TransactionAmount({
  type,
  amount,
  className = "",
}: TransactionAmountProps) {
  const isIncome = type === "income";

  return (
    <span
      className={`shrink-0 text-right text-[15px] font-semibold tabular-nums ${
        isIncome ? "text-duit" : "text-expense"
      } ${className}`}
    >
      {isIncome ? "+" : "-"}
      {formatRupiah(amount)}
    </span>
  );
}
