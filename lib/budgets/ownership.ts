/**
 * DUITku — Pertemuan 5, Programmer 3: feature/budget-dashboard-security
 *
 * Predikat isolasi budget (SRS P3-19, FR-28, NFR-02).
 * Fungsi MURNI (tanpa I/O): diuji via `node --test` (SRS P3-21).
 *
 * Guard server `assertBudgetOwnership()` tinggal di
 * `./guard.ts` (butuh Supabase + session, tidak diuji via node).
 * Pola sama seperti dashboard: `summary.ts` murni + `dal.ts` server.
 */

/** Pesan generik untuk semua kegagalan otorisasi budget (P3-20). */
export const BUDGET_AUTH_ERROR_MESSAGE = "Akses budget ditolak.";

/**
 * Predikat kepemilikan murni (pola sama seperti `isOwnedBy` transaksi,
 * SRS P3-09..P3-11): true hanya bila kedua ID string non-kosong sama
 * persis. Dipakai test RLS negative tanpa DB.
 */
export function isBudgetOwnedBy(
  rowUserId: unknown,
  userId: string,
): boolean {
  if (typeof rowUserId !== "string" || rowUserId.length === 0) return false;
  if (typeof userId !== "string" || userId.length === 0) return false;
  return rowUserId === userId;
}
