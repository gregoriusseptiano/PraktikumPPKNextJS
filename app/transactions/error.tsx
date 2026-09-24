"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { primaryButtonClass, secondaryButtonClass } from "@/components/transactions/styles";

export default function TransactionsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-expense/10 text-expense-deep font-bold text-xl">
        !
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">
        Terjadi Kesalahan
      </h1>
      <p className="mt-2 text-sm text-subtle">
        Data transaksi gagal dimuat. Silakan coba kembali atau kembali ke beranda.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className={`${primaryButtonClass} gap-2`}
        >
          <RefreshCw size={16} />
          <span>Coba Lagi</span>
        </button>
        <Link href="/dashboard" className={secondaryButtonClass}>
          <ArrowLeft size={16} className="mr-1.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </main>
  );
}
