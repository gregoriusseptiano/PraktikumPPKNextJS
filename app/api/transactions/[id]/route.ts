/**
 * DUITku — Transaction CRUD API (Programmer 2: feature/budget-transactions-ajax)
 *
 * SRS P2-17: AJAX CRUD Transaksi - fetch POST/DELETE + optimistic update + rollback error
 *
 * GET /api/transactions/[id] - Get single transaction
 * PUT /api/transactions/[id] - Update transaction
 * DELETE /api/transactions/[id] - Delete transaction
 *
 * Keamanan (SRS NFR-02, NFR-03, NFR-04):
 * - 401 generik bila tanpa session valid
 * - user_id diambil dari session, bukan dari client
 * - Hanya boleh akses transaksi milik sendiri
 * - Error generik tanpa query/stack/secret
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { TransactionInput } from "@/lib/transactions/types";

const ERROR_MESSAGE = "Gagal memproses transaksi. Coba lagi.";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/transactions/[id]
 * Mengembalikan detail transaksi milik user
 */
export async function GET(request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk melihat transaksi." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const { data: transaction, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (error) {
      console.error("[api/transactions/[id]] GET error:", error.message);
      return NextResponse.json(
        { ok: false, error: ERROR_MESSAGE },
        { status: 500 }
      );
    }

    if (!transaction) {
      return NextResponse.json(
        { ok: false, error: "Transaksi tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: transaction });
  } catch (err) {
    console.error("[api/transactions/[id]] GET failed:", err);
    return NextResponse.json(
      { ok: false, error: ERROR_MESSAGE },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/transactions/[id]
 * Update transaksi milik user
 */
export async function PUT(request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk mengubah transaksi." },
      { status: 401 }
    );
  }

  const { id } = await params;

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

    const input: TransactionInput = {
      type,
      amount: numAmount,
      category: category.trim(),
      description: (description || "").trim(),
      transaction_date,
    };

    const { data: updated, error } = await supabase
      .from("transactions")
      .update(input)
      .eq("id", id)
      .eq("user_id", data.user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[api/transactions/[id]] PUT error:", error.message);
      return NextResponse.json(
        { ok: false, error: ERROR_MESSAGE },
        { status: 500 }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "Transaksi tidak ditemukan atau bukan milikmu." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: { id: updated.id } });
  } catch (err) {
    console.error("[api/transactions/[id]] PUT failed:", err);
    return NextResponse.json(
      { ok: false, error: ERROR_MESSAGE },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/transactions/[id]
 * Hapus transaksi milik user
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: "Login dulu untuk menghapus transaksi." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const { data: deleted, error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", data.user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[api/transactions/[id]] DELETE error:", error.message);
      return NextResponse.json(
        { ok: false, error: ERROR_MESSAGE },
        { status: 500 }
      );
    }

    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Transaksi tidak ditemukan atau bukan milikmu." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: { id: deleted.id } });
  } catch (err) {
    console.error("[api/transactions/[id]] DELETE failed:", err);
    return NextResponse.json(
      { ok: false, error: ERROR_MESSAGE },
      { status: 500 }
    );
  }
}
