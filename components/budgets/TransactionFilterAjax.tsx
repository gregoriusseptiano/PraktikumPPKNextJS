"use client";

/**
 * DUITku — AJAX Filter Transaksi (Programmer 2: feature/budget-transactions-ajax)
 *
 * SRS P2-16: Client Component fetch(/api/transactions/list) + debounce search
 * + skeleton + aria-live, tanpa <Link> reload
 *
 * Acceptance: klik filter/search tidak reload (cek Network XHR + URL tetap)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { CategoryIcon } from "@/components/duitku/category-icons";
import { TransactionAmount } from "@/components/transactions/TransactionAmount";
import { actionLinkClass } from "@/components/transactions/styles";
import { formatDate } from "@/lib/transactions/format";
import { DeleteTransactionAjax } from "./DeleteTransactionAjax";
import type { Transaction, TransactionFilter } from "@/lib/transactions/types";

/** Props untuk TransactionFilterAjax */
export type TransactionFilterAjaxProps = {
  /** Filter aktif saat ini */
  initialType?: TransactionFilter;
  /** Search query saat ini */
  initialQ?: string;
  /** Bulan filter (opsional) */
  initialMonth?: string;
  /** Data transaksi awal untuk SSR hydration */
  initialTransactions?: Transaction[];
  /** Total awal transaksi */
  initialTotal?: number;
  /** Callback ketika data berubah */
  onDataChange?: (transactions: Transaction[], total: number) => void;
  /** Callback ketika loading state berubah */
  onLoadingChange?: (isLoading: boolean) => void;
  /** Callback ketika error terjadi */
  onError?: (error: string | null) => void;
};

/** Style untuk chip filter */
const chipBase =
  "inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const chipActive = "bg-primary text-white shadow-sm";
const chipInactive =
  "border border-divider bg-surface text-subtle hover:bg-muted/50 hover:text-ink cursor-pointer";

/** Skeleton untuk loading state */
function SkeletonRow() {
  return (
    <div className="animate-pulse rounded-lg border border-divider bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted"></div>
          <div className="h-3 w-32 rounded bg-muted"></div>
        </div>
        <div className="h-5 w-20 rounded bg-muted"></div>
      </div>
    </div>
  );
}

/** Skeleton list */
function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}

