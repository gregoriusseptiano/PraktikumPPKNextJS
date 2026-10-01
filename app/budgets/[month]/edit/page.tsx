import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/duitku/Navbar";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { DeleteBudgetButton } from "@/components/budgets/DeleteBudgetButton";
import { updateBudgetAction } from "@/lib/budgets/actions";
import { getBudget } from "@/lib/budgets/queries";
import { requireUser } from "@/lib/transactions/session";
import { isValidMonth } from "@/lib/budgets/validation";

export const metadata: Metadata = {
  title: "Ubah Anggaran | DUITku",
};

export default async function EditBudgetPage({
  params,
}: PageProps<"/budgets/[month]/edit">) {
  const { user } = await requireUser();
  const { month } = await params;

  if (!isValidMonth(month)) {
    notFound();
  }

  const budget = await getBudget(user.id, month);

  if (!budget) {
    notFound();
  }

  const displayName =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Mahasiswa";

  return (
    <div className="min-h-screen bg-background">
      <Navbar displayName={displayName} />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-4">
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
            Ubah Anggaran
          </h1>
          <p className="mt-1 text-sm text-subtle">
            Perbarui nominal anggaran untuk bulan ini.
          </p>
        </div>

        <BudgetForm
          action={updateBudgetAction.bind(null, month)}
          initial={{
            month: budget.month,
            amount: String(budget.amount),
          }}
          submitLabel="Simpan Perubahan"
          cancelHref="/budgets"
        />

        <div className="rounded-lg border border-divider bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">Zona Berbahaya</h2>
          <p className="mt-1 text-sm text-subtle">
            Hapus anggaran ini secara permanen. Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="mt-4">
            <DeleteBudgetButton month={month} />
          </div>
        </div>
      </main>
    </div>
  );
}
