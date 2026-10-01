/**
 * DUITku — Budget Usage DAL (Programmer 2: feature/budget-transactions-ajax)
 *
 * SRS P2-14: getBudgetUsage(userId, month) = join budgets + SUM expense monthRange
 * Return {budget, terpakai, sisa, persen, status}
 *
 * Keamanan (SRS NFR-02, NFR-03, NFR-04):
 * - userId diambil dari session server, tidak pernah dari input client
 * - month divalidasi format "YYYY-MM"
 * - Error DB dicatat di log server saja; ke pemanggil hanya pesan generik
 */

import { createClient } from "@/lib/supabase/server";
import { isValidMonth, monthRange } from "@/lib/dashboard/format";
import type { BudgetDTO, BudgetUsage, BudgetStatus } from "./types";
import { toBudgetDTO, toBudgetDTOList } from "./types";

/** Pesan generik untuk kegagalan data (SRS NFR-04). */
export const BUDGET_ERROR_MESSAGE = "Gagal memuat data anggaran. Coba lagi.";

/**
 * Validasi format month "YYYY-MM".
 */
export function isValidBudgetMonth(value: unknown): value is string {
  return isValidMonth(value);
}

/**
 * Tentukan status berdasarkan persentase penggunaan.
 * aman < 80%, waspada 80-99%, over >= 100%
 */
export function computeBudgetStatus(persen: number): BudgetStatus {
  if (persen >= 100) return "over";
  if (persen >= 80) return "waspada";
  return "aman";
}

/**
 * Hitung penggunaan budget untuk user dan bulan tertentu.
 *
 * Rumus (SRS §13.2):
 * - terpakai = SUM(transactions.amount WHERE user_id AND type='expense' AND transaction_date IN monthRange(month))
 * - sisa = budget.amount - terpakai
 * - persen = terpakai / amount * 100
 * - status = aman (<80%) | waspada (80-99%) | over (>=100%)
 *
 * @param userId - ID user dari session (bukan dari client)
 * @param month - Kunci bulan "YYYY-MM"
 * @returns BudgetUsage dengan budget (null bila belum ada), terpakai, sisa, persen, status
 */
export async function getBudgetUsage(
  userId: string,
  month: string
): Promise<BudgetUsage> {
  // Validasi month
  if (!isValidBudgetMonth(month)) {
    return {
      budget: null,
      terpakai: 0,
      sisa: 0,
      persen: 0,
      status: "aman",
    };
  }

  const { start, end } = monthRange(month);

  try {
    const supabase = await createClient();

    // Query budget dan expense secara paralel
    const [budgetRes, expenseRes] = await Promise.all([
      supabase
        .from("budgets")
        .select("id, user_id, month, amount, created_at, updated_at")
        .eq("user_id", userId)
        .eq("month", month)
        .maybeSingle(),
      supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", userId)
        .eq("type", "expense")
        .gte("transaction_date", start)
        .lte("transaction_date", end),
    ]);

    // Log error tapi jangan bocorkan ke client
    if (budgetRes.error) {
      console.error("[budgets] getBudgetUsage budget error:", budgetRes.error.message);
    }
    if (expenseRes.error) {
      console.error("[budgets] getBudgetUsage expense error:", expenseRes.error.message);
    }

    // Parse budget (DB snake_case -> DTO camelCase)
    let budget: BudgetDTO | null = null;
    if (budgetRes.data) {
      budget = toBudgetDTO({
        id: budgetRes.data.id,
        user_id: budgetRes.data.user_id,
        month: budgetRes.data.month,
        amount: budgetRes.data.amount,
        created_at: budgetRes.data.created_at,
        updated_at: budgetRes.data.updated_at,
      });
    }

    // Hitung total expense
    let terpakai = 0;
    if (expenseRes.data && Array.isArray(expenseRes.data)) {
      for (const row of expenseRes.data) {
        const amount =
          typeof row.amount === "string" ? Number(row.amount) : row.amount;
        if (Number.isFinite(amount) && amount > 0) {
          terpakai += amount;
        }
      }
    }

    // Round ke 2 desimal
    terpakai = Math.round(terpakai * 100) / 100;

    // Hitung sisa, persen, status
    const budgetAmount = budget?.amount ?? 0;
    const sisa = Math.round((budgetAmount - terpakai) * 100) / 100;
    const persen =
      budgetAmount > 0
        ? Math.round((terpakai / budgetAmount) * 10000) / 100
        : 0;
    const status = computeBudgetStatus(persen);

    return {
      budget,
      terpakai,
      sisa,
      persen,
      status,
    };
  } catch (err) {
    console.error("[budgets] getBudgetUsage failed:", err);
    throw new Error(BUDGET_ERROR_MESSAGE);
  }
}

/**
 * Ambil daftar budget milik user (DTO camelCase).
 * Catatan: `lib/budgets/queries.ts` punya `listBudgets` sejenis untuk
 * baris DB snake_case (dipakai halaman /budgets P1); fungsi ini versi DTO
 * untuk komponen AJAX P2. Keduanya query tabel yang sama.
 */
export async function listBudgets(userId: string): Promise<BudgetDTO[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("budgets")
      .select("id, user_id, month, amount, created_at, updated_at")
      .eq("user_id", userId)
      .order("month", { ascending: false });

    if (error) {
      console.error("[budgets] listBudgets error:", error.message);
      throw new Error(BUDGET_ERROR_MESSAGE);
    }

    if (!data || !Array.isArray(data)) return [];

    return toBudgetDTOList(
      data.map((row) => ({
        id: row.id,
        user_id: row.user_id,
        month: row.month,
        amount: row.amount,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }))
    );
  } catch (err) {
    console.error("[budgets] listBudgets failed:", err);
    throw new Error(BUDGET_ERROR_MESSAGE);
  }
}
