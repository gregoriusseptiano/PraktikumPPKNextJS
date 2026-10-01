/**
 * DUITku — Pertemuan 5, Programmer 3: feature/budget-dashboard-security
 *
 * Guard server isolasi budget (SRS P3-19, FR-28, NFR-02):
 * semua query WAJIB `eq(user_id, session.id)`; PUT/DELETE wajib
 * `assertBudgetOwnership()` agar User A tidak bisa baca/ubah/hapus
 * budget User B via request langsung.
 *
 * Batasan kepemilikan:
 * - Skema/RLS/migrasi milik P1; agregasi milik P2.
 * - File ini hanya guard yang dipakai API milik P1/P2.
 * - Pesan error selalu generik (SRS P3-20, NFR-04).
 */

import { createClient } from "@/lib/supabase/server";
import { isValidMonth } from "@/lib/dashboard/format";
import { isBudgetOwnedBy } from "./ownership";

/**
 * Guard server untuk PUT/DELETE/GET satu bulan (SRS P3-19):
 * true hanya bila session valid DAN baris (user_id, month) milik user.
 * Month invalid, tanpa session, baris asing, atau error DB -> false
 * (tidak menjadi oracle kepemilikan; 404/403 digenerikkan di API).
 */
export async function assertBudgetOwnership(
  month: unknown,
): Promise<boolean> {
  if (!isValidMonth(month)) return false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (typeof userId !== "string" || userId.length === 0) return false;

    const { data: row, error } = await supabase
      .from("budgets")
      .select("user_id")
      .eq("user_id", userId)
      .eq("month", month as string)
      .maybeSingle();

    if (error || !row) return false;
    return isBudgetOwnedBy(
      (row as { user_id?: unknown }).user_id,
      userId,
    );
  } catch (err) {
    // Hanya log server; pemanggil menerima false -> 403/404 generik.
    console.error("[budgets] assertBudgetOwnership failed:", err);
    return false;
  }
}
