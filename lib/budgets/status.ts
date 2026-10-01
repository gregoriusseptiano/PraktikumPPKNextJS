/**
 * DUITku — Pertemuan 5, Programmer 3: feature/budget-dashboard-security
 *
 * Status pantauan budget bulanan (SRS P3-17, P3-18, FR-23..FR-28).
 * Fungsi MURNI (tanpa I/O): diuji via `node --test` (SRS P3-21).
 *
 * Batasan kepemilikan (jangan lebih, jangan kurang):
 * - P1 (feature/budget-model) memiliki skema `budgets`, validasi
 *   `isValidMonth`/amount, Server Actions + REST API CRUD.
 * - P2 (feature/budget-transactions-ajax) memiliki `getBudgetUsage()`
 *   (join budgets + SUM expense) dan `GET /api/budgets/summary`.
 * - File ini HANYA menurunkan status tampilan dari angka yang sudah
 *   dihitung: `aman <80% | waspada 80-99% | over >=100%` (SRS §13.2).
 *   Tidak menyentuh database, session, atau validasi input.
 */

export const BUDGET_WARNING_THRESHOLD = 0.8;
export const BUDGET_OVER_THRESHOLD = 1;

/** Status pantauan budget (SRS §13.2). */
export type BudgetStatus = "aman" | "waspada" | "over";

/** Hasil turunan untuk widget/banner (terpakai sudah dihitung P2). */
export interface BudgetUsageView {
  /** Anggaran bulan ini (Rp). */
  budget: number;
  /** Realisasi expense bulan ini milik user aktif (Rp). */
  terpakai: number;
  /** Sisa = budget - terpakai (boleh negatif saat over). */
  sisa: number;
  /** Rasio terpakai / budget (mis. 0.8 = 80%). */
  persen: number;
  status: BudgetStatus;
}

function toPositiveNumber(value: unknown): number | null {
  const num = typeof value === "string" ? Number(value.trim()) : Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.round(num * 100) / 100;
}

function toNonNegativeNumber(value: unknown): number | null {
  const num = typeof value === "string" ? Number(value.trim()) : Number(value);
  if (!Number.isFinite(num) || num < 0) return null;
  return Math.round(num * 100) / 100;
}

/**
 * Turunkan status dari rasio 0..n (SRS §13.2).
 * Input invalid/negatif dianggap 0 (aman) agar tidak merusak UI;
 * validasi input tetap milik P1/P2 (SRS P3-13, NFR-03).
 */
export function getBudgetStatus(persen: unknown): BudgetStatus {
  const num = typeof persen === "string" ? Number(persen.trim()) : Number(persen);
  if (!Number.isFinite(num) || num >= BUDGET_OVER_THRESHOLD) {
    // NaN/Infinity diperlakukan sebagai over? Tidak: input invalid
    // seharusnya tidak terjadi (P2 sudah validasi). Aman = jangan
    // menakuti user karena data rusak; tapi >=100% jelas over.
    if (!Number.isFinite(num)) return "aman";
    return "over";
  }
  if (num >= BUDGET_WARNING_THRESHOLD) return "waspada";
  return "aman";
}

/**
 * Hitung sisa/persen/status dari angka jadi.
 * Mengembalikan null bila `budgetAmount` invalid/absen (= tanpa budget,
 * widget menampilkan CTA "Tetapkan anggaran", SRS P3 Acceptance).
 * `terpakai` invalid dianggap 0 agar widget tetap tampil generik.
 */
export function computeBudgetUsage(
  budgetAmount: unknown,
  terpakaiRaw: unknown,
): BudgetUsageView | null {
  const budget = toPositiveNumber(budgetAmount);
  if (budget === null) return null;
  const terpakai = toNonNegativeNumber(terpakaiRaw) ?? 0;
  const sisa = Math.round((budget - terpakai) * 100) / 100;
  const persen = budget > 0 ? terpakai / budget : 0;
  return { budget, terpakai, sisa, persen, status: getBudgetStatus(persen) };
}