/** Komponen filter dengan debounce search */
export function TransactionFilterAjax({
  initialType = "all",
  initialQ = "",
  initialMonth,
  initialTransactions,
  initialTotal,
  onDataChange,
  onLoadingChange,
  onError,
}: TransactionFilterAjaxProps) {
  const [type, setType] = useState<TransactionFilter>(initialType);
  const [searchQ, setSearchQ] = useState(initialQ);
  const [debouncedQ, setDebouncedQ] = useState(initialQ);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialTransactions ?? []
  );
  const [total, setTotal] = useState(
    initialTotal ?? initialTransactions?.length ?? 0
  );
  const [error, setError] = useState<string | null>(null);

  const isInitialMountRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const onDataChangeRef = useRef(onDataChange);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const onErrorRef = useRef(onError);

  // Keep refs updated
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
    onLoadingChangeRef.current = onLoadingChange;
    onErrorRef.current = onError;
  }, [onDataChange, onLoadingChange, onError]);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(searchQ);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQ]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    onLoadingChangeRef.current?.(true);
    setError(null);
    onErrorRef.current?.(null);

    try {
      const params = new URLSearchParams();
      if (type !== "all") params.set("type", type);
      if (debouncedQ.trim()) params.set("q", debouncedQ.trim());
      if (initialMonth) params.set("month", initialMonth);

      const url = `/api/transactions/list?${params.toString()}`;
      const res = await fetch(url, { signal });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal memuat transaksi.");
      }

      const data = await res.json();
      setTransactions(data.data.transactions);
      setTotal(data.data.total);
      onDataChangeRef.current?.(data.data.transactions, data.data.total);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "Gagal memuat transaksi.";
      setError(message);
      onErrorRef.current?.(message);
    } finally {
      setIsLoading(false);
      onLoadingChangeRef.current?.(false);
    }
  }, [type, debouncedQ, initialMonth]);

  // Fetch data ketika filter / debouncedQ berubah
  useEffect(() => {
    // Lewati fetch pertama jika data SSR sudah disediakan dan query kosong
    if (isInitialMountRef.current && initialTransactions !== undefined) {
      isInitialMountRef.current = false;
      return;
    }
    isInitialMountRef.current = false;
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, initialTransactions]);

  // Listen for budget/transaction update events (dari form create/delete)
  useEffect(() => {
    const handleBudgetUpdate = () => {
      fetchData();
    };

    window.addEventListener("budget-updated", handleBudgetUpdate);
    return () => {
      window.removeEventListener("budget-updated", handleBudgetUpdate);
    };
  }, [fetchData]);

  // Handle type change
  const handleTypeChange = (newType: TransactionFilter) => {
    setType(newType);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQ(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQ("");
    setDebouncedQ("");
  };

  const filters: { value: TransactionFilter; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "income", label: "Pemasukan" },
    { value: "expense", label: "Pengeluaran" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter chips + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Filter jenis transaksi" className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = filter.value === type;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleTypeChange(filter.value)}
                aria-current={isActive ? "true" : undefined}
                className={`${chipBase} ${isActive ? chipActive : chipInactive}`}
              >
                {filter.label}
              </button>
            );
          })}
        </nav>

        {/* Search input */}
        <div className="relative">
          <input
            type="search"
            placeholder="Cari transaksi..."
            value={searchQ}
            onChange={handleSearchChange}
            aria-label="Cari transaksi"
            className="block w-full rounded-lg border border-divider bg-surface px-3 py-2 pr-10 text-sm text-ink placeholder:text-ink/40 focus:border-primary focus:outline-2 focus:outline-offset-1 focus:outline-primary sm:w-64"
          />
          {searchQ && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Hapus pencarian"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink/60 hover:text-ink cursor-pointer"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div aria-live="polite" aria-busy="true">
          <SkeletonList />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-expense/40 bg-expense/10 px-4 py-3 text-sm text-expense"
        >
          {error}
        </div>
      )}

      {/* Result count */}
      {!isLoading && !error && (
        <div
          aria-live="polite"
          className="text-xs font-semibold text-subtle tabular-nums"
        >
          {total} transaksi ditemukan
        </div>
      )}

      {/* Transaction list */}
      {!isLoading && !error && transactions.length > 0 && (
        <ul
          className="divide-y divide-divider rounded-xl border border-divider bg-surface shadow-sm"
          aria-label="Daftar transaksi"
        >
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm"
                >
                  <CategoryIcon category={tx.category} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/transactions/${tx.id}`}
                    className="block truncate font-semibold text-ink hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {tx.category}
                  </Link>
                  {tx.description ? (
                    <p className="mt-0.5 truncate text-sm text-subtle">
                      {tx.description}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-subtle">
                    {formatDate(tx.transaction_date)}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t border-divider sm:border-0">
                <TransactionAmount
                  type={tx.type}
                  amount={tx.amount}
                  className="text-base sm:text-lg font-bold"
                />
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/transactions/${tx.id}`}
                    className={actionLinkClass}
                  >
                    Detail
                  </Link>
                  <Link
                    href={`/transactions/${tx.id}/edit`}
                    className={actionLinkClass}
                  >
                    Ubah
                  </Link>
                  <DeleteTransactionAjax
                    id={tx.id}
                    onOptimisticDelete={() => {
                      setTransactions((prev) =>
                        prev.filter((item) => item.id !== tx.id)
                      );
                      setTotal((prev) => Math.max(0, prev - 1));
                    }}
                    onRollback={() => {
                      fetchData();
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Empty state */}
      {!isLoading && !error && transactions.length === 0 && (
        <div className="rounded-xl border border-dashed border-divider bg-surface px-6 py-14 text-center shadow-sm">
          <p className="text-base font-semibold text-ink">
            {type === "income"
              ? "Belum ada pemasukan"
              : type === "expense"
              ? "Belum ada pengeluaran"
              : debouncedQ
              ? "Tidak ada transaksi yang cocok"
              : "Belum ada transaksi"}
          </p>
          <p className="mt-1 text-sm text-subtle">
            {debouncedQ
              ? `Tidak ditemukan transaksi dengan kata kunci "${debouncedQ}".`
              : "Mulai catat pemasukan atau pengeluaran pertamamu."}
          </p>
          {debouncedQ && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center justify-center rounded-lg border border-divider bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-muted/50 cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
