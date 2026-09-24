"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import {
  INITIAL_TRANSACTION_ACTION_STATE,
  type TransactionActionState,
  type TransactionFormValues,
} from "@/lib/transactions/types";
import { primaryButtonClass, secondaryButtonClass } from "./styles";

type TransactionFormProps = {
  action: (
    state: TransactionActionState,
    formData: FormData
  ) => Promise<TransactionActionState>;
  initial: TransactionFormValues;
  submitLabel: string;
  cancelHref: string;
};

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

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-expense">
      {children}
    </p>
  );
}

export function TransactionForm({
  action,
  initial,
  submitLabel,
  cancelHref,
}: TransactionFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_TRANSACTION_ACTION_STATE
  );
  const errors = state.fieldErrors;

  return (
    <form
      action={formAction}
      noValidate
      className="mt-6 space-y-5 rounded-[10px] border border-line bg-surface p-5 sm:p-6"
    >
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
              defaultChecked={initial.type === "income"}
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
              defaultChecked={initial.type === "expense"}
              className="size-4 accent-expense"
            />
            Pengeluaran
          </label>
        </div>
        {errors.type ? <FieldError id="type-error">{errors.type}</FieldError> : null}
      </fieldset>

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
            defaultValue={initial.amount}
            aria-invalid={errors.amount ? true : undefined}
            aria-describedby={errors.amount ? "amount-error" : undefined}
            className={`${inputClass} pl-10 text-right tabular-nums`}
          />
        </div>
        {errors.amount ? (
          <FieldError id="amount-error">{errors.amount}</FieldError>
        ) : null}
      </div>

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
          defaultValue={initial.category}
          aria-invalid={errors.category ? true : undefined}
          aria-describedby={errors.category ? "category-error" : undefined}
          className={`${inputClass} mt-2`}
        />
        <datalist id="category-suggestions">
          {CATEGORY_SUGGESTIONS.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
        {errors.category ? (
          <FieldError id="category-error">{errors.category}</FieldError>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Deskripsi (opsional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={200}
          defaultValue={initial.description}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? "description-error" : undefined}
          className={`${inputClass} mt-2 resize-y`}
        />
        {errors.description ? (
          <FieldError id="description-error">{errors.description}</FieldError>
        ) : null}
      </div>

      <div>
        <label htmlFor="transaction_date" className={labelClass}>
          Tanggal
        </label>
        <input
          id="transaction_date"
          name="transaction_date"
          type="date"
          required
          defaultValue={initial.transaction_date}
          aria-invalid={errors.transaction_date ? true : undefined}
          aria-describedby={
            errors.transaction_date ? "transaction-date-error" : undefined
          }
          className={`${inputClass} mt-2`}
        />
        {errors.transaction_date ? (
          <FieldError id="transaction-date-error">
            {errors.transaction_date}
          </FieldError>
        ) : null}
      </div>

      {state.formError ? (
        <p
          role="alert"
          className="rounded-lg border border-expense/40 bg-expense/10 px-3 py-2 text-sm text-expense"
        >
          {state.formError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <Link href={cancelHref} className={secondaryButtonClass}>
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className={primaryButtonClass}
        >
          {isPending ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
