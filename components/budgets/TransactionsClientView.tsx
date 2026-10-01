"use client";

/**
 * DUITku — Client View Riwayat Transaksi (Programmer 2: feature/budget-transactions-ajax)
 *
 * Mengintegrasikan AJAX Filter, AJAX Form Modal, AJAX Delete, dan BudgetProgressBar
 * sehingga filter, tambah transaksi, dan hapus transaksi berjalan instan tanpa reload.
 */

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { BudgetProgressBar } from "./BudgetProgressBar";
import { TransactionFilterAjax } from "./TransactionFilterAjax";
import { TransactionFormAjax } from "./TransactionFormAjax";
import { todayISO } from "@/lib/transactions/format";
import type { Transaction, TransactionFilter } from "@/lib/transactions/types";

export type TransactionsClientViewProps = {
  initialFilter?: TransactionFilter;
  initialTransactions?: Transaction[];
};

export function TransactionsClientView({
  initialFilter = "all",
  initialTransactions = [],
}: TransactionsClientViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-divider pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Riwayat Transaksi
          </h1>
          <p className="mt-1 text-sm text-subtle">
            Daftar seluruh catatan pemasukan dan pengeluaran kamu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Catat Transaksi</span>
        </button>
      </header>

      {/* Pantauan Anggaran Bulanan (Progress Bar) */}
      <section aria-label="Pantauan Anggaran Bulanan">
        <BudgetProgressBar />
      </section>

      {/* AJAX Filter, Search & Transaksi */}
      <section aria-label="Daftar transaksi">
        <TransactionFilterAjax
          initialType={initialFilter}
          initialTransactions={initialTransactions}
          initialTotal={initialTransactions.length}
        />
      </section>

      {/* Modal Dialog Catat Transaksi Baru (AJAX) */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-add-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-divider bg-surface p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-divider pb-4">
              <div>
                <h2 id="modal-add-title" className="text-xl font-bold text-ink">
                  Catat Transaksi Baru
                </h2>
                <p className="mt-0.5 text-xs text-subtle">
                  Simpan langsung tanpa memuat ulang halaman.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-subtle hover:bg-muted/50 hover:text-ink transition-colors cursor-pointer"
                aria-label="Tutup formulir"
              >
                <X size={20} />
              </button>
            </div>

            <TransactionFormAjax
              mode="create"
              initial={{
                type: "expense",
                amount: "",
                category: "",
                description: "",
                transaction_date: todayISO(),
              }}
              submitLabel="Simpan Transaksi"
              onSuccess={() => setIsModalOpen(false)}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
