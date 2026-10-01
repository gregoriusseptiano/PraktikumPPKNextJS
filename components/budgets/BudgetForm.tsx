"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import {
  INITIAL_BUDGET_ACTION_STATE,
  type BudgetActionState,
  type BudgetFormValues,
} from "@/lib/budgets/types";
import { primaryButtonClass, secondaryButtonClass } from "@/components/transactions/styles";

type BudgetFormProps = {
  action: (
    state: BudgetActionState,
    formData: FormData
  ) => Promise<BudgetActionState>;
  initial: BudgetFormValues;
  submitLabel: string;
  cancelHref: string;
};

const labelClass = "block text-sm font-medium text-ink";

const inputClass =
  "block w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-[15px] text-ink transition-colors placeholder:text-ink/40 focus:border-duit focus:outline-2 focus:outline-offset-1 focus:outline-duit";

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-expense">
      {children}
    </p>
  );
}

export function BudgetForm({
  action,
  initial,
  submitLabel,
  cancelHref,
}: BudgetFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_BUDGET_ACTION_STATE
  );
  const errors = state.fieldErrors;

  return (
    <form
      action={formAction}
      noValidate
      className="mt-6 space-y-5 rounded-[10px] border border-line bg-surface p-5 sm:p-6"
    >
      <div>
        <label htmlFor="month" className={labelClass}>
          Bulan
        </label>
        <input
          id="month"
          name="month"
          type="month"
          required
          defaultValue={initial.month}
          aria-invalid={errors.month ? true : undefined}
          aria-describedby={errors.month ? "month-error" : undefined}
          className={`${inputClass} mt-2`}
        />
        {errors.month ? (
          <FieldError id="month-error">{errors.month}</FieldError>
        ) : null}
      </div>

      <div>
        <label htmlFor="amount" className={labelClass}>
          Nominal Anggaran
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
