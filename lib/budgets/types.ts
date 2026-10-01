/**
 * DUITku — Budget Types (gabungan Pertemuan 5)
 *
 * - Bentuk snake_case (`Budget`) = baris DB Supabase `public.budgets`,
 *   dipakai Programmer 1: queries/actions/pages/BudgetForm (P1-15..P1-20).
 * - Bentuk camelCase (`BudgetDTO`) = DTO aman untuk Client Component /
 *   response JSON, dipakai Programmer 2: usage/DAL + AJAX (P2-14..P2-18).
 * - `BudgetInput` identik di kedua branch, didefinisikan sekali.
 * - Hanya field aman yang diteruskan ke client (SRS NFR-04).
 */

/** Baris DB `public.budgets` (P1: queries/actions). */
export type Budget = {
  id: string;
  user_id: string;
  month: string; // "YYYY-MM"
  amount: number;
  created_at: string;
  updated_at: string;
};

/** DTO camelCase untuk client/API (P2: usage + AJAX). */
export interface BudgetDTO {
  id: string;
  userId: string;
  month: string; // "YYYY-MM"
  amount: number;
  createdAt: string;
  updatedAt: string;
}

/** Input untuk membuat/mengubah budget (dipakai P1 & P2). */
export interface BudgetInput {
  month: string;
  amount: number;
}

/** Status penggunaan budget berdasarkan persentase. */
export type BudgetStatus = "aman" | "waspada" | "over";

/** Hasil perhitungan penggunaan budget (SRS P2-14). */
export interface BudgetUsage {
  /** Data budget (null bila belum ada budget untuk bulan tersebut). */
  budget: BudgetDTO | null;
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

export type BudgetFieldErrors = Partial<{
  month: string;
  amount: string;
}>;

export type BudgetActionState = {
  fieldErrors: BudgetFieldErrors;
  formError: string | null;
};

export const INITIAL_BUDGET_ACTION_STATE: BudgetActionState = {
  fieldErrors: {},
  formError: null,
};

export type BudgetFormValues = {
  month: string;
  amount: string;
};

/** Ubah baris DB snake_case menjadi DTO camelCase (toleran numeric string). */
export function toBudgetDTO(row: Budget): BudgetDTO {
  const rawAmount =
    typeof row.amount === "string" ? Number(row.amount) : row.amount;
  return {
    id: row.id,
    userId: row.user_id,
    month: row.month,
    amount: Number.isFinite(rawAmount as number)
      ? (rawAmount as number)
      : 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Ubah daftar baris DB menjadi DTO. */
export function toBudgetDTOList(rows: Budget[]): BudgetDTO[] {
  return rows.map(toBudgetDTO);
}
