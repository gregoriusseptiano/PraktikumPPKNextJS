"use client";

import { useActionState } from "react";
import { deleteBudgetAction } from "@/lib/budgets/actions";
import { INITIAL_BUDGET_ACTION_STATE } from "@/lib/budgets/types";
import { dangerButtonClass } from "@/components/transactions/styles";

type DeleteBudgetButtonProps = {
  month: string;
};

export function DeleteBudgetButton({ month }: DeleteBudgetButtonProps) {
  const [state, formAction, isPending] = useActionState(
    deleteBudgetAction.bind(null, month),
    INITIAL_BUDGET_ACTION_STATE
  );

  return (
    <>
      <form action={formAction} className="inline">
        <button
          type="submit"
          disabled={isPending}
          className={dangerButtonClass}
        >
          {isPending ? "Menghapus..." : "Hapus Anggaran"}
        </button>
      </form>

      {state.formError ? (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-expense/40 bg-expense/10 px-3 py-2 text-sm text-expense"
        >
          {state.formError}
        </p>
      ) : null}
    </>
  );
}
