import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { primaryButtonClass, secondaryButtonClass } from "@/components/transactions/styles";

export default function TransactionNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-xl">
        ?
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">
        Transaksi Tidak Ditemukan
      </h1>
      <p className="mt-2 text-sm text-subtle">
        Transaksi ini mungkin sudah dihapus atau bukan milik akun kamu.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/transactions" className={primaryButtonClass}>
          <ArrowLeft size={16} className="mr-1.5" />
          <span>Kembali ke Riwayat</span>
        </Link>
        <Link href="/dashboard" className={secondaryButtonClass}>
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
