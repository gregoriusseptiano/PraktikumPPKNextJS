import type { Metadata } from "next";
import Link from "next/link";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { backLinkClass } from "@/components/transactions/styles";
import { createTransactionAction } from "@/lib/transactions/actions";
import { todayISO } from "@/lib/transactions/format";
import { requireUser } from "@/lib/transactions/session";

export const metadata: Metadata = {
  title: "Catat transaksi | DUITku",
};

export default async function NewTransactionPage({
  searchParams,
}: PageProps<"/transactions/new">) {
  await requireUser();
  const params = await searchParams;
  const type = params.type === "income" ? "income" : "expense";

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <Link href="/transactions" className={backLinkClass}>
        Kembali ke riwayat
      </Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        Catat transaksi
      </h1>
      <TransactionForm
        action={createTransactionAction}
        initial={{
          type,
          amount: "",
          category: "",
          description: "",
          transaction_date: todayISO(),
        }}
        submitLabel="Simpan transaksi"
        cancelHref="/transactions"
      />
    </main>
  );
}
