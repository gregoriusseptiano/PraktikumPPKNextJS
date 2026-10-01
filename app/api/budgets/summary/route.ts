/**
 * DUITku — Budget Summary API (Programmer 2: feature/budget-transactions-ajax)
 *
 * SRS P2-15: GET /api/budgets/summary?month= return usage JSON scoped session
 *
 * Keamanan (SRS NFR-02, NFR-03, NFR-04):
 * - 401 generik bila tanpa session valid
 * - user_id diambil dari session, bukan dari client
 * - Error generik tanpa query/stack/secret
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBudgetUsage, isValidBudgetMonth } from "@/lib/budgets/usage";
import { currentMonthKey } from "@/lib/dashboard/format";

/**
 * GET /api/budgets/summary?month=YYYY-MM
 *
 * Mengembalikan BudgetUsage untuk bulan tertentu (default: bulan berjalan).
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk melihat anggaran." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawMonth = searchParams.get("month");

  // Validasi month, fallback ke bulan berjalan
  const month = isValidBudgetMonth(rawMonth) ? rawMonth : currentMonthKey();

  try {
    const usage = await getBudgetUsage(data.user.id, month);
    return NextResponse.json({ ok: true, data: usage });
  } catch (err) {
    console.error("[api/budgets/summary] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat data anggaran. Coba lagi." },
      { status: 500 }
    );
  }
}
