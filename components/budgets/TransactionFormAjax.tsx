"use client";

/**
 * DUITku — AJAX Transaction Form (Programmer 2: feature/budget-transactions-ajax)
 *
 * SRS P2-17: Refactor TransactionForm ke mode AJAX: fetch POST + optimistic update + rollback error
 * Tetap fallback Server Action untuk backward compatibility
 *
 * Acceptance: tambah transaksi langsung update bar tanpa refresh
 */

import { useState, useCallback, useTransition } from "react";
import type {
  TransactionFormValues,
  TransactionFieldErrors,
} from "@/lib/transactions/types";
import { triggerBudgetRefresh } from "./BudgetProgressBar";

/** Props untuk TransactionFormAjax */
export type TransactionFormAjaxProps = {
  /** Mode form: create atau edit */
  mode: "create" | "edit";
  /** ID transaksi (untuk edit mode) */
  transactionId?: string;
  /** Nilai awal form */
  initial: TransactionFormValues;
  /** Redirect setelah sukses */
  redirectHref?: string;
  /** Callback setelah sukses */
  onSuccess?: (transactionId?: string) => void;
  /** Callback setelah error */
  onError?: (error: string) => void;
  /** Callback ketika tombol batal ditekan */
  onCancel?: () => void;
  /** Label kustom untuk tombol submit */
  submitLabel?: string;
};

/** Style untuk input */
const labelClass = "block text-sm font-medium text-ink";
const inputClass =
  "block w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-[15px] text-ink transition-colors placeholder:text-ink/40 focus:border-duit focus:outline-2 focus:outline-offset-1 focus:outline-duit";
const radioCardBase =
  "flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors hover:border-ink/30 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-duit";

const CATEGORY_SUGGESTIONS = [
  "Makan",
  "Transportasi",
  "Kos",
  "Belanja",
  "Hiburan",
  "Pendidikan",
  "Kesehatan",
  "Lainnya",
];

/** Komponen form transaksi dengan AJAX */
export function TransactionFormAjax({
  mode,
  transactionId,
  initial,
  redirectHref,
  onSuccess,
  onError,
  onCancel,
  submitLabel,
}: TransactionFormAjaxProps) {
  const [form, setForm] = useState<TransactionFormValues>(initial);
  const [fieldErrors, setFieldErrors] = useState<TransactionFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name as keyof TransactionFieldErrors];
      return next;
    });
  };

  // Handle type change
  const handleTypeChange = (type: "income" | "expense") => {
    setForm((prev) => ({ ...prev, type }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.type;
      return next;
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: TransactionFieldErrors = {};

    if (!form.type) {
      errors.type = "Pilih jenis transaksi.";
    }

    const amount = Number(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      errors.amount = "Nominal harus lebih dari 0.";
    }

    if (!form.category.trim()) {
      errors.category = "Kategori wajib diisi.";
    }

    if (!form.transaction_date) {
      errors.transaction_date = "Tanggal wajib diisi.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit via AJAX
  const submitAjax = useCallback(async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const url =
        mode === "edit" && transactionId
          ? `/api/transactions/${transactionId}`
          : "/api/transactions";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          amount: Number(form.amount),
          category: form.category.trim(),
          description: form.description.trim(),
          transaction_date: form.transaction_date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        } else {
          throw new Error(data.error || "Gagal menyimpan transaksi.");
        }
        return;
      }

      // Success - trigger budget refresh
      triggerBudgetRefresh();

      // Reset form if create and staying on same view
      if (mode === "create" && !redirectHref) {
        setForm(initial);
        setFieldErrors({});
      }

      // Callback
      onSuccess?.(data.data?.id);

      // Redirect jika diperlukan
      if (redirectHref) {
        startTransition(() => {
          window.location.href = redirectHref;
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan transaksi.";
      setFormError(message);
      onError?.(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, mode, transactionId, redirectHref, onSuccess, onError, initial]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await submitAjax();
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-6 space-y-5 rounded-[10px] border border-line bg-surface p-5 sm:p-6"
    >
      {/* Type */}
      <fieldset>
        <legend className={labelClass}>Jenis transaksi</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label
            className={`${radioCardBase} has-[:checked]:border-duit has-[:checked]:bg-duit/10`}
          >
            <input
              type="radio"
              name="type"
              value="income"
              checked={form.type === "income"}
              onChange={() => handleTypeChange("income")}
              className="size-4 accent-duit"
            />
            Pemasukan
          </label>
          <label
            className={`${radioCardBase} has-[:checked]:border-expense has-[:checked]:bg-expense/10`}
          >
            <input
              type="radio"
              name="type"
              value="expense"
              checked={form.type === "expense"}
              onChange={() => handleTypeChange("expense")}
              className="size-4 accent-expense"
            />
            Pengeluaran
          </label>
        </div>
        {fieldErrors.type && (
          <p role="alert" className="mt-1.5 text-sm text-expense">
            {fieldErrors.type}
          </p>
        )}
      </fieldset>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className={labelClass}>
          Nominal
        </label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-ink/60">
            Rp
          </span>
          <input
            id="amount"
            name="amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            required
            value={form.amount}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.amount}
            aria-describedby={fieldErrors.amount ? "amount-error" : undefined}
            className={`${inputClass} pl-10 text-right tabular-nums`}
          />
        </div>
        {fieldErrors.amount && (
          <p id="amount-error" role="alert" className="mt-1.5 text-sm text-expense">
            {fieldErrors.amount}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className={labelClass}>
          Kategori
        </label>
        <input
          id="category"
          name="category"
          type="text"
          required
          maxLength={50}
          list="category-suggestions"
          value={form.category}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.category}
          aria-describedby={fieldErrors.category ? "category-error" : undefined}
          className={`${inputClass} mt-2`}
        />
        <datalist id="category-suggestions">
          {CATEGORY_SUGGESTIONS.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
        {fieldErrors.category && (
          <p id="category-error" role="alert" className="mt-1.5 text-sm text-expense">
            {fieldErrors.category}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Deskripsi (opsional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={200}
          value={form.description}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.description}
          aria-describedby={
            fieldErrors.description ? "description-error" : undefined
          }
          className={`${inputClass} mt-2 resize-y`}
        />
        {fieldErrors.description && (
          <p id="description-error" role="alert" className="mt-1.5 text-sm text-expense">
            {fieldErrors.description}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <label htmlFor="transaction_date" className={labelClass}>
          Tanggal
        </label>
        <input
          id="transaction_date"
          name="transaction_date"
          type="date"
          required
          value={form.transaction_date}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.transaction_date}
          aria-describedby={
            fieldErrors.transaction_date ? "transaction-date-error" : undefined
          }
          className={`${inputClass} mt-2`}
        />
        {fieldErrors.transaction_date && (
          <p id="transaction-date-error" role="alert" className="mt-1.5 text-sm text-expense">
            {fieldErrors.transaction_date}
          </p>
        )}
      </div>

      {/* Form error */}
      {formError && (
        <p
          role="alert"
          className="rounded-lg border border-expense/40 bg-expense/10 px-3 py-2 text-sm text-expense"
        >
          {formError}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        {redirectHref ? (
          <a
            href={redirectHref}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-divider bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-muted/50"
          >
            Batal
          </a>
        ) : onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-divider bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-muted/50 cursor-pointer"
          >
            Batal
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isLoading
            ? "Menyimpan..."
            : submitLabel || (mode === "edit" ? "Simpan" : "Tambah")}
        </button>
      </div>
    </form>
  );
}
