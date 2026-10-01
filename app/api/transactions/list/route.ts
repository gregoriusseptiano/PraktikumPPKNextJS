/**
 * DUITku — Transaction List API (Programmer 2: feature/budget-transactions-ajax)
 *
 * SRS P2-15: GET /api/transactions/list?type=&q=&month= untuk AJAX
 *
 * Keamanan (SRS NFR-02, NFR-03, NFR-04):
 * - 401 generik bila tanpa session valid
 * - user_id diambil dari session, bukan dari client
 * - Semua query difilter per user aktif
 * - Error generik tanpa query/stack/secret
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Transaction, TransactionFilter } from "@/lib/transactions/types";
import { isValidMonth, monthRange } from "@/lib/dashboard/format";

/** Pesan error generik */
const ERROR_MESSAGE = "Gagal memuat transaksi. Coba lagi.";

/**
 * GET /api/transactions/list?type=income|expense|all&q=search&month=YYYY-MM
 *
 * Mengembalikan daftar transaksi milik user dengan filter opsional.
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk melihat transaksi." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawType = searchParams.get("type");
  const rawQ = searchParams.get("q");
  const rawMonth = searchParams.get("month");

  // Validasi type
  const type: TransactionFilter =
    rawType === "income" || rawType === "expense" ? rawType : "all";

  // Validasi month (opsional)
  const month = isValidMonth(rawMonth) ? rawMonth : null;

  try {
    let query = supabase
      .from("transactions")
      .select("*", { count: "exact" })
      .eq("user_id", data.user.id)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    // Filter type
    if (type !== "all") {
      query = query.eq("type", type);
    }

    // Filter month
    if (month) {
      const { start, end } = monthRange(month);
      query = query.gte("transaction_date", start).lte("transaction_date", end);
    }

    // Search (deskripsi atau kategori)
    if (rawQ && rawQ.trim().length > 0) {
      const searchTerm = rawQ.trim();
      query = query.or(`description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
    }

    const { data: transactions, error, count } = await query;

    if (error) {
      console.error("[api/transactions/list] query error:", error.message);
      return NextResponse.json(
        { ok: false, error: ERROR_MESSAGE },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        transactions: (transactions ?? []) as Transaction[],
        total: count ?? 0,
      },
    });
  } catch (err) {
    console.error("[api/transactions/list] failed:", err);
    return NextResponse.json(
      { ok: false, error: ERROR_MESSAGE },
      { status: 500 }
    );
  }
}
