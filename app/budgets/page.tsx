import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus, Target } from "lucide-react";
import { Navbar } from "@/components/duitku/Navbar";
import { listBudgets } from "@/lib/budgets/queries";
import { requireUser } from "@/lib/transactions/session";
import { formatBulan, rupiah } from "@/lib/dashboard/format";

export const metadata: Metadata = {
  title: "Anggaran Bulanan | DUITku",
  description: "Kelola anggaran pengeluaran bulananmu.",
};

export default async function BudgetsPage() {
  const { user } = await requireUser();
  const budgets = await listBudgets(user.id);
  const displayName =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Mahasiswa";

  return (
    <div className="min-h-screen bg-background">
      <Navbar displayName={displayName} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg py-1.5 text-sm font-semibold text-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-divider pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Anggaran Bulanan
            </h1>
            <p className="mt-1 text-sm text-subtle">
              Tetapkan batas pengeluaran per bulan dan pantau realisasinya.
            </p>
          </div>

          <Link
            href="/budgets/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Tambah Anggaran</span>
          </Link>
        </header>

        {budgets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-divider bg-surface px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
              <Target size={24} className="text-primary" />
            </div>
            <p className="mt-4 text-base font-semibold text-ink">
              Belum ada anggaran
            </p>
            <p className="mt-1 text-sm text-subtle">
              Mulai tetapkan anggaran bulanan untuk mengontrol pengeluaranmu.
            </p>
            <Link
              href="/budgets/new"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Buat Anggaran Pertama</span>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-divider rounded-xl border border-divider bg-surface shadow-sm">
            {budgets.map((budget) => (
              <li
                key={budget.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber"
                  >
                    <Target size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/budgets/${budget.month}/edit`}
                      className="block font-semibold text-ink hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {formatBulan(budget.month)}
                    </Link>
                    <p className="mt-0.5 text-sm text-subtle">
                      Dibuat pada {new Date(budget.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t border-divider sm:border-0">
                  <p className="text-base sm:text-lg font-bold text-ink tabular-nums">
                    {rupiah(budget.amount)}
                  </p>
                  <Link
                    href={`/budgets/${budget.month}/edit`}
                    className="inline-flex min-h-9 items-center rounded-md px-3 text-sm font-medium text-subtle transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Ubah
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
