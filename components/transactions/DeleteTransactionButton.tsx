"use client";

import { useActionState, useId, useRef } from "react";
import { deleteTransactionAction } from "@/lib/transactions/actions";
import { INITIAL_TRANSACTION_ACTION_STATE } from "@/lib/transactions/types";
import {
  dangerButtonClass,
  dangerLinkClass,
  secondaryButtonClass,
} from "./styles";

type DeleteTransactionButtonProps = {
  id: string;
  label?: string;
  variant?: "link" | "danger";
};

const triggerStyles: Record<"link" | "danger", string> = {
  link: dangerLinkClass,
  danger: dangerButtonClass,
};

export function DeleteTransactionButton({
  id,
  label = "Hapus",
  variant = "link",
}: DeleteTransactionButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [state, formAction, isPending] = useActionState(
    deleteTransactionAction.bind(null, id),
    INITIAL_TRANSACTION_ACTION_STATE
  );

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={triggerStyles[variant]}
      >
        {label}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[calc(100vw-2rem)] max-w-sm rounded-[10px] border border-line bg-surface p-5 text-ink backdrop:bg-ink/40"
      >
        <form action={formAction}>
          <h2 id={titleId} className="text-lg font-semibold">
            Hapus transaksi ini?
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            Transaksi yang sudah dihapus tidak bisa dikembalikan.
          </p>

          {state.formError ? (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-expense/40 bg-expense/10 px-3 py-2 text-sm text-expense"
            >
              {state.formError}
            </p>
          ) : null}

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className={secondaryButtonClass}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={dangerButtonClass}
            >
              {isPending ? "Menghapus..." : label}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
