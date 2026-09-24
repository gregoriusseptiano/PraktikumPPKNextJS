import Link from "next/link";
import { primaryButtonClass } from "@/components/transactions/styles";

export default function TransactionNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-start px-4 py-16 sm:py-24">
      <p className="text-sm font-medium text-duit">DUITku</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        Transaksi tidak ditemukan
      </h1>
      <p className="mt-2 text-[15px] text-ink/70">
        Transaksi ini tidak ada atau bukan milikmu.
      </p>
      <Link href="/transactions" className={`${primaryButtonClass} mt-6`}>
        Kembali ke riwayat
      </Link>
    </main>
  );
}
