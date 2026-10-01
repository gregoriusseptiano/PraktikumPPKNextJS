/**
 * DUITku — Transaction Create API (Programmer 2: feature/budget-transactions-ajax)
 *
 * SRS P2-17: AJAX CRUD Transaksi - fetch POST untuk create
 *
 * POST /api/transactions - Create new transaction
 *
 * Keamanan (SRS NFR-02, NFR-03, NFR-04):
 * - 401 generik bila tanpa session valid
 * - user_id diambil dari session, bukan dari client
 * - Error generik tanpa query/stack/secret
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { TransactionInput } from "@/lib/transactions/types";

const ERROR_MESSAGE = "Gagal menyimpan transaksi. Coba lagi.";

/**
 * POST /api/transactions
 * Buat transaksi baru milik user
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk menambah transaksi." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, amount, category, description, transaction_date } = body;

    // Validasi input
    const fieldErrors: Record<string, string> = {};

    if (type !== "income" && type !== "expense") {
      fieldErrors.type = "Pilih jenis transaksi.";
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      fieldErrors.amount = "Nominal harus lebih dari 0.";
    }

    if (!category || !category.trim()) {
      fieldErrors.category = "Kategori wajib diisi.";
    }

    if (!transaction_date) {
      fieldErrors.transaction_date = "Tanggal wajib diisi.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { ok: false, fieldErrors },
        { status: 400 }
      );
    }

    const input: TransactionInput & { user_id: string } = {
      user_id: data.user.id,
      type,
      amount: numAmount,
      category: category.trim(),
      description: (description || "").trim(),
      transaction_date,
    };

    const { data: created, error } = await supabase
      .from("transactions")
      .insert(input)
      .select("id")
      .single();

    if (error) {
      console.error("[api/transactions] POST error:", error.message);
      return NextResponse.json(
        { ok: false, error: ERROR_MESSAGE },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data: { id: created.id } });
  } catch (err) {
    console.error("[api/transactions] POST failed:", err);
    return NextResponse.json(
      { ok: false, error: ERROR_MESSAGE },
      { status: 500 }
    );
  }
}
