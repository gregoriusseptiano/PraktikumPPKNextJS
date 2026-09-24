import Link from "next/link";
import { formatTanggal, rupiah } from "@/lib/dashboard/format";
import type { RecentTransaction } from "@/lib/dashboard/types";
import { CategoryIcon } from "./category-icons";

/**
 * Baris transaksi (DESIGN.md §3.4, dipakai Beranda, Transaksi, Laporan).
 * Tile ikon 36x36 biru, judul rata kiri, nominal tabular rata kanan
 * ("+ 75.000" hijau / "- 100.000" merah, tanpa "Rp"), divider mengikuti
 * padding horizontal, tinggi minimal 64px.
 */
export function TransactionRow({ item }: { item: RecentTransaction }) {
  const isIncome = item.type === "income";

  return (
    <li className="border-b border-divider last:border-b-0">
      <Link
        href={`/transactions/${item.id}`}
        aria-label={`Lihat detail transaksi ${item.category}, ${rupiah(item.amount, { prefix: true, sign: isIncome ? "auto" : "auto" })}`}
        className="group flex min-h-16 items-center gap-3.5 py-3.5 px-3 -mx-3 rounded-lg transition-colors hover:bg-primary-soft/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary text-on-primary transition-transform group-hover:scale-105"
        >
          <CategoryIcon category={item.category} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink group-hover:text-primary transition-colors">
            {item.category || "Tanpa kategori"}
          </span>
          <span className="block truncate text-[12px] text-subtle">
            {item.description
              ? `${item.description} • ${formatTanggal(item.transactionDate)}`
              : formatTanggal(item.transactionDate)}
          </span>
        </span>
        <span
          className={`shrink-0 text-[15px] font-bold tabular-nums ${
            isIncome ? "text-income-deep" : "text-expense-deep"
          }`}
        >
          {rupiah(item.amount, {
            prefix: false,
            sign: true,
          })}
        </span>
      </Link>
    </li>
  );
}

/** Link "Lihat semua" standar section (DESIGN.md §3.5). */
export function LihatSemua({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center text-[13px] font-medium text-subtle underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      Lihat semua
    </Link>
  );
}
