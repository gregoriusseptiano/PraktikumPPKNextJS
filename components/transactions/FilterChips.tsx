import Link from "next/link";
import type { TransactionFilter } from "@/lib/transactions/types";

const FILTERS: { value: TransactionFilter; label: string; href: string }[] = [
  { value: "all", label: "Semua", href: "/transactions" },
  { value: "income", label: "Pemasukan", href: "/transactions?type=income" },
  { value: "expense", label: "Pengeluaran", href: "/transactions?type=expense" },
];

export function FilterChips({ active }: { active: TransactionFilter }) {
  return (
    <nav aria-label="Filter jenis transaksi" className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = filter.value === active;

        return (
          <Link
            key={filter.value}
            href={filter.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "border border-divider bg-surface text-subtle hover:bg-muted/50 hover:text-ink"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </nav>
  );
}
