import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/duitku/Navbar";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { createBudgetAction } from "@/lib/budgets/actions";
import { requireUser } from "@/lib/transactions/session";
import { currentMonthKey } from "@/lib/dashboard/format";

export const metadata: Metadata = {
  title: "Tambah Anggaran | DUITku",
};

export default async function NewBudgetPage() {
  const { user } = await requireUser();
  const displayName =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Mahasiswa";

  return (
    <div className="min-h-screen bg-background">
      <Navbar displayName={displayName} />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <Link
            href="/budgets"
            className="inline-flex items-center gap-2 rounded-lg py-1.5 text-sm font-semibold text-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
            <span>Kembali ke Daftar Anggaran</span>
          </Link>
        </div>

        <div className="border-b border-divider pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Tambah Anggaran Baru
          </h1>
          <p className="mt-1 text-sm text-subtle">
            Tetapkan batas pengeluaran untuk satu bulan tertentu.
          </p>
        </div>

        <BudgetForm
          action={createBudgetAction}
          initial={{
            month: currentMonthKey(),
            amount: "",
          }}
          submitLabel="Simpan Anggaran"
          cancelHref="/budgets"
        />
      </main>
    </div>
  );
}
