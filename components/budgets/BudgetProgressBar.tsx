"use client";

/**
 * DUITku — Progress Bar (Programmer 2: feature/budget-transactions-ajax)
 *
 * SRS P2-18: bar % + label sisa/over, warna aman/waspada/over,
 * fetch(/api/budgets/summary) tiap CRUD sukses
 *
 * Acceptance: tambah/hapus transaksi langsung update bar tanpa refresh
 */

import { useState, useEffect, useRef } from "react";
import type { BudgetUsage, BudgetStatus } from "@/lib/budgets/types";

/** Props untuk BudgetProgressBar */
export type BudgetProgressBarProps = {
  /** Bulan untuk ditampilkan (default: bulan berjalan) */
  month?: string;
  /** Label untuk bulan (contoh: "Oktober 2026") */
  monthLabel?: string;
  /** Event ketika data diupdate (untuk integrasi dengan komponen lain) */
  onUsageUpdate?: (usage: BudgetUsage) => void;
};

/** Warna berdasarkan status */
const statusColors: Record<BudgetStatus, { bar: string; text: string; bg: string }> = {
  aman: {
    bar: "bg-income",
    text: "text-income",
    bg: "bg-income/10",
  },
  waspada: {
    bar: "bg-yellow-500",
    text: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  over: {
    bar: "bg-expense",
    text: "text-expense",
    bg: "bg-expense/10",
  },
};

/** Skeleton loading */
function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 w-32 rounded bg-muted"></div>
      <div className="h-3 w-full rounded bg-muted"></div>
      <div className="h-3 w-24 rounded bg-muted"></div>
    </div>
  );
}

/** Format angka ke Rupiah singkat */
function formatRupiahShort(n: number): string {
  if (n >= 1_000_000) {
    return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  }
  if (n >= 1_000) {
    return `Rp ${(n / 1_000).toFixed(0)}rb`;
  }
  return `Rp ${n.toLocaleString("id-ID")}`;
}

/** Komponen progress bar budget */
export function BudgetProgressBar({
  month,
  monthLabel,
  onUsageUpdate,
}: BudgetProgressBarProps) {
  const [usage, setUsage] = useState<BudgetUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const onUsageUpdateRef = useRef(onUsageUpdate);
  const monthRef = useRef(month);

  // Keep refs updated
  useEffect(() => {
    onUsageUpdateRef.current = onUsageUpdate;
    monthRef.current = month;
  }, [onUsageUpdate, month]);

  // Fetch budget usage - defined inside effect to avoid the lint issue
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUsage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (monthRef.current) params.set("month", monthRef.current);

        const url = `/api/budgets/summary?${params.toString()}`;
        const res = await fetch(url, { signal });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Gagal memuat anggaran.");
        }

        const data = await res.json();
        setUsage(data.data);
        onUsageUpdateRef.current?.(data.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Gagal memuat anggaran.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();

    return () => controller.abort();
  }, []); // Run once on mount

  // Listen for budget update events (untuk refresh setelah CRUD)
  useEffect(() => {
    const handleBudgetUpdate = () => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchUsage = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const params = new URLSearchParams();
          if (monthRef.current) params.set("month", monthRef.current);

          const url = `/api/budgets/summary?${params.toString()}`;
          const res = await fetch(url, { signal });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Gagal memuat anggaran.");
          }

          const data = await res.json();
          setUsage(data.data);
          onUsageUpdateRef.current?.(data.data);
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
          const message =
            err instanceof Error ? err.message : "Gagal memuat anggaran.";
          setError(message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUsage();
    };

    window.addEventListener("budget-updated", handleBudgetUpdate);
    return () => {
      window.removeEventListener("budget-updated", handleBudgetUpdate);
    };
  }, []);

  // Retry handler
  const handleRetry = () => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUsage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (monthRef.current) params.set("month", monthRef.current);

        const url = `/api/budgets/summary?${params.toString()}`;
        const res = await fetch(url, { signal });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Gagal memuat anggaran.");
        }

        const data = await res.json();
        setUsage(data.data);
        onUsageUpdateRef.current?.(data.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Gagal memuat anggaran.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-lg border border-divider bg-surface p-4">
        <Skeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-expense/40 bg-expense/10 p-4">
        <p className="text-sm text-expense">{error}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-2 text-sm font-medium text-expense underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  // No budget set
  if (!usage?.budget) {
    return (
      <div className="rounded-lg border border-divider bg-surface p-4">
        <p className="text-sm text-subtle">
          Belum ada anggaran untuk {monthLabel || "bulan ini"}.
        </p>
        <a
          href="/budgets/new"
          className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
        >
          Tetapkan anggaran →
        </a>
      </div>
    );
  }

  const colors = statusColors[usage.status];
  const persenClamped = Math.min(usage.persen, 100);

  return (
    <div className="rounded-lg border border-divider bg-surface p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">
          Anggaran {monthLabel || usage.budget.month}
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
        >
          {usage.status === "over"
            ? "Melebihi"
            : usage.status === "waspada"
            ? "Waspada"
            : "Aman"}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
            style={{ width: `${persenClamped}%` }}
            role="progressbar"
            aria-valuenow={usage.persen}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Penggunaan anggaran ${usage.persen.toFixed(0)}%`}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <div>
          <span className="text-subtle">Terpakai: </span>
          <span className="font-semibold text-ink tabular-nums">
            {formatRupiahShort(usage.terpakai)}
          </span>
          <span className="text-subtle"> / </span>
          <span className="text-ink tabular-nums">
            {formatRupiahShort(usage.budget.amount)}
          </span>
        </div>
        <div className={`font-semibold tabular-nums ${colors.text}`}>
          {usage.persen.toFixed(0)}%
        </div>
      </div>

      {/* Sisa/Over info */}
      <div className="mt-2 text-sm">
        {usage.sisa >= 0 ? (
          <p className="text-subtle">
            Sisa: <span className="font-medium text-ink">{formatRupiahShort(usage.sisa)}</span>
          </p>
        ) : (
          <p className="text-expense">
            Kelebihan: <span className="font-medium">{formatRupiahShort(Math.abs(usage.sisa))}</span>
          </p>
        )}
      </div>
    </div>
  );
}

/** Helper untuk trigger refresh dari komponen lain */
export function triggerBudgetRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("budget-updated"));
  }
}
