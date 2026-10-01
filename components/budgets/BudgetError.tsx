"use client";

/**
 * DUITku — Pertemuan 5, Programmer 3: feature/budget-dashboard-security
 *
 * UI error + skeleton generik untuk widget budget (SRS P3-20, NFR-04).
 * Objek error TIDAK pernah dirender (tanpa query/stack/secret),
 * mengikuti pola DESIGN.md §7 seperti dashboard/error.tsx.
 */

export function BudgetError({
  title = "Gagal memuat anggaran.",
  onRetry,
}: {
  title?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-expense/30 bg-expense/10 px-4 py-3"
    >
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-subtle">
        Periksa koneksimu lalu coba lagi.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-header px-4 text-sm font-semibold text-on-header focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Coba lagi
        </button>
      ) : null}
    </div>
  );
}

export function BudgetWidgetSkeleton({ label = "Memuat anggaran" }: { label?: string }) {
  return (
    <div
      aria-label={label}
      aria-busy="true"
      className="animate-pulse rounded-xl border border-divider bg-surface p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-ink/10" />
        <div className="h-4 w-16 rounded bg-ink/10" />
      </div>
      <div className="mt-4 h-8 w-44 rounded bg-ink/10" />
      <div className="mt-3 h-2.5 w-full rounded-full bg-ink/10" />
      <div className="mt-3 flex justify-between">
        <div className="h-3 w-24 rounded bg-ink/10" />
        <div className="h-3 w-20 rounded bg-ink/10" />
      </div>
    </div>
  );
}
