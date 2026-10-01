/**
 * DUITku — Budget Types (Programmer 2: feature/budget-transactions-ajax)
 *
 * DTO untuk budget dan usage. Hanya field aman yang boleh
 * diteruskan ke Client Component / response JSON (SRS NFR-04).
 */

/** Status penggunaan budget berdasarkan persentase. */
export type BudgetStatus = "aman" | "waspada" | "over";

/** Data budget milik user untuk satu bulan. */
export interface Budget {
  id: string;
  userId: string;
  month: string; // "YYYY-MM"
  amount: number;
  createdAt: string;
  updatedAt: string;
}

/** Input untuk membuat/mengubah budget. */
export interface BudgetInput {
  month: string;
  amount: number;
}

/** Hasil perhitungan penggunaan budget (SRS P2-14). */
export interface BudgetUsage {
  /** Data budget (null bila belum ada budget untuk bulan tersebut). */
  budget: Budget | null;
  /** Total expense bulan tersebut milik user. */
  terpakai: number;
  /** Sisa anggaran (bisa negatif jika over). */
  sisa: number;
  /** Persentase penggunaan (0-100+, bisa >100 jika over). */
  persen: number;
  /** Status berdasarkan persentase: aman <80%, waspada 80-99%, over >=100%. */
  status: BudgetStatus;
}

/** Payload untuk API /api/budgets/summary. */
export interface BudgetSummaryResponse {
  ok: true;
  data: BudgetUsage;
}

/** Payload untuk API /api/transactions/list. */
export interface TransactionListResponse {
  ok: true;
  data: {
    transactions: import("../transactions/types").Transaction[];
    total: number;
  };
}

/** Parameter filter untuk list transaksi AJAX. */
export interface TransactionListParams {
  type?: "income" | "expense" | "all";
  q?: string;
  month?: string; // "YYYY-MM"
}
