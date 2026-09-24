"use client";

import { primaryButtonClass } from "@/components/transactions/styles";

export default function TransactionsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-start px-4 py-16 sm:py-24">
      <p className="text-sm font-medium text-duit">DUITku</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        Terjadi kesalahan
      </h1>
      <p className="mt-2 text-[15px] text-ink/70">
        Data transaksi gagal dimuat. Coba lagi sebentar lagi.
      </p>
      <button type="button" onClick={reset} className={`${primaryButtonClass} mt-6`}>
        Coba lagi
      </button>
    </main>
  );
}
