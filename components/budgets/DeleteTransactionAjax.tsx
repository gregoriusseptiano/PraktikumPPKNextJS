"use client";

/**
 * DUITku — AJAX Delete Transaction (Programmer 2: feature/budget-transactions-ajax)
 *
 * SRS P2-17: Refactor DeleteTransactionButton ke mode AJAX: fetch DELETE + optimistic update + rollback error
 *
 * Acceptance: hapus transaksi langsung update bar tanpa refresh
 */

import { useState, useRef, useId } from "react";
import { triggerBudgetRefresh } from "./BudgetProgressBar";

/** Props untuk DeleteTransactionAjax */
export type DeleteTransactionAjaxProps = {
  /** ID transaksi */
  id: string;
  /** Label tombol */
  label?: string;
  /** Variant: link atau button */
  variant?: "link" | "danger";
  /** Callback setelah sukses */
  onSuccess?: () => void;
  /** Callback setelah error */
  onError?: (error: string) => void;
  /** Callback untuk optimistic update (opsional) */
  onOptimisticDelete?: () => void;
  /** Callback untuk rollback (opsional) */
  onRollback?: () => void;
};

/** Style untuk tombol */
const dangerButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-lg bg-expense px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-expense/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-expense disabled:cursor-not-allowed disabled:opacity-50";
const dangerLinkClass =
  "text-sm font-semibold text-expense transition-colors hover:text-expense/80";
const secondaryButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-lg border border-divider bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-muted/50";

const triggerStyles: Record<"link" | "danger", string> = {
  link: dangerLinkClass,
  danger: dangerButtonClass,
};

/** Komponen delete dengan konfirmasi dan AJAX */
export function DeleteTransactionAjax({
  id,
  label = "Hapus",
  variant = "link",
  onSuccess,
  onError,
  onOptimisticDelete,
  onRollback,
}: DeleteTransactionAjaxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Buka dialog
  const handleOpen = () => {
    setError(null);
    dialogRef.current?.showModal();
  };

  // Tutup dialog
  const handleClose = () => {
    setError(null);
    dialogRef.current?.close();
  };

  // Delete via AJAX
  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    // Optimistic update
    onOptimisticDelete?.();

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        // Rollback optimistic update
        onRollback?.();
        throw new Error(data.error || "Gagal menghapus transaksi.");
      }

      // Success
      handleClose();
      triggerBudgetRefresh();
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus transaksi.";
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        className={triggerStyles[variant]}
      >
        {label}
      </button>

      {/* Confirmation dialog */}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[calc(100vw-2rem)] max-w-sm rounded-[10px] border border-line bg-surface p-5 text-ink backdrop:bg-ink/40"
      >
        <h2 id={titleId} className="text-lg font-semibold">
          Hapus transaksi ini?
        </h2>
        <p className="mt-2 text-sm text-ink/70">
          Transaksi yang sudah dihapus tidak bisa dikembalikan.
        </p>

        {/* Error message */}
        {error && (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-expense/40 bg-expense/10 px-3 py-2 text-sm text-expense"
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className={secondaryButtonClass}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className={dangerButtonClass}
          >
            {isLoading ? "Menghapus..." : label}
          </button>
        </div>
      </dialog>
    </>
  );
}
